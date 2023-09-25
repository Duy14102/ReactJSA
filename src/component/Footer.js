import { NavLink } from "react-router-dom";

function Footer() {
    return (
        <div className="container-fluid bg-dark text-light footer pt-5 wow fadeIn" data-wow-delay="0.1s">
            <div className="container py-5">
                <div className="row g-5">
                    <div className="col-lg-3 col-md-6">
                        <h4 className="section-title ff-secondary text-start text-primary fw-normal mb-4">Company</h4>
                        <NavLink to="/AboutSite" className="btn btn-link" >About Us</NavLink>
                        <NavLink to="/ContactSite" className="btn btn-link" >Contact Us</NavLink>
                        <NavLink to="/BookingSite" className="btn btn-link" >Reservation</NavLink>
                        <NavLink to="/PAndT" className="btn btn-link" >Privacy Policy</NavLink>
                        <NavLink to="/PAndT" className="btn btn-link" >Terms & Condition</NavLink>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <h4 className="section-title ff-secondary text-start text-primary fw-normal mb-4">Contact</h4>
                        <p className="mb-2"><i className="fa fa-map-marker-alt me-3"></i>18 Tam Trinh, Ha Noi, Viet Nam</p>
                        <p className="mb-2"><i className="fa fa-phone-alt me-3"></i>+012 345 67890</p>
                        <p className="mb-2"><i className="fa fa-envelope me-3"></i>FreeFire@SDTHT.com</p>
                        <div className="d-flex pt-2">
                            <NavLink to="/" className="btn btn-outline-light btn-social" ><i className="fab fa-twitter"></i></NavLink>
                            <NavLink to="/" className="btn btn-outline-light btn-social" ><i className="fab fa-facebook-f"></i></NavLink>
                            <NavLink to="/" className="btn btn-outline-light btn-social" ><i className="fab fa-youtube"></i></NavLink>
                            <NavLink to="/" className="btn btn-outline-light btn-social" ><i className="fab fa-linkedin-in"></i></NavLink>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <h4 className="section-title ff-secondary text-start text-primary fw-normal mb-4">Opening</h4>
                        <h5 className="text-light fw-normal">Monday - Saturday</h5>
                        <p>09AM - 09PM</p>
                        <h5 className="text-light fw-normal">Sunday</h5>
                        <p>10AM - 08PM</p>
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
                                <NavLink to="/" >Home</NavLink>
                                <NavLink to="/" >Cookies</NavLink>
                                <NavLink to="/" >Help</NavLink>
                                <NavLink to="/" >FQAs</NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Footer;