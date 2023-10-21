import { NavLink } from "react-router-dom";
import $ from 'jquery';
import Cookies from "universal-cookie";
import Modal from 'react-modal'
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
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
        var items = document.getElementById("buttonCollapse")
        var collapse = document.getElementById("navbarCollapse")
        var dropdownToggle1 = document.getElementById("headups1")
        var dropdownMenu1 = document.getElementById("firstLv2")
        var dropdownToggle2 = document.getElementById("secondLv1")
        var dropdownMenu2 = document.getElementById("secondLv2")
        var showClass = "show"
        items.addEventListener("click", function () {
            if (collapse.classList.contains(showClass)) {
                collapse.classList.remove(showClass)
            } else {
                collapse.classList.add(showClass)
            }
        })

        dropdownToggle1.addEventListener("mouseenter", function () {
            dropdownMenu1.classList.add(showClass)
        })

        dropdownToggle1.addEventListener("mouseleave", function () {
            dropdownMenu1.classList.remove(showClass)
        })

        dropdownToggle2.addEventListener("click", function () {
            if (dropdownMenu2.classList.contains(showClass)) {
                dropdownMenu2.classList.remove(showClass)
            } else {
                dropdownMenu2.classList.add(showClass)
            }
        })

    }, [token])

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
        const $dropdown = $(".Move1");
        const $dropdownToggle = $(".Move2");
        const $dropdownMenu = $(".Move3");
        const showClass3 = "show";

        $dropdown.on("mouseenter", function () {
            $dropdownToggle.attr("aria-expanded", "true");
            $dropdownMenu.addClass(showClass3);
        })

        $dropdown.on("mouseleave", function () {
            $dropdownToggle.attr("aria-expanded", "false");
            $dropdownMenu.removeClass(showClass3);
        })
    })
    const SearchType = (e) => {
        e.preventDefault();
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

    const logoutThis = () => {
        window.location.href = "/"
        cookies.remove("TOKEN", { path: '/' });
    }
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 px-lg-5 py-3 py-lg-0">
                <a href="/" className="navbar-brand p-0">
                    <h1 className="text-primary m-0"><i className="fa fa-utensils me-3"></i>EatCom</h1>
                </a>
                <div className="d-flex">
                    <NavLink reloadDocument to="/Cart" className="nav-item nav-link responFormSearch">
                        <i className="fa-solid fa-cart-shopping"></i>
                        <span className='badge' id='lblCartCount'> {countVal} </span>
                    </NavLink>
                    <button id="buttonCollapse" className="navbar-toggler" type="button">
                        <span className="fa fa-bars"></span>
                    </button>
                </div>
                <div className="collapse navbar-collapse" id="navbarCollapse">
                    <div className="navbar-nav ms-auto py-0 justUYI">
                        <form onSubmit={(e) => SearchType(e)} className="responFormSearch">
                            <div className="d-flex justify-content-between">
                                <div className="SearchForm">
                                    <input className="inputSearch" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search something..." required />
                                    <input type="submit" style={{ display: "none" }}></input>
                                </div>
                                <button className="SearchSubmit" type="submit"><i className="fa-solid fa-magnifying-glass"></i></button>
                            </div>
                        </form>
                        <button onClick={setLogout} className="nav-item nav-link Wrinked nav-link-button responSearch" to="/"><i className="fa-solid fa-magnifying-glass"></i></button>
                        <NavLink reloadDocument to="/" activeclassname="active" className="nav-item nav-link Wrinked">Home</NavLink>
                        <div id="headups1" className="nav-item dropdown responSearch">
                            <a href="# " className="nav-link dropdown-toggle">Menu</a>
                            <div className="dropdown-menu m-0 text-center" id="firstLv2">
                                <NavLink reloadDocument to="/CategorySite/Meat/nto" className="dropdown-item">Meat</NavLink>
                                <NavLink reloadDocument to="/CategorySite/Drink/nto" className="dropdown-item">Drink</NavLink>
                                <NavLink reloadDocument to="/CategorySite/Vegetables/nto" className="dropdown-item">Vegetables</NavLink>
                            </div>
                        </div>
                        <div id="headups2" className="nav-item Wrinked dropdown responFormSearch">
                            <a href="# " className="nav-link dropdown-toggle" id="secondLv1">Menu</a>
                            <div className="dropdown-menu m-0 text-center" id="secondLv2">
                                <NavLink reloadDocument to="/CategorySite/Meat/nto" className="dropdown-item">Meat</NavLink>
                                <NavLink reloadDocument to="/CategorySite/Drink/nto" className="dropdown-item">Drink</NavLink>
                                <NavLink reloadDocument to="/CategorySite/Vegetables/nto" className="dropdown-item">Vegetables</NavLink>
                            </div>
                        </div>
                        <NavLink reloadDocument to="/TrackOrder" className="nav-item nav-link Wrinked">Track Order</NavLink>
                        <NavLink reloadDocument to="/BookingSite" className="nav-item nav-link Wrinked">Booking</NavLink>
                        <NavLink reloadDocument to="/ContactSite" className="nav-item nav-link Wrinked">Contact</NavLink>
                        <NavLink reloadDocument to="/Cart" className="nav-item nav-link Wrinked responSearch">
                            <i className="fa-solid fa-cart-shopping"></i>
                            <span className='badge' id='lblCartCount'> {countVal} </span>
                        </NavLink>
                    </div>
                    <div id="headups" className="nav-item dropdown mulHead Wrinked responSearch">
                        {token ? (
                            Object.values(GetUser).map((i) => {
                                const decode = jwtDecode(token)
                                if (i.userimage) {
                                    return (
                                        <div key={i._id} className="Move1">
                                            <img className="nav-link dropdown-toggle imgUser Move2" src={i.userimage} width={75} height={50} alt="" />
                                            <div className="dropdown-menu m-0 text-center Move3">
                                                {decode.userRole === 1 ? (
                                                    <NavLink reloadDocument to={`/UserPanel/${i._id}`} className="dropdown-item">Account</NavLink>
                                                ) : decode.userRole === 2 ? (
                                                    <NavLink reloadDocument to={"/EmployeePanel"} className="dropdown-item">Employee Panel</NavLink>
                                                ) : decode.userRole === 3 ? (
                                                    <NavLink reloadDocument to={"/ManagerPanel"} className="dropdown-item">Manager Panel</NavLink>
                                                ) : decode.userRole === 4 ? (
                                                    <NavLink reloadDocument to={"/AdminPanel"} className="dropdown-item">Admin Panel</NavLink>
                                                ) : null}
                                                <button onClick={() => logoutThis()} className="dropdown-item"><i className="fa-solid fa-right-from-bracket"></i> Logout</button>
                                            </div>
                                        </div>
                                    )

                                }
                                else {
                                    return (
                                        <div key={i._id} className="Move1">
                                            <img className="nav-link dropdown-toggle Move2 imgUser" src="https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg" width={70} height={55} alt="" />
                                            <div className="dropdown-menu m-0 text-center Move3">
                                                {decode.userRole === 1 ? (
                                                    <NavLink reloadDocument to={`/UserPanel/${i._id}`} className="dropdown-item">Account</NavLink>
                                                ) : decode.userRole === 2 ? (
                                                    <NavLink reloadDocument to={"/EmployeePanel"} className="dropdown-item">Employee Panel</NavLink>
                                                ) : decode.userRole === 3 ? (
                                                    <NavLink reloadDocument to={"/ManagerPanel"} className="dropdown-item">Manager Panel</NavLink>
                                                ) : decode.userRole === 4 ? (
                                                    <NavLink reloadDocument to={"/AdminPanel"} className="dropdown-item">Admin Panel</NavLink>
                                                ) : null}
                                                <button onClick={() => logoutThis()} className="dropdown-item"><i className="fa-solid fa-right-from-bracket"></i> Logout</button>
                                            </div>
                                        </div>
                                    )
                                }
                            })
                        ) : (
                            <>
                                <div className="me-3">
                                    <NavLink reloadDocument to="/LoginSite" className="btn btn-primary py-2 px-4 responFormSearch">Login</NavLink>
                                </div>
                                <NavLink reloadDocument to="/LoginSite" className="btn btn-primary py-2 px-4 responSearch">Login</NavLink>
                            </>
                        )}
                    </div>
                    <div className="responFormSearch">
                        {token ? (
                            Object.values(GetUser).map((i) => {
                                return (
                                    <Fragment key={i._id}>
                                        <div className="navbar-nav ms-auto py-0">
                                            <NavLink reloadDocument to={`/UserPanel/${i._id}`} className="nav-item nav-link Wrinked">Account</NavLink>
                                            <button onClick={() => logoutThis()} className="nav-item nav-link Wrinked"><i className="fa-solid fa-right-from-bracket"></i> Logout</button>
                                        </div>
                                    </Fragment>
                                )
                            })
                        ) : (
                            <>
                                <div className="navbar-nav ms-auto py-0">
                                    <NavLink reloadDocument to="/LoginSite" className="nav-item nav-link Wrinked responFormSearch">Login</NavLink>
                                </div>
                            </>
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
                    <form onSubmit={(e) => SearchType(e)} className="SearchForm">
                        <input className="inputSearch" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search something..." required />
                        <input type="submit" style={{ display: "none" }}></input>
                    </form>
                    <button className="SearchSubmit" onClick={(e) => SearchType(e)} type="submit"><i className="fa-solid fa-magnifying-glass"></i></button>
                </div>
            </Modal>
        </>
    );
}
export default Header;