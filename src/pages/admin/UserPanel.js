import { useParams } from "react-router-dom";
import NotFound from "../../component/outOfBorder/NotFound"
import { useState, useEffect } from "react";
import UserDataPanel from "../../component/admin/UserDataPanel";
import { Fragment } from 'react';
import axios from "axios";
import Swal from "sweetalert2";
import UserAddressControl from "../../component/admin/UserAddressControl";
import UserBookingPanel from "../../component/admin/UserBookingPanel";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import Layout from "../../Layout";
import '../../css/Admin.css'

function UserPanel() {
    const cookies = new Cookies();
    const token = cookies.get("TOKEN");
    const name = jwtDecode(token)
    let appler = useParams()
    const [updateemail, setEmail] = useState()
    const [updatepassword, setPassword] = useState()
    const [updatephone, setPhonenumber] = useState()
    const [updatefullname, setFullName] = useState()
    const [updateimage, setImage] = useState();
    // const [Address, setAddress] = useState("")
    const [Edit, setEdit] = useState(false)
    const [GetUser, setGetUser] = useState([])
    const [GetOrder, setGetOrder] = useState([])
    const [spinner, setSpinner] = useState(false)
    const [alertCheck, setAlertCheck] = useState(false)
    const checkPhone = /((09|03|07|08|05)+([0-9]{8})\b)/g
    useEffect(() => {
        if (name.userRole !== 1.5) {
            fetch(`http://localhost:3000/GetDetailUser?userid=${appler.id}`, {
                method: "get",
            }).then((res) => res.json()).then((data) => {
                setGetUser(data);
            })
        }
        fetch(`http://localhost:3000/GetOrderUserPanel?id=${appler.id}`, {
            method: "get",
        }).then((res) => res.json()).then((data) => {
            setGetOrder(data.data)
        })
        document.getElementById("OrderHum").click();
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
            setImage(reader.result);
        };
        reader.onerror = error => {
            console.log(error);
        }
    }
    const handleSubmit = (e, id) => {
        // prevent the form from refreshing the whole page
        e.preventDefault();
        const configuration = {
            method: "post",
            url: "http://localhost:3000/UpdateUser",
            data: {
                updateid: id,
                updateemail,
                updatepassword,
                updatefullname,
                updatephone,
                base64: updateimage
            },
        };
        setSpinner(true)
        if (!checkPhone.test(updatephone)) {
            setSpinner(false)
            setAlertCheck(true)
            return false
        }
        axios(configuration)
            .then(() => {
                setSpinner(false)
                Swal.fire(
                    'Update Successfully!',
                    '',
                    'success'
                ).then(function () {
                    window.location.reload();
                })
            })
            .catch((e) => {
                console.log(e);
            });
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
        <Layout>
            <div className="bg-white">
                <div className="container py-4">
                    <div className="coverUser">
                        {name.userRole !== 1.5 ? (
                            <form onSubmit={(e) => handleSubmit(e, appler.id)}>
                                <div className="headOverview">
                                    <h5 style={{ whiteSpace: "nowrap" }} className="m-0">User Overview</h5>
                                    {Edit ? (
                                        <div style={{ gap: 5 + "%" }} className="d-flex justify-content-center">
                                            <button type="submit" className="button4Edit" >Comfirm</button>
                                            <button type="button" className="button4Edit" onClick={() => { setEdit(false); setAlertCheck(false) }}>Cancel</button>
                                        </div>
                                    ) : (
                                        <button type="button" className="button4Edit" onClick={() => setEdit(true)}>Edit</button>
                                    )}
                                </div>
                                <div className="BossLvMax pt-3">
                                    {spinner ? (
                                        <div style={{ background: "rgba(255, 255, 255, 0.6)" }} id="spinner" className="show position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
                                            <div className="spinner-border text-primary" style={{ width: 3 + "rem", height: 3 + "rem" }} role="status">
                                                <span className="sr-only"></span>
                                            </div>
                                        </div>
                                    ) : null}
                                    {Object.values(GetUser).map((i) => {
                                        return (
                                            <Fragment key={i._id}>
                                                {Edit ? (
                                                    <div className="profile-pic-wrapper okImFirst">
                                                        <div className="pic-holder">
                                                            {i.userimage ? (
                                                                <>
                                                                    <img id="profilePic" className="pic" src={i.userimage} alt="" />
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
                                                ) : (
                                                    <div style={{ pointerEvents: "none" }} className="profile-pic-wrapper okImFirst">
                                                        <div className="pic-holder">
                                                            {i.userimage ? (
                                                                <img id="profilePic" className="pic" src={i.userimage} alt="" />
                                                            ) : (
                                                                <img id="profilePic" className="pic" src="https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg" alt="" />
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="okImSecond pt-3">
                                                    {Edit ? (
                                                        <div>
                                                            <div className="makeItDoe">
                                                                <div className="emailInsideSecond">
                                                                    <label htmlFor="email">Email</label>
                                                                    <input name="updateemail" defaultValue={i.email} value={updateemail} onChange={(e) => setEmail(e.target.value)} type="email" className="inputInsideSecond" id="email" />
                                                                </div>
                                                                <div className="emailInsideSecond">
                                                                    <label htmlFor="password">Password</label>
                                                                    <input name="updatepassword" value={updatepassword} onChange={(e) => setPassword(e.target.value)} type="password" className="inputInsideSecond" id="password" placeholder="●●●●●●●●●●" />
                                                                </div>
                                                            </div>
                                                            <div className="makeItDoe pt-3">
                                                                <div className="emailInsideSecond">
                                                                    <label htmlFor="fullname">Name</label>
                                                                    <input name="uppdatefullname" defaultValue={i.fullname} value={updatefullname} onChange={(e) => setFullName(e.target.value)} type="text" className="inputInsideSecond" id="fullname" />
                                                                </div>
                                                                <div className="emailInsideSecond">
                                                                    <label htmlFor="phonenumber">Phone Number</label>
                                                                    <input name="updatephone" defaultValue={i.phonenumber} value={updatephone} onChange={(e) => setPhonenumber(e.target.value)} type="number" className="inputInsideSecond" id="phonenumber" />
                                                                    {alertCheck ? (
                                                                        <p className="m-0 text-danger">Phone number invalid!</p>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div style={{ pointerEvents: "none" }}>
                                                            <div className="makeItDoe">
                                                                <div className="emailInsideSecond">
                                                                    <label htmlFor="email">Email</label>
                                                                    <input name="updatemail" defaultValue={i.email} type="email" className="inputInsideSecond" id="email" />
                                                                </div>
                                                                <div className="emailInsideSecond">
                                                                    <label htmlFor="password">Password</label>
                                                                    <input name="updatepassword" type="password" className="inputInsideSecond" id="password" placeholder="●●●●●●●●●●" />
                                                                </div>
                                                            </div>
                                                            <div className="makeItDoe pt-3">
                                                                <div className="emailInsideSecond">
                                                                    <label htmlFor="fullname">Name</label>
                                                                    <input name="uppdatefullname" defaultValue={i.fullname} type="text" className="inputInsideSecond" id="fullname" />
                                                                </div>
                                                                <div className="emailInsideSecond">
                                                                    <label htmlFor="phonenumber">Phone Number</label>
                                                                    <input name="updatephone" defaultValue={i.phonenumber} type="number" className="inputInsideSecond" id="phonenumber" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="emailInsideSecond py-3">
                                                        <label htmlFor="address">Address</label>
                                                        <UserAddressControl address={i.address} edit={Edit} userid={appler.id} user={GetUser} />
                                                    </div>
                                                </div>
                                            </Fragment>
                                        )
                                    })}
                                </div>
                            </form>
                        ) : (
                            <>
                                <div className="headOverview">
                                    <h5 style={{ whiteSpace: "nowrap" }} className="m-0">User Overview</h5>
                                </div>
                                <div className="BossLvMax pt-3">
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
                        <div id="myDIV6" className="d-flex justify-content-end pe-2" style={{ gap: 1 + "%" }}>
                            <button id="OrderHum" className="MBbutton6 active6" onClick={(e) => openCity3(e, "Hum")}>Order</button>
                            <button className="MBbutton6" onClick={(e) => openCity3(e, "Kum")}>Booking</button>
                        </div>
                        <hr className="mt-0" />
                        <div className="UPanelButton" id="Hum">
                            <UserDataPanel Data={GetOrder} toke={name} />
                        </div>
                        <div className="UPanelButton" id="Kum">
                            <UserBookingPanel id={appler.id} />
                        </div>
                    </div>
                </div >
            </div>
        </Layout>
    )
}
export default UserPanel;