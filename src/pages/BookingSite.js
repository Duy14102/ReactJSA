import Reservation from "../component/Reservation";
import { NavLink } from "react-router-dom";
import Header from "../component/Header";
import Footer from "../component/Footer";
import "../css/style.css";

function BookingSite() {
    document.title = "EatCom - Booking";
    return (
        <>

            <Header />

            <div className="py-5 hero-header mb-5">
                <div className="container text-center my-5 pt-5 pb-4">
                    <h1 className="display-3 text-white mb-3 animated slideInDown">Booking</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb align-items-center justify-content-center text-uppercase">
                            <li className="breadcrumb-item"><NavLink to="/" className="nav-item nav-link active">Home</NavLink></li>
                            <li className="breadcrumb-item text-white active" aria-current="page">Booking</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <Reservation />

            <Footer />

        </>
    );
}
export default BookingSite;