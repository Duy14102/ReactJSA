import NotFound from "../component/outOfBorder/NotFound";
import Layout from "../Layout";
import axios from "axios";
import TransactionUI from "../component/outOfBorder/TransactionUI";
import { useEffect, useRef, useReducer } from "react";
import { NavLink } from "react-router-dom";
import socketIOClient from "socket.io-client";
import "../css/Cart.css";
import Header from "../component/Header";
import html2canvas from 'html2canvas';

function OrderComplete() {
    const socketRef = useRef();
    const [completeState, setCompleteState] = useReducer((prev, next) => ({
        ...prev, ...next
    }), {
        data: false,
        remove: false,
        responseCode: null,
        amount: null,
        date: null,
        order: []
    })
    const ahoe = localStorage.getItem("complete")
    if (!ahoe) {
        NotFound()
    }
    const ahoeGuys = JSON.parse(localStorage.getItem("complete"))
    const queryParameters = new URLSearchParams(window.location.search)

    useEffect(() => {
        const confiG = {
            method: "get",
            url: "https://eatcom.onrender.com/GetOrder4Complete",
            params: {
                id: ahoeGuys.orderid
            }
        }
        axios(confiG)
            .then((resW) => {
                setCompleteState({ order: resW.data })
            }).catch((er) => {
                console.log(er);
            })
        localStorage.removeItem("shippingFee")
        if (completeState.remove) {
            setCompleteState({ remove: false })
            return NotFound()
        }

        socketRef.current = socketIOClient.connect("https://eatcom.onrender.com")

        if (queryParameters.size > 1) {
            const type = queryParameters.get("vnp_ResponseCode")
            const type2 = queryParameters.get("vnp_Amount")
            const type3 = queryParameters.get("vnp_PayDate")
            const type4 = queryParameters.get("vnp_TxnRef")
            var year = type3.substring(0, 4);
            var month = type3.substring(4, 6);
            var day = type3.substring(6, 8);
            var hour = type3.substring(8, 10)
            var minute = type3.substring(10, 12)
            var second = type3.substring(12, 14)
            var sendDate = new Date(year, month - 1, day, hour, minute, second)
            var dow = new Date(year, month - 1, day, hour, minute, second).toLocaleDateString()
            var tim = new Date(year, month - 1, day, hour, minute, second).toLocaleTimeString()
            setCompleteState({ date: dow + " - " + tim })
            setCompleteState({ amount: type2 })
            setCompleteState({ responseCode: type })

            var kakao = null
            if (type === '24') {
                kakao = "Customer cancels transaction"
            }
            if (type === '15') {
                kakao = "Customer did not make the transaction"
            }
            if (type === '09') {
                kakao = "Customer's card/account has not registered for InternetBanking service at the bank."
            }
            if (type === '10') {
                kakao = "Customers verify incorrect card/account information more than 3 times"
            }
            if (type === '11') {
                kakao = "Payment deadline has expired."
            }
            if (type === '12') {
                kakao = "Customer's card/account is locked."
            }
            if (type === '13') {
                kakao = "You entered the wrong transaction authentication password (OTP)."
            }
            if (type === '51') {
                kakao = "Your account does not have enough balance to make a transaction."
            }
            if (type === '65') {
                kakao = "Your account has exceeded the daily transaction limit."
            }
            if (type === '75') {
                kakao = "The payment bank is under maintenance."
            }
            if (type === '79') {
                kakao = "The customer enters the wrong payment password more than the specified number of times."
            }
            if (type === '99') {
                kakao = "Other errors."
            }

            if (type4) {
                const configuration = {
                    method: "post",
                    url: "https://eatcom.onrender.com/ChangeVnpayDate",
                    data: {
                        id: type4,
                        date: sendDate
                    }
                }
                axios(configuration).then(() => { }).catch((err) => { console.log(err); })
            }

            if (type === "24" || type === "09" || type === "10" || type === "11" || type === "12" || type === "13" || type === "51" || type === "65" || type === "75" || type === "79" || type === "99" || type === "15") {
                const data1 = { reason: kakao, orderid: type4, userid: ahoeGuys?.userid }
                socketRef.current.emit('CancelVnpayPaymentSocket', data1)
            } else {
                const data2 = { orderid: type4, userid: ahoeGuys?.userid }
                socketRef.current.emit('PaidVnpayPaymentSocket', data2)
            }

            if (!ahoe) {
                const glitch = { orderid: type4 }
                localStorage.setItem("complete", glitch)
            }
        }

        if (queryParameters.size === 1) {
            const type = queryParameters.get("status")
            if (type === "COMPLETED") {
                setCompleteState({ data: true })
                const data3 = { orderid: ahoeGuys.orderid, userid: ahoeGuys?.userid }
                socketRef.current.emit('PaidPaypalPaymentSocket', data3)
            }
        }

        if (queryParameters.size === 0) {
            setCompleteState({ data: true })
            const data4 = { orderid: ahoeGuys.orderid, userid: ahoeGuys?.userid }
            socketRef.current.emit('PaidCodPaymentSocket', data4)
        }

        return () => {
            socketRef.current.disconnect();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ahoe])

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    setTimeout(() => {
        setCompleteState({ remove: true })
    }, 60000);

    var total2 = 0, enTotal = 0, inTotal = 0, fulltotal = 0
    const mero = (i, index, s) => {
        var countTotal = 0
        inTotal = i.topping?.reduce((acc, o) => acc + parseInt(o.foodprice), 0)
        enTotal = s.orderitems?.reduce((acc, o) => acc + parseInt(o.data.foodprice), 0)
        if (inTotal) {
            countTotal = (inTotal + enTotal) * i.quantity
        } else {
            countTotal = enTotal * i.quantity
        }
        total2 += countTotal
        fulltotal = total2 + s.shippingfee
        const indexPlus = index + 1
        return (
            <tr key={i.data._id} style={{ verticalAlign: "middle" }}>
                <td>{indexPlus}</td>
                <td>
                    <div className="d-flex align-items-center" style={{ gap: 10 }}>
                        <img alt="" src={i.data.foodimage} width={70} height={60} />
                        <div>
                            <p className="m-0">{i.data.foodname}</p>
                            <p className="m-0 text-start" style={{ fontSize: 14, color: "#FEA116" }}><b>{VND.format(i.data.foodprice)}</b></p>
                        </div>
                    </div>
                    {i.topping?.map((p) => {
                        return (
                            <div key={p._id} className="d-flex align-items-center" style={{ gap: 10, marginLeft: 25, marginTop: 10 }}>
                                <img alt="" src={p.foodimage} width={45} height={40} />
                                <div>
                                    <p className="m-0" style={{ fontSize: 14 }}>{p.foodname}</p>
                                    <p className="m-0 text-start" style={{ color: "#FEA116", fontSize: 12 }}><b>{VND.format(p.foodprice)}</b></p>
                                </div>
                            </div>
                        )
                    })}
                </td>
                <td>{i.quantity}</td>
                <td>{VND.format(countTotal)}</td>
            </tr>
        )
    }

    const downloadOrder = () => {
        const image = document.getElementById('orderDownload');
        // const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
        let downloadLink = document.createElement('a');
        html2canvas(image, {
            allowTaint: true,
            useCORS: true
        }).then(function (canvas) {
            const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
            downloadLink.href = pngUrl
            downloadLink.download = "Order.png";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }).catch((er) => console.log(er));
    };

    return (
        <Layout>
            <Header type={"Yes"} />
            <div className="bg-white py-4">
                <div className="container text-center">
                    {completeState.data ? (
                        <>
                            <div className="pb-3 businessWay">
                                <NavLink className="joiboy" to="/Cart"> Shopping Cart</NavLink> <span className='slash'>˃ <NavLink className="joiboy" to="/CheckOut">Checkout Details</NavLink> <span className='slash'>˃</span> </span> <NavLink className="joiboy" to="/OrderComplete">Complete</NavLink>
                            </div>
                            <h2 className="thankYou" data-text="Thankyou!">Thankyou!</h2>
                            <div className="d-flex justify-content-center">
                                <div id="orderDownload" className="billX">
                                    <div className="navbar-brand p-0 text-center">
                                        <h2 className="text-primary thisTextH1 m-0"><svg style={{ fill: "#FEA116" }} className="me-3" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M416 0C400 0 288 32 288 176V288c0 35.3 28.7 64 64 64h32V480c0 17.7 14.3 32 32 32s32-14.3 32-32V352 240 32c0-17.7-14.3-32-32-32zM64 16C64 7.8 57.9 1 49.7 .1S34.2 4.6 32.4 12.5L2.1 148.8C.7 155.1 0 161.5 0 167.9c0 45.9 35.1 83.6 80 87.7V480c0 17.7 14.3 32 32 32s32-14.3 32-32V255.6c44.9-4.1 80-41.8 80-87.7c0-6.4-.7-12.8-2.1-19.1L191.6 12.5c-1.8-8-9.3-13.3-17.4-12.4S160 7.8 160 16V150.2c0 5.4-4.4 9.8-9.8 9.8c-5.1 0-9.3-3.9-9.8-9L127.9 14.6C127.2 6.3 120.3 0 112 0s-15.2 6.3-15.9 14.6L83.7 151c-.5 5.1-4.7 9-9.8 9c-5.4 0-9.8-4.4-9.8-9.8V16zm48.3 152l-.3 0-.3 0 .3-.7 .3 .7z" /></svg>EatCom</h2>
                                    </div>
                                    <div className="d-flex justify-content-center mixingAce">
                                        <div className="d-flex justify-content-around align-items-center" style={{ gap: 15 }}>
                                            <div className="d-flex align-items-center edgeAce"><svg className="me-3" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" /></svg><p className="m-0">18 Tam Trinh, Ha Noi, Viet Nam</p></div>
                                            <div style={{ height: "100%", background: "lightgray", width: 1 }}></div>
                                            <a className="footerTel2" href={"+012 345 67890"}><p className="mb-2"><svg className="me-3" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M280 0C408.1 0 512 103.9 512 232c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-101.6-82.4-184-184-184c-13.3 0-24-10.7-24-24s10.7-24 24-24zm8 192a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm-32-72c0-13.3 10.7-24 24-24c75.1 0 136 60.9 136 136c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-48.6-39.4-88-88-88c-13.3 0-24-10.7-24-24zM117.5 1.4c19.4-5.3 39.7 4.6 47.4 23.2l40 96c6.8 16.3 2.1 35.2-11.6 46.3L144 207.3c33.3 70.4 90.3 127.4 160.7 160.7L345 318.7c11.2-13.7 30-18.4 46.3-11.6l96 40c18.6 7.7 28.5 28 23.2 47.4l-24 88C481.8 499.9 466 512 448 512C200.6 512 0 311.4 0 64C0 46 12.1 30.2 29.5 25.4l88-24z" /></svg>+012 345 67890</p></a>
                                        </div>
                                    </div>
                                    {Object.values(completeState.order).map((i) => {
                                        const date = new Date(i.createdAt).toLocaleDateString()
                                        const time = new Date(i.createdAt).toLocaleTimeString()
                                        return (
                                            <div key={i._id}>
                                                <hr />
                                                <div className="d-flex justify-content-between align-items-center my-2">
                                                    <p className="m-0"><b>Id</b> : {i._id}</p>
                                                    <p className="m-0"><b>Date</b> : {date + " - " + time}</p>
                                                </div>
                                                <p className="text-start mb-2"><b>Customer</b> : {i.user[0].fullname} - {i.phonenumber}</p>
                                                <p className="text-start"><b>Address</b> : {i.address}</p>
                                                <table className="table-bordered table solotable m-0">
                                                    <thead>
                                                        <tr style={{ color: "#0F172B", backgroundColor: "gray" }}>
                                                            <th style={{ width: "10%", textAlign: "center", color: "#fff" }}>No</th>
                                                            <th style={{ width: "60%", color: "#fff" }}>Items</th>
                                                            <th style={{ width: "15%", textAlign: "center", color: "#fff" }}>Quantity</th>
                                                            <th style={{ width: "15%", textAlign: "center", color: "#fff" }}>Price</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {i.orderitems?.map((a, index) => {
                                                            return (
                                                                mero(a, index, i)
                                                            )
                                                        })}
                                                        <tr>
                                                            <td colSpan={3}><b>Full total</b></td>
                                                            <td style={{ color: "#FEA116" }}><b>{VND.format(fulltotal)}</b></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                {i.shippingfee !== 0 ? (
                                                    <p style={{ color: "gray", textAlign: "start", fontSize: 14 }}>This price has already contain <b>{VND.format(i.shippingfee)}</b> shipping fee !</p>
                                                ) : null}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="mt-4 d-flex" style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 10 }}>
                                <div className="d-flex align-items-center" style={{ gap: 30 }}>
                                    <NavLink to="/" className="returnP">Return to homepage ➜</NavLink>
                                    <button onClick={() => downloadOrder()} className="buttonDownL">
                                        <svg style={{ width: 20, height: 20 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" /></svg>
                                        <p className="m-0">Download order</p>
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <TransactionUI ahoe={ahoeGuys} amount={completeState.amount} responseCode={completeState.responseCode} date={completeState.date} order={completeState.order} />
                    )}
                </div>
            </div>
        </Layout>
    )
}
export default OrderComplete;