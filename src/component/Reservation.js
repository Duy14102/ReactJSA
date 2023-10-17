import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

function Reservation() {
    const [name, setName] = useState()
    const [phone, setPhone] = useState()
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
                phone,
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
                                        <label htmlFor="name" className="text-white">Your Name</label>
                                        <input value={name} onChange={(e) => setName(e.target.value)} type="text" className="cutOut" id="name" placeholder="Your Name" required />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="phone" className="text-white">Your Phone Number</label>
                                        <input value={phone} onChange={(e) => setPhone(e.target.value)} type="number" className="cutOut" id="phone" placeholder="Your Phone Number" required />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="datetime" className="text-white">Date & Time</label>
                                        <input value={date} onChange={(e) => setDate(e.target.value)} type="datetime-local" className="cutOut datetimepicker-input" id="datetime" placeholder="Date & Time" required />
                                        {checkDate ? (
                                            <p className="m-0 pt-1 text-danger">Date can't smaller than today!</p>
                                        ) : null}
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="select1" className="text-white">No Of People</label>
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
                                        <label htmlFor="message" className="text-white">Note</label>
                                        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="cutOut" placeholder="Special Request" id="message" style={{ height: 100 + "px" }}></textarea>
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