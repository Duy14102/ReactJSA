import NotFound from "../component/outOfBorder/NotFound";
import Layout from "../Layout";
import axios from "axios";
import TransactionUI from "../component/outOfBorder/TransactionUI";
import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import socketIOClient from "socket.io-client";
import "../css/Cart.css";

function OrderComplete() {
    const socketRef = useRef();
    const [data, setData] = useState(false)
    const [remove, setRemove] = useState(false)
    const ahoe = localStorage.getItem("complete")
    const ahoeGuys = JSON.parse(ahoe)
    const [responseCode, setResponseCode] = useState()
    const [amount, setAmount] = useState()
    const [date, setDate] = useState()
    const queryParameters = new URLSearchParams(window.location.search)

    useEffect(() => {
        if (remove) {
            setRemove(false)
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
            setDate(dow + " - " + tim)
            setAmount(type2)
            setResponseCode(type)

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
                setData(true)
                const data3 = { orderid: ahoeGuys.orderid, userid: ahoeGuys?.userid }
                socketRef.current.emit('PaidPaypalPaymentSocket', data3)
            }
        }

        if (queryParameters.size === 0) {
            setData(true)
            const data4 = { orderid: ahoeGuys.orderid, userid: ahoeGuys?.userid }
            socketRef.current.emit('PaidCodPaymentSocket', data4)
        }

        return () => {
            socketRef.current.disconnect();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ahoe])

    setTimeout(() => {
        setRemove(true)
    }, 60000);
    
    return (
        <Layout>
            <div className="bg-white">
                <div style={{ height: 50 + "vh" }}>
                    <div className="container text-center">
                        {data ? (
                            <>
                                <div className="py-5 businessWay">
                                    <NavLink className="joiboy" to="/Cart"> Shopping Cart</NavLink> <span className='slash'>˃</span> <NavLink className="joiboy" to="/CheckOut">Checkout Details</NavLink> <span className='slash'>˃</span> <NavLink className="joiboy" to="/OrderComplete">Order Complete</NavLink>
                                </div>
                                <h2 className="thankYou" data-text="Thankyou!">Thankyou!</h2>
                                <p>Your Order #Id : {ahoeGuys.orderid}</p>
                                <NavLink to="/" className="returnP">Return to homepage</NavLink>
                            </>
                        ) : (
                            <TransactionUI ahoe={ahoeGuys} amount={amount} responseCode={responseCode} date={date} />
                        )}
                    </div>
                </div>
            </div>

        </Layout>
    )
}
export default OrderComplete;