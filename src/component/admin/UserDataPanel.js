import PropTypes from "prop-types";
import { useState, useEffect, useRef, Fragment } from "react";
import Swal from "sweetalert2";
import Modal from 'react-modal';
import socketIOClient from "socket.io-client";


function UserDataPanel({ Data, toke, axios }) {
    const [ModalData, setModalData] = useState([])
    const [Accept, setAccept] = useState(false)
    const [DenyReason, setDenyReason] = useState("")
    const [modalOpenDetail, setModalOpenDetail] = useState(false);
    const [modalOpenDetail2, setModalOpenDetail2] = useState(false);
    const [seeMore, setSeeMore] = useState();
    const [deliverState, setDeliverState] = useState();
    const [driverInfo, setDriverInfo] = useState({})
    const socketRef = useRef();

    function Success() {
        Swal.fire(
            'Successfully!',
            '',
            'success'
        ).then(function () {
            window.location.reload();
        })
    }

    function Fail() {
        Swal.fire(
            'Fail!',
            '',
            'error'
        )
    }

    useEffect(() => {
        socketRef.current = socketIOClient.connect("https://eatcom.onrender.com")

        socketRef.current.on('CustomerWantCancel', dataGot => {
            if (dataGot?.data === toke.userId) {
                Success()
            }
        })

        socketRef.current.on('DenyOrderFail', dataGot => {
            if (dataGot?.data === toke.userId) {
                Fail()
            }
        })

        socketRef.current.on('CancelRequestFourSuccess', dataGot => {
            if (dataGot?.data === toke.userId) {
                Success()
            }
        })

        socketRef.current.on('CancelRequestFourFail', dataGot => {
            if (dataGot?.data === toke.userId) {
                Fail()
            }
        })

        return () => {
            socketRef.current.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function doingThing(i) {
        const configuration = {
            method: "post",
            url: "https://eatcom.onrender.com/CheckOrderInLalamove",
            data: { id: i?.transportation.order }
        }
        axios(configuration).then((result) => {
            if (result.data.status === "ASSIGNING_DRIVER") {
                setDeliverState("Finding driver")
            }
            if (result.data.status === "PICKED_UP") {
                setDeliverState("Driver picked items")
                const configuration2 = {
                    method: "post",
                    url: "https://eatcom.onrender.com/CheckDriverInLalamove",
                    data: {
                        id: i?.transportation.order,
                        driverId: result.data.driverId
                    }
                }
                axios(configuration2).then((result2) => {
                    setDriverInfo(result2.data)
                })
            }
            if (result.data.status === "ON_GOING") {
                setDeliverState("Driver is coming")
                const configuration2 = {
                    method: "post",
                    url: "https://eatcom.onrender.com/CheckDriverInLalamove",
                    data: {
                        id: i.transportation.order,
                        driverId: result.data.driverId
                    }
                }
                axios(configuration2).then((result2) => {
                    setDriverInfo(result2.data)
                })
            }
        }).catch((er) => {
            console.log(er);
        })
    }

    useEffect(() => {
        Object.values(Data).map((i) => {
            if (i.status === 5.1) {
                doingThing(i)
                setInterval(() => {
                    doingThing(i)
                }, 60000);
            }
            return null
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Data])

    useEffect(() => {
        const kaw = document.getElementById("clickFy")
        if (kaw) {
            kaw.click()
        }
    }, [toke])

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    const denyOrder = (e, id) => {
        e.preventDefault();
        const data = { id: id, reason: DenyReason, status: 4, type: "CusCancel", userid: toke.userId }
        socketRef.current.emit('DenyOrderSocket', data)
    }

    const CancelRequest = () => {
        const data = { id: ModalData._id, status: 1, userid: toke.userId }
        socketRef.current.emit('CancelRequestFourSocket', data)
    }

    function openCity5(evt, cityName) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabbluh");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tabcclink");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(cityName).style.display = "flex";
        evt.currentTarget.className += " active";
    }

    var inTotal = 0, maxTotal = 0, fulltotal2 = 0, kakaCheck = ""
    if (ModalData.paymentmethod?.status === 1) {
        kakaCheck = "( Unpaid )"
    } else if (ModalData.paymentmethod?.status === 2) {
        kakaCheck = "( Paid )"
    }
    const date = new Date(ModalData.createdAt).toLocaleDateString()
    const time = new Date(ModalData.createdAt).toLocaleTimeString()
    const datetime = date + " - " + time
    const date2 = new Date(ModalData.completeAt).toLocaleDateString()
    const time2 = new Date(ModalData.completeAt).toLocaleTimeString()
    const datetime2 = date2 + " - " + time2
    return (
        <>
            <h6 className="text-center">Your Order</h6>
            <div id="tabs-section px-4">
                <div className="d-flex pb-3 Lunatic" style={{ gap: 1 + "%" }}>
                    <button id="clickFy" onClick={(e) => openCity5(e, 'act')} className="noPlusElf tabcclink">Active</button>
                    <button onClick={(e) => openCity5(e, 'inact')} className="noPlusElf tabcclink">History</button>
                </div>
                <div id="act" className="tabbluh holeInWall" style={{ flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
                    {Object.values(Data).map((i, index) => {
                        let toppingArray = i.orderitems.reduce(function (accumulator, curValue) {
                            return accumulator.concat(curValue.topping)
                        }, [])
                        return (
                            i.status === 1 || i.status === 2 || i.status === 4 || i.status === 2.1 || i.status === 2.3 || i.status === 5.1 ? (
                                <div key={i._id} style={{ marginTop: window.innerWidth <= 991 && index >= 1 ? 20 : null, width: window.innerWidth > 991 ? "47%" : "100%" }}>
                                    {window.innerWidth > 575 ? (
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#4285f4", padding: 15, color: "#fff" }}>
                                            <p className="m-0">Id : {i._id}</p>
                                            <p className="m-0">Date : {new Date(i.createdAt).toLocaleDateString() + " - " + new Date(i.createdAt).toLocaleTimeString()}</p>
                                        </div>
                                    ) : (
                                        <div style={{ background: "#4285f4", padding: 15, color: "#fff" }}>
                                            <p className="m-0">Id : {i._id}</p>
                                            <p className="m-0">Date : {new Date(i.createdAt).toLocaleDateString() + " - " + new Date(i.createdAt).toLocaleTimeString()}</p>
                                        </div>
                                    )}
                                    <div style={{ display: "flex", justifyContent: "space-between", padding: 15, borderWidth: 2, borderStyle: "solid", borderColor: "#4285f4" }}>
                                        <div>
                                            {seeMore === index ? (
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
                                            {i.orderitems?.length > 1 && seeMore !== index ? (
                                                <p onClick={() => setSeeMore(index)} className="seeMoreInOrder">See more</p>
                                            ) : i.orderitems?.length === 1 && toppingArray.length > 1 && seeMore !== index ? (
                                                <p onClick={() => setSeeMore(index)} className="seeMoreInOrder">See more</p>
                                            ) : null}
                                            {seeMore === index ? (
                                                <p onClick={() => setSeeMore(null)} className="seeMoreInOrder">See less</p>
                                            ) : null}
                                        </div>
                                        <div>
                                            {i.status === 5.1 ? (
                                                <p>Status : {deliverState ? deliverState : null}</p>
                                            ) : (
                                                <p>Status : {i.status === 1 ? "🔵( pending )" : i.status === 2 ? "🟢( Chef is preparing )" : i.status === 2.1 ? "🟠( Chef canceled )" : i.status === 2.3 ? "🟢( Order ready )" : i.status === 4 ? "⚪( cancel pending )" : null}</p>
                                            )}
                                            <p>Payment : {i.paymentmethod.method === 1 ? "e-wallet" : i.paymentmethod.method === 2 ? "COD" : null}</p>
                                            <div className="d-flex align-items-center" style={{ gap: 10 }}>
                                                {i.status === 1 && i.paymentmethod?.type !== "Paypal" ? (
                                                    <button onClick={() => setModalOpenDetail2(true)} className="btn btn-danger">Cancel</button>
                                                ) : null}
                                                <button onClick={() => { setModalData(i); setModalOpenDetail(true) }} className="btn btn-warning inforItKK"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" /></svg></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p style={{ margin: "0 auto" }}>Your active order is empty!</p>
                            )
                        )
                    })}
                </div>
                <div id="inact" className="tabbluh holeInWall" style={{ flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
                    {Object.values(Data).map((i, index) => {
                        let toppingArray = i.orderitems.reduce(function (accumulator, curValue) {
                            return accumulator.concat(curValue.topping)
                        }, [])
                        return (
                            i.status === 3 || i.status === 5 || i.status === 6 ? (
                                <div key={i._id} style={{ marginTop: window.innerWidth <= 991 && index >= 1 ? 20 : null, width: window.innerWidth > 991 ? "47%" : "100%" }}>
                                    {window.innerWidth > 575 ? (
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#4285f4", padding: 15, color: "#fff" }}>
                                            <p className="m-0">Id : {i._id}</p>
                                            <p className="m-0">Date : {new Date(i.createdAt).toLocaleDateString() + " - " + new Date(i.createdAt).toLocaleTimeString()}</p>
                                        </div>
                                    ) : (
                                        <div style={{ background: "#4285f4", padding: 15, color: "#fff" }}>
                                            <p className="m-0">Id : {i._id}</p>
                                            <p className="m-0">Date : {new Date(i.createdAt).toLocaleDateString() + " - " + new Date(i.createdAt).toLocaleTimeString()}</p>
                                        </div>
                                    )}
                                    <div style={{ display: "flex", justifyContent: "space-between", padding: 15, borderWidth: 2, borderStyle: "solid", borderColor: "#4285f4" }}>
                                        <div>
                                            {seeMore === index ? (
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
                                            {i.orderitems?.length > 1 && seeMore !== index ? (
                                                <p onClick={() => setSeeMore(index)} className="seeMoreInOrder">See more</p>
                                            ) : i.orderitems?.length === 1 && toppingArray.length > 1 && seeMore !== index ? (
                                                <p onClick={() => setSeeMore(index)} className="seeMoreInOrder">See more</p>
                                            ) : null}
                                            {seeMore === index ? (
                                                <p onClick={() => setSeeMore(null)} className="seeMoreInOrder">See less</p>
                                            ) : null}
                                        </div>
                                        <div>
                                            <p>Status : {i.status === 3 ? "🔴( denied )" : i.status === 5 ? "🟡( completed )" : i.status === 6 ? "🟠( canceled )" : null}</p>
                                            <p>Payment : {i.paymentmethod.method === 1 ? "e-wallet" : i.paymentmethod.method === 2 ? "COD" : null}</p>
                                            <button onClick={() => { setModalData(i); setModalOpenDetail(true) }} className="btn btn-warning inforItKK"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" /></svg></button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p style={{ margin: "0 auto" }}>Your order history is empty!</p>
                            )
                        )
                    })}
                </div>
            </div>
            <Modal isOpen={modalOpenDetail2} onRequestClose={() => setModalOpenDetail2(false)} ariaHideApp={false}
                style={{
                    overlay: {
                        backgroundColor: 'rgb(33 33 33 / 75%)',
                        position: 'fixed',
                        zIndex: 998,
                    },
                    content: {
                        top: "50%",
                        left: "50%",
                        right: "auto",
                        bottom: "auto",
                        marginRight: "-50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "white",
                        width: window.innerWidth > 991 ? "30vw" : "90vw",
                        height: "auto",
                        overflow: "hidden",
                        zIndex: 999
                    },
                }}>
                <div className="pt-3">
                    <p>Reason why cancel : </p>
                    <form onSubmit={(e) => denyOrder(e, ModalData._id)}>
                        <textarea value={DenyReason} onChange={(e) => setDenyReason(e.target.value)} className="textDeny" required />
                        <div style={{ gap: 1 + "%" }} className="humble mt-2">
                            <button type="submit" className="btn btn-primary ">Comfirm</button>
                            <button type="button" onClick={() => setModalOpenDetail2(false)} className="btn btn-secondary ">Cancel</button>
                        </div>
                    </form>
                </div>
                <button className='closeModal' onClick={() => setModalOpenDetail2(false)}>x</button>
            </Modal>
            <Modal isOpen={modalOpenDetail} onRequestClose={() => setModalOpenDetail(false)} ariaHideApp={false}
                style={{
                    overlay: {
                        backgroundColor: 'rgb(33 33 33 / 75%)',
                        position: 'fixed',
                        zIndex: 998,
                    },
                    content: {
                        top: "50%",
                        left: "50%",
                        right: "auto",
                        bottom: "auto",
                        marginRight: "-50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "white",
                        width: window.innerWidth > 991 ? "30vw" : "90vw",
                        height: "auto",
                        overflow: "hidden",
                        zIndex: 999
                    },
                }}>
                <h2 className='text-center'>Order Detail</h2>
                <div className="coverNOut">
                    <p className="m-0"><b>Id</b> : {ModalData._id}</p>
                    <p className="m-0"><b>Date</b> : {datetime}</p>
                </div>
                <hr />
                <div className="hugeImpace">
                    {ModalData.user?.map((t) => {
                        var textSp = "( visisting guests )"
                        return (
                            <div className="coverNOut" key={t}>
                                {t.id === "none" ? (
                                    <p><b>Fullname</b> : {t.fullname} {textSp}</p>
                                ) : (
                                    <p><b>Fullname</b> : {t.fullname}</p>
                                )}
                                {ModalData.employee?.map((o) => {
                                    return (
                                        <>
                                            {ModalData.status !== 1 ? (
                                                <p><b>Employee</b> : {o.email}</p>
                                            ) : null}
                                        </>
                                    )
                                })}
                            </div>
                        )
                    })}
                    <div className="coverNOut">
                        <p><b>Phone number</b> : {ModalData.phonenumber}</p>
                        <p><b>Address</b> : {ModalData.address}</p>
                    </div>
                    <p><b>Payment method</b> : {ModalData.paymentmethod?.type} {kakaCheck}</p>
                </div>
                <table className="table-bordered table solotable">
                    <thead>
                        <tr style={{ color: "#0F172B", backgroundColor: "gray" }}>
                            <th style={{ textAlign: "center", color: "#fff" }}>{window.innerWidth > 575 ? "No" : "Quantity"}</th>
                            <th colSpan={window.innerWidth > 575 ? null : 2} style={{ color: "#fff" }}>Items</th>
                            {window.innerWidth > 575 ? (
                                <>
                                    <th style={{ textAlign: "center", color: "#fff" }}>Quantity</th>
                                    <th style={{ textAlign: "center", color: "#fff" }}>Price</th>
                                </>
                            ) : null}
                        </tr>
                    </thead>
                    <tbody>
                        {ModalData.orderitems?.map((a, indexK) => {
                            var countTotal2 = 0
                            inTotal = a.topping?.reduce((acc, o) => acc + parseInt(o.foodprice), 0)
                            if (inTotal) {
                                countTotal2 = (inTotal + a.data.foodprice) * a.quantity
                            } else {
                                countTotal2 = a.data.foodprice * a.quantity
                            }
                            maxTotal += countTotal2
                            fulltotal2 = maxTotal + ModalData.shippingfee
                            return (
                                <tr key={a.data._id} style={{ verticalAlign: "middle" }}>
                                    <td className='text-center'>{window.innerWidth > 575 ? indexK + 1 : a.quantity + " x "}</td>
                                    <td colSpan={window.innerWidth > 575 ? null : 2}>
                                        <div className="d-flex align-items-center" style={{ gap: 10 }}>
                                            <img alt="" src={a.data.foodimage} width={70} height={60} />
                                            <div>
                                                <p className="m-0">{a.data.foodname}</p>
                                                <p className="m-0 text-start" style={{ fontSize: 14, color: "#FEA116" }}><b>{VND.format(a.data.foodprice)}</b></p>
                                            </div>
                                        </div>
                                        {a.topping?.map((p) => {
                                            return (
                                                <div key={p._id} className="d-flex align-items-center" style={{ gap: 10, marginLeft: 25, marginTop: 10 }}>
                                                    <img alt="" src={p.foodimage} width={45} height={40} />
                                                    <div>
                                                        <p className="m-0" style={{ fontSize: 14 }}>{p.foodname}</p>
                                                        <p className="m-0 text-start" style={{ color: "#FEA116", fontSize: 12 }}><b>{VND.format(p.foodprice)}</b></p>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </td>
                                    {window.innerWidth > 575 ? (
                                        <>
                                            <td className='text-center'>{a.quantity}</td>
                                            <td className='text-center'>{VND.format(countTotal2)}</td>
                                        </>
                                    ) : null}
                                </tr>
                            )
                        })}
                        <tr className="text-center text-nowrap">
                            <td colSpan={window.innerWidth > 575 ? 3 : 2}><b>Shipping</b></td>
                            <td >{VND.format(ModalData.shippingfee)}</td>
                        </tr>
                        <tr className="text-center text-nowrap">
                            <td colSpan={window.innerWidth > 575 ? 3 : 2}><b>Fulltotal</b></td>
                            <td style={{ color: "#FEA116" }}><b>{VND.format(fulltotal2)}</b></td>
                        </tr>
                    </tbody>
                </table>
                {ModalData.status === 1 && ModalData.paymentmethod?.type !== "Paypal" ? (
                    <>
                        <button onClick={() => setAccept(true)} className="btn btn-danger">Cancel</button>
                        {Accept ? (
                            <div className="pt-3">
                                <p>Reason why cancel : </p>
                                <form onSubmit={(e) => denyOrder(e, ModalData._id)}>
                                    <textarea value={DenyReason} onChange={(e) => setDenyReason(e.target.value)} className="textDeny" required />
                                    <div style={{ gap: 1 + "%" }} className="humble mt-2">
                                        <button type="submit" className="btn btn-primary ">Comfirm</button>
                                        <button type="button" onClick={() => setAccept(false)} className="btn btn-secondary ">Cancel</button>
                                    </div>
                                </form>
                            </div>
                        ) : null}
                    </>
                ) : null}
                <div className="pt-2">
                    {ModalData.status === 2 || ModalData.status === 2.1 ? (
                        <p>✅ Order has been <b>Approve</b></p>
                    ) : ModalData.status === 2.3 ? (
                        <p>✅ Order is ready to <b>Shipping</b></p>
                    ) : ModalData.status === 3 ? (
                        <>
                            <p>❌ Order has been <b>Denied</b></p>
                            <p>Reason : {ModalData.denyreason}</p>
                        </>
                    ) : ModalData.status === 4 ? (
                        <>
                            <div className="d-flex justify-content-between">
                                <p>🕒 Order is waiting to <b>Cancel</b></p>
                                <button onClick={() => CancelRequest()} className="btn btn-primary">Cancel request</button>
                            </div>
                            <p>Reason : {ModalData.denyreason}</p>
                        </>
                    ) : ModalData.status === 5 ? (
                        <p>⭐ Order has been <b>Completed</b> at {datetime2}</p>
                    ) : ModalData.status === 6 ? (
                        <>
                            <p>❌ Order has been <b>Canceled</b></p>
                            <p>Reason : {ModalData.denyreason}</p>
                        </>
                    ) : ModalData.status === 5.1 ? (
                        <>
                            <p>🕒 Driver is coming to picked up items</p>
                            <div className="d-flex justify-content-between align-items-center">
                                <p>Name: {driverInfo?.name}</p>
                                <p>Phone: {driverInfo?.phone}</p>
                            </div>
                            <p>Plate: {driverInfo?.plateNumber}</p>
                            <div className="d-flex justify-content-center my-4">
                                <div className="xvRange">
                                    <div style={{ left: deliverState === "Driver is coming" ? "22.5%" : deliverState === "Driver picked items" ? "65.5%" : null }} className="sonXvRange"><span>🚴</span><p>{deliverState}</p></div>
                                    <div style={{ width: deliverState === "Driver is coming" ? "27%" : deliverState === "Driver picked items" ? "70%" : null }} className="sonXvRange2"></div>
                                </div>
                            </div>
                        </>
                    ) : null}
                </div>
                <button className='closeModal' onClick={() => setModalOpenDetail(false)}>x</button>
            </Modal>
        </>
    )
}
UserDataPanel.propTypes = {
    Data: PropTypes.array.isRequired
};
export default UserDataPanel