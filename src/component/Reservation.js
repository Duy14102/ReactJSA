import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { Fragment } from "react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Cookies from "universal-cookie";

function Reservation() {
    const cookies = new Cookies()
    const token = cookies.get("TOKEN");
    const [name, setName] = useState()
    const [tokeId, setTokeId] = useState("None")
    const [phone, setPhone] = useState()
    const [date, setDate] = useState()
    const [people, setPeople] = useState()
    const [message, setMessage] = useState()
    const [cancelReason, setCancelReason] = useState()
    const [getUser, setGetUser] = useState([])
    const [bookingBook, setBookingBook] = useState(null)
    const [checkDate, setCheckDate] = useState(false)
    const [openOOO, setOpenOOO] = useState(false)
    const datetime = new Date().getTime()
    const date2 = new Date(date).getTime()

    useEffect(() => {
        if (token) {
            const decode = jwtDecode(token)
            fetch(`http://localhost:3000/GetDetailUser?userid=${decode.userId}`, {
                method: "get",
            }).then((res) => res.json()).then((data) => {
                setGetUser(data)
            })

            fetch(`http://localhost:3000/GetTokenBooking?id=${decode.userId}`, {
                method: "get",
            }).then((res) => res.json()).then((data) => {
                setBookingBook(data)
            })
        }
    }, [token])

    useEffect(() => {
        if (date2 >= datetime) {
            setCheckDate(false)
        } else if (date2 < datetime) {
            setCheckDate(true)
        }

        Object.values(getUser).map((i) => {
            setName(i.fullname)
            setPhone(i.phonenumber)
            setTokeId(i._id)
            return null
        })
    }, [date2, datetime, getUser])

    const AddNewTable = (e) => {
        e.preventDefault()
        const customer = { id: tokeId, fullname: name, phonenumber: phone }
        const configuration = {
            method: "post",
            url: "http://localhost:3000/AddNewBooking",
            data: {
                customer,
                date,
                people,
                message
            }
        }
        if (date2 >= datetime) {
            setCheckDate(false)
            axios(configuration)
                .then(() => {
                    Swal.fire(
                        'Booking Successfully!',
                        '',
                        'success'
                    ).then(function () {
                        window.location.reload();
                    })
                }).catch((error) => {
                    Swal.fire(
                        'Booking Fail!',
                        `${error.response.data.message}`,
                        'error'
                    ).then(function () {
                        window.location.reload();
                    })
                })
        } else if (date2 < datetime) {
            setCheckDate(true)
        }
    }

    const CancelBooking = (e, id) => {
        e.preventDefault()
        const configuration = {
            method: "post",
            url: "http://localhost:3000/CancelBooking",
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
    return (
        <>
            <div className="container-fluid py-5 px-0 wow fadeInUp" data-wow-delay="0.1s">
                <div className="d-flex g-0">
                    <div className="col-md-6">
                        <div className="video">
                        </div>
                    </div>
                    <div className="col-md-6 bg-white">
                        <div className="p-5 wow fadeInUp" data-wow-delay="0.2s">
                            <h5 className="section-title ff-secondary text-start text-primary fw-normal">Booking</h5>
                            {bookingBook?.data ? (
                                <>
                                    <h2 className="mb-4 text-nowrap">Your Booking Information</h2>
                                    <hr />
                                    {Object.values(bookingBook).map((i) => {
                                        const date = new Date(i?.createdAt).toLocaleDateString()
                                        const time = new Date(i?.createdAt).toLocaleTimeString()
                                        const date2 = new Date(i?.date).toLocaleDateString()
                                        const time2 = new Date(i?.date).toLocaleTimeString()
                                        const datetime = date + " - " + time
                                        const datetime2 = date2 + " - " + time2
                                        var title = ""
                                        if (i.status === 1) {
                                            title = "Pending"
                                        } else if (i.status === 2) {
                                            title = "Serving"
                                        }
                                        return (
                                            <Fragment key={i?.customer.id}>
                                                <div className="coverNOut ">
                                                    <p><b>Name</b> : {i?.customer.fullname}</p>
                                                    <p><b>Date</b> : {datetime}</p>
                                                </div>
                                                <div className="coverNOut">
                                                    <p><b>People</b> : {i?.people}</p>
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
                                                    <textarea style={{ height: 20 + "vh" }} className="textDeny" defaultValue={i?.message} />
                                                </div>
                                                {i.status === 1 ? (
                                                    <>
                                                        <button onClick={() => setOpenOOO(true)} className="btn btn-danger">Cancel</button>
                                                        {openOOO ? (
                                                            <form onSubmit={(e) => CancelBooking(e, i?._id)} className="hugeImpace pt-3">
                                                                <p className="m-0"><b>Reason</b> : </p>
                                                                <textarea onChange={(e) => setCancelReason(e.target.value)} className="textDeny" placeholder="Reason....." required />
                                                                <div className="d-flex" style={{ gap: 1 + "%" }}>
                                                                    <button type="submit" className="btn btn-primary">Confirm</button>
                                                                    <button onClick={() => setOpenOOO(false)} type="button" className="btn btn-secondary">Cancel</button>
                                                                </div>
                                                            </form>
                                                        ) : null}
                                                    </>
                                                ) : null}
                                            </Fragment>
                                        )
                                    })}
                                </>
                            ) : (
                                <>
                                    <h2 className="mb-4">Book A Table Online</h2>
                                    <form onSubmit={(e) => AddNewTable(e)}>
                                        <div className="row g-3">
                                            {token ? null : (
                                                <>
                                                    <div className="col-md-6">
                                                        <label htmlFor="name">Your Name</label>
                                                        <input value={name} onChange={(e) => setName(e.target.value)} type="text" className="cutOut" id="name" placeholder="Your Name" required />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label htmlFor="phone" >Your Phone Number</label>
                                                        <input value={phone} onChange={(e) => setPhone(e.target.value)} type="number" className="cutOut" id="phone" placeholder="Your Phone Number" required />
                                                    </div>
                                                </>
                                            )}
                                            <div className="col-md-6">
                                                <label htmlFor="datetime" >Date & Time</label>
                                                <input value={date} onChange={(e) => setDate(e.target.value)} type="datetime-local" className="cutOut datetimepicker-input" id="datetime" placeholder="Date & Time" required />
                                                {checkDate ? (
                                                    <p className="m-0 pt-1 text-danger">Date can't smaller than today!</p>
                                                ) : null}
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="select1">No Of People</label>
                                                <select value={people} onChange={(e) => setPeople(e.target.value)} className="cutOut" id="select1" required>
                                                    <option value={1}>People 1</option>
                                                    <option value={2}>People 2</option>
                                                    <option value={3}>People 3</option>
                                                    <option value={4}>People 4</option>
                                                    <option value={5}>People 5</option>
                                                    <option value={6}>People 6</option>
                                                </select>
                                            </div>
                                            <div className="col-12">
                                                <label htmlFor="message">Note</label>
                                                <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="cutOut" placeholder="Special Request" id="message" style={{ height: 100 + "px" }}></textarea>
                                            </div>
                                            <div className="col-12">
                                                <button className="btn btn-primary w-100 py-3" type="submit">Book Now</button>
                                            </div>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Reservation;