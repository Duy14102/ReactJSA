import { NavLink } from "react-router-dom";
import Footer from "../component/Footer";
import Header from "../component/Header";
import NotFound from "../component/outOfBorder/NotFound";
import '../css/Cart.css'

function OrderComplete() {
    function goAway() {
        localStorage.clear()
        window.location.href = "/";
    }

    setTimeout(() => {
        goAway()
    }, 30000);

    const ahoe = localStorage.getItem("complete")
    if (!ahoe) {
        return NotFound()
    }
    return (
        <>
            <Header />

            <div style={{ height: 45 + "vh" }}>
                <div className="container text-center">
                    <div className="py-5 businessWay">
                        <NavLink to="/Cart"> Shopping Cart</NavLink> ˃ <NavLink to="/CheckOut">Checkout Details</NavLink> ˃ <NavLink to="/OrderComplete">Order Complete</NavLink>
                    </div>
                    <h2 className="thankYou" data-text="Thankyou!">Thankyou!</h2>
                    <p>Your Order #Id : {ahoe}</p>
                    <NavLink to="/" className="returnP">Return to homepage</NavLink>
                </div>
            </div>

            <Footer />
        </>
    )
}
export default OrderComplete;