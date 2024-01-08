import axios from "axios";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";
import { Fragment, useEffect, useRef } from "react";
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
    const [Accept, setAccept] = useState(false)
    const [DenyReason, setDenyReason] = useState("")
    const [ModalData, setModalData] = useState([])
    const socketRef = useRef();

    var [modalOpenDetail2, setModalOpenDetail2] = useState(false);
    const [spinner, setSpinner] = useState(false)
    const [modalOpenDetail3, setModalOpenDetail3] = useState(false);
    const [modalOpenDetail4, setModalOpenDetail4] = useState(false);
    const [reject, setReject] = useState(false);
    useEffect(() => {
        if (modalOpenDetail2 === false) {
            setAccept(false)
        }
    }, [modalOpenDetail2])

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

        return () => {
            socketRef.current.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const appoveOrder = (e, yolo) => {
        const data = { id: e, userid: ModalData?.user[0].id, status: 2, employee: deliverEmployee, orderitems: yolo, empid: decode.userId }
        socketRef.current.emit('UpdateStatusOrderSocket', data)
    }

    var statusCheck = ""
    var kakaCheck = ""
    var total2 = 0
    var fulltotal = 0
    if (ModalData.paymentmethod?.status === 1) {
        kakaCheck = "( Unpaid )"
    } else if (ModalData.paymentmethod?.status === 2) {
        kakaCheck = "( Paid )"
    }
    const date = new Date(ModalData.createdAt).toLocaleDateString()
    const time = new Date(ModalData.createdAt).toLocaleTimeString()
    const datemodal = date + " - " + time

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
        setSpinner(true)
        axios(configuration).then(() => {
            setSpinner(false)
            Success()
        }).catch(() => {
            Fail()
        })
    }

    const denyOrder = (e, id) => {
        e.preventDefault();
        const data = { id: id, userid: ModalData?.user[0].id, reason: DenyReason, employee: deliverEmployee, status: 3, type: "Normal", empid: decode.userId }
        socketRef.current.emit('DenyOrderSocket', data)
    }

    const denyOrderWait = (id) => {
        const data = { id: id, userid: ModalData?.user[0].id, employee: deliverEmployee, status: 6, empid: decode.userId }
        socketRef.current.emit('DenyOrderWaitingSocket', data)
    }

    const denyOrderPaid = (e, id, Fu) => {
        e.preventDefault();
        const data = { id: id, userid: ModalData?.user[0].id, reason: DenyReason, employee: deliverEmployee, status: 3, type: "Paid", fulltotal: Fu, date: ModalData.createdAt, empid: decode.userId }
        socketRef.current.emit('DenyOrderSocket', data)
    }

    const completeOrder = (type) => {
        const data = { id: ModalData._id, userid: ModalData?.user[0].id, date: Date.now('vi'), status: 5, type: type, empid: decode.userId }
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
                                        <td><button onClick={() => { setModalData(i); setModalOpenDetail2(true) }} className='btn btn-success'>Detail</button></td>
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
                                <td><button onClick={() => { setModalData(i); setModalOpenDetail2(true) }} className='btn btn-success'>Detail</button></td>
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
                                <td><button onClick={() => { setModalData(i); setModalOpenDetail2(true) }} className='btn btn-success'>Detail</button></td>
                            </tr>
                        ) : null}
                    </Fragment >
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
                {spinner ? (
                    <div style={{ background: "rgba(255, 255, 255, 0.6)" }} id="spinner" className="show position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
                        <div className="spinner-border text-primary" style={{ width: 3 + "rem", height: 3 + "rem" }} role="status">
                            <span className="sr-only"></span>
                        </div>
                    </div>
                ) : null}
                <h2 className='text-center'>Order Detail</h2>
                <div className="coverNOut">
                    <p className="m-0"><b>Id</b> : {ModalData._id}</p>
                    <p className="m-0"><b>Date</b> : {datemodal}</p>
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
                    <p><b>Phone number</b> : {ModalData.phonenumber}</p>
                    <p><b>Address</b> : {ModalData.address}</p>
                    <p><b>Payment method</b> : {ModalData.paymentmethod?.type} {kakaCheck}</p>
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
                        {ModalData.orderitems?.map((a) => {
                            var total = a.quantity * a.data.foodprice
                            total2 += total
                            fulltotal = total2 + ModalData.shippingfee
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
                            <td>{VND.format(ModalData.shippingfee)}</td>
                        </tr>
                        <tr className='thhuhu'>
                            <th colSpan={3}>Fulltotal</th>
                            <th>{VND.format(fulltotal)}</th>
                        </tr>
                    </tbody>
                    <tbody className='jackass'>
                        <tr >
                            <td colSpan={2}>Shipping</td>
                            <td>{VND.format(ModalData.shippingfee)}</td>
                        </tr>
                        <tr>
                            <th colSpan={2}>Fulltotal</th>
                            <th>{VND.format(fulltotal)}</th>
                        </tr>
                    </tbody>
                </table>
                <h5 className="text-center pt-2">Order Processing</h5>
                <hr />
                {ModalData.status === 2 ? (
                    <>
                        <div className="d-flex justify-content-between">
                            <p>✅ Order has been <b>Accepted</b></p>
                            <div style={{ display: "flex", gap: 10 }}>
                                {decode.userRole === 3 && ModalData.paymentmethod?.type !== "Paypal" ? (
                                    <button onClick={() => setModalOpenDetail3(true)} className="btn btn-danger">Cancel</button>
                                ) : null}
                                {ModalData.employee?.map((i) => {
                                    if (i.id === decode.userId) {
                                        return (
                                            ModalData.paymentmethod.status === 1 ? (
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
                    {ModalData.status === 1 ? (
                        <>
                            {Accept ? (
                                <button style={{ pointerEvents: "none", opacity: 0.4 }} className="btn btn-success">Accept</button>
                            ) : (
                                <button onClick={() => appoveOrder(ModalData._id, ModalData.orderitems)} className="btn btn-success">Accept</button>
                            )}
                            {decode.userRole === 3 && (ModalData.paymentmethod.type === "Vnpay" || ModalData.paymentmethod.type === "COD") ? (
                                <button onClick={() => setAccept(true)} className="btn btn-danger">Deny</button>
                            ) : null}
                        </>
                    ) : null}
                </div>
                {ModalData.status === 4 ? (
                    <>
                        <div className="d-flex justify-content-between">
                            <p>🕒 Order is waiting to <b>Cancel</b></p>
                            {decode.userRole === 3 && ModalData.paymentmethod?.type === "Vnpay" ? (
                                <button onClick={() => setModalOpenDetail4(true)} className="btn btn-danger">Cancel</button>
                            ) : null}
                            {decode.userRole === 3 && ModalData.paymentmethod?.type === "COD" ? (
                                <button onClick={() => setReject(true)} className="btn btn-danger">Cancel</button>
                            ) : null}
                        </div>
                        <p>Reason : {ModalData.denyreason}</p>
                    </>
                ) : null}
                {Accept ? (
                    <div className="pt-3">
                        <p>Reason why deny : </p>
                        {ModalData.paymentmethod.status === 2 && ModalData.paymentmethod.type === "Vnpay" ? (
                            <form onSubmit={(e) => denyOrderPaid(e, ModalData._id, fulltotal)}>
                                <textarea value={DenyReason} onChange={(e) => setDenyReason(e.target.value)} className="textDeny" required />
                                <div style={{ gap: 1 + "%" }} className="d-flex mt-2">
                                    <button type="submit" className="btn btn-primary ">Comfirm</button>
                                    <button onClick={() => setAccept(false)} className="btn btn-secondary ">Cancel</button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={(e) => denyOrder(e, ModalData._id)}>
                                <textarea value={DenyReason} onChange={(e) => setDenyReason(e.target.value)} className="textDeny" required />
                                <div style={{ gap: 1 + "%" }} className="d-flex mt-2">
                                    <button type="submit" className="btn btn-primary ">Comfirm</button>
                                    <button onClick={() => setAccept(false)} className="btn btn-secondary ">Cancel</button>
                                </div>
                            </form>
                        )}
                    </div>
                ) : null}
                {reject ? (
                    <div className="pt-3">
                        <h5 className="text-center pb-2">Are you sure ?</h5>
                        <div className="d-flex justify-content-evenly align-items-center">
                            <button className="btn btn-primary" onClick={() => denyOrderWait(ModalData._id)}>Yes</button>
                            <button className="btn btn-secondary" onClick={() => setReject(false)}>No</button>
                        </div>
                    </div>
                ) : null}
                {modalOpenDetail4 ? (
                    <CancelRequest fulltotal={fulltotal} ModalData={ModalData} setmodal={setModalOpenDetail4} />
                ) : null}
                {modalOpenDetail3 ? (
                    <CancelByMag fulltotal={fulltotal} ModalData={ModalData} setmodal={setModalOpenDetail3} />
                ) : null}
                <button className='closeModal' onClick={() => setModalOpenDetail2(false)}>x</button>
            </Modal >
        </>
    )
}
OrderAdmin.propTypes = {
    Data: PropTypes.array.isRequired
};
export default OrderAdmin;