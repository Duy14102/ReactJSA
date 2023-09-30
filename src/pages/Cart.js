import { NavLink } from "react-router-dom";
import Footer from "../component/Footer";
import Header from "../component/Header";
import '../css/Cart.css'
import { useState, useEffect } from "react";

function Cart() {
    const val = JSON.parse(localStorage.getItem('cart'))
    const [Cart, setCart] = useState([])
    useEffect(() => {
        dataHandler()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const dataHandler = async () => {
        let nameCount = []
        let overCount = []
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
    }

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    var fulltotal = 0
    const mero = (i, e) => {
        var total = i.foodprice * e
        fulltotal += total
        return (
            <tr key={i._id}>
                <td className="Xtd">X</td>
                <td style={{ width: 10 + "%" }}><img alt="" src={i.foodimage} width={70} height={60} /></td>
                <td>{i.foodname}</td>
                <td>{VND.format(i.foodprice)}</td>
                <td><input type="number" defaultValue={e} /></td>
                <td>{VND.format(total)}</td>
            </tr>
        )
    }

    return (
        <>
            <Header />
            <div className="container">
                <div className="pt-3 needActive">
                    <NavLink reloadDocument className="cartNavLink" to="/">Home</NavLink> / <NavLink className="cartNavLink" reloadDocument to="/Cart"><b>Cart</b></NavLink>
                </div>
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
                            <button className="btnSecond">Update Cart</button>
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
                                <td className="text-right">{VND.format(fulltotal)}</td>
                            </tr>
                            <tr>
                                <td>Full Total</td>
                                <td className="text-right">{VND.format(fulltotal)}</td>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <div className="text-center">
                                        <button className="btnCheckout"><b>Checkout</b></button>
                                    </div>
                                    <p className="pt-3" style={{ margin: 0 }}> <i className="fa-solid fa-tag"></i> Coupon</p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2} className="inputC">
                                    <input type="text" placeholder="Coupon Code...." />
                                    <div className="text-center pt-3">
                                        <button className="btnCoupon">Apply</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <Footer />
        </>
    )
}
export default Cart;