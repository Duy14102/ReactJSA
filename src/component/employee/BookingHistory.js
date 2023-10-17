import axios from "axios"
import { useState, useEffect, useRef } from "react"
import ReactPaginate from "react-paginate";
import Modal from 'react-modal';

function BookingHistory() {
    const [booking, setBooking] = useState([])
    const [ModalData, setModalData] = useState([])
    const [modalOpenDetail, setModalOpenDetail] = useState(false);
    const [pageCount, setPageCount] = useState(6);
    const currentPage = useRef();
    const limit = 8

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
            url: "http://localhost:3000/GetBookingHistory",
            params: {
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
                    <tr className="text-white text-center" style={{ background: "#374148" }}>
                        <th >Name</th>
                        <th className="thhuhu">Email</th>
                        <th className="thhuhu">Date</th>
                        <th >Status</th>
                        <th ></th>
                    </tr>
                </thead>
                {booking.map(i => {
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
                    return (
                        <tbody key={i._id}>
                            <tr style={{ background: "#2C343A", color: "lightgray", verticalAlign: "middle" }}>
                                <td>{i.name}</td>
                                <td className="thhuhu">{i.email}</td>
                                <td className="thhuhu">{datetime}</td>
                                <td>{stau}</td>
                                <td onClick={setModalOpenDetail}><button onClick={() => setModalData(i)} className='btn btn-success'>Detail</button></td>
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
                    <p><b>Name</b> : {ModalData.name}</p>
                    {ModalData.employee?.map((w) => {
                        return (
                            <p key={w}><b>Employee</b> : {w.email}</p>
                        )
                    })}
                </div>
                <div className="hugeImpace">
                    <p><b>Phone Number</b> : {ModalData.phone}</p>
                    <p><b>People</b> : {ModalData.people}</p>
                    {ModalData.fulltotal ? (
                        <p><b>Fulltotal</b> : {VND.format(ModalData.fulltotal)}</p>
                    ) : null}
                    <p><b>Date Arrived</b> : {datemodal2}</p>
                    {ModalData.status === 3 ? (
                        <p><b>Status</b> : Completed</p>
                    ) : ModalData.status === 4 ? (
                        <p><b>Status</b> : Denied</p>
                    ) : null}
                    <p><b>Note</b> : </p>
                    <textarea className="contactMessage" style={{ pointerEvents: "none" }} defaultValue={ModalData.message} />
                </div>
                {ModalData.status === 3 ? (
                    <p>✅ Order has been <b>Completed</b></p>
                ) : ModalData.status === 4 ? (
                    <>
                        <p>❌ Order has been <b>Denied</b></p>
                        <p>Reason : {ModalData.denyreason}</p>
                    </>
                ) : null}
                <button className='closeModal' onClick={() => setModalOpenDetail(false)}>x</button>
            </Modal>
        </>
    )
}
export default BookingHistory