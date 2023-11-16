import HTMLReactParser from "html-react-parser";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function HeroBanner() {
    var word1 = ""
    var word2 = ""
    var word3 = ""
    const [styleA, setStyleA] = useState()
    const [text, setText] = useState()
    useEffect(() => {
        const configuration = {
            method: "get",
            url: "http://localhost:3000/GetHeroUI",
            params: {
                name: "herocircle"
            }
        }
        axios(configuration)
            .then((res) => {
                setStyleA(res.data.data)
            }).catch((err) => {
                console.log(err);
            })

        const configuration2 = {
            method: "get",
            url: "http://localhost:3000/GetHeroText",
        }
        axios(configuration2)
            .then((res) => {
                setText(res.data.data)
            }).catch((err) => {
                console.log(err);
            })
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
        <div className="container-fluid py-5 hero-header mb-5">
            <div className="container my-5 py-5">
                <div className="row align-items-center g-5">
                    <div className="col-lg-6 text-center text-lg-start">
                        <h1 className="display-3 text-white animated slideInLeft">{word1}<br />{word2}</h1>
                        <p className="text-white animated slideInLeft mb-4 pb-2">{word3}</p>
                        <NavLink reloadDocument to="/BookingSite" className="btn btn-primary py-sm-3 px-sm-5 me-3 animated slideInLeft">Book A Table</NavLink>
                    </div>
                    <div className="col-lg-6 text-center text-lg-end overflow-hidden">
                        <img loading="lazy" className="img-fluid" src={styleA} alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default HeroBanner