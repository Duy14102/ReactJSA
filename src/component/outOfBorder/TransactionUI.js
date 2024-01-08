import { NavLink } from "react-router-dom"

function TransactionUI({ responseCode, ahoe, amount, date }) {
    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    var kakao = null
    if (responseCode === '24') {
        kakao = "Customer cancels transaction"
    }
    if (responseCode === '15') {
        kakao = "Customer did not make the transaction"
    }
    if (responseCode === '09') {
        kakao = "Customer's card/account has not registered for InternetBanking service at the bank."
    }
    if (responseCode === '10') {
        kakao = "Customers verify incorrect card/account information more than 3 times"
    }
    if (responseCode === '11') {
        kakao = "Payment deadline has expired."
    }
    if (responseCode === '12') {
        kakao = "Customer's card/account is locked."
    }
    if (responseCode === '13') {
        kakao = "You entered the wrong transaction authentication password (OTP)."
    }
    if (responseCode === '51') {
        kakao = "Your account does not have enough balance to make a transaction."
    }
    if (responseCode === '65') {
        kakao = "Your account has exceeded the daily transaction limit."
    }
    if (responseCode === '75') {
        kakao = "The payment bank is under maintenance."
    }
    if (responseCode === '79') {
        kakao = "The customer enters the wrong payment password more than the specified number of times."
    }
    if (responseCode === '99') {
        kakao = "Other errors."
    }
    return (
        <>
            {responseCode === '24' || responseCode === '09' || responseCode === '10' || responseCode === '11' || responseCode === '12' || responseCode === '13' || responseCode === '51' || responseCode === '65' || responseCode === '75' || responseCode === '79' || responseCode === '99' || responseCode === '15' ? (
                <div className="py-5">
                    <h2 className="mb-3">Transaction Failed!</h2>
                    <div className="croui mb-4 hugeImpace">
                        <h5>Detail</h5>
                        <p><b>OrderId</b> : {ahoe.orderid}</p>
                        <p><b>Amount</b> : {VND.format(amount / 100)}</p>
                        <p><b>Date</b> : {date}</p>
                        <p><b>Reason</b> : {kakao}</p>
                    </div>
                    <NavLink reloadDocument to="/" className="returnP">Return to homepage</NavLink>
                </div>
            ) : (
                <>
                    <div className="py-5 businessWay">
                        <NavLink className="joiboy" to="/Cart"> Shopping Cart</NavLink> <span className='slash'>˃</span> <NavLink className="joiboy" to="/CheckOut">Checkout Details</NavLink> <span className='slash'>˃</span> <NavLink className="joiboy" to="/OrderComplete">Order Complete</NavLink>
                    </div>
                    <h2 className="thankYou" data-text="Thankyou!">Thankyou!</h2>
                    <p>Your Order #Id : {ahoe.orderid}</p>
                    <NavLink to="/" className="returnP">Return to homepage</NavLink>
                </>
            )}
        </>
    )
}
export default TransactionUI