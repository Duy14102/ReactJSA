import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "../Layout";

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
        var value = e.target.value
        var min = e.target.attributes.min.value
        var max = e.target.attributes.max.value
        if (value <= min) {
            value = min
        } else if (value >= max) {
            value = max
        }
        var stored2 = JSON.parse(localStorage.getItem("cart"));
        if (stored2) {
            for (var k = 0; k < stored2.length; k++) {
                if (name === stored2[k].name) {
                    stored2[k].quantity = value
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
                <td className="Xtd"><button title="Delete item" onClick={() => removeItem(i.foodname)} className="insideXtd">×</button></td>
                <td style={{ width: 10 + "%" }}><img alt="" src={i.foodimage} width={70} height={60} /></td>
                <td>{i.foodname}<span className="jackass"><br />{VND.format(i.foodprice)}</span></td>
                <td className="thhuhu">{VND.format(i.foodprice)}</td>
                <td><input style={{ width: 100 + "%" }} id="edValue" type="number" min={1} max={i.foodquantity} defaultValue={e} onInput={(e) => changeInput(e, i.foodname)} /></td>
                <td className="thhuhu">{VND.format(total)}</td>
            </tr>
        )

    }

    function applyCoupon(e) {
        e.preventDefault()
        if (checkCoupon === "duydeptrai") {
            setShippingFee(0)
        }
    }

    return (
        <Layout>
            <div className="bg-white">
                <div className="container">
                    <div className="py-5 text-center businessWay">
                        <NavLink className="joiboy" to="/Cart"> Shopping Cart</NavLink>  <span className='slash'>˃</span> <NavLink className="joiboy" to="/Checkout" state={{ valid: pushData, shippingFee: shippingFee }}>Checkout Details</NavLink> <span className='slash'>˃</span> {ahoe ? (<NavLink className="joiboy" to="/">Order Complete</NavLink>) : (<NavLink className="joiboy" style={{ pointerEvents: "none" }} to="/">Order Complete</NavLink>)}
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
                                            <th className="thhuhu">Price</th>
                                            <th style={{ width: 10 + "%" }}>Amount</th>
                                            <th className="thhuhu">Total</th>
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
                                            <NavLink to="/Checkout" state={{ valid: pushData, shippingFee: shippingFee }} className="btnCheckout"><b>Checkout</b></NavLink>
                                            <p className="pt-3" style={{ margin: 0 }}> <i className="fi fi-sr-tags"></i> Coupon</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2} className="inputC">
                                            <form onSubmit={(e) => applyCoupon(e)}>
                                                <input onInput={(e) => setCheckCoupon(e.target.value)} type="text" placeholder="Coupon Code...." required />
                                                <div className="text-center pt-3">
                                                    <button type="submit" className="btnCoupon">Apply</button>
                                                </div>
                                            </form>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    )
}
export default Cart;