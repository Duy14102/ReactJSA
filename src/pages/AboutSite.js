import About from "../component/About";
import Team from "../component/Team";
import { Link } from "react-router-dom";
import Header from "../component/Header";
import Footer from "../component/Footer";
import "../css/style.css";
function AboutSite() {
    document.title = "EatCom - About";
    return (
        <>
            <Header />

            <div className="py-5 bg-dark hero-header mb-5">
                <div className="container text-center my-5 pt-5 pb-4">
                    <h1 className="display-3 text-white mb-3 animated slideInDown">About Us</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb align-items-center justify-content-center text-uppercase">
                            <li className="breadcrumb-item"><Link to="/" className="nav-item nav-link active">Home</Link></li>
                            <li className="breadcrumb-item text-white active" aria-current="page">About</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <About />

            <Team />

            <Footer />
        </>
    );
}
export default AboutSite;