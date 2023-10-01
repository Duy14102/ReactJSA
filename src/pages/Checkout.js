import { NavLink, useLocation } from "react-router-dom";
import Footer from "../component/Footer";
import Header from "../component/Header";
import NotFound from "../component/outOfBorder/NotFound";
import '../css/Category.css'
import { useState } from "react";

function Checkout() {
    const [Card, setCard] = useState(false)
    let location = useLocation()
    if (!location.state) {
        return NotFound()
    } else if (location.state.fulltotal === 0) {
        return NotFound()
    }
    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    const locationMap = location.state.valid
    return (
        <>
            <Header />

            <div className="container">
                <div className="py-5 text-center businessWay">
                    <NavLink to="/Cart"> Shopping Cart</NavLink> ˃ <NavLink to="/Checkout" state={{ valid: location.state.data, fulltotal: location.state.fulltotal }}>Checkout Details</NavLink> ˃ <NavLink to="/">Order Complete</NavLink>
                </div>

                <div className="row pb-5">
                    <div className="col-md-4 order-md-2 mb-4">
                        <h4 className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-muted">Your cart</span>
                            <span className="badge badge-secondary badge-pill">3</span>
                        </h4>
                        <ul className="list-group mb-3">
                            {locationMap.map((i) => {
                                return (
                                    <li key={i.data._id} className="list-group-item d-flex justify-content-between lh-condensed">
                                        <div>
                                            <div style={{ gap: 13 + "%" }} className="d-flex justify-content-between align-items-center">
                                                <div className="d-flex">
                                                    <p>{i.quantity} </p>
                                                    <p>x</p>
                                                </div>
                                                <div>
                                                    <h6 className="my-0">{i.data.foodname}</h6>
                                                    <small className="text-muted">{i.data.foodcategory}</small>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-muted">{VND.format(i.data.foodprice)}</span>
                                    </li>
                                )
                            })}
                            <li className="list-group-item d-flex justify-content-between">
                                <span>Total (VND)</span>
                                <strong>{VND.format(location.state.fulltotal)}</strong>
                            </li>
                        </ul>
                    </div>
                    <div className="col-md-8 order-md-1">
                        <h4 className="mb-3">Address</h4>
                        <form className="needs-validation">
                            <div className="row">
                                <div className="col-md-6 mb-3 inputC">
                                    <label htmlFor="firstName">First name</label>
                                    <input type="text" className="form-control" id="firstName" placeholder="" value="" required />
                                    <div className="invalid-feedback">
                                        Valid first name is required.
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3 inputC">
                                    <label htmlFor="lastName">Last name</label>
                                    <input type="text" className="form-control" id="lastName" placeholder="" value="" required />
                                    <div className="invalid-feedback">
                                        Valid last name is required.
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3 inputC">
                                <label htmlFor="email">Email <span className="text-muted">(Optional)</span></label>
                                <input type="email" className="form-control" id="email" placeholder="you@example.com" />
                                <div className="invalid-feedback">
                                    Please enter a valid email address for shipping updates.
                                </div>
                            </div>

                            <div className="mb-3 inputC">
                                <label htmlFor="address">Address</label>
                                <input type="text" className="form-control" id="address" placeholder="1234 Main St" required />
                                <div className="invalid-feedback">
                                    Please enter your shipping address.
                                </div>
                            </div>

                            <div className="custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input" id="same-address" />
                                <label className="custom-control-label" htmlFor="same-address"> Use the account address</label>
                            </div>
                            <hr className="mb-4" />

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
                                    <div className="row">
                                        <div className="col-md-6 mb-3 inputC">
                                            <label htmlFor="cc-name">Name on card</label>
                                            <input type="text" className="form-control" id="cc-name" placeholder="" required />
                                            <div className="invalid-feedback">
                                                Name on card is required
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3 inputC">
                                            <label htmlFor="cc-number">Credit card number</label>
                                            <input type="text" className="form-control" id="cc-number" placeholder="" required />
                                            <div className="invalid-feedback">
                                                Credit card number is required
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-3 mb-3 inputC">
                                            <label htmlFor="cc-expiration">Expiration</label>
                                            <input type="text" className="form-control" id="cc-expiration" placeholder="" required />
                                            <div className="invalid-feedback">
                                                Expiration date required
                                            </div>
                                        </div>
                                        <div className="col-md-3 mb-3 inputC">
                                            <label htmlFor="cc-cvv">CVV</label>
                                            <input type="text" className="form-control" id="cc-cvv" placeholder="" required />
                                            <div className="invalid-feedback">
                                                Security code required
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : null}
                            <hr className="mb-4" />
                            <button className="btn btn-primary" type="submit">Confirm</button>
                        </form>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
}
export default Checkout;