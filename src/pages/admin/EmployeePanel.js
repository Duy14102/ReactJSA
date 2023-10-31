import '../../css/Admin.css';
import '../../css/style.css';
import $ from 'jquery';
import { Fragment, useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import Swal from 'sweetalert2';
import MainBooking from '../../component/employee/MainBooking';
import MainOrder from '../../component/admin/MainOrder';
import MainTable from '../../component/employee/MainTable';
import TaskHandle from '../../component/employee/TaskHandle';

function EmployeePanel() {
    const cookies = new Cookies()
    const token = cookies.get("TOKEN");
    const name = jwtDecode(token)
    const [CountData, setCountData] = useState()
    const [GetUser, setGetUser] = useState([])
    const [UserImage, setImage] = useState()
    const [Load1, setLoad1] = useState(false)
    const [Load2, setLoad2] = useState(false)
    const [Load3, setLoad3] = useState(false)

    useEffect(() => {
        const configuration = {
            method: "get",
            url: "http://localhost:3000/GetData4Employee",
        }
        axios(configuration)
            .then((res) => {
                setCountData(res.data)
            })
            .catch((err) => {
                console.log(err);
            })

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
        if ($('.content .page:nth-child(2)').hasClass('active') === true) {
            setLoad1(true)
        }
        if ($('.content .page:nth-child(3)').hasClass('active') === true) {
            setLoad2(true)
        }
        if ($('.content .page:nth-child(4)').hasClass('active') === true) {
            setLoad3(true)
        }
    }, [name.userId])

    $(function () {
        $('.menu a[data-menu]').on('click', function () {
            var menu = $(this).data('menu');
            $('.menu a.active').removeClass('active');
            $(this).addClass('active');
            $('.active[data-page]').removeClass('active');
            $('[data-page="' + menu + '"]').addClass('active');
            if ($('.content .page:nth-child(2)').hasClass('active') === true) {
                setLoad1(true)
            }
            if ($('.content .page:nth-child(3)').hasClass('active') === true) {
                setLoad2(true)
            }
            if ($('.content .page:nth-child(4)').hasClass('active') === true) {
                setLoad3(true)
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
        if (e === "download") {
            localStorage.setItem('tabs', e)
        }
        if (e === "users") {
            localStorage.setItem('tabs', e)
        }
        if (e === "about") {
            localStorage.setItem('tabs', e)
        }
    }

    const logoutThis = () => {
        cookies.remove("TOKEN");
        localStorage.removeItem('tabs');
        window.location.href = '/';
    }
    return (
        <>
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
                            <a data-menu="dashboard" href="#dashboard" onClick={() => setPage("dashboard")} className="unchange2"><i className="fa-solid fa-house"></i><p className='appearNow'>Home</p></a>
                            <a data-menu="download" href="#download" onClick={() => setPage("download")} className='unchange2'><i className="fa-solid fa-calendar-check"></i><p className='appearNow'>Table</p></a>
                            <a data-menu="users" href="#users" onClick={() => setPage("users")} className='unchange2'><i className="fa-solid fa-briefcase"></i><p className='appearNow'>Booking</p></a>
                            <a data-menu="about" href="#about" onClick={() => setPage("about")} className='unchange2'><i className="fa-solid fa-cart-shopping"></i><p className='appearNow'>Cart</p></a>
                            <a data-dialog="logout" href="# " className='unchange2'><i className="fa-solid fa-right-from-bracket"></i><p className='appearNow'>Logout</p></a>
                        </div>
                    </div>
                    <div className="content">
                        <div className="page" data-page="dashboard">
                            <div className="header">
                                <div className="title">
                                    <h2>Dashboard</h2>
                                </div>
                            </div>
                            <div className="grid pt-4">
                                <div className="card-verticle ">
                                    <div className="card-small" style={{ background: "#2298F1" }}>
                                        <div className='flexOverPage'>
                                            <div>
                                                <span className="title">Active Booking</span>
                                                <h2 className="text text-center">{CountData?.actBookingLength}</h2>
                                            </div>
                                            <div>
                                                <span className="title">Serving Booking</span>
                                                <h2 className="text text-center">{CountData?.waitBookingLength}</h2>
                                            </div>
                                        </div>
                                        <hr />
                                        <p className='m-0 text-white'>1% increase</p>
                                    </div>
                                </div>
                                <div className="card-verticle">
                                    <div className="card-small" style={{ background: "#66B92E" }}>
                                        <span className="title">
                                            Active Cart
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
                                            Total Task
                                        </span>
                                        {Object.values(GetUser).map((r) => {
                                            return (
                                                <h2 key={r._id} className="text">{r.task.length}</h2>
                                            )
                                        })}
                                        <hr />
                                        <p className='m-0 text-white'>0% increase</p>
                                    </div>
                                </div>
                            </div>
                            <div className='d-flex justify-content-center pt-5'>
                                <div style={{ width: 70 + "vw" }}>
                                    <h4 style={{ whiteSpace: "nowrap" }} className='text-center text-white'>Task For You</h4>
                                    {Object.values(GetUser).map((v) => {
                                        if (v.task.length > 0) {
                                            return (
                                                <Fragment key={v._id}>
                                                    <table className='table table-bordered w-100 solotable'>
                                                        <thead>
                                                            <tr className="text-white text-center" style={{ background: "#374148" }}>
                                                                <th className='thhuhu'>Title</th>
                                                                <th>Date</th>
                                                                <th className='thhuhu'>Status</th>
                                                                <th></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {v.task?.map((j) => {
                                                                var draw = ""
                                                                if (j.task.status === 1) {
                                                                    draw = "Pending"
                                                                }
                                                                else if (j.task.status === 2) {
                                                                    draw = "Completed"
                                                                }
                                                                return (
                                                                    <tr className='text-center' key={j.id} style={{ background: "#2C343A", color: "lightgray", verticalAlign: "middle" }}>
                                                                        <td className='thhuhu'>{j.task.title}</td>
                                                                        <td>{j.task.date}</td>
                                                                        <td className='thhuhu'>{draw}</td>
                                                                        <td><TaskHandle id={j} name={v} /></td>
                                                                    </tr>
                                                                )
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </Fragment>
                                            )
                                        } else {
                                            return (
                                                <p key={v} className="text-center" style={{ color: "lightgray", whiteSpace: "nowrap" }}>Task list empty!</p>
                                            )
                                        }
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="page noflex" data-page="download">
                            <div className="header">
                                <div className="title">
                                    <h2>Table</h2>
                                </div>
                            </div>
                            <div className=' callMeOutUI'>
                                {Load1 ? (
                                    <MainTable />
                                ) : null}
                            </div>
                        </div>
                        <div className="page noflex" data-page="users">
                            <div className="header">
                                <div className="title">
                                    <h2>Booking</h2>
                                </div>
                            </div>
                            <div className='callMeOutUI'>
                                {Load2 ? (
                                    <MainBooking />
                                ) : null}
                            </div>
                        </div>
                        <div className="page noflex" data-page="about">
                            <div className="header">
                                <div className="title">
                                    <h2>Cart</h2>
                                </div>
                            </div>
                            <div className='callMeOutUI'>
                                {Load3 ? (
                                    <MainOrder />
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
            </div>
        </>
    )
}
export default EmployeePanel