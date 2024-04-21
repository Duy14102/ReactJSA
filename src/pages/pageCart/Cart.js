import { NavLink } from "react-router-dom";
import { useEffect, useReducer, useState } from "react";
import Layout from "../../Layout";
import "../../css/Cart.css";
import "../../css/DetailMenuPage.css";
import Header from "../../component/Header";
import Modal from 'react-modal';
import ToppingCart from "../../component/outOfBorder/ToppingCart";

function Cart() {
    const [meat, setMeat] = useState(true)
    const [vege, setVege] = useState(false)
    const [drink, setDrink] = useState(false)
    const ahoe = localStorage.getItem("complete")
    const [cartState, setCartState] = useReducer((prev, next) => ({
        ...prev, ...next
    }), {
        checkVal: false,
        successCart: false,
        failedCart: false,
        appearSuccess: false,
        appearFail: false,
        wantEdit: null,
        Cart: [],
        checkCoupon: "",
    })
    const pushData = []
    useEffect(() => {
        dataHandler()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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

    function plusX(index, maxQ) {
        var stored2 = JSON.parse(localStorage.getItem("cart"));
        if (stored2) {
            for (var k = 0; k < stored2.length; k++) {
                if (k === index) {
                    stored2[k].quantity++
                    if (stored2[k].quantity > maxQ) {
                        setCartState({ failedCart: true, successCart: false })
                    } else if (stored2[k].quantity <= maxQ) {
                        localStorage.setItem("cart", JSON.stringify(stored2));
                        dataHandler()
                        setCartState({ appearSuccess: true, successCart: false })
                    }
                }
            }
        }
    }

    function minusX(index) {
        var stored2 = JSON.parse(localStorage.getItem("cart"));
        if (stored2) {
            for (var k = 0; k < stored2.length; k++) {
                if (k === index) {
                    stored2[k].quantity--
                    if (stored2[k].quantity < 1) {
                        setCartState({ failedCart: true, successCart: false })
                    } else if (stored2[k].quantity >= 1) {
                        localStorage.setItem("cart", JSON.stringify(stored2));
                        dataHandler()
                        setCartState({ appearSuccess: true, successCart: false })
                    }
                }
            }
        }
    }

    var inTotal = 0, enTotal = 0, totalX = 0
    const mero = (i, e, index, topping, dataX) => {
        var countTotal = 0
        const dataToPush = { data: i, quantity: e, topping: topping }
        pushData.push(dataToPush)
        inTotal = topping?.reduce((acc, o) => acc + parseInt(o.foodprice), 0)
        enTotal = dataX.reduce((acc, o) => acc + parseInt(o.foodprice), 0)
        if (inTotal) {
            countTotal = (inTotal + enTotal) * e
        } else {
            countTotal = enTotal * e
        }

        totalX += countTotal
        return (
            <tr key={index}>
                <td className="text-center" style={{ width: window.innerWidth > 575 ? null : "10%" }}>
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
                <td colSpan={window.innerWidth > 575 ? null : 3}>
                    <div className="d-flex align-items-center" style={{ gap: 10 }}>
                        <img alt="" src={i.foodimage} width={70} height={60} />
                        <div>
                            <p className="m-0" style={{ fontSize: 17 }}>{i.foodname}</p>
                            <p className="m-0 text-start" style={{ fontSize: 15, color: "#FEA116" }}><b>{VND.format(i.foodprice)}</b></p>
                        </div>
                    </div>
                    {topping?.map((p) => {
                        return (
                            <div key={p._id} className="d-flex align-items-center" style={{ gap: 10, marginLeft: 25, marginTop: 10 }}>
                                <img alt="" src={p.foodimage} width={45} height={40} />
                                <div>
                                    <p className="m-0" style={{ fontSize: 15 }}>{p.foodname}</p>
                                    <p className="m-0 text-start" style={{ color: "#FEA116", fontSize: 13 }}><b>{VND.format(p.foodprice)}</b></p>
                                </div>
                            </div>
                        )
                    })}
                    {window.innerWidth > 575 ? null : (
                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <div className="Loppel" style={{ justifyContent: "flex-start", height: 30, width: 130 }}>
                                <button onClick={() => minusX(index)} style={{ fontSize: 16 }}>-</button>
                                <input id="edValue" type="number" min={1} max={i.foodquantity} value={e} readOnly />
                                <button onClick={() => plusX(index, i.foodquantity)} style={{ fontSize: 16 }}>+</button>
                            </div>
                            <p className="m-0">{VND.format(inTotal ? inTotal + enTotal : enTotal)}</p>
                        </div>
                    )}
                </td>
                {window.innerWidth > 575 ? (
                    <>
                        <td style={{ textAlign: "center", fontSize: 17 }}>{VND.format(inTotal ? inTotal + enTotal : enTotal)}</td>
                        <td style={{ textAlign: "center" }}>
                            <div className="Loppel">
                                <button onClick={() => minusX(index)}>-</button>
                                <input id="edValue" type="number" min={1} max={i.foodquantity} value={e} readOnly />
                                <button onClick={() => plusX(index, i.foodquantity)}>+</button>
                            </div>
                        </td>
                        <td style={{ textAlign: "center", fontSize: 17 }}>{VND.format(countTotal)}</td>
                    </>
                ) : null}
            </tr>
        )
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
                        <NavLink className="joiboy" to="/Cart">Shopping Cart</NavLink> <span className='slash'>˃</span> <NavLink className="joiboy" to="/Checkout" state={{ valid: pushData }}>Checkout Details</NavLink> <span className='slash'>˃</span> <NavLink style={ahoe ? null : { pointerEvents: "none" }} className="joiboy" to="/OrderComplete">Complete</NavLink>
                    </div>
                    {cartState.checkVal ? (
                        <div style={{ height: 45 + "vh" }} className="pt-4 pb-4 text-center">
                            <p>There's no items in cart</p>
                            <NavLink to="/" className="ReturnH"><b>Return to homepage</b></NavLink>
                        </div>
                    ) : (
                        <div className="pt-4 pb-4">
                            <table className="table table-bordered solotable m-0">
                                <thead className="thead-dark">
                                    <tr style={{ color: "#0F172B", backgroundColor: "gray", fontSize: 17 }}>
                                        <th colSpan={window.innerWidth > 575 ? 2 : 4} style={{ textAlign: "center", color: "#fff" }}>Items</th>
                                        {window.innerWidth > 575 ? (
                                            <>
                                                <th style={{ textAlign: "center", color: "#fff" }}>Price</th>
                                                <th style={{ textAlign: "center", color: "#fff" }}>Amount</th>
                                                <th style={{ textAlign: "center", color: "#fff" }}>Total</th>
                                            </>
                                        ) : null}
                                    </tr>
                                </thead>
                                <tbody style={{ verticalAlign: "middle" }}>
                                    {cartState.Cart.map((i, index) => {
                                        return (
                                            mero(...i.data, i.quantity, index, i.topping, i.data)
                                        )
                                    })}
                                    <tr className="text-center text-nowrap" style={{ fontSize: 17 }}>
                                        <td colSpan={window.innerWidth > 575 ? 4 : 3}><b>Fulltotal</b></td>
                                        <td style={{ color: "#FEA116" }}><b>{VND.format(totalX)}</b></td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="d-flex align-items-center justify-content-end mt-3">
                                <NavLink to="/Checkout" state={{ valid: pushData }} className="btnCheckout"><b>Checkout</b></NavLink>
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
                        width: window.innerWidth > 575 ? "500px" : "95vw",
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