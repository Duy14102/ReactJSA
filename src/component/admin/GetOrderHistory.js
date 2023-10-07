import { useEffect, useState, Fragment } from "react";
import Modal from 'react-modal';

function GetOrderHistory() {
    const [Order, setOrder] = useState([])
    const [ModalData, setModalData] = useState([])
    const [modalOpenDetail, setModalOpenDetail] = useState(false);
    useEffect(() => {
        fetch("http://localhost:3000/GetAllOrder", {
            method: "get",
        }).then((res) => res.json()).then((data) => {
            setOrder(data.data);
        })
    }, [])

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
                    {Order.map((i) => {
                        const datetime = new Date(i.createdAt)
                        if (i.paymentmethod === 1) {
                            paymentCheck = "ATM"
                        } else if (i.paymentmethod === 2) {
                            paymentCheck = "COD"
                        }
                        if (i.status === 2) {
                            statusCheck = "Accept"
                        } else if (i.status === 3) {
                            statusCheck = "Deny"
                        }
                        else if (i.status === 4) {
                            statusCheck = "Cancel"
                        }
                        return (
                            <Fragment key={i._id}>
                                {i.status === 1 ? null : (
                                    <>
                                        <tr style={{ verticalAlign: "middle" }}>
                                            {i.user.map((z) => {
                                                return (
                                                    <td>{z.fullname}</td>
                                                )
                                            })}
                                            <td>{i.phonenumber}</td>
                                            <td>{datetime.toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })}</td>
                                            <td>{statusCheck}</td>
                                            <td onClick={setModalOpenDetail}><button onClick={() => setModalData(i)} className='btn btn-success'>Detail</button></td>
                                        </tr>
                                    </>
                                )}
                            </Fragment>
                        )
                    })}
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
                                width: 800,
                                overflow: "hidden",
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
                        {ModalData.status === 2 ? (
                            <p>✅ Order has been <b>Accepted</b></p>
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
                        <button className='closeModal' onClick={() => setModalOpenDetail(false)}>x</button>
                    </Modal>
                </tbody>
            </table>
        </>
    )
}
export default GetOrderHistory;