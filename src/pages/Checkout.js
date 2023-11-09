import { NavLink, useLocation } from "react-router-dom";
import NotFound from "../component/outOfBorder/NotFound";
import '../css/Category.css'
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import jwtDecode from "jwt-decode";
import Layout from "../Layout";

function Checkout() {
    var paymentmethod = 0
    const orderitems = []
    const havePhone = []
    const user = []
    const ahoe = localStorage.getItem("complete")
    const [Card, setCard] = useState(false)
    const [SaveAddress, setSaveAddress] = useState(false)
    const [AccountAddress, setAccountAddress] = useState(false)
    const [Firstname, setFirstname] = useState("")
    const [Lastname, setLastname] = useState("")
    const [phonenumber, setPhonenumber] = useState("")
    const [address, setAddress] = useState("")
    const [bankCode, setBankCode] = useState()
    const [FullnameToken, setFullnameToken] = useState("")
    const [LoadAddress, setLoadAddress] = useState([])
    var fullname = ""
    let location = useLocation()
    const cookies = new Cookies();
    const token = cookies.get("TOKEN");
    havePhone.push(address)

    useEffect(() => {
        const getDetailUser = () => {
            const decoded = jwtDecode(token);
            const configuration = {
                method: "get",
                url: "http://localhost:3000/GetDetailUser",
                params: {
                    userid: decoded.userId
                }
            };
            axios(configuration)
                .then((result) => {
                    setLoadAddress(result.data)
                })
                .catch((error) => {
                    console.log(error);
                });
        }

        if (AccountAddress) {
            getDetailUser()
        }
        if (token) {
            getDetailUser()
        }
    }, [AccountAddress, token])


    useEffect(() => {
        let pro = ""
        let pre = ""
        Object.values(LoadAddress).map((k) => {
            pro = k.fullname
            pre = k.phonenumber
            return (
                null
            )
        })
        setFullnameToken(pro)
        setPhonenumber(pre)
    }, [LoadAddress])

    if (token) {
        const decode3 = jwtDecode(token)
        fullname = FullnameToken
        const nit = { id: decode3.userId, fullname: fullname }
        user.push(nit)
    } else {
        fullname = Firstname + " " + Lastname
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
    const shippingfee = location.state.shippingFee
    var total2 = 0
    var fulltotal = 0

    const mero = (i) => {
        var total = i.quantity * i.data.foodprice
        total2 += total
        fulltotal = total2 + shippingfee
        const allpush = { data: i.data, quantity: i.quantity }
        orderitems.push(allpush)
        return (
            <li key={i.data._id} className="list-group-item d-flex justify-content-between lh-condensed">
                <div>
                    <div style={{ gap: 13 + "%" }} className="d-flex justify-content-between align-items-center">
                        <div className="d-flex">
                            <p>{i.quantity} </p>
                            <p>x</p>
                        </div>
                        <div>
                            <h6 className="my-0 text-nowrap">{i.data.foodname}</h6>
                            <small className="text-muted">{i.data.foodcategory}</small>
                        </div>
                    </div>
                </div>
                <span className="text-muted">{VND.format(i.data.foodprice)}</span>
            </li>
        )
    }

    const VnpayCheckout = (data) => {
        const configuration = {
            method: "post",
            url: "http://localhost:3000/VnpayCheckout",
            data: {
                amount: fulltotal,
                bankCode: bankCode,
                orderId: data
            }
        }
        axios(configuration)
            .then((res) => {
                localStorage.setItem("complete", data)
                window.location.href = `${res.data}`
            })
            .catch((err) => console.log(err))
    }

    if (Card) {
        paymentmethod = 1
    } else {
        paymentmethod = 2
    }
    const handleSubmit = (e) => {
        // prevent the form from refreshing the whole page
        e.preventDefault();
        const configuration = {
            method: "post",
            url: "http://localhost:3000/UploadOrder",
            data: {
                user,
                phonenumber,
                address,
                paymentmethod,
                shippingfee,
                orderitems
            }
        }
        axios(configuration)
            .then((result) => {
                if (SaveAddress) {
                    const decode = jwtDecode(token);
                    const configuration = {
                        method: "post",
                        url: "http://localhost:3000/AddAddressUser",
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
                const data = result.data.message
                window.history.replaceState({}, document.title)
                localStorage.clear()
                if (Card) {
                    VnpayCheckout(data)
                } else {
                    localStorage.setItem("complete", data)
                    window.location.href = "/OrderComplete";
                }
            })
            .catch((e) => {
                console.log(e);
            });
    }

    const handleCheckbox = (e) => {
        if (e.target.checked) {
            setAccountAddress(true)
        } else if (!e.target.checked) {
            setAccountAddress(false)
        }
    }

    const handleCheckbox2 = (e) => {
        if (e.target.checked) {
            setSaveAddress(true)
        } else if (!e.target.checked) {
            setSaveAddress(false)
        }
    }

    return (
        <Layout>
            <div className="bg-white">
                <div className="container">
                    <div className="py-5 text-center businessWay">
                        <NavLink className="joiboy" to="/Cart"> Shopping Cart</NavLink> <span className='slash'>˃</span> <NavLink className="joiboy" to="/Checkout" >Checkout Details</NavLink> <span className='slash'>˃</span> {ahoe ? (<NavLink className="joiboy" to="/">Order Complete</NavLink>) : (<NavLink className="joiboy" style={{ pointerEvents: "none" }} to="/">Order Complete</NavLink>)}
                    </div>

                    <div className="flexAble2">
                        <div className="takeFirstUI">
                            <h4 className="mb-3">Address</h4>
                            <form onSubmit={(e) => handleSubmit(e)} className="needs-validation">
                                {token ? null : (
                                    <>
                                        <div className="row">
                                            <div className="col-md-6 mb-3 inputC">
                                                <label htmlFor="firstName">First name</label>
                                                <input onInput={(e) => setFirstname(e.target.value)} type="text" className="form-control" id="firstName" placeholder="John" required />
                                                <div className="invalid-feedback">
                                                    Valid first name is required.
                                                </div>
                                            </div>
                                            <div className="col-md-6 mb-3 inputC">
                                                <label htmlFor="lastName">Last name</label>
                                                <input onInput={(e) => setLastname(e.target.value)} type="text" className="form-control" id="lastName" placeholder="Doe" required />
                                                <div className="invalid-feedback">
                                                    Valid last name is required.
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-3 inputC">
                                            <label htmlFor="email">Phone Number</label>
                                            <input type="number" name="phonenumber" value={phonenumber} onChange={(e) => setPhonenumber(e.target.value)} className="form-control" id="email" placeholder="0123456789" />
                                            <div className="invalid-feedback">
                                                Please enter a valid email address for shipping updates.
                                            </div>
                                        </div>
                                    </>
                                )}

                                {AccountAddress ? (
                                    <div className="mb-3">
                                        <label htmlFor="address">Address</label><br />
                                        <select name="address" onChange={(e) => setAddress(e.target.value)} className="selectA" id="address" required>
                                            <option selected disabled hidden>Select your address</option>
                                            {Object.values(LoadAddress).map((i) => {
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
                                        <input type="text" name="address" value={address} onChange={(e) => setAddress(e.target.value)} className="form-control" id="address" placeholder="123 - Ha Noi - Vietnam" required />
                                        <div className="invalid-feedback">
                                            Please enter your shipping address.
                                        </div>
                                    </div>
                                )}

                                {token ? (
                                    <>
                                        {SaveAddress ? (
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
                                        {AccountAddress ? (
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
                                <h4 className="mb-3">Payment</h4>
                                <div className="d-block my-3">
                                    <div className="custom-control custom-radio">
                                        <input onInput={() => setCard(true)} id="credit" name="paymentMethod" type="radio" className="custom-control-input" required />
                                        <label className="custom-control-label" htmlFor="credit"> ATM</label>
                                    </div>
                                    <div className="custom-control custom-radio">
                                        <input onInput={() => setCard(false)} id="debit" name="paymentMethod" type="radio" className="custom-control-input" required />
                                        <label className="custom-control-label" htmlFor="debit"> COD</label>
                                    </div>
                                </div>
                                {Card ? (
                                    <>
                                        <select onChange={(e) => setBankCode(e.target.value)} name="bankcode" id="bankcode" class="form-control bg-white" required>
                                            <option value="">Không chọn </option>
                                            <option value="MBAPP">Ung dung MobileBanking</option>
                                            <option value="VNPAYQR">VNPAYQR</option>
                                            <option value="VNBANK">LOCAL BANK</option>
                                            <option value="IB">INTERNET BANKING</option>
                                            <option value="ATM">ATM CARD</option>
                                            <option value="INTCARD">INTERNATIONAL CARD</option>
                                            <option value="VISA">VISA</option>
                                            <option value="MASTERCARD"> MASTERCARD</option>
                                            <option value="JCB">JCB</option>
                                            <option value="UPI">UPI</option>
                                            <option value="VIB">VIB</option>
                                            <option value="VIETCAPITALBANK">VIETCAPITALBANK</option>
                                            <option value="SCB">Ngan hang SCB</option>
                                            <option value="NCB">Ngan hang NCB</option>
                                            <option value="SACOMBANK">Ngan hang SacomBank  </option>
                                            <option value="EXIMBANK">Ngan hang EximBank </option>
                                            <option value="MSBANK">Ngan hang MSBANK </option>
                                            <option value="NAMABANK">Ngan hang NamABank </option>
                                            <option value="VNMART"> Vi dien tu VnMart</option>
                                            <option value="VIETINBANK">Ngan hang Vietinbank  </option>
                                            <option value="VIETCOMBANK">Ngan hang VCB </option>
                                            <option value="HDBANK">Ngan hang HDBank</option>
                                            <option value="DONGABANK">Ngan hang Dong A</option>
                                            <option value="TPBANK">Ngân hàng TPBank </option>
                                            <option value="OJB">Ngân hàng OceanBank</option>
                                            <option value="BIDV">Ngân hàng BIDV </option>
                                            <option value="TECHCOMBANK">Ngân hàng Techcombank </option>
                                            <option value="VPBANK">Ngan hang VPBank </option>
                                            <option value="AGRIBANK">Ngan hang Agribank </option>
                                            <option value="MBBANK">Ngan hang MBBank </option>
                                            <option value="ACB">Ngan hang ACB </option>
                                            <option value="OCB">Ngan hang OCB </option>
                                            <option value="IVB">Ngan hang IVB </option>
                                            <option value="SHB">Ngan hang SHB </option>
                                            <option value="APPLEPAY">Apple Pay </option>
                                        </select>
                                    </>
                                ) : null}
                                <button className="btn btn-primary my-4" type="submit">Confirm</button>
                                <hr className="mb-4" />
                            </form>
                        </div>
                        <div className="takeSecondUI">
                            <h4 className="d-flex justify-content-between align-items-center mb-3">
                                <span className="text-muted">Your cart</span>
                                <span className="badge badge-secondary badge-pill">3</span>
                            </h4>
                            <ul className="list-group mb-3">
                                {locationMap.map((i) => {
                                    return (
                                        mero(i)
                                    )
                                })}
                                <li className="list-group-item d-flex justify-content-between">
                                    <span>Total</span>
                                    <span className="text-muted">{VND.format(total2)}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <span>Shipping</span>
                                    <span className="text-muted">{VND.format(shippingfee)}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <span>Fulltotal</span>
                                    <strong>{VND.format(fulltotal)}</strong>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
export default Checkout;