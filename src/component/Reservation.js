import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

function Reservation() {
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [date, setDate] = useState()
    const [people, setPeople] = useState()
    const [message, setMessage] = useState()
    const [checkDate, setCheckDate] = useState(false)
    const datetime = new Date().getTime()
    const date2 = new Date(date).getTime()

    useEffect(() => {
        if (date2 >= datetime) {
            setCheckDate(false)
        } else if (date2 < datetime) {
            setCheckDate(true)
        }
    }, [date2, datetime])

    const AddNewTable = (e) => {
        e.preventDefault()
        const configuration = {
            method: "post",
            url: "http://localhost:3000/AddNewBooking",
            data: {
                name,
                email,
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
                }).catch(() => {
                    Swal.fire(
                        'Booking Fail!',
                        '',
                        'error'
                    ).then(function () {
                        window.location.reload();
                    })
                })
        } else if (date2 < datetime) {
            setCheckDate(true)
        }
    }
    return (
        <>
            <div className="container-fluid py-5 px-0 wow fadeInUp" data-wow-delay="0.1s">
                <div className="d-flex g-0">
                    <div className="col-md-6">
                        <div className="video">
                        </div>
                    </div>
                    <div className="col-md-6 bg-dark d-flex align-items-center">
                        <div className="p-5 wow fadeInUp" data-wow-delay="0.2s">
                            <h5 className="section-title ff-secondary text-start text-primary fw-normal">Reservation</h5>
                            <h1 className="text-white mb-4">Book A Table Online</h1>
                            <form onSubmit={(e) => AddNewTable(e)}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input value={name} onChange={(e) => setName(e.target.value)} type="text" className="form-control" id="name" placeholder="Your Name" required />
                                            <label htmlFor="name">Your Name</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="form-control" id="email" placeholder="Your Email" required />
                                            <label htmlFor="email">Your Email</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-floating date" id="date3" data-target-input="nearest">
                                            <input value={date} onChange={(e) => setDate(e.target.value)} type="datetime-local" className="form-control datetimepicker-input" id="datetime" placeholder="Date & Time" required />
                                            <label htmlFor="datetime">Date & Time</label>
                                        </div>
                                        {checkDate ? (
                                            <p className="m-0 pt-1 text-danger">Date can't smaller than today!</p>
                                        ) : null}
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <select value={people} onChange={(e) => setPeople(e.target.value)} className="form-select" id="select1" required>
                                                <option value={1}>People 1</option>
                                                <option value={2}>People 2</option>
                                                <option value={3}>People 3</option>
                                                <option value={4}>People 4</option>
                                                <option value={5}>People 5</option>
                                                <option value={6}>People 6</option>
                                            </select>
                                            <label htmlFor="select1">No Of People</label>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-floating">
                                            <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="form-control" placeholder="Special Request" id="message" style={{ height: 100 + "px" }}></textarea>
                                            <label htmlFor="message">Note</label>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <button className="btn btn-primary w-100 py-3" type="submit">Book Now</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Reservation;