import axios from "axios";
import PropTypes from "prop-types";
import { Fragment, useState } from "react";
import Swal from "sweetalert2";
import Modal from 'react-modal';

function UserDataPanel({ Data }) {
    const [ModalData, setModalData] = useState([])
    const [Accept, setAccept] = useState(false)
    const [DenyReason, setDenyReason] = useState("")
    const [modalOpenDetail, setModalOpenDetail] = useState(false);

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    const denyOrder = (e, id) => {
        e.preventDefault();
        const configuration = {
            method: "post",
            url: "http://localhost:3000/DenyOrder",
            params: {
                id: id,
                reason: DenyReason,
                status: 4
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

    var total2 = 0
    var fulltotal = 0
    var statusCheck = ""
    var paymentCheck = ""

    return (
        <>
            <h6 className="text-center">Your Order</h6>
            {Data.length > 0 ? (
                <>
                    <div className="px-4">
                        <table className='table table-bordered text-center'>
                            <thead>
                                <tr>
                                    <th>Fullname</th>
                                    <th>Phone Number</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.values(Data).map((i) => {
                                    if (i.paymentmethod === 1) {
                                        paymentCheck = "ATM"
                                    } else if (i.paymentmethod === 2) {
                                        paymentCheck = "COD"
                                    }
                                    if (i.status === 1) {
                                        statusCheck = "Pending"
                                    }
                                    else if (i.status === 2) {
                                        statusCheck = "Accept"
                                    } else if (i.status === 3) {
                                        statusCheck = "Deny"
                                    }
                                    else if (i.status === 4) {
                                        statusCheck = "Cancel"
                                    }
                                    return (
                                        <Fragment key={i._id}>
                                            <tr style={{ verticalAlign: "middle" }}>
                                                {i.user.map((z) => {
                                                    return (
                                                        <td key={z}>{z.fullname}</td>
                                                    )
                                                })}
                                                <td>{i.phonenumber}</td>
                                                <td>{i.datetime}</td>
                                                <td>{statusCheck}</td>
                                                <td onClick={setModalOpenDetail}><button onClick={() => setModalData(i)} className='btn btn-success'>Detail</button></td>
                                            </tr>
                                        </Fragment>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    <Modal isOpen={modalOpenDetail} onRequestClose={() => setModalOpenDetail(false)} ariaHideApp={false}
                        style={{
                            overlay: {
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
                                width: 650,
                                overflow: "hidden",
                            },
                        }}>
                        <h2 className='text-center'>Order Detail</h2>
                        <div className="coverNOut">
                            <p className="m-0"><b>Id</b> : {ModalData._id}</p>
                            <p className="m-0"><b>Date</b> : {ModalData.datetime}</p>
                        </div>
                        <hr />
                        {ModalData.user?.map((t) => {
                            var textSp = "( visisting guests )"
                            return (
                                <Fragment key={t}>
                                    {t.id === "none" ? (
                                        <p><b>Fullname</b> : {t.fullname} {textSp}</p>
                                    ) : (
                                        <p><b>Fullname</b> : {t.fullname}</p>
                                    )}
                                </Fragment>
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
                        {ModalData.status === 1 ? (
                            <>
                                <div className="text-center">
                                    <button onClick={() => setAccept(true)} className="btn btn-danger">Cancel</button>
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
                            </>
                        ) : null}
                        <div className="pt-2">
                            {ModalData.status === 2 ? (
                                <p>✅ Order has been <b>Complete</b></p>
                            ) : ModalData.status === 3 ? (
                                <>
                                    <p>❌ Order has been <b>Denied</b></p>
                                    <p>Reason : {ModalData.denyreason}</p>
                                </>
                            ) : ModalData.status === 4 ? (
                                <>
                                    <p>❌ Order has been <b>Canceled</b></p>
                                    <p>Reason : {ModalData.denyreason}</p>
                                </>
                            ) : null}
                        </div>
                        <button className='closeModal' onClick={() => setModalOpenDetail(false)}>x</button>
                    </Modal>
                </>
            ) : (
                <p className="text-center">There's nothing here yet! Go Shopping Now</p>
            )}
        </>
    )
}
UserDataPanel.propTypes = {
    Data: PropTypes.array.isRequired
};
export default UserDataPanel