import { useState } from 'react';
import '../css/Admin.css'
import axios from 'axios';
import Modal from 'react-modal';
import { Fragment } from 'react';

function Tracking() {
    const [Orderid, setOrderid] = useState(0)
    const [Order, setOrder] = useState([])
    const [Displaytable, setDisplaytable] = useState(false)
    const [modalOpenDetail, setModalOpenDetail] = useState(false);

    const searchorder = (e) => {
        e.preventDefault();
        const configuration = {
            method: 'get',
            url: 'http://localhost:3000/GetThisOrder',
            params: {
                id: Orderid
            }
        }
        axios(configuration)
            .then((res) => {
                setOrder(res.data.data)
                setDisplaytable(true)
            }).catch((err) => {
                console.log(err);
            })
    }

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    return (
        <>
            <div style={{ height: 45 + "vh" }} className="container">
                <h2 className='text-center'>Input your order id</h2>
                <div className='overOutsider'>
                    <div className='outsider'>
                        <form onSubmit={(e) => searchorder(e)}>
                            <input type='submit' style={{ display: "none" }} />
                            <div className='d-flex justify-content-between w-100'>
                                <input onInput={(e) => setOrderid(e.target.value)} placeholder='#Id' required />
                                <button style={{ width: 10 + "%" }} type="submit"><i className="fa-solid fa-magnifying-glass"></i></button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className='pt-4'>
                    {Displaytable ? (
                        <table className='table'>
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
                                    const date = new Date(i.createdAt).toLocaleDateString()
                                    const time = new Date(i.createdAt).toLocaleTimeString()
                                    const datetime = date + " - " + time
                                    var statusCheck = ""
                                    var paymentCheck = ""
                                    var total2 = 0
                                    var fulltotal = 0
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
                                                <td>{datetime}</td>
                                                <td>{statusCheck}</td>
                                                <td><button onClick={setModalOpenDetail} className='btn btn-success'>Detail</button></td>
                                            </tr>
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
                                                    <p className="m-0"><b>Id</b> : {i._id}</p>
                                                    <p className="m-0"><b>Date</b> : {datetime}</p>
                                                </div>
                                                <hr />
                                                {i.user.map((t) => {
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
                                                <p><b>Phone number</b> : {i.phonenumber}</p>
                                                <p><b>Address</b> : {i.address}</p>
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
                                                        {i.orderitems.map((a) => {
                                                            var total = a.quantity * a.data.foodprice
                                                            total2 += total
                                                            fulltotal = total2 + i.shippingfee
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
                                                            <td>{VND.format(i.shippingfee)}</td>
                                                        </tr>
                                                        <tr className='actorVid'>
                                                            <th colSpan={3}>Fulltotal</th>
                                                            <th>{VND.format(fulltotal)}</th>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <div className="pt-2">
                                                    {i.status === 2 ? (
                                                        <p>✅ Order has been <b>Complete</b></p>
                                                    ) : i.status === 3 ? (
                                                        <>
                                                            <p>❌ Order has been <b>Denied</b></p>
                                                            <p>Reason : {i.denyreason}</p>
                                                        </>
                                                    ) : i.status === 4 ? (
                                                        <>
                                                            <p>❌ Order has been <b>Canceled</b></p>
                                                            <p>Reason : {i.denyreason}</p>
                                                        </>
                                                    ) : null}
                                                </div>
                                                <button className='closeModal' onClick={() => setModalOpenDetail(false)}>x</button>
                                            </Modal>
                                        </Fragment>
                                    )
                                })}
                            </tbody>
                        </table>
                    ) : null}
                </div>
            </div>
        </>
    )
}
export default Tracking;