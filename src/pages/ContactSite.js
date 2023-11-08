import { NavLink } from "react-router-dom";
import Contact from "../component/Contact";
import Layout from "../Layout";

function ContactSite() {
    document.title = "EatCom - About";
    return (
        <Layout>

            <div className="py-5 hero-header mb-5">
                <div className="container text-center my-5 pt-5 pb-4">
                    <h1 className="display-3 text-white mb-3 animated slideInDown">Contact</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb align-items-center justify-content-center text-uppercase">
                            <li className="breadcrumb-item"><NavLink reloadDocument to="/" className="nav-item nav-link active">Home</NavLink></li>
                            <li className="breadcrumb-item text-white active" aria-current="page">Contact</li>
                        </ol>
                    </nav>
                </div>
            </div>
            <div className="bg-white">
                <Contact />
            </div>

        </Layout>
    );
}
export default ContactSite;