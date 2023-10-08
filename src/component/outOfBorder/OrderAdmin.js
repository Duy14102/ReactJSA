import axios from "axios";
import PropTypes from "prop-types";
import { Fragment, useEffect } from "react";
import { useState } from "react";
import Modal from 'react-modal';
import Swal from "sweetalert2";

function OrderAdmin({ Data }) {
    const [Accept, setAccept] = useState(false)
    const [DenyReason, setDenyReason] = useState("")
    const [ModalData, setModalData] = useState([])

    var [modalOpenDetail2, setModalOpenDetail2] = useState(false);
    useEffect(() => {
        if (modalOpenDetail2 === false) {
            setAccept(false)
        }
    }, [modalOpenDetail2])


    const appoveOrder = (e) => {
        const configuration = {
            method: 'post',
            url: 'http://localhost:3000/UpdateStatusOrder',
            params: {
                id: e,
                status: 2
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

    const denyOrder = (e, id) => {
        e.preventDefault();
        const configuration = {
            method: "post",
            url: "http://localhost:3000/DenyOrder",
            params: {
                id: id,
                reason: DenyReason,
                status: 3
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

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    var statusCheck = ""
    var paymentCheck = ""
    var total2 = 0
    var fulltotal = 0
    const datemodal = new Date(ModalData.createdAt)
    return (
        <>
            {Data.map(i => {
                const datetime = new Date(i.createdAt)
                if (i.paymentmethod === 1) {
                    paymentCheck = "ATM"
                } else if (i.paymentmethod === 2) {
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
                        {i.status === 1 ? (
                            <>
                                <tr style={{ verticalAlign: "middle", background: "#2C343A", color: "lightgray" }}>
                                    {i.user.map((z) => {
                                        return (
                                            <td key={z}>{z.fullname}</td>
                                        )
                                    })}
                                    <td>{i.phonenumber}</td>
                                    <td>{datetime.toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })}</td>
                                    <td>{statusCheck}</td>
                                    <td onClick={setModalOpenDetail2}><button onClick={() => setModalData(i)} className='btn btn-success'>Detail</button></td>
                                </tr>

                            </>
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
                        width: 800,
                        zIndex: 999
                    },
                }}>
                <h2 className='text-center'>Order Detail</h2>
                <div className="coverNOut">
                    <p className="m-0"><b>Id</b> : {ModalData._id}</p>
                    <p className="m-0"><b>Date</b> : {datemodal.toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })}</p>
                </div>
                <hr />
                {ModalData.user?.map((t) => {
                    var textSp = "( visisting guests )"
                    return (
                        <>
                            {t.id === "none" ? (
                                <p><b>Fullname</b> : {t.fullname} {textSp}</p>
                            ) : (
                                <p><b>Fullname</b> : {t.fullname}</p>
                            )}
                        </>
                    )
                })}
                <p><b>Phone number</b> : {ModalData.phonenumber}</p>
                <p><b>Address</b> : {ModalData.address}</p>
                <p><b>Payment method</b> : {paymentCheck}</p>
                <p><b>Status</b> : {statusCheck}</p>
                <table className='table table-bordered'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Category</th>
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
                                    <td>{a.data.foodcategory}</td>
                                    <td>{a.quantity}</td>
                                    <td>{VND.format(a.data.foodprice)}</td>
                                </tr>
                            )
                        })}
                        <tr className='actorVid'>
                            <td colSpan={3}>Shipping</td>
                            <td>{VND.format(ModalData.shippingfee)}</td>
                        </tr>
                        <tr className='actorVid'>
                            <th colSpan={3}>Fulltotal</th>
                            <th>{VND.format(fulltotal)}</th>
                        </tr>
                    </tbody>
                </table>
                <h5 className="text-center pt-2">Order Processing</h5>
                <hr />
                <div className="d-flex justify-content-around">
                    {Accept ? (
                        <button style={{ pointerEvents: "none", opacity: 0.4 }} className="btn btn-success">Accept</button>
                    ) : (
                        <button onClick={() => appoveOrder(ModalData._id)} className="btn btn-success">Accept</button>
                    )}
                    <button onClick={() => setAccept(true)} className="btn btn-danger">Deny</button>
                </div>
                {Accept ? (
                    <div className="pt-3">
                        <p>Reason why deny : </p>
                        <form onSubmit={(e) => denyOrder(e, ModalData._id)}>
                            <textarea value={DenyReason} onChange={(e) => setDenyReason(e.target.value)} className="textDeny" required />
                            <div style={{ gap: 1 + "%" }} className="d-flex mt-2">
                                <button type="submit" className="btn btn-primary ">Comfirm</button>
                                <button onClick={() => setAccept(false)} className="btn btn-secondary ">Cancel</button>
                            </div>
                        </form>
                    </div>
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