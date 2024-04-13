import { NavLink, useLocation } from "react-router-dom";
import NotFound from "../component/outOfBorder/NotFound";
import { Fragment, useEffect, useReducer } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import Layout from "../Layout";
import { PayPalButton } from "react-paypal-button-v2";
import "../css/Cart.css";
import Header from "../component/Header";

function Checkout() {
    var paymentmethod = 0
    const orderitems = []
    const havePhone = []
    const user = []
    const ahoe = localStorage.getItem("complete")
    const checkPhone = /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/
    const [checkoutState, setCheckoutState] = useReducer((prev, next) => ({
        ...prev, ...next
    }), {
        Card: false,
        SaveAddress: false,
        AccountAddress: false,
        paypalState: null,
        checkCardReal: false,
        vnpay: false,
        paypal: false,
        phoneWrong: false,
        addressWrong: false,
        loadBit: false,
        Firstname: "",
        Lastname: "",
        phonenumber: "",
        address: "",
        bankCode: null,
        bankList: null,
        FullnameToken: "",
        LoadAddress: []
    })

    var fullname = ""
    let location = useLocation()
    const cookies = new Cookies();
    var candecode = null
    const token = cookies.get("TOKEN");
    if (token) {
        candecode = jwtDecode(token)
    }
    havePhone.push(checkoutState.address)

    useEffect(() => {
        const getDetailUser = () => {
            const decoded = jwtDecode(token);
            const configuration = {
                method: "get",
                url: "https://eatcom.onrender.com/GetDetailUser",
                params: {
                    userid: decoded.userId
                }
            };
            axios(configuration)
                .then((result) => {
                    setCheckoutState({ LoadAddress: result.data })
                })
                .catch((error) => {
                    console.log(error);
                });
        }

        if (checkoutState.AccountAddress) {
            getDetailUser()
        }
        if (token && candecode?.userRole !== 1.5) {
            getDetailUser()
        }
    }, [checkoutState.AccountAddress, token, candecode?.userRole])

    useEffect(() => {
        let pre = ""
        Object.values(checkoutState.LoadAddress).map((k) => {
            pre = k.phonenumber
            return (
                null
            )
        })
        setCheckoutState({ FullnameToken: candecode?.userName })
        setCheckoutState({ phonenumber: pre })
    }, [checkoutState.LoadAddress, candecode?.userName])

    useEffect(() => {
        if (checkoutState.paypalState === "COMPLETED") {
            const configuration = {
                method: "post",
                url: "https://eatcom.onrender.com/UploadOrder",
                data: {
                    user: user,
                    phonenumber: checkoutState.phonenumber,
                    address: checkoutState.address,
                    paymentmethod,
                    shippingfee: parseInt(localStorage.getItem("shippingFee")),
                    orderitems
                }
            }
            axios(configuration)
                .then((result) => {
                    if (checkoutState.SaveAddress) {
                        const decode = jwtDecode(token);
                        const configuration = {
                            method: "post",
                            url: "https://eatcom.onrender.com/AddAddressUser",
                            data: {
                                id: decode.userId,
                                address: havePhone
                            }
                        }
                        axios(configuration)
                            .then(() => {
                                console.log("success");
                            }).catch((e) => {
                                console.log(e);
                            })
                    }
                    var data = null
                    if (candecode) {
                        data = { orderid: result.data.message, userid: candecode.userId }
                    } else {
                        data = { orderid: result.data.message }
                    }
                    window.history.replaceState({}, document.title)
                    localStorage.removeItem("cart")
                    paypalCheckout(data)
                })
                .catch((e) => {
                    console.log(e);
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkoutState.paypalState])

    //Call bank list api
    useEffect(() => {
        if (checkoutState.vnpay) {
            const configurationX = {
                method: "get",
                url: "https://api.vietqr.io/v2/banks"
            }
            axios(configurationX)
                .then((res) => {
                    setCheckoutState({ bankList: res.data.data })
                }).catch((er) => {
                    console.log(er);
                })
        }
    }, [checkoutState.vnpay])

    if (token) {
        const decode3 = jwtDecode(token)
        fullname = checkoutState.FullnameToken
        const nit = { id: decode3.userId, fullname: fullname }
        user.push(nit)
    } else {
        fullname = checkoutState.Firstname + " " + checkoutState.Lastname
        const nat = { id: "none", fullname: fullname }
        user.push(nat)
    }

    if (!location.state) {
        return NotFound()
    } else if (!location.state.valid.length > 0) {
        window.history.replaceState({}, document.title)
        return NotFound()
    }

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    const locationMap = location.state.valid

    const VnpayCheckout = (data) => {
        const configuration = {
            method: "post",
            url: "https://eatcom.onrender.com/VnpayCheckout",
            data: {
                amount: fulltotal,
                bankCode: checkoutState.bankCode,
                orderId: data.orderid
            }
        }
        axios(configuration)
            .then((res) => {
                localStorage.setItem("complete", JSON.stringify(data))
                window.location.href = `${res.data}`
            })
            .catch((err) => console.log(err))
    }

    const paypalCheckout = (data) => {
        localStorage.setItem("complete", JSON.stringify(data))
        if (checkoutState.Card && checkoutState.paypalState) {
            window.location.href = `/OrderComplete?status=${checkoutState.paypalState}`;
        }
    }


    if (checkoutState.Card) {
        paymentmethod = 1
    } else {
        paymentmethod = 2
    }
    const handleSubmit = (e) => {
        // prevent the form from refreshing the whole page
        e.preventDefault();
        if (checkoutState.Card) {
            if (!checkoutState.vnpay && !checkoutState.paypal) {
                setCheckoutState({ checkCardReal: true })
                return false
            }
        }
        const miniConfiguration = {
            method: "post",
            url: "https://eatcom.onrender.com/CheckAddressOpenCage",
            data: {
                address: checkoutState.address
            }
        }
        setCheckoutState({ loadBit: true })
        axios(miniConfiguration).then(() => {
            const configuration = {
                method: "post",
                url: "https://eatcom.onrender.com/UploadOrder",
                data: {
                    user: user,
                    phonenumber: checkoutState.phonenumber,
                    address: checkoutState.address,
                    paymentmethod,
                    shippingfee: parseInt(localStorage.getItem("shippingFee")),
                    orderitems
                }
            }
            axios(configuration)
                .then((result) => {
                    if (checkoutState.SaveAddress) {
                        const decode = jwtDecode(token);
                        const configuration = {
                            method: "post",
                            url: "https://eatcom.onrender.com/AddAddressUser",
                            data: {
                                id: decode.userId,
                                address: havePhone
                            }
                        }
                        axios(configuration)
                            .then(() => {
                                console.log("success");
                            }).catch((e) => {
                                console.log(e);
                            })
                    }
                    var data = null
                    if (candecode) {
                        data = { orderid: result.data.message, userid: candecode.userId }
                    } else {
                        data = { orderid: result.data.message }
                    }
                    window.history.replaceState({}, document.title)
                    localStorage.removeItem("cart")
                    if (checkoutState.Card && checkoutState.vnpay) {
                        VnpayCheckout(data)
                    } else {
                        localStorage.setItem("complete", JSON.stringify(data))
                        window.location.href = "/OrderComplete";
                    }
                })
                .catch((e) => {
                    setCheckoutState({ loadBit: true })
                    console.log(e);
                });
        }).catch(() => {
            setCheckoutState({ loadBit: true })
            setCheckoutState({ addressWrong: true })
        })
    }

    const handleCheckbox = (e) => {
        if (e.target.checked) {
            setCheckoutState({ AccountAddress: true })
        } else if (!e.target.checked) {
            setCheckoutState({ AccountAddress: false })
        }
    }

    const handleCheckbox2 = (e) => {
        if (e.target.checked) {
            setCheckoutState({ SaveAddress: true })
        } else if (!e.target.checked) {
            setCheckoutState({ SaveAddress: false })
        }
    }
    var total2 = 0, inTotal = 0, fulltotal = 0
    const mero = (i, index) => {
        var countTotal = 0
        inTotal = i.topping?.reduce((acc, o) => acc + parseInt(o.foodprice), 0)
        if (inTotal) {
            countTotal = (inTotal + i.data.foodprice) * i.quantity
        } else {
            countTotal = i.data.foodprice * i.quantity
        }
        total2 += countTotal
        const indexPlus = index + 1
        const allpush = { data: i.data, quantity: i.quantity, topping: i.topping }
        orderitems.push(allpush)
        return (
            <tr key={index} style={{ verticalAlign: "middle" }}>
                <td className="text-center">{indexPlus}</td>
                <td>
                    <div className="d-flex align-items-center" style={{ gap: 10 }}>
                        <img alt="" src={i.data.foodimage} width={70} height={60} />
                        <div>
                            <p className="m-0">{i.data.foodname}</p>
                            <p className="m-0 text-start" style={{ fontSize: 14, color: "#FEA116" }}><b>{VND.format(i.data.foodprice)}</b></p>
                        </div>
                    </div>
                    {i.topping?.map((p) => {
                        return (
                            <div key={p._id} className="d-flex align-items-center" style={{ gap: 10, marginLeft: 25, marginTop: 10 }}>
                                <img alt="" src={p.foodimage} width={45} height={40} />
                                <div>
                                    <p className="m-0" style={{ fontSize: 14 }}>{p.foodname}</p>
                                    <p className="m-0 text-start" style={{ color: "#FEA116", fontSize: 12 }}><b>{VND.format(p.foodprice)}</b></p>
                                </div>
                            </div>
                        )
                    })}
                </td>
                <td className="text-center">{i.quantity}</td>
                <td className="text-center">{VND.format(countTotal)}</td>
            </tr>
        )
    }
    return (
        <Layout>
            <Header type={"Yes"} />
            <div className="bg-white">
                <div className="container py-5">
                    <div className="pb-5 text-center businessWay">
                        <NavLink className="joiboy" to="/Cart"> Shopping Cart</NavLink> <span className='slash'>˃</span> <NavLink className="joiboy" to="/Checkout" >Checkout Details</NavLink> <span className='slash'>˃</span> {ahoe ? (<NavLink className="joiboy" to="/">Order Complete</NavLink>) : (<NavLink className="joiboy" style={{ pointerEvents: "none" }} to="/">Order Complete</NavLink>)}
                    </div>
                    <form style={{ position: "relative" }} className="flexAble2" onSubmit={(e) => handleSubmit(e)}>
                        <div style={{ borderLeftWidth: window.innerWidth > 991 ? 1 : null, borderLeftColor: window.innerWidth > 991 ? "lightgray" : null, borderLeftStyle: window.innerWidth > 991 ? "solid" : null }} className="takeSecondUI">
                            <h4 className="d-flex justify-content-between align-items-center mb-3">
                                <span>Your order</span>
                            </h4>
                            <ul className="list-group mb-3">
                                {/* <li className="list-group-item">
                                    <div className="navbar-brand p-0 text-center">
                                        <h2 className="text-primary thisTextH1 m-0"><svg style={{ fill: "#FEA116" }} className="me-3" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M416 0C400 0 288 32 288 176V288c0 35.3 28.7 64 64 64h32V480c0 17.7 14.3 32 32 32s32-14.3 32-32V352 240 32c0-17.7-14.3-32-32-32zM64 16C64 7.8 57.9 1 49.7 .1S34.2 4.6 32.4 12.5L2.1 148.8C.7 155.1 0 161.5 0 167.9c0 45.9 35.1 83.6 80 87.7V480c0 17.7 14.3 32 32 32s32-14.3 32-32V255.6c44.9-4.1 80-41.8 80-87.7c0-6.4-.7-12.8-2.1-19.1L191.6 12.5c-1.8-8-9.3-13.3-17.4-12.4S160 7.8 160 16V150.2c0 5.4-4.4 9.8-9.8 9.8c-5.1 0-9.3-3.9-9.8-9L127.9 14.6C127.2 6.3 120.3 0 112 0s-15.2 6.3-15.9 14.6L83.7 151c-.5 5.1-4.7 9-9.8 9c-5.4 0-9.8-4.4-9.8-9.8V16zm48.3 152l-.3 0-.3 0 .3-.7 .3 .7z" /></svg>EatCom</h2>
                                    </div>
                                    <div className="d-flex justify-content-around align-items-center mixingAce">
                                        <div className="d-flex align-items-center edgeAce"><svg className="me-3" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" /></svg><p className="m-0">18 Tam Trinh, Ha Noi, Viet Nam</p></div>
                                        <a className="footerTel2" href={"+012 345 67890"}><p className="mb-2"><svg className="me-3" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M280 0C408.1 0 512 103.9 512 232c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-101.6-82.4-184-184-184c-13.3 0-24-10.7-24-24s10.7-24 24-24zm8 192a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm-32-72c0-13.3 10.7-24 24-24c75.1 0 136 60.9 136 136c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-48.6-39.4-88-88-88c-13.3 0-24-10.7-24-24zM117.5 1.4c19.4-5.3 39.7 4.6 47.4 23.2l40 96c6.8 16.3 2.1 35.2-11.6 46.3L144 207.3c33.3 70.4 90.3 127.4 160.7 160.7L345 318.7c11.2-13.7 30-18.4 46.3-11.6l96 40c18.6 7.7 28.5 28 23.2 47.4l-24 88C481.8 499.9 466 512 448 512C200.6 512 0 311.4 0 64C0 46 12.1 30.2 29.5 25.4l88-24z" /></svg>+012 345 67890</p></a>
                                    </div>
                                </li> */}
                                <table className="table table-bordered solotable m-0">
                                    <thead className="thead-dark">
                                        <tr style={{ color: "#0F172B", backgroundColor: "gray" }}>
                                            <th style={{ width: "10%", textAlign: "center", color: "#fff" }}>No</th>
                                            <th style={{ width: "55%", color: "#fff" }}>Name</th>
                                            <th style={{ width: "15%", textAlign: "center", color: "#fff" }}>Quantity</th>
                                            <th style={{ width: "20%", textAlign: "center", color: "#fff" }}>Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {locationMap.map((i, index) => {
                                            return (
                                                mero(i, index)
                                            )
                                        })}
                                        <tr style={{ textAlign: "center", fontWeight: "bold" }}>
                                            <td colSpan={3}>Fulltotal</td>
                                            <td style={{ color: "#FEA116" }}>{VND.format(total2)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <h4 className="mt-3">Payment</h4>
                                <div className="d-block mb-1">
                                    <div className="custom-control custom-radio">
                                        <input onInput={() => setCheckoutState({ Card: true })} id="credit" name="paymentMethod" type="radio" className="custom-control-input" required />
                                        <label className="custom-control-label" htmlFor="credit"> E-wallet</label>
                                    </div>
                                    <div className="custom-control custom-radio">
                                        <input onInput={() => setCheckoutState({ Card: false })} id="debit" name="paymentMethod" type="radio" className="custom-control-input" required />
                                        <label className="custom-control-label" htmlFor="debit"> COD</label>
                                    </div>
                                </div>
                                {checkoutState.Card ? (
                                    <>
                                        <div className="d-flex" style={{ gap: 15 + "px" }}>
                                            <button className="buttonAtm" type="button" onClick={() => setCheckoutState({ vnpay: true, paypal: false })}><img alt="" height={30} width={90} src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR-1.png" /></button>
                                            <button className="buttonAtm" type="button" onClick={() => setCheckoutState({ vnpay: false, paypal: true })}><img alt="" height={30} width={90} src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/PayPal_logo.svg/2560px-PayPal_logo.svg.png" /></button>
                                        </div>
                                        {checkoutState.checkCardReal ? (
                                            <p className="m-0 text-danger pt-2">Payment method is needed!</p>
                                        ) : null}
                                        {checkoutState.vnpay ? (
                                            <select onChange={(e) => setCheckoutState({ bankCode: e.target.value })} name="bankcode" id="bankcode" className="form-control bg-white mt-4" required>
                                                <option value="">Không chọn</option>
                                                {checkoutState.bankList?.map((j) => {
                                                    return (
                                                        <option key={j.id} value={j.code}>{j.shortName}</option>
                                                    )
                                                })}
                                            </select>
                                        ) : null}
                                    </>
                                ) : null}
                            </ul>
                            {checkoutState.paypal ? null : (
                                <button style={checkoutState.phonenumber !== "" && !checkPhone.test(checkoutState.phonenumber) ? { opacity: 0.5, pointerEvents: "none" } : null} className="btn btn-primary w-100 p-2 resCheckoutB" type="submit">Confirm</button>
                            )}
                            {checkoutState.paypal ? (
                                <div className="mt-4 resCheckoutB">
                                    <PayPalButton
                                        amount={fulltotal / 25000}
                                        // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                                        onSuccess={(details) => {
                                            setCheckoutState({ paypalState: details.status })
                                        }}
                                        onError={(err) => {
                                            console.log(err);
                                        }}
                                    />
                                </div>
                            ) : null}
                        </div>
                        <div className="takeFirstUI">
                            <h4 className="mb-3">Address</h4>
                            <div className="needs-validation" id="checkoutForm">
                                {token ? null : (
                                    <>
                                        <div className="row">
                                            <div className="col-md-6 mb-3 inputC">
                                                <label htmlFor="firstName">First name</label>
                                                <input onInput={(e) => setCheckoutState({ Firstname: e.target.value })} type="text" className="form-control" id="firstName" placeholder="John" required />
                                            </div>
                                            <div className="col-md-6 mb-3 inputC">
                                                <label htmlFor="lastName">Last name</label>
                                                <input onInput={(e) => setCheckoutState({ Lastname: e.target.value })} type="text" className="form-control" id="lastName" placeholder="Doe" required />
                                            </div>
                                        </div>
                                        <div className="mb-3 inputC">
                                            <label htmlFor="email">Phone Number</label>
                                            <input type="number" name="phonenumber" value={checkoutState.phonenumber} onInput={(e) => setCheckoutState({ phonenumber: e.target.value })} className="form-control" id="email" placeholder="0123456789" required />
                                            {checkoutState.phonenumber !== "" && !checkPhone.test(checkoutState.phonenumber) ? (
                                                <p className="text-danger">Phone number invalid!</p>
                                            ) : null}
                                        </div>
                                    </>
                                )}
                                {candecode?.userRole === 1.5 ? (
                                    <div className="mb-3 inputC">
                                        <label htmlFor="email">Phone Number</label>
                                        <input type="number" name="phonenumber" value={checkoutState.phonenumber} onInput={(e) => setCheckoutState({ phonenumber: e.target.value })} className="form-control" id="email" placeholder="0123456789" required />
                                        {checkoutState.phonenumber !== "" && !checkPhone.test(checkoutState.phonenumber) ? (
                                            <p className="text-danger">Phone number invalid!</p>
                                        ) : null}
                                    </div>
                                ) : null}

                                {checkoutState.AccountAddress ? (
                                    <div className="mb-3">
                                        <label htmlFor="address">Address</label><br />
                                        <select name="address" onChange={(e) => setCheckoutState({ address: e.target.value })} className="selectA" id="address" required>
                                            <option selected disabled hidden>Select your address</option>
                                            {Object.values(checkoutState.LoadAddress).map((i) => {
                                                return (
                                                    <Fragment key={i._id}>
                                                        {i.address.map((a) => {
                                                            return (
                                                                <Fragment key={a}>
                                                                    <option value={a}>{a}</option>
                                                                </Fragment>
                                                            )
                                                        })}
                                                    </Fragment>
                                                )
                                            })}
                                        </select>
                                    </div>
                                ) : (
                                    <div className="mb-3 inputC">
                                        <label htmlFor="address">Address</label>
                                        <input type="text" name="address" value={checkoutState.address} onChange={(e) => setCheckoutState({ address: e.target.value })} className="form-control" id="address" placeholder="123 - Ha Noi - Vietnam" required />
                                        {checkoutState.addressWrong ? (
                                            <p className="text-danger">Address invalid, We only deliver within Hanoi !</p>
                                        ) : null}
                                    </div>
                                )}

                                {token && candecode?.userRole !== 1.5 ? (
                                    <>
                                        {checkoutState.SaveAddress ? (
                                            <div style={{ pointerEvents: "none", opacity: 0.4 }} className="custom-control custom-checkbox">
                                                <input onClick={(e) => handleCheckbox(e)} type="checkbox" className="custom-control-input" id="same-address" />
                                                <label className="custom-control-label" htmlFor="same-address"> Use the account address</label>
                                            </div>
                                        ) : (
                                            <div className="custom-control custom-checkbox">
                                                <input onClick={(e) => handleCheckbox(e)} type="checkbox" className="custom-control-input" id="same-address" />
                                                <label className="custom-control-label" htmlFor="same-address"> Use the account address</label>
                                            </div>
                                        )}
                                        {checkoutState.AccountAddress ? (
                                            <div style={{ pointerEvents: "none", opacity: 0.4 }} className="custom-control custom-checkbox">
                                                <input onInput={(e) => handleCheckbox2(e)} type="checkbox" className="custom-control-input" id="save-address" />
                                                <label className="custom-control-label" htmlFor="save-address"> Save this address</label>
                                            </div>
                                        ) : (
                                            <div className="custom-control custom-checkbox">
                                                <input onInput={(e) => handleCheckbox2(e)} type="checkbox" className="custom-control-input" id="save-address" />
                                                <label className="custom-control-label" htmlFor="save-address"> Save this address</label>
                                            </div>
                                        )}
                                        <hr className="mb-4" />
                                    </>
                                ) : null}
                                {checkoutState.paypal ? null : (
                                    <button style={checkoutState.phonenumber !== "" && !checkPhone.test(checkoutState.phonenumber) ? { opacity: 0.5, pointerEvents: "none" } : null} className="btn btn-primary w-100 p-2 resCheckoutB2 mt-4" type="submit">Confirm</button>
                                )}
                                {checkoutState.paypal ? (
                                    <div className="mt-4 resCheckoutB2 w-100">
                                        <PayPalButton
                                            ty
                                            amount={fulltotal / 25000}
                                            // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                                            onSuccess={(details) => {
                                                setCheckoutState({ paypalState: details.status })
                                            }}
                                            onError={(err) => {
                                                console.log(err);
                                            }}
                                        />
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        {checkoutState.loadBit ? (
                            <div id="spinner" className="show position-absolute translate-middle top-100 start-50 d-flex align-items-center justify-content-center">
                                <div className="spinner-border text-primary" style={{ width: 3 + "rem", height: 3 + "rem" }} role="status">
                                    <span className="sr-only"></span>
                                </div>
                            </div>
                        ) : null}
                    </form>
                </div>
            </div>
        </Layout>
    )
}
export default Checkout;