import { useParams } from "react-router-dom";
import NotFound from "../../component/outOfBorder/NotFound"
import Header from "../../component/Header";
import Footer from "../../component/Footer"
import '../../css/Admin.css'
import { useState, useEffect } from "react";
import UserDataPanel from "../../component/admin/UserDataPanel";
import { Fragment } from 'react';
import axios from "axios";
import Swal from "sweetalert2";

function UserPanel() {
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

    useEffect(() => {
        fetch(`http://localhost:3000/GetDetailUser?userid=${appler.id}`, {
            method: "get",
        }).then((res) => res.json()).then((data) => {
            setGetUser(data);
        })
    }, [appler.id])

    useEffect(() => {
        fetch(`http://localhost:3000/GetOrderUserPanel?id=${appler.id}`, {
            method: "get",
        }).then((res) => res.json()).then((data) => {
            setGetOrder(data.data)
        })
    }, [appler.id])

    if (!appler) {
        return NotFound()
    }

    document.addEventListener("change", function (event) {
        if (event.target.classList.contains("uploadProfileInput")) {
            var triggerInput = event.target;
            var currentImg = triggerInput.closest(".pic-holder").querySelector(".pic")
                .src;
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

                        var random = Math.random();
                        if (random < 0.9) {
                            wrapper.innerHTML +=
                                '<div className="snackbar show" role="alert"><i className="fa fa-check-circle text-success"></i> Profile image updated successfully</div>';
                            triggerInput.value = "";
                            setTimeout(function () {
                                wrapper.querySelector('[role="alert"]').remove();
                            }, 3000);
                        } else {
                            holder.querySelector(".pic").src = currentImg;
                            wrapper.innerHTML +=
                                '<div className="snackbar show" role="alert"><i className="fa fa-times-circle text-danger"></i> There is an error while uploading! Please try again later.</div>';
                            triggerInput.value = "";
                            setTimeout(function () {
                                wrapper.querySelector('[role="alert"]').remove();
                            }, 3000);
                        }
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

    function dropdownThis() {
        document.getElementById("myDropdownThis").classList.toggle("show");
    }

    // Close the dropdown if the user clicks outside of it
    window.onclick = function (event) {
        if (!event.target.matches('.dropbtn')) {
            var dropdowns = document.getElementsByClassName("dropdown-content");
            var i;
            for (i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }

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
        axios(configuration)
            .then(() => {
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

    return (
        <>
            <Header />

            <div className="container py-4">
                <div className="coverUser">
                    <form onSubmit={(e) => handleSubmit(e, appler.id)}>
                        <div className="headOverview">
                            <h5 className="m-0">User id : {appler.id}</h5>
                            {Edit ? (
                                <div style={{ gap: 5 + "%" }} className="d-flex">
                                    <button type="submit" className="button4Edit" >Comfirm</button>
                                    <button type="button" className="button4Edit" onClick={() => setEdit(false)}>Cancel</button>
                                </div>
                            ) : (
                                <button type="button" className="button4Edit" onClick={() => setEdit(true)}>Edit</button>
                            )}
                        </div>
                        <div className="BossLvMax pt-3">
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
                                                                <i className="fa fa-camera fa-2x"></i>
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
                                                    <input className="uploadProfileInput" type="file" name="profile_pic" id="newProfilePhoto" style={{ opacity: 0 }} />
                                                    <label htmlFor="newProfilePhoto" className="upload-file-block">
                                                        <div className="text-center">
                                                            <div className="mb-2">
                                                                <i className="fa fa-camera fa-2x"></i>
                                                            </div>
                                                            <div className="text-uppercase">
                                                                Update <br /> Profile Photo
                                                            </div>
                                                        </div>
                                                    </label>
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
                                                            <input name="updatepassword" value={updatepassword} onChange={(e) => setPassword(e.target.value)} type="password" className="inputInsideSecond" id="password" />
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
                                                <div id="address" className="dropdown">
                                                    <div style={{ gap: 5 + "%" }} className="d-flex">
                                                        {i.address.length === 0 ? (
                                                            <button type="button" className="dropbtn">
                                                                Address empty
                                                            </button>
                                                        ) : (
                                                            <button type="button" onClick={() => dropdownThis()} className="dropbtn">
                                                                Touch me
                                                            </button>
                                                        )}
                                                        {Edit ? (
                                                            <button type="button" className="plusElf"><i className="fas fa-edit"></i></button>
                                                        ) : null}
                                                    </div>
                                                    <div id="myDropdownThis" className="dropdown-content">
                                                        {i.address.map((a) => {
                                                            return (
                                                                <p key={a} className="m-0">{a}</p>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Fragment>
                                )
                            })}
                        </div>
                    </form>
                    <hr />
                    <UserDataPanel Data={GetOrder} />
                </div>
            </div >

            <Footer />
        </>
    )
}
export default UserPanel;