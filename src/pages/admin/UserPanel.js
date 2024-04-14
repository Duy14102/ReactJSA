import { useParams } from "react-router-dom";
import NotFound from "../../component/outOfBorder/NotFound"
import { useEffect, useRef, useReducer } from "react";
import UserDataPanel from "../../component/admin/UserDataPanel";
import axios from "axios";
import Swal from "sweetalert2";
import UserAddressControl from "../../component/admin/UserAddressControl";
import UserBookingPanel from "../../component/admin/UserBookingPanel";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import Layout from "../../Layout";
import '../../css/Admin.css'
import Modal from 'react-modal';
import socketIOClient from "socket.io-client";
import Header from "../../component/Header";

function UserPanel() {
    const cookies = new Cookies();
    const token = cookies.get("TOKEN");
    const name = jwtDecode(token)
    let appler = useParams()
    const socketRef = useRef();
    const [updateState, setUpdateState] = useReducer((prev, next) => ({
        ...prev, ...next
    }), {
        updateemail: null,
        updatepassword: null,
        updatephone: null,
        updatefullname: null,
        updateimage: null,
        deletePassword: "",
        Edit: false,
        alertCheck: false,
        spinner: false,
        GetUser: [],
        GetOrder: [],
        modalOpenDetail: false
    })
    const [socketState, setSocketState] = useReducer((prev, next) => ({
        ...prev, ...next
    }), {
        newOrder: false,
        orderComplete: false,
        shippingOrder: false,
        expiredOrder: false,
        cancelByMag: false,
        readyShipping: false,
        cancelOrder: false,
        seePassword: false,
        bookingDeny: false,
        changeTable: false,
        checkoutBook: false,
        checkDeletePassword: null
    })
    const checkPhone = /((09|03|07|08|05)+([0-9]{8})\b)/g

    const getOrder = () => {
        const configuration = {
            method: "get",
            url: "https://eatcom.onrender.com/GetOrderUserPanel",
            params: {
                id: appler.id
            }
        }
        axios(configuration).then((dot) => { setUpdateState({ GetOrder: dot.data.data }) }).catch((er) => { console.log(er); })
    }

    function HandleNew() {
        getOrder()
        setSocketState({ newOrder: true })
    }
    function HandleComplete() {
        getOrder()
        setSocketState({ orderComplete: true })
    }
    function HandleCancel() {
        getOrder()
        setSocketState({ cancelOrder: true })
    }
    function HandleCancelByMag() {
        getOrder()
        setSocketState({ cancelByMag: true })
    }
    function HandleShipping() {
        getOrder()
        setSocketState({ shippingOrder: true })
    }
    function HandleExpired() {
        getOrder()
        setSocketState({ expiredOrder: true })
    }
    function HandleReadyShipping() {
        getOrder()
        setSocketState({ readyShipping: true })
    }

    useEffect(() => {
        socketRef.current = socketIOClient.connect("https://eatcom.onrender.com")

        socketRef.current.on('CancelVnpaySuccess', dataGot => {
            if (dataGot?.data === name.userId) {
                HandleCancel()
            }
        })

        socketRef.current.on('PaidVnpaySuccess', dataGot => {
            if (dataGot?.data === name.userId) {
                HandleNew()
            }
        })

        socketRef.current.on('PaidPaypalSuccess', dataGot => {
            if (dataGot?.data === name.userId) {
                HandleNew()
            }
        })

        socketRef.current.on('PaidCodSuccess', dataGot => {
            if (dataGot?.data === name.userId) {
                HandleNew()
            }
        })

        socketRef.current.on('UpdateStatusOrderSuccess', dataGot => {
            if (dataGot?.data === name.userId) {
                getOrder()
            }
        })

        socketRef.current.on('CompleteOrderSuccess', dataGot => {
            if (dataGot?.data === name.userId) {
                HandleComplete()
            }
        })

        socketRef.current.on('DenyOrderNormalSuccess', dataGot => {
            if (dataGot?.data === name.userId) {
                getOrder()
            }
        })

        socketRef.current.on('DenyOrderPaidSuccess', dataGot => {
            if (dataGot?.data === name.userId) {
                getOrder()
            }
        })

        socketRef.current.on('DenyOrderWaitingSuccess', dataGot => {
            if (dataGot?.data === name.userId) {
                getOrder()
            }
        })

        socketRef.current.on('totaldenyNormalSuccess', dataGot => {
            if (dataGot?.data === name.userId) {
                getOrder()
            }
        })

        socketRef.current.on('totaldenyPaidSuccess', dataGot => {
            if (dataGot?.data === name.userId) {
                getOrder()
            }
        })


        socketRef.current.on('CancelByMagNormalSuccess', dataGot => {
            if (dataGot?.data === name.userId) {
                HandleCancelByMag()
            }
        })

        socketRef.current.on('CancelByMagPaidSuccess', dataGot => {
            if (dataGot?.data === name.userId) {
                HandleCancelByMag()
            }
        })

        socketRef.current.on('DeleteAcountSuccess', dataGot => {
            if (dataGot?.data === name.userId) {
                Swal.fire(
                    'Delete account successfully!',
                    '',
                    'success'
                ).then(function () {
                    cookies.remove("TOKEN", { path: '/' });
                    window.location.href = "/"
                })
            }
        })

        socketRef.current.on('DeleteAcountFail', dataGot => {
            if (dataGot?.data === name.userId) {
                Swal.fire(
                    'Delete account fail!',
                    '',
                    'error'
                ).then(function () {
                    setSocketState({ checkDeletePassword: dataGot.message })
                })
            }
        })

        socketRef.current.on('DenyBookingSuccess', dataGot => {
            if (name.userId === dataGot?.data) {
                setSocketState({ bookingDeny: true })
            }
        })

        socketRef.current.on('ChangeTableSuccess', dataGot => {
            if (name.userId === dataGot?.data) {
                setSocketState({ changeTable: true })
            }
        })

        socketRef.current.on('CheckoutBookingSuccess', dataGot => {
            if (dataGot?.data === name.userId) {
                setSocketState({ checkoutBook: true })
            }
        })

        socketRef.current.on('ChefReadySuccess', dataGot => {
            if (dataGot?.user === name.userId) {
                HandleReadyShipping()
            }
        })

        socketRef.current.on('ShippingReadySuccess', dataGot => {
            if (dataGot?.user === name.userId) {
                HandleShipping()
            }
        })

        socketRef.current.on('ExpiredOrderSuccess', dataGot => {
            if (dataGot?.user === name.userId) {
                HandleExpired()
            }
        })

        socketRef.current.on('CancelOrderTransSuccess', dataGot => {
            if (dataGot?.user === name.userId) {
                HandleCancel()
            }
        })

        return () => {
            socketRef.current.disconnect();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (socketState.newOrder) {
            setTimeout(() => {
                setSocketState({ newOrder: false })
            }, 1500);
        }
        if (socketState.cancelOrder) {
            setTimeout(() => {
                setSocketState({ cancelOrder: false })
            }, 1500);
        }
        if (socketState.orderComplete) {
            setTimeout(() => {
                setSocketState({ orderComplete: false })
            }, 1500);
        }
        if (socketState.cancelByMag) {
            setTimeout(() => {
                setSocketState({ cancelByMag: false })
            }, 1500);
        }
        if (socketState.bookingDeny) {
            setTimeout(() => {
                setSocketState({ bookingDeny: false })
            }, 1500);
        }
        if (socketState.changeTable) {
            setTimeout(() => {
                setSocketState({ changeTable: false })
            }, 1500);
        }
        if (socketState.checkoutBook) {
            setTimeout(() => {
                setSocketState({ checkoutBook: false })
            }, 1500);
        }
        if (socketState.shippingOrder) {
            setTimeout(() => {
                setSocketState({ shippingOrder: false })
            }, 1500);
        }
        if (socketState.expiredOrder) {
            setTimeout(() => {
                setSocketState({ expiredOrder: false })
            }, 1500);
        }
        if (socketState.readyShipping) {
            setTimeout(() => {
                setSocketState({ readyShipping: false })
            }, 1500);
        }
    }, [socketState.newOrder, socketState.cancelOrder, socketState.orderComplete, socketState.cancelByMag, socketState.bookingDeny, socketState.changeTable, socketState.checkoutBook, socketState.shippingOrder, socketState.expiredOrder, socketState.readyShipping])

    useEffect(() => {
        if (name.userRole !== 1.5) {
            fetch(`https://eatcom.onrender.com/GetDetailUser?userid=${appler.id}`, {
                method: "get",
            }).then((res) => res.json()).then((data) => {
                setUpdateState({ GetUser: data })
            })
        }

        getOrder()

        document.getElementById("OrderHum").click();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appler.id, name.userRole])

    if (!appler) {
        return NotFound()
    }

    document.addEventListener("change", function (event) {
        if (event.target.classList.contains("uploadProfileInput")) {
            var triggerInput = event.target;
            var holder = triggerInput.closest(".pic-holder");
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
                        '<div className="spinner-border text-primary" role="status"><span className="sr-only">Loading...</span></div>';
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

    function convertToBase64(e) {
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            setUpdateState({ updateimage: reader.result })
        };
        reader.onerror = error => {
            console.log(error);
        }
    }
    const handleSubmit = (e, id, item) => {
        // prevent the form from refreshing the whole page
        e.preventDefault();
        var emailX = updateState.updateemail
        var fullnameX = updateState.updatefullname
        var phoneX = updateState.updatephone
        var imageX = updateState.updateimage
        if (!emailX) {
            emailX = item.email
        }
        if (!fullnameX) {
            fullnameX = item.fullname
        }
        if (!phoneX) {
            phoneX = item.phonenumber
        }
        if (!imageX) {
            imageX = item.userimage
        }
        const configuration = {
            method: "post",
            url: "https://eatcom.onrender.com/UpdateUser",
            data: {
                updateid: id,
                updateemail: emailX,
                updatepassword: updateState.updatepassword,
                updatefullname: fullnameX,
                updatephone: phoneX,
                base64: imageX
            },
        };
        setUpdateState({ spinner: true })
        if (!checkPhone.test(phoneX)) {
            setUpdateState({ spinner: false })
            setUpdateState({ alertCheck: true })
            return false
        }
        axios(configuration)
            .then(() => {
                setUpdateState({ spinner: false })
                Swal.fire(
                    'Update Successfully!',
                    '',
                    'success'
                ).then(function () {
                    window.location.reload();
                })
            })
            .catch((e) => {
                setUpdateState({ spinner: false })
                console.log(e);
            });
    }

    function DeleteAcount(e) {
        // prevent the form from refreshing the whole page
        e.preventDefault();
        const data = { id: appler.id, password: updateState.deletePassword }
        socketRef.current.emit('DeleteAcountSocket', data)
    }

    function openCity3(evt, cityName) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("UPanelButton");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("MBbutton6");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active6", "");
        }
        document.getElementById(cityName).style.display = "block";
        evt.currentTarget.className += " active6";
    }

    if (name.userRole !== 1 && name.userRole !== 1.5) {
        return NotFound()
    }

    return (
        <>
            <Header type={"Yes"} />
            <Layout>
                <div className="fatherNewUserNoti">
                    {socketState.newOrder ? (
                        <div className="newUserNoti" style={{ backgroundColor: "#03ba5f" }}>
                            <h6>✓ New order!</h6>
                        </div>
                    ) : null}
                    {socketState.shippingOrder ? (
                        <div className="newUserNoti" style={{ backgroundColor: "#03ba5f" }}>
                            <h6>✓ Order shipping!</h6>
                        </div>
                    ) : null}
                    {socketState.readyShipping ? (
                        <div className="newUserNoti" style={{ backgroundColor: "#03ba5f" }}>
                            <h6>✓ Order is ready to shipping!</h6>
                        </div>
                    ) : null}
                    {socketState.cancelOrder ? (
                        <div className="newUserNoti" style={{ backgroundColor: "tomato" }}>
                            <h6>X Order cancel!</h6>
                        </div>
                    ) : null}
                    {socketState.expiredOrder ? (
                        <div className="newUserNoti" style={{ backgroundColor: "tomato" }}>
                            <h6>X Order expired!</h6>
                        </div>
                    ) : null}
                    {socketState.orderComplete ? (
                        <div className="newUserNoti" style={{ backgroundColor: "#FEA116" }}>
                            <h6>✓ An order completed!</h6>
                        </div>
                    ) : null}
                    {socketState.cancelByMag ? (
                        <div className="newUserNoti" style={{ backgroundColor: "tomato" }}>
                            <h6>X Order progress canceled by manager!</h6>
                        </div>
                    ) : null}
                    {socketState.bookingDeny ? (
                        <div className="newUserNoti" style={{ backgroundColor: "tomato" }}>
                            <h6>X Your booking have been denied!</h6>
                        </div>
                    ) : null}
                    {socketState.changeTable ? (
                        <div className="newUserNoti" style={{ backgroundColor: "#66B92E" }}>
                            <h6>X Your booking table changed!</h6>
                        </div>
                    ) : null}
                    {socketState.checkoutBook ? (
                        <div className="newUserNoti" style={{ backgroundColor: "#FEA116" }}>
                            <h6>X Your booking completed!</h6>
                        </div>
                    ) : null}
                </div>
                <div className="bg-white">
                    <div className="container py-4">
                        <div className="coverUser">
                            {name.userRole !== 1.5 ? (
                                Object.values(updateState.GetUser).map((i) => {
                                    return (
                                        <form key={i._id} onSubmit={(e) => handleSubmit(e, appler.id, i)}>
                                            <div className="headOverview">
                                                <h5 style={{ whiteSpace: "nowrap" }} className="m-0">User Overview</h5>
                                                {updateState.Edit ? (
                                                    <div style={{ gap: 5 + "%", paddingRight: 15 }} className="fatherButton4Edit">
                                                        <button type="button" style={{ fontSize: 13 }} className="btn btn-danger text-nowrap thhuhu" onClick={() => setUpdateState({ modalOpenDetail: true })}>Delete account</button>
                                                        <button type="submit" className="button4Edit" >Comfirm</button>
                                                        <button type="button" className="button4Edit" onClick={() => { setUpdateState({ Edit: false, alertCheck: false }) }}>Cancel</button>
                                                    </div>
                                                ) : (
                                                    <button type="button" className="button4Edit" onClick={() => setUpdateState({ Edit: true })}>Edit</button>
                                                )}
                                            </div>
                                            <div className="BossLvMax" style={{ padding: "2%" }}>
                                                {updateState.spinner ? (
                                                    <div style={{ background: "rgba(255, 255, 255, 0.6)" }} id="spinner" className="show position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
                                                        <div className="spinner-border text-primary" style={{ width: 3 + "rem", height: 3 + "rem" }} role="status">
                                                            <span className="sr-only"></span>
                                                        </div>
                                                    </div>
                                                ) : null}
                                                <div style={{ pointerEvents: updateState.Edit ? "auto" : "none" }} className="profile-pic-wrapper okImFirst">
                                                    <div className="pic-holder">
                                                        <img id="profilePic" className="pic" src={i.userimage ? i.userimage : "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"} alt="" />
                                                        <input onChange={convertToBase64} className="uploadProfileInput" type="file" name="updateimage" id="newProfilePhoto" style={{ opacity: 0 }} />
                                                        <label htmlFor="newProfilePhoto" className="upload-file-block">
                                                            <div className="text-center">
                                                                <div className="mb-2">
                                                                    <svg style={{ fill: "#fff", fontSize: "x-large" }} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M149.1 64.8L138.7 96H64C28.7 96 0 124.7 0 160V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H373.3L362.9 64.8C356.4 45.2 338.1 32 317.4 32H194.6c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z" /></svg>
                                                                </div>
                                                                <div className="text-uppercase">
                                                                    Update <br /> Profile Photo
                                                                </div>
                                                            </div>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="okImSecond pt-3">
                                                    <div style={{ pointerEvents: updateState.Edit ? "auto" : "none" }}>
                                                        <div className="makeItDoe">
                                                            <div className="emailInsideSecond">
                                                                <label htmlFor="email">Email</label>
                                                                <input name="updateemail" defaultValue={i.email} onChange={(e) => setUpdateState({ updateemail: e.target.value })} type="email" className="inputInsideSecond" id="email" />
                                                            </div>
                                                            <div className="emailInsideSecond">
                                                                <label htmlFor="password">Password</label>
                                                                <input name="updatepassword" onChange={(e) => setUpdateState({ updatepassword: e.target.value })} type="password" className="inputInsideSecond" id="password" placeholder="●●●●●●●●●●" />
                                                            </div>
                                                        </div>
                                                        <div className="makeItDoe pt-3">
                                                            <div className="emailInsideSecond">
                                                                <label htmlFor="fullname">Name</label>
                                                                <input name="uppdatefullname" defaultValue={i.fullname} onChange={(e) => setUpdateState({ updatefullname: e.target.value })} type="text" className="inputInsideSecond" id="fullname" />
                                                            </div>
                                                            <div className="emailInsideSecond">
                                                                <label htmlFor="phonenumber">Phone Number</label>
                                                                <input name="updatephone" defaultValue={i.phonenumber} onChange={(e) => setUpdateState({ updatephone: e.target.value })} type="number" className="inputInsideSecond" id="phonenumber" />
                                                                {updateState.alertCheck ? (
                                                                    <p className="m-0 text-danger">Phone number invalid!</p>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="emailInsideSecond pt-3">
                                                            <label htmlFor="address">Address</label>
                                                            <UserAddressControl address={i.address} edit={updateState.Edit} userid={appler.id} user={updateState.GetUser} />
                                                        </div>
                                                        {updateState.Edit ? (
                                                            <div className="anotherJackass2">
                                                                <button type="button" className="btn btn-danger text-nowrap" onClick={() => setUpdateState({ modalOpenDetail: true })}>Delete account</button>
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    )
                                })
                            ) : (
                                <>
                                    <div className="headOverview">
                                        <h5 style={{ whiteSpace: "nowrap" }} className="m-0">User Overview</h5>
                                    </div>
                                    <div className="BossLvMax" style={{ padding: "2%" }}>
                                        <div style={{ pointerEvents: "none" }} className="profile-pic-wrapper okImFirst">
                                            <div className="pic-holder">
                                                <img id="profilePic" className="pic" src={name.userImage} alt="" />
                                            </div>
                                        </div>
                                        <div className="okImSecond pt-3">
                                            <div style={{ pointerEvents: "none" }}>
                                                <div className="makeItDoe">
                                                    <div className="emailInsideSecond">
                                                        <label htmlFor="email">Email</label>
                                                        <input name="updatemail" defaultValue={name.userEmail} type="email" className="inputInsideSecond" id="email" />
                                                    </div>
                                                    <div className="emailInsideSecond">
                                                        <label htmlFor="fullname">Name</label>
                                                        <input name="uppdatefullname" defaultValue={name.userName} type="text" className="inputInsideSecond" id="fullname" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                            <div style={{ padding: "2%" }}>
                                <div id="myDIV6" className="d-flex justify-content-end pe-2" style={{ gap: 1 + "%" }}>
                                    <button id="OrderHum" className="MBbutton6 active6" onClick={(e) => openCity3(e, "Hum")}>Order</button>
                                    <button className="MBbutton6" onClick={(e) => openCity3(e, "Kum")}>Booking</button>
                                </div>
                                <hr className="mt-0" />
                                <div className="UPanelButton" id="Hum">
                                    <UserDataPanel Data={updateState.GetOrder} toke={name} axios={axios} />
                                </div>
                                <div className="UPanelButton" id="Kum">
                                    <UserBookingPanel id={appler.id} decode={name} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <Modal
                        isOpen={updateState.modalOpenDetail} onRequestClose={() => setUpdateState({ modalOpenDetail: false })} ariaHideApp={false}
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
                                width: "70vw",
                                height: "45vh",
                                zIndex: 999
                            },
                        }}>
                        <form onSubmit={(e) => DeleteAcount(e)} className="py-3" style={{ display: "flex", flexDirection: "column", gap: 30 }}>
                            <h4 className="text-center">Input your password to delete this account</h4>
                            <div className="d-flex justify-content-center flex-column align-items-center">
                                <div className="deleteAccountInputField">
                                    <input onChange={(e) => setUpdateState({ deletePassword: e.target.value })} style={{ width: navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1 ? "80%" : "90%", fontSize: 25, border: "none", padding: 5 }} type={socketState.seePassword ? "text" : "password"} required />
                                    {socketState.seePassword ? (
                                        <button className="EyeInDeleteAccountField" type="button" style={{ width: navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1 ? "20%" : "10%", textAlign: "center" }} onClick={() => setSocketState({ seePassword: false })}>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20" width="40" viewBox="0 0 576 512"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z" /></svg>
                                        </button>
                                    ) : (
                                        <button className="EyeInDeleteAccountField" type="button" style={{ width: navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1 ? "20%" : "10%", textAlign: "center" }} onClick={() => setSocketState({ seePassword: true })}>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20" width="40" viewBox="0 0 576 512"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" /></svg>
                                        </button>
                                    )}
                                </div>
                                {socketState.checkDeletePassword ? (
                                    <p style={{ color: "red", paddingTop: 10 + "px" }}>{socketState.checkDeletePassword}</p>
                                ) : null}
                            </div>
                            <div className="d-flex align-items-center justify-content-evenly">
                                <button type="submit" className="btn btn-primary">Confirm</button>
                                <button type="button" className="btn btn-secondary" onClick={() => setUpdateState({ modalOpenDetail: false })}>Cancel</button>
                            </div>
                        </form>
                        <button className='closeModal' onClick={() => setUpdateState({ modalOpenDetail: false })}>x</button>
                    </Modal>
                </div>
            </Layout>
        </>
    )
}
export default UserPanel;