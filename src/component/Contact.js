import axios from "axios";
import HTMLReactParser from "html-react-parser";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";
import Cookies from "universal-cookie";
import socketIOClient from "socket.io-client";

function Contact() {
    const cookies = new Cookies()
    const token = cookies.get("TOKEN");
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [title, setTitle] = useState()
    const [message, setMessage] = useState()
    const [address, setAddress] = useState()
    const [phone, setPhone] = useState()
    const [email2, setEmail2] = useState()
    const socketRef = useRef();

    useEffect(() => {
        if (token) {
            const decode = jwtDecode(token)
            setName(decode.userName)
            setEmail(decode.userEmail)
        }
    }, [token])

    const calledFooter = () => {
        const configuration = {
            method: "get",
            url: "https://eatcom.onrender.com/GetTheFooter"
        }
        axios(configuration)
            .then((res) => {
                setAddress(res.data.data.word.up)
                setPhone(res.data.data.word.middle)
                setEmail2(res.data.data.word.down)
            }).catch((err) => {
                console.log(err);
            })
    }

    useEffect(() => {
        calledFooter()

        socketRef.current = socketIOClient.connect("https://eatcom.onrender.com")

        socketRef.current.on('ChangeWordTimeSuccess', dataGot => {
            if (dataGot.title === "Footer") {
                calledFooter()
            }
        })

        socketRef.current.on('ChangeWordUpSuccess', dataGot => {
            if (dataGot.title === "Footer") {
                calledFooter()
            }
        })

        socketRef.current.on('ChangeWordMiddleSuccess', dataGot => {
            if (dataGot.title === "Footer") {
                calledFooter()
            }
        })

        socketRef.current.on('ChangeWordDownSuccess', dataGot => {
            if (dataGot.title === "Footer") {
                calledFooter()
            }
        })

        socketRef.current.on('AddContactSuccess', dataGot => {
            if (dataGot.email === localStorage.getItem("contactEmail")) {
                Swal.fire(
                    'Successfully!',
                    '',
                    'success'
                ).then(function () {
                    localStorage.removeItem("contactEmail")
                    window.location.reload();
                })
            }
        })

        socketRef.current.on('AddContactFail', dataGot => {
            Swal.fire(
                'Failed!',
                '',
                'error'
            ).then(() => {
                localStorage.removeItem("contactEmail")
            })
        })

        return () => {
            socketRef.current.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const addcontact = (e) => {
        e.preventDefault()
        const data = { name, email, title, message }
        localStorage.setItem("contactEmail", email)
        socketRef.current.emit('AddContactSocket', data)
    }

    return (
        <div className="container-xxl py-5">
            <div className="container">
                <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                    <h5 className="section-title ff-secondary text-center text-primary fw-normal">Contact Us</h5>
                    <h1 className="mb-5">Contact For Any Query</h1>
                </div>
                <div className="row g-4">
                    <div className="col-12">
                        <div className="row gy-4">
                            <div className="col-md-4">
                                <h5 className="section-title ff-secondary fw-normal text-start text-primary">Address</h5>
                                <p><svg style={{ fill: "#FEA116" }} className="me-2" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" /></svg>{HTMLReactParser(`${address}`)}</p>
                            </div>
                            <div className="col-md-4">
                                <div className="w-100">
                                    <h5 className="section-title ff-secondary fw-normal text-start text-primary">Phone Number</h5>
                                </div>
                                <a className="footerTel2" href={`tel:${HTMLReactParser(`${phone}`)}`}><p><svg style={{ fill: "#FEA116" }} className="me-2" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M280 0C408.1 0 512 103.9 512 232c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-101.6-82.4-184-184-184c-13.3 0-24-10.7-24-24s10.7-24 24-24zm8 192a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm-32-72c0-13.3 10.7-24 24-24c75.1 0 136 60.9 136 136c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-48.6-39.4-88-88-88c-13.3 0-24-10.7-24-24zM117.5 1.4c19.4-5.3 39.7 4.6 47.4 23.2l40 96c6.8 16.3 2.1 35.2-11.6 46.3L144 207.3c33.3 70.4 90.3 127.4 160.7 160.7L345 318.7c11.2-13.7 30-18.4 46.3-11.6l96 40c18.6 7.7 28.5 28 23.2 47.4l-24 88C481.8 499.9 466 512 448 512C200.6 512 0 311.4 0 64C0 46 12.1 30.2 29.5 25.4l88-24z" /></svg>{HTMLReactParser(`${phone}`)}</p></a>
                            </div>
                            <div className="col-md-4">
                                <h5 className="section-title ff-secondary fw-normal text-start text-primary">Email</h5>
                                <p><svg style={{ fill: "#FEA116" }} className="me-2" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" /></svg>{HTMLReactParser(`${email2}`)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 wow fadeIn" data-wow-delay="0.1s">
                        <iframe title="0" className="position-relative rounded w-100 h-100"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.9583929265627!2d105.85957727590984!3d20.994304888959768!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ad11b1f441bf%3A0xcf480c26f8137a3a!2sVTC%20Online%20Building!5e0!3m2!1svi!2s!4v1687009497070!5m2!1svi!2s"
                            frameBorder="0" style={{ minHeight: 350 + "px", border: 0 }} allowFullScreen="" aria-hidden="false"
                            tabIndex="0"></iframe>
                    </div>
                    <div className="col-md-6">
                        <div className="wow fadeInUp" data-wow-delay="0.2s">
                            <form onSubmit={(e) => addcontact(e)}>
                                <div className="row g-3">
                                    {token ? null : (
                                        <>
                                            <div className="col-md-6">
                                                <div className="form-floating">
                                                    <input onChange={(e) => setName(e.target.value)} value={name} type="text" className="form-control" id="name" placeholder="Your Name" required />
                                                    <label htmlFor="name">Your Name</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-floating">
                                                    <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className="form-control" id="email" placeholder="Your Email" required />
                                                    <label htmlFor="email">Your Email</label>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    <div className="col-12">
                                        <div className="form-floating">
                                            <input onChange={(e) => setTitle(e.target.value)} value={title} type="text" className="form-control" id="subject" placeholder="Title" required />
                                            <label htmlFor="subject">Title</label>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-floating">
                                            <textarea onChange={(e) => setMessage(e.target.value)} value={message} className="form-control" placeholder="Leave a message here" id="message" style={{ height: 150 + "px" }} required></textarea>
                                            <label htmlFor="message">Message</label>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <button className="btn btn-primary w-100 py-3" type="submit">Send Message</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Contact;