import axios from "axios";
import { useEffect, useState, Fragment,useRef } from "react";
import Modal from 'react-modal';
import ReactPaginate from "react-paginate";


function GetOrderHistory() {
    const [Order, setOrder] = useState([])
    const [ModalData, setModalData] = useState([])
    const [modalOpenDetail, setModalOpenDetail] = useState(false);
    const [pageCount, setPageCount] = useState(6);
    const currentPage = useRef();
    const limit = 9

    useEffect(() => {
        currentPage.current = 1;
        getPagination()
    }, [])

    function handlePageClick(e) {
        currentPage.current = e.selected + 1
        getPagination();
    }

    function getPagination() {
        const configuration = {
            method: "get",
            url: "http://localhost:3000/GetAllOrderHistory",
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

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    var statusCheck = ""
    var paymentCheck = ""
    var total2 = 0
    var fulltotal = 0
    const date = new Date(ModalData.createdAt).toLocaleDateString()
    const time = new Date(ModalData.createdAt).toLocaleTimeString()
    const datemodal = date + " - " + time
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
                                        <tr style={{ background: "#2C343A", color: "lightgray", verticalAlign: "middle" }}>
                                            {i.user.map((z) => {
                                                return (
                                                    <td key={z}>{z.fullname}</td>
                                                )
                                            })}
                                            <td className="thhuhu">{i.phonenumber}</td>
                                            <td className="thhuhu">{datetime}</td>
                                            <td>{statusCheck}</td>
                                            <td onClick={setModalOpenDetail}><button onClick={() => setModalData(i)} className='btn btn-success'>Detail</button></td>
                                        </tr>
                                    </>
                                )}
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
                            <Fragment key={t}>
                                {ModalData.employee?.map((o) => {
                                    return (
                                        t.id === "none" ? (
                                            <div className="coverNOut">
                                                <p><b>Fullname</b> : {t.fullname} {textSp}</p>
                                                <p><b>Employee</b> : {o.email}</p>
                                            </div>
                                        ) : (
                                            <div className="coverNOut">
                                                <p><b>Fullname</b> : {t.fullname}</p>
                                                <p><b>Employee</b> : {o.email}</p>
                                            </div>
                                        )
                                    )
                                })}
                            </Fragment>
                        )
                    })}
                    <p><b>Phone number</b> : {ModalData.phonenumber}</p>
                    <p><b>Address</b> : {ModalData.address}</p>
                    <p><b>Payment method</b> : {paymentCheck}</p>
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
        </>
    )
}
export default GetOrderHistory;