function Contact() {
    return (
        <div className="container-xxl py-5">
            <div className="container">
                <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                    <h5 className="section-title ff-secondary text-center text-primary fw-normal">Contact Us</h5>
                    <h1 className="mb-5">Contact For Any Query</h1>
                </div>
                <div className="row g-4">
                    <div className="col-12">
                        <div className="row gy-4">
                            <div className="col-md-4">
                                <h5 className="section-title ff-secondary fw-normal text-start text-primary">Address</h5>
                                <p><i className="fa fa-map-marker-alt text-primary me-2"></i>18 Tam Trinh, Ha Noi, Viet Nam</p>
                            </div>
                            <div className="col-md-4">
                                <div>
                                    <h5 className="section-title ff-secondary fw-normal text-start text-primary">Phone Number</h5>
                                    <p><i className="fa fa-phone-alt text-primary me-2"></i>+012 345 67890</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <h5 className="section-title ff-secondary fw-normal text-start text-primary">Email</h5>
                                <p><i className="fa fa-envelope-open text-primary me-2"></i>FreeFire@SDTHT.com</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 wow fadeIn" data-wow-delay="0.1s">
                        <iframe title="0" className="position-relative rounded w-100 h-100"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.9583929265627!2d105.85957727590984!3d20.994304888959768!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ad11b1f441bf%3A0xcf480c26f8137a3a!2sVTC%20Online%20Building!5e0!3m2!1svi!2s!4v1687009497070!5m2!1svi!2s"
                            frameBorder="0" style={{ minHeight: 350 + "px", border: 0 }} allowFullScreen="" aria-hidden="false"
                            tabIndex="0"></iframe>
                    </div>
                    <div className="col-md-6">
                        <div className="wow fadeInUp" data-wow-delay="0.2s">
                            <form>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input type="text" className="form-control" id="name" placeholder="Your Name" />
                                            <label htmlFor="name">Your Name</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input type="email" className="form-control" id="email" placeholder="Your Email" />
                                            <label htmlFor="email">Your Email</label>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-floating">
                                            <input type="text" className="form-control" id="subject" placeholder="Subject" />
                                            <label htmlFor="subject">Subject</label>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-floating">
                                            <textarea className="form-control" placeholder="Leave a message here" id="message" style={{ height: 150 + "px" }}></textarea>
                                            <label htmlFor="message">Message</label>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <button className="btn btn-primary w-100 py-3" type="submit">Send Message</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Contact;