import { NavLink } from "react-router-dom"
import Footer from "../component/Footer"
import Header from "../component/Header"
import AnnounceMe from "../component/AnnounceMe"

function Announcement() {
    return (
        <>
            <Header />

            <div className="py-5 hero-header mb-5">
                <div className="container text-center my-5 pt-5 pb-4">
                    <h1 className="display-3 text-white mb-3 animated slideInDown">Announcement</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb align-items-center justify-content-center text-uppercase">
                            <li className="breadcrumb-item"><NavLink reloadDocument to="/" className="nav-item nav-link active">Home</NavLink></li>
                            <li className="breadcrumb-item text-white active" aria-current="page">Announcement</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="bg-white p-5">
                <AnnounceMe />
            </div>

            <Footer />
        </>
    )
}
export default Announcement