import '../css/DetailMenuPage.css';
import Header from '../component/Header';
import Footer from '../component/Footer';
import { NavLink, useParams } from 'react-router-dom';
import NotFound from '../component/outOfBorder/NotFound';
import { useEffect, Fragment, useState, useRef } from 'react';
import axios from 'axios';
import jQuery from "jquery";
import "../lib/owlcarousel/assets/owl.carousel.min.css";
import Swal from 'sweetalert2';
import jwtDecode from "jwt-decode";
import Cookies from "universal-cookie";
import ReactPaginate from 'react-paginate';
window.jQuery = jQuery
require('owl.carousel')

function DetailMenuPage() {
    const cookies = new Cookies();
    const token = cookies.get("TOKEN");
    let appler = useParams()
    const [detail, setDetail] = useState([]);
    const [menu, setMenu] = useState([]);
    var [reviewName, setReviewName] = useState()
    const [imgF, setImgF] = useState("")
    const [reviewMessage, setReviewMessage] = useState()
    const [getUserW, setGetUserW] = useState([])
    const [reviewStar, setReviewStar] = useState()
    const [wowreview, setWowReview] = useState([])
    const [checkStar, setCheckStar] = useState(false)
    var [quantity, setQuantity] = useState(0)

    const [pageCount, setPageCount] = useState(6);
    const currentPage = useRef();
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
    useEffect(() => {
        if (token) {
            const decode = jwtDecode(token)
            fetch(`http://localhost:3000/GetDetailUser?userid=${decode.userId}`, {
                method: "get",
            }).then((res) => res.json()).then((menu) => {
                setGetUserW(menu);
            })
        }

        fetch(`http://localhost:3000/GetThisMenu?Name=${appler.cate}`, {
            method: "get",
        }).then((res) => res.json()).then((menu) => {
            setMenu(menu.data);
        })

        fetch(`http://localhost:3000/GetDetailMenu?foodid=${appler.id}`, {
            method: "get",
        }).then((res) => res.json()).then((data) => {
            setDetail(data);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appler.id, appler.cate, token])

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

    const date = Date.now()
    const hashdate = new Date(date).toLocaleDateString()
    const hashtime = new Date(date).toLocaleTimeString()
    const datetime = hashdate + " - " + hashtime

    const outshin = (i) => {
        const page = currentPage.current
        const limit = 5

        const start = (page - 1) * limit
        const end = page * limit

        const results = {}
        results.total = i.review?.length
        results.pageCount = Math.ceil(i.review?.length / limit)

        if (end < i.review?.length) {
            results.next = {
                page: page + 1
            }
        }
        if (start > 0) {
            results.prev = {
                page: page - 1
            }
        }

        results.result = i.review?.slice(start, end)
        setWowReview(results.result)
        setPageCount(results.pageCount)
    }

    useEffect(() => {

        currentPage.current = 1;
        Object.values(detail).map(i => {
            outshin(i)
            return null
        })

        Object.values(getUserW).map((h) => {
            setImgF(h.userimage)
            return null
        })
    }, [detail, getUserW])


    const addreview = (e, ids) => {
        var thisId = "none"
        if (token) {
            const decode = jwtDecode(token)
            thisId = decode.userId
            reviewName = decode.userName
        }
        const takeReview = { id: thisId, name: reviewName, star: reviewStar, message: reviewMessage, date: datetime, image: imgF }
        e.preventDefault()
        const configuration = {
            method: "post",
            url: "http://localhost:3000/AddReview",
            data: {
                id: ids,
                review: takeReview
            }
        };
        if (reviewStar) {
            axios(configuration)
                .then(() => {
                    Swal.fire(
                        'Review Successfully!',
                        '',
                        'success'
                    ).then(function () {
                        window.location.reload();
                    })
                })
                .catch(() => {
                    Swal.fire(
                        'Review Fail!',
                        '',
                        'error'
                    ).then(function () {
                        window.location.reload();
                    })
                });
        } else {
            setCheckStar(true)
        }
    }

    // localStorage.clear()

    function handlePageClick(e, i) {
        currentPage.current = e + 1
        outshin(i)
    }

    if (!appler) {
        return NotFound();
    }

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    return (
        <>
            <Header type={"Yes"} />
            <div className='bg-white'>
                {Object.values(detail).map(i => {
                    if (quantity > i.foodquantity) {
                        quantity = i.foodquantity;
                    }
                    return (
                        <Fragment key={i._id}>
                            <div className="container py-5">
                                <p><NavLink reloadDocument className="Allright" to="/">Home</NavLink> / <NavLink reloadDocument className="Allright" to={`/CategorySite/${i.foodcategory}`}>{i.foodcategory}</NavLink> / <NavLink to="/DetailMenuPage" state={{ id: i._id }} className="Allright">{i.foodname}</NavLink></p>
                                <div className="buhhuh">
                                    <img loading="lazy" alt='' src={i.foodimage} className='thisImageRespon' />
                                    <div className='sonbuhhuh'>
                                        <div className="product-dtl">
                                            <div className="product-info">
                                                <div className="product-name">{i.foodname}</div>
                                                <div className="product-price-discount"><span>{VND.format(i.foodprice)}</span></div>
                                            </div>

                                            <p>Quantity : {i.foodquantity}</p>

                                            <p>{i.review.length} review from customer</p>

                                            <div className="product-count">
                                                <label>Quantity</label>
                                                {i.foodquantity > 0 ? (
                                                    <div className='d-flex'>
                                                        <button onClick={handleDecrement} className="btn btn-secondary">-</button>
                                                        <input type="number" value={quantity} className='qty mx-1' />
                                                        <button onClick={handleIncrement} className="btn btn-secondary">+</button>
                                                    </div>
                                                ) : (
                                                    <div style={{ pointerEvents: "none", opacity: 0.5 }} className='d-flex'>
                                                        <button className="btn btn-secondary">-</button>
                                                        <input type="number" value={0} className='qty mx-1' />
                                                        <button className="btn btn-secondary">+</button>
                                                    </div>
                                                )}
                                            </div>
                                            {i.foodquantity > 0 ? (
                                                <button onClick={() => addToCart(i.foodname, quantity)} className="round-black-btn">Add to Cart</button>
                                            ) : (
                                                <button style={{ pointerEvents: "none", opacity: 0.5 }} className="round-black-btn">Out of stock</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="product-info-tabs">
                                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                                        <li className="nav-item">
                                            <a className="nav-link active activeThis" id="description-tab" href="#description">Description</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" id="review-tab" href="#review">Reviews ({i.review?.length})</a>
                                        </li>
                                    </ul>
                                    <div className="tab-content mt-5" id="myTabContent">
                                        <div className="tab-pane active activeThis" id="description">
                                            {i.fooddescription}
                                        </div>
                                        <div className="tab-pane" id="review">
                                            {i.review?.length <= 0 ? (
                                                <>
                                                    <div className="review-heading">REVIEWS</div>
                                                    <p className="mb-20">There are no reviews yet.</p>
                                                    <form onSubmit={(e) => addreview(e, i._id)} className="review-form">
                                                        <div className="form-group">
                                                            <div className='d-flex' style={{ gap: 3 + "%" }}>
                                                                <div>
                                                                    <label>Your rating</label>
                                                                    <div className="reviews-counter">
                                                                        <div className="rate">
                                                                            <input type='radio' style={{ display: "none" }} required />
                                                                            <input type="radio" onChange={(e) => setReviewStar(e.target.value)} id="star5" name="rate" value="5" />
                                                                            <label title="text" htmlFor='star5'>5 stars</label>
                                                                            <input type="radio" onChange={(e) => setReviewStar(e.target.value)} id="star4" name="rate" value="4" />
                                                                            <label title="text" htmlFor='star4'>4 stars</label>
                                                                            <input type="radio" onChange={(e) => setReviewStar(e.target.value)} id="star3" name="rate" value="3" />
                                                                            <label title="text" htmlFor='star3'>3 stars</label>
                                                                            <input type="radio" onChange={(e) => setReviewStar(e.target.value)} id="star2" name="rate" value="2" />
                                                                            <label title="text" htmlFor='star2'>2 stars</label>
                                                                            <input type="radio" onChange={(e) => setReviewStar(e.target.value)} id="star1" name="rate" value="1" />
                                                                            <label title="text" htmlFor='star1'>1 star</label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {checkStar ? (
                                                                    <p className='text-danger'>Choose star for this item !</p>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                        {token ? null : (
                                                            <div className="form-group">
                                                                <label>Your name</label>
                                                                <input onChange={(e) => setReviewName(e.target.value)} type="text" name="" className="form-control" required />
                                                            </div>
                                                        )}
                                                        <div className="form-group pt-4">
                                                            <label>Your message</label>
                                                            <textarea onChange={(e) => setReviewMessage(e.target.value)} className="form-control" rows="10" required />
                                                        </div>
                                                        <button type='submit' className="round-black-btn">Submit Review</button>
                                                    </form>
                                                </>
                                            ) : (
                                                <>
                                                    <div className='d-flex justify-content-between w-100'>
                                                        <div style={{ width: 58 + "%" }}>
                                                            {wowreview.map((r) => {
                                                                const rating = stars => '★★★★★☆☆☆☆☆'.slice(5 - stars, 10 - stars);
                                                                return (
                                                                    <Fragment key={r.date}>
                                                                        <div className='gutton'>
                                                                            {r.image ? (
                                                                                <img alt='' height={50} width={50} src={r.image} />
                                                                            ) : (
                                                                                <img alt='' height={50} width={50} src="https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg" />
                                                                            )}
                                                                            <div>
                                                                                <div>{rating(r.star)}</div>
                                                                                <p className='m-0'><b>{r.name}</b> - {r.date}</p>
                                                                                <p className='m-0'>{r.message}</p>
                                                                            </div>
                                                                        </div>
                                                                        <hr />
                                                                    </Fragment>
                                                                )
                                                            })}
                                                            <ReactPaginate
                                                                breakLabel="..."
                                                                nextLabel="Next >"
                                                                onPageChange={(e) => handlePageClick(e.selected, i)}
                                                                pageRangeDisplayed={5}
                                                                pageCount={pageCount}
                                                                previousLabel="< Previous"
                                                                renderOnZeroPageCount={null}
                                                                marginPagesDisplayed={2}
                                                                containerClassName="pagination justify-content-center"
                                                                pageClassName="page-item"
                                                                pageLinkClassName="page-link"
                                                                previousClassName="page-item"
                                                                previousLinkClassName="page-link"
                                                                nextClassName="page-item"
                                                                nextLinkClassName="page-link"
                                                                activeClassName="active"
                                                                forcePage={currentPage.current - 1}
                                                            />
                                                        </div>
                                                        <div className='holdTall' style={{ width: 40 + "%" }}>
                                                            <div className="review-heading">REVIEWS</div>
                                                            <form onSubmit={(e) => addreview(e, i._id)} className="review-form">
                                                                <div className="form-group">
                                                                    <div className='d-flex' style={{ gap: 3 + "%" }}>
                                                                        <div>
                                                                            <label>Your rating</label>
                                                                            <div className="reviews-counter">
                                                                                <div className="rate">
                                                                                    <input type='radio' style={{ display: "none" }} required />
                                                                                    <input type="radio" onChange={(e) => setReviewStar(e.target.value)} id="star5" name="rate" value="5" />
                                                                                    <label title="text" htmlFor='star5'>5 stars</label>
                                                                                    <input type="radio" onChange={(e) => setReviewStar(e.target.value)} id="star4" name="rate" value="4" />
                                                                                    <label title="text" htmlFor='star4'>4 stars</label>
                                                                                    <input type="radio" onChange={(e) => setReviewStar(e.target.value)} id="star3" name="rate" value="3" />
                                                                                    <label title="text" htmlFor='star3'>3 stars</label>
                                                                                    <input type="radio" onChange={(e) => setReviewStar(e.target.value)} id="star2" name="rate" value="2" />
                                                                                    <label title="text" htmlFor='star2'>2 stars</label>
                                                                                    <input type="radio" onChange={(e) => setReviewStar(e.target.value)} id="star1" name="rate" value="1" />
                                                                                    <label title="text" htmlFor='star1'>1 star</label>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {checkStar ? (
                                                                            <p className='text-danger'>Choose star for this item !</p>
                                                                        ) : null}
                                                                    </div>
                                                                </div>
                                                                {token ? null : (
                                                                    <div className="form-group">
                                                                        <label>Your name</label>
                                                                        <input onChange={(e) => setReviewName(e.target.value)} type="text" name="" className="textDeny" required />
                                                                    </div>
                                                                )}
                                                                <div className="form-group pt-4">
                                                                    <label>Your message</label>
                                                                    <textarea onChange={(e) => setReviewMessage(e.target.value)} className="textDeny" rows="10" required />
                                                                </div>
                                                                <button type='submit' className="round-black-btn">Submit Review</button>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
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
            </div>
            <Footer />
        </>
    );
}
export default DetailMenuPage;