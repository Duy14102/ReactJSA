import PropTypes from "prop-types";
import { Fragment } from "react";

function UserDataPanel({ Data, Edit }) {
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
                        '<div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div>';
                    holder.appendChild(loader);

                    setTimeout(function () {
                        holder.classList.remove("uploadInProgress");
                        loader.remove();

                        var random = Math.random();
                        if (random < 0.9) {
                            wrapper.innerHTML +=
                                '<div class="snackbar show" role="alert"><i class="fa fa-check-circle text-success"></i> Profile image updated successfully</div>';
                            triggerInput.value = "";
                            setTimeout(function () {
                                wrapper.querySelector('[role="alert"]').remove();
                            }, 3000);
                        } else {
                            holder.querySelector(".pic").src = currentImg;
                            wrapper.innerHTML +=
                                '<div class="snackbar show" role="alert"><i class="fa fa-times-circle text-danger"></i> There is an error while uploading! Please try again later.</div>';
                            triggerInput.value = "";
                            setTimeout(function () {
                                wrapper.querySelector('[role="alert"]').remove();
                            }, 3000);
                        }
                    }, 1500);
                };
            } else {
                wrapper.innerHTML +=
                    '<div class="alert alert-danger d-inline-block p-2 small" role="alert">Please choose a valid image.</div>';
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

    var val = document.querySelectorAll(".inputInsideSecond")
    var val2 = document.querySelectorAll(".pic-holder")
    if (Edit) {
        val.forEach(className => {
            className.classList.remove("pointerNone")
        })
        val2.forEach(classFame => {
            classFame.classList.remove("pointerNone")
        })
    }
    else {
        val.forEach(className => {
            className.classList.add("pointerNone")
        })
        val2.forEach(classFame => {
            classFame.classList.add("pointerNone")
        })
    }

    return (
        <>
            {Object.values(Data).map((i) => {
                return (
                    <Fragment key={i._id}>
                        <div className="profile-pic-wrapper okImFirst">
                            <div className="pic-holder">
                                {i.userimage ? (
                                    <img id="profilePic" className="pic" src={i.userimage} alt="" />
                                ) : (
                                    <img id="profilePic" className="pic" src="https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg" alt="" />
                                )}

                                <input className="uploadProfileInput" type="file" name="profile_pic" id="newProfilePhoto" accept="image/*" style={{ opacity: 0 }} />
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
                        <div className="okImSecond pt-3">
                            <div className="makeItDoe">
                                <div className="emailInsideSecond">
                                    <label htmlFor="email">Email</label>
                                    <div style={{ gap: 5 + "%" }} className="d-flex">
                                        <input defaultValue={i.email} type="text" className="inputInsideSecond" id="email" />
                                        {Edit ? (
                                            <button className="plusElf"><i className="fas fa-edit"></i></button>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="emailInsideSecond">
                                    <label htmlFor="password">Password</label>
                                    <div style={{ gap: 5 + "%" }} className="d-flex">
                                        <input defaultValue="●●●●●●●●●●" type="password" className="inputInsideSecond" id="password" />
                                        {Edit ? (
                                            <button className="plusElf"><i className="fas fa-edit"></i></button>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                            <div className="makeItDoe pt-3">
                                <div className="emailInsideSecond">
                                    <label htmlFor="fullname">Name</label>
                                    <div style={{ gap: 5 + "%" }} className="d-flex">
                                        <input defaultValue={i.fullname} type="text" className="inputInsideSecond" id="fullname" />
                                        {Edit ? (
                                            <button className="plusElf"><i className="fas fa-edit"></i></button>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="emailInsideSecond">
                                    <label htmlFor="phonenumber">Phone Number</label>
                                    <div style={{ gap: 5 + "%" }} className="d-flex">
                                        <input defaultValue={i.phonenumber} type="number" className="inputInsideSecond" id="phonenumber" />
                                        {Edit ? (
                                            <button className="plusElf"><i className="fas fa-edit"></i></button>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                            <div className="emailInsideSecond py-3">
                                <label htmlFor="address">Address</label>
                                <div id="address" className="dropdown">
                                    <div className="highestElf">
                                        <button onClick={() => dropdownThis()} className="dropbtn">
                                            Touch me
                                        </button>
                                        {Edit ? (
                                            <button className="plusElf"><i className="fas fa-edit"></i></button>
                                        ) : null}
                                    </div>
                                    <div id="myDropdownThis" className="dropdown-content">
                                        {i.address.map((a) => {
                                            return (
                                                <Fragment key={a}>
                                                    {a ? (
                                                        <p className="m-0">{a}</p>
                                                    ) : (
                                                        <p className="m-0">You dont have address</p>
                                                    )}
                                                </Fragment>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Fragment>
                )
            })}
        </>
    )
}
UserDataPanel.propTypes = {
    Edit: PropTypes.bool.isRequired
};
export default UserDataPanel