import { useEffect, useState, useRef, Fragment } from "react";
import GetOrder from "./GetOrder";
import GetOrderHistory from "./GetOrderHistory";
import Modal from 'react-modal';
import axios from "axios";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";
import Cookies from "universal-cookie";
import {jwtDecode} from "jwt-decode";
import CancelByMag from "./CancelByMag";

function MainOrder() {
    const cookies = new Cookies()
    const token = cookies.get("TOKEN")
    const decode = jwtDecode(token)
    const deliverEmployee = { id: decode.userId, email: decode.userEmail }
    const [modalOpenAdmin, setModalOpenAdmin] = useState(false);
    const [modalOpenAdmin2, setModalOpenAdmin2] = useState(false);
    const [modalOpenDetail3, setModalOpenDetail3] = useState(false);
    const [ModalData, setModalData] = useState([])
    const [dataafter, setDataAfter] = useState([])
    const [openTable, setOpenTable] = useState(false)
    const [DateInput, setDateInput] = useState()
    const [Accept, setAccept] = useState(false)
    const [DenyReason, setDenyReason] = useState("")

    const [pageCount, setPageCount] = useState(6);
    const currentPage = useRef();
    const limit = 8

    useEffect(() => {
        currentPage.current = 1;
        document.getElementById("defaultOpen2").click();
    }, [])

    function openCity2(evt, cityName) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent2");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("MBbutton2");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active2", "");
        }
        document.getElementById(cityName).style.display = "block";
        evt.currentTarget.className += " active2";
    }

    function handlePageClick(e) {
        currentPage.current = e.selected + 1
        findOrder();
    }

    const findOrder = (e) => {
        e?.preventDefault()
        const configuration = {
            method: "get",
            url: "http://localhost:3000/SearchAllOrder",
            params: {
                date: DateInput,
                page: currentPage.current,
                limit: limit
            },
        };
        axios(configuration)
            .then((result) => {
                setOpenTable(true)
                setDataAfter(result.data.results.result);
                setPageCount(result.data.results.pageCount)
            })
            .catch((error) => {
                console.log(error);
            });
    }

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

    var statusCheck = ""
    var kakaCheck = ""
    var total2 = 0
    var fulltotal = 0
    const date = new Date(ModalData.createdAt).toLocaleDateString()
    const time = new Date(ModalData.createdAt).toLocaleTimeString()
    const datemodal = date + " - " + time
    const date2 = new Date(ModalData.completeAt).toLocaleDateString()
    const time2 = new Date(ModalData.completeAt).toLocaleTimeString()
    const datemodal2 = date2 + " - " + time2
    if (ModalData.paymentmethod?.status === 1) {
        kakaCheck = "( Unpaid )"
    } else if (ModalData.paymentmethod?.status === 2) {
        kakaCheck = "( Paid )"
    }
    return (
        <>
            <div className="myDIVdad">
                <div style={{ gap: 5 + "%" }} id="myDIV2" className="d-flex align-items-center">
                    <button id="defaultOpen2" className="MBbutton2 active2" onClick={(e) => openCity2(e, 'cartactive')}><p >Cart Active</p></button>
                    <button className="MBbutton2" onClick={(e) => openCity2(e, 'carthistory')}><p>Cart History</p></button>
                </div>
                <button onClick={() => setModalOpenAdmin(true)} className="btn btn-primary">🔎 Order</button>
            </div>
            <Modal
                isOpen={modalOpenAdmin} onRequestClose={() => setModalOpenAdmin(false)} ariaHideApp={false}
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
                        height: "55vh",
                        zIndex: 999
                    },
                }}>
                <div className='p-3'>
                    <h2 className='text-center'>Input order date</h2>
                    <div className='overOutsider'>
                        <div className='outsider'>
                            <form onSubmit={(e) => findOrder(e)}>
                                <input type='submit' style={{ display: "none" }} />
                                <div className='d-flex justify-content-between w-100'>
                                    <input onInput={(e) => setDateInput(e.target.value)} type='date' required />
                                    <button style={{ width: 10 + "%" }} type="submit"><i className="fi fi-br-search"></i></button>
                                </div>
                            </form>
                        </div>
                    </div>
                    {openTable ? (
                        <>
                            <table className='table solotable mt-3 text-center'>
                                <thead>
                                    <tr>
                                        <th>Fullname</th>
                                        <th className='thhuhu'>Phone Number</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.values(dataafter).map((i) => {
                                        const date = new Date(i.createdAt).toLocaleDateString()
                                        const time = new Date(i.createdAt).toLocaleTimeString()
                                        const datetime = date + " - " + time
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
                                        else if (i.status === 5) {
                                            statusCheck = "Complete"
                                        }
                                        return (
                                            <Fragment key={i._id}>
                                                {i.employee?.map((a) => {
                                                    if (a.id === decode.userId) {
                                                        return (
                                                            i.status === 2 ? (
                                                                <tr style={{ verticalAlign: "middle" }}>
                                                                    {i.user.map((z) => {
                                                                        return (
                                                                            <td key={z}>{z.fullname}</td>
                                                                        )
                                                                    })}
                                                                    <td className="thhuhu">{i.phonenumber}</td>
                                                                    <td className="thhuhu">{datetime}</td>
                                                                    <td>{statusCheck}</td>
                                                                    <td><button onClick={() => { setModalOpenAdmin(false); setModalOpenAdmin2(true); setModalData(i) }} className='btn btn-success'>Detail</button></td>
                                                                </tr>
                                                            ) : null
                                                        )
                                                    }
                                                    return null
                                                })}
                                                {decode.userRole === 2 ? (
                                                    i.status === 1 ? (
                                                        <tr style={{ verticalAlign: "middle" }}>
                                                            {i.user.map((z) => {
                                                                return (
                                                                    <td key={z}>{z.fullname}</td>
                                                                )
                                                            })}
                                                            <td className="thhuhu">{i.phonenumber}</td>
                                                            <td className="thhuhu">{datetime}</td>
                                                            <td>{statusCheck}</td>
                                                            <td><button onClick={() => { setModalOpenAdmin(false); setModalOpenAdmin2(true); setModalData(i) }} className='btn btn-success'>Detail</button></td>
                                                        </tr>
                                                    ) : null
                                                ) : decode.userRole === 3 ? (
                                                    <tr style={{ verticalAlign: "middle" }}>
                                                        {i.user.map((z) => {
                                                            return (
                                                                <td key={z}>{z.fullname}</td>
                                                            )
                                                        })}
                                                        <td className="thhuhu">{i.phonenumber}</td>
                                                        <td className="thhuhu">{datetime}</td>
                                                        <td>{statusCheck}</td>
                                                        <td><button onClick={() => { setModalOpenAdmin(false); setModalOpenAdmin2(true); setModalData(i) }} className='btn btn-success'>Detail</button></td>
                                                    </tr>
                                                ) : null}
                                            </Fragment >
                                        )
                                    })}
                                </tbody>
                            </table>
                            <ReactPaginate
                                breakLabel="..."
                                nextLabel="next >"
                                onPageChange={handlePageClick}
                                pageRangeDisplayed={5}
                                pageCount={pageCount}
                                previousLabel="< previous"
                                renderOnZeroPageCount={null}
                                marginPagesDisplayed={2}
                                containerClassName="pagination justify-content-center text-nowrap"
                                pageClassName="page-item"
                                pageLinkClassName="page-link"
                                previousClassName="page-item"
                                previousLinkClassName="page-link"
                                nextClassName="page-item"
                                nextLinkClassName="page-link"
                                activeClassName="active"
                                forcePage={currentPage.current - 1}
                            />
                        </>
                    ) : null}
                </div>
                <button className='closeModal' onClick={() => { setModalOpenAdmin(false); setOpenTable(false) }}>x</button>
            </Modal>
            <Modal
                isOpen={modalOpenAdmin2} onRequestClose={() => setModalOpenAdmin2(false)} ariaHideApp={false}
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
                        height: "55vh",
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
                    <p><b>Payment method</b> : {ModalData.paymentmethod?.type} {kakaCheck}</p>
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
                {ModalData.status === 1 ? (
                    <>
                        <div className="d-flex justify-content-around">
                            {Accept ? (
                                <button style={{ pointerEvents: "none", opacity: 0.4 }} className="btn btn-success">Accept</button>
                            ) : (
                                <button onClick={() => appoveOrder(ModalData._id, ModalData.orderitems)} className="btn btn-success">Accept</button>
                            )}
                            {decode.userRole === 3 && (ModalData.paymentmethod.type === "Vnpay" || ModalData.paymentmethod.type === "COD") ? (
                                <button onClick={() => setAccept(true)} className="btn btn-danger">Deny</button>
                            ) : null}
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
                ) : (
                    <>
                        {ModalData.status === 2 ? (
                            <>
                                <div className="d-flex justify-content-between">
                                    <p>✅ Order has been <b>Accepted</b></p>
                                    {decode.userRole === 3 && ModalData.paymentmethod?.type === "Vnpay" ? (
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
                        ) : ModalData.status === 5 ? (
                            <p>⭐ Order has been <b>Completed</b> at {datemodal2}</p>
                        ) : null}
                    </>
                )}
                <button className='closeModal' onClick={() => { setModalOpenAdmin2(false); setModalOpenAdmin(true) }}>x</button>
            </Modal>
            {ModalData.paymentmethod?.type === "Vnpay" ? (
                <CancelByMag ModalData={ModalData} fulltotal={fulltotal} modal={modalOpenDetail3} setmodal={setModalOpenDetail3} />
            ) : null}
            <div id="cartactive" className="tabcontent2">
                <div className="pt-4">
                    <GetOrder />
                </div>
            </div>

            <div id="carthistory" className="tabcontent2">
                <div className="pt-4">
                    <GetOrderHistory />
                </div>
            </div>
        </>
    )
}
export default MainOrder