import { NavLink } from "react-router-dom";
import { useEffect, useReducer } from "react";
import Layout from "../Layout";
import "../css/Cart.css";
import Header from "../component/Header";

function Cart() {
    const ahoe = localStorage.getItem("complete")
    const [cartState, setCartState] = useReducer((prev, next) => ({
        ...prev, ...next
    }), {
        checkVal: false,
        successCart: false,
        failedCart: false,
        appearSuccess: false,
        appearFail: false,
        Cart: [],
        checkCoupon: "",
    })
    const pushData = []
    useEffect(() => {
        dataHandler()
        if (!localStorage.getItem("shippingFee")) {
            localStorage.setItem("shippingFee", 30000)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const dataHandler = async () => {
        const val = JSON.parse(localStorage.getItem('cart'))
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
            setCartState({ Cart: overCount })
        } else {
            localStorage.clear()
            setCartState({ checkVal: true })
        }
    }

    function removeItem(e) {
        var stored = JSON.parse(localStorage.getItem("cart"));
        if (stored) {
            for (var j = 0; j < stored.length; j++) {
                if (stored[j].name === e) {
                    stored.splice(j, 1);
                    localStorage.setItem("cart", JSON.stringify(stored));
                    setCartState({ appearSuccess: true })
                    dataHandler()
                }
            }
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
                    } else if (value < maxQ && value > 1) {
                        setCartState({ successCart: true, failedCart: false })
                        stored2[k].quantity = value
                        localStorage.setItem("cart", JSON.stringify(stored2));
                    }
                }
            }
        }
    }

    var fulltotal = 0
    var total2 = 0
    const mero = (i, e) => {
        var total = i.foodprice * e
        total2 += total
        fulltotal = total2 + parseInt(localStorage.getItem("shippingFee"))
        const dataToPush = { data: i, quantity: e }
        pushData.push(dataToPush)
        return (
            <tr key={i._id}>
                <td className="Xtd"><button title="Delete item" onClick={() => removeItem(i.foodname)} className="insideXtd">×</button></td>
                <td style={{ width: 10 + "%" }}><img alt="" src={i.foodimage} width={70} height={60} /></td>
                <td>{i.foodname}<span className="jackass"><br />{VND.format(i.foodprice)}</span></td>
                <td className="thhuhu">{VND.format(i.foodprice)}</td>
                <td><input style={{ width: 100 + "%" }} id="edValue" type="number" min={1} max={i.foodquantity} defaultValue={e} onInput={(e) => changeInput(e, i.foodname, i.foodquantity)} /></td>
                <td className="thhuhu">{VND.format(total)}</td>
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
                    <div className="py-5 text-center businessWay">
                        <NavLink className="joiboy" to="/Cart"> Shopping Cart</NavLink>  <span className='slash'>˃</span> <NavLink className="joiboy" to="/Checkout" state={{ valid: pushData }}>Checkout Details</NavLink> <span className='slash'>˃</span> {ahoe ? (<NavLink className="joiboy" to="/">Order Complete</NavLink>) : (<NavLink className="joiboy" style={{ pointerEvents: "none" }} to="/">Order Complete</NavLink>)}
                    </div>
                    {cartState.checkVal ? (
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
                                        {cartState.Cart.map((i) => {
                                            return (
                                                mero(...i.data, i.quantity)
                                            )
                                        })}
                                    </tbody>
                                </table>
                                <div className="buttonN1">
                                    <NavLink reloadDocument to="/" className="btnFirst">← Continue Shoppping</NavLink>
                                    <button onClick={() => updateXCart()} className="btnSecond">Update Cart</button>
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
                                        <td className="text-end">{VND.format(total2)}</td>
                                    </tr>
                                    <tr>
                                        <td>Shipping</td>
                                        <td className="text-end">{VND.format(parseInt(localStorage.getItem("shippingFee")))}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Full Total</b></td>
                                        <td className="text-end">{VND.format(fulltotal)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2}>
                                            <NavLink to="/Checkout" state={{ valid: pushData }} className="btnCheckout"><b>Checkout</b></NavLink>
                                            {parseInt(localStorage.getItem("shippingFee")) === 30000 ? (
                                                <p className="pt-3" style={{ margin: 0 }}> <svg style={{ fill: "#777" }} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M0 80V229.5c0 17 6.7 33.3 18.7 45.3l176 176c25 25 65.5 25 90.5 0L418.7 317.3c25-25 25-65.5 0-90.5l-176-176c-12-12-28.3-18.7-45.3-18.7H48C21.5 32 0 53.5 0 80zm112 32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" /></svg> Coupon</p>
                                            ) : null}
                                        </td>
                                    </tr>
                                    {parseInt(localStorage.getItem("shippingFee")) === 30000 ? (
                                        <tr>
                                            <td colSpan={2} className="inputC">
                                                <form onSubmit={(e) => applyCoupon(e)}>
                                                    <input onInput={(e) => setCartState({ checkCoupon: e.target.value })} type="text" placeholder="Coupon Code...." required />
                                                    <div className="text-center pt-3">
                                                        <button type="submit" className="btnCoupon">Apply</button>
                                                    </div>
                                                </form>
                                            </td>
                                        </tr>
                                    ) : null}
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