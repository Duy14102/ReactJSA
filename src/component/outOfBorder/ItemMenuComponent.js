import { NavLink } from "react-router-dom";
import Modal from 'react-modal';
import { useState, useEffect, useRef, useReducer, Fragment } from "react";
import "../../css/DetailMenuPage.css";
import Topping from "./Topping";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";

const ItemMenuComponent = ({ data, start, end, setMainState }) => {
    var candecode = null
    const cookies = new Cookies();
    const token = cookies.get("TOKEN");
    if (token) {
        candecode = jwtDecode(token)
    }
    const [openModal, setOpenModal] = useState(false)
    const [openModal2, setOpenModal2] = useState(false)
    const [modalData, setmodalData] = useState()
    const [toppingCate, setToppingCate] = useState(false)
    const [reviewCate, setReviewCate] = useState(false)
    const [wantTo, setWantTo] = useState(false)
    const [meat, setMeat] = useState(true)
    const [vege, setVege] = useState(false)
    const [drink, setDrink] = useState(false)
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
    var [quantitys, setQuantity] = useState(1)
    var [reviewName, setReviewName] = useState()
    const currentPage = useRef();

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    useEffect(() => {
        if (token && candecode?.userRole !== 1.5) {
            const decode = jwtDecode(token)
            fetch(`https://eatcom.onrender.com/GetDetailUser?userid=${decode.userId}`, {
                method: "get",
            }).then((res) => res.json()).then((menu) => {
                setDetailState({ getUserW: menu });
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token])

    useEffect(() => {
        if (modalData?.foodcategory !== "Main") {
            setReviewCate(true)
        }
        if (modalData?.foodcategory === "Main") {
            setToppingCate(true)
            setReviewCate(false)
        }
    }, [modalData])

    function addToCart(name, quantity, maxQ) {
        var stored = JSON.parse(localStorage.getItem("cart"));
        if (!stored) {
            var students = [];
            var student1 = { name: name, quantity: quantity };
            students.push(student1);
            localStorage.setItem("cart", JSON.stringify(students));
            setMainState({ callAlert: true })
        } else {
            var sameItem = JSON.parse(localStorage.getItem("cart")) || [];
            for (var i = 0; i < sameItem.length; i++) {
                if (name === sameItem[i].name) {
                    if (!sameItem.every(item => item.hasOwnProperty("topping"))) {
                        if (sameItem[i].quantity + quantity > maxQ) {
                            setMainState({ callAlert2: true })
                        } else {
                            sameItem[i].quantity += quantity;
                            localStorage.setItem('cart', JSON.stringify(sameItem))
                            setMainState({ callAlert: true })
                            break
                        }
                    } else {
                        if (sameItem[i].quantity + quantity > maxQ) {
                            setMainState({ callAlert2: true })
                        } else {
                            var stored3 = JSON.parse(localStorage.getItem("cart"));
                            var student3 = { name: name, quantity: quantity };
                            stored3.push(student3);
                            localStorage.setItem("cart", JSON.stringify(stored3));
                            setMainState({ callAlert: true })
                            break
                        }
                    }
                }
                else if (i === sameItem.length - 1) {
                    var stored2 = JSON.parse(localStorage.getItem("cart"));
                    var student2 = { name: name, quantity: quantity };
                    stored2.push(student2);
                    localStorage.setItem("cart", JSON.stringify(stored2));
                    setMainState({ callAlert: true })
                }
            }
        }
    }

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

    const handleIncrement = (e) => {
        if (quantitys >= e) {
            setQuantity(e)
        } else {
            setQuantity(quantitys + 1)
        }
    }
    const handleDecrement = () => {
        if (quantitys <= 1) {
            setQuantity(1)
        } else {
            setQuantity(quantitys - 1)
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
            url: "https://eatcom.onrender.com/AddReview",
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
        currentPage.current = 1;
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

    const rating = stars => '★★★★★☆☆☆☆☆'.slice(5 - stars, 10 - stars);

    return (
        <>
            {Object.values(data).slice(start, end).map((i) => {
                return (
                    <div className="col-lg-12 p-2 upPerTown" key={i._id}>
                        <NavLink reloadDocument to={`/DetailMenuPage/${i.foodname}/${i.foodcategory}`} className="d-flex align-items-center py-2" >
                            <img loading="lazy" className="flex-shrink-0 img-fluid rounded" src={i.foodimage} alt="" />
                            <div className="w-100 d-flex flex-column text-start ps-4">
                                <h6 className="d-flex justify-content-between border-bottom pb-2">
                                    <span className="text-black cutTextRightNow3">{i.foodname}</span>
                                    <span className="text-primary">{VND.format(i.foodprice)}</span>
                                </h6>
                                <p style={{ fontSize: 14 }} className="fst-italic text-secondary m-0">{i.foodcategory}</p>
                            </div>
                        </NavLink>
                        <div className="callingUpperT">
                            <div className="d-flex" style={{ gap: 5 }}>
                                {i.foodquantity < 1 ? (
                                    <button className="btnSonCallingUpperT" style={{ pointerEvents: "none", opacity: 0.5 }}>
                                        {window.innerWidth > 991 ? (
                                            <p className="m-0" style={{ fontSize: 15, color: "#fff" }}>Out of stock</p>
                                        ) : (
                                            <svg className="sonCallingUpperT" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" /></svg>
                                        )}
                                    </button>
                                ) : (
                                    i.foodcategory === "Main" ? (
                                        <button onClick={() => { setOpenModal(true); outshin(i); setmodalData(i) }} className="btnSonCallingUpperT">
                                            <svg className="sonCallingUpperT" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" /></svg>
                                        </button>
                                    ) : (
                                        <button onClick={() => addToCart(i.foodname, 1, i.foodquantity)} className="btnSonCallingUpperT">
                                            <svg className="sonCallingUpperT" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" /></svg>
                                        </button>
                                    )
                                )}
                                <button onClick={() => { setOpenModal2(true); setmodalData(i); outshin(i) }} className="btnSonCallingUpperT">
                                    <svg className="sonCallingUpperT" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" /></svg></button>
                            </div>
                        </div>
                    </div>
                )
            })}
            <Modal
                isOpen={openModal} onRequestClose={() => setOpenModal(false)} ariaHideApp={false}
                style={{
                    overlay: {
                        position: 'fixed',
                        zIndex: 998,
                        backgroundColor: 'rgb(33 33 33 / 75%)'
                    },
                    content: {
                        top: "50%",
                        left: "50%",
                        right: "auto",
                        bottom: "auto",
                        marginRight: "-50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "white",
                        width: "500px",
                        height: "auto",
                        zIndex: 999,
                        overflow: "hidden"
                    },
                }}>
                <div className="buhhuh2 py-3" style={{ width: "100%", height: "100%" }}>
                    <div className="product-info-tabs">
                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                            <li className="nav-item">
                                <button style={toppingCate ? { marginBottom: -2 } : null} className="active activeThis nav-link" id="description-tab">Topping</button>
                            </li>
                        </ul>
                    </div>
                    <div className='conquerLeft2'>
                        <button style={{ backgroundColor: meat ? "#959595" : null, color: meat ? "#fff" : "#6d6f71" }} onClick={() => { setMeat(true); setVege(false); setDrink(false) }}>Meat</button>
                        <button style={{ backgroundColor: vege ? "#959595" : null, color: vege ? "#fff" : "#6d6f71" }} onClick={() => { setVege(true); setMeat(false); setDrink(false) }}>Vegetables</button>
                        <button style={{ backgroundColor: drink ? "#959595" : null, color: drink ? "#fff" : "#6d6f71" }} onClick={() => { setDrink(true); setMeat(false); setVege(false) }}>Drink</button>
                    </div>
                    <div className='conquerRight2'>
                        {modalData?.foodcategory === "Main" ? (
                            <div className='py-3'>
                                {meat ? (
                                    <Topping cate={"Meat"} setDetailState={setMainState} modalData={modalData} setOpen={setOpenModal} />
                                ) : vege ? (
                                    <Topping cate={"Vegetables"} setDetailState={setMainState} modalData={modalData} setOpen={setOpenModal} />
                                ) : drink ? (
                                    <Topping cate={"Drink"} setDetailState={setMainState} modalData={modalData} setOpen={setOpenModal} />
                                ) : null}
                            </div>
                        ) : null}
                    </div>
                </div>
                <button style={{ right: 10 }} onClick={() => setOpenModal(false)} className='closeAlertKikuny'></button>
            </Modal>
            <Modal
                isOpen={openModal2} onRequestClose={() => setOpenModal2(false)} ariaHideApp={false}
                style={{
                    overlay: {
                        position: 'fixed',
                        zIndex: 998,
                        backgroundColor: 'rgb(33 33 33 / 75%)'
                    },
                    content: {
                        top: "50%",
                        left: "50%",
                        right: "auto",
                        bottom: "auto",
                        marginRight: "-50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "white",
                        width: "500px",
                        height: "auto",
                        zIndex: 999,
                        overflow: "hidden"
                    },
                }}>
                <div className="buhhuh2" style={{ width: "100%", height: "100%" }}>
                    <div className="product-info-tabs">
                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                            {modalData?.foodcategory === "Main" ? (
                                <li className="nav-item">
                                    <button style={toppingCate ? { margin: 0 } : null} onClick={() => { setReviewCate(false); setToppingCate(true) }} className={[toppingCate ? "active activeThis nav-link" : "navlink"]} id="description-tab">Information</button>
                                </li>
                            ) : null}
                            <li className="nav-item">
                                <div className="d-flex" style={{ gap: 5 }}>
                                    <button onClick={() => { setReviewCate(true); setToppingCate(false) }} className={[reviewCate ? "active activeThis nav-link" : "nav-link"]} id="review-tab" >Reviews ({modalData?.review?.length})</button>
                                    {reviewCate && token && modalData?.review?.length > 0 ? (
                                        <button onClick={() => wantTo ? setWantTo(false) : setWantTo(true)} className="beHoleX">{!detailState.checkKiu ? "+" : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" /></svg>}</button>
                                    ) : null}
                                </div>
                            </li>
                        </ul>
                        <div className="tab-content" id="myTabContent">
                            {toppingCate ? (
                                modalData?.foodcategory === "Main" ? (
                                    <div className="tab-pane active activeThis" id="description">
                                        <img loading="lazy" alt='' src={modalData?.foodimage} className='thisImageRespon2' />
                                        <div className='sonbuhhuh pt-3'>
                                            <div className="product-dtl">
                                                <div className="product-name">{modalData?.foodname}</div>
                                                <div className='d-flex align-items-center' style={{ gap: 10 }}>
                                                    <div className='d-flex' style={{ gap: 1 }}>
                                                        {getStars(modalData?.review)}
                                                    </div>
                                                    <p className='m-0'><span className='starGlowFriend2'>{modalData?.review.length}</span> review from customer</p>
                                                </div>
                                                <div className='d-flex align-items-center' style={{ gap: 15 }}>
                                                    <div className='d-flex align-items-center' style={{ gap: 5 }}>
                                                        <div className='statusProMax' style={{ backgroundColor: modalData?.foodquantity > 0 ? "#6cc942" : "tomato" }}></div>
                                                        <p className='m-0' style={{ color: modalData?.foodquantity > 0 ? "#6cc942" : "tomato" }}>{modalData?.foodquantity > 0 ? "Stocking" : "Out of stock"}</p>
                                                    </div>
                                                    <div className="product-price-discount"><span className='coverThisMoney'>$</span>{VND.format(modalData?.foodprice)}</div>
                                                </div>

                                                <p className="cutTextRightNow2">{modalData?.fooddescription}</p>

                                                <div className="product-count gotThisFlex">
                                                    <div>
                                                        {modalData?.foodquantity > 0 ? (
                                                            <div className='d-flex'>
                                                                <button onClick={() => handleDecrement()} className="btn btn-secondary">-</button>
                                                                <input type="number" min={1} max={modalData?.foodquantity} value={quantitys} className='qty mx-1' readOnly />
                                                                <button onClick={() => handleIncrement(modalData?.foodquantity)} className="btn btn-secondary">+</button>
                                                            </div>
                                                        ) : (
                                                            <div style={{ pointerEvents: "none", opacity: 0.5 }} className='d-flex'>
                                                                <button className="btn btn-secondary">-</button>
                                                                <input type="number" value={0} className='qty mx-1' />
                                                                <button className="btn btn-secondary">+</button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {modalData?.foodquantity > 0 ? (
                                                        <button onClick={() => addToCart(modalData?.foodname, quantitys, modalData?.foodquantity)} className="round-black-btn">Add to Cart</button>
                                                    ) : (
                                                        <button style={{ pointerEvents: "none", opacity: 0.5 }} className="round-black-btn">Out of stock</button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : null
                            ) : reviewCate ? (
                                modalData?.review?.length < 1 ? (
                                    <div className='bg-white p-3 HeroDecadeAF'>
                                        <p className="mb-20 text-center">There are no reviews yet.</p>
                                        {token ? (
                                            <>
                                                <form onSubmit={(e) => addreview(e, modalData._id)} className="review-form">
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
                                    <div className='Mk9782'>
                                        {!token ? (
                                            <div className='d-flex align-items-center justify-content-center'>
                                                <p className='text-center m-0'>You need </p>
                                                <NavLink className="nav-link p-0" reloadDocument to="/LoginSite">Login</NavLink>
                                                <p className='text-center m-0'> to review!</p>
                                            </div>
                                        ) : null}
                                        {wantTo ? (
                                            <div className='holdTall mb-3'>
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
                                                    <form onSubmit={(e) => addreview(e, modalData._id)} className="review-form">
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
                                                )}
                                            </div>
                                        ) : null}
                                        {detailState.wowreview.map((r) => {
                                            return (
                                                <Fragment key={r.date}>
                                                    <div className='gutton'>
                                                        <img alt='' height={50} width={50} src={r.image ? r.image : "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"} />
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
                                            onPageChange={(e) => handlePageClick(e.selected, modalData)}
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
                                )
                            ) : null}
                        </div>
                    </div>
                </div>
                <button style={{ right: 10 }} onClick={() => setOpenModal2(false)} className='closeAlertKikuny'></button>
            </Modal>
        </>
    )
}

export default ItemMenuComponent;
