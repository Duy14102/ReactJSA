import HTMLReactParser from "html-react-parser";
import { NavLink } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import socketIOClient from "socket.io-client";

function HeroBanner() {
    var word1 = ""
    var word2 = ""
    var word3 = ""
    const [styleA, setStyleA] = useState()
    const [styleX, setStyleX] = useState()
    const [text, setText] = useState()
    const socketRef = useRef();

    const calledUI = () => {
        const configuration = {
            method: "get",
            url: "https://eatcom.onrender.com/GetHeroUI",
            params: {
                name: "oh2rwdomomeno4sgguhf"
            }
        }
        axios(configuration)
            .then((res) => {
                setStyleA(res.data.data)
            }).catch((err) => {
                console.log(err);
            })
    }

    const calledText = () => {
        calledUI()

        const configuration2 = {
            method: "get",
            url: "https://eatcom.onrender.com/GetHeroText",
        }
        axios(configuration2)
            .then((res) => {
                setText(res.data.data)
            }).catch((err) => {
                console.log(err);
            })
    }

    const calledBG = () => {
        const configuration = {
            method: "get",
            url: "https://eatcom.onrender.com/GetHeroUI",
            params: {
                name: "e4onxrx7hmgzmrbel9jk"
            }
        }
        axios(configuration)
            .then((res) => {
                setStyleX({
                    "background": `linear-gradient(rgba(15, 23, 43, .9), rgba(15, 23, 43, .9)), url(${res.data.data})`,
                    "backgroundPosition": "center center",
                    "backgroundRepeat": "no-repeat",
                    "backgroundSize": "cover",
                })
            }).catch((err) => {
                console.log(err);
            })
    }

    useEffect(() => {
        calledUI()
        calledText()
        calledBG()
        socketRef.current = socketIOClient.connect("https://eatcom.onrender.com")

        socketRef.current.on('ChangeHeroImageSuccess', dataGot => {
            if (dataGot.title === "Hero") {
                calledUI()
            }
        })

        socketRef.current.on('ChangeWordUpSuccess', dataGot => {
            if (dataGot.title === "Hero") {
                calledText()
            }
        })

        socketRef.current.on('ChangeWordMiddleSuccess', dataGot => {
            if (dataGot.title === "Hero") {
                calledText()
            }
        })

        socketRef.current.on('ChangeWordDownSuccess', dataGot => {
            if (dataGot.title === "Hero") {
                calledText()
            }
        })

        return () => {
            socketRef.current.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (text?.up) {
        word1 = HTMLReactParser(text?.up)
    }
    if (text?.middle) {
        word2 = HTMLReactParser(text?.middle)
    }
    if (text?.down) {
        word3 = HTMLReactParser(text?.down)
    }
    return (
        <div className="container-fluid py-5 hero-header" style={styleX}>
            <div className="container py-5 h-100">
                <div className="row align-items-center g-5 followRuleX container">
                    <div className="col-lg-6 text-center text-lg-start sonFollowRuleX">
                        <h2 className="display-3 text-white animated slideInLeft">{word1}</h2>
                        <h2 className="display-3 text-white animated slideInLeft">{word2}</h2>
                        <p className="text-white animated slideInLeft mb-4 pb-2">{word3}</p>
                        <NavLink reloadDocument to="/BookingSite" className="btn btn-primary py-sm-3 px-sm-5 animated slideInLeft">Book A Table</NavLink>
                    </div>
                    <div className="col-lg-6 text-center text-lg-end lenderX sonFollowRuleX2">
                        <img className="img-fluid" width="70%" height="70%" src={styleA} alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default HeroBanner