import $ from 'jquery';
import { useState } from 'react';
import axios from 'axios';
import '../../css/main.css';
import '../../css/util.css';
import Swal from 'sweetalert2';
import Header from '../../component/Header';
import Footer from '../../component/Footer';
import Cookies from 'universal-cookie';
import NotFound from '../../component/outOfBorder/NotFound';
function LoginSite() {
    document.title = "EatCom - Signup";
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

    const [email, setEmail] = useState("");
    const [fullname, setFullname] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, displayError] = useState(false);

    const handleSubmit = (e) => {
        // prevent the form from refreshing the whole page
        e.preventDefault();
        const configuration = {
            method: "post",
            url: "http://localhost:3000/Register",
            data: {
                email,
                password,
                fullname,
            },
        };
        if (password != confirm) {
            displayError(true);
        } else {
            axios(configuration)
                .then((result) => {
                    Swal.fire(
                        'Register Successfully!',
                        'Welcome ' + result.data.fullname,
                        'success'
                    ).then(function () {
                        location.reload();
                    })
                })
                .catch(() => {
                    Swal.fire(
                        'Register Fail!',
                        '',
                        'error'
                    ).then(function () {
                        location.reload();
                    })
                });
        }
    }
    const cookies = new Cookies();
    const token = cookies.get("TOKEN");
    if (token) {
        return NotFound();
    }
    return (
        <>
            <Header />

            <div className="limiter">
                <div className="container-login100">
                    <div className="wrap-login100">
                        <form onSubmit={(e) => handleSubmit(e)} className="login100-form validate-form">
                            <span className="login100-form-title p-b-26">
                                <h2>Signup</h2>
                            </span>

                            <div className="wrap-input100 validate-input" data-validate="Valid email is: a@b.c">
                                <input className="input100" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <span className="focus-input100" data-placeholder="Email"></span>
                            </div>

                            <div className="wrap-input100 validate-input" data-validate="Enter Fullname">
                                <input className="input100" type="text" name="fullname" value={fullname} onChange={(e) => setFullname(e.target.value)} />
                                <span className="focus-input100" data-placeholder="Fullname"></span>
                            </div>

                            <div className="wrap-input100 validate-input" data-validate="Enter password">
                                <span className="btn-show-pass">
                                    <i className="fa fa-eye"></i>
                                </span>
                                <input className="input100" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                <span className="focus-input100" data-placeholder="Password"></span>
                            </div>

                            <div className="wrap-input100 validate-input" data-validate="Repeat password">
                                <span className="btn-show-pass">
                                    <i className="fa fa-eye"></i>
                                </span>
                                <input className="input100" type="password" name="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                                <span className="focus-input100" data-placeholder="Repeat password"></span>
                            </div>
                            {error ? (
                                <p className="text-danger">Repeat correcly password!</p>
                            ) : (
                                <input type='hidden' />
                            )}
                            <div className="container-login100-form-btn">
                                <div className="wrap-login100-form-btn">
                                    <div className="login100-form-bgbtn"></div>
                                    <button type='submit' className="login100-form-btn" onClick={(e) => handleSubmit(e)}>
                                        Signup
                                    </button>
                                </div>
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