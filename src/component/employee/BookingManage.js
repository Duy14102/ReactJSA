import { useState, useRef, useEffect } from "react";
import ReactPaginate from "react-paginate";
import Modal from 'react-modal';
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "universal-cookie";
import jwtDecode from "jwt-decode";

function BookingManage() {
    const [booking, setBooking] = useState([])
    const [ModalData, setModalData] = useState([])
    const [TableData, setTableData] = useState([])
    const [modalOpenDetail, setModalOpenDetail] = useState(false);

    const cookies = new Cookies()
    const token = cookies.get("TOKEN")
    const decode = jwtDecode(token)
    const deliverEmployee = { id: decode.userId, email: decode.userEmail }
    const takeEmployee = []
    takeEmployee.push(deliverEmployee)

    const [pageCount, setPageCount] = useState(6);
    const currentPage = useRef();
    const limit = 8
    var total = 0
    var fulltotal = 0

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
            url: "http://localhost:3000/GetBookingByStatus",
            params: {
                status: 2,
                page: currentPage.current,
                limit: limit
            }
        };
        axios(configuration)
            .then((result) => {
                setBooking(result.data.results.result);
                setPageCount(result.data.results.pageCount)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const getThatTable = (e) => {
        const configuration = {
            method: "get",
            url: "http://localhost:3000/GetTable4BookingHistory",
            params: {
                cusid: e
            }
        };
        axios(configuration)
            .then((result) => {
                setTableData(result.data)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const checkOut = (e, tableid) => {
        const configuration = {
            method: "post",
            url: "http://localhost:3000/Checkout4Booking",
            data: {
                id: e,
                fulltotal: fulltotal,
                tableid: tableid,
                employee: takeEmployee
            }
        };
        axios(configuration)
            .then(() => {
                Swal.fire(
                    'Checkout Successfully!',
                    '',
                    'success'
                ).then(function () {
                    window.location.reload()
                })
            })
            .catch(() => {
                Swal.fire(
                    'Checkout Fail!',
                    '',
                    'error'
                ).then(function () {
                    window.location.reload()
                })
            });
    }

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    const date = new Date(ModalData.createdAt).toLocaleDateString()
    const time = new Date(ModalData.createdAt).toLocaleTimeString()
    const date2 = new Date(ModalData.date).toLocaleDateString()
    const time2 = new Date(ModalData.date).toLocaleTimeString()
    const datemodal = date + " - " + time
    const datemodal2 = date2 + " - " + time2
    return (
        <>
            <table className='table table-bordered text-center'>
                <thead>
                    <tr className="text-white" style={{ background: "#374148" }}>
                        <th className="text-center">Name</th>
                        <th className="text-center">Email</th>
                        <th className="text-center">Date</th>
                        <th className="text-center">Status</th>
                        <th className="text-center"></th>
                    </tr>
                </thead>
                {booking.map(i => {
                    const date = new Date(i.createdAt).toLocaleDateString()
                    const time = new Date(i.createdAt).toLocaleTimeString()
                    const datetime = date + " - " + time
                    var stau = ""
                    if (i.status === 2) {
                        stau = "Serving"
                    }
                    return (
                        <tbody key={i._id}>
                            <tr style={{ background: "#2C343A", color: "lightgray", verticalAlign: "middle" }}>
                                <td>{i.name}</td>
                                <td>{i.email}</td>
                                <td>{datetime}</td>
                                <td>{stau}</td>
                                <td onClick={setModalOpenDetail}><button onClick={() => { setModalData(i); getThatTable(i._id) }} className='btn btn-success'>Detail</button></td>
                            </tr>
                        </tbody>
                    )
                })}
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
                containerClassName="pagination justify-content-center"
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
                        width: 800,
                        zIndex: 999
                    },
                }}>
                <h2 className='text-center'>Booking Detail</h2>
                <div className="coverNOut">
                    <p className="m-0"><b>Id</b> : {ModalData._id}</p>
                    <p className="m-0"><b>Date</b> : {datemodal}</p>
                </div>
                <hr />
                <p><b>Name</b> : {ModalData.name}</p>
                <p><b>Email</b> : {ModalData.email}</p>
                <p><b>People</b> : {ModalData.people}</p>
                {Object.values(TableData).map((u) => {
                    return (
                        <p key={u._id}><b>Table</b> : {u.tablename}</p>
                    )
                })}
                <p><b>Date Arrived</b> : {datemodal2}</p>
                {ModalData.status === 2 ? (
                    <p><b>Status</b> : Serving</p>
                ) : null}
                <p><b>Note</b> : </p>
                <textarea className="contactMessage" style={{ pointerEvents: "none" }} defaultValue={ModalData.message} />
                <p className="pt-2"><b>Items</b> : </p>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Quantity</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(TableData).map((z) => {
                            return (
                                z.tableitems?.map((r) => {
                                    total = r.item.foodprice * r.quantity
                                    fulltotal += total
                                    return (
                                        <tr key={r}>
                                            <td>{r.item.foodname}</td>
                                            <td>{r.item.foodcategory}</td>
                                            <td>{r.quantity}</td>
                                            <td>{VND.format(r.item.foodprice)}</td>
                                        </tr>
                                    )
                                })
                            )
                        })}
                        <tr>
                            <th colSpan={3}>Fulltotal</th>
                            <th>{VND.format(fulltotal)}</th>
                        </tr>
                    </tbody>
                </table>
                <div className="d-flex justify-content-around align-items-center">
                    {Object.values(TableData).map((q) => {
                        return (
                            <button onClick={() => checkOut(ModalData._id, q._id)} className="btn btn-success">Checkout</button>
                        )
                    })}
                    <button className="btn btn-info">Change Table</button>
                </div>
                <button className='closeModal' onClick={() => setModalOpenDetail(false)}>x</button>
            </Modal>
        </>
    )
}
export default BookingManage