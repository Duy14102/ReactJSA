import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState, Fragment, useRef } from "react";
import Modal from 'react-modal';
import ReactPaginate from "react-paginate";
import Cookies from "universal-cookie";
import socketIOClient from "socket.io-client";
import OrderHistoryHandle from "../outOfBorder/OrderHistoryHandle";

function GetOrderHistory({ DateInput, filter }) {
    const cookies = new Cookies()
    const token = cookies.get("TOKEN")
    const decode = jwtDecode(token)
    const [Order, setOrder] = useState([])
    const [ModalData, setModalData] = useState([])
    const [seeMore, setSeeMore] = useState()
    const [checkBack, setCheckBack] = useState(false)
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

        socketRef.current.on('CancelOrderTransSuccess', dataGot => {
            HandleCancel()
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
                limit: limit,
                date: DateInput,
                filter: filter
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

    useEffect(() => {
        setCheckBack(true)
        setTimeout(() => {
            getPagination()
            setCheckBack(false)
        }, 1000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [DateInput, filter])

    var kakaCheck = ""
    var inTotal = 0, maxTotal = 0, fulltotal2 = 0
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
            {checkBack ? (
                <div id="spinner" className="show position-fixed translate-middle w-100 vh-100 top-30 start-50 d-flex align-items-center justify-content-center">
                    <div className="spinner-border text-primary" style={{ width: 3 + "rem", height: 3 + "rem" }} role="status">
                        <span className="sr-only"></span>
                    </div>
                </div>
            ) : null}
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", marginBottom: 25 }}>
                {Order.map((i, index) => {
                    const date = new Date(i.createdAt).toLocaleDateString()
                    const time = new Date(i.createdAt).toLocaleTimeString()
                    const datetime = date + " - " + time
                    let toppingArray = i.orderitems.reduce(function (accumulator, curValue) {
                        return accumulator.concat(curValue.topping)
                    }, [])
                    return (
                        <Fragment key={i._id}>
                            {i.employee?.map((a) => {
                                if (a.id === decode.userId && decode.userRole === 2) {
                                    return (
                                        <OrderHistoryHandle i={i} datetime={datetime} seeMore={seeMore} setSeeMore={setSeeMore} index={index} toppingArray={toppingArray} setModalOpenDetail={setModalOpenDetail} setModalData={setModalData} checkBack={checkBack} />
                                    )
                                }
                                return null
                            })}
                            {decode.userRole === 3 ? (
                                <OrderHistoryHandle i={i} datetime={datetime} seeMore={seeMore} setSeeMore={setSeeMore} index={index} toppingArray={toppingArray} setModalOpenDetail={setModalOpenDetail} setModalData={setModalData} checkBack={checkBack} />
                            ) : null}
                        </Fragment>
                    )
                })}
            </div>
            <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="<"
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
                        width: window.innerWidth > 991 ? "40vw" : "80vw",
                        height: "auto",
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
                    <div className="coverNOut">
                        <p><b>Phone number</b> : {ModalData.phonenumber}</p>
                        <p><b>Address</b> : {ModalData.address}</p>
                    </div>
                    <p><b>Payment method</b> : {ModalData.paymentmethod?.type} {kakaCheck}</p>
                </div>
                <table className="table-bordered table solotable">
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
                        {ModalData.orderitems?.map((a, indexK) => {
                            var countTotal2 = 0
                            inTotal = a.topping?.reduce((acc, o) => acc + parseInt(o.foodprice), 0)
                            if (inTotal) {
                                countTotal2 = (inTotal + a.data.foodprice) * a.quantity
                            } else {
                                countTotal2 = a.data.foodprice * a.quantity
                            }
                            maxTotal += countTotal2
                            fulltotal2 = maxTotal + ModalData.shippingfee
                            return (
                                <tr key={a.data._id} style={{ verticalAlign: "middle" }}>
                                    <td className='text-center'>{window.innerWidth > 575 ? indexK + 1 : a.quantity + " x "}</td>
                                    <td colSpan={window.innerWidth > 575 ? null : 2}>
                                        <div className="d-flex align-items-center" style={{ gap: 10 }}>
                                            <img alt="" src={a.data.foodimage} width={70} height={60} />
                                            <div>
                                                <p className="m-0">{a.data.foodname}</p>
                                                <p className="m-0 text-start" style={{ fontSize: 14, color: "#FEA116" }}><b>{VND.format(a.data.foodprice)}</b></p>
                                            </div>
                                        </div>
                                        {a.topping?.map((p) => {
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
                                            <td className='text-center'>{a.quantity}</td>
                                            <td className='text-center'>{VND.format(countTotal2)}</td>
                                        </>
                                    ) : null}
                                </tr>
                            )
                        })}
                        <tr className="text-center text-nowrap">
                            <td colSpan={window.innerWidth > 575 ? 3 : 2}><b>Shipping</b></td>
                            <td >{VND.format(ModalData.shippingfee)}</td>
                        </tr>
                        <tr className="text-center text-nowrap">
                            <td colSpan={window.innerWidth > 575 ? 3 : 2}><b>Fulltotal</b></td>
                            <td style={{ color: "#FEA116" }}><b>{VND.format(fulltotal2)}</b></td>
                        </tr>
                    </tbody>
                </table>
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