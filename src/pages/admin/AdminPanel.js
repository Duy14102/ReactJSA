import '../../css/Admin.css';
import '../../css/style.css';
import $ from 'jquery';
import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import MainMenu from '../../component/admin/MainMenu';
import MainUser from '../../component/admin/MainUser';
import GetOrder from '../../component/admin/GetOrder';
import GetOrderHistory from '../../component/admin/GetOrderHistory';
import jwtDecode from 'jwt-decode';
import GetContact from '../../component/admin/GetContact';
import axios from 'axios';
import Swal from 'sweetalert2';

function AdminPanel() {
    const cookies = new Cookies();
    const token = cookies.get("TOKEN");
    const name = jwtDecode(token)
    const [CountData, setCountData] = useState()
    const [GetUser, setGetUser] = useState([])
    const [UserImage, setImage] = useState()

    useEffect(() => {
        fetch("http://localhost:3000/GetData4Admin", {
            method: "get",
        }).then((res) => res.json()).then((data) => {
            setCountData(data)
        })

        fetch(`http://localhost:3000/GetDetailUser?userid=${name.userId}`, {
            method: "get",
        }).then((res) => res.json()).then((data) => {
            setGetUser(data)
        })
    }, [name.userId])

    $(function () {
        $('.menu a[data-menu]').on('click', function () {
            var menu = $(this).data('menu');
            $('.menu a.active').removeClass('active');
            $(this).addClass('active');
            $('.active[data-page]').removeClass('active');
            $('[data-page="' + menu + '"]').addClass('active');
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

    const logoutThis = () => {
        cookies.remove("TOKEN");
        localStorage.clear();
        window.location.href = '/';
    }
    return (
        <div style={{ height: 100 + "vh" }}>
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
                                                <i className="fa fa-camera fa-2x"></i>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                                <button id='clickThisSubmit' type='submit' style={{ display: "none" }}></button>
                            </form>
                        )
                    })}
                    <div className="menu">
                        <a data-menu="dashboard" href="# " className="active"><i className="fa-solid fa-house"></i></a>
                        <a data-menu="users" href="# "><i className="fa-solid fa-user"></i></a>
                        <a data-menu="download" href="# "><i className="fa-solid fa-utensils"></i></a>
                        <a data-menu="about" href="# "><i className="fa-solid fa-cart-shopping"></i></a>
                        <a data-menu="history" href="# "><i className="fa-solid fa-clock-rotate-left"></i></a>
                        <a data-dialog="logout" href="# "><i className="fa-solid fa-right-from-bracket"></i></a>
                    </div>
                </div>
                <div className="content">
                    <div className="page active" data-page="dashboard">
                        <div className="header">
                            <div className="title">
                                <h2>Dashboard</h2>
                            </div>
                        </div>
                        <div className="grid pt-4">
                            <div className="card-verticle ">
                                <div className="card-small" style={{ background: "#2298F1" }}>
                                    <span className="title">
                                        Total Users
                                    </span>
                                    <h2 className="text">{CountData?.userLength}</h2>
                                    <hr />
                                    <p className='m-0 text-white'>1% increase</p>
                                </div>
                            </div>
                            <div className="card-verticle">
                                <div className="card-small" style={{ background: "#66B92E" }}>
                                    <span className="title">
                                        Active Order
                                    </span>
                                    <h2 className="text">{CountData?.orderLength}</h2>
                                    <hr />
                                    <p className='m-0 text-white'>5% increase</p>
                                </div>
                            </div>
                            <div className="card-verticle">
                                <div className="card-small" style={{ background: "#FEA116" }}>
                                    <span className="title">
                                        Active Table
                                    </span>
                                    <h2 className="text">{CountData?.tableLength}</h2>
                                    <hr />
                                    <p className='m-0 text-white'>9% increase</p>
                                </div>
                            </div>
                            <div className="card-verticle">
                                <div className="card-small" style={{ background: "#D65B4A" }}>
                                    <span className="title">
                                        Total Menu
                                    </span>
                                    <h2 className="text">{CountData?.menuLength}</h2>
                                    <hr />
                                    <p className='m-0 text-white'>0% increase</p>
                                </div>
                            </div>
                        </div>
                        <div className='d-flex justify-content-around'>
                            <div className='w-100 p-5'>
                                <h4 className='text-center text-white'>Revenue</h4>
                                <div className="card-verticle">
                                    <div style={{ background: "#2C343A", borderRadius: 3 + "px" }}>
                                        <div className='d-flex' style={{ gap: 1 + "%" }}>
                                            <button data-menu="day" className='btn btn-secondary w-100'>Day</button>
                                            <button className='btn btn-secondary w-100'>Month</button>
                                            <button className='btn btn-secondary w-100'>Year</button>
                                        </div>
                                        <div data-page="day">
                                            <h5 className='text-white p-3'>Today Income : </h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-100 p-5">
                                <h4 className='text-center text-white'>Contact</h4>
                                <GetContact />
                            </div>
                        </div>
                    </div>
                    <div className="page noflex" data-page="users">
                        <div className="header">
                            <div className="title">
                                <h2>Users</h2>
                            </div>
                        </div>
                        <div className='px-5'>
                            <MainUser />
                        </div>
                    </div>
                    <div className="page noflex" data-page="download">
                        <div className="header">
                            <div className="title">
                                <h2>Menu</h2>
                            </div>
                        </div>
                        <div className='px-5'>
                            <MainMenu />
                        </div>
                    </div>
                    <div className="page noflex" data-page="about">
                        <div className="header">
                            <div className="title">
                                <h2>Order</h2>
                            </div>
                        </div>
                        <div className='px-5'>
                            <GetOrder />
                        </div>
                    </div>
                    <div className="page noflex" data-page="history">
                        <div className="header">
                            <div className="title">
                                <h2>Order History</h2>
                            </div>
                        </div>
                        <div className='px-5'>
                            <GetOrderHistory />
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
        </div>
    );
}
export default AdminPanel;