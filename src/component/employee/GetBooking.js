import axios from "axios"
import { useState, useEffect, useRef } from "react"
import ReactPaginate from "react-paginate";
import Modal from 'react-modal';
import Swal from "sweetalert2";
import Cookies from "universal-cookie";
import jwtDecode from "jwt-decode";

function GetTable() {
    const [booking, setBooking] = useState([])
    const [ModalData, setModalData] = useState([])
    const [GetTable, setGetTable] = useState([])
    const [TableId, setTableId] = useState()
    const [modalOpenDetail, setModalOpenDetail] = useState(false);
    const [Denyreason, setDenyreason] = useState("")
    const [correct, setCorrect] = useState(false)
    const [deny, setDeny] = useState(false)
    const [CheckTableId, setCheckTableId] = useState(false)

    const cookies = new Cookies()
    const token = cookies.get("TOKEN")
    const decode = jwtDecode(token)
    const deliverEmployee = { id: decode.userId, email: decode.userEmail }
    const takeEmployee = []
    takeEmployee.push(deliverEmployee)

    const [pageCount, setPageCount] = useState(6);
    const currentPage = useRef();
    const limit = 8

    useEffect(() => {
        currentPage.current = 1;
        getPagination()
        getTableActive()
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
                status: 1,
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

    function getTableActive() {
        const configuration = {
            method: "get",
            url: "http://localhost:3000/GetAllTableActive",
        }
        axios(configuration)
            .then((res) => {
                setGetTable(res.data.data)
            }).catch((err) => {
                console.log(err);
            })
    }

    const addTableBooking = (e, id) => {
        e.preventDefault()
        if (TableId) {
            const configuration = {
                method: "post",
                url: "http://localhost:3000/AddTableCustomer",
                data: {
                    tableid: TableId,
                    cusid: id
                }
            }
            axios(configuration)
                .then(() => {
                    Swal.fire(
                        'Booking Table Successfully!',
                        '',
                        'success'
                    ).then(function () {
                        window.location.reload()
                    })
                }).catch(() => {
                    Swal.fire(
                        'Booking Table Fail!',
                        '',
                        'error'
                    ).then(function () {
                        window.location.reload()
                    })
                })
        } else {
            setCheckTableId(true)
        }
    }

    const denybooking = (e, id) => {
        e.preventDefault()
        const configuration = {
            method: "post",
            url: "http://localhost:3000/DenyBookingCustomer",
            data: {
                id: id,
                status: 4,
                denyreason: Denyreason,
                employee: takeEmployee
            }
        }
        axios(configuration)
            .then(() => {
                Swal.fire(
                    'Denied Successfully!',
                    '',
                    'success'
                ).then(function () {
                    window.location.reload()
                })
            }).catch(() => {
                Swal.fire(
                    'Denied Fail!',
                    '',
                    'error'
                ).then(function () {
                    window.location.reload()
                })
            })
    }

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
                    if (i.status === 1) {
                        stau = "Pending"
                    }
                    return (
                        <tbody key={i._id}>
                            <tr style={{ background: "#2C343A", color: "lightgray", verticalAlign: "middle" }}>
                                <td>{i.name}</td>
                                <td>{i.email}</td>
                                <td>{datetime}</td>
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
                <p><b>Date Arrived</b> : {datemodal2}</p>
                {ModalData.status === 1 ? (
                    <p><b>Status</b> : Pending</p>
                ) : null}
                <p><b>Note</b> : </p>
                <textarea className="contactMessage" style={{ pointerEvents: "none" }} defaultValue={ModalData.message} />
                <div className="d-flex justify-content-around pt-2">
                    {correct ? (
                        <>
                            <button className="btn btn-success">Approve</button>
                            <button style={{ pointerEvents: "none", opacity: 0.5 }} className="btn btn-danger">Deny</button>
                        </>
                    ) : deny ? (
                        <>
                            <button style={{ pointerEvents: "none", opacity: 0.5 }} className="btn btn-success">Approve</button>
                            <button className="btn btn-danger">Deny</button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setCorrect(true)} className="btn btn-success">Approve</button>
                            <button onClick={() => setDeny(true)} className="btn btn-danger">Deny</button>
                        </>
                    )}
                </div>
                {correct ? (
                    <div className="pt-3">
                        <p>Choosing Table : </p>
                        <form onSubmit={(e) => addTableBooking(e, ModalData._id)}>
                            <div className="d-flex" style={{ gap: 2 + "%" }}>
                                <select onInput={(e) => setTableId(e.target.value)} className="w-25" required>
                                    <option selected disabled hidden>Choose Table</option>
                                    {Object.values(GetTable).map((i) => {
                                        return (
                                            <option value={i._id} key={i._id}>{i.tablename}</option>
                                        )
                                    })}
                                </select>
                                {CheckTableId ? (
                                    <p className="m-0 text-danger">Table need to be choose!</p>
                                ) : null}
                            </div>
                            <div style={{ gap: 1 + "%" }} className="d-flex mt-3">
                                <button type="submit" className="btn btn-primary ">Comfirm</button>
                                <button onClick={() => { setCheckTableId(false); setCorrect(false) }} className="btn btn-secondary ">Cancel</button>
                            </div>
                        </form>
                    </div>
                ) : deny ? (
                    <div className="pt-3">
                        <p>Reason why deny : </p>
                        <form onSubmit={(e) => denybooking(e, ModalData._id)}>
                            <textarea onChange={(e) => setDenyreason(e.target.value)} className="textDeny" required />
                            <div style={{ gap: 1 + "%" }} className="d-flex mt-2">
                                <button type="submit" className="btn btn-primary ">Comfirm</button>
                                <button onClick={() => setDeny(false)} className="btn btn-secondary ">Cancel</button>
                            </div>
                        </form>
                    </div>
                ) : null}
                <button className='closeModal' onClick={() => setModalOpenDetail(false)}>x</button>
            </Modal>
        </>
    )
}
export default GetTable