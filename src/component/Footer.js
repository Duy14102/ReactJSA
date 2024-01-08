import { useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import axios from 'axios'
import HTMLReactParser from "html-react-parser";
import socketIOClient from "socket.io-client";

function Footer() {
    const [address, setAddress] = useState()
    const [phone, setPhone] = useState()
    const [email, setEmail] = useState()
    const [time, setTime] = useState()
    const socketRef = useRef();

    const called = () => {
        const configuration = {
            method: "get",
            url: "http://localhost:3000/GetTheFooter"
        }
        axios(configuration)
            .then((res) => {
                setAddress(res.data.data.word.up)
                setPhone(res.data.data.word.middle)
                setEmail(res.data.data.word.down)
                setTime(res.data.data.word.time)
            }).catch((err) => {
                console.log(err);
            })
    }
    useEffect(() => {
        called()

        socketRef.current = socketIOClient.connect("http://localhost:3000")

        socketRef.current.on('ChangeWordTimeSuccess', dataGot => {
            if (dataGot.title === "Footer") {
                called()
            }
        })

        socketRef.current.on('ChangeWordUpSuccess', dataGot => {
            if (dataGot.title === "Footer") {
                called()
            }
        })

        socketRef.current.on('ChangeWordMiddleSuccess', dataGot => {
            if (dataGot.title === "Footer") {
                called()
            }
        })

        socketRef.current.on('ChangeWordDownSuccess', dataGot => {
            if (dataGot.title === "Footer") {
                called()
            }
        })

        return () => {
            socketRef.current.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const dataTel = `tel:${HTMLReactParser(`${phone}`)}`
    return (
        <div className="container-fluid bg-dark text-light footer pt-5 fadeIn">
            <div className="container py-5">
                <div className="row g-5">
                    <div className="col-lg-3 col-md-6">
                        <h4 className="section-title ff-secondary text-start text-primary fw-normal mb-4">About us</h4>
                        <p>EatCom's official and only website. Currently we only accept orders on the website and not anywhere else!</p>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <h4 className="section-title ff-secondary text-start text-primary fw-normal mb-4">Category</h4>
                        <NavLink reloadDocument to="/TrackOrder" className="btn btn-link" >Tracking Order</NavLink>
                        <NavLink reloadDocument to="/ContactSite" className="btn btn-link" >Contact Us</NavLink>
                        <NavLink reloadDocument to="/BookingSite" className="btn btn-link" >Booking Table</NavLink>
                        <NavLink reloadDocument to="/PAndT" className="btn btn-link" >Terms & Condition</NavLink>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <h4 className="section-title ff-secondary text-start text-primary fw-normal mb-4">Opening</h4>
                        <h5 className="text-light fw-normal">All week</h5>
                        <p>{HTMLReactParser(`${time}`)}</p>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <h4 className="section-title ff-secondary text-start text-primary fw-normal mb-4">Contact</h4>
                        <p className="mb-2"><svg style={{ fill: "#fff" }} className="me-3" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" /></svg>{HTMLReactParser(`${address}`)}</p>
                        <a className="footerTel" href={dataTel}><p className="mb-2"><svg style={{ fill: "#fff" }} className="me-3" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M280 0C408.1 0 512 103.9 512 232c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-101.6-82.4-184-184-184c-13.3 0-24-10.7-24-24s10.7-24 24-24zm8 192a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm-32-72c0-13.3 10.7-24 24-24c75.1 0 136 60.9 136 136c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-48.6-39.4-88-88-88c-13.3 0-24-10.7-24-24zM117.5 1.4c19.4-5.3 39.7 4.6 47.4 23.2l40 96c6.8 16.3 2.1 35.2-11.6 46.3L144 207.3c33.3 70.4 90.3 127.4 160.7 160.7L345 318.7c11.2-13.7 30-18.4 46.3-11.6l96 40c18.6 7.7 28.5 28 23.2 47.4l-24 88C481.8 499.9 466 512 448 512C200.6 512 0 311.4 0 64C0 46 12.1 30.2 29.5 25.4l88-24z" /></svg>{HTMLReactParser(`${phone}`)}</p></a>
                        <p className="mb-2"><svg style={{ fill: "#fff" }} className="me-3" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" /></svg>{HTMLReactParser(`${email}`)}</p>
                        <div className="d-flex pt-2">
                            <a href="https://twitter.com/" className="btn btn-outline-light btn-social p-0 twit" title="X-Twitter"><svg className="brandtwit" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="80 0 350 500"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" /></svg></a>
                            <a href="https://www.facebook.com/" className="btn btn-outline-light btn-social p-0 faceb" title="Facebook"><svg className="brandfaceb" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="30 0 450 500"><path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z" /></svg></a>
                            <a href="https://www.instagram.com/" className="btn btn-outline-light btn-social p-0 instag" title="Instagram"><svg className="brandinstag" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" /></svg></a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="copyright">
                    <div className="row">
                        <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                            &copy; <NavLink to="/" className="border-bottom">EatCom</NavLink>, 2023 All Right Reserved.
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
export default Footer;