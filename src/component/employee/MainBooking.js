import { useEffect, useState, useRef } from "react";
import GetBooking from "./GetBooking";
import BookingHistory from "./BookingHistory";
import Modal from 'react-modal';
import axios from "axios";
import ReactPaginate from "react-paginate";
import $ from 'jquery'
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

function MainBooking() {
    const cookies = new Cookies()
    const token = cookies.get("TOKEN")
    const decode = jwtDecode(token)
    const deliverEmployee = { id: decode.userId, email: decode.userEmail }
    const takeEmployee = []
    takeEmployee.push(deliverEmployee)
    const [modalOpenAdmin, setModalOpenAdmin] = useState(false);
    const [modalOpenAdmin2, setModalOpenAdmin2] = useState(false);
    const [ModalData, setModalData] = useState([])
    const [GetTable, setGetTable] = useState([])
    const [DateInput, setDateInput] = useState()
    const [openTable, setOpenTable] = useState(false)
    const [dataafter, setDataAfter] = useState([])
    const [correct, setCorrect] = useState(false)
    const [deny, setDeny] = useState(false)
    const [CheckTableId, setCheckTableId] = useState(false)
    const [Denyreason, setDenyreason] = useState("")
    const [TableId, setTableId] = useState()

    const [pageCount, setPageCount] = useState(6);
    const currentPage = useRef();
    const limit = 8

    useEffect(() => {
        currentPage.current = 1;
        document.getElementById("defaultOpen").click();
    }, [])

    function handlePageClick(e) {
        currentPage.current = e.selected + 1
        findBooking();
    }

    function getTableActive() {
        const configuration = {
            method: "get",
            url: "https://eatcom.onrender.com/GetAllTableActive",
        }
        axios(configuration)
            .then((res) => {
                setGetTable(res.data.data)
            }).catch((err) => {
                console.log(err);
            })
    }

    const findBooking = (e) => {
        e?.preventDefault()
        const configuration = {
            method: "get",
            url: "https://eatcom.onrender.com/SearchAllBooking",
            params: {
                date: DateInput,
                page: currentPage.current,
                limit: limit
            },
        };
        axios(configuration)
            .then((result) => {
                setOpenTable(true)
                getTableActive()
                setDataAfter(result.data.results.result);
                setPageCount(result.data.results.pageCount)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const addTableBooking = (e, id) => {
        e.preventDefault()
        let selText = $("#box1Y option:selected").text();
        console.log(selText);
        if (TableId) {
            const configuration = {
                method: "post",
                url: "https://eatcom.onrender.com/AddTableCustomer",
                data: {
                    tableid: TableId,
                    tablename: selText,
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
            url: "https://eatcom.onrender.com/DenyBookingCustomer",
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

    function openCity(evt, cityName) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("MBbutton");
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

    var statusCheck = ""
    const date = new Date(ModalData.createdAt).toLocaleDateString()
    const time = new Date(ModalData.createdAt).toLocaleTimeString()
    const date2 = new Date(ModalData.date).toLocaleDateString()
    const time2 = new Date(ModalData.date).toLocaleTimeString()
    const datemodal = date + " - " + time
    const datemodal2 = date2 + " - " + time2
    return (
        <>
            <div className="myDIVdad">
                <div style={{ gap: 5 + "%" }} id="myDIV" className="d-flex align-items-center">
                    <button id="defaultOpen" className="MBbutton active" onClick={(e) => openCity(e, 'London')}><p >Booking Table</p></button>
                    <button className="MBbutton" onClick={(e) => openCity(e, 'Tokyo')}><p>Booking History</p></button>
                </div>
                <button onClick={() => setModalOpenAdmin(true)} className="btn btn-primary">🔎 Booking</button>
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
                    <h2 className='text-center'>Input booking date</h2>
                    <div className='overOutsider'>
                        <div className='outsider'>
                            <form onSubmit={(e) => findBooking(e)}>
                                <input type='submit' style={{ display: "none" }} />
                                <div className='d-flex justify-content-between w-100'>
                                    <input onInput={(e) => setDateInput(e.target.value)} type='date' required />
                                    <button style={{ width: 10 + "%" }} type="submit"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" /></svg></button>
                                </div>
                            </form>
                        </div>
                    </div>
                    {openTable ? (
                        <>
                            <table className='table solotable mt-3 text-center'>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th className='thhuhu'>Phone number</th>
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
                                            statusCheck = "Serving"
                                        }
                                        else if (i.status === 3) {
                                            statusCheck = "Completed"
                                        }
                                        else if (i.status === 4) {
                                            statusCheck = "Denied"
                                        }
                                        else if (i.status === 5) {
                                            statusCheck = "Canceled"
                                        }
                                        return (
                                            <tr key={i._id}>
                                                <td className='thhuhu'>{i.customer?.fullname}</td>
                                                <td className='thhuhu'>{i.customer?.phonenumber}</td>
                                                <td>{datetime}</td>
                                                <td>{statusCheck}</td>
                                                <td><button onClick={() => { setModalOpenAdmin(false); setModalOpenAdmin2(true); setModalData(i) }} className='btn btn-success'>Detail</button></td>
                                            </tr>
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
                <h2 className='text-center'>Booking Detail</h2>
                <div className="coverNOut">
                    <p className="m-0"><b>Id</b> : {ModalData._id}</p>
                    <p className="m-0"><b>Date</b> : {datemodal}</p>
                </div>
                <hr />
                <div className="hugeImpace">
                    <p><b>Name</b> : {ModalData.customer?.fullname}</p>
                    <p><b>Phone Number</b> : {ModalData.customer?.phonenumber}</p>
                    <p><b>People</b> : {ModalData.people}</p>
                    {ModalData.fulltotal ? (
                        <p><b>Fulltotal</b> : {VND.format(ModalData.fulltotal)}</p>
                    ) : null}
                    <p><b>Date Arrived</b> : {datemodal2}</p>
                    <p><b>Status</b> : {statusCheck}</p>
                    <p><b>Note</b> : </p>
                    <textarea className="contactMessage" style={{ pointerEvents: "none" }} defaultValue={ModalData.message} />
                    {ModalData.status === 1 ? (
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
                    ) : null}
                </div>
                {correct ? (
                    <div className="pt-3">
                        <p>Choosing Table : </p>
                        <form onSubmit={(e) => addTableBooking(e, ModalData._id)}>
                            <div className="ytui" style={{ gap: 2 + "%" }}>
                                <select id="box1Y" onInput={(e) => setTableId(e.target.value)} className="neul" required>
                                    <option selected disabled hidden>Choose Table</option>
                                    {Object.values(GetTable).map((i) => {
                                        return (
                                            <option value={i._id} key={i._id}>{i.tablename}</option>
                                        )
                                    })}
                                </select>
                                {CheckTableId ? (
                                    <p className="m-0 neul text-danger text-nowrap">Table need to be choose!</p>
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
                <button className='closeModal' onClick={() => { setModalOpenAdmin2(false); setModalOpenAdmin(true) }}>x</button>
            </Modal>
            <div id="London" className="tabcontent">
                <div className="pt-4">
                    <GetBooking />
                </div>
            </div>

            <div id="Tokyo" className="tabcontent">
                <div className="pt-4">
                    <BookingHistory />
                </div>
            </div>
        </>
    )
}
export default MainBooking