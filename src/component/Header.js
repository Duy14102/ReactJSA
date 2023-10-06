import { NavLink } from "react-router-dom";
import $ from 'jquery';
import Cookies from "universal-cookie";
import Modal from 'react-modal'
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import LazyLoad from "react-lazyload";
import jwtDecode from "jwt-decode";

function Header() {
    const val = JSON.parse(localStorage.getItem('cart'))
    const [GetUser, setGetUser] = useState([])
    var countVal = 0
    if (val) {
        countVal = val.length
    } else {
        countVal = 0
    }
    const cookies = new Cookies();
    const token = cookies.get("TOKEN");
    const [logout, setLogout] = useState(false);
    const [search, setSearch] = useState("")
    $(function () {
        // Sticky Navbar
        $(window).on("scroll", function () {
            if ($(this).scrollTop() > 45) {
                $('.navbar').addClass('sticky-top shadow-sm');
            } else {
                $('.navbar').removeClass('sticky-top shadow-sm');
            }
        });

        // Dropdown on mouse hover
        const $dropdown = $(".dropdown");
        const $dropdownToggle = $(".dropdown-toggle");
        const $dropdownMenu = $(".dropdown-menu");
        const showClass = "show";

        $dropdown.on("mouseenter", function () {
            const $this = $(this);
            $this.addClass(showClass);
            $this.find($dropdownToggle).attr("aria-expanded", "true");
            $this.find($dropdownMenu).addClass(showClass);
        })

        $dropdown.on("mouseleave", function () {
            const $this = $(this);
            $this.removeClass(showClass);
            $this.find($dropdownToggle).attr("aria-expanded", "false");
            $this.find($dropdownMenu).removeClass(showClass);
        })

    })
    const SearchType = () => {
        const configuration = {
            method: "get",
            url: "http://localhost:3000/GetSearch",
            params: {
                foodSearch: search
            }
        };
        axios(configuration)
            .then(() => {
                window.location.href = `/SearchSite/${search}/nto`
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        const getDetailUser = () => {
            if (token) {
                const decoded = jwtDecode(token);
                const configuration = {
                    method: "get",
                    url: "http://localhost:3000/GetDetailUser",
                    params: {
                        userid: decoded.userId
                    }
                };
                axios(configuration)
                    .then((result) => {
                        setGetUser(result.data)
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        }
        getDetailUser()
    }, [token])

    const logoutThis = () => {
        window.location.href = "/"
        cookies.remove("TOKEN", { path: '/' });
    }
    return (
        <LazyLoad>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 px-lg-5 py-3 py-lg-0">
                <a href="/" className="navbar-brand p-0">
                    <h1 className="text-primary m-0"><i className="fa fa-utensils me-3"></i>EatCom</h1>
                    {/*<img src="img/logo.png" alt="Logo">*/}
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                    <span className="fa fa-bars"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarCollapse">
                    <div className="navbar-nav ms-auto py-0 pe-4">
                        <button onClick={setLogout} className="nav-item nav-link nav-link-button" to="/"><i className="fa-solid fa-magnifying-glass"></i></button>
                        <NavLink reloadDocument to="/" activeclassname="active" className="nav-item nav-link">Home</NavLink>
                        <div id="headups" className="nav-item dropdown">
                            <a href="# " className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Menu</a>
                            <div className="dropdown-menu m-0 text-center">
                                <NavLink reloadDocument to="/CategorySite/Meat/nto" className="dropdown-item">Meat</NavLink>
                                <NavLink reloadDocument to="/CategorySite/Drink/nto" className="dropdown-item">Drink</NavLink>
                                <NavLink reloadDocument to="/CategorySite/Vegetables/nto" className="dropdown-item">Vegetables</NavLink>
                            </div>
                        </div>
                        <NavLink reloadDocument to="/TrackOrder" className="nav-item nav-link">Track Order</NavLink>
                        <NavLink reloadDocument to="/ContactSite" className="nav-item nav-link">Contact</NavLink>
                        <div id="headups" className="nav-item dropdown">
                            <a href="# " className="nav-link dropdown-toggle" data-bs-toggle="dropdown">More</a>
                            <div className="dropdown-menu m-0 text-center">
                                <NavLink reloadDocument to="/BookingSite" className="dropdown-item">Booking</NavLink>
                                <NavLink reloadDocument to="/TeamSite" className="dropdown-item">Our Team</NavLink>
                                <NavLink reloadDocument to="/TestiSite" className="dropdown-item">Testimonial</NavLink>
                            </div>
                        </div>
                        <NavLink reloadDocument to="/Cart" className="nav-item nav-link">
                            <i className="fa-solid fa-cart-shopping"></i>
                            <span className='badge' id='lblCartCount'> {countVal} </span>
                        </NavLink>
                    </div>
                    <div id="headups" className="nav-item dropdown">
                        {token ? (
                            <>
                                {Object.values(GetUser).map((i) => {
                                    if (i.userimage) {
                                        return (
                                            <Fragment key={i._id}>
                                                <img data-bs-toggle="dropdown" className="nav-link dropdown-toggle imgUser" src={i.userimage} width={75} height={50} alt="" />
                                                <div className="dropdown-menu m-0 text-center">
                                                    <NavLink reloadDocument to={`/UserPanel/${i._id}`} className="dropdown-item">Account</NavLink>
                                                    <button onClick={() => logoutThis()} className="dropdown-item"><i className="fa-solid fa-right-from-bracket"></i> Logout</button>
                                                </div>
                                            </Fragment>
                                        )

                                    }
                                    else {
                                        return (
                                            <Fragment key={i._id}>
                                                <img data-bs-toggle="dropdown" className="nav-link dropdown-toggle imgUser" src="https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg" width={70} height={55} alt="" />
                                                <div className="dropdown-menu m-0 text-center">
                                                    <NavLink reloadDocument to={`/UserPanel/${i._id}`} className="dropdown-item">Account</NavLink>
                                                    <button onClick={() => logoutThis()} className="dropdown-item"><i className="fa-solid fa-right-from-bracket"></i> Logout</button>
                                                </div>
                                            </Fragment>
                                        )
                                    }
                                })}
                            </>
                        ) : (
                            <NavLink reloadDocument to="/LoginSite" className="btn btn-primary py-2 px-4">Login</NavLink>
                        )}
                    </div>
                </div>
            </nav>
            <Modal
                isOpen={logout} onRequestClose={() => setLogout(false)} ariaHideApp={false}
                style={{
                    overlay: {
                        backgroundColor: 'rgb(33 33 33 / 75%)'
                    },
                    content: {
                        borderRadius: "99px",
                        border: "none",
                        padding: "7px",
                        top: "50%",
                        left: "50%",
                        right: "auto",
                        bottom: "auto",
                        marginRight: "-50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "white",
                        width: 400,
                        overflow: "hidden",
                    },
                }}>
                <div className="d-flex justify-content-between">
                    <form className="SearchForm">
                        <input className="inputSearch" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search something..."></input>
                    </form>
                    <button className="SearchSubmit" onClick={() => SearchType()} type="submit"><i className="fa-solid fa-magnifying-glass"></i></button>
                </div>
            </Modal>
        </LazyLoad >
    );
}
export default Header;