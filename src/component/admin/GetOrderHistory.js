import { useEffect, useState, Fragment } from "react";
import Modal from 'react-modal';

function GetOrderHistory() {
    const [Order, setOrder] = useState([])
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
                        var statusCheck = ""
                        var paymentCheck = ""
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
                                            <td>{i.fullname}</td>
                                            <td>{i.phonenumber}</td>
                                            <td>{i.datetime}</td>
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
                                                    width: 800,
                                                    overflow: "hidden",
                                                },
                                            }}>
                                            <h2 className='text-center'>Order Detail</h2>
                                            <div className="coverNOut">
                                                <p className="m-0"><b>Id</b> : {i._id}</p>
                                                <p className="m-0"><b>Date</b> : {i.datetime}</p>
                                            </div>
                                            <hr />
                                            <p><b>Fullname</b> : {i.fullname}</p>
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
                                                        <th colSpan={3}>Fulltotal</th>
                                                        <th>{VND.format(i.totalprice)}</th>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <h5 className="text-center pt-2">Order Processing</h5>
                                            <hr />
                                            {i.status === 2 ? (
                                                <p>✅ Order has been <b>Accepted</b></p>
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
                                            <button className='closeModal' onClick={() => setModalOpenDetail(false)}>x</button>
                                        </Modal>
                                    </>
                                )}
                            </Fragment>
                        )
                    })}
                </tbody>
            </table>
        </>
    )
}
export default GetOrderHistory;