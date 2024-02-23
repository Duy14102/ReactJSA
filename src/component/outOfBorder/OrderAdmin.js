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

function OrderAdmin({ Data }) {
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
        modalOpenDetail4: false,
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
        socketRef.current = socketIOClient.connect("http://localhost:3000")

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

        return () => {
            socketRef.current.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const appoveOrder = (e, yolo) => {
        const data = { id: e, userid: orderAdminState.ModalData?.user[0].id, status: 2, employee: deliverEmployee, orderitems: yolo, empid: decode.userId }
        socketRef.current.emit('UpdateStatusOrderSocket', data)
    }

    var statusCheck = ""
    var kakaCheck = ""
    var total2 = 0
    var fulltotal = 0
    if (orderAdminState.ModalData.paymentmethod?.status === 1) {
        kakaCheck = "( Unpaid )"
    } else if (orderAdminState.ModalData.paymentmethod?.status === 2) {
        kakaCheck = "( Paid )"
    }
    const date = new Date(orderAdminState.ModalData.createdAt).toLocaleDateString()
    const time = new Date(orderAdminState.ModalData.createdAt).toLocaleTimeString()
    const datemodal = date + " - " + time

    const denyOrderKun = (id, date, amount, reason) => {
        const configuration = {
            method: "post",
            url: "http://localhost:3000/VnpayRefund",
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

    const completeOrder = (type) => {
        const data = { id: orderAdminState.ModalData._id, userid: orderAdminState.ModalData?.user[0].id, date: Date.now('vi'), status: 5, type: type, empid: decode.userId }
        socketRef.current.emit('CompleteOrderByEmpSocket', data)
    }

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    return (
        <>
            {Data.map(i => {
                const date = new Date(i.createdAt).toLocaleDateString()
                const time = new Date(i.createdAt).toLocaleTimeString()
                const datetime = date + " - " + time
                if (i.status === 1) {
                    statusCheck = "Pending"
                } else if (i.status === 2) {
                    statusCheck = "Accept"
                }
                else if (i.status === 4) {
                    statusCheck = "🕒 Pending cancel"
                }
                return (
                    <Fragment key={i._id}>
                        {i.employee?.map((a) => {
                            if (decode.userRole === 2 && a.id === decode.userId && i.status === 2) {
                                return (
                                    <tr style={{ verticalAlign: "middle", background: "#2C343A", color: "lightgray" }}>
                                        {i.user.map((z) => {
                                            return (
                                                <td key={z}>{z.fullname}</td>
                                            )
                                        })}
                                        <td className="thhuhu">{i.phonenumber}</td>
                                        <td className="thhuhu">{datetime}</td>
                                        <td>{statusCheck}</td>
                                        <td><button onClick={() => { setOrderAdminState({ ModalData: i }); setModalOpenDetail2(true) }} className='btn btn-success'>Detail</button></td>
                                    </tr>
                                )
                            }
                            return null
                        })}
                        {decode.userRole === 2 && i.status === 1 ? (
                            <tr style={{ verticalAlign: "middle", background: "#2C343A", color: "lightgray" }}>
                                {i.user.map((z) => {
                                    return (
                                        <td key={z}>{z.fullname}</td>
                                    )
                                })}
                                <td className="thhuhu">{i.phonenumber}</td>
                                <td className="thhuhu">{datetime}</td>
                                <td>{statusCheck}</td>
                                <td><button onClick={() => { setOrderAdminState({ ModalData: i }); setModalOpenDetail2(true) }} className='btn btn-success'>Detail</button></td>
                            </tr>
                        ) : null}
                        {decode.userRole === 3 ? (
                            <tr style={{ verticalAlign: "middle", background: "#2C343A", color: "lightgray" }}>
                                {i.user.map((z) => {
                                    return (
                                        <td key={z}>{z.fullname}</td>
                                    )
                                })}
                                <td className="thhuhu">{i.phonenumber}</td>
                                <td className="thhuhu">{datetime}</td>
                                <td>{statusCheck}</td>
                                <td><button onClick={() => { setOrderAdminState({ ModalData: i }); setModalOpenDetail2(true) }} className='btn btn-success'>Detail</button></td>
                            </tr>
                        ) : null}
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
                        width: "70vw",
                        height: "70vh",
                        zIndex: 999
                    },
                }}>
                {orderAdminState.spinner ? (
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
                    <p><b>Phone number</b> : {orderAdminState.ModalData.phonenumber}</p>
                    <p><b>Address</b> : {orderAdminState.ModalData.address}</p>
                    <p><b>Payment method</b> : {orderAdminState.ModalData.paymentmethod?.type} {kakaCheck}</p>
                    <p><b>Status</b> : {statusCheck}</p>
                </div>
                <table className='table table-bordered solotable'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th className="thhuhu">Category</th>
                            <th>Quantity</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderAdminState.ModalData.orderitems?.map((a) => {
                            var total = a.quantity * a.data.foodprice
                            total2 += total
                            fulltotal = total2 + orderAdminState.ModalData.shippingfee
                            return (
                                <tr key={a.data._id}>
                                    <td>{a.data.foodname}</td>
                                    <td className="thhuhu">{a.data.foodcategory}</td>
                                    <td>{a.quantity}</td>
                                    <td>{VND.format(a.data.foodprice)}</td>
                                </tr>
                            )
                        })}
                        <tr className='thhuhu'>
                            <td colSpan={3}>Shipping</td>
                            <td>{VND.format(orderAdminState.ModalData.shippingfee)}</td>
                        </tr>
                        <tr className='thhuhu'>
                            <th colSpan={3}>Fulltotal</th>
                            <th>{VND.format(fulltotal)}</th>
                        </tr>
                    </tbody>
                    <tbody className='jackass'>
                        <tr >
                            <td colSpan={2}>Shipping</td>
                            <td>{VND.format(orderAdminState.ModalData.shippingfee)}</td>
                        </tr>
                        <tr>
                            <th colSpan={2}>Fulltotal</th>
                            <th>{VND.format(fulltotal)}</th>
                        </tr>
                    </tbody>
                </table>
                <h5 className="text-center pt-2">Order Processing</h5>
                <hr />
                {orderAdminState.ModalData.status === 2 ? (
                    <>
                        <div className="d-flex justify-content-between">
                            <p>✅ Order has been <b>Accepted</b></p>
                            <div style={{ display: "flex", gap: 10 }}>
                                {decode.userRole === 3 && orderAdminState.ModalData.paymentmethod?.type !== "Paypal" ? (
                                    <button onClick={() => setOrderAdminState({ modalOpenDetail3: true })} className="btn btn-danger">Cancel</button>
                                ) : null}
                                {orderAdminState.ModalData.employee?.map((i) => {
                                    if (i.id === decode.userId) {
                                        return (
                                            orderAdminState.ModalData.paymentmethod.status === 1 ? (
                                                <button onClick={() => completeOrder(2)} className="btn btn-primary">Complete Order</button>
                                            ) : (
                                                <button onClick={() => completeOrder(1)} className="btn btn-primary">Complete Order</button>
                                            )
                                        )
                                    }
                                    return null
                                })}
                            </div>
                        </div>
                    </>
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