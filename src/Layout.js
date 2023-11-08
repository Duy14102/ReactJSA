import { useState, useEffect } from "react"
import Footer from "./component/Footer"
import Header from "./component/Header"
import axios from "axios"
import WOW from 'wowjs';
import Backtotop from "./component/outOfBorder/Backtotop";
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
    const [offline, setOffline] = useState(false)
    const [online, setOnline] = useState(false)
    function reloadIt() {
        window.location.reload()
    }

    window.addEventListener('offline', e => {
        setOnline(false)
        setOffline(true)
    })

    window.addEventListener('online', e => {
        setOffline(false)
        setOnline(true)
    })

    useEffect(() => {
        new WOW.WOW({
            live: false
        }).init();
    }, [])

    useEffect(() => {
        if (online) {
            setTimeout(() => {
                setOnline(false)
            }, 3000)
        }
    }, [online])

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
                {offline ? (
                    <div className="connectNow">
                        <span className="w-100"><i className="fi fi-br-wifi-slash"></i></span>
                        <p className="m-0 text-black">You are offline.</p>
                        <button onClick={() => reloadIt()} className="reLive">Refresh</button>
                        <h4 onClick={() => setOffline(false)} className="returnX m-0">⨯</h4>
                    </div>
                ) : null}
                {online ? (
                    <div className="connectNow">
                        <span><i className="fi fi-br-wifi greenW"></i></span>
                        <p className="m-0 text-black">Updated the internet.</p>
                        <h4 onClick={() => setOnline(false)} className="returnX m-0">⨯</h4>
                    </div>
                ) : null}
                <Header />
                <main>{children}</main>
                <Footer />
                <Backtotop />
            </div>
        </>
    )
}
export default Layout