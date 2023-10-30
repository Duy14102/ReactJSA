import jQuery from "jquery";
import "../lib/owlcarousel/assets/owl.carousel.min.css";
import { useState, useEffect } from "react";
import axios from "axios";
window.jQuery = jQuery
require('owl.carousel')
function Testimonial() {
    const [getUser, setGetUser] = useState([])
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

    useEffect(() => {
        const configuration = {
            method: "get",
            url: "http://localhost:3000/GetTestiCont",
        }
        axios(configuration)
            .then((res) => {
                setGetUser(res.data.data)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])
    return (
        <>
            <div className="container-fluid py-5 bg-white wow fadeInUp" data-wow-delay="0.1s">
                <div className="container">
                    <div className="text-center">
                        <h5 className="section-title ff-secondary text-center text-primary fw-normal">Testimonial</h5>
                        <h1 className="mb-5">Our Clients Say!!!</h1>
                    </div>
                    {getUser.length > 0 ?
                        <div className="owl-carousel testimonial-carousel">
                            {Object.values(getUser).map((i) => {
                                const date = new Date(i.createdAt).toLocaleDateString()
                                const time = new Date(i.createdAt).toLocaleTimeString()
                                const datetime = date + " - " + time
                                return (
                                    <div key={i._id} className="testimonial-item bg-transparent border rounded p-4">
                                        <div className="d-flex align-items-center" style={{ gap: 2 + "%" }}>
                                            <i className="fa fa-quote-left fa-2x text-primary mb-3"></i>
                                            <p>{i.title}</p>
                                        </div>
                                        <p>{i.message}</p>
                                        <div className="d-flex align-items-center">
                                            <img loading="lazy" className="img-fluid flex-shrink-0 rounded-circle" alt="" src="https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg" style={{ width: 50 + "px", height: 50 + "px" }} />
                                            <div className="ps-3">
                                                <h5 className="mb-1">{i.name}</h5>
                                                <small>{datetime}</small>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        : (
                            <p className="text-center">There's no feedback !</p>
                        )}
                </div>
            </div>
        </>
    );
}
export default Testimonial;