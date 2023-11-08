import $ from 'jquery';
import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import jwtDecode from 'jwt-decode';
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

function ManagerPanel() {
    const cookies = new Cookies();
    const token = cookies.get("TOKEN");
    const name = jwtDecode(token)
    const [GetUser, setGetUser] = useState([])
    const [UserImage, setImage] = useState()
    const [Load0, setLoad0] = useState(false)
    const [Load6, setLoad6] = useState(false)
    const [Load1, setLoad1] = useState(false)
    const [Load2, setLoad2] = useState(false)
    const [Load3, setLoad3] = useState(false)
    const [Load4, setLoad4] = useState(false)
    const [Load5, setLoad5] = useState(false)

    useEffect(() => {
        const configuration2 = {
            method: "get",
            url: 'http://localhost:3000/GetDetailUser',
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
    });

    const changeImage = (e, id) => {
        e.preventDefault()
        const configuration = {
            method: "post",
            url: "http://localhost:3000/ChangeImageAdmin",
            data: {
                id: id,
                base64: UserImage
            }
        }
        axios(configuration)
            .then(() => {
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
        }
        if (e === "uiux") {
            localStorage.setItem('tabs', e)
        }
        if (e === "about") {
            localStorage.setItem('tabs', e)
        }
        if (e === "table") {
            localStorage.setItem('tabs', e)
        }
        if (e === "booking") {
            localStorage.setItem('tabs', e)
        }
        if (e === "download") {
            localStorage.setItem('tabs', e)
        }
        if (e === "announce") {
            localStorage.setItem('tabs', e)
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
                <div className="drawer pt-4">
                    {Object.values(GetUser).map((a) => {
                        return (
                            <form key={a._id} className='thisSubmitChange' onSubmit={(e) => changeImage(e, a._id)}>
                                <div className="profile-pic-wrapper">
                                    <div className="pic-holder2">
                                        {a.userimage ? (
                                            <>
                                                <img id="profilePic" className="pic" src={a.userimage} alt="" />
                                                <input onChange={convertToBase64} className="uploadProfileInput" type="file" name="updateimage" id="newProfilePhoto" style={{ opacity: 0 }} />
                                            </>
                                        ) : (
                                            <>
                                                <img id="profilePic" className="pic" src="https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg" alt="" />
                                                <input onChange={convertToBase64} className="uploadProfileInput" type="file" name="updateimage" id="newProfilePhoto" style={{ opacity: 0 }} />
                                            </>
                                        )}
                                        <label htmlFor="newProfilePhoto" className="upload-file-block">
                                            <div className="text-center">
                                                <i className="fi fi-sr-camera"></i>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                                <button id='clickThisSubmit' type='submit' style={{ display: "none" }}></button>
                            </form>
                        )
                    })}
                    <div className="menu">
                        <a data-menu="dashboard" onClick={() => setPage("dashboard")} href="# " className="unchange2"><i className="fi fi-sr-home"></i><p className='appearNow'>Home</p></a>
                        <a data-menu="uiux" onClick={() => setPage("uiux")} href="# " className="unchange2"><i className="fi fi-sr-palette"></i><p className='appearNow'>Interface</p></a>
                        <a data-menu="about" onClick={() => setPage("about")} href="# " className='unchange2'><i className="fi fi-ss-shopping-cart"></i><p className='appearNow'>Cart</p></a>
                        <a data-menu="table" onClick={() => setPage("table")} href="# " className='unchange2'><i className="fi fi-sr-lamp"></i><p className='appearNow'>Table</p></a>
                        <a data-menu="booking" onClick={() => setPage("booking")} href="# " className='unchange2'><i className="fi fi-sr-calendar-pen"></i><p className='appearNow'>Booking</p></a>
                        <a data-menu="download" onClick={() => setPage("download")} href="# " className='unchange2'><i className="fi fi-ss-utensils"></i><p className='appearNow'>Menu</p></a>
                        <a data-menu="announce" onClick={() => setPage("announce")} href="# " className='unchange2'><i className="fi fi-sr-megaphone"></i><p className='appearNow'>Announce</p></a>
                        <a data-dialog="logout" href="# " className='unchange2'><i className="fi fi-br-sign-out-alt"></i><p className='appearNow'>Logout</p></a>
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
                            <ManagerDashboard />
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
                                <h2>Cart</h2>
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
                                <MainAnnounce />
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