import Modal from 'react-modal';
import CancelByMag from '../admin/CancelByMag';
import CancelRequest from '../admin/CancelRequest';
import axios from "axios";
import { useEffect } from 'react';

function OrderDisplayHandle({ i, datetime, father, setFather, index, decode, socketRef, setModalOpenDetail2, toppingArray, fulltotal, checkBack }) {
    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    const deliverEmployee = { id: decode.userId, email: decode.userEmail }
    const appoveOrder = (e, yolo) => {
        const data = { id: e, userid: i?.user[0].id, status: 2, employee: deliverEmployee, orderitems: yolo, empid: decode.userId }
        socketRef.current.emit('UpdateStatusOrderSocket', data)
    }
    const denyOrderWait = (id) => {
        const data = { id: id, userid: i?.user[0].id, employee: deliverEmployee, status: 6, empid: decode.userId }
        socketRef.current.emit('DenyOrderWaitingSocket', data)
    }
    const denyOrder = (e, id) => {
        e.preventDefault();
        const data = { id: id, userid: i?.user[0].id, reason: father.DenyReason, employee: deliverEmployee, status: 3, type: "Normal", empid: decode.userId }
        socketRef.current.emit('DenyOrderSocket', data)
    }

    const denyOrderPaid = (e, id, Fu) => {
        e.preventDefault();
        const data = { id: id, userid: i?.user[0].id, reason: father.DenyReason, employee: deliverEmployee, status: 3, type: "Paid", fulltotal: Fu, date: i.createdAt, empid: decode.userId }
        socketRef.current.emit('DenyOrderSocket', data)
    }

    const cancelOrder = (e, id) => {
        e.preventDefault()
        const data = { id: id, kitchenreason: father.kitchenreason, mag: decode.userId, status: 2 }
        socketRef.current.emit('ChefWantCancelSocket', data)
    }

    const shippingOrder = (id, address, phonenumber, name) => {
        setFather({ changeMerge: id })
        const data = { id: id, mag: decode.userId, address: address, phonenumber: phonenumber, name: name, user: i.user[0].id }
        socketRef.current.emit('ShippingReadySocket', data)
    }

    function doingThing() {
        const configuration = {
            method: "post",
            url: "https://eatcom.onrender.com/CheckOrderInLalamove",
            data: { id: i.transportation.order }
        }
        axios(configuration).then((result) => {
            if (result.data.status === "EXPIRED") {
                const data = { id: i._id, user: i.user[0].id }
                socketRef.current.emit('ExpiredOrderSocket', data)
            }
            if (result.data.status === "COMPLETED") {
                const data = { id: i._id, userid: i?.user[0].id, date: Date.now('vi'), status: 5, empid: decode.userId }
                socketRef.current.emit('CompleteOrderByEmpSocket', data)
            }
            if (result.data.status === "ASSIGNING_DRIVER") {
                setFather({ deliverState: "Finding driver" })
            }
            if (result.data.status === "PICKED_UP") {
                setFather({ deliverState: "Driver picked items" })
                const configuration2 = {
                    method: "post",
                    url: "https://eatcom.onrender.com/CheckDriverInLalamove",
                    data: {
                        id: i.transportation.order,
                        driverId: result.data.driverId
                    }
                }
                axios(configuration2).then((result2) => {
                    setFather({ driverInfo: result2.data })
                })
            }
            if (result.data.status === "ON_GOING") {
                setFather({ deliverState: "Driver is coming" })
                const configuration2 = {
                    method: "post",
                    url: "https://eatcom.onrender.com/CheckDriverInLalamove",
                    data: {
                        id: i.transportation.order,
                        driverId: result.data.driverId
                    }
                }
                axios(configuration2).then((result2) => {
                    setFather({ driverInfo: result2.data })
                })
            }
            if (result.data.status === "CANCELED") {
                const data = { id: i._id, reason: "Driver canceled this order", user: i.user[0].id }
                socketRef.current.emit('CancelOrderTransSocket', data)
            }
            if (result.data.status === "REJECTED") {
                const data = { id: i._id, reason: "Driver rejected this order", user: i.user[0].id }
                socketRef.current.emit('CancelOrderTransSocket', data)
            }
        }).catch((er) => {
            console.log(er);
        })
    }

    useEffect(() => {
        if (i.status === 5.1) {
            doingThing()
            setInterval(() => {
                doingThing()
            }, 60000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [i.status])

    return (
        <div style={{ opacity: checkBack || father.changeMerge === i._id ? 0.5 : 1, pointerEvents: checkBack || father.changeMerge === i._id ? "none" : null, marginTop: window.innerWidth > 991 && index > 1 ? 30 : window.innerWidth <= 991 && index >= 1 ? 30 : null, width: window.innerWidth > 991 ? "47%" : "100%", position: "relative" }}>
            {father.changeMerge === i._id ? (
                <div id="spinner" className="show position-absolute translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
                    <div className="spinner-border text-primary" style={{ width: 3 + "rem", height: 3 + "rem" }} role="status">
                        <span className="sr-only"></span>
                    </div>
                </div>
            ) : null}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#374148", color: "#fff", padding: 15 }}>
                <p className="m-0">Id : {i._id}</p>
                <p className="m-0">Date : {datetime}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", background: "#2C343A", color: "lightgray", padding: 15 }}>
                <div>
                    {father?.seeMore === index ? (
                        i.orderitems.map((a, indexS) => {
                            return (
                                <div key={indexS} style={{ marginTop: indexS > 0 ? 20 : null }}>
                                    <div className="d-flex align-items-center" style={{ gap: 10 }}>
                                        <img alt="" src={a.data.foodimage} width={70} height={60} />
                                        <div>
                                            <p className="m-0" style={{ fontSize: 17 }}>{a.data.foodname}</p>
                                            <p className="m-0 text-start" style={{ fontSize: 15, color: "#FEA116" }}><b>{VND.format(a.data.foodprice)}</b></p>
                                        </div>
                                    </div>
                                    {a.topping ? (
                                        a.topping.map((p) => {
                                            return (
                                                <div key={p._id} className="d-flex align-items-center" style={{ gap: 10, marginLeft: 25, marginTop: 10 }}>
                                                    <img alt="" src={p.foodimage} width={45} height={40} />
                                                    <div>
                                                        <p className="m-0" style={{ fontSize: 15 }}>{p.foodname}</p>
                                                        <p className="m-0 text-start" style={{ color: "#FEA116", fontSize: 13 }}><b>{VND.format(p.foodprice)}</b></p>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    ) : null}
                                </div>
                            )
                        })
                    ) : (
                        <div>
                            <div className="d-flex align-items-center" style={{ gap: 10 }}>
                                <img alt="" src={i.orderitems[0]?.data.foodimage} width={70} height={60} />
                                <div>
                                    <p className="m-0" style={{ fontSize: 17 }}>{i.orderitems[0].data.foodname}</p>
                                    <p className="m-0 text-start" style={{ fontSize: 15, color: "#FEA116" }}><b>{VND.format(i.orderitems[0]?.data.foodprice)}</b></p>
                                </div>
                            </div>
                            {i?.orderitems[0]?.topping[0] ? (
                                <div className="d-flex align-items-center" style={{ gap: 10, marginLeft: 25, marginTop: 10 }}>
                                    <img alt="" src={i?.orderitems[0]?.topping[0]?.foodimage} width={45} height={40} />
                                    <div>
                                        <p className="m-0" style={{ fontSize: 15 }}>{i.orderitems[0]?.topping[0]?.foodname}</p>
                                        <p className="m-0 text-start" style={{ color: "#FEA116", fontSize: 13 }}><b>{VND.format(i.orderitems[0]?.topping[0]?.foodprice)}</b></p>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    )}
                    {i.orderitems?.length > 1 && father?.seeMore !== index ? (
                        <p onClick={() => setFather({ seeMore: index })} className="seeMoreInOrder">See more</p>
                    ) : i.orderitems?.length === 1 && toppingArray.length > 1 && father?.seeMore !== index ? (
                        <p onClick={() => setFather({ seeMore: index })} className="seeMoreInOrder">See more</p>
                    ) : null}
                    {father?.seeMore === index ? (
                        <p onClick={() => setFather({ seeMore: null })} className="seeMoreInOrder">See less</p>
                    ) : null}
                </div>
                <div>
                    {i.status === 5.1 ? (
                        <p>Status : {father?.deliverState}</p>
                    ) : (
                        <p>Status : {i.status === 1 ? "🔵( pending )" : i.status === 2 ? "🟢( Chef is preparing )" : i.status === 2.1 ? "🟠( Chef canceled )" : i.status === 2.3 ? "🟢( Order ready )" : i.status === 4 ? "⚪( cancel pending )" : null}</p>
                    )}
                    <p>Payment : {i.paymentmethod.method === 1 ? "e-wallet" : i.paymentmethod.method === 2 ? "COD" : null}</p>
                    {i.status === 5.1 ? (
                        <button onClick={() => { setModalOpenDetail2(true); setFather({ ModalData: i }) }} className="btn btn-warning inforItKK"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" /></svg></button>
                    ) : null}
                    {i.status === 1 ? (
                        <div className="d-flex align-items-center" style={{ gap: 10 }}>
                            {father.Accept ? (
                                <button style={{ pointerEvents: "none", opacity: 0.4 }} className="btn btn-success">Accept</button>
                            ) : (
                                <button onClick={() => appoveOrder(i._id, i.orderitems)} className="btn btn-success">Accept</button>
                            )}
                            {decode.userRole === 3 && (i.paymentmethod.type === "Vnpay" || i.paymentmethod.type === "COD") ? (
                                <button onClick={() => setFather({ secondDoor: true, secondDoorState: 1 })} className="btn btn-danger">Deny</button>
                            ) : null}
                            <button onClick={() => { setModalOpenDetail2(true); setFather({ ModalData: i }) }} className="btn btn-warning inforItKK"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" /></svg></button>
                        </div>
                    ) : null}
                    {i.status === 2 ? (
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                            {decode.userRole === 3 && i.paymentmethod?.type !== "Paypal" ? (
                                <button onClick={() => setFather({ secondDoor: true, secondDoorState: 2 })} className="btn btn-danger">Cancel</button>
                            ) : null}
                            <button onClick={() => { setModalOpenDetail2(true); setFather({ ModalData: i }) }} className="btn btn-warning inforItKK"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" /></svg></button>
                        </div>
                    ) : null}
                    {i.status === 2.1 ? (
                        <>
                            {i.kitchenreason ? (
                                <p>Note : {i.kitchenreason}</p>
                            ) : null}
                            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                                <button onClick={() => setFather({ secondDoor: true, secondDoorState: 6 })} className="btn btn-info">to chef</button>
                                {decode.userRole === 3 && (i.paymentmethod.type === "Vnpay" || i.paymentmethod.type === "COD") ? (
                                    <button onClick={() => setFather({ secondDoor: true, secondDoorState: 1 })} className="btn btn-danger">Deny</button>
                                ) : null}
                                <button onClick={() => { setModalOpenDetail2(true); setFather({ ModalData: i }) }} className="btn btn-warning inforItKK"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" /></svg></button>
                            </div>
                        </>
                    ) : null}
                    {i.status === 2.3 ? (
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                            <button onClick={() => shippingOrder(i._id, i.address, i.phonenumber, i.user[0].fullname)} className="btn btn-success">Shipping</button>
                            <button onClick={() => { setModalOpenDetail2(true); setFather({ ModalData: i }) }} className="btn btn-warning inforItKK"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" /></svg></button>
                        </div>
                    ) : null}
                    {i.status === 4 ? (
                        <>
                            <p>Reason : {i.denyreason}</p>
                            <div className="d-flex justify-content-between">
                                {decode.userRole === 3 && i.paymentmethod?.type === "Vnpay" ? (
                                    <button onClick={() => setFather({ secondDoor: true, secondDoorState: 3 })} className="btn btn-danger">Cancel</button>
                                ) : null}
                                {decode.userRole === 3 && i.paymentmethod?.type === "COD" ? (
                                    <button onClick={() => setFather({ secondDoor: true, secondDoorState: 4 })} className="btn btn-danger">Cancel</button>
                                ) : null}
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
            <Modal isOpen={father.secondDoor} onRequestClose={() => setFather({ secondDoor: false })} ariaHideApp={false}
                style={{
                    overlay: {
                        position: 'fixed',
                        zIndex: 998,
                        backgroundColor: 'rgb(33 33 33 / 75%)'
                    },
                    content: {
                        top: "50%",
                        left: "50%",
                        right: "auto",
                        bottom: "auto",
                        marginRight: "-50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "white",
                        width: window.innerWidth > 575 ? "30vw" : "90vw",
                        height: father.secondDoorState === 1 ? "38vh" : father.secondDoorState === 6 ? "38vh" : "25vh",
                        zIndex: 999
                    },
                }}>
                <div className="p-3">
                    {father.secondDoorState === 1 ? (
                        <>
                            <p>Reason why deny : </p>
                            {i.paymentmethod.status === 2 && i.paymentmethod.type === "Vnpay" ? (
                                <form onSubmit={(e) => denyOrderPaid(e, i._id, fulltotal)}>
                                    <textarea style={{ height: 165, resize: "none" }} value={father.DenyReason} onChange={(e) => setFather({ DenyReason: e.target.value })} className="textDeny" required />
                                    <div style={{ gap: 1 + "%" }} className="d-flex mt-2">
                                        <button type="submit" className="btn btn-primary ">Comfirm</button>
                                        <button onClick={() => setFather({ secondDoor: false })} className="btn btn-secondary ">Cancel</button>
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={(e) => denyOrder(e, i._id)}>
                                    <textarea style={{ height: 165, resize: "none" }} value={father.DenyReason} onChange={(e) => setFather({ DenyReason: e.target.value })} className="textDeny" required />
                                    <div style={{ gap: 1 + "%" }} className="d-flex mt-2">
                                        <button type="submit" className="btn btn-primary ">Comfirm</button>
                                        <button onClick={() => setFather({ secondDoor: false })} className="btn btn-secondary ">Cancel</button>
                                    </div>
                                </form>
                            )}
                        </>
                    ) : father.secondDoorState === 2 ? (
                        <CancelByMag fulltotal={fulltotal} ModalData={father.ModalData} setmodal={setFather} />
                    ) : father.secondDoorState === 4 ? (
                        <div className="pt-3">
                            <h5 className="text-center pb-2">Are you sure ?</h5>
                            <div className="d-flex justify-content-evenly align-items-center">
                                <button className="btn btn-primary" onClick={() => denyOrderWait(i._id)}>Yes</button>
                                <button className="btn btn-secondary" onClick={() => setFather({ secondDoor: false })}>No</button>
                            </div>
                        </div>
                    ) : father.secondDoorState === 3 ? (
                        <CancelRequest fulltotal={fulltotal} ModalData={father.ModalData} setmodal={setFather} />
                    ) : father.secondDoorState === 6 ? (
                        <>
                            <p>Give chef reason : </p>
                            <form onSubmit={(e) => cancelOrder(e, i._id)}>
                                <textarea style={{ height: 165, resize: "none" }} value={father.kitchenreason} onChange={(e) => setFather({ kitchenreason: e.target.value })} className="textDeny" required />
                                <div style={{ gap: 1 + "%" }} className="d-flex mt-2">
                                    <button type="submit" className="btn btn-primary ">Comfirm</button>
                                    <button onClick={() => setFather({ secondDoor: false })} className="btn btn-secondary ">Cancel</button>
                                </div>
                            </form>
                        </>
                    ) : null}
                </div>
                <button className='closeModal' onClick={() => setFather({ secondDoor: false })}>x</button>
            </Modal>
        </div>
    )
}
export default OrderDisplayHandle