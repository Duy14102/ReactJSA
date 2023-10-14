import '../css/DetailMenuPage.css';
import Header from '../component/Header';
import Footer from '../component/Footer';
import { useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import NotFound from '../component/outOfBorder/NotFound';
import { useEffect } from 'react';
import axios from 'axios';
import jQuery from "jquery";
import "../lib/owlcarousel/assets/owl.carousel.min.css";
import { Fragment } from 'react';
import { useCallback } from 'react';
window.jQuery = jQuery
require('owl.carousel')
function DetailMenuPage() {
    let appler = useParams()
    const [detail, setDetail] = useState([]);
    const [menu, setMenu] = useState([]);
    var [quantity, setQuantity] = useState(0)
    jQuery(function ($) {
        // Variables
        const $tabLink = $('#myTab .nav-link');
        const $tabBody = $('#myTabContent .tab-pane');
        let timerOpacity;
        $(".testimonial-carousel2").owlCarousel({
            smartSpeed: 1000,
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

    if (quantity < 1) {
        quantity = 1;
    }

    //Get Bonus
    const FetchMenu = useCallback(() => {
        fetch(`http://localhost:3000/GetThisMenu?Name=${appler.cate}`, {
            method: "get",
        }).then((res) => res.json()).then((menu) => {
            setMenu(menu.data);
        })
    }, [appler.cate])

    const FetchDetail = useCallback(() => {
        const configuration = {
            method: "get",
            url: "http://localhost:3000/GetDetailMenu",
            params: {
                foodid: appler.id
            }
        };
        axios(configuration)
            .then((result) => {
                setDetail(result.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [appler.id])

    useEffect(() => {
        FetchMenu()
        FetchDetail()
    }, [FetchMenu, FetchDetail])

    function addToCart(name, quantity) {
        var stored = JSON.parse(localStorage.getItem("cart"));
        if (!stored) {
            var students = [];
            var student1 = { name: name, quantity: quantity };
            students.push(student1);
            localStorage.setItem("cart", JSON.stringify(students));
            window.location.reload()
        } else {
            var sameItem = JSON.parse(localStorage.getItem("cart")) || [];
            for (var i = 0; i < sameItem.length; i++) {
                if (name === sameItem[i].name) {
                    sameItem[i].quantity += quantity;
                    localStorage.setItem('cart', JSON.stringify(sameItem))
                    window.location.reload()
                } else if (i === sameItem.length - 1) {
                    var stored2 = JSON.parse(localStorage.getItem("cart"));
                    var student2 = { name: name, quantity: quantity };
                    stored2.push(student2);
                    localStorage.setItem("cart", JSON.stringify(stored2));
                    window.location.reload()
                }
            }
        }
    }

    // localStorage.clear()

    if (!appler) {
        return NotFound();
    }

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    return (
        <>
            <Header />
            {Object.values(detail).map(i => {
                if (quantity > i.foodquantity) {
                    quantity = i.foodquantity;
                }
                return (
                    <Fragment key={i._id}>
                        <div className="container py-5">
                            <p><NavLink reloadDocument className="Allright" to="/">Home</NavLink> / <NavLink reloadDocument className="Allright" to={`/CategorySite/${i.foodcategory}`}>{i.foodcategory}</NavLink> / <NavLink to="/DetailMenuPage" state={{ id: i._id }} className="Allright">{i.foodname}</NavLink></p>
                            <div className="d-flex">
                                <img loading="lazy" alt='' src={i.foodimage} className='thisImageRespon' />
                                <div className='px-3'>
                                    <div className="product-dtl">
                                        <div className="product-info">
                                            <div className="product-name">{i.foodname}</div>
                                            <div className="product-category">{i.foodcategory}</div>
                                            <div className="product-price-discount"><span>{VND.format(i.foodprice)}</span></div>
                                        </div>

                                        <p>Quantity : {i.foodquantity}</p>

                                        <p>{i.fooddescription}</p>

                                        <div className="product-count">
                                            <label>Quantity</label>
                                            <div className='d-flex'>
                                                <button onClick={handleDecrement} className="btn btn-secondary">-</button>
                                                <input type="number" defaultValue={quantity} className='qty mx-1' />
                                                <button onClick={handleIncrement} className="btn btn-secondary">+</button>
                                            </div>
                                        </div>
                                        <button onClick={() => addToCart(i.foodname, quantity)} className="round-black-btn">Add to Cart</button>
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
                                        {i.fooddescription}
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
                                            <div className="row pt-4">
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
                                    {menu.length > 0 ?
                                        <div className="owl-carousel testimonial-carousel2">
                                            {menu.map(a => {
                                                return (
                                                    <Fragment key={a._id}>
                                                        {a.foodcategory === i.foodcategory && a._id !== i._id ? (
                                                            <>
                                                                <div className="testimonial-item bg-transparent">
                                                                    <NavLink reloadDocument to={`/DetailMenuPage/${a.foodname}/${a.foodcategory}`}>
                                                                        <img loading="lazy" alt='' height={200} src={a.foodimage} />
                                                                    </NavLink>
                                                                    <p style={{ margin: 0 }} className='text-center'>{a.foodcategory}</p>
                                                                    <NavLink className="text-center" reloadDocument to={`/DetailMenuPage/${a._id}`}>
                                                                        <p style={{ margin: 0, color: "#FEA116" }}><b>{a.foodname}</b></p>
                                                                    </NavLink>
                                                                    <h6 style={{ margin: 0 }} className='text-center'>{VND.format(a.foodprice)}</h6>
                                                                </div>
                                                            </>
                                                        ) : null}
                                                    </Fragment>
                                                )
                                            })}
                                        </div>
                                        : ""}
                                </div>
                            </div>
                        </div>
                    </Fragment>
                )
            })}
            <Footer />
        </>
    );
}
export default DetailMenuPage;