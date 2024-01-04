import axios from "axios";
import { useEffect, useState, useRef } from "react";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";
import $ from 'jquery'
import Modal from 'react-modal';

function UserBookingPanel({ id }) {
    const [Booking, setBooking] = useState([])
    const [BookingHistory, setBookingHistory] = useState([])
    const [ModalData, setModalData] = useState([])
    const [modalOpenDetail, setModalOpenDetail] = useState(false);
    const [openOOO, setOpenOOO] = useState(false)
    const [cancelReason, setCancelReason] = useState()

    const [pageCount, setPageCount] = useState(6);
    const currentPage = useRef();
    const limit = 8

    useEffect(() => {
        $('#SickSidekick').click()
        currentPage.current = 1;
        getPagination()

        fetch(`https://eatcom.onrender.com/GetTokenBooking?id=${id}`, {
            method: "get",
        }).then((res) => res.json()).then((data) => {
            setBooking(data);
        })
    }, [id])

    function handlePageClick(e) {
        currentPage.current = e.selected + 1
        getPagination();
    }

    function getPagination() {
        const configuration = {
            method: "get",
            url: "https://eatcom.onrender.com/GetBookingHistory",
            params: {
                page: currentPage.current,
                limit: limit
            }
        };
        axios(configuration)
            .then((result) => {
                setBookingHistory(result.data.results.result);
                setPageCount(result.data.results.pageCount)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const CancelBooking = (e, id) => {
        e.preventDefault()
        const configuration = {
            method: "post",
            url: "https://eatcom.onrender.com/CancelBooking",
            data: {
                id: id,
                reason: cancelReason
            }
        }

        axios(configuration)
            .then(() => {
                Swal.fire(
                    'Cancel Successfully!',
                    '',
                    'success'
                ).then(function () {
                    window.location.reload();
                })
            }).catch(() => {
                Swal.fire(
                    'Cancel Fail!',
                    '',
                    'error'
                ).then(function () {
                    window.location.reload();
                })
            })
    }

    function openCity3(evt, cityName) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("sideKick");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("magicB");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(cityName).style.display = "block";
        evt.currentTarget.className += " active";
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
            <h6 className="text-center">Your Booking</h6>
            {Booking.length > 0 ? (
                <>

                    <div className="d-flex px-4 pb-3 Lunatic" style={{ gap: 1 + "%" }}>
                        <button id="SickSidekick" onClick={(e) => openCity3(e, "Booking1")} className="noPlusElf tabcclink active">Active</button>
                        <button onClick={(e) => openCity3(e, "Booking2")} className="noPlusElf tabcclink">History</button>
                    </div>
                    <div className="sideKick" id="Booking1">
                        {Booking.data ? (
                            <>
                                {Object.values(Booking).map((i) => {
                                    const date = new Date(i.createdAt).toLocaleDateString()
                                    const time = new Date(i.createdAt).toLocaleTimeString()
                                    const date2 = new Date(i.date).toLocaleDateString()
                                    const time2 = new Date(i.date).toLocaleTimeString()
                                    const datetime = date + " - " + time
                                    const datetime2 = date2 + " - " + time2
                                    var title = ""
                                    if (i.status === 1) {
                                        title = "Pending"
                                    }
                                    if (i.status === 2) {
                                        title = "Serving"
                                    }
                                    return (
                                        <div key={i._id} className="p-4">
                                            <div className="coverNOut">
                                                <p><b>Booking id</b> : {i._id}</p>
                                                <p><b>Date created</b> : {datetime}</p>
                                            </div>
                                            <div className="coverNOut">
                                                <p><b>People</b> : {i.people}</p>
                                                <p><b>Date Arrived</b> : {datetime2}</p>
                                            </div>
                                            <div className="coverNOut">
                                                <p><b>Status</b> : {title}</p>
                                                {i.table ? (
                                                    <p><b>Table</b> : {i.table}</p>
                                                ) : null}
                                            </div>
                                            <div className="hugeImpace">
                                                <p><b>Message</b> : </p>
                                                <textarea style={{ height: 20 + "vh" }} className="textDeny" defaultValue={i.message} />
                                            </div>
                                            {i.status === 1 ? (
                                                <>
                                                    <button onClick={() => setOpenOOO(true)} className="btn btn-danger">Cancel</button>
                                                    {openOOO ? (
                                                        <form onSubmit={(e) => CancelBooking(e, i._id)} className="hugeImpace pt-3">
                                                            <p className="text-white m-0"><b>Reason</b> : </p>
                                                            <textarea onChange={(e) => setCancelReason(e.target.value)} className="textDeny" placeholder="Reason....." required />
                                                            <div className="d-flex" style={{ gap: 1 + "%" }}>
                                                                <button type="submit" className="btn btn-primary">Confirm</button>
                                                                <button onClick={() => setOpenOOO(false)} type="button" className="btn btn-secondary">Cancel</button>
                                                            </div>
                                                        </form>
                                                    ) : null}
                                                </>
                                            ) : null}
                                        </div>
                                    )
                                })}
                            </>
                        ) : (
                            <p className="text-center">Your booking is empty!</p>
                        )}
                    </div>
                    <div className="sideKick" id="Booking2">
                        <div className="p-4">
                            <table className="table table-bordered solotable text-center">
                                <thead>
                                    <tr>
                                        <th >Name</th>
                                        <th className="thhuhu">Phone number</th>
                                        <th className="thhuhu">Date</th>
                                        <th >Status</th>
                                        <th ></th>
                                    </tr>
                                </thead>
                                {BookingHistory.map(i => {
                                    const date = new Date(i.createdAt).toLocaleDateString()
                                    const time = new Date(i.createdAt).toLocaleTimeString()
                                    const datetime = date + " - " + time
                                    var stau = ""
                                    if (i.status === 3) {
                                        stau = "Completed"
                                    }
                                    if (i.status === 4) {
                                        stau = "Denied"
                                    }
                                    if (i.status === 5) {
                                        stau = "Canceled"
                                    }
                                    return (
                                        <tbody key={i._id}>
                                            <tr style={{ verticalAlign: "middle" }}>
                                                <td>{i.customer?.fullname}</td>
                                                <td className="thhuhu">{i.customer?.phonenumber}</td>
                                                <td className="thhuhu">{datetime}</td>
                                                <td>{stau}</td>
                                                <td><button onClick={() => { setModalData(i); setModalOpenDetail(true) }} className='btn btn-success'>Detail</button></td>
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
                        </div>
                    </div>
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
                                height: "60vh",
                                zIndex: 999
                            },
                        }}>
                        <h2 className='text-center'>Booking Detail</h2>
                        <div className="coverNOut">
                            <p className="m-0"><b>Id</b> : {ModalData._id}</p>
                            <p className="m-0"><b>Date</b> : {datemodal}</p>
                        </div>
                        <hr />
                        <div className="coverNOut">
                            <p><b>Name</b> : {ModalData.customer?.fullname}</p>
                            {ModalData.employee?.map((w) => {
                                return (
                                    <p key={w}><b>Employee</b> : {w.email}</p>
                                )
                            })}
                        </div>
                        <div className="hugeImpace">
                            <p><b>Phone Number</b> : {ModalData.customer?.phonenumber}</p>
                            <p><b>People</b> : {ModalData.people}</p>
                            {ModalData.fulltotal ? (
                                <p><b>Fulltotal</b> : {VND.format(ModalData.fulltotal)}</p>
                            ) : null}
                            <p><b>Date Arrived</b> : {datemodal2}</p>
                            {ModalData.status === 3 ? (
                                <p><b>Status</b> : Completed</p>
                            ) : ModalData.status === 4 ? (
                                <p><b>Status</b> : Denied</p>
                            ) : ModalData.status === 5 ? (
                                <p><b>Status</b> : Canceled</p>
                            ) : null}
                            <p><b>Note</b> : </p>
                            <textarea className="contactMessage" style={{ pointerEvents: "none" }} defaultValue={ModalData.message} />
                        </div>
                        {ModalData.status === 3 ? (
                            <p>✅ Booking has been <b>Completed</b></p>
                        ) : ModalData.status === 4 ? (
                            <>
                                <p>❌ Booking has been <b>Denied</b></p>
                                <p>Reason : {ModalData.denyreason}</p>
                            </>
                        ) : ModalData.status === 5 ? (
                            <>
                                <p>❌ Booking has been <b>Canceled</b></p>
                                <p>Reason : {ModalData.denyreason}</p>
                            </>
                        ) : null}
                        <button className='closeModal' onClick={() => setModalOpenDetail(false)}>x</button>
                    </Modal>
                </>
            ) : (
                <p className="text-center">There's nothing here yet! Go Booking Now</p>
            )}
        </>
    )
}
export default UserBookingPanel