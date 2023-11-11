import axios from "axios";
import jwtDecode from "jwt-decode";
import PropTypes from "prop-types";
import { Fragment, useEffect } from "react";
import { useState } from "react";
import Modal from 'react-modal';
import Swal from "sweetalert2";
import Cookies from "universal-cookie";
import CancelByMag from "../admin/CancelByMag";

function OrderAdmin({ Data }) {
    const cookies = new Cookies()
    const token = cookies.get("TOKEN")
    const decode = jwtDecode(token)
    const deliverEmployee = { id: decode.userId, email: decode.userEmail }
    const [Accept, setAccept] = useState(false)
    const [DenyReason, setDenyReason] = useState("")
    const [ModalData, setModalData] = useState([])

    var [modalOpenDetail2, setModalOpenDetail2] = useState(false);
    const [modalOpenDetail3, setModalOpenDetail3] = useState(false);
    useEffect(() => {
        if (modalOpenDetail2 === false) {
            setAccept(false)
        }
    }, [modalOpenDetail2])


    const appoveOrder = (e, yolo) => {
        const configuration = {
            method: 'post',
            url: 'http://localhost:3000/UpdateStatusOrder',
            data: {
                id: e,
                status: 2,
                employee: deliverEmployee,
                orderitems: yolo
            }
        }
        axios(configuration)
            .then(() => {
                Swal.fire(
                    'Accepted successfully!',
                    '',
                    'success'
                ).then(function () {
                    window.location.reload();
                })
            }).catch((e) => {
                Swal.fire(
                    'Accepted Fail!',
                    '',
                    'error'
                ).then(function () {
                    console.log(e);
                })
            })
    }

    var statusCheck = ""
    var paymentCheck = ""
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

    const denyOrderKun = (id) => {
        const configuration = {
            method: "post",
            url: "http://localhost:3000/VnpayRefund",
            data: {
                orderId: id,
                transDate: ModalData.createdAt,
                amount: fulltotal,
                transType: "03",
                user: "Manager",
                reason: DenyReason
            }
        }
        axios(configuration).then(() => {
            Swal.fire(
                'Denied successfully!',
                '',
                'success'
            ).then(function () {
                window.location.reload();
            })
        }).catch((err) => {
            Swal.fire(
                'Denied fail!',
                '',
                'error'
            ).then(function () {
                console.log(err);
            })
        })
    }

    const denyOrder = (e, id) => {
        e.preventDefault();
        const configuration = {
            method: "post",
            url: "http://localhost:3000/DenyOrder",
            params: {
                id: id,
                reason: DenyReason,
                employee: deliverEmployee,
                status: 3,
            }
        }
        axios(configuration)
            .then(() => {
                Swal.fire(
                    'Denied successfully!',
                    '',
                    'success'
                ).then(function () {
                    window.location.reload();
                })
            }).catch((e) => {
                Swal.fire(
                    'Denied fail!',
                    '',
                    'error'
                ).then(function () {
                    console.log(e);
                })
            })
    }

    const denyOrderPaid = (e, id) => {
        e.preventDefault();
        const configuration = {
            method: "post",
            url: "http://localhost:3000/DenyOrder",
            params: {
                id: id,
                reason: DenyReason,
                employee: deliverEmployee,
                status: 3,
            }
        }
        axios(configuration)
            .then(() => {
                denyOrderKun(id)
            }).catch((e) => {
                console.log(e);
            })
    }

    const completeOrder = (type) => {
        const configuration = {
            method: "post",
            url: "http://localhost:3000/CompleteOrderByEmp",
            data: {
                id: ModalData._id,
                date: Date.now(),
                status: 5,
                type: type
            }
        }
        axios(configuration)
            .then(() => {
                Swal.fire(
                    'Complete successfully!',
                    '',
                    'success'
                ).then(function () {
                    window.location.reload();
                })
            }).catch((err) => {
                Swal.fire(
                    'Complete fail!',
                    '',
                    'error'
                ).then(function () {
                    console.log(err);
                })
            })
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
                if (i.paymentmethod.method === 1) {
                    paymentCheck = "ATM"
                } else if (i.paymentmethod.method === 2) {
                    paymentCheck = "COD"
                }
                if (i.status === 1) {
                    statusCheck = "Pending"
                } else if (i.status === 2) {
                    statusCheck = "Accept"
                }
                else if (i.status === 3) {
                    statusCheck = "Deny"
                }
                else if (i.status === 4) {
                    statusCheck = "Cancel"
                }
                return (
                    <Fragment key={i._id}>
                        {i.employee?.map((a) => {
                            if (a.id === decode.userId) {
                                return (
                                    i.status === 2 ? (
                                        <tr style={{ verticalAlign: "middle", background: "#2C343A", color: "lightgray" }}>
                                            {i.user.map((z) => {
                                                return (
                                                    <td key={z}>{z.fullname}</td>
                                                )
                                            })}
                                            <td className="thhuhu">{i.phonenumber}</td>
                                            <td className="thhuhu">{datetime}</td>
                                            <td>{statusCheck}</td>
                                            <td onClick={setModalOpenDetail2}><button onClick={() => setModalData(i)} className='btn btn-success'>Detail</button></td>
                                        </tr>
                                    ) : null
                                )
                            }
                            return null
                        })}
                        {decode.userRole === 2 ? (
                            i.status === 1 ? (
                                <tr style={{ verticalAlign: "middle", background: "#2C343A", color: "lightgray" }}>
                                    {i.user.map((z) => {
                                        return (
                                            <td key={z}>{z.fullname}</td>
                                        )
                                    })}
                                    <td className="thhuhu">{i.phonenumber}</td>
                                    <td className="thhuhu">{datetime}</td>
                                    <td>{statusCheck}</td>
                                    <td onClick={setModalOpenDetail2}><button onClick={() => setModalData(i)} className='btn btn-success'>Detail</button></td>
                                </tr>
                            ) : null
                        ) : decode.userRole === 3 ? (
                            <tr style={{ verticalAlign: "middle", background: "#2C343A", color: "lightgray" }}>
                                {i.user.map((z) => {
                                    return (
                                        <td key={z}>{z.fullname}</td>
                                    )
                                })}
                                <td className="thhuhu">{i.phonenumber}</td>
                                <td className="thhuhu">{datetime}</td>
                                <td>{statusCheck}</td>
                                <td onClick={setModalOpenDetail2}><button onClick={() => setModalData(i)} className='btn btn-success'>Detail</button></td>
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
                    <p><b>Payment method</b> : {paymentCheck} {kakaCheck}</p>
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
                            {decode.userRole === 3 ? (
                                <button onClick={() => setModalOpenDetail3(true)} className="btn btn-danger">Cancel</button>
                            ) : null}
                            {ModalData.employee?.map((i) => {
                                if (i.id === decode.userId) {
                                    return (
                                        <>
                                            {ModalData.paymentmethod.status === 1 ? (
                                                <button onClick={() => completeOrder(2)} className="btn btn-primary">Complete Order</button>
                                            ) : (
                                                <button onClick={() => completeOrder(1)} className="btn btn-primary">Complete Order</button>
                                            )}
                                        </>
                                    )
                                }
                                return null
                            })}
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
                            {decode.userRole === 3 ? (
                                <button onClick={() => setAccept(true)} className="btn btn-danger">Deny</button>
                            ) : null}
                        </>
                    ) : null}
                </div>
                {Accept ? (
                    <div className="pt-3">
                        <p>Reason why deny : </p>
                        {ModalData.paymentmethod.method === 1 && ModalData.paymentmethod.status === 2 ? (
                            <form onSubmit={(e) => denyOrderPaid(e, ModalData._id)}>
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
                <button className='closeModal' onClick={() => setModalOpenDetail2(false)}>x</button>
            </Modal >
            <CancelByMag fulltotal={fulltotal} ModalData={ModalData} modal={modalOpenDetail3} setmodal={setModalOpenDetail3} />
        </>
    )
}
OrderAdmin.propTypes = {
    Data: PropTypes.array.isRequired
};
export default OrderAdmin;