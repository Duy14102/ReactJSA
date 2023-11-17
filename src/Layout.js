import { useState, useEffect } from "react"
import Footer from "./component/Footer"
import Header from "./component/Header"
import axios from "axios"
import WOW from 'wowjs';
import Backtotop from "./component/outOfBorder/Backtotop";
import "./css/style.css";
import "./css/bootstrap.min.css";
import "./lib/animate/animate.min.css";

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
    }, { passive: true })

    window.addEventListener('online', e => {
        setOffline(false)
        setOnline(true)
    }, { passive: true })

    useEffect(() => {
        if (online) {
            setTimeout(() => {
                setOnline(false)
            }, 3000)
        }
    }, [online])

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
                {offline ? (
                    <div className="connectNow">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 280"><rect height={200} width={200} fill="none" /><line x1="48" y1="40" x2="208" y2="216" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="24" /><path d="M25,98.2A147.2,147.2,0,0,1,72.4,66.9" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="24" /><path d="M59,132.1A98.3,98.3,0,0,1,108,106" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="24" /><path d="M92.9,166.1a50.9,50.9,0,0,1,67.6-2.4" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="24" /><path d="M117,56.4c3.6-.3,7.3-.4,11-.4A145.6,145.6,0,0,1,230.9,98.2" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="24" /><path d="M167.8,112.3A99.2,99.2,0,0,1,197,132.1" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="24" /><circle cx="128" cy="200" r="16" /></svg>
                        <p className="m-0 text-black">You are offline.</p>
                        <button onClick={() => reloadIt()} className="reLive">Refresh</button>
                        <h4 onClick={() => setOffline(false)} className="returnX m-0">⨯</h4>
                    </div>
                ) : null}
                {online ? (
                    <div className="connectNow">
                        <svg style={{ fill: "#36D744" }} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 550"><path d="M54.2 202.9C123.2 136.7 216.8 96 320 96s196.8 40.7 265.8 106.9c12.8 12.2 33 11.8 45.2-.9s11.8-33-.9-45.2C549.7 79.5 440.4 32 320 32S90.3 79.5 9.8 156.7C-2.9 169-3.3 189.2 8.9 202s32.5 13.2 45.2 .9zM320 256c56.8 0 108.6 21.1 148.2 56c13.3 11.7 33.5 10.4 45.2-2.8s10.4-33.5-2.8-45.2C459.8 219.2 393 192 320 192s-139.8 27.2-190.5 72c-13.3 11.7-14.5 31.9-2.8 45.2s31.9 14.5 45.2 2.8c39.5-34.9 91.3-56 148.2-56zm64 160a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z" /></svg>
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