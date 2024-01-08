import { jwtDecode } from "jwt-decode";
import { Fragment } from "react";
import { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";
import Cookies from "universal-cookie";
import socketIOClient from "socket.io-client";

function Reservation() {
    var candecode = null
    const cookies = new Cookies()
    const token = cookies.get("TOKEN");
    if (token) {
        candecode = jwtDecode(token)
    }
    const socketRef = useRef();
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
    const [alertCheck, setAlertCheck] = useState(false)
    const datetime = new Date().getTime()
    const date2 = new Date(date).getTime()
    const checkPhone = /((09|03|07|08|05)+([0-9]{8})\b)/g

    function Success() {
        Swal.fire(
            'Successfully!',
            '',
            'success'
        ).then(function () {
            window.location.reload();
        })
    }

    function Fail() {
        Swal.fire(
            'Fail!',
            ``,
            'error'
        )
    }

    useEffect(() => {
        socketRef.current = socketIOClient.connect("http://localhost:3000")

        socketRef.current.on('AddNewBookingSuccess', dataGot => {
            if (dataGot.check === localStorage.getItem("CheckBook")) {
                localStorage.removeItem("CheckBook")
                Success()
            }
        })

        socketRef.current.on('AddNewBookingFail', dataGot => {
            if (dataGot.check === localStorage.getItem("CheckBook")) {
                localStorage.removeItem("CheckBook")
                Fail()
            }
        })

        socketRef.current.on('CancelBookingSuccess', dataGot => {
            if (dataGot?.data === candecode?.userId) {
                Success()
            }
        })

        socketRef.current.on('CancelBookingFail', dataGot => {
            if (dataGot?.data === candecode?.userId) {
                Fail()
            }
        })

        socketRef.current.on('DenyBookingSuccess', dataGot => {
            if (candecode?.userId === dataGot?.data) {
                called()
            }
        })

        socketRef.current.on('AddTableCustomerSuccess', dataGot => {
            if (candecode?.userId === dataGot?.data) {
                called()
            }
        })

        socketRef.current.on('ChangeTableSuccess', dataGot => {
            if (candecode?.userId === dataGot?.data) {
                called()
            }
        })

        socketRef.current.on('CheckoutBookingSuccess', dataGot => {
            if (dataGot?.data !== candecode?.userId) {
                called()
            }
        })

        return () => {
            socketRef.current.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const called = () => {
        fetch(`http://localhost:3000/GetTokenBooking?id=${candecode?.userId}`, {
            method: "get",
        }).then((res) => res.json()).then((data) => {
            setBookingBook(data)
        })
    }

    useEffect(() => {
        if (token) {
            const decode = jwtDecode(token)
            if (decode.userRole !== 1.5) {
                fetch(`http://localhost:3000/GetDetailUser?userid=${decode.userId}`, {
                    method: "get",
                }).then((res) => res.json()).then((data) => {
                    setGetUser(data)
                })
            }
            called()
        }
        if (navigator.userAgent.indexOf('Safari') !== -1 &&
            navigator.userAgent.indexOf('Chrome') === -1) {
            const adde = document.getElementById("datetime")
            const adde2 = document.getElementById("select1")
            if (adde) {
                adde.classList.add("safari")
            }
            if (adde2) {
                adde2.classList.add("roundSafari")
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token])

    useEffect(() => {
        if (date2 >= datetime) {
            setCheckDate(false)
        } else if (date2 < datetime) {
            setCheckDate(true)
        }

        if (candecode?.userRole !== 1.5) {
            Object.values(getUser).map((i) => {
                setName(i.fullname)
                setPhone(i.phonenumber)
                setTokeId(i._id)
                return null
            })
        } else if (candecode?.userRole === 1.5) {
            setName(candecode?.userName)
            setTokeId(candecode?.userId)
        }
    }, [date2, datetime, candecode?.userRole, getUser, candecode?.userName, candecode?.userId])

    const AddNewTable = (e) => {
        e.preventDefault()
        if (!candecode) {
            if (!checkPhone.test(phone)) {
                setAlertCheck(true)
                return false
            }
        }

        if (date2 >= datetime) {
            setCheckDate(false)
            const customer = { id: tokeId, fullname: name, phonenumber: phone }
            const data = { customer, date, people, message }
            localStorage.setItem("CheckBook", phone)
            socketRef.current.emit('AddNewBookingSocket', data)
        } else if (date2 < datetime) {
            setCheckDate(true)
        }
    }

    const CancelBooking = (e, id) => {
        e.preventDefault()
        const data = { id: id, reason: cancelReason, userid: tokeId }
        socketRef.current.emit('CancelBookingSocket', data)
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
                                                        {alertCheck ? (
                                                            <p className="m-0 pt-1 text-danger">Phone number invalid!</p>
                                                        ) : null}
                                                    </div>
                                                </>
                                            )}
                                            {candecode?.userRole === 1.5 ? (
                                                <div className="col-md-6">
                                                    <label htmlFor="phone" >Your Phone Number</label>
                                                    <input value={phone} onChange={(e) => setPhone(e.target.value)} type="number" className="cutOut" id="phone" placeholder="Your Phone Number" required />
                                                    {alertCheck ? (
                                                        <p className="m-0 pt-1 text-danger">Phone number invalid!</p>
                                                    ) : null}
                                                </div>
                                            ) : null}
                                            <div className="col-md-6">
                                                <label htmlFor="datetime" >Date & Time</label>
                                                <input onChange={(e) => setDate(e.target.value)} type="datetime-local" className="cutOut datetimepicker-input" id="datetime" placeholder="📅" required />
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