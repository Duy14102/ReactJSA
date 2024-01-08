import $ from 'jquery';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Swal from 'sweetalert2';
import Cookies from "universal-cookie";
import NotFound from '../../component/outOfBorder/NotFound';
import Layout from '../../Layout';
import { useGoogleLogin } from '@react-oauth/google';

function LoginSite() {
    const cookies = new Cookies();
    const token = cookies.get("TOKEN");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false)
    const [role] = useState("");
    const [fullname] = useState("");
    document.title = "EatCom - Login";

    const [user, setUser] = useState(null)
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
    });

    useEffect(() => {
        if (showPass) {
            $('.showpassInp').attr('type', 'text')
        } else {
            $('.showpassInp').attr('type', 'password')
        }
    }, [showPass])

    const handleSubmit = (e) => {
        // prevent the form from refreshing the whole page
        e.preventDefault();
        const configuration = {
            method: "post",
            url: "https://eatcom.onrender.com/Login",
            data: {
                email,
                password,
                fullname,
                role,
            },
        };
        axios(configuration)
            .then((result) => {
                Swal.fire(
                    'Login Successfully!',
                    'Hello ' + result.data.fullname,
                    'success'
                ).then(function () {
                    cookies.set("TOKEN", result.data.token, {
                        path: "/",
                    });
                    if (result.data.role == 1) {
                        window.location.href = '/';
                    } else if (result.data.role == 4) {
                        window.location.href = '/AdminPanel';
                    } else if (result.data.role === 2) {
                        localStorage.setItem('tabs', 'dashboard')
                        window.location.href = '/EmployeePanel';
                    } else {
                        localStorage.setItem('tabs', 'dashboard')
                        window.location.href = '/ManagerPanel';
                    }
                })
            })
            .catch((err) => {
                Swal.fire(
                    'Login Fail!',
                    `${err.response.data.message}`,
                    'error'
                )
            });
    }

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });

    useEffect(() => {
        if (user) {
            axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                headers: {
                    Authorization: `Bearer ${user.access_token}`,
                    Accept: 'application/json'
                }
            }).then((res) => {
                const configuration9 = {
                    method: "get",
                    url: "https://eatcom.onrender.com/LoginWithGoogle",
                    params: {
                        id: res.data.id,
                        name: res.data.name,
                        email: res.data.email,
                        picture: res.data.picture
                    }
                }
                axios(configuration9).then((result) => {
                    cookies.set("TOKEN", result.data.token, {
                        path: "/",
                    });
                    Swal.fire(
                        'Login Successfully!',
                        'Hello ' + res.data.name,
                        'success'
                    ).then(() => {
                        window.location.href = "/"
                    })
                })
            }).catch((err) => console.log(err));
        }
    }, [user]);

    if (token) {
        return NotFound()
    }

    return (
        <Layout>
            <div className="limiter">
                <div className="container-login100">
                    <div className="wrap-login100">
                        <form onSubmit={(e) => handleSubmit(e)} className="login100-form validate-form">
                            <span className="login100-form-title p-b-26">
                                <h2>Login</h2>
                            </span>

                            <div className="wrap-input100 validate-input" data-validate="Valid email is: a@b.c">
                                <input className="input100" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                <span className="focus-input100" data-placeholder="Email"></span>
                            </div>

                            <div className="wrap-input100 validate-input" data-validate="Enter password">
                                {showPass ? (
                                    <span onClick={() => setShowPass(false)} className="btn-show-pass">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z" /></svg>
                                    </span>
                                ) : (
                                    <span onClick={() => setShowPass(true)} className="btn-show-pass">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" /></svg>
                                    </span>
                                )}
                                <input className="input100 showpassInp" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                <span className="focus-input100" data-placeholder="Password"></span>
                            </div>

                            <div className="container-login100-form-btn">
                                <div className="wrap-login100-form-btn">
                                    <div className="login100-form-bgbtn"></div>
                                    <button type='submit' className="login100-form-btn">Login</button>
                                </div>
                            </div>
                            <div className='orLogin mt-4'>
                                <span>Or login with</span>
                            </div>
                            <div className='d-flex justify-content-center mt-4'>
                                <button type='button' onClick={() => login()}><img alt='' height={50} width={50} src='https://companieslogo.com/img/orig/GOOG-0ed88f7c.png?t=1633218227' /></button>
                            </div>
                            <div className="text-center pt-3">
                                <span className="txt1">
                                    Don't have an account?
                                </span>
                                <NavLink reloadDocument to="/SignupSite" className="txt2" >Signup</NavLink>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
export default LoginSite;