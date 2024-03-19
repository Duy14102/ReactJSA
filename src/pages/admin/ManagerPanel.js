import $ from 'jquery';
import { useEffect, useState, useRef } from 'react';
import Cookies from 'universal-cookie';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Swal from 'sweetalert2';
import MainOrder from '../../component/admin/MainOrder';
import MainBooking from '../../component/employee/MainBooking';
import MainTable from '../../component/employee/MainTable';
import MainMenu from '../../component/admin/MainMenu';
import MainAnnounce from '../../component/employee/MainAnnounce';
import NotFound from '../../component/outOfBorder/NotFound';
import MainUiux from '../../component/employee/MainUiux';
import ManagerDashboard from '../../component/outOfBorder/ManagerDashboard';
import LayoutManager from './LayoutManager';
import socketIOClient from "socket.io-client";

function ManagerPanel() {
    const cookies = new Cookies();
    const token = cookies.get("TOKEN");
    const name = jwtDecode(token)
    const [GetUser, setGetUser] = useState([])
    const [UserImage, setImage] = useState()
    const [spinner, setSpinner] = useState(false)
    const [countOne, setCountOne] = useState()
    const [countTwo, setCountTwo] = useState()
    const [countThree, setCountThree] = useState()
    const [countFour, setCountFour] = useState()
    const [countFive, setCountFive] = useState()
    const [countSix, setCountSix] = useState()
    const [Load0, setLoad0] = useState(false)
    const [Load6, setLoad6] = useState(false)
    const [Load1, setLoad1] = useState(false)
    const [Load2, setLoad2] = useState(false)
    const [Load3, setLoad3] = useState(false)
    const [Load4, setLoad4] = useState(false)
    const [Load5, setLoad5] = useState(false)
    const socketRef = useRef();

    function Notifi(count, item, tabs, setCount) {
        const countTabs = localStorage.getItem('tabs')
        if (count) {
            const plus = parseInt(localStorage.getItem(item)) + 1
            if (countTabs === tabs) {
                localStorage.removeItem(item)
                setCount(null)
            } else {
                localStorage.setItem(item, plus)
                setCount(plus)
            }
        } else {
            if (countTabs !== tabs) {
                localStorage.setItem(item, 1)
                setCount(1)
            }
        }
    }

    useEffect(() => {
        if (localStorage.getItem("CountNewContact")) {
            setCountOne(localStorage.getItem("CountNewContact"))
        }
        if (localStorage.getItem("CountNewCart")) {
            setCountTwo(localStorage.getItem("CountNewCart"))
        }
        if (localStorage.getItem("CountNewUI")) {
            setCountThree(localStorage.getItem("CountNewUI"))
        }
        if (localStorage.getItem("CountNewAnnounce")) {
            setCountFour(localStorage.getItem("CountNewAnnounce"))
        }
        if (localStorage.getItem("CountNewBook")) {
            setCountFive(localStorage.getItem("CountNewBook"))
        }
        if (localStorage.getItem("CountNewTable")) {
            setCountSix(localStorage.getItem("CountNewTable"))
        }

        socketRef.current = socketIOClient.connect("https://eatcom.onrender.com")

        //Count one
        socketRef.current.on('AddContactSuccess', dataGot => {
            Notifi(localStorage.getItem("CountNewContact"), "CountNewContact", "dashboard", setCountOne)
        })

        socketRef.current.on('DeleteContactSuccess', dataGot => {
            if (dataGot.mag !== name.userId) {
                Notifi(localStorage.getItem("CountNewContact"), "CountNewContact", "dashboard", setCountOne)
            }
        })

        socketRef.current.on('FinishTaskSuccess', dataGot => {
            Notifi(localStorage.getItem("CountNewContact"), "CountNewContact", "dashboard", setCountOne)
        })

        //Count Two
        socketRef.current.on('PaidCodSuccess', dataGot => {
            Notifi(localStorage.getItem("CountNewCart"), "CountNewCart", "about", setCountTwo)
        })

        socketRef.current.on('PaidVnpaySuccess', dataGot => {
            Notifi(localStorage.getItem("CountNewCart"), "CountNewCart", "about", setCountTwo)
        })

        socketRef.current.on('PaidPaypalSuccess', dataGot => {
            Notifi(localStorage.getItem("CountNewCart"), "CountNewCart", "about", setCountTwo)
        })

        socketRef.current.on('CancelVnpaySuccess', dataGot => {
            Notifi(localStorage.getItem("CountNewCart"), "CountNewCart", "about", setCountTwo)
        })

        socketRef.current.on('CustomerWantCancel', dataGot => {
            Notifi(localStorage.getItem("CountNewCart"), "CountNewCart", "about", setCountTwo)
        })

        socketRef.current.on('CancelRequestFourSuccess', dataGot => {
            Notifi(localStorage.getItem("CountNewCart"), "CountNewCart", "about", setCountTwo)
        })

        socketRef.current.on('CancelByMagNormalSuccess', dataGot => {
            if (name.userId === dataGot.empid) {
                Notifi(localStorage.getItem("CountNewCart"), "CountNewCart", "about", setCountTwo)
            }
        })

        socketRef.current.on('CancelByMagPaidSuccess', dataGot => {
            if (name.userId === dataGot.empid) {
                Notifi(localStorage.getItem("CountNewCart"), "CountNewCart", "about", setCountTwo)
            }
        })

        //Count Three
        socketRef.current.on('ChangeHeroImageSuccess', dataGot => {
            if (dataGot.mag !== name.userId) {
                Notifi(localStorage.getItem("CountNewUI"), "CountNewUI", "uiux", setCountThree)
            }
        })

        socketRef.current.on('ChangeWordUpSuccess', dataGot => {
            if (dataGot.mag !== name.userId) {
                Notifi(localStorage.getItem("CountNewUI"), "CountNewUI", "uiux", setCountThree)
            }
        })

        socketRef.current.on('ChangeWordMiddleSuccess', dataGot => {
            if (dataGot.mag !== name.userId) {
                Notifi(localStorage.getItem("CountNewUI"), "CountNewUI", "uiux", setCountThree)
            }
        })

        socketRef.current.on('ChangeWordDownSuccess', dataGot => {
            if (dataGot.mag !== name.userId) {
                Notifi(localStorage.getItem("CountNewUI"), "CountNewUI", "uiux", setCountThree)
            }
        })

        socketRef.current.on('ChangeWordTimeSuccess', dataGot => {
            if (dataGot.mag !== name.userId) {
                Notifi(localStorage.getItem("CountNewUI"), "CountNewUI", "uiux", setCountThree)
            }
        })

        //Count Four
        socketRef.current.on('UpdateNewsSuccess', dataGot => {
            if (dataGot.mag !== name.userId) {
                Notifi(localStorage.getItem("CountNewAnnounce"), "CountNewAnnounce", "announce", setCountFour)
            }
        })

        //Count Five
        socketRef.current.on('AddNewBookingSuccess', dataGot => {
            Notifi(localStorage.getItem("CountNewBook"), "CountNewBook", "booking", setCountFive)
        })

        socketRef.current.on('CancelBookingSuccess', dataGot => {
            Notifi(localStorage.getItem("CountNewBook"), "CountNewBook", "booking", setCountFive)
        })

        socketRef.current.on('DenyBookingSuccess', dataGot => {
            if (dataGot.mag !== name.userId) {
                Notifi(localStorage.getItem("CountNewBook"), "CountNewBook", "booking", setCountFive)
            }
        })

        socketRef.current.on('CheckoutBookingSuccess', dataGot => {
            if (dataGot.mag !== name.userId) {
                Notifi(localStorage.getItem("CountNewBook"), "CountNewBook", "booking", setCountFive)
            }
        })

        //Count Six
        socketRef.current.on('AddTableCustomerSuccess', dataGot => {
            if (dataGot.mag !== name.userId) {
                Notifi(localStorage.getItem("CountNewTable"), "CountNewTable", "table", setCountSix)
            }
        })

        socketRef.current.on('AddTableByHandSuccess', dataGot => {
            if (dataGot.mag !== name.userId) {
                Notifi(localStorage.getItem("CountNewTable"), "CountNewTable", "table", setCountSix)
            }
        })

        socketRef.current.on('AddItemToTableSuccess', dataGot => {
            if (dataGot.mag !== name.userId) {
                Notifi(localStorage.getItem("CountNewTable"), "CountNewTable", "table", setCountSix)
            }
        })

        socketRef.current.on('DeleteTableSuccess', dataGot => {
            if (dataGot.mag !== name.userId) {
                Notifi(localStorage.getItem("CountNewTable"), "CountNewTable", "table", setCountSix)
            }
        })

        socketRef.current.on('ChangeTableNameSuccess', dataGot => {
            if (dataGot.mag !== name.userId) {
                Notifi(localStorage.getItem("CountNewTable"), "CountNewTable", "table", setCountSix)
            }
        })

        socketRef.current.on('ChangeTableSuccess', dataGot => {
            if (dataGot.mag !== name.userId) {
                Notifi(localStorage.getItem("CountNewTable"), "CountNewTable", "table", setCountSix)
            }
        })

        socketRef.current.on('CheckoutNormalSuccess', dataGot => {
            if (dataGot.mag !== name.userId) {
                Notifi(localStorage.getItem("CountNewTable"), "CountNewTable", "table", setCountSix)
            }
        })

        socketRef.current.on('QrCodeTableActiveSuccess', dataGot => {
            Notifi(localStorage.getItem("CountNewTable"), "CountNewTable", "table", setCountSix)
        })

        socketRef.current.on('DeleteQritemSuccess', dataGot => {
            Notifi(localStorage.getItem("CountNewTable"), "CountNewTable", "table", setCountSix)
        })

        socketRef.current.on('Checkout4QrSuccess', dataGot => {
            Notifi(localStorage.getItem("CountNewTable"), "CountNewTable", "table", setCountSix)
        })

        return () => {
            socketRef.current.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const configuration2 = {
            method: "get",
            url: 'https://eatcom.onrender.com/GetDetailUser',
            params: {
                userid: name.userId
            }
        }
        axios(configuration2)
            .then((res) => {
                setGetUser(res.data)
            })
            .catch((err) => {
                console.log(err);
            })
        var elem = $('.menu a[data-menu]')
        var tabs = localStorage.getItem('tabs')
        $('[data-page="' + tabs + '"]').addClass('active');
        for (var i = 0; i < elem.length; i++) {
            if (elem[i].dataset.menu === tabs) {
                elem[i].classList.add('active');
            }
        }
        if ($('.content .page:nth-child(1)').hasClass('active') === true) {
            setLoad0(true)
        }
        if ($('.content .page:nth-child(2)').hasClass('active') === true) {
            setLoad6(true)
        }
        if ($('.content .page:nth-child(3)').hasClass('active') === true) {
            setLoad1(true)
        }
        if ($('.content .page:nth-child(4)').hasClass('active') === true) {
            setLoad2(true)
        }
        if ($('.content .page:nth-child(5)').hasClass('active') === true) {
            setLoad3(true)
        }
        if ($('.content .page:nth-child(6)').hasClass('active') === true) {
            setLoad4(true)
        }
        if ($('.content .page:nth-child(7)').hasClass('active') === true) {
            setLoad5(true)
        }
    }, [name.userId])

    $(function () {
        $('.menu a[data-menu]').on('click', function () {
            var menu = $(this).data('menu');
            $('.menu a.active').removeClass('active');
            $(this).addClass('active');
            $('.active[data-page]').removeClass('active');
            $('[data-page="' + menu + '"]').addClass('active');

            if ($('.content .page:nth-child(1)').hasClass('active') === true) {
                setLoad0(true)
            }
            if ($('.content .page:nth-child(2)').hasClass('active') === true) {
                setLoad6(true)
            }
            if ($('.content .page:nth-child(3)').hasClass('active') === true) {
                setLoad1(true)
            }
            if ($('.content .page:nth-child(4)').hasClass('active') === true) {
                setLoad2(true)
            }
            if ($('.content .page:nth-child(5)').hasClass('active') === true) {
                setLoad3(true)
            }
            if ($('.content .page:nth-child(6)').hasClass('active') === true) {
                setLoad4(true)
            }
            if ($('.content .page:nth-child(7)').hasClass('active') === true) {
                setLoad5(true)
            }
        });

        $('body').on('click', '[data-dialog]', function () {
            var action = $(this).data('dialog');
            switch (action) {
                case 'logout':
                    $('.dialog').addClass('active');
                    break;
                default: break;
            }
        });

        $('body').on('click', '[data-dialog-action]', function () {
            var action = $(this).data('dialog-action');
            switch (action) {
                case 'cancel':
                    $(this).closest('.dialog.active').toggleClass('active');
                    break;
                default: break;
            }
        });

        $(".uploadProfileInput").on("change", function () {
            setTimeout(function () {
                $("#clickThisSubmit").trigger("click");
            }, 1600);
        });
    });

    function convertToBase64(e) {
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            setImage(reader.result);
        };
        reader.onerror = error => {
            console.log(error);
        }
    }

    document.addEventListener("change", function (event) {
        if (event.target.classList.contains("uploadProfileInput")) {
            var triggerInput = event.target;
            var holder = triggerInput.closest(".pic-holder2");
            var wrapper = triggerInput.closest(".profile-pic-wrapper");

            var alerts = wrapper.querySelectorAll('[role="alert"]');
            alerts.forEach(function (alert) {
                alert.remove();
            });

            triggerInput.blur();
            var files = triggerInput.files || [];
            if (!files.length || !window.FileReader) {
                return;
            }

            if (/^image/.test(files[0].type)) {
                var reader = new FileReader();
                reader.readAsDataURL(files[0]);

                reader.onloadend = function () {
                    holder.classList.add("uploadInProgress");
                    holder.querySelector(".pic").src = this.result;

                    var loader = document.createElement("div");
                    loader.classList.add("upload-loader");
                    loader.innerHTML =
                        '<div className="spinner-border text-primary" role="status"><span className="sr-only">...</span></div>';
                    holder.appendChild(loader);

                    setTimeout(function () {
                        holder.classList.remove("uploadInProgress");
                        loader.remove();
                    }, 1500);
                };
            } else {
                wrapper.innerHTML +=
                    '<div className="alert alert-danger d-inline-block p-2 small" role="alert">Please choose a valid image.</div>';
                setTimeout(function () {
                    var invalidAlert = wrapper.querySelector('[role="alert"]');
                    if (invalidAlert) {
                        invalidAlert.remove();
                    }
                }, 3000);
            }
        }
    }, { passive: true });

    const changeImage = (e, id) => {
        e.preventDefault()
        const configuration = {
            method: "post",
            url: "https://eatcom.onrender.com/ChangeImageAdmin",
            data: {
                id: id,
                base64: UserImage
            }
        }
        setSpinner(true)
        axios(configuration)
            .then(() => {
                setSpinner(false)
                Swal.fire(
                    'Upload image success!',
                    '',
                    'success'
                ).then(function () {
                    window.location.reload();
                })
            }).catch(() => {
                Swal.fire(
                    'Upload image fail!',
                    '',
                    'error'
                ).then(function () {
                    window.location.reload();
                })
            })
    }

    function setPage(e) {
        if (e === "dashboard") {
            localStorage.setItem('tabs', e)
            if (localStorage.getItem("CountNewContact")) {
                localStorage.removeItem("CountNewContact")
                setCountOne(null)
            }
        }
        if (e === "uiux") {
            localStorage.setItem('tabs', e)
            if (localStorage.getItem("CountNewUI")) {
                localStorage.removeItem("CountNewUI")
                setCountThree(null)
            }
        }
        if (e === "about") {
            localStorage.setItem('tabs', e)
            if (localStorage.getItem("CountNewCart")) {
                localStorage.removeItem("CountNewCart")
                setCountTwo(null)
            }
        }
        if (e === "table") {
            localStorage.setItem('tabs', e)
            if (localStorage.getItem("CountNewTable")) {
                localStorage.removeItem("CountNewTable")
                setCountSix(null)
            }
        }
        if (e === "booking") {
            localStorage.setItem('tabs', e)
            if (localStorage.getItem("CountNewBook")) {
                localStorage.removeItem("CountNewBook")
                setCountFive(null)
            }
        }
        if (e === "download") {
            localStorage.setItem('tabs', e)
        }
        if (e === "announce") {
            localStorage.setItem('tabs', e)
            if (localStorage.getItem("CountNewAnnounce")) {
                localStorage.removeItem("CountNewAnnounce")
                setCountFour(null)
            }
        }

    }

    if (name.userRole !== 3) {
        return NotFound()
    }

    const logoutThis = () => {
        cookies.remove("TOKEN");
        localStorage.removeItem('tabs');
        window.location.href = '/';
    }
    return (
        <LayoutManager>
            <div className="subOver">
                {spinner ? (
                    <div style={{ background: "rgba(255, 255, 255, 0.6)" }} id="spinner" className="show position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
                        <div className="spinner-border text-primary" style={{ width: 3 + "rem", height: 3 + "rem" }} role="status">
                            <span className="sr-only"></span>
                        </div>
                    </div>
                ) : null}
                <div className="drawer pt-4">
                    {Object.values(GetUser).map((a) => {
                        return (
                            <form key={a._id} className='thisSubmitChange' onSubmit={(e) => changeImage(e, a._id)}>
                                <div className="profile-pic-wrapper">
                                    <div className="pic-holder2">
                                        <img id="profilePic" className="pic" src={a.userimage ? a.userimage : "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"} alt="" />
                                        <input onChange={convertToBase64} className="uploadProfileInput" type="file" name="updateimage" id="newProfilePhoto" style={{ opacity: 0 }} />
                                        <label htmlFor="newProfilePhoto" className="upload-file-block">
                                            <div className="text-center">
                                                <svg style={{ fill: "#fff", fontSize: "large" }} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M149.1 64.8L138.7 96H64C28.7 96 0 124.7 0 160V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H373.3L362.9 64.8C356.4 45.2 338.1 32 317.4 32H194.6c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z" /></svg>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                                <button id='clickThisSubmit' type='submit' style={{ display: "none" }}></button>
                            </form>
                        )
                    })}
                    <div className="menu">
                        <a data-menu="dashboard" onClick={() => setPage("dashboard")} href="# " className="unchange2">
                            <div className='svgSidebar'>
                                {countOne ? (
                                    <div className='insideOfNothing'>
                                        <p style={{ margin: 0, fontSize: 16, backgroundColor: "tomato", height: 10, display: "inline", borderRadius: 99, paddingRight: 7, paddingLeft: 7 }}>{countOne}</p>
                                    </div>
                                ) : null}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" /></svg>
                            </div>
                            <p className='appearNow'>Home</p></a>
                        <a data-menu="uiux" onClick={() => setPage("uiux")} href="# " className="unchange2">
                            <div className='svgSidebar'>
                                {countThree ? (
                                    <div className='insideOfNothing'>
                                        <p style={{ margin: 0, fontSize: 16, backgroundColor: "tomato", height: 10, display: "inline", borderRadius: 99, paddingRight: 7, paddingLeft: 7 }}>{countThree}</p>
                                    </div>
                                ) : null}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 256c0 .9 0 1.8 0 2.7c-.4 36.5-33.6 61.3-70.1 61.3H344c-26.5 0-48 21.5-48 48c0 3.4 .4 6.7 1 9.9c2.1 10.2 6.5 20 10.8 29.9c6.1 13.8 12.1 27.5 12.1 42c0 31.8-21.6 60.7-53.4 62c-3.5 .1-7 .2-10.6 .2C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-96a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm96 96a32 32 0 1 0 0-64 32 32 0 1 0 0 64z" /></svg>
                            </div>
                            <p className='appearNow'>Interface</p></a>
                        <a data-menu="about" onClick={() => setPage("about")} href="# " className='unchange2'>
                            <div className='svgSidebar'>
                                {countTwo ? (
                                    <div className='insideOfNothing'>
                                        <p style={{ margin: 0, fontSize: 16, backgroundColor: "tomato", height: 10, display: "inline", borderRadius: 99, paddingRight: 7, paddingLeft: 7 }}>{countTwo}</p>
                                    </div>
                                ) : null}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" /></svg>
                            </div>
                            <p className='appearNow'>Order</p></a>
                        <a data-menu="table" onClick={() => setPage("table")} href="# " className='unchange2'>
                            <div className='svgSidebar'>
                                {countSix ? (
                                    <div className='insideOfNothing'>
                                        <p style={{ margin: 0, fontSize: 16, backgroundColor: "tomato", height: 10, display: "inline", borderRadius: 99, paddingRight: 7, paddingLeft: 7 }}>{countSix}</p>
                                    </div>
                                ) : null}
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="-80 0 512 480"><path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416H416c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" /></svg>
                            </div>
                            <p className='appearNow'>Table</p></a>
                        <a data-menu="booking" onClick={() => setPage("booking")} href="# " className='unchange2'>
                            <div className='svgSidebar'>
                                {countFive ? (
                                    <div className='insideOfNothing'>
                                        <p style={{ margin: 0, fontSize: 16, backgroundColor: "tomato", height: 10, display: "inline", borderRadius: 99, paddingRight: 7, paddingLeft: 7 }}>{countFive}</p>
                                    </div>
                                ) : null}
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="-50 0 576 480"><path d="M184 48H328c4.4 0 8 3.6 8 8V96H176V56c0-4.4 3.6-8 8-8zm-56 8V96H64C28.7 96 0 124.7 0 160v96H192 320 512V160c0-35.3-28.7-64-64-64H384V56c0-30.9-25.1-56-56-56H184c-30.9 0-56 25.1-56 56zM512 288H320v32c0 17.7-14.3 32-32 32H224c-17.7 0-32-14.3-32-32V288H0V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V288z" /></svg>
                            </div>
                            <p className='appearNow'>Booking</p></a>
                        <a data-menu="download" onClick={() => setPage("download")} href="# " className='unchange2'><svg className='svgSidebar' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M416 0C400 0 288 32 288 176V288c0 35.3 28.7 64 64 64h32V480c0 17.7 14.3 32 32 32s32-14.3 32-32V352 240 32c0-17.7-14.3-32-32-32zM64 16C64 7.8 57.9 1 49.7 .1S34.2 4.6 32.4 12.5L2.1 148.8C.7 155.1 0 161.5 0 167.9c0 45.9 35.1 83.6 80 87.7V480c0 17.7 14.3 32 32 32s32-14.3 32-32V255.6c44.9-4.1 80-41.8 80-87.7c0-6.4-.7-12.8-2.1-19.1L191.6 12.5c-1.8-8-9.3-13.3-17.4-12.4S160 7.8 160 16V150.2c0 5.4-4.4 9.8-9.8 9.8c-5.1 0-9.3-3.9-9.8-9L127.9 14.6C127.2 6.3 120.3 0 112 0s-15.2 6.3-15.9 14.6L83.7 151c-.5 5.1-4.7 9-9.8 9c-5.4 0-9.8-4.4-9.8-9.8V16zm48.3 152l-.3 0-.3 0 .3-.7 .3 .7z" /></svg><p className='appearNow'>Menu</p></a>
                        <a data-menu="announce" onClick={() => setPage("announce")} href="# " className='unchange2'>
                            <div className='svgSidebar'>
                                {countFour ? (
                                    <div className='insideOfNothing'>
                                        <p style={{ margin: 0, fontSize: 16, backgroundColor: "tomato", height: 10, display: "inline", borderRadius: 99, paddingRight: 7, paddingLeft: 7 }}>{countFour}</p>
                                    </div>
                                ) : null}
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="-60 0 576 512"><path d="M480 32c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9L381.7 53c-48 48-113.1 75-181 75H192 160 64c-35.3 0-64 28.7-64 64v96c0 35.3 28.7 64 64 64l0 128c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32V352l8.7 0c67.9 0 133 27 181 75l43.6 43.6c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V300.4c18.6-8.8 32-32.5 32-60.4s-13.4-51.6-32-60.4V32zm-64 76.7V240 371.3C357.2 317.8 280.5 288 200.7 288H192V192h8.7c79.8 0 156.5-29.8 215.3-83.3z" /></svg>
                            </div>
                            <p className='appearNow'>Announce</p></a>
                        <a data-dialog="logout" href="# " className='unchange2'><svg className='svgSidebar' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" /></svg><p className='appearNow'>Logout</p></a>
                    </div>
                </div>
                <div className="content">
                    <div className="page" data-page="dashboard" id='Dashboard'>
                        <div className="header">
                            <div className="title">
                                <h2>Dashboard</h2>
                            </div>
                        </div>
                        {Load0 ? (
                            <ManagerDashboard decode={name} />
                        ) : null}
                    </div>
                    <div className="page noflex" data-page="uiux" id='Uiux'>
                        <div className="header">
                            <div className="title">
                                <h2>Interface</h2>
                            </div>
                        </div>
                        <div className='callMeOutUI'>
                            {Load6 ? (
                                <MainUiux />
                            ) : null}
                        </div>
                    </div>
                    <div className="page noflex" data-page="about" id='Cart'>
                        <div className="header">
                            <div className="title">
                                <h2>Order</h2>
                            </div>
                        </div>
                        <div className='callMeOutUI'>
                            {Load1 ? (
                                <MainOrder />
                            ) : null}
                        </div>
                    </div>
                    <div className="page noflex" data-page="table" id='Table'>
                        <div className="header">
                            <div className="title">
                                <h2>Table</h2>
                            </div>
                        </div>
                        <div className='callMeOutUI'>
                            {Load2 ? (
                                <MainTable />
                            ) : null}
                        </div>
                    </div>
                    <div className="page noflex" data-page="booking" id='Booking'>
                        <div className="header">
                            <div className="title">
                                <h2>Booking</h2>
                            </div>
                        </div>
                        <div className='callMeOutUI'>
                            {Load3 ? (
                                <MainBooking />
                            ) : null}
                        </div>
                    </div>
                    <div className="page noflex" data-page="download" id='Menu'>
                        <div className="header">
                            <div className="title">
                                <h2>Menu</h2>
                            </div>
                        </div>
                        <div className='callMeOutUI'>
                            {Load4 ? (
                                <MainMenu />
                            ) : null}
                        </div>
                    </div>
                    <div className="page noflex" data-page="announce" id='announce'>
                        <div className="header">
                            <div className="title">
                                <h2>Announcement</h2>
                            </div>
                        </div>
                        <div className='callMeOutUI'>
                            {Load5 ? (
                                <MainAnnounce decode={name} />
                            ) : null}
                        </div>
                    </div>
                </div>
                <div className="sidebar">

                </div>
                <div className="dialog">
                    <div className="dialog-block">
                        <h4 className='text-center text-white pt-4'>Are you sure you want to logout?</h4>
                        <div className="controls">
                            <button data-dialog-action="cancel" className="btn btn-secondary">Cancel</button>
                            <button onClick={() => logoutThis()} className="btn btn-warning">Logout</button>
                        </div>
                    </div>
                </div>
            </div>
        </LayoutManager>
    );
}
export default ManagerPanel;