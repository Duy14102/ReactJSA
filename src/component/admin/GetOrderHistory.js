import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState, Fragment, useRef } from "react";
import Modal from 'react-modal';
import ReactPaginate from "react-paginate";
import Cookies from "universal-cookie";
import socketIOClient from "socket.io-client";

function GetOrderHistory() {
    const cookies = new Cookies()
    const token = cookies.get("TOKEN")
    const decode = jwtDecode(token)
    const [Order, setOrder] = useState([])
    const [ModalData, setModalData] = useState([])
    const [modalOpenDetail, setModalOpenDetail] = useState(false);
    const socketRef = useRef();
    const [pageCount, setPageCount] = useState(6);
    const currentPage = useRef();
    const limit = 9

    function HandleCancel() {
        getPagination()
        if (localStorage.getItem("CountNewContact")) {
            localStorage.removeItem("CountNewContact")
        }
    }

    useEffect(() => {
        currentPage.current = 1;
        getPagination()

        socketRef.current = socketIOClient.connect("https://eatcom.onrender.com")

        socketRef.current.on('CancelVnpaySuccess', dataGot => {
            if (decode.userRole === 3) {
                HandleCancel()
            }
        })

        socketRef.current.on('CompleteOrderSuccess', dataGot => {
            if (decode.userRole === 3) {
                HandleCancel()
            }
        })

        socketRef.current.on('CancelByMagNormalSuccess', dataGot => {
            if (decode.userRole === dataGot.emp) {
                HandleCancel()
            }
        })

        socketRef.current.on('CancelByMagPaidSuccess', dataGot => {
            if (decode.userRole === dataGot.emp) {
                HandleCancel()
            }
        })

        return () => {
            socketRef.current.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function handlePageClick(e) {
        currentPage.current = e.selected + 1
        getPagination();
    }

    function getPagination() {
        const configuration = {
            method: "get",
            url: "https://eatcom.onrender.com/GetAllOrderHistory",
            params: {
                page: currentPage.current,
                limit: limit
            }
        };
        axios(configuration)
            .then((result) => {
                setOrder(result.data.results.result);
                setPageCount(result.data.results.pageCount)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    var statusCheck = ""
    var kakaCheck = ""
    var total2 = 0
    var fulltotal = 0
    if (ModalData.paymentmethod?.status === 1) {
        kakaCheck = "( Unpaid )"
    } else if (ModalData.paymentmethod?.status === 2) {
        kakaCheck = "( Paid )"
    }
    const date = new Date(ModalData.createdAt).toLocaleDateString()
    const time = new Date(ModalData.createdAt).toLocaleTimeString()
    const datemodal = date + " - " + time
    const date2 = new Date(ModalData.completeAt).toLocaleDateString()
    const time2 = new Date(ModalData.completeAt).toLocaleTimeString()
    const datemodal2 = date2 + " - " + time2

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    return (
        <>
            <table className='table table-bordered text-center solotable'>
                <thead>
                    <tr className="text-white" style={{ background: "#374148" }}>
                        <th>Fullname</th>
                        <th className="thhuhu">Phone Number</th>
                        <th className="thhuhu">Date</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {Order.map((i) => {
                        const date = new Date(i.createdAt).toLocaleDateString()
                        const time = new Date(i.createdAt).toLocaleTimeString()
                        const datetime = date + " - " + time
                        if (i.status === 3) {
                            statusCheck = "Deny"
                        }
                        else if (i.status === 6) {
                            statusCheck = "Cancel"
                        }
                        else if (i.status === 5) {
                            statusCheck = "Complete"
                        }
                        return (
                            <Fragment key={i._id}>
                                {i.employee?.map((a) => {
                                    if (a.id === decode.userId && decode.userRole === 2) {
                                        return (
                                            <tr style={{ background: "#2C343A", color: "lightgray", verticalAlign: "middle" }}>
                                                {i.user.map((z) => {
                                                    return (
                                                        <td key={z}>{z.fullname}</td>
                                                    )
                                                })}
                                                <td className="thhuhu">{i.phonenumber}</td>
                                                <td className="thhuhu">{datetime}</td>
                                                <td>{statusCheck}</td>
                                                <td><button onClick={() => { setModalData(i); setModalOpenDetail(true) }} className='btn btn-success'>Detail</button></td>
                                            </tr>
                                        )
                                    }
                                    return null
                                })}
                                {decode.userRole === 3 ? (
                                    <tr style={{ background: "#2C343A", color: "lightgray", verticalAlign: "middle" }}>
                                        {i.user.map((z) => {
                                            return (
                                                <td key={z}>{z.fullname}</td>
                                            )
                                        })}
                                        <td className="thhuhu">{i.phonenumber}</td>
                                        <td className="thhuhu">{datetime}</td>
                                        <td>{statusCheck}</td>
                                        <td><button onClick={() => { setModalData(i); setModalOpenDetail(true) }} className='btn btn-success'>Detail</button></td>
                                    </tr>
                                ) : null}
                            </Fragment>
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
            <Modal isOpen={modalOpenDetail} onRequestClose={() => setModalOpenDetail(false)} ariaHideApp={false}
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
                        height: "70vh",
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
                                        <Fragment key={o.email}>
                                            {ModalData.status !== 1 ? (
                                                <p><b>Employee</b> : {o.email}</p>
                                            ) : null}
                                        </Fragment>
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
                {ModalData.status === 3 ? (
                    <>
                        <p>❌ Order has been <b>Denied</b></p>
                        <p>Reason : {ModalData.denyreason}</p>
                    </>
                ) : ModalData.status === 5 ? (
                    <p>⭐ Order has been <b>Completed</b> at {datemodal2}</p>
                ) : ModalData.status === 6 ? (
                    <>
                        <p>❌ Order has been <b>Canceled</b></p>
                        <p>Reason : {ModalData.denyreason}</p>
                    </>
                ) : null}
                <button className='closeModal' onClick={() => setModalOpenDetail(false)}>x</button>
            </Modal>
        </>
    )
}
export default GetOrderHistory;