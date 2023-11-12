import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from 'axios'

function Footer() {
    const [address, setAddress] = useState()
    const [phone, setPhone] = useState()
    const [email, setEmail] = useState()
    const [time, setTime] = useState()

    useEffect(() => {
        const configuration = {
            method: "get",
            url: "http://localhost:3000/GetTheFooter"
        }
        axios(configuration)
            .then((res) => {
                setAddress(res.data.data.word.up)
                setPhone(res.data.data.word.middle)
                setEmail(res.data.data.word.down)
                setTime(res.data.data.word.time)
            }).catch((err) => {
                console.log(err);
            })
    }, [])
    return (
        <div className="container-fluid bg-dark text-light footer pt-5 fadeIn">
            <div className="container py-5">
                <div className="row g-5">
                    <div className="col-lg-3 col-md-6">
                        <h4 className="section-title ff-secondary text-start text-primary fw-normal mb-4">Company</h4>
                        <NavLink reloadDocument to="/TrackOrder" className="btn btn-link" >Tracking Order</NavLink>
                        <NavLink reloadDocument to="/ContactSite" className="btn btn-link" >Contact Us</NavLink>
                        <NavLink reloadDocument to="/BookingSite" className="btn btn-link" >Booking Table</NavLink>
                        <NavLink reloadDocument to="/PAndT" className="btn btn-link" >Terms & Condition</NavLink>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <h4 className="section-title ff-secondary text-start text-primary fw-normal mb-4">Contact</h4>
                        <p className="mb-2"><i className="fi fi-ss-marker me-3"></i>{address}</p>
                        <p className="mb-2"><i className="fi fi-sr-phone-call me-3"></i>{phone}</p>
                        <p className="mb-2"><i className="fi fi-sr-envelope me-3"></i>{email}</p>
                        <div className="d-flex pt-2">
                            <NavLink to="/" className="btn btn-outline-light btn-social" ><i style={{ height: 16 + "px" }} className="fi fi-brands-twitter-alt"></i></NavLink>
                            <NavLink to="/" className="btn btn-outline-light btn-social" ><i style={{ height: 16 + "px" }} className="fi fi-brands-facebook"></i></NavLink>
                            <NavLink to="/" className="btn btn-outline-light btn-social" ><i style={{ height: 16 + "px" }} className="fi fi-brands-instagram"></i></NavLink>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <h4 className="section-title ff-secondary text-start text-primary fw-normal mb-4">Opening</h4>
                        <h5 className="text-light fw-normal">All week</h5>
                        <p>{time}</p>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <h4 className="section-title ff-secondary text-start text-primary fw-normal mb-4">Newsletter</h4>
                        <p>Enter email to receive exclusive specials and offers.</p>
                        <div className="position-relative mx-auto" style={{ maxWidth: 400 + "px" }}>
                            <input className="form-control border-primary w-100 pe-5" type="text" placeholder="Your email" />
                            <button type="button" className="btn btn-primary position-absolute top-0 end-0">SignUp</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="copyright">
                    <div className="row">
                        <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                            &copy; <NavLink to="/" className="border-bottom">EatCom</NavLink>, 2023 All Right Reserved.
                        </div>
                        <div className="col-md-6 text-center text-md-end">
                            <div className="footer-menu">
                                <NavLink to="/" >Cookies</NavLink>
                                <NavLink to="/" >Help</NavLink>
                                <NavLink to="/" >FQAs</NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
export default Footer;