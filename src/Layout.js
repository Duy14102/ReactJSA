import { useState, useEffect } from "react"
import Footer from "./component/Footer"
import Header from "./component/Header"
import axios from "axios"
import WOW from 'wowjs';
import Backtotop from "./component/outOfBorder/Backtotop";
import "./css/Admin.css";
import "./css/style.css";
import "./css/Cart.css";
import "./css/Category.css";
import "./css/DetailMenuPage.css";
import "./css/main.css";
import "./css/NotFound.css";
import "./css/util.css";
import "./css/bootstrap.min.css";
import "./lib/animate/animate.min.css";
import "./lib/tempusdominus/css/tempusdominus-bootstrap-4.min.css";

function Layout({ children }) {
    const [styleA, setStyleA] = useState()

    useEffect(() => {
        new WOW.WOW({
            live: false
        }).init();
    }, [])

    useEffect(() => {
        const configuration = {
            method: "get",
            url: "http://localhost:3000/GetHeroUI",
            params: {
                name: "bghero"
            }
        }
        axios(configuration)
            .then((res) => {
                setStyleA({
                    "background": `linear-gradient(rgba(15, 23, 43, .9), rgba(15, 23, 43, .9)), url(${res.data.data})`,
                    "backgroundPosition": "center center",
                    "backgroundRepeat": "no-repeat",
                    "backgroundSize": "cover",
                    "backgroundAttachment": "fixed"
                })
            }).catch((err) => {
                console.log(err);
            })
    }, [])
    return (
        <>
            <div className="container-fluid p-0" style={styleA}>
                <Header />
                <main>{children}</main>
                <Footer />
                <Backtotop />
            </div>
        </>
    )
}
export default Layout