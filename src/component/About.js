import axios from 'axios';
import { Fragment, useEffect, useState } from 'react';
import HTMLReactParser from "html-react-parser";

function About() {
    var word1 = ""
    var word2 = ""
    var word3 = ""
    const [getLaid, setGetLaid] = useState()
    useEffect(() => {
        const configuration = {
            method: "get",
            url: "http://localhost:3000/GetAllAbout"
        }
        axios(configuration)
            .then((res) => {
                setGetLaid(res.data.data)
            }).catch((err) => {
                console.log(err);
            })
    }, [])

    if (getLaid?.word.up) {
        word1 = HTMLReactParser(getLaid?.word.up)
    }
    if (getLaid?.word.middle) {
        word2 = HTMLReactParser(getLaid?.word.middle)
    }
    if (getLaid?.word.down) {
        word3 = HTMLReactParser(getLaid?.word.down)
    }

    return (
        <div className="container-fluid bg-white py-5">
            <div className="container">
                <div className="row g-5 align-items-center">
                    <div className="col-lg-6">
                        <div className="row g-3">
                            {getLaid?.image.map((i) => {
                                return (
                                    <Fragment key={i.name}>
                                        {i.name === "image1" ? (
                                            <div key={i.name} className="col-6 text-start">
                                                <img className="img-fluid rounded w-100 wow zoomIn" width="100%" height="100%" data-wow-delay="0.1s" src={i.url} alt="about1" />
                                            </div>
                                        ) : null}
                                        {i.name === "image2" ? (
                                            <div key={i.name} className="col-6 text-start" style={{ position: "relative" }}>
                                                <img className="img-fluid rounded w-75 wow zoomIn" width="100%" height="100%" data-wow-delay="0.3s" src={i.url} alt="about2" style={{ position: "absolute", bottom: 0 }} />
                                            </div>
                                        ) : null}
                                        {i.name === "image3" ? (
                                            <div key={i.name} className="col-6 text-end">
                                                <img className="img-fluid rounded w-75 wow zoomIn" width="100%" height="100%" data-wow-delay="0.5s" src={i.url} alt="about3" />
                                            </div>
                                        ) : null}
                                        {i.name === "image4" ? (
                                            <div key={i.name} className="col-6 text-end">
                                                <img className="img-fluid rounded w-100 wow zoomIn" width="100%" height="100%" data-wow-delay="0.7s" src={i.url} alt="about4" />
                                            </div>
                                        ) : null}
                                    </Fragment>
                                )
                            })}
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <h5 className="section-title ff-secondary text-start text-primary fw-normal">About Us</h5>
                        <h1 className="mb-4">Welcome to <svg style={{ fill: "#FEA116" }} className="me-2" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M416 0C400 0 288 32 288 176V288c0 35.3 28.7 64 64 64h32V480c0 17.7 14.3 32 32 32s32-14.3 32-32V352 240 32c0-17.7-14.3-32-32-32zM64 16C64 7.8 57.9 1 49.7 .1S34.2 4.6 32.4 12.5L2.1 148.8C.7 155.1 0 161.5 0 167.9c0 45.9 35.1 83.6 80 87.7V480c0 17.7 14.3 32 32 32s32-14.3 32-32V255.6c44.9-4.1 80-41.8 80-87.7c0-6.4-.7-12.8-2.1-19.1L191.6 12.5c-1.8-8-9.3-13.3-17.4-12.4S160 7.8 160 16V150.2c0 5.4-4.4 9.8-9.8 9.8c-5.1 0-9.3-3.9-9.8-9L127.9 14.6C127.2 6.3 120.3 0 112 0s-15.2 6.3-15.9 14.6L83.7 151c-.5 5.1-4.7 9-9.8 9c-5.4 0-9.8-4.4-9.8-9.8V16zm48.3 152l-.3 0-.3 0 .3-.7 .3 .7z" /></svg>EatCom</h1>
                        <p className="mb-4">{word1}</p>
                        <p className="mb-4">{word2}</p>
                        <p className="mb-4">{word3}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default About;