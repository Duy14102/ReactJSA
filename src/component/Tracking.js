import { useReducer } from 'react';
import '../css/Admin.css'
import axios from 'axios';
import Modal from 'react-modal';
import { Fragment } from 'react';
import html2canvas from 'html2canvas';

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
            url: 'https://eatcom.onrender.com/GetThisOrder',
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

    var total2 = 0, enTotal = 0, inTotal = 0, fulltotal = 0
    const mero = (i, index, s) => {
        var countTotal = 0
        inTotal = i.topping?.reduce((acc, o) => acc + parseInt(o.foodprice), 0)
        enTotal = s.orderitems?.reduce((acc, o) => acc + parseInt(o.data.foodprice), 0)
        if (inTotal) {
            countTotal = (inTotal + enTotal) * i.quantity
        } else {
            countTotal = enTotal * i.quantity
        }
        total2 += countTotal
        fulltotal = total2 + s.shippingfee
        const indexPlus = index + 1
        return (
            <tr key={i.data._id} style={{ verticalAlign: "middle" }}>
                <td className='text-center'>{window.innerWidth > 575 ? indexPlus : i.quantity + " x "}</td>
                <td colSpan={window.innerWidth > 575 ? null : 2}>
                    <div className="d-flex align-items-center" style={{ gap: 10 }}>
                        <img alt="" src={i.data.foodimage} width={70} height={60} />
                        <div>
                            <p className="m-0">{i.data.foodname}</p>
                            <p className="m-0 text-start" style={{ fontSize: 14, color: "#FEA116" }}><b>{VND.format(i.data.foodprice)}</b></p>
                        </div>
                    </div>
                    {i.topping?.map((p) => {
                        return (
                            <div key={p._id} className="d-flex align-items-center" style={{ gap: 10, marginLeft: 25, marginTop: 10 }}>
                                <img alt="" src={p.foodimage} width={45} height={40} />
                                <div>
                                    <p className="m-0" style={{ fontSize: 14 }}>{p.foodname}</p>
                                    <p className="m-0 text-start" style={{ color: "#FEA116", fontSize: 12 }}><b>{VND.format(p.foodprice)}</b></p>
                                </div>
                            </div>
                        )
                    })}
                </td>
                {window.innerWidth > 575 ? (
                    <>
                        <td className='text-center'>{i.quantity}</td>
                        <td className='text-center'>{VND.format(countTotal)}</td>
                    </>
                ) : null}
            </tr>
        )
    }
    const downloadOrder = () => {
        const image = document.getElementById('orderDownload');
        // const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
        let downloadLink = document.createElement('a');
        html2canvas(image, {
            allowTaint: true,
            useCORS: true
        }).then(function (canvas) {
            const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
            downloadLink.href = pngUrl
            downloadLink.download = "Order.png";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }).catch((er) => console.log(er));
    };

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
                        <table className='table table-bordered solotable m-0 text-center'>
                            <thead className="thead-dark">
                                <tr style={{ color: "#0F172B", backgroundColor: "gray" }}>
                                    <th className='text-white'>Fullname</th>
                                    <th className='thhuhu text-white'>Phone Number</th>
                                    <th className='thhuhu text-white'>Date</th>
                                    <th className='text-white'>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {trackingState.Order.map((i) => {
                                    const date = new Date(i.createdAt).toLocaleDateString()
                                    const time = new Date(i.createdAt).toLocaleTimeString()
                                    const datetime = date + " - " + time
                                    var kakaCheck = ""
                                    if (i.paymentmethod?.status === 1) {
                                        kakaCheck = "( Unpaid )"
                                    } else if (i.paymentmethod?.status === 2) {
                                        kakaCheck = "( Paid )"
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
                                                <td>{i.status === 1 ? "Pending" : i.status === 2 ? "Accepted" : i.status === 2.1 ? "Chef is ready" : i.status === 2.3 ? "Order ready to shipping" : i.status === 3 ? "Denied" : i.status === 4 ? "Pending canceled" : i.status === 5 ? "Completed" : i.status === 6 ? "Canceled" : null}</td>
                                                <td><button onClick={() => setTrackingState({ modalOpenDetail: true })} className='btn btn-success'>Detail</button></td>
                                            </tr>
                                            <Modal isOpen={trackingState.modalOpenDetail} onRequestClose={() => setTrackingState({ modalOpenDetail: false })} ariaHideApp={false}
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
                                                        width: window.innerWidth > 991 ? "40vw" : "80vw",
                                                        height: "auto",
                                                        overflow: "hidden",
                                                        zIndex: 999,
                                                        padding: 0
                                                    },
                                                }}>
                                                <div style={{ padding: 20 }} id='orderDownload'>
                                                    <h2 className='text-center'>Order Detail</h2>
                                                    <div className="coverNOut">
                                                        <p className="m-0"><b>Id</b> : {i._id}</p>
                                                        <p className="m-0"><b>Date</b> : {datetime}</p>
                                                    </div>
                                                    <hr />
                                                    <div className="hugeImpace">
                                                        {i.user?.map((t) => {
                                                            var textSp = "( visisting guests )"
                                                            return (
                                                                <div className="coverNOut" key={t}>
                                                                    {t.id === "none" ? (
                                                                        <p><b>Fullname</b> : {t.fullname} {textSp}</p>
                                                                    ) : (
                                                                        <p><b>Fullname</b> : {t.fullname}</p>
                                                                    )}
                                                                    {i.employee?.map((o) => {
                                                                        return (
                                                                            i.status !== 1 ? (
                                                                                <p><b>Employee</b> : {o.email}</p>
                                                                            ) : null
                                                                        )
                                                                    })}
                                                                </div>
                                                            )
                                                        })}
                                                        <div className="coverNOut">
                                                            <p><b>Phone number</b> : {i.phonenumber}</p>
                                                            <p><b>Address</b> : {i.address}</p>
                                                        </div>
                                                        <p><b>Payment method</b> : {i.paymentmethod?.type} {kakaCheck}</p>
                                                    </div>
                                                    <table className="table-bordered table solotable m-0">
                                                        <thead>
                                                            <tr style={{ color: "#0F172B", backgroundColor: "gray" }}>
                                                                <th style={{ textAlign: "center", color: "#fff" }}>{window.innerWidth > 575 ? "No" : "Quantity"}</th>
                                                                <th colSpan={window.innerWidth > 575 ? null : 2} style={{ color: "#fff" }}>Items</th>
                                                                {window.innerWidth > 575 ? (
                                                                    <>
                                                                        <th style={{ textAlign: "center", color: "#fff" }}>Quantity</th>
                                                                        <th style={{ textAlign: "center", color: "#fff" }}>Price</th>
                                                                    </>
                                                                ) : null}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {i.orderitems?.map((a, index) => {
                                                                return (
                                                                    mero(a, index, i)
                                                                )
                                                            })}
                                                            <tr className="text-center text-nowrap">
                                                                <td colSpan={window.innerWidth > 575 ? 3 : 2}><b>Shipping</b></td>
                                                                <td >{VND.format(i.shippingfee)}</td>
                                                            </tr>
                                                            <tr className="text-center text-nowrap">
                                                                <td colSpan={window.innerWidth > 575 ? 3 : 2}><b>Fulltotal</b></td>
                                                                <td style={{ color: "#FEA116" }}><b>{VND.format(fulltotal)}</b></td>
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
                                                </div>
                                                <div className='d-flex justify-content-center'>
                                                    <button onClick={() => downloadOrder()} className="buttonDownL mb-4">
                                                        <svg style={{ width: 20, height: 20 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" /></svg>
                                                        <p className="m-0">Download order</p>
                                                    </button>
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