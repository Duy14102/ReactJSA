import PAndT from "../component/PAndT";
import { NavLink } from "react-router-dom";
import Layout from "../Layout";

function PrivacyAndTerm() {
    document.title = "EatCom - Privacy and policy || Term and conditions";
    return (
        <Layout>

            <div className="py-5 hero-header mb-5">
                <div className="container text-center my-5 pt-5 pb-4">
                    <h1 className="display-3 text-white mb-3 animated slideInDown">Privacy Policy<br /><hr />Terms & Condition</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb align-items-center justify-content-center text-uppercase">
                            <li className="breadcrumb-item"><NavLink reloadDocument to="/" className="nav-item nav-link active">Home</NavLink></li>
                            <li className="breadcrumb-item text-white active" aria-current="page">Privacy Policy || Terms & Condition</li>
                        </ol>
                    </nav>
                </div>
            </div>
            <div className="bg-white p-5">
                <PAndT />
            </div>

        </Layout>

    );
}
export default PrivacyAndTerm;