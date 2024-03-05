import { NavLink } from "react-router-dom";
import { useEffect, useReducer, useState, Fragment } from "react";
import Layout from "../Layout";
import "../css/Cart.css";
import "../css/DetailMenuPage.css";
import Header from "../component/Header";
import Modal from 'react-modal';
import ToppingCart from "../component/outOfBorder/ToppingCart";
import { PayPalButton } from "react-paypal-button-v2";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";

function Cart() {
    var paymentmethod = 0
    var fullname = ""
    const orderitems = []
    const havePhone = []
    const user = []
    const ahoe = localStorage.getItem("complete")
    const [meat, setMeat] = useState(true)
    const [vege, setVege] = useState(false)
    const [drink, setDrink] = useState(false)
    const cookies = new Cookies();
    var candecode = null
    const token = cookies.get("TOKEN");
    if (token) {
        candecode = jwtDecode(token)
    }
    const [cartState, setCartState] = useReducer((prev, next) => ({
        ...prev, ...next
    }), {
        checkVal: false,
        successCart: false,
        failedCart: false,
        appearSuccess: false,
        AccountAddress: false,
        SaveAddress: false,
        checkCardReal: false,
        appearFail: false,
        wantEdit: null,
        paypalState: null,
        openModal: false,
        Card: false,
        vnpay: false,
        paypal: false,
        bankCode: null,
        Cart: [],
        LoadAddress: [],
        checkCoupon: "",
        Fullname: "",
        FullnameToken: "",
        Phonenumber: "",
        Address: "",
    })
    havePhone.push(cartState.Address)
    useEffect(() => {
        dataHandler()
        if (!localStorage.getItem("shippingFee")) {
            localStorage.setItem("shippingFee", 30000)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    //Call bank list api
    useEffect(() => {
        if (cartState.vnpay) {
            const configurationX = {
                method: "get",
                url: "https://api.vietqr.io/v2/banks"
            }
            axios(configurationX)
                .then((res) => {
                    setCartState({ bankList: res.data.data })
                }).catch((er) => {
                    console.log(er);
                })
        }
    }, [cartState.vnpay])

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
                    setCartState({ LoadAddress: result.data })
                })
                .catch((error) => {
                    console.log(error);
                });
        }

        if (cartState.AccountAddress) {
            getDetailUser()
        }
        if (token && candecode?.userRole !== 1.5) {
            getDetailUser()
        }
    }, [cartState.AccountAddress, token, candecode?.userRole])

    useEffect(() => {
        let pre = ""
        Object.values(cartState.LoadAddress).map((k) => {
            pre = k.phonenumber
            return null
        })
        setCartState({ FullnameToken: candecode?.userName })
        setCartState({ Phonenumber: pre })
    }, [cartState.LoadAddress, candecode?.userName])

    useEffect(() => {
        if (cartState.paypalState === "COMPLETED") {
            const configuration = {
                method: "post",
                url: "https://eatcom.onrender.com/UploadOrder",
                data: {
                    user: user,
                    phonenumber: cartState.Phonenumber,
                    address: cartState.Address,
                    paymentmethod,
                    shippingfee: parseInt(localStorage.getItem("shippingFee")),
                    orderitems
                }
            }
            axios(configuration)
                .then((result) => {
                    if (cartState.SaveAddress) {
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
                    localStorage.removeItem("cart")
                    paypalCheckout(data)
                })
                .catch((e) => {
                    console.log(e);
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cartState.paypalState])

    if (token) {
        const decode3 = jwtDecode(token)
        fullname = cartState.FullnameToken
        const nit = { id: decode3.userId, fullname: fullname }
        user.push(nit)
    } else {
        fullname = cartState.Fullname
        const nat = { id: "none", fullname: fullname }
        user.push(nat)
    }

    const VnpayCheckout = (data) => {
        const configuration = {
            method: "post",
            url: "https://eatcom.onrender.com/VnpayCheckout",
            data: {
                amount: fulltotal,
                bankCode: cartState.bankCode,
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
        if (cartState.Card && cartState.paypalState) {
            window.location.href = `/OrderComplete?status=${cartState.paypalState}`;
        }
    }

    const dataHandler = async () => {
        const val = JSON.parse(localStorage.getItem('cart'))
        let nameCount = []
        let overCount = []
        if (val && val.length > 0) {
            for (var i = 0; i < val.length; i++) {
                var fort = { name: val[i].name, quantity: val[i].quantity, topping: val[i].topping };
                nameCount.push(fort)
            }
            for (const arrist of nameCount) {
                const data = JSON.stringify(arrist.topping)
                const res = await fetch(`https://eatcom.onrender.com/GetCartItem?name=${arrist.name}&quantity=${arrist.quantity}&id=${data}`)
                const resD = await res.json()
                overCount.push(resD)
            }
            setCartState({ Cart: overCount })
        } else {
            localStorage.removeItem("cart")
            setCartState({ checkVal: true })
        }
    }

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    function changeInput(e, name, maxQ) {
        var value = parseInt(e.target.value)
        var stored2 = JSON.parse(localStorage.getItem("cart"));
        if (stored2) {
            for (var k = 0; k < stored2.length; k++) {
                if (name === stored2[k].name) {
                    if (value > maxQ || value < 1) {
                        setCartState({ failedCart: true, successCart: false })
                    } else if (value < maxQ && value >= 1) {
                        setCartState({ successCart: true, failedCart: false })
                        stored2[k].quantity = value
                        localStorage.setItem("cart", JSON.stringify(stored2));
                    }
                }
            }
        }
    }

    var fulltotal = 0, inTotal = 0, enTotal = 0, totalX = 0
    const mero = (i, e, index, topping, dataX) => {
        var countTotal = 0
        const dataToPush = { data: i, quantity: e, topping: topping }
        orderitems.push(dataToPush)
        inTotal = topping?.reduce((acc, o) => acc + parseInt(o.foodprice), 0)
        enTotal = dataX.reduce((acc, o) => acc + parseInt(o.foodprice), 0)
        if (inTotal) {
            countTotal = (inTotal + enTotal) * e
        } else {
            countTotal = enTotal * e
        }

        totalX += countTotal
        fulltotal = totalX + parseInt(localStorage.getItem("shippingFee"))
        return (
            <tr key={index}>
                <td className="text-center">
                    {cartState.openModal ? (
                        <button className="Tyach" onClick={() => setCartState({ wantEdit: null, openModal: false })}>
                            <svg fill="#666565" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" /></svg>
                        </button>
                    ) : (
                        <button className="Tyach" onClick={() => setCartState({ wantEdit: index, openModal: true })}>
                            <svg fill="#666565" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" /></svg>
                        </button>
                    )}
                </td>
                <td>
                    <div className="d-flex align-items-center" style={{ gap: 10 }}>
                        <img alt="" src={i.foodimage} width={70} height={60} />
                        <div>
                            <p className="m-0">{i.foodname}</p>
                            <p className="m-0 text-start" style={{ fontSize: 14, color: "#FEA116" }}><b>{VND.format(i.foodprice)}</b></p>
                        </div>
                    </div>
                    {topping?.map((p) => {
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
                <td style={{ textAlign: "center" }} className="thhuhu">{VND.format(inTotal ? inTotal + enTotal : enTotal)}</td>
                <td style={{ textAlign: "center" }}><input style={{ width: 70 + "%", textAlign: "center" }} id="edValue" type="number" min={1} max={i.foodquantity} defaultValue={e} onInput={(e) => changeInput(e, i.foodname, i.foodquantity)} /></td>
                <td style={{ textAlign: "center" }} className="thhuhu">{VND.format(countTotal)}</td>
            </tr>
        )
    }

    function updateXCart() {
        if (cartState.failedCart) {
            setCartState({ appearFail: true, failedCart: false })
            dataHandler()
        }
        if (cartState.successCart) {
            setCartState({ appearSuccess: true, successCart: false })
            dataHandler()
        }
    }

    useEffect(() => {
        if (cartState.appearSuccess) {
            setTimeout(() => {
                setCartState({ appearSuccess: false })
            }, 2000);
        }
        if (cartState.appearFail) {
            setTimeout(() => {
                setCartState({ appearFail: false })
            }, 2000);
        }
    }, [cartState.appearSuccess, cartState.appearFail])

    function applyCoupon(e) {
        e.preventDefault()
        if (cartState.checkCoupon === "duydeptrai") {
            localStorage.setItem("shippingFee", 0)
            setCartState({ appearSuccess: true })
        }
    }

    const handleCheckbox = (e) => {
        if (e.target.checked) {
            setCartState({ AccountAddress: true })
        } else if (!e.target.checked) {
            setCartState({ AccountAddress: false })
        }
    }

    const handleCheckbox2 = (e) => {
        if (e.target.checked) {
            setCartState({ SaveAddress: true })
        } else if (!e.target.checked) {
            setCartState({ SaveAddress: false })
        }
    }

    if (cartState.Card) {
        paymentmethod = 1
    } else {
        paymentmethod = 2
    }
    const handleSubmit = (e) => {
        // prevent the form from refreshing the whole page
        e.preventDefault();
        const configuration = {
            method: "post",
            url: "https://eatcom.onrender.com/UploadOrder",
            data: {
                user: user,
                phonenumber: cartState.Phonenumber,
                address: cartState.Address,
                paymentmethod,
                shippingfee: parseInt(localStorage.getItem("shippingFee")),
                orderitems
            }
        }
        if (cartState.Card) {
            if (!cartState.vnpay && !cartState.paypal) {
                setCartState({ checkCardReal: true })
                return false
            }
        }
        axios(configuration)
            .then((result) => {
                if (cartState.SaveAddress) {
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
                localStorage.removeItem("cart")
                if (cartState.Card && cartState.vnpay) {
                    VnpayCheckout(data)
                } else {
                    localStorage.setItem("complete", JSON.stringify(data))
                    window.location.href = "/OrderComplete";
                }
            })
            .catch((e) => {
                console.log(e);
            });
    }

    return (
        <Layout>
            <Header type={"Yes"} />
            {cartState.appearSuccess || cartState.appearFail ? (
                <div className="danguru">
                    <div className={cartState.appearSuccess ? 'alertNow' : cartState.appearFail ? 'alertNow2' : null}>
                        <div className='kikuny'>
                            {cartState.appearFail ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                            ) : cartState.appearSuccess ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" /></svg>
                            ) : null}
                        </div>
                        <div className='d-flex' style={{ flexDirection: "column", marginRight: 25 }}>
                            <p className='m-0'><b>{cartState.appearSuccess ? "Success" : cartState.appearFail ? "Failed" : null}</b></p>
                            <p className='m-0'>{cartState.appearSuccess ? "Cart updated successfully!" : cartState.appearFail ? "Cart update failed!" : null}</p>
                        </div>
                        {cartState.appearSuccess ? (
                            <button onClick={() => setCartState({ appearSuccess: false })} className='closeAlertKikuny'></button>
                        ) : cartState.appearFail ? (
                            <button onClick={() => setCartState({ appearFail: false })} className='closeAlertKikuny'></button>
                        ) : null}
                    </div>
                </div>
            ) : null}
            <div className="bg-white">
                <div className="container">
                    <div className="pt-4 text-center businessWay">
                        <NavLink className="joiboy" to="/Cart">Shopping Cart</NavLink> <span className='slash'>˃</span> <NavLink style={ahoe ? null : { pointerEvents: "none" }} className="joiboy" to="/OrderComplete">Complete</NavLink>
                    </div>
                    {cartState.checkVal ? (
                        <div style={{ height: 45 + "vh" }} className="pt-4 pb-4 text-center">
                            <p>There's no items in cart</p>
                            <NavLink to="/" className="ReturnH"><b>Return to homepage</b></NavLink>
                        </div>
                    ) : (
                        <div className="flexAble pt-4 pb-4">
                            <div className="Numberone">
                                <table className="table table-bordered solotable m-0">
                                    <thead className="thead-dark">
                                        <tr style={{ color: "#0F172B", backgroundColor: "gray" }}>
                                            <th colSpan={2} style={{ textAlign: "center", color: "#fff" }}>Items</th>
                                            <th style={{ textAlign: "center", color: "#fff" }}>Price</th>
                                            <th style={{ textAlign: "center", color: "#fff" }}>Amount</th>
                                            <th style={{ textAlign: "center", color: "#fff" }}>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ verticalAlign: "middle" }}>
                                        {cartState.Cart.map((i, index) => {
                                            return (
                                                mero(...i.data, i.quantity, index, i.topping, i.data)
                                            )
                                        })}
                                        <tr className="text-center">
                                            <td colSpan={4}><b>Fulltotal</b></td>
                                            <td style={{ color: "#FEA116" }}><b>{VND.format(fulltotal)}</b></td>
                                        </tr>
                                    </tbody>
                                </table>
                                {parseInt(localStorage.getItem("shippingFee")) === 30000 ? (
                                    <p style={{ margin: 0, fontSize: 14 }}>This price has already contain <b>{VND.format(parseInt(localStorage.getItem("shippingFee")))}</b> shipping fee !</p>
                                ) : null}
                                <div className="d-flex align-items-center justify-content-between mt-3">
                                    <div className="buttonN1">
                                        <NavLink reloadDocument to="/CategorySite/Menu/nto" className="btnFirst text-nowrap p-2">← Continue Shoppping</NavLink>
                                        <button onClick={() => updateXCart()} className="btnSecond text-nowrap">Update Cart</button>
                                    </div>
                                    {parseInt(localStorage.getItem("shippingFee")) === 30000 ? (
                                        <div className="inputC">
                                            <form onSubmit={(e) => applyCoupon(e)} className="d-flex" style={{ gap: 7 }}>
                                                <input className="p-2" onInput={(e) => setCartState({ checkCoupon: e.target.value })} type="text" placeholder="🏷️ Coupon Code...." required />
                                                <button type="submit" className="btnCoupon SwitchInBtnCoupon">✔</button>
                                            </form>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                            <div className="Numbertwo">
                                <table className="table m-0 table-bordered">
                                    <thead className="thead-dark">
                                        <tr style={{ color: "#0F172B", backgroundColor: "gray", border: "none" }}>
                                            <th colSpan={2} style={{ textAlign: "center", color: "#fff", border: "none" }}>Information</th>
                                        </tr>
                                    </thead>
                                </table>
                                <form className="needThisTable" onSubmit={(e) => handleSubmit(e)}>
                                    {token ? null : (
                                        <>
                                            <div className="mb-3 inputC">
                                                <label htmlFor="firstName">Fullname</label>
                                                <input onInput={(e) => setCartState({ Fullname: e.target.value })} type="text" className="form-control" id="Fullname" required />
                                            </div>
                                            <div className="mb-3 inputC">
                                                <label htmlFor="phonenumber">Phone Number</label>
                                                <input value={cartState.Phonenumber} onInput={(e) => setCartState({ Phonenumber: e.target.value })} type="number" name="phonenumber" className="form-control" id="phonenumber" required />
                                            </div>
                                        </>
                                    )}
                                    {candecode?.userRole === 1.5 ? (
                                        <div className="mb-3 inputC">
                                            <label htmlFor="phonenumber">Phone Number</label>
                                            <input value={cartState.Phonenumber} onInput={(e) => setCartState({ Phonenumber: e.target.value })} type="number" name="phonenumber" className="form-control" id="phonenumber" required />
                                        </div>
                                    ) : null}
                                    <div className="mb-3">
                                        {cartState.AccountAddress ? (
                                            <div className="inputC">
                                                <label htmlFor="address">Address</label><br />
                                                <select name="address" onChange={(e) => setCartState({ Address: e.target.value })} className="selectA" id="address" required>
                                                    <option selected disabled hidden>Select your address</option>
                                                    {Object.values(cartState.LoadAddress).map((i) => {
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
                                            <div className="inputC">
                                                <label htmlFor="address">Address</label>
                                                <textarea value={cartState.Address} onChange={(e) => setCartState({ Address: e.target.value })} type="text" name="address" className="form-control" id="address" required />
                                            </div>
                                        )}
                                    </div>
                                    {token && candecode?.userRole !== 1.5 ? (
                                        <div className="mb-3">
                                            {cartState.SaveAddress ? (
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
                                            {cartState.AccountAddress ? (
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
                                        </div>
                                    ) : null}
                                    <div className="d-flex align-items-center justify-content-evenly mb-3">
                                        <div className="custom-control custom-radio">
                                            <input onInput={() => setCartState({ Card: true })} id="credit" name="paymentMethod" type="radio" className="custom-control-input" required />
                                            <label className="custom-control-label" htmlFor="credit"> ATM</label>
                                        </div>
                                        <div className="custom-control custom-radio">
                                            <input onInput={() => setCartState({ Card: false })} id="debit" name="paymentMethod" type="radio" className="custom-control-input" required />
                                            <label className="custom-control-label" htmlFor="debit"> COD</label>
                                        </div>
                                    </div>
                                    {cartState.Card ? (
                                        <div className="mb-3">
                                            <div className="d-flex align-items-center justify-content-evenly">
                                                <button className="buttonAtm" type="button" onClick={() => setCartState({ vnpay: true, paypal: false })}><img alt="" height={30} width={90} src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR-1.png" /></button>
                                                <button className="buttonAtm" type="button" onClick={() => setCartState({ vnpay: false, paypal: true })}><img alt="" height={30} width={90} src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/PayPal_logo.svg/2560px-PayPal_logo.svg.png" /></button>
                                            </div>
                                            {cartState.checkCardReal ? (
                                                <p className="m-0 text-danger pt-2">Payment method is needed!</p>
                                            ) : null}
                                            {cartState.vnpay ? (
                                                <select onChange={(e) => setCartState({ bankCode: e.target.value })} name="bankcode" id="bankcode" className="form-control bg-white mt-4" required>
                                                    <option value="">Not choosing</option>
                                                    {cartState.bankList?.map((j) => {
                                                        return (
                                                            <option key={j.id} value={j.code}>{j.shortName}</option>
                                                        )
                                                    })}
                                                </select>
                                            ) : null}
                                        </div>
                                    ) : null}
                                    {cartState.paypal ? (
                                        <PayPalButton
                                            amount={fulltotal / 25000}
                                            // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                                            onSuccess={(details) => {
                                                setCartState({ paypalState: details.status })
                                            }}
                                            onError={(err) => {
                                                console.log(err);
                                            }}
                                        />
                                    ) : (
                                        <button className="btnCheckout" type="submit"><b>Checkout</b></button>
                                    )}
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Modal
                isOpen={cartState.openModal} onRequestClose={() => setCartState({ wantEdit: null, openModal: false })} ariaHideApp={false}
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
                        width: "500px",
                        height: "auto",
                        zIndex: 999,
                        overflow: "hidden"
                    },
                }}>
                <div className="buhhuh2 py-3" style={{ width: "100%", height: "100%" }}>
                    <div className="product-info-tabs">
                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                            <li className="nav-item">
                                <button style={{ marginBottom: -2 }} className="active activeThis nav-link" id="description-tab">Topping</button>
                            </li>
                        </ul>
                    </div>
                    <div className='conquerLeft2'>
                        <button style={{ backgroundColor: meat ? "#959595" : null, color: meat ? "#fff" : "#6d6f71" }} onClick={() => { setMeat(true); setVege(false); setDrink(false) }}>Meat</button>
                        <button style={{ backgroundColor: vege ? "#959595" : null, color: vege ? "#fff" : "#6d6f71" }} onClick={() => { setVege(true); setMeat(false); setDrink(false) }}>Vegetables</button>
                        <button style={{ backgroundColor: drink ? "#959595" : null, color: drink ? "#fff" : "#6d6f71" }} onClick={() => { setDrink(true); setMeat(false); setVege(false) }}>Drink</button>
                    </div>
                    <div className='conquerRight2'>
                        <div className='py-3'>
                            {meat ? (
                                <ToppingCart cate={"Meat"} indexMain={cartState.wantEdit} />
                            ) : vege ? (
                                <ToppingCart cate={"Vegetables"} indexMain={cartState.wantEdit} />
                            ) : drink ? (
                                <ToppingCart cate={"Drink"} indexMain={cartState.wantEdit} />
                            ) : null}
                        </div>
                    </div>
                </div>
                <button style={{ right: 10 }} onClick={() => setCartState({ wantEdit: null, openModal: false })} className='closeAlertKikuny'></button>
            </Modal>
        </Layout>
    )
}
export default Cart;