import '../css/DetailMenuPage.css';
import $ from 'jquery';
import Header from '../component/Header';
import Footer from '../component/Footer';
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import NotFound from '../component/NotFound';
import { useEffect } from 'react';
import axios from 'axios';
require('owl.carousel')
function DetailMenuPage() {
    let Location = useLocation();
    const [detail, setDetail] = useState([]);
    const [menu, setMenu] = useState([]);
    var [quantity, setQuantity] = useState(0)
    $(function () {
        // Variables
        const $tabLink = $('#myTab .nav-link');
        const $tabBody = $('#myTabContent .tab-pane');
        let timerOpacity;

        $(".testimonial-carousel2").owlCarousel({
            smartSpeed: 2000,
            center: true,
            margin: 15,
            loop: true,
            nav: true,
            responsive: {
                0: {
                    items: 1
                },
                768: {
                    items: 2
                },
                992: {
                    items: 3
                },
            }
        });

        // Toggle Class
        const init = () => {
            // Menu Click
            $tabLink.off('click').on('click', function (e) {
                // Prevent Default
                e.preventDefault();
                e.stopPropagation();

                // Clear Timers
                window.clearTimeout(timerOpacity);

                // Toggle Class Logic
                // Remove Active Classes
                $tabLink.removeClass('active ');
                $tabBody.removeClass('active ');
                $tabBody.removeClass('activeThis');

                // Add Active Classes
                $(this).addClass('active');
                $($(this).attr('href')).addClass('active');

                // Opacity Transition Class
                timerOpacity = setTimeout(() => {
                    $($(this).attr('href')).addClass('activeThis');
                }, 50);
            });
        };

        // Document Ready
        $(function () {
            init();
        });
    });

    const handleIncrement = () => {
        setQuantity(quantity + 1)
    }
    const handleDecrement = () => {
        setQuantity(quantity - 1)
    }

    const handleLoop = () => {
        window.location.reload();
    }
    if (quantity < 1) {
        quantity = 1;
    }

    //Get Bonus
    useEffect(() => {
        fetch("http://localhost:3000/GetThisMenu", {
            method: "get",
        }).then((res) => res.json()).then((menu) => {
            setMenu(menu.data);
        })
    }, [])

    //Get Detail
    useEffect(() => {
        const DetailMenu = () => {
            const configuration = {
                method: "get",
                url: "http://localhost:3000/GetDetailMenu",
                params: {
                    foodid: Location.state.id
                }
            };
            axios(configuration)
                .then((result) => {
                    setDetail(result.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        DetailMenu();
    }, [Location.state.id])

    if (!Location.state) {
        return NotFound();
    }
    return (
        <>
            <Header />
            {Object.values(detail).map(i => {
                if (quantity > i.foodquantity) {
                    quantity = i.foodquantity;
                }
                return (
                    <>
                        <div className="container py-5">
                            <p><NavLink className="Allright" to="/">Home</NavLink> / <NavLink className="Allright">{i.foodcategory}</NavLink> / <NavLink to="/DetailMenuPage" state={{ id: i._id }} className="Allright">{i.foodname}</NavLink></p>
                            <div className="d-flex">
                                <img alt='' src={i.foodimage} width={600} height={400} />
                                <div className='px-3'>
                                    <div className="product-dtl">
                                        <div className="product-info">
                                            <div className="product-name">{i.foodname}</div>
                                            <div className="product-category">{i.foodcategory}</div>
                                            <div className="product-price-discount"><span>{i.foodprice} đ</span></div>
                                        </div>

                                        <p>Quantity : {i.foodquantity}</p>

                                        <p>{i.fooddescription}</p>

                                        <div className="product-count">
                                            <label>Quantity</label>
                                            <div>
                                                <button onClick={handleDecrement} className="btn btn-secondary">-</button>
                                                <input type="number" value={quantity} className='qty' />
                                                <button onClick={handleIncrement} className="btn btn-secondary">+</button>
                                            </div>
                                        </div>
                                        <a href="# " className="round-black-btn">Add to Cart</a>
                                    </div>
                                </div>
                            </div>
                            <div className="product-info-tabs">
                                <ul className="nav nav-tabs" id="myTab" role="tablist">
                                    <li className="nav-item">
                                        <a className="nav-link active activeThis" id="description-tab" href="#description">Description</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" id="review-tab" href="#review">Reviews (0)</a>
                                    </li>
                                </ul>
                                <div className="tab-content mt-5" id="myTabContent">
                                    <div className="tab-pane active activeThis" id="description">
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.
                                    </div>
                                    <div className="tab-pane" id="review">
                                        <div className="review-heading">REVIEWS</div>
                                        <p className="mb-20">There are no reviews yet.</p>
                                        <form className="review-form">
                                            <div className="form-group">
                                                <label>Your rating</label>
                                                <div className="reviews-counter">
                                                    <div className="rate">
                                                        <input type="radio" id="star5" name="rate" value="5" />
                                                        <label title="text">5 stars</label>
                                                        <input type="radio" id="star4" name="rate" value="4" />
                                                        <label title="text">4 stars</label>
                                                        <input type="radio" id="star3" name="rate" value="3" />
                                                        <label title="text">3 stars</label>
                                                        <input type="radio" id="star2" name="rate" value="2" />
                                                        <label title="text">2 stars</label>
                                                        <input type="radio" id="star1" name="rate" value="1" />
                                                        <label title="text">1 star</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Your message</label>
                                                <textarea className="form-control" rows="10"></textarea>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <input type="text" name="" className="form-control" placeholder="Name*" />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <input type="text" name="" className="form-control" placeholder="Email Id*" />
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="round-black-btn">Submit Review</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="container-fluid py-5 wow fadeInUp" data-wow-delay="0.1s">
                                <div className='container'>
                                    <div className="text-center">
                                        <h3 className="mb-5">
                                            Similar product</h3>
                                    </div>
                                    <div className="owl-carousel testimonial-carousel2">
                                        {menu.map(a => {
                                            return (
                                                <>
                                                    {a.foodcategory === i.foodcategory && a._id !== i._id ? (
                                                        <div className="testimonial-item bg-transparent">
                                                            <NavLink onClick={handleLoop} to="/DetailMenuPage" state={{ id: a._id }}>
                                                                <img alt='' height={200} src={a.foodimage} />
                                                            </NavLink>
                                                            <p style={{ margin: 0 }} className='text-center'>{a.foodcategory}</p>
                                                            <NavLink className="text-center" onClick={handleLoop} to="/DetailMenuPage" state={{ id: a._id }}>
                                                                <p style={{ margin: 0, color: "#FEA116" }}><b>{a.foodname}</b></p>
                                                            </NavLink>
                                                            <h6 style={{ margin: 0 }} className='text-center'>{a.foodprice}</h6>
                                                        </div>
                                                    ) : null}
                                                </>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )
            })}
            <Footer />
        </>
    );
}
export default DetailMenuPage;