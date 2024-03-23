import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Spinner from '../src/component/Spinner'
const mainApp = lazy(() => import("./pages/App"))
const mainContact = lazy(() => import("./pages/ContactSite"))
const mainCategory = lazy(() => import("./pages/CategoryPage"))
const mainSearch = lazy(() => import("./pages/SearchSite"))
const mainBooking = lazy(() => import("./pages/BookingSite"))
const mainTrack = lazy(() => import("./pages/TrackOrder"))
const mainPnT = lazy(() => import("./pages/PrivacyAndTerm"))
const mainLogin = lazy(() => import("./pages/admin/LoginSite"))
const mainSignup = lazy(() => import("./pages/admin/Register"))
const mainCart = lazy(() => import("./pages/Cart"))
const mainCheckout = lazy(() => import("./pages/Checkout"))
const mainOrderComplete = lazy(() => import("./pages/OrderComplete"))
const mainDetail = lazy(() => import("./pages/DetailMenuPage"))
const mainQr = lazy(() => import("./pages/QrCodeTable"))
const mainNotFound = lazy(() => import("./component/outOfBorder/NotFound"))
const mainUserPanel = lazy(() => import("./pages/admin/UserPanel"))
const mainEmPanel = lazy(() => import("./pages/admin/EmployeePanel"))
const mainChefPanel = lazy(() => import("./pages/admin/ChefPanel"))
const mainAdminPanel = lazy(() => import("./pages/admin/AdminPanel"))
const mainManaPanel = lazy(() => import("./pages/admin/ManagerPanel"))
const mainAnnounce = lazy(() => import("./pages/Announcement"))

function Wrapped() {
    return (
        <Suspense fallback={<Spinner />}>
            <Routes>
                <Route path="/" Component={mainApp} />
                <Route path="ContactSite" Component={mainContact} />
                <Route path="CategorySite/:id/:fil" Component={mainCategory} />
                <Route path="SearchSite/:id/:cate/:fil" Component={mainSearch} />
                <Route path="BookingSite" Component={mainBooking} />
                <Route path="Announcement" Component={mainAnnounce} />
                <Route path="TrackOrder" Component={mainTrack} />
                <Route path="PAndT" Component={mainPnT} />
                <Route path="LoginSite" Component={mainLogin} />
                <Route path="SignupSite" Component={mainSignup} />
                <Route path="Cart" Component={mainCart} />
                <Route path="Checkout" Component={mainCheckout} />
                <Route path="OrderComplete" Component={mainOrderComplete} />
                <Route path="DetailMenuPage/:id/:cate" Component={mainDetail} />
                <Route path="QrCodeTable/:id/:qr/:cate/:fil" Component={mainQr} />
                <Route path="*" Component={mainNotFound} />
                <Route path="UserPanel/:id" Component={mainUserPanel} />
                <Route path="EmployeePanel" Component={mainEmPanel} />
                <Route path="ChefPanel" Component={mainChefPanel} />
                <Route path="AdminPanel" Component={mainAdminPanel} />
                <Route path="ManagerPanel" Component={mainManaPanel} />
            </Routes>
        </Suspense>
    );
}
export default Wrapped;