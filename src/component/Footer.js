import { Link } from "react-router-dom";

function Footer() {
    return (
        <div className="container-fluid bg-dark text-light footer pt-5 wow fadeIn" data-wow-delay="0.1s">
            <div className="container py-5">
                <div className="row g-5">
                    <div className="col-lg-3 col-md-6">
                        <h4 className="section-title ff-secondary text-start text-primary fw-normal mb-4">Company</h4>
                        <Link to="/AboutSite" className="btn btn-link" >About Us</Link>
                        <Link to="/ContactSite" className="btn btn-link" >Contact Us</Link>
                        <Link to="/BookingSite" className="btn btn-link" >Reservation</Link>
                        <Link to="/PAndT" className="btn btn-link" >Privacy Policy</Link>
                        <Link to="/PAndT" className="btn btn-link" >Terms & Condition</Link>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <h4 className="section-title ff-secondary text-start text-primary fw-normal mb-4">Contact</h4>
                        <p className="mb-2"><i className="fa fa-map-marker-alt me-3"></i>18 Tam Trinh, Ha Noi, Viet Nam</p>
                        <p className="mb-2"><i className="fa fa-phone-alt me-3"></i>+012 345 67890</p>
                        <p className="mb-2"><i className="fa fa-envelope me-3"></i>FreeFire@SDTHT.com</p>
                        <div className="d-flex pt-2">
                            <Link to={""} className="btn btn-outline-light btn-social" ><i className="fab fa-twitter"></i></Link>
                            <Link to={""} className="btn btn-outline-light btn-social" ><i className="fab fa-facebook-f"></i></Link>
                            <Link to={""} className="btn btn-outline-light btn-social" ><i className="fab fa-youtube"></i></Link>
                            <Link to={""} className="btn btn-outline-light btn-social" ><i className="fab fa-linkedin-in"></i></Link>
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
                            <input className="form-control border-primary w-100 py-3 ps-4 pe-5" type="text" placeholder="Your email" />
                            <button type="button" className="btn btn-primary position-absolute top-0 end-0">SignUp</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="copyright">
                    <div className="row">
                        <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                            &copy; <Link to={""} className="border-bottom">EatCom</Link>, 2023 All Right Reserved.
                        </div>
                        <div className="col-md-6 text-center text-md-end">
                            <div className="footer-menu">
                                <Link to={""} href="">Home</Link>
                                <Link to={""} href="">Cookies</Link>
                                <Link to={""} href="">Help</Link>
                                <Link to={""} href="">FQAs</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Footer;