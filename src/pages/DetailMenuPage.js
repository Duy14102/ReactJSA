import { NavLink, useParams } from 'react-router-dom';
import NotFound from '../component/outOfBorder/NotFound';
import { useEffect, Fragment, useState, useRef, useReducer } from 'react';
import axios from 'axios';
import jQuery from "jquery";
import "../lib/owlcarousel/assets/owl.carousel.min.css";
import Swal from 'sweetalert2';
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";
import ReactPaginate from 'react-paginate';
import Layout from '../Layout';
import "../css/DetailMenuPage.css";
import Header from '../component/Header';

function DetailMenuPage() {
    var candecode = null
    const cookies = new Cookies();
    const token = cookies.get("TOKEN");
    if (token) {
        candecode = jwtDecode(token)
    }
    let appler = useParams()
    const [detailState, setDetailState] = useReducer((prev, next) => ({
        ...prev, ...next
    }), {
        detail: [],
        imgF: "",
        reviewMessage: null,
        getUserW: [],
        reviewStar: null,
        wowreview: [],
        checkStar: false,
        checkKiu: false,
        callAlert: false,
        callAlert2: false,
        gotReview: null,
        topping: [],
        pageCount: 6
    })
    var [reviewName, setReviewName] = useState()
    var [quantity, setQuantity] = useState(1)
    const Meatref = useRef(null);
    const Vegeref = useRef(null);
    const Drinkref = useRef(null);
    const currentPage = useRef();
    jQuery(function ($) {
        // Variables
        const $tabLink = $('#myTab .nav-link');
        const $tabBody = $('#myTabContent .tab-pane');
        let timerOpacity;

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

    const handleIncrement = (e) => {
        if (quantity >= e) {
            setQuantity(e)
        } else {
            setQuantity(quantity + 1)
        }
    }
    const handleDecrement = () => {
        if (quantity <= 1) {
            setQuantity(1)
        } else {
            setQuantity(quantity - 1)
        }
    }

    //Get Bonus
    useEffect(() => {
        if (token && candecode.userRole !== 1.5) {
            const decode = jwtDecode(token)
            fetch(`http://localhost:3000/GetDetailUser?userid=${decode.userId}`, {
                method: "get",
            }).then((res) => res.json()).then((menu) => {
                setDetailState({ getUserW: menu });
            })
        }

        fetch(`http://localhost:3000/GetSimilarP?Name=${appler.cate}`, {
            method: "get",
        }).then((res) => res.json()).then((menu) => {
            setDetailState({ menu: menu.data });
        })

        if (appler.cate === "Main") {
            fetch(`http://localhost:3000/GetTopping`, {
                method: "get",
            }).then((res) => res.json()).then((menu) => {
                setDetailState({ topping: menu.data });
            })
        }

        fetch(`http://localhost:3000/GetDetailMenu?foodid=${appler.id}`, {
            method: "get",
        }).then((res) => res.json()).then((data) => {
            setDetailState({ detail: data })
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appler.id, appler.cate, token])

    function addToCart(name, quantity, maxQ) {
        var stored = JSON.parse(localStorage.getItem("cart"));
        if (!stored) {
            var students = [];
            var student1 = { name: name, quantity: quantity };
            students.push(student1);
            localStorage.setItem("cart", JSON.stringify(students));
            setDetailState({ callAlert: true })
        } else {
            var sameItem = JSON.parse(localStorage.getItem("cart")) || [];
            for (var i = 0; i < sameItem.length; i++) {
                if (name === sameItem[i].name) {
                    if (sameItem[i].quantity + quantity > maxQ) {
                        setDetailState({ callAlert2: true })
                    } else {
                        sameItem[i].quantity += quantity;
                        localStorage.setItem('cart', JSON.stringify(sameItem))
                        setDetailState({ callAlert: true })
                    }
                } else if (i === sameItem.length - 1) {
                    var stored2 = JSON.parse(localStorage.getItem("cart"));
                    var student2 = { name: name, quantity: quantity };
                    stored2.push(student2);
                    localStorage.setItem("cart", JSON.stringify(stored2));
                    setDetailState({ callAlert: true })
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
        setDetailState({ wowreview: results.result })
        setDetailState({ pageCount: results.pageCount })
    }

    useEffect(() => {
        if (detailState.callAlert) {
            setTimeout(() => {
                setDetailState({ callAlert: false })
            }, 1500)
        }
        if (detailState.callAlert2) {
            setTimeout(() => {
                setDetailState({ callAlert2: false })
            }, 1500)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [detailState.callAlert, detailState.callAlert2])

    useEffect(() => {
        currentPage.current = 1;
        Object.values(detailState.detail).map(i => {
            outshin(i)
            return null
        })
        if (token) {
            if (candecode.userRole !== 1.5) {
                Object.values(detailState.getUserW).map((h) => {
                    setDetailState({ imgF: h.userimage })
                    return null
                })
            }

            if (candecode.userRole === 1.5) {
                setDetailState({ imgF: candecode.userImage })
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [detailState.detail, detailState.getUserW, token])


    const addreview = (e, ids) => {
        var thisId = "none"
        if (token) {
            const decode = jwtDecode(token)
            thisId = decode.userId
            reviewName = decode.userName
        }
        const takeReview = { id: thisId, name: reviewName, star: detailState.reviewStar, message: detailState.reviewMessage, date: datetime, image: detailState.imgF }
        e.preventDefault()
        const configuration = {
            method: "post",
            url: "http://localhost:3000/AddReview",
            data: {
                id: ids,
                review: takeReview
            }
        };
        if (detailState.reviewStar) {
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
            setDetailState({ checkStar: true })
        }
    }

    useEffect(() => {
        detailState.wowreview.map((f) => {
            if (token) {
                const decode = jwtDecode(token)
                if (f.id === decode.userId) {
                    setDetailState({ checkKiu: true })
                    setDetailState({ gotReview: f })
                }
            }
            return null
        })
    }, [token, detailState.wowreview])

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
    const rating = stars => '★★★★★☆☆☆☆☆'.slice(5 - stars, 10 - stars);
    function getStars(rating) {
        var kings = null
        const stars = [];
        rating?.map((l) => {
            kings += parseInt(l.star)
            return null
        })
        const queen = kings / rating?.length
        for (let i = 0; i < 5; i++) {
            if (queen - 1 < i) {
                stars.push(<span key={i} className='starGlow'>☆</span>);
            } else {
                stars.push(<span key={i} className='starGlow'>★</span>);
            }
        }
        return stars;
    }
    return (
        <Layout>
            <Header type={"Yes"} />
            {detailState.callAlert || detailState.callAlert2 ? (
                <div className="danguru">
                    <div className={detailState.callAlert ? 'alertNow' : detailState.callAlert2 ? 'alertNow2' : null}>
                        <div className='kikuny'>
                            {detailState.callAlert2 ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                            ) : detailState.callAlert ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" /></svg>
                            ) : null}
                        </div>
                        <div className='d-flex' style={{ flexDirection: "column", marginRight: 25 }}>
                            <p className='m-0'><b>{detailState.callAlert ? "Success" : detailState.callAlert2 ? "Failed" : null}</b></p>
                            <p className='m-0'>{detailState.callAlert ? "Cart have new item!" : detailState.callAlert2 ? "Add to cart failed!" : null}</p>
                        </div>
                        {detailState.callAlert ? (
                            <button onClick={() => setDetailState({ callAlert: false })} className='closeAlertKikuny'></button>
                        ) : detailState.callAlert2 ? (
                            <button onClick={() => setDetailState({ callAlert2: false })} className='closeAlertKikuny'></button>
                        ) : null}
                    </div>
                </div>
            ) : null}
            <div style={{ backgroundColor: "#f2f2f2" }}>
                {Object.values(detailState.detail).map(i => {
                    if (quantity > i.foodquantity) {
                        quantity = i.foodquantity;
                    }
                    return (
                        <Fragment key={i._id}>
                            <div className='bg-white'>
                                <div className='container'>
                                    <div className="buhhuh">
                                        <img loading="lazy" alt='' src={i.foodimage} className='thisImageRespon' />
                                        <div className='sonbuhhuh'>
                                            <p><NavLink reloadDocument className="Allright" to="/">Home</NavLink> / <NavLink reloadDocument className="Allright" to={`/CategorySite/${i.foodcategory}/nto`}>{i.foodcategory}</NavLink> / <NavLink to="# " state={{ id: i._id }} className="Allright">{i.foodname}</NavLink></p>
                                            <div className="product-dtl">
                                                <div className="product-name">{i.foodname}</div>
                                                <div className='d-flex align-items-center' style={{ gap: 10 }}>
                                                    <div className='d-flex' style={{ gap: 1 }}>
                                                        {getStars(i.review)}
                                                    </div>
                                                    <p className='m-0'><span className='starGlowFriend'>{i.review.length}</span> review from customer</p>
                                                </div>
                                                <div className='d-flex align-items-center' style={{ gap: 15 }}>
                                                    <div className='d-flex align-items-center' style={{ gap: 5 }}>
                                                        <div className='statusProMax' style={{ backgroundColor: i.foodquantity > 0 ? "#6cc942" : "tomato" }}></div>
                                                        <p className='m-0' style={{ color: i.foodquantity > 0 ? "#6cc942" : "tomato" }}>{i.foodquantity > 0 ? "Stocking" : "Out of stock"}</p>
                                                    </div>
                                                    <div className="product-price-discount"><span className='coverThisMoney'>$</span>{VND.format(i.foodprice)}</div>
                                                </div>

                                                <p>{i.fooddescription}</p>

                                                <div className="product-count gotThisFlex">
                                                    <div>
                                                        {i.foodquantity > 0 ? (
                                                            <div className='d-flex'>
                                                                <button onClick={() => handleDecrement()} className="btn btn-secondary">-</button>
                                                                <input type="numeric" min={1} max={i.foodquantity} value={quantity} className='qty mx-1' readOnly />
                                                                <button onClick={() => handleIncrement(i.foodquantity)} className="btn btn-secondary">+</button>
                                                            </div>
                                                        ) : (
                                                            <div style={{ pointerEvents: "none", opacity: 0.5 }} className='d-flex'>
                                                                <button className="btn btn-secondary">-</button>
                                                                <input type="numeric" value={0} className='qty mx-1' />
                                                                <button className="btn btn-secondary">+</button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {i.foodquantity > 0 ? (
                                                        <button onClick={() => addToCart(i.foodname, quantity, i.foodquantity)} className="round-black-btn">Add to Cart</button>
                                                    ) : (
                                                        <button style={{ pointerEvents: "none", opacity: 0.5 }} className="round-black-btn">Out of stock</button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='container py-4 mt-5'>
                                <div className="product-info-tabs">
                                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                                        {i.foodcategory === "Main" ? (
                                            <li className="nav-item">
                                                <a className="active activeThis nav-link" id="description-tab" href="#description">Topping</a>
                                            </li>
                                        ) : null}
                                        <li className="nav-item">
                                            <a className={[i.foodcategory !== "Main" ? "active activeThis nav-link" : "nav-link"]} id="review-tab" href="#review">Reviews ({i.review?.length})</a>
                                        </li>
                                    </ul>
                                    <div className="tab-content" id="myTabContent">
                                        {i.foodcategory === "Main" ? (
                                            <div className="tab-pane active activeThis" id="description">
                                                <div className='d-flex justify-content-between w-100'>
                                                    <div className='conquerLeft'>
                                                        <button onClick={() => Meatref.current?.scrollIntoView({ behavior: 'smooth' })}>Meat</button>
                                                        <button onClick={() => Vegeref.current?.scrollIntoView({ behavior: 'smooth' })}>Vegetables</button>
                                                        <button onClick={() => Drinkref.current?.scrollIntoView({ behavior: 'smooth' })}>Drink</button>
                                                    </div>
                                                    <div className='conquerRight'>
                                                        {detailState.topping.length > 0 && appler.cate === "Main" ? (
                                                            <>
                                                                <p ref={Meatref} className='KickTitleJK'>Meat</p>
                                                                <div className='py-3'>
                                                                    {detailState.topping?.map((z) => {
                                                                        return (
                                                                            z.foodcategory === "Meat" ? (
                                                                                <Fragment key={z._id}>
                                                                                    <div className='d-flex justify-content-between w-100'>
                                                                                        <div style={{ width: "10%" }}>
                                                                                            <img src={z.foodimage} width={window.innerWidth > 991 ? 75 : 62} height={65} alt='' />
                                                                                        </div>
                                                                                        <div style={{ width: window.innerWidth > 991 ? "70%" : "50%" }}>
                                                                                            <p className='m-0'><b>{z.foodname}</b></p>
                                                                                            <p className='cutTextRightNow' style={{ fontSize: 15, color: "gray" }}>{z.fooddescription}</p>
                                                                                        </div>
                                                                                        <p style={{ width: "10%", textAlign: "center" }}>{VND.format(z.foodprice)}</p>
                                                                                        <div style={{ width: "10%", textAlign: "center" }}>
                                                                                            <button style={{ opacity: z.foodquantity < 1 ? 0.5 : 1, pointerEvents: z.foodquantity < 1 ? "none" : "auto" }} onClick={() => addToCart(z.foodname, 1, z.foodquantity)} className='plusPlusDe'>+</button>
                                                                                            {z.foodquantity < 1 ? (
                                                                                                <p className='m-0 pt-2 text-danger'>Out of stock</p>
                                                                                            ) : null}
                                                                                        </div>
                                                                                    </div>
                                                                                    <hr style={{ color: "lightgray", marginTop: 0 }} />
                                                                                </Fragment>
                                                                            ) : null
                                                                        )
                                                                    })}
                                                                </div>
                                                                <p ref={Vegeref} className='KickTitleJK'>Vegetables</p>
                                                                <div className='py-3'>
                                                                    {detailState.topping?.map((z) => {
                                                                        return (
                                                                            z.foodcategory === "Vegetables" ? (
                                                                                <Fragment key={z._id}>
                                                                                    <div className='d-flex justify-content-between w-100'>
                                                                                        <div style={{ width: "10%" }}>
                                                                                            <img src={z.foodimage} width={window.innerWidth > 991 ? 75 : 62} height={65} alt='' />
                                                                                        </div>
                                                                                        <div style={{ width: window.innerWidth > 991 ? "70%" : "50%" }}>
                                                                                            <p className='m-0'><b>{z.foodname}</b></p>
                                                                                            <p className='cutTextRightNow' style={{ fontSize: 15, color: "gray" }}>{z.fooddescription}</p>
                                                                                        </div>
                                                                                        <p style={{ width: "10%", textAlign: "center" }}>{VND.format(z.foodprice)}</p>
                                                                                        <div style={{ width: "10%", textAlign: "center" }}>
                                                                                            <button style={{ opacity: z.foodquantity < 1 ? 0.5 : 1, pointerEvents: z.foodquantity < 1 ? "none" : "auto" }} onClick={() => addToCart(z.foodname, 1, z.foodquantity)} className='plusPlusDe'>+</button>
                                                                                            {z.foodquantity < 1 ? (
                                                                                                <p className='m-0 pt-2 text-danger'>Out of stock</p>
                                                                                            ) : null}
                                                                                        </div>
                                                                                    </div>
                                                                                    <hr style={{ color: "lightgray", marginTop: 0 }} />
                                                                                </Fragment>
                                                                            ) : null
                                                                        )
                                                                    })}
                                                                </div>
                                                                <p ref={Drinkref} className='KickTitleJK'>Drink</p>
                                                                <div className='py-3'>
                                                                    {detailState.topping?.map((z) => {
                                                                        return (
                                                                            z.foodcategory === "Drink" ? (
                                                                                <Fragment key={z._id}>
                                                                                    <div className='d-flex justify-content-between w-100'>
                                                                                        <div style={{ width: "10%" }}>
                                                                                            <img src={z.foodimage} width={window.innerWidth > 991 ? 75 : 62} height={65} alt='' />
                                                                                        </div>
                                                                                        <div style={{ width: window.innerWidth > 991 ? "70%" : "50%" }}>
                                                                                            <p className='m-0'><b>{z.foodname}</b></p>
                                                                                            <p className='cutTextRightNow' style={{ fontSize: 15, color: "gray" }}>{z.fooddescription}</p>
                                                                                        </div>
                                                                                        <p style={{ width: "10%", textAlign: "center" }}>{VND.format(z.foodprice)}</p>
                                                                                        <div style={{ width: "10%", textAlign: "center" }}>
                                                                                            <button style={{ opacity: z.foodquantity < 1 ? 0.5 : 1, pointerEvents: z.foodquantity < 1 ? "none" : "auto" }} onClick={() => addToCart(z.foodname, 1, z.foodquantity)} className='plusPlusDe'>+</button>
                                                                                            {z.foodquantity < 1 ? (
                                                                                                <p className='m-0 pt-2 text-danger'>Out of stock</p>
                                                                                            ) : null}
                                                                                        </div>
                                                                                    </div>
                                                                                    <hr style={{ color: "lightgray", marginTop: 0 }} />
                                                                                </Fragment>
                                                                            ) : null
                                                                        )
                                                                    })}
                                                                </div>
                                                            </>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : null}
                                        <div className={[i.foodcategory !== "Main" ? "active activeThis tab-pane" : "tab-pane"]} id="review">
                                            {i.review?.length < 1 ? (
                                                <div className='bg-white p-3 HeroDecadeAF'>
                                                    <p className="mb-20 text-center">There are no reviews yet.</p>
                                                    {token ? (
                                                        <>
                                                            <form onSubmit={(e) => addreview(e, i._id)} className="review-form">
                                                                <div className="form-group">
                                                                    <div className='d-flex' style={{ gap: 3 + "%" }}>
                                                                        <div>
                                                                            <label>Your rating</label>
                                                                            <div className="reviews-counter">
                                                                                <div className="rate">
                                                                                    <input type='radio' style={{ display: "none" }} required />
                                                                                    <input type="radio" onChange={(e) => setDetailState({ reviewStar: e.target.value })} id="star5" name="rate" value="5" />
                                                                                    <label title="text" htmlFor='star5'>5 stars</label>
                                                                                    <input type="radio" onChange={(e) => setDetailState({ reviewStar: e.target.value })} id="star4" name="rate" value="4" />
                                                                                    <label title="text" htmlFor='star4'>4 stars</label>
                                                                                    <input type="radio" onChange={(e) => setDetailState({ reviewStar: e.target.value })} id="star3" name="rate" value="3" />
                                                                                    <label title="text" htmlFor='star3'>3 stars</label>
                                                                                    <input type="radio" onChange={(e) => setDetailState({ reviewStar: e.target.value })} id="star2" name="rate" value="2" />
                                                                                    <label title="text" htmlFor='star2'>2 stars</label>
                                                                                    <input type="radio" onChange={(e) => setDetailState({ reviewStar: e.target.value })} id="star1" name="rate" value="1" />
                                                                                    <label title="text" htmlFor='star1'>1 star</label>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {detailState.checkStar ? (
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
                                                                    <textarea onChange={(e) => setDetailState({ reviewMessage: e.target.value })} className="form-control" rows="10" required />
                                                                </div>
                                                                <button type='submit' className="round-black-btn">Submit Review</button>
                                                            </form>
                                                        </>
                                                    ) : (
                                                        <div className='d-flex align-items-center justify-content-center'>
                                                            <p className='text-center m-0'>You need </p>
                                                            <NavLink className="nav-link p-0" reloadDocument to="/LoginSite">Login</NavLink>
                                                            <p className='text-center m-0'> to review!</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className='Mk978'>
                                                    <div style={{ width: 58 + "%" }}>
                                                        {detailState.wowreview.map((r) => {
                                                            return (
                                                                <Fragment key={r.date}>
                                                                    <div className='gutton'>
                                                                        {r.image ? (
                                                                            <img alt='' height={50} width={50} src={r.image} />
                                                                        ) : (
                                                                            <img alt='' height={50} width={50} src="https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg" />
                                                                        )}
                                                                        <div>
                                                                            <div style={{ color: "#FEA116" }}>{rating(r.star)}</div>
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
                                                            pageCount={detailState.pageCount}
                                                            previousLabel="< Prev"
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
                                                        {detailState.checkKiu ? (
                                                            <>
                                                                <div className='text-center'>
                                                                    <div className="review-heading">REVIEWS</div>
                                                                    <p>You have review this item!</p>
                                                                </div>
                                                                <div className='gutton'>
                                                                    <img alt='' height={50} width={50} src={detailState.gotReview.image ? detailState.gotReview.image : "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"} />
                                                                    <div>
                                                                        <div style={{ color: "#FEA116" }}>{rating(detailState.gotReview.star)}</div>
                                                                        <p className='m-0'><b>{detailState.gotReview.name}</b> - {detailState.gotReview.date}</p>
                                                                        <p className='m-0'>{detailState.gotReview.message}</p>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            token ? (
                                                                <form onSubmit={(e) => addreview(e, i._id)} className="review-form">
                                                                    <div className="form-group">
                                                                        <div className='d-flex' style={{ gap: 3 + "%" }}>
                                                                            <div>
                                                                                <label>Your rating</label>
                                                                                <div className="reviews-counter">
                                                                                    <div className="rate">
                                                                                        <input type='radio' style={{ display: "none" }} required />
                                                                                        <input type="radio" onChange={(e) => setDetailState({ reviewStar: e.target.value })} id="star5" name="rate" value="5" />
                                                                                        <label title="text" htmlFor='star5'>5 stars</label>
                                                                                        <input type="radio" onChange={(e) => setDetailState({ reviewStar: e.target.value })} id="star4" name="rate" value="4" />
                                                                                        <label title="text" htmlFor='star4'>4 stars</label>
                                                                                        <input type="radio" onChange={(e) => setDetailState({ reviewStar: e.target.value })} id="star3" name="rate" value="3" />
                                                                                        <label title="text" htmlFor='star3'>3 stars</label>
                                                                                        <input type="radio" onChange={(e) => setDetailState({ reviewStar: e.target.value })} id="star2" name="rate" value="2" />
                                                                                        <label title="text" htmlFor='star2'>2 stars</label>
                                                                                        <input type="radio" onChange={(e) => setDetailState({ reviewStar: e.target.value })} id="star1" name="rate" value="1" />
                                                                                        <label title="text" htmlFor='star1'>1 star</label>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            {detailState.checkStar ? (
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
                                                                        <textarea onChange={(e) => setDetailState({ reviewMessage: e.target.value })} className="textDeny" rows="10" required />
                                                                    </div>
                                                                    <button type='submit' className="round-black-btn">Submit Review</button>
                                                                </form>
                                                            ) : (
                                                                <div className='d-flex align-items-center justify-content-center'>
                                                                    <p className='text-center m-0'>You need </p>
                                                                    <NavLink className="nav-link p-0" reloadDocument to="/LoginSite">Login</NavLink>
                                                                    <p className='text-center m-0'> to review!</p>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Fragment>
                    )
                })}
            </div>
        </Layout>
    );
}
export default DetailMenuPage;