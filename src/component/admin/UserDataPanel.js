import axios from "axios";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Modal from 'react-modal';

function UserDataPanel({ Data, toke }) {
    const [ModalData, setModalData] = useState([])
    const [Accept, setAccept] = useState(false)
    const [DenyReason, setDenyReason] = useState("")
    const [modalOpenDetail, setModalOpenDetail] = useState(false);

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
                    'Request cancel successfully!',
                    '',
                    'success'
                ).then(function () {
                    window.location.reload();
                })
            }).catch((e) => {
                Swal.fire(
                    'Request cancel fail!',
                    '',
                    'error'
                ).then(function () {
                    console.log(e);
                })
            })
    }

    const CancelRequest = () => {
        const configuration = {
            method: "post",
            url: "http://localhost:3000/CancelRequestFour",
            data: {
                id: ModalData._id,
                status: 1
            }
        }
        axios(configuration)
            .then(() => {
                Swal.fire(
                    'Cancel request successfully!',
                    '',
                    'success'
                ).then(function () {
                    window.location.reload();
                })
            }).catch((e) => {
                Swal.fire(
                    'Cancel request fail!',
                    '',
                    'error'
                ).then(function () {
                    console.log(e);
                })
            })
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
        document.getElementById(cityName).style.display = "table-row-group";
        evt.currentTarget.className += " active";
    }

    var total2 = 0
    var fulltotal = 0
    var statusCheck = ""
    var statusCheck2 = ""
    var kakaCheck = ""
    if (ModalData.paymentmethod?.status === 1) {
        kakaCheck = "( Unpaid )"
    } else if (ModalData.paymentmethod?.status === 2) {
        kakaCheck = "( Paid )"
    }
    if (ModalData.status === 1) {
        statusCheck2 = "Pending"
    }
    else if (ModalData.status === 2) {
        statusCheck2 = "Accept"
    }
    else if (ModalData.status === 4) {
        statusCheck2 = "🕒 Pending cancel"
    } else if (ModalData.status === 3) {
        statusCheck2 = "Deny"
    }
    else if (ModalData.status === 5) {
        statusCheck2 = "Complete"
    }
    else if (ModalData.status === 6) {
        statusCheck2 = "Cancel"
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
            {Data.length > 0 ? (
                <>
                    <div id="tabs-section">
                        <div className="d-flex px-4 pb-3 Lunatic" style={{ gap: 1 + "%" }}>
                            <button id="clickFy" onClick={(e) => openCity5(e, 'act')} className="noPlusElf tabcclink">Active</button>
                            <button onClick={(e) => openCity5(e, 'inact')} className="noPlusElf tabcclink">History</button>
                        </div>
                        <div className="px-4">
                            <table className='table table-bordered text-center'>
                                <thead>
                                    <tr>
                                        <th>Fullname</th>
                                        <th className='thhuhu'>Phone Number</th>
                                        <th className='thhuhu'>Date</th>
                                        <th>Status</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody id="act" className="tabbluh holeInWall">
                                    {Object.values(Data).map((i) => {
                                        const date = new Date(i.createdAt).toLocaleDateString()
                                        const time = new Date(i.createdAt).toLocaleTimeString()
                                        const datetime = date + " - " + time
                                        if (i.status === 1) {
                                            statusCheck = "Pending"
                                        }
                                        else if (i.status === 2) {
                                            statusCheck = "Accept"
                                        }
                                        else if (i.status === 4) {
                                            statusCheck = "🕒 Pending cancel"
                                        }
                                        return (
                                            i.status === 1 || i.status === 2 || i.status === 4 ? (
                                                <tr style={{ verticalAlign: "middle" }} key={i._id}>
                                                    <>
                                                        {i.user.map((z) => {
                                                            return (
                                                                <td key={z}>{z.fullname}</td>
                                                            )
                                                        })}
                                                        <td className='thhuhu'>{i.phonenumber}</td>
                                                        <td className='thhuhu'>{datetime}</td>
                                                        <td>{statusCheck}</td>
                                                        <td onClick={setModalOpenDetail}><button onClick={() => setModalData(i)} className='btn btn-success'>Detail</button></td>
                                                    </>
                                                </tr>
                                            ) : null
                                        )
                                    })}
                                </tbody>
                                <tbody id="inact" className="tabbluh holeInWall">
                                    {Object.values(Data).map((i) => {
                                        const date = new Date(i.createdAt).toLocaleDateString()
                                        const time = new Date(i.createdAt).toLocaleTimeString()
                                        const datetime = date + " - " + time
                                        if (i.status === 3) {
                                            statusCheck = "Deny"
                                        }
                                        else if (i.status === 5) {
                                            statusCheck = "Complete"
                                        }
                                        else if (i.status === 6) {
                                            statusCheck = "Cancel"
                                        }
                                        return (
                                            i.status === 3 || i.status === 5 || i.status === 6 ? (
                                                <tr style={{ verticalAlign: "middle" }} key={i._id}>
                                                    <>
                                                        {i.user.map((z) => {
                                                            return (
                                                                <td key={z}>{z.fullname}</td>
                                                            )
                                                        })}
                                                        <td className='thhuhu'>{i.phonenumber}</td>
                                                        <td className='thhuhu'>{datetime}</td>
                                                        <td>{statusCheck}</td>
                                                        <td onClick={setModalOpenDetail}><button onClick={() => setModalData(i)} className='btn btn-success'>Detail</button></td>
                                                    </>
                                                </tr>
                                            ) : null
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
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
                                width: "70vw",
                                overflow: "hidden",
                            },
                        }}>
                        <h2 className='text-center'>Order Detail</h2>
                        <div className="coverNOut">
                            <p className="m-0"><b>Id</b> : {ModalData._id}</p>
                            <p className="m-0"><b>Date</b> : {datetime}</p>
                        </div>
                        <hr />
                        <div className='hugeImpace'>
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
                            <p><b>Status</b> : {statusCheck2}</p>
                        </div>
                        <table className='table table-bordered solotable'>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th className='thhuhu'>Category</th>
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
                        {ModalData.status === 1 && ModalData.paymentmethod?.type !== "Paypal" ? (
                            <>
                                <div className="text-center">
                                    <button onClick={() => setAccept(true)} className="btn btn-danger">Cancel</button>
                                </div>
                                {Accept ? (
                                    <div className="pt-3">
                                        <p>Reason why deny : </p>
                                        <form onSubmit={(e) => denyOrder(e, ModalData._id)}>
                                            <textarea value={DenyReason} onChange={(e) => setDenyReason(e.target.value)} className="textDeny" required />
                                            <div style={{ gap: 1 + "%" }} className="humble mt-2">
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
                                <p>✅ Order has been <b>Approve</b></p>
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