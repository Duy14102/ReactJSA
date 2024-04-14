import axios from "axios";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";
import { Fragment, useEffect, useRef, useReducer } from "react";
import { useState } from "react";
import Modal from 'react-modal';
import Swal from "sweetalert2";
import Cookies from "universal-cookie";
import CancelByMag from "../admin/CancelByMag";
import CancelRequest from "../admin/CancelRequest";
import socketIOClient from "socket.io-client";
import OrderDisplayHandle from "./OrderDisplayHandle";

function OrderAdmin({ Data, checkBack }) {
    const cookies = new Cookies()
    const token = cookies.get("TOKEN")
    const decode = jwtDecode(token)
    const deliverEmployee = { id: decode.userId, email: decode.userEmail }
    const [orderAdminState, setOrderAdminState] = useReducer((prev, next) => ({
        ...prev, ...next
    }), {
        Accept: false,
        DenyReason: "",
        ModalData: [],
        spinner: false,
        modalOpenDetail3: false,
        kitchenreason: null,
        modalOpenDetail4: false,
        secondDoor: false,
        secondDoorState: null,
        deliverState: null,
        driverInfo: {},
        seeMore: null,
        changeMerge: null,
        changeMerge2: null,
        reject: false,
    })
    const socketRef = useRef();

    var [modalOpenDetail2, setModalOpenDetail2] = useState(false);
    useEffect(() => {
        if (orderAdminState.modalOpenDetail2 === false) {
            setOrderAdminState({ Accept: false })
        }
    }, [orderAdminState.modalOpenDetail2])

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

        socketRef.current.on('UpdateStatusOrderSuccess', dataGot => {
            if (dataGot?.emp === decode.userId) {
                Success()
            }
        })

        socketRef.current.on('UpdateStatusOrderFail', dataGot => {
            if (dataGot?.emp === decode.userId) {
                Fail()
            }
        })

        socketRef.current.on('CompleteOrderSuccess', dataGot => {
            if (dataGot?.emp === decode.userId) {
                Success()
            }
        })

        socketRef.current.on('CompleteOrderFail', dataGot => {
            if (dataGot?.emp === decode.userId) {
                Fail()
            }
        })

        socketRef.current.on('DenyOrderNormalSuccess', dataGot => {
            if (dataGot?.emp === decode.userId) {
                Success()
            }
        })

        socketRef.current.on('DenyOrderPaidSuccess', dataGot => {
            if (dataGot?.emp === decode.userId) {
                denyOrderKun(dataGot.id, dataGot.date, dataGot.fulltotal, dataGot.reason)
            }
        })

        socketRef.current.on('DenyOrderWaitingSuccess', dataGot => {
            if (dataGot?.emp === decode.userId) {
                Success()
            }
        })

        socketRef.current.on('DenyOrderWaitingFail', dataGot => {
            if (dataGot?.emp === decode.userId) {
                Fail()
            }
        })

        socketRef.current.on('ShippingReadySuccess', dataGot => {
            setOrderAdminState({ changeMerge: null, changeMerge2: null })
        })

        return () => {
            socketRef.current.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    var kakaCheck = ""
    if (orderAdminState.ModalData.paymentmethod?.status === 1) {
        kakaCheck = "( Unpaid )"
    } else if (orderAdminState.ModalData.paymentmethod?.status === 2) {
        kakaCheck = "( Paid )"
    }
    const date = new Date(orderAdminState.ModalData.createdAt).toLocaleDateString()
    const time = new Date(orderAdminState.ModalData.createdAt).toLocaleTimeString()
    const datemodal = date + " - " + time

    const appoveOrder = (e, yolo) => {
        const data = { id: e, userid: orderAdminState.ModalData?.user[0].id, status: 2, employee: deliverEmployee, orderitems: yolo, empid: decode.userId }
        socketRef.current.emit('UpdateStatusOrderSocket', data)
    }

    const denyOrderKun = (id, date, amount, reason) => {
        const configuration = {
            method: "post",
            url: "https://eatcom.onrender.com/VnpayRefund",
            data: {
                orderId: id,
                transDate: date,
                amount: amount,
                transType: "03",
                user: "Manager",
                reason: reason
            }
        }
        setOrderAdminState({ spinner: true })
        axios(configuration).then(() => {
            setOrderAdminState({ spinner: false })
            Success()
        }).catch(() => {
            Fail()
        })
    }

    const denyOrder = (e, id) => {
        e.preventDefault();
        const data = { id: id, userid: orderAdminState.ModalData?.user[0].id, reason: orderAdminState.DenyReason, employee: deliverEmployee, status: 3, type: "Normal", empid: decode.userId }
        socketRef.current.emit('DenyOrderSocket', data)
    }

    const denyOrderWait = (id) => {
        const data = { id: id, userid: orderAdminState.ModalData?.user[0].id, employee: deliverEmployee, status: 6, empid: decode.userId }
        socketRef.current.emit('DenyOrderWaitingSocket', data)
    }

    const denyOrderPaid = (e, id, Fu) => {
        e.preventDefault();
        const data = { id: id, userid: orderAdminState.ModalData?.user[0].id, reason: orderAdminState.DenyReason, employee: deliverEmployee, status: 3, type: "Paid", fulltotal: Fu, date: orderAdminState.ModalData.createdAt, empid: decode.userId }
        socketRef.current.emit('DenyOrderSocket', data)
    }

    const shippingOrder = (id, address, phonenumber, name) => {
        setOrderAdminState({ changeMerge2: id })
        const data = { id: id, mag: decode.userId, address: address, phonenumber: phonenumber, name: name }
        socketRef.current.emit('ShippingReadySocket', data)
    }

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    var fulltotal = 0, inTotal = 0, enTotal = 0, countTotal = 0, fulltotal2 = 0, maxTotal = 0
    return (
        <>
            {checkBack ? (
                <div id="spinner" className="show position-fixed translate-middle w-100 vh-100 top-30 start-50 d-flex align-items-center justify-content-center">
                    <div className="spinner-border text-primary" style={{ width: 3 + "rem", height: 3 + "rem" }} role="status">
                        <span className="sr-only"></span>
                    </div>
                </div>
            ) : null}
            {Data.map((i, index) => {
                const date = new Date(i.createdAt).toLocaleDateString()
                const time = new Date(i.createdAt).toLocaleTimeString()
                const datetime = date + " - " + time
                enTotal = i.orderitems.reduce((acc, o) => acc + parseInt(o.data.foodprice), 0)
                let quantityArray = i.orderitems.reduce(function (accumulator, curValue) {
                    return curValue.quantity
                }, [])
                let toppingArray = i.orderitems.reduce(function (accumulator, curValue) {
                    return accumulator.concat(curValue.topping)
                }, [])
                if (toppingArray) {
                    inTotal = toppingArray.reduce((acc, o) => acc + parseInt(o?.foodprice), 0)
                    countTotal = (inTotal + enTotal) * parseInt(quantityArray)
                } else {
                    countTotal = enTotal * parseInt(quantityArray)
                }
                fulltotal = countTotal + i.shippingfee
                return (
                    <Fragment key={index}>
                        <OrderDisplayHandle i={i} datetime={datetime} father={orderAdminState} setFather={setOrderAdminState} index={index} decode={decode} socketRef={socketRef} setModalOpenDetail2={setModalOpenDetail2} toppingArray={toppingArray} fulltotal={fulltotal} checkBack={checkBack} />
                    </Fragment>
                )
            })}
            <Modal id="otpModal" isOpen={modalOpenDetail2} onRequestClose={() => setModalOpenDetail2(false)} ariaHideApp={false}
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
                        width: window.innerWidth > 991 ? "40vw" : "80vw",
                        height: "auto",
                        zIndex: 999
                    },
                }}>
                {orderAdminState.spinner || orderAdminState.changeMerge2 === orderAdminState.ModalData._id ? (
                    <div style={{ background: "rgba(255, 255, 255, 0.6)" }} id="spinner" className="show position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
                        <div className="spinner-border text-primary" style={{ width: 3 + "rem", height: 3 + "rem" }} role="status">
                            <span className="sr-only"></span>
                        </div>
                    </div>
                ) : null}
                <h2 className='text-center'>Order Detail</h2>
                <div className="coverNOut">
                    <p className="m-0"><b>Id</b> : {orderAdminState.ModalData._id}</p>
                    <p className="m-0"><b>Date</b> : {datemodal}</p>
                </div>
                <hr />
                <div className="hugeImpace">
                    {orderAdminState.ModalData.user?.map((t) => {
                        var textSp = "( visisting guests )"
                        return (
                            <div className="coverNOut" key={t}>
                                {t.id === "none" ? (
                                    <p><b>Fullname</b> : {t.fullname} {textSp}</p>
                                ) : (
                                    <p><b>Fullname</b> : {t.fullname}</p>
                                )}
                                {orderAdminState.ModalData.employee?.map((o) => {
                                    return (
                                        <>
                                            {orderAdminState.ModalData.status !== 1 ? (
                                                <p><b>Employee</b> : {o.email}</p>
                                            ) : null}
                                        </>
                                    )
                                })}
                            </div>
                        )
                    })}
                    <div className="coverNOut">
                        <p><b>Phone number</b> : {orderAdminState.ModalData.phonenumber}</p>
                        <p><b>Address</b> : {orderAdminState.ModalData.address}</p>
                    </div>
                    <p><b>Payment method</b> : {orderAdminState.ModalData.paymentmethod?.type} {kakaCheck}</p>
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
                        {orderAdminState.ModalData.orderitems?.map((a, indexK) => {
                            var countTotal2 = 0
                            inTotal = a.topping?.reduce((acc, o) => acc + parseInt(o.foodprice), 0)
                            if (inTotal) {
                                countTotal2 = (inTotal + a.data.foodprice) * a.quantity
                            } else {
                                countTotal2 = a.data.foodprice * a.quantity
                            }
                            maxTotal += countTotal2
                            fulltotal2 = maxTotal + orderAdminState.ModalData.shippingfee
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
                            <td >{VND.format(orderAdminState.ModalData.shippingfee)}</td>
                        </tr>
                        <tr className="text-center text-nowrap">
                            <td colSpan={window.innerWidth > 575 ? 3 : 2}><b>Fulltotal</b></td>
                            <td style={{ color: "#FEA116" }}><b>{VND.format(fulltotal2)}</b></td>
                        </tr>
                    </tbody>
                </table>
                {orderAdminState.ModalData.status === 2 ? (
                    <div className="d-flex justify-content-between">
                        <p>✅ Order has been <b>Accepted</b></p>
                        <div style={{ display: "flex", gap: 10 }}>
                            {decode.userRole === 3 && orderAdminState.ModalData.paymentmethod?.type !== "Paypal" ? (
                                <button onClick={() => setOrderAdminState({ modalOpenDetail3: true })} className="btn btn-danger">Cancel</button>
                            ) : null}
                        </div>
                    </div>
                ) : null}
                {orderAdminState.ModalData.status === 2.3 ? (
                    <button onClick={() => shippingOrder(orderAdminState.ModalData._id, orderAdminState.ModalData.address, orderAdminState.ModalData.phonenumber, orderAdminState.ModalData.user[0].fullname)} className="btn btn-success">Shipping</button>
                ) : orderAdminState.ModalData.status === 2.1 ? (
                    <button onClick={() => { setOrderAdminState({ secondDoor: true, secondDoorState: 6 }); setModalOpenDetail2(false) }} className="btn btn-info">to chef</button>
                ) : null}
                <div className="d-flex justify-content-around">
                    {orderAdminState.ModalData.status === 1 ? (
                        <>
                            {orderAdminState.Accept ? (
                                <button style={{ pointerEvents: "none", opacity: 0.4 }} className="btn btn-success">Accept</button>
                            ) : (
                                <button onClick={() => appoveOrder(orderAdminState.ModalData._id, orderAdminState.ModalData.orderitems)} className="btn btn-success">Accept</button>
                            )}
                            {decode.userRole === 3 && (orderAdminState.ModalData.paymentmethod.type === "Vnpay" || orderAdminState.ModalData.paymentmethod.type === "COD") ? (
                                <button onClick={() => setOrderAdminState({ Accept: true })} className="btn btn-danger">Deny</button>
                            ) : null}
                        </>
                    ) : null}
                </div>
                {orderAdminState.ModalData.status === 4 ? (
                    <>
                        <div className="d-flex justify-content-between">
                            <p>🕒 Order is waiting to <b>Cancel</b></p>
                            {decode.userRole === 3 && orderAdminState.ModalData.paymentmethod?.type === "Vnpay" ? (
                                <button onClick={() => setOrderAdminState({ modalOpenDetail4: true })} className="btn btn-danger">Cancel</button>
                            ) : null}
                            {decode.userRole === 3 && orderAdminState.ModalData.paymentmethod?.type === "COD" ? (
                                <button onClick={() => setOrderAdminState({ reject: true })} className="btn btn-danger">Cancel</button>
                            ) : null}
                        </div>
                        <p>Reason : {orderAdminState.ModalData.denyreason}</p>
                    </>
                ) : null}
                {orderAdminState.ModalData.status === 5.1 ? (
                    <>
                        <p>🕒 Driver is coming to picked up items</p>
                        <div className="d-flex justify-content-between align-items-center">
                            <p>Name: {orderAdminState?.driverInfo.name}</p>
                            <p>Phone: {orderAdminState?.driverInfo.phone}</p>
                        </div>
                        <p>Plate: {orderAdminState?.driverInfo.plateNumber}</p>
                        <div className="d-flex justify-content-center my-4">
                            <div className="xvRange">
                                <div style={{ left: orderAdminState.deliverState === "Driver is coming" ? "22.5%" : orderAdminState.deliverState === "Driver picked items" ? "65.5%" : null }} className="sonXvRange"><span>🚴</span><p>{orderAdminState.deliverState}</p></div>
                                <div style={{ width: orderAdminState.deliverState === "Driver is coming" ? "27%" : orderAdminState.deliverState === "Driver picked items" ? "70%" : null }} className="sonXvRange2"></div>
                            </div>
                        </div>
                    </>
                ) : null}
                {orderAdminState.Accept ? (
                    <div className="pt-3">
                        <p>Reason why deny : </p>
                        {orderAdminState.ModalData.paymentmethod.status === 2 && orderAdminState.ModalData.paymentmethod.type === "Vnpay" ? (
                            <form onSubmit={(e) => denyOrderPaid(e, orderAdminState.ModalData._id, fulltotal)}>
                                <textarea value={orderAdminState.DenyReason} onChange={(e) => setOrderAdminState({ DenyReason: e.target.value })} className="textDeny" required />
                                <div style={{ gap: 1 + "%" }} className="d-flex mt-2">
                                    <button type="submit" className="btn btn-primary ">Comfirm</button>
                                    <button onClick={() => setOrderAdminState({ Accept: false })} className="btn btn-secondary ">Cancel</button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={(e) => denyOrder(e, orderAdminState.ModalData._id)}>
                                <textarea value={orderAdminState.DenyReason} onChange={(e) => setOrderAdminState({ DenyReason: e.target.value })} className="textDeny" required />
                                <div style={{ gap: 1 + "%" }} className="d-flex mt-2">
                                    <button type="submit" className="btn btn-primary ">Comfirm</button>
                                    <button onClick={() => setOrderAdminState({ Accept: false })} className="btn btn-secondary ">Cancel</button>
                                </div>
                            </form>
                        )}
                    </div>
                ) : null}
                {orderAdminState.reject ? (
                    <div className="pt-3">
                        <h5 className="text-center pb-2">Are you sure ?</h5>
                        <div className="d-flex justify-content-evenly align-items-center">
                            <button className="btn btn-primary" onClick={() => denyOrderWait(orderAdminState.ModalData._id)}>Yes</button>
                            <button className="btn btn-secondary" onClick={() => setOrderAdminState({ reject: false })}>No</button>
                        </div>
                    </div>
                ) : null}
                {orderAdminState.modalOpenDetail4 ? (
                    <CancelRequest fulltotal={fulltotal} ModalData={orderAdminState.ModalData} setmodal={setOrderAdminState} />
                ) : null}
                {orderAdminState.modalOpenDetail3 ? (
                    <CancelByMag fulltotal={fulltotal} ModalData={orderAdminState.ModalData} setmodal={setOrderAdminState} />
                ) : null}
                <button className='closeModal' onClick={() => setModalOpenDetail2(false)}>x</button>
            </Modal>
        </>
    )
}
OrderAdmin.propTypes = {
    Data: PropTypes.array.isRequired
};
export default OrderAdmin;