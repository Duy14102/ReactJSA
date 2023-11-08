import { NavLink } from "react-router-dom";
import Tracking from "../component/Tracking";
import Layout from "../Layout";

function TrackOrder() {
    document.title = "EatCom - Contact";
    return (
        <Layout>

            <div className="py-5 hero-header mb-5">
                <div className="container text-center my-5 pt-5 pb-4">
                    <h1 className="display-3 text-white mb-3 animated slideInDown">Track Order</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb align-items-center justify-content-center text-uppercase">
                            <li className="breadcrumb-item"><NavLink reloadDocument to="/" className="nav-item nav-link active">Home</NavLink></li>
                            <li className="breadcrumb-item text-white active" aria-current="page">Track Order</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="bg-white p-5">
                <Tracking />
            </div>

        </Layout>
    );
}
export default TrackOrder;