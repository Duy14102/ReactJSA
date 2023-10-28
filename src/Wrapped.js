import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import WOW from 'wowjs';
import LoginSite from "./pages/admin/LoginSite";
import SignupSite from "./pages/admin/Register";
import App from "./pages/App";
import BookingSite from "./pages/BookingSite";
import Backtotop from "./component/outOfBorder/Backtotop";
import PrivacyAndTerm from "./pages/PrivacyAndTerm";
import AdminPanel from "./pages/admin/AdminPanel";
import Spinner from "./component/Spinner";
import Cookies from "universal-cookie";
import NotFound from "./component/outOfBorder/NotFound";
import "./css/bootstrap.min.css";
import "./lib/animate/animate.min.css";
import "./lib/tempusdominus/css/tempusdominus-bootstrap-4.min.css";
import jwtDecode from "jwt-decode";
import DetailMenuPage from "./pages/DetailMenuPage";
import CategoryPage from "./pages/CategoryPage";
import SearchSite from "./pages/SearchSite";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderComplete from "./pages/OrderComplete";
import TrackOrder from "./pages/TrackOrder";
import ContactSite from "./pages/ContactSite";
import UserPanel from "./pages/admin/UserPanel";
import EmployeePanel from "./pages/admin/EmployeePanel";
import ManagerPanel from "./pages/admin/ManagerPanel";
import QrCodeTable from "./pages/QrCodeTable";

const cookies = new Cookies();
const token = cookies.get("TOKEN");
const PrivateRoute = ({ children }) => {
    if (token) {
        const decode = jwtDecode(token);
        switch (decode.userRole) {
            case 1:
                return children
            case 2:
                return children
            case 3:
                return children
            case 4:
                return children
            default:
                return NotFound()
        }
    } else {
        return NotFound();
    }
}

function Wrapped() {
    useEffect(() => {
        new WOW.WOW({
            live: false
        }).init();
    }, [])

    return (
        <>
            <div className="container-fluid bg-white theEndNear p-0">
                <Spinner />
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="ContactSite" element={<ContactSite />} />
                    <Route path="CategorySite/:id/:fil" element={<CategoryPage />} />
                    <Route path="SearchSite/:id/:fil" element={<SearchSite />} />
                    <Route path="BookingSite" element={<BookingSite />} />
                    <Route path="TrackOrder" element={<TrackOrder />} />
                    <Route path="PAndT" element={<PrivacyAndTerm />} />
                    <Route path="LoginSite" element={<LoginSite />} />
                    <Route path="SignupSite" element={<SignupSite />} />
                    <Route path="Cart" element={<Cart />} />
                    <Route path="Checkout" element={<Checkout />} />
                    <Route path="OrderComplete" element={<OrderComplete />} />
                    <Route path="DetailMenuPage/:id/:cate" element={<DetailMenuPage />} />
                    <Route path="QrCodeTable/:id/:qr/:cate/:fil" element={<QrCodeTable />} />
                    <Route path="*" element={<NotFound />} />
                    <Route path="UserPanel/:id" element={<PrivateRoute><UserPanel /></PrivateRoute>} />
                    <Route path="EmployeePanel" element={<PrivateRoute><EmployeePanel /></PrivateRoute>} />
                    <Route path="AdminPanel" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
                    <Route path="ManagerPanel" element={<PrivateRoute><ManagerPanel /></PrivateRoute>} />
                </Routes>
                <Backtotop />
            </div>
        </>
    );
}
export default Wrapped;