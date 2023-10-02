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

    const searchorder = () => {
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
            }).catch((e) => {
                console.log(e);
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
                        <input onInput={(e) => setOrderid(e.target.value)} placeholder='#Id' />
                        <button onClick={() => searchorder()} className="SearchSubmit" type="submit"><i className="fa-solid fa-magnifying-glass"></i></button>
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
                                    var statusCheck = ""
                                    var paymentCheck = ""
                                    if (i.paymentmethod === 1) {
                                        paymentCheck = "ATM"
                                    } else if (i.paymentmethod === 2) {
                                        paymentCheck = "COD"
                                    }
                                    if (i.status === 1) {
                                        statusCheck = "Pending"
                                    } else if (i.status === 2) {
                                        statusCheck = "Complete"
                                    }
                                    return (
                                        <Fragment key={i._id}>
                                            <tr>
                                                <td>{i.fullname}</td>
                                                <td>{i.phonenumber}</td>
                                                <td>{i.datetime}</td>
                                                <td>{statusCheck}</td>
                                                <td><button onClick={setModalOpenDetail} className='btn btn-success'>Detail</button></td>
                                            </tr>
                                            <Modal
                                                isOpen={modalOpenDetail} onRequestClose={() => setModalOpenDetail(false)} ariaHideApp={false}
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
                                                <hr />
                                                <p><b>Id</b> : {i._id}</p>
                                                <p><b>Date</b> : {i.datetime}</p>
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