import jQuery from "jquery";
import "../lib/owlcarousel/assets/owl.carousel.min.css";
window.jQuery = jQuery
require('owl.carousel')
function Testimonial() {
    jQuery(function ($) {
        // Testimonials carousel
        $('.testimonial-carousel').owlCarousel({
            autoplay: true,
            smartSpeed: 1000,
            center: true,
            margin: 24,
            dots: true,
            loop: true,
            nav: false,
            responsive: {
                0: {
                    items: 1
                },
                768: {
                    items: 2
                },
                992: {
                    items: 3
                }
            }
        });
    });
    return (
        <>
            <div className="container-fluid py-5 wow fadeInUp" data-wow-delay="0.1s">
                <div className="container">
                    <div className="text-center">
                        <h5 className="section-title ff-secondary text-center text-primary fw-normal">Testimonial</h5>
                        <h1 className="mb-5">Our Clients Say!!!</h1>
                    </div>
                    <div className="owl-carousel testimonial-carousel">
                        <div className="testimonial-item bg-transparent border rounded p-4">
                            <i className="fa fa-quote-left fa-2x text-primary mb-3"></i>
                            <p>Dolor et eos labore, stet justo sed est sed. Diam sed sed dolor stet amet eirmod eos labore diam</p>
                            <div className="d-flex align-items-center">
                                <img loading="lazy" className="img-fluid flex-shrink-0 rounded-circle" alt="" src="img/testimonial-1.jpg" style={{ width: 50 + "px", height: 50 + "px" }} />
                                <div className="ps-3">
                                    <h5 className="mb-1">Client Name</h5>
                                    <small>Profession</small>
                                </div>
                            </div>
                        </div>
                        <div className="testimonial-item bg-transparent border rounded p-4">
                            <i className="fa fa-quote-left fa-2x text-primary mb-3"></i>
                            <p>Dolor et eos labore, stet justo sed est sed. Diam sed sed dolor stet amet eirmod eos labore diam</p>
                            <div className="d-flex align-items-center">
                                <img loading="lazy" className="img-fluid flex-shrink-0 rounded-circle" alt="" src="img/testimonial-2.jpg" style={{ width: 50 + "px", height: 50 + "px" }} />
                                <div className="ps-3">
                                    <h5 className="mb-1">Client Name</h5>
                                    <small>Profession</small>
                                </div>
                            </div>
                        </div>
                        <div className="testimonial-item bg-transparent border rounded p-4">
                            <i className="fa fa-quote-left fa-2x text-primary mb-3"></i>
                            <p>Dolor et eos labore, stet justo sed est sed. Diam sed sed dolor stet amet eirmod eos labore diam</p>
                            <div className="d-flex align-items-center">
                                <img loading="lazy" className="img-fluid flex-shrink-0 rounded-circle" alt="" src="img/testimonial-3.jpg" style={{ width: 50 + "px", height: 50 + "px" }} />
                                <div className="ps-3">
                                    <h5 className="mb-1">Client Name</h5>
                                    <small>Profession</small>
                                </div>
                            </div>
                        </div>
                        <div className="testimonial-item bg-transparent border rounded p-4">
                            <i className="fa fa-quote-left fa-2x text-primary mb-3"></i>
                            <p>Dolor et eos labore, stet justo sed est sed. Diam sed sed dolor stet amet eirmod eos labore diam</p>
                            <div className="d-flex align-items-center">
                                <img loading="lazy" className="img-fluid flex-shrink-0 rounded-circle" alt="" src="img/testimonial-4.jpg" style={{ width: 50 + "px", height: 50 + "px" }} />
                                <div className="ps-3">
                                    <h5 className="mb-1">Client Name</h5>
                                    <small>Profession</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Testimonial;