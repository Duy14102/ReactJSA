import NotFound from "../component/outOfBorder/NotFound";
import Layout from "../Layout";
import axios from "axios";
import TransactionUI from "../component/outOfBorder/TransactionUI";

function OrderComplete() {
    const ahoe = localStorage.getItem("complete")
    const queryParameters = new URLSearchParams(window.location.search)
    var responseCode = null
    var amount = null
    var date = null
    if (queryParameters.size > 0) {
        localStorage.clear()
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
        var dow = new Date(year, month - 1, day, hour, minute, second).toLocaleDateString()
        var tim = new Date(year, month - 1, day, hour, minute, second).toLocaleTimeString()
        date = dow + " - " + tim
        amount = type2
        responseCode = type

        var kakao = null
        if (type === '24') {
            kakao = "Customer cancels transaction"
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

        if (type === "24" || type === "09" || type === "10" || type === "11" || type === "12" || type === "13" || type === "51" || type === "65" || type === "75" || type === "79" || type === "99") {
            const configuration = {
                method: "post",
                url: "http://localhost:3000/CancelVnpayPayment",
                params: {
                    reason: kakao,
                    id: type4
                }
            }
            axios(configuration).then(() => { }).catch((err) => { console.log(err); })
        } else {
            const configuration = {
                method: "post",
                url: "http://localhost:3000/PaidVnpayPayment",
                params: {
                    id: type4
                }
            }
            axios(configuration).then(() => { }).catch((err) => { console.log(err); })
        }

        if (!ahoe) {
            localStorage.setItem("complete", type4)
        }
    }
    function goAway() {
        localStorage.removeItem("complete")
    }

    setTimeout(() => {
        goAway()
    }, 60000);

    if (!ahoe) {
        return NotFound()
    }
    return (
        <Layout>
            <div className="bg-white">
                <div style={{ height: 50 + "vh" }}>
                    <div className="container text-center">
                        <TransactionUI ahoe={ahoe} amount={amount} responseCode={responseCode} date={date} />
                    </div>
                </div>
            </div>

        </Layout>
    )
}
export default OrderComplete;