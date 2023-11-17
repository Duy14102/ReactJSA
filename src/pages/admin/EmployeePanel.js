import $ from 'jquery';
import { Fragment, useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Swal from 'sweetalert2';
import MainBooking from '../../component/employee/MainBooking';
import MainOrder from '../../component/admin/MainOrder';
import MainTable from '../../component/employee/MainTable';
import TaskHandle from '../../component/employee/TaskHandle';
import NotFound from '../../component/outOfBorder/NotFound';
import LayoutManager from './LayoutManager';

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
    }, { passive: true });

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

    if (name.userRole !== 2) {
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
                        <a data-menu="dashboard" href="#dashboard" onClick={() => setPage("dashboard")} className="unchange2"><svg className='svgSidebar' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" /></svg><p className='appearNow'>Home</p></a>
                        <a data-menu="download" href="#download" onClick={() => setPage("download")} className='unchange2'><svg className='svgSidebar' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416H416c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" /></svg><p className='appearNow'>Table</p></a>
                        <a data-menu="users" href="#users" onClick={() => setPage("users")} className='unchange2'><svg className='svgSidebar' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M184 48H328c4.4 0 8 3.6 8 8V96H176V56c0-4.4 3.6-8 8-8zm-56 8V96H64C28.7 96 0 124.7 0 160v96H192 320 512V160c0-35.3-28.7-64-64-64H384V56c0-30.9-25.1-56-56-56H184c-30.9 0-56 25.1-56 56zM512 288H320v32c0 17.7-14.3 32-32 32H224c-17.7 0-32-14.3-32-32V288H0V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V288z" /></svg><p className='appearNow'>Booking</p></a>
                        <a data-menu="about" href="#about" onClick={() => setPage("about")} className='unchange2'><svg className='svgSidebar' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" /></svg><p className='appearNow'>Cart</p></a>
                        <a data-dialog="logout" href="# " className='unchange2'><svg className='svgSidebar' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" /></svg><p className='appearNow'>Logout</p></a>
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
        </LayoutManager>
    )
}
export default EmployeePanel