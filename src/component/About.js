import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import HTMLReactParser from "html-react-parser";
import socketIOClient from "socket.io-client";

function About() {
    var word1 = ""
    var word2 = ""
    var word3 = ""
    const [getLaid, setGetLaid] = useState()
    const socketRef = useRef();
    useEffect(() => {
        callEd()

        socketRef.current = socketIOClient.connect("https://eatcom.onrender.com")

        socketRef.current.on('ChangeHeroImageSuccess', dataGot => {
            if (dataGot.title === "About") {
                callEd()
            }
        })

        socketRef.current.on('ChangeWordUpSuccess', dataGot => {
            if (dataGot.title === "About") {
                callEd()
            }
        })

        socketRef.current.on('ChangeWordMiddleSuccess', dataGot => {
            if (dataGot.title === "About") {
                callEd()
            }
        })

        socketRef.current.on('ChangeWordDownSuccess', dataGot => {
            if (dataGot.title === "About") {
                callEd()
            }
        })

        return () => {
            socketRef.current.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const callEd = () => {
        const configuration = {
            method: "get",
            url: "https://eatcom.onrender.com/GetAllAbout"
        }
        axios(configuration)
            .then((res) => {
                setGetLaid(res.data.data)
            }).catch((err) => {
                console.log(err);
            })
    }

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
        <div className="container-fluid bg-white pb-5">
            <div className="container">
                <div className="row g-5 align-items-center">
                    <div className="col-lg-6">
                        <div className="row g-3">
                            <div className="col-6 text-start wow zoomIn" data-wow-delay="0.1s">
                                {getLaid?.image.map((i) => {
                                    if (i.name === "k9axej6qza2mzsp8lwvj") {
                                        return (
                                            <img key={i.name} loading='lazy' className="img-fluid rounded w-100" width="100%" height="100%" src={i.url} alt="about1" />
                                        )
                                    }
                                    return null
                                })}
                            </div>
                            <div className="col-6 text-start wow zoomIn" data-wow-delay="0.3s" style={{ position: "relative" }}>
                                {getLaid?.image.map((i) => {
                                    if (i.name === "ixdn78iskyewdqszx4rf") {
                                        return (
                                            <img key={i.name} loading='lazy' className="img-fluid rounded w-75" width="100%" height="100%" src={i.url} alt="about2" style={{ position: "absolute", bottom: 0 }} />
                                        )
                                    }
                                    return null
                                })}
                            </div>
                            <div className="col-6 text-end wow zoomIn" data-wow-delay="0.5s">
                                {getLaid?.image.map((i) => {
                                    if (i.name === "ucvurntwkq3pgbvq8scl") {
                                        return (
                                            <img key={i.name} loading='lazy' className="img-fluid rounded w-75" width="100%" height="100%" src={i.url} alt="about3" />
                                        )
                                    }
                                    return null
                                })}
                            </div>
                            <div className="col-6 text-end wow zoomIn" data-wow-delay="0.7s">
                                {getLaid?.image.map((i) => {
                                    if (i.name === "irnkhvizbt88rhedgys2") {
                                        return (
                                            <img key={i.name} loading='lazy' className="img-fluid rounded w-100" width="100%" height="100%" src={i.url} alt="about4" />
                                        )
                                    }
                                    return null
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 MagicAppearText">
                        <h5 className="section-title ff-secondary text-start text-primary fw-normal wow fadeInUp" data-wow-delay="0.1s">About Us</h5>
                        <h1 className="mb-4"><span>Welcome to <svg style={{ fill: "#FEA116" }} className="me-2" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M416 0C400 0 288 32 288 176V288c0 35.3 28.7 64 64 64h32V480c0 17.7 14.3 32 32 32s32-14.3 32-32V352 240 32c0-17.7-14.3-32-32-32zM64 16C64 7.8 57.9 1 49.7 .1S34.2 4.6 32.4 12.5L2.1 148.8C.7 155.1 0 161.5 0 167.9c0 45.9 35.1 83.6 80 87.7V480c0 17.7 14.3 32 32 32s32-14.3 32-32V255.6c44.9-4.1 80-41.8 80-87.7c0-6.4-.7-12.8-2.1-19.1L191.6 12.5c-1.8-8-9.3-13.3-17.4-12.4S160 7.8 160 16V150.2c0 5.4-4.4 9.8-9.8 9.8c-5.1 0-9.3-3.9-9.8-9L127.9 14.6C127.2 6.3 120.3 0 112 0s-15.2 6.3-15.9 14.6L83.7 151c-.5 5.1-4.7 9-9.8 9c-5.4 0-9.8-4.4-9.8-9.8V16zm48.3 152l-.3 0-.3 0 .3-.7 .3 .7z" /></svg>EatCom</span></h1>
                        <p className="mb-4"><span className='span1Magic'>{word1}</span></p>
                        <p className="mb-4"><span className='span2Magic'>{word2}</span></p>
                        <p className="mb-4"><span className='span3Magic'>{word3}</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default About;