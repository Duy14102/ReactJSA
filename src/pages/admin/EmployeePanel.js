import '../../css/Admin.css';
import '../../css/style.css';
import $ from 'jquery';
import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import Swal from 'sweetalert2';
import MainBooking from '../../component/employee/MainBooking';
import MainOrder from '../../component/admin/MainOrder';
import MainTable from '../../component/employee/MainTable';

function EmployeePanel() {
    const cookies = new Cookies()
    const token = cookies.get("TOKEN");
    const name = jwtDecode(token)
    const [CountData, setCountData] = useState()
    const [GetUser, setGetUser] = useState([])
    const [UserImage, setImage] = useState()

    useEffect(() => {
        fetch("http://localhost:3000/GetData4Employee", {
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
                            <a data-menu="dashboard" href="# " className="active unchange2"><i className="fa-solid fa-house"></i><p className='appearNow'>Home</p></a>
                            <a data-menu="download" href="# " className='unchange2'><i className="fa-solid fa-calendar-check"></i><p className='appearNow'>Table</p></a>
                            <a data-menu="users" href="# " className='unchange2'><i className="fa-solid fa-briefcase"></i><p className='appearNow'>Booking</p></a>
                            <a data-menu="about" href="# " className='unchange2'><i className="fa-solid fa-cart-shopping"></i><p className='appearNow'>Cart</p></a>
                            <a data-dialog="logout" href="# " className='unchange2'><i className="fa-solid fa-right-from-bracket"></i><p className='appearNow'>Logout</p></a>
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
                                                <table key={v} className='table table-bordered w-100 solotable'>
                                                    <thead>
                                                        <tr className="text-white text-center" style={{ background: "#374148" }}>
                                                            <th style={{ width: 25 + "%" }}>Title</th>
                                                            <th style={{ width: 25 + "%" }}>Date</th>
                                                            <th style={{ width: 50 + "%" }}>Message</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {v.task?.map((j) => {
                                                            return (
                                                                <tr className='text-center' key={j} style={{ background: "#2C343A", color: "lightgray", verticalAlign: "middle" }}>
                                                                    <td>{j.title}</td>
                                                                    <td>{j.date}</td>
                                                                    <td>{j.message}</td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                </table>
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
                                <MainTable />
                            </div>
                        </div>
                        <div className="page noflex" data-page="users">
                            <div className="header">
                                <div className="title">
                                    <h2>Booking</h2>
                                </div>
                            </div>
                            <div className='callMeOutUI'>
                                <MainBooking />
                            </div>
                        </div>
                        <div className="page noflex" data-page="about">
                            <div className="header">
                                <div className="title">
                                    <h2>Cart</h2>
                                </div>
                            </div>
                            <div className='callMeOutUI'>
                                <MainOrder />
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