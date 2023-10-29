import { Link } from "react-router-dom";
function About() {
    return (
        <div className="container-fluid bg-white py-5">
            <div className="container">
                <div className="row g-5 align-items-center">
                    <div className="col-lg-6">
                        <div className="row g-3">
                            <div className="col-6 text-start">
                                <img loading="lazy" className="img-fluid rounded w-100 wow zoomIn" data-wow-delay="0.1s" src={require('../assets/image/about-1.jpg')} alt="about1" />
                            </div>
                            <div className="col-6 text-start" style={{ position: "relative" }}>
                                <img loading="lazy" className="img-fluid rounded w-75 wow zoomIn" data-wow-delay="0.3s" src={require('../assets/image/about-2.jpg')} alt="about2" style={{ position: "absolute", bottom: 0 }} />
                            </div>
                            <div className="col-6 text-end">
                                <img loading="lazy" className="img-fluid rounded w-75 wow zoomIn" data-wow-delay="0.5s" src={require('../assets/image/about-3.jpg')} alt="about3" />
                            </div>
                            <div className="col-6 text-end">
                                <img loading="lazy" className="img-fluid rounded w-100 wow zoomIn" data-wow-delay="0.7s" src={require('../assets/image/about-4.jpg')} alt="about4" />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <h5 className="section-title ff-secondary text-start text-primary fw-normal">About Us</h5>
                        <h1 className="mb-4">Welcome to <i className="fa fa-utensils text-primary me-2"></i>EatCom</h1>
                        <p className="mb-4">We started from a small cart with a variety of rice dishes. Time passed and gradually more people got to know us and the name EatCom was born.</p>
                        <p className="mb-4">We always feel lucky to have received support from everyone, EatCom always brings diners perfect rice dishes from delicious to clean and beautiful.Thank you for trusting and using our services</p>
                        <div className="row g-4 mb-4">
                            <div className="col-sm-6">
                                <div className="d-flex align-items-center border-start border-5 border-primary px-3">
                                    <h1 className="flex-shrink-0 display-5 text-primary mb-0" data-toggle="counter-up">5</h1>
                                    <div className="ps-4">
                                        <p className="mb-0">Years of</p>
                                        <h6 className="text-uppercase mb-0">Experience</h6>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="d-flex align-items-center border-start border-5 border-primary px-3">
                                    <h1 className="flex-shrink-0 display-5 text-primary mb-0" data-toggle="counter-up">10</h1>
                                    <div className="ps-4">
                                        <p className="mb-0">Certificate</p>
                                        <h6 className="text-uppercase mb-0">Chefs</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Link to={""} className="btn btn-primary py-3 px-5 mt-2">Read More</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default About;