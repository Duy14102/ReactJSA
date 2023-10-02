import { NavLink } from "react-router-dom";
import Footer from "../component/Footer";
import Header from "../component/Header";
import '../css/Cart.css'
import { useState, useEffect } from "react";

function Cart() {
    const val = JSON.parse(localStorage.getItem('cart'))
    const ahoe = localStorage.getItem("complete")
    const [checkVal, setCheckVal] = useState(false)
    const [Cart, setCart] = useState([])
    const [checkLoad, setCheckLoad] = useState(false)
    const [checkCoupon, setCheckCoupon] = useState("")
    const [shippingFee, setShippingFee] = useState(30000)
    const pushData = []
    useEffect(() => {
        dataHandler()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const dataHandler = async () => {
        let nameCount = []
        let overCount = []
        if (val && val.length > 0) {
            for (var i = 0; i < val.length; i++) {
                var fort = { name: val[i].name, quantity: val[i].quantity };
                nameCount.push(fort)
            }
            for (const arrist of nameCount) {
                const res = await fetch(`http://localhost:3000/GetCartItem?name=${arrist.name}&quantity=${arrist.quantity}`)
                const resD = await res.json()
                overCount.push(resD)
            }
            setCart(overCount)
        } else {
            localStorage.clear()
            setCheckVal(true)
        }
    }

    function removeItem(e) {
        var stored = JSON.parse(localStorage.getItem("cart"));
        if (stored) {
            for (var j = 0; j < stored.length; j++) {
                if (stored[j].name === e) {
                    stored.splice(j, 1);
                    localStorage.setItem("cart", JSON.stringify(stored));
                    window.location.reload()
                }
            }
        }
    }

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    function changeInput(e, name) {
        var stored2 = JSON.parse(localStorage.getItem("cart"));
        if (stored2) {
            for (var k = 0; k < stored2.length; k++) {
                if (name === stored2[k].name) {
                    stored2[k].quantity = e
                    localStorage.setItem("cart", JSON.stringify(stored2));
                }
            }
        }
    }

    useEffect(() => {
        if (checkLoad) {
            window.location.reload()
        }
    }, [checkLoad])

    var fulltotal = 0
    var total2 = 0
    const mero = (i, e) => {
        var total = i.foodprice * e
        total2 += total
        fulltotal = total2 + shippingFee
        const dataToPush = { data: i, quantity: e }
        pushData.push(dataToPush)
        return (
            <tr key={i._id}>
                <td className="Xtd"><button onClick={() => removeItem(i.foodname)} className="insideXtd">X</button></td>
                <td style={{ width: 10 + "%" }}><img alt="" src={i.foodimage} width={70} height={60} /></td>
                <td>{i.foodname}</td>
                <td>{VND.format(i.foodprice)}</td>
                <td><input style={{ width: 100 + "%" }} id="edValue" type="number" defaultValue={e} onInput={(e) => changeInput(e.target.value, i.foodname)} /></td>
                <td>{VND.format(total)}</td>
            </tr>
        )
    }

    function applyCoupon() {
        if (checkCoupon === "duydeptrai") {
            setShippingFee(0)
        }
    }

    return (
        <>
            <Header />
            <div className="container">
                <div className="py-5 text-center businessWay">
                    <NavLink to="/Cart"> Shopping Cart</NavLink> ˃ <NavLink to="/Checkout" state={{ valid: pushData, fulltotal: fulltotal }}>Checkout Details</NavLink> ˃ {ahoe ? (<NavLink to="/">Order Complete</NavLink>) : (<NavLink style={{ pointerEvents: "none" }} to="/">Order Complete</NavLink>)}
                </div>
                {checkVal ? (
                    <div style={{ height: 45 + "vh" }} className="pt-4 pb-4 text-center">
                        <p>There's no items in cart</p>
                        <NavLink to="/" className="ReturnH"><b>Return to homepage</b></NavLink>
                    </div>
                ) : (
                    <div className="flexAble pt-4 pb-4">
                        <div className="Numberone">
                            <table className="table CartTa" width="100%">
                                <thead>
                                    <tr>
                                        <th colSpan={3}>Items</th>
                                        <th>Price</th>
                                        <th style={{ width: 10 + "%" }}>Amount</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody style={{ verticalAlign: "middle" }}>
                                    {Cart.map((i) => {
                                        return (
                                            mero(...i.data, i.quantity)
                                        )
                                    })}
                                </tbody>
                            </table>
                            <div className="buttonN1">
                                <NavLink reloadDocument to="/" className="btnFirst">← Continue Shoppping</NavLink>
                                <button onClick={() => setCheckLoad(true)} className="btnSecond">Update Cart</button>
                            </div>
                        </div>
                        <table className="table CartTa Numbertwo">
                            <thead>
                                <tr>
                                    <th colSpan={2}>Cart Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Total</td>
                                    <td className="text-right">{VND.format(total2)}</td>
                                </tr>
                                <tr>
                                    <td>Shipping</td>
                                    <td className="text-right">{VND.format(shippingFee)}</td>
                                </tr>
                                <tr>
                                    <td>Full Total</td>
                                    <td className="text-right">{VND.format(fulltotal)}</td>
                                </tr>
                                <tr>
                                    <td colSpan={2}>
                                        <NavLink to="/Checkout" state={{ valid: pushData, fulltotal: fulltotal, shippingFee: shippingFee, total2: total2 }} className="btnCheckout"><b>Checkout</b></NavLink>
                                        <p className="pt-3" style={{ margin: 0 }}> <i className="fa-solid fa-tag"></i> Coupon</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={2} className="inputC">
                                        <input onInput={(e) => setCheckCoupon(e.target.value)} type="text" placeholder="Coupon Code...." />
                                        <div className="text-center pt-3">
                                            <button onClick={() => applyCoupon()} className="btnCoupon">Apply</button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Footer />
        </>
    )
}
export default Cart;