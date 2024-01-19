import { NavLink } from "react-router-dom";
import $ from 'jquery';
import Cookies from "universal-cookie";
import Modal from 'react-modal'
import { Fragment, useEffect, useReducer } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { googleLogout } from '@react-oauth/google';

function Header({ type }) {
    const val = JSON.parse(localStorage.getItem('cart'))
    const [headerState, setHeaderState] = useReducer((prev, next) => ({
        ...prev, ...next
    }), {
        GetUser: [],
        logout: false,
        search: "",
        spinner: false,
        debounceCall: [],
    })
    var candecode = null
    var countVal = 0
    if (val) {
        countVal = val.length
    } else {
        countVal = 0
    }
    const cookies = new Cookies();
    const token = cookies.get("TOKEN");
    if (token) {
        candecode = jwtDecode(token);
    }
    useEffect(() => {
        if (token) {
            const decoded = jwtDecode(token);
            if (decoded.userRole !== 1.5) {
                const configuration = {
                    method: "get",
                    url: "https://eatcom.onrender.com/GetDetailUser",
                    params: {
                        userid: decoded.userId
                    }
                };
                axios(configuration)
                    .then((result) => {
                        setHeaderState({ GetUser: result.data })
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        }
        var items = document.getElementById("buttonCollapse")
        var collapse = document.getElementById("navbarCollapse")
        var dropdownToggle2 = document.getElementById("secondLv1")
        var dropdownMenu2 = document.getElementById("secondLv2")
        var showClass = "show"
        items.addEventListener("click", function () {
            if (collapse.classList.contains(showClass)) {
                collapse.classList.remove(showClass)
            } else {
                collapse.classList.add(showClass)
            }
        }, { passive: true })

        dropdownToggle2.addEventListener("click", function () {
            if (dropdownMenu2.classList.contains(showClass)) {
                dropdownMenu2.classList.remove(showClass)
            } else {
                dropdownMenu2.classList.add(showClass)
            }
        }, { passive: true })

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

        if (type) {
            $('.GroundW').addClass('SpecialHeader')
        }
    })
    const SearchType = (e) => {
        e.preventDefault();
        const configuration = {
            method: "get",
            url: "https://eatcom.onrender.com/GetSearch",
            params: {
                foodSearch: headerState.search
            }
        };
        axios(configuration)
            .then(() => {
                window.location.href = `/SearchSite/${headerState.search}/nto`
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        if (headerState.search !== "") {
            const delayDebounceFn = setTimeout(() => {
                setHeaderState({ spinner: true })
                const configuration = {
                    method: "get",
                    url: "https://eatcom.onrender.com/GetDebounce",
                    params: {
                        foodSearch: headerState.search
                    }
                };
                setTimeout(() => {
                    axios(configuration)
                        .then((res) => {
                            setHeaderState({ spinner: false })
                            setHeaderState({ debounceCall: res.data.data })
                        })
                        .catch((error) => {
                            setHeaderState({ spinner: false })
                            console.log(error);
                        });
                }, 350);
            }, 750)
            return () => clearTimeout(delayDebounceFn)
        } else {
            return () => setHeaderState({ debounceCall: [] })
        }
    }, [headerState.search])

    const logoutThis = () => {
        cookies.remove("TOKEN", { path: '/' });
        window.location.href = "/"
    }

    const googleLogoutNow = () => {
        googleLogout()
        cookies.remove("TOKEN", { path: '/' });
        window.location.href = "/"
    }
    return (
        <>
            <nav className="navbar navbar-expand-lg GroundW navbar-dark px-4 px-lg-5 py-3 py-lg-0">
                <a href="/" className="navbar-brand p-0">
                    <h1 className="text-primary thisTextH1 m-0"><svg style={{ fill: "#FEA116" }} className="me-3" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M416 0C400 0 288 32 288 176V288c0 35.3 28.7 64 64 64h32V480c0 17.7 14.3 32 32 32s32-14.3 32-32V352 240 32c0-17.7-14.3-32-32-32zM64 16C64 7.8 57.9 1 49.7 .1S34.2 4.6 32.4 12.5L2.1 148.8C.7 155.1 0 161.5 0 167.9c0 45.9 35.1 83.6 80 87.7V480c0 17.7 14.3 32 32 32s32-14.3 32-32V255.6c44.9-4.1 80-41.8 80-87.7c0-6.4-.7-12.8-2.1-19.1L191.6 12.5c-1.8-8-9.3-13.3-17.4-12.4S160 7.8 160 16V150.2c0 5.4-4.4 9.8-9.8 9.8c-5.1 0-9.3-3.9-9.8-9L127.9 14.6C127.2 6.3 120.3 0 112 0s-15.2 6.3-15.9 14.6L83.7 151c-.5 5.1-4.7 9-9.8 9c-5.4 0-9.8-4.4-9.8-9.8V16zm48.3 152l-.3 0-.3 0 .3-.7 .3 .7z" /></svg>EatCom</h1>
                </a>
                <div className="d-flex fatherSvgCart1">
                    <NavLink reloadDocument to="/Cart" className="nav-item nav-link responFormSearch">
                        <svg className="svgCart1" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" /></svg>
                        <span className='badge' id='lblCartCount'> {countVal} </span>
                    </NavLink>
                    <button id="buttonCollapse" className="navbar-toggler" type="button">
                        <svg style={{ fill: "#777" }} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" /></svg>
                    </button>
                </div>
                <div className="collapse navbar-collapse" id="navbarCollapse">
                    <div className="navbar-nav ms-auto py-0 justUYI">
                        <div className="responFormSearch" style={{ position: "relative" }}>
                            <form onSubmit={(e) => SearchType(e)}>
                                <div className="d-flex justify-content-between" style={{ height: 45 }}>
                                    <div className="SearchForm">
                                        <input className="inputSearch" onChange={(e) => setHeaderState({ search: e.target.value })} placeholder="Search something..." required />
                                        <input type="submit" style={{ display: "none" }}></input>
                                    </div>
                                    <button className="SearchSubmit" type="submit"><svg style={{ fill: "#fff" }} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" /></svg></button>
                                </div>
                            </form>
                            {headerState.search !== "" ? (
                                <div style={{ position: "absolute", width: "100%", zIndex: 10, backgroundColor: "#fff", marginTop: 5, height: 350 }}>
                                    <div className="underSearchNaN">
                                        {headerState.spinner ? (
                                            <div id="spinner" className="show position-fixed translate-middle w-100 vh-100 start-50 d-flex align-items-center justify-content-center" style={{ top: "20%" }}>
                                                <div className="spinner-border text-primary" style={{ width: 2 + "rem", height: 2 + "rem" }} role="status">
                                                    <span className="sr-only"></span>
                                                </div>
                                            </div>
                                        ) : null}
                                        {headerState.debounceCall?.map((i) => {
                                            return (
                                                <NavLink key={i._id} className="insideUnderSearchNaN2" reloadDocument to={`/DetailMenuPage/${i.foodname}/${i.foodcategory}`}>
                                                    <div className="d-flex" style={{ gap: 15, width: "90%" }}>
                                                        <img alt="" src={i.foodimage} width={70} height={65} />
                                                        <div className="d-flex" style={{ flexDirection: "column", gap: 7 }}>
                                                            <p className="m-0 text-nowrap"><b>{i.foodname}</b></p>
                                                            <p className="m-0 text-nowrap">{i.foodcategory}</p>
                                                        </div>
                                                    </div>
                                                    <div className="takeKare2">
                                                        <p className="m-0" style={{ color: "gray", fontSize: 25 }}>{">"}</p>
                                                    </div>
                                                </NavLink>
                                            )
                                        })}
                                        {headerState.debounceCall.length > 0 ? (
                                            <div className="wantDer2">
                                                <NavLink reloadDocument to={`/SearchSite/${headerState.search}/nto`}>See all items</NavLink>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                        <button aria-labelledby="SearchButton" onClick={() => setHeaderState({ logout: true })} className="nav-item nav-link Wrinked nav-link-button responSearch FatherSvgSearch" to="/"><svg className="svgSearch" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" /></svg></button>
                        <NavLink reloadDocument to="/" activeclassname="active" className="nav-item nav-link Wrinked">Home</NavLink>
                        <div id="headups1" className="nav-item dropdown responSearch">
                            <NavLink reloadDocument to="/CategorySite/Menu/nto" className="nav-link">Menu</NavLink>
                        </div>
                        <div id="headups2" className="nav-item Wrinked dropdown responFormSearch">
                            <NavLink reloadDocument to="/CategorySite/Menu/nto" className="nav-link" id="secondLv1">Menu</NavLink>
                        </div>
                        <NavLink reloadDocument to="/Announcement" className="nav-item nav-link Wrinked">Announcement</NavLink>
                        <NavLink reloadDocument to="/TrackOrder" className="nav-item nav-link Wrinked">Track Order</NavLink>
                        <NavLink reloadDocument to="/BookingSite" className="nav-item nav-link Wrinked">Booking</NavLink>
                        <NavLink reloadDocument to="/ContactSite" className="nav-item nav-link Wrinked">Contact</NavLink>
                        <div className="fatherSvgCart1">
                            <NavLink reloadDocument to="/Cart" className="nav-item nav-link Wrinked responSearch">
                                <svg className="svgCart1" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" /></svg>
                                <span className='badge' id='lblCartCount'> {countVal} </span>
                            </NavLink>
                        </div>
                    </div>
                    <div id="headups" className="nav-item dropdown mulHead Wrinked responSearch">
                        {token ? (
                            candecode.userRole !== 1.5 ? (
                                Object.values(headerState.GetUser).map((i) => {
                                    const decode = jwtDecode(token)
                                    return (
                                        <div key={i._id} className="Move1">
                                            <div className="fatherimgUser">
                                                <img className="nav-link dropdown-toggle Move2 imgUser" src={i.userimage ? i.userimage : "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"} width={60} height={55} alt="" />
                                            </div>
                                            <div className="dropdown-menu m-0 text-center Move3">
                                                <NavLink reloadDocument to={decode.userRole === 1 ? `/UserPanel/${i._id}` : decode.userRole === 2 ? "/EmployeePanel" : decode.userRole === 3 ? "/ManagerPanel" : decode.userRole === 4 ? "/AdminPanel" : null} className="dropdown-item">{decode.userRole === 1 ? "Account" : decode.userRole === 2 ? "Employee Panel" : decode.userRole === 3 ? "Manager Panel" : decode.userRole === 4 ? "Admin Panel" : null}</NavLink>
                                                <button onClick={() => logoutThis()} className="dropdown-item"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" /></svg> Logout</button>
                                            </div>
                                        </div>
                                    )

                                })
                            ) : candecode.userRole === 1.5 ? (
                                <div className="Move1">
                                    <img className="nav-link dropdown-toggle imgUser Move2 ms-3" src={candecode.userImage} width={60} height={55} alt="" />
                                    <div className="dropdown-menu m-0 text-center Move3">
                                        <NavLink reloadDocument to={`/UserPanel/${candecode.userId}`} className="dropdown-item">Account</NavLink>
                                        <button onClick={() => googleLogoutNow()} className="dropdown-item"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" /></svg> Logout</button>
                                    </div>
                                </div>
                            ) : null
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
                            candecode.userRole !== 1.5 ? (
                                Object.values(headerState.GetUser).map((i) => {
                                    return (
                                        <Fragment key={i._id}>
                                            <div className="navbar-nav ms-auto py-0">
                                                <NavLink reloadDocument to={`/UserPanel/${i._id}`} className="nav-item nav-link Wrinked">Account</NavLink>
                                                <button onClick={() => logoutThis()} className="nav-item nav-link Wrinked">Logout</button>
                                            </div>
                                        </Fragment>
                                    )
                                })
                            ) : candecode.userRole === 1.5 ? (
                                <div className="navbar-nav ms-auto py-0">
                                    <NavLink reloadDocument to={`/UserPanel/${candecode.userId}`} className="nav-item nav-link Wrinked">Account</NavLink>
                                    <button onClick={() => googleLogoutNow()} className="nav-item nav-link Wrinked">Logout</button>
                                </div>
                            ) : null
                        ) : (
                            <div className="navbar-nav ms-auto py-0">
                                <NavLink reloadDocument to="/LoginSite" className="nav-item nav-link Wrinked responFormSearch">Login</NavLink>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
            <Modal
                isOpen={headerState.logout} onRequestClose={() => setHeaderState({ logout: false })} ariaHideApp={false}
                style={{
                    overlay: {
                        backgroundColor: 'rgb(33 33 33 / 75%)'
                    },
                    content: {
                        border: "none",
                        top: "65%",
                        left: "50%",
                        right: "auto",
                        bottom: "auto",
                        marginRight: "-50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "transparent",
                        width: 400,
                        overflow: "hidden",
                    },
                }}>
                <div style={{ height: 410 }} className={headerState.search !== "" ? "fatherSearchNaN" : null}>
                    <div className="searchNaN">
                        <form onSubmit={(e) => SearchType(e)} className="SearchForm">
                            <input className="inputSearch" id="typer" onChange={(e) => setHeaderState({ search: e.target.value })} placeholder="Search something..." required />
                            <input type="submit" style={{ display: "none" }}></input>
                        </form>
                        <button className="SearchSubmit" onClick={(e) => SearchType(e)} type="submit"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" /></svg></button>
                    </div>
                    {headerState.search !== "" ? (
                        <div className="underSearchNaN">
                            {headerState.spinner ? (
                                <div id="spinner" className="show position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
                                    <div className="spinner-border text-primary" style={{ width: 2 + "rem", height: 2 + "rem" }} role="status">
                                        <span className="sr-only"></span>
                                    </div>
                                </div>
                            ) : null}
                            {headerState.debounceCall?.map((i) => {
                                return (
                                    <NavLink key={i._id} className="insideUnderSearchNaN" reloadDocument to={`/DetailMenuPage/${i.foodname}/${i.foodcategory}`}>
                                        <div className="d-flex" style={{ gap: 15, width: "90%" }}>
                                            <img alt="" src={i.foodimage} width={70} height={65} />
                                            <div className="d-flex" style={{ flexDirection: "column", gap: 7 }}>
                                                <p className="m-0 text-nowrap"><b>{i.foodname}</b></p>
                                                <p className="m-0 text-nowrap">{i.foodcategory}</p>
                                            </div>
                                        </div>
                                        <div className="takeKare">
                                            <p className="m-0" style={{ color: "lightgray", fontSize: 25 }}>{">"}</p>
                                        </div>
                                    </NavLink>
                                )
                            })}
                            {headerState.debounceCall.length > 0 ? (
                                <div className="wantDer">
                                    <NavLink reloadDocument to={`/SearchSite/${headerState.search}/nto`}>See all items</NavLink>
                                </div>
                            ) : null}
                        </div>
                    ) : null}
                </div>
            </Modal>
        </>
    );
}
export default Header;