import $ from 'jquery';
import axios from 'axios';
import { useState } from 'react';
import '../../css/main.css';
import '../../css/util.css';
import { Link } from 'react-router-dom';
import Header from '../../component/Header';
import Footer from '../../component/Footer';
import Swal from 'sweetalert2';
import Cookies from "universal-cookie";
function LoginSite() {
    document.title = "EatCom - Login";
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
            $(this).focus(function () {
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

    const cookies = new Cookies();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role] = useState("");
    const [fullname] = useState("");

    const handleSubmit = (e) => {
        // prevent the form from refreshing the whole page
        e.preventDefault();
        const configuration = {
            method: "post",
            url: "http://localhost:3000/Login",
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
                    } else {
                        window.location.href = '/AdminPanel';
                    }
                })
            })
            .catch(() => {
                Swal.fire(
                    'Login Fail!',
                    '',
                    'error'
                ).then(function () {
                    location.reload();
                })
            });
    }
    return (
        <>
            <Header />

            <div className="limiter">
                <div className="container-login100">
                    <div className="wrap-login100">
                        <form onSubmit={(e) => handleSubmit(e)} className="login100-form validate-form">
                            <span className="login100-form-title p-b-26">
                                <h2>Login</h2>
                            </span>

                            <div className="wrap-input100 validate-input" data-validate="Valid email is: a@b.c">
                                <input className="input100" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <span className="focus-input100" data-placeholder="Email"></span>
                            </div>

                            <div className="wrap-input100 validate-input" data-validate="Enter password">
                                <span className="btn-show-pass">
                                    <i className="fa fa-eye"></i>
                                </span>
                                <input className="input100" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                <span className="focus-input100" data-placeholder="Password"></span>
                            </div>

                            <div className="container-login100-form-btn">
                                <div className="wrap-login100-form-btn">
                                    <div className="login100-form-bgbtn"></div>
                                    <button type='submit' className="login100-form-btn" onClick={(e) => handleSubmit(e)}>
                                        Login
                                    </button>
                                </div>
                            </div>

                            <div className="text-center p-t-50">
                                <span className="txt1">
                                    Don't have an account?
                                </span>
                                <Link to="/SignupSite" className="txt2" >Signup</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
export default LoginSite;