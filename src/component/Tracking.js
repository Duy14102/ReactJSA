import { useReducer } from 'react';
import '../css/Admin.css'
import axios from 'axios';
import Modal from 'react-modal';
import { Fragment } from 'react';

function Tracking() {
    const [trackingState, setTrackingState] = useReducer((prev, next) => ({
        ...prev, ...next
    }), {
        Orderid: 0,
        Order: [],
        Displaytable: false,
        modalOpenDetail: false,
    })

    const searchorder = (e) => {
        e.preventDefault();
        const configuration = {
            method: 'get',
            url: 'http://localhost:3000/GetThisOrder',
            params: {
                id: trackingState.Orderid
            }
        }
        axios(configuration)
            .then((res) => {
                setTrackingState({ Order: res.data.data, Displaytable: true })
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
                                <input onInput={(e) => setTrackingState({ Orderid: e.target.value })} placeholder='#Id' required />
                                <button style={{ width: 10 + "%" }} type="submit"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" /></svg></button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className='pt-4'>
                    {trackingState.Displaytable ? (
                        <table className='table text-center'>
                            <thead>
                                <tr style={{ whiteSpace: "nowrap" }}>
                                    <th>Fullname</th>
                                    <th className='thhuhu'>Phone Number</th>
                                    <th className='thhuhu'>Date</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {trackingState.Order.map((i) => {
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
                                            <tr style={{ verticalAlign: "middle", whiteSpace: "nowrap" }}>
                                                {i.user.map((z) => {
                                                    return (
                                                        <td key={z}>{z.fullname}</td>
                                                    )
                                                })}
                                                <td className='thhuhu'>{i.phonenumber}</td>
                                                <td className='thhuhu'>{datetime}</td>
                                                <td>{statusCheck}</td>
                                                <td><button onClick={() => setTrackingState({ modalOpenDetail: true })} className='btn btn-success'>Detail</button></td>
                                            </tr>
                                            <Modal isOpen={trackingState.modalOpenDetail} onRequestClose={() => setTrackingState({ modalOpenDetail: false })} ariaHideApp={false}
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
                                                    <p className="m-0"><b>Id</b> : {i._id}</p>
                                                    <p className="m-0"><b>Date</b> : {datetime}</p>
                                                </div>
                                                <hr />
                                                <div className='hugeImpace'>
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
                                                        {i.orderitems.map((a) => {
                                                            var total = a.quantity * a.data.foodprice
                                                            total2 += total
                                                            fulltotal = total2 + i.shippingfee
                                                            return (
                                                                <tr key={a.data._id}>
                                                                    <td>{a.data.foodname}</td>
                                                                    <td className='thhuhu'>{a.data.foodcategory}</td>
                                                                    <td>{a.quantity}</td>
                                                                    <td>{VND.format(a.data.foodprice)}</td>
                                                                </tr>
                                                            )
                                                        })}
                                                        <tr className='thhuhu'>
                                                            <td colSpan={3}>Shipping</td>
                                                            <td>{VND.format(i.shippingfee)}</td>
                                                        </tr>
                                                        <tr className='thhuhu'>
                                                            <th colSpan={3}>Fulltotal</th>
                                                            <th>{VND.format(fulltotal)}</th>
                                                        </tr>
                                                    </tbody>
                                                    <tbody className='jackass'>
                                                        <tr >
                                                            <td colSpan={2}>Shipping</td>
                                                            <td>{VND.format(i.shippingfee)}</td>
                                                        </tr>
                                                        <tr>
                                                            <th colSpan={2}>Fulltotal</th>
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
                                                <button className='closeModal' onClick={() => setTrackingState({ modalOpenDetail: false })}>x</button>
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