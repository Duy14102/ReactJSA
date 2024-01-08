import $ from 'jquery';
import { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import Cookies from 'universal-cookie';
import NotFound from '../../component/outOfBorder/NotFound';
import { NavLink } from 'react-router-dom';
import Layout from '../../Layout';
import socketIOClient from "socket.io-client";

function LoginSite() {
    const [showPass, setShowPass] = useState(false)
    const [showPass2, setShowPass2] = useState(false)
    const [email, setEmail] = useState("");
    const [fullname, setFullname] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [phone, setPhone] = useState("");
    const [alertCheck, setAlertCheck] = useState(false)
    const checkUpperCase = RegExp("(.*[A-Z].*)")
    const checkDigit = RegExp("(.*[0-9].*)")
    const checkPhone = /((09|03|07|08|05)+([0-9]{8})\b)/g
    const socketRef = useRef();
    document.title = "EatCom - Signup";
    useEffect(() => {
        socketRef.current = socketIOClient.connect("http://localhost:3000")

        socketRef.current.on('RegisterSuccess', dataGot => {
            if (dataGot.email === localStorage.getItem("CheckEmail")) {
                Swal.fire(
                    'Register Successfully!',
                    'Welcome ' + dataGot.fullname,
                    'success'
                ).then(function () {
                    localStorage.removeItem("CheckEmail")
                    window.location.reload();
                })
            }
        })

        socketRef.current.on('RegisterFail', dataGot => {
            if (dataGot.email === localStorage.getItem("CheckEmail")) {
                Swal.fire(
                    'Register Fail!',
                    ``,
                    'error'
                ).then(function () {
                    localStorage.removeItem("CheckEmail")
                })
            }
        })

        return () => {
            socketRef.current.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    $(function () {
        // [Focus input] * /
        $('.input100').each(function () {
            $(this).on('blur', function () {
                /* eslint-disable */
                if ($(this).val().trim() != "") {
                    $(this).addClass('has-val');
                }
                else {
                    $(this).removeClass('has-val');
                }
            })
        })


        /*==================================================================
        [ Validate ]*/
        var input = $('.validate-input .input100');

        $('.validate-form').on('submit', function () {
            var check = true;

            for (var i = 0; i < input.length; i++) {
                if (validate(input[i]) == false) {
                    showValidate(input[i]);
                    check = false;
                }
            }

            return check;
        });


        $('.validate-form .input100').each(function () {
            $(this).on("focus", function () {
                hideValidate(this);
            });
        });

        function validate(input) {
            if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
                if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                    return false;
                }
            }
            else {
                if ($(input).val().trim() == '') {
                    return false;
                }
            }
        }

        function showValidate(input) {
            var thisAlert = $(input).parent();

            $(thisAlert).addClass('alert-validate');
        }

        function hideValidate(input) {
            var thisAlert = $(input).parent();

            $(thisAlert).removeClass('alert-validate');
        }

        /*==================================================================
        [ Show pass ]*/
        var showPass = 0;
        $('.btn-show-pass').on('click', function () {
            if (showPass == 0) {
                $(this).next('input').attr('type', 'text');
                $(this).find('i').removeClass('fa-eye');
                $(this).find('i').addClass('fa-eye-slash');
                showPass = 1;
            }
            else {
                $(this).next('input').attr('type', 'password');
                $(this).find('i').addClass('fa-eye');
                $(this).find('i').removeClass('fa-eye-slash');
                showPass = 0;
            }

        });
    });

    const handleSubmit = (e) => {
        // prevent the form from refreshing the whole page
        e.preventDefault();
        if (password !== confirm) {
            return false
        } if (!checkUpperCase.test(password)) {
            return false
        } if (!checkDigit.test(password)) {
            return false
        } if (!checkPhone.test(phone)) {
            setAlertCheck(true)
            return false
        }
        const data = { email, password, fullname, phone }
        localStorage.setItem("CheckEmail", email)
        socketRef.current.emit('RegisterSocket', data)
    }

    useEffect(() => {
        if (showPass) {
            $('.showpassInp1').attr('type', 'text')
        } else {
            $('.showpassInp1').attr('type', 'password')
        }
    }, [showPass])

    useEffect(() => {
        if (showPass2) {
            $('.showpassInp2').attr('type', 'text')
        } else {
            $('.showpassInp2').attr('type', 'password')
        }
    }, [showPass2])

    const cookies = new Cookies();
    const token = cookies.get("TOKEN");
    if (token) {
        return NotFound();
    }
    return (
        <Layout>

            <div className="limiter">
                <div className="container-login100">
                    <div className="wrap-login100">
                        <form onSubmit={(e) => handleSubmit(e)} className="login100-form validate-form">
                            <span className="login100-form-title p-b-26">
                                <h2>Signup</h2>
                            </span>

                            <div className="wrap-input100 validate-input" data-validate="Valid email is: a@b.c">
                                <input className="input100" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                <span className="focus-input100" data-placeholder="Email"></span>
                            </div>

                            <div style={{ marginBottom: 50 + "px", position: "relative" }}>
                                <div className="wrap-input100 validate-input m-0" data-validate="Enter password">
                                    {showPass ? (
                                        <span onClick={() => setShowPass(false)} className="btn-show-pass">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z" /></svg>
                                        </span>
                                    ) : (
                                        <span onClick={() => setShowPass(true)} className="btn-show-pass">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" /></svg>
                                        </span>
                                    )}
                                    <input className="input100 showpassInp1" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                    <span className="focus-input100" data-placeholder="Password"></span>
                                </div>
                                {password !== "" ? (
                                    <div className='appearCheckPass'>
                                        {checkUpperCase.test(password) ? null : (
                                            <p>❌ Password must have at least 1 uppercase letter</p>
                                        )}
                                        {checkDigit.test(password) ? null : (
                                            <p>❌ Password must have at least 1 digit</p>
                                        )}
                                    </div>
                                ) : null}
                            </div>
                            <div style={{ marginBottom: 50 + "px", position: "relative" }}>
                                <div className="wrap-input100 validate-input m-0" data-validate="Repeat password">
                                    {showPass2 ? (
                                        <span onClick={() => setShowPass2(false)} className="btn-show-pass">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z" /></svg>
                                        </span>
                                    ) : (
                                        <span onClick={() => setShowPass2(true)} className="btn-show-pass">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" /></svg>
                                        </span>
                                    )}
                                    <input className="input100 showpassInp2" type="password" name="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
                                    <span className="focus-input100" data-placeholder="Repeat password"></span>
                                </div>
                                {confirm !== "" ? (
                                    password !== confirm ? (
                                        <div className='appearCheckPass'>
                                            <p className="text-danger">Repeat correcly password!</p>
                                        </div>
                                    ) : null
                                ) : null}
                            </div>

                            <div className="wrap-input100 validate-input" data-validate="Enter Fullname">
                                <input className="input100" type="text" name="fullname" value={fullname} onChange={(e) => setFullname(e.target.value)} required />
                                <span className="focus-input100" data-placeholder="Fullname"></span>
                            </div>

                            <div style={{ marginBottom: 50 + "px", position: "relative" }}>
                                <div className="wrap-input100 validate-input m-0" data-validate="Enter Phone Number">
                                    <input className="input100" type="number" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                                    <span className="focus-input100" data-placeholder="Enter Phone Number"></span>
                                </div>
                                {alertCheck ? (
                                    <div className='appearCheckPass'>
                                        <p className="text-danger">Phone number invalid!</p>
                                    </div>
                                ) : null}
                            </div>

                            <div className="container-login100-form-btn">
                                <div className="wrap-login100-form-btn">
                                    <div className="login100-form-bgbtn"></div>
                                    <button type='submit' className="login100-form-btn">Signup</button>
                                </div>
                            </div>
                        </form>
                        <div className='pt-4 d-flex justify-content-center'>
                            <p className='m-0 txt1'>Already have an account?</p><NavLink className="txt2" reloadDocument to="/LoginSite">Signin</NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
export default LoginSite;