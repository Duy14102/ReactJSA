import axios from "axios";
import { useEffect, useState, lazy, Suspense, useRef } from "react";
import Spinner from "../Spinner";
import socketIOClient from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";
const HeroChange = lazy(() => import("../outOfBorder/HeroChange"))
const AboutChange = lazy(() => import("../outOfBorder/AboutChange"))
const MenuChange = lazy(() => import("../outOfBorder/MenuChange"))
const FooterChange = lazy(() => import("../outOfBorder/FooterChange"))

function MainUiux() {
    const [data, setData] = useState([])
    const cookies = new Cookies()
    const token = cookies.get("TOKEN")
    const decode = jwtDecode(token)
    const socketRef = useRef();

    const called = () => {
        const configuration = {
            method: "get",
            url: "https://eatcom.onrender.com/GetHeroManager",
        }
        axios(configuration)
            .then((res) => {
                setData(res.data.data);
            }).catch((err) => {
                console.log(err);
            })
    }
    useEffect(() => {
        document.getElementById("defaultOpen9").click();
        called()

        socketRef.current = socketIOClient.connect("https://eatcom.onrender.com")

        socketRef.current.on('ChangeHeroImageSuccess', dataGot => {
            if (dataGot.mag !== decode.userId) {
                called()
            }
        })

        socketRef.current.on('ChangeWordUpSuccess', dataGot => {
            if (dataGot.mag !== decode.userId) {
                called()
            }
        })

        socketRef.current.on('ChangeWordMiddleSuccess', dataGot => {
            if (dataGot.mag !== decode.userId) {
                called()
            }
        })

        socketRef.current.on('ChangeWordDownSuccess', dataGot => {
            if (dataGot.mag !== decode.userId) {
                called()
            }
        })

        socketRef.current.on('ChangeWordTimeSuccess', dataGot => {
            if (dataGot.mag !== decode.userId) {
                called()
            }
        })

        return () => {
            socketRef.current.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function openCity9(evt, cityName) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent9");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("MBbutton9");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active9", "");
        }
        document.getElementById(cityName).style.display = "block";
        evt.currentTarget.className += " active9";
    }
    return (
        <>
            <div className="myDIVdad">
                <div style={{ gap: 5 + "%" }} id="myDIV9" className="d-flex align-items-center">
                    <button id="defaultOpen9" className="MBbutton9 active9" onClick={(e) => openCity9(e, 'hero')}><p >Hero</p></button>
                    <button className="MBbutton9" onClick={(e) => openCity9(e, 'About')}><p>About</p></button>
                    <button className="MBbutton9" onClick={(e) => openCity9(e, 'Menu')}><p>Menu</p></button>
                    <button className="MBbutton9" onClick={(e) => openCity9(e, 'Footer')}><p>Footer</p></button>
                </div>
                <div className="d-none"></div>
            </div>
            <div id="hero" className="tabcontent9">
                <div className="pt-4">
                    <Suspense fallback={<Spinner />}>
                        <HeroChange data={data} decode={decode} />
                    </Suspense>
                </div>
            </div>

            <div id="About" className="tabcontent9">
                <div className="pt-4">
                    <Suspense fallback={<Spinner />}>
                        <AboutChange data={data} decode={decode} />
                    </Suspense>
                </div>
            </div>
            <div id="Menu" className="tabcontent9">
                <div className="pt-4">
                    <Suspense fallback={<Spinner />}>
                        <MenuChange data={data} decode={decode} />
                    </Suspense>
                </div>
            </div>
            <div id="Footer" className="tabcontent9">
                <div className="pt-4">
                    <Suspense fallback={<Spinner />}>
                        <FooterChange data={data} decode={decode} />
                    </Suspense>
                </div>
            </div>
        </>
    )
}
export default MainUiux