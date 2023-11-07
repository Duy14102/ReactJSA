import axios from 'axios';
import { Fragment, useEffect, useState } from 'react';

function About() {
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
                                                <img loading="lazy" className="img-fluid rounded w-100 wow zoomIn" data-wow-delay="0.1s" src={i.url} alt="about1" />
                                            </div>
                                        ) : null}
                                        {i.name === "image2" ? (
                                            <div key={i.name} className="col-6 text-start" style={{ position: "relative" }}>
                                                <img loading="lazy" className="img-fluid rounded w-75 wow zoomIn" data-wow-delay="0.3s" src={i.url} alt="about2" style={{ position: "absolute", bottom: 0 }} />
                                            </div>
                                        ) : null}
                                        {i.name === "image3" ? (
                                            <div key={i.name} className="col-6 text-end">
                                                <img loading="lazy" className="img-fluid rounded w-75 wow zoomIn" data-wow-delay="0.5s" src={i.url} alt="about3" />
                                            </div>
                                        ) : null}
                                        {i.name === "image4" ? (
                                            <div key={i.name} className="col-6 text-end">
                                                <img loading="lazy" className="img-fluid rounded w-100 wow zoomIn" data-wow-delay="0.7s" src={i.url} alt="about4" />
                                            </div>
                                        ) : null}
                                    </Fragment>
                                )
                            })}
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <h5 className="section-title ff-secondary text-start text-primary fw-normal">About Us</h5>
                        <h1 className="mb-4">Welcome to <i className="fi fi-ss-utensils me-2 text-primary"></i>EatCom</h1>
                        <p className="mb-4">{getLaid?.word.up}</p>
                        <p className="mb-4">{getLaid?.word.middle}</p>
                        <p className="mb-4">{getLaid?.word.down}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default About;