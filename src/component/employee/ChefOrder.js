import axios from "axios";
import { Fragment, useState, useEffect, useRef } from "react";
import Modal from 'react-modal';
import ReactPaginate from "react-paginate";
import socketIOClient from "socket.io-client";
import Swal from "sweetalert2";

function ChefOrder({ decode }) {
    const [ModalData, setModalData] = useState()
    const [seeMore, setSeeMore] = useState()
    const [modalOpenDetail, setModalOpenDetail] = useState(false)
    const [modalOpenDetail2, setModalOpenDetail2] = useState(false)
    const [kitchenreason, setKitchecnreason] = useState()
    const [newOrder, setNewOrder] = useState(false)
    const [receiveOrder, setReceiveOrder] = useState(false)
    const [Order, setOrder] = useState([])
    const [pageCount, setPageCount] = useState(6);
    const currentPage = useRef();
    const socketRef = useRef();
    const limit = 9

    function HandleNew() {
        getPagination()
        setNewOrder(true)
    }

    function HandleReceive() {
        getPagination()
        setReceiveOrder(true)
    }

    useEffect(() => {
        currentPage.current = 1
        getPagination()
        socketRef.current = socketIOClient.connect("https://eatcom.onrender.com")

        socketRef.current.on('UpdateStatusOrderSuccess', dataGot => {
            HandleNew()
        })

        socketRef.current.on('ChefWantCancelSuccess', dataGot => {
            if (dataGot.mag === decode.userId) {
                Swal.fire(
                    'Cancel success!',
                    "",
                    'success'
                ).then(() => window.location.reload())
            } else {
                getPagination()
            }
        })

        socketRef.current.on('ChefWantCancelSuccess2', dataGot => {
            HandleReceive()
        })

        socketRef.current.on('ChefReadySuccess', dataGot => {
            if (dataGot.mag === decode.userId) {
                Swal.fire(
                    'Ready success!',
                    "",
                    'success'
                ).then(() => window.location.reload())
            } else {
                getPagination()
            }
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (newOrder) {
            setTimeout(() => {
                setNewOrder(false)
            }, 1500);
        }
        if (receiveOrder) {
            setTimeout(() => {
                setReceiveOrder(false)
            }, 1500);
        }
    }, [newOrder, receiveOrder])

    function handlePageClick(e) {
        currentPage.current = e.selected + 1
        getPagination();
    }

    function getPagination() {
        const configuration = {
            method: "get",
            url: "https://eatcom.onrender.com/GetChefOrder",
            params: {
                page: currentPage.current,
                limit: limit,
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

    const cancelOrder = (e, id) => {
        e.preventDefault()
        const data = { id: id, kitchenreason: kitchenreason, mag: decode.userId, status: 2.1 }
        socketRef.current.emit('ChefWantCancelSocket', data)
    }

    const readyOrder = (id, user) => {
        const data = { id: id, mag: decode.userId, user: user }
        socketRef.current.emit('ChefReadySocket', data)
    }

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    var inTotal = 0, fulltotal2 = 0, maxTotal = 0
    return (
        <>
            <div className="fatherNewUserNoti">
                {newOrder ? (
                    <div className="newUserNoti" style={{ backgroundColor: "#03ba5f" }}>
                        <h6>✓ New order!</h6>
                    </div>
                ) : null}
                {receiveOrder ? (
                    <div className="newUserNoti" style={{ backgroundColor: "#03ba5f" }}>
                        <h6>✓ Order received!</h6>
                    </div>
                ) : null}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", marginBottom: 25 }}>
                {Order.map((i, index) => {
                    const date = new Date(i.createdAt).toLocaleDateString()
                    const time = new Date(i.createdAt).toLocaleTimeString()
                    const datetime = date + " - " + time
                    let toppingArray = i.orderitems.reduce(function (accumulator, curValue) {
                        return accumulator.concat(curValue.topping)
                    }, [])
                    return (
                        <Fragment key={index}>
                            <div style={{ opacity: i.status === 2.1 ? 0.5 : null, width: window.innerWidth > 991 ? "47%" : "100%", position: "relative" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#374148", color: "#fff", padding: 15 }}>
                                    <p className="m-0">Id : {i._id}</p>
                                    <p className="m-0">Date : {datetime}</p>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", background: "#2C343A", color: "lightgray", padding: 15 }}>
                                    <div>
                                        {seeMore === index ? (
                                            i.orderitems.map((a, indexS) => {
                                                return (
                                                    <div key={indexS} style={{ marginTop: indexS > 0 ? 20 : null }}>
                                                        <div className="d-flex align-items-center" style={{ gap: 10 }}>
                                                            <img alt="" src={a.data.foodimage} width={70} height={60} />
                                                            <div>
                                                                <p className="m-0" style={{ fontSize: 17 }}>{a.data.foodname}</p>
                                                                <p className="m-0 text-start" style={{ fontSize: 15, color: "#FEA116" }}><b>{VND.format(a.data.foodprice)}</b></p>
                                                            </div>
                                                        </div>
                                                        {a.topping ? (
                                                            a.topping.map((p) => {
                                                                return (
                                                                    <div key={p._id} className="d-flex align-items-center" style={{ gap: 10, marginLeft: 25, marginTop: 10 }}>
                                                                        <img alt="" src={p.foodimage} width={45} height={40} />
                                                                        <div>
                                                                            <p className="m-0" style={{ fontSize: 15 }}>{p.foodname}</p>
                                                                            <p className="m-0 text-start" style={{ color: "#FEA116", fontSize: 13 }}><b>{VND.format(p.foodprice)}</b></p>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })
                                                        ) : null}
                                                    </div>
                                                )
                                            })
                                        ) : (
                                            <div>
                                                <div className="d-flex align-items-center" style={{ gap: 10 }}>
                                                    <img alt="" src={i.orderitems[0]?.data.foodimage} width={70} height={60} />
                                                    <div>
                                                        <p className="m-0" style={{ fontSize: 17 }}>{i.orderitems[0].data.foodname}</p>
                                                        <p className="m-0 text-start" style={{ fontSize: 15, color: "#FEA116" }}><b>{VND.format(i.orderitems[0]?.data.foodprice)}</b></p>
                                                    </div>
                                                </div>
                                                {i.orderitems[0].topping ? (
                                                    i?.orderitems[0]?.topping[0] ? (
                                                        <div className="d-flex align-items-center" style={{ gap: 10, marginLeft: 25, marginTop: 10 }}>
                                                            <img alt="" src={i?.orderitems[0]?.topping[0]?.foodimage} width={45} height={40} />
                                                            <div>
                                                                <p className="m-0" style={{ fontSize: 15 }}>{i.orderitems[0]?.topping[0]?.foodname}</p>
                                                                <p className="m-0 text-start" style={{ color: "#FEA116", fontSize: 13 }}><b>{VND.format(i.orderitems[0]?.topping[0]?.foodprice)}</b></p>
                                                            </div>
                                                        </div>
                                                    ) : null
                                                ) : null}
                                            </div>
                                        )}
                                        {i.orderitems?.length > 1 && seeMore !== index ? (
                                            <p onClick={() => setSeeMore(index)} className="seeMoreInOrder">See more</p>
                                        ) : i.orderitems?.length === 1 && toppingArray.length > 1 && seeMore !== index ? (
                                            <p onClick={() => setSeeMore(index)} className="seeMoreInOrder">See more</p>
                                        ) : null}
                                        {seeMore === index ? (
                                            <p onClick={() => setSeeMore(null)} className="seeMoreInOrder">See less</p>
                                        ) : null}
                                    </div>
                                    <div>
                                        <p>Status : {i.status === 2 ? "🟢( Chef is preparing )" : i.status === 2.1 ? "🟠( Chef canceled )" : i.status === 2.2 ? "🟢( Order ready )" : null}</p>
                                        <p>Payment : {i.paymentmethod.method === 1 ? "e-wallet" : i.paymentmethod.method === 2 ? "COD" : null}</p>
                                        {i.kitchenreason ? (
                                            <p>Note : {i.kitchenreason}</p>
                                        ) : null}
                                        {i.status === 2 ? (
                                            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                                                <button onClick={() => { setModalOpenDetail(true); setModalData(i) }} className="btn btn-danger">Cancel</button>
                                                <button onClick={() => readyOrder(i._id, i.user[0].id)} className="btn btn-success">Ready</button>
                                                <button onClick={() => { setModalOpenDetail2(true); setModalData(i) }} className="btn btn-warning inforItKK"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" /></svg></button>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
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
                        width: window.innerWidth > 575 ? "40vw" : "80vw",
                        height: "auto",
                        zIndex: 999
                    },
                }}>
                <p>Reason why cancel : </p>
                <form onSubmit={(e) => cancelOrder(e, ModalData._id)}>
                    <textarea onChange={(e) => setKitchecnreason(e.target.value)} style={{ height: 165, resize: "none" }} className="textDeny" required />
                    <div style={{ gap: 1 + "%" }} className="d-flex mt-2">
                        <button type="submit" className="btn btn-primary ">Comfirm</button>
                        <button onClick={() => setModalOpenDetail(false)} className="btn btn-secondary ">Cancel</button>
                    </div>
                </form>
                <button className='closeModal' onClick={() => setModalOpenDetail(false)}>x</button>
            </Modal>
            <Modal id="otpModal" isOpen={modalOpenDetail2} onRequestClose={() => setModalOpenDetail2(false)} ariaHideApp={false}
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
                        width: window.innerWidth > 575 ? "40vw" : "80vw",
                        height: "auto",
                        zIndex: 999
                    },
                }}>
                <h2 className='text-center'>Order Detail</h2>
                <div className="coverNOut">
                    <p className="m-0"><b>Id</b> : {ModalData?._id}</p>
                    <p className="m-0"><b>Date</b> : {new Date(ModalData?.createdAt).toLocaleDateString() + " - " + new Date(ModalData?.createdAt).toLocaleTimeString()}</p>
                </div>
                <hr />
                <div className="hugeImpace">
                    {ModalData?.user?.map((t) => {
                        var textSp = "( visisting guests )"
                        return (
                            <div className="coverNOut" key={t}>
                                {t.id === "none" ? (
                                    <p><b>Fullname</b> : {t.fullname} {textSp}</p>
                                ) : (
                                    <p><b>Fullname</b> : {t.fullname}</p>
                                )}
                                {ModalData?.employee?.map((o) => {
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
                    <div className="coverNOut">
                        <p><b>Phone number</b> : {ModalData?.phonenumber}</p>
                        <p><b>Address</b> : {ModalData?.address}</p>
                    </div>
                    <p><b>Payment method</b> : {ModalData?.paymentmethod?.type} {ModalData?.paymentmethod.status === 1 ? "( Unpaid )" : "( Paid )"}</p>
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
                        {ModalData?.orderitems?.map((a, indexK) => {
                            var countTotal2 = 0
                            inTotal = a.topping?.reduce((acc, o) => acc + parseInt(o.foodprice), 0)
                            if (inTotal) {
                                countTotal2 = (inTotal + a.data.foodprice) * a.quantity
                            } else {
                                countTotal2 = a.data.foodprice * a.quantity
                            }
                            maxTotal += countTotal2
                            fulltotal2 = maxTotal + ModalData?.shippingfee
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
                            {ModalData?.shippingfee === 30000 ? (
                                <td >{VND.format(30000)}</td>
                            ) : (
                                <td><del>{VND.format(30000)}</del> - <b style={{ color: "#FEA116" }}>{VND.format(0)}</b></td>
                            )}
                        </tr>
                        <tr className="text-center text-nowrap">
                            <td colSpan={window.innerWidth > 575 ? 3 : 2}><b>Fulltotal</b></td>
                            <td style={{ color: "#FEA116" }}><b>{VND.format(fulltotal2)}</b></td>
                        </tr>
                    </tbody>
                </table>
                <div className="d-flex justify-content-between">
                    <p>✅ Order has been <b>Accepted</b></p>
                    <div style={{ display: "flex", gap: 10 }}>
                        <button onClick={() => { setModalOpenDetail(true); setModalOpenDetail2(false) }} className="btn btn-danger">Cancel</button>
                        <button onClick={() => readyOrder(ModalData._id, ModalData.user[0].id)} className="btn btn-success">Ready</button>
                    </div>
                </div>
                <button className='closeModal' onClick={() => setModalOpenDetail2(false)}>x</button>
            </Modal>
        </>
    )
}
export default ChefOrder