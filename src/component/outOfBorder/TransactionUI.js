import { NavLink } from "react-router-dom"
import html2canvas from 'html2canvas';

function TransactionUI({ responseCode, ahoe, amount, date, order }) {
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

    var total2 = 0
    var fulltotal = 0
    const mero = (i, index, s) => {
        var total = i.quantity * i.data.foodprice
        total2 += total
        fulltotal = total2 + s.shippingfee
        const indexPlus = index + 1
        return (
            <tr key={i.data._id}>
                <td>{indexPlus}</td>
                <td>
                    <div className="d-flex" style={{ gap: 10 }}>
                        <img crossOrigin="anonymous" alt="" src={i.data.foodimage} width={55} height={55} />
                        <div className="text-start">
                            <b>{i.data.foodname}</b>
                            <p className="m-0 cutTextRightNow">{i.data.fooddescription}</p>
                        </div>
                    </div>
                </td>
                <td>{i.quantity}</td>
                <td>{VND.format(i.data.foodprice)}</td>
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

    const downloadOrder2 = () => {
        const image = document.getElementById('orderDownload2');
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
        <>
            {responseCode === '24' || responseCode === '09' || responseCode === '10' || responseCode === '11' || responseCode === '12' || responseCode === '13' || responseCode === '51' || responseCode === '65' || responseCode === '75' || responseCode === '79' || responseCode === '99' || responseCode === '15' ? (
                <>
                    <div className="py-5">
                        <div className="pb-3 businessWay">
                            <NavLink className="joiboy" to="/Cart"> Shopping Cart</NavLink> <span className='slash'>˃</span> <NavLink className="joiboy" to="/CheckOut">Checkout Details</NavLink> <span className='slash'>˃</span> <NavLink className="joiboy" to="/OrderComplete">Order Complete</NavLink>
                        </div>
                        <h2 className="mb-3">Transaction Failed!</h2>
                        <p><b>Reason</b> : {kakao}</p>
                        <div className="d-flex justify-content-center">
                            <div id="orderDownload2" className="billX">
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
                                {Object.values(order).map((i) => {
                                    return (
                                        <div key={i._id}>
                                            <hr />
                                            <div className="d-flex justify-content-between align-items-center my-2">
                                                <p className="m-0"><b>Id</b> : {i._id}</p>
                                                <p className="m-0"><b>Date</b> : {date}</p>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <p><b>Customer</b> : {i.user[0].fullname}</p>
                                                <p><b>Phone number</b> : {i.phonenumber}</p>
                                            </div>
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
                                                        <td><b>{VND.format(fulltotal)}</b></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            {i.shippingfee !== 0 ? (
                                                <p style={{ color: "gray", textAlign: "start", fontSize: 14 }}>This order already contain {VND.format(i.shippingfee)} shipping fee!</p>
                                            ) : null}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 d-flex" style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 10 }}>
                        <div className="d-flex align-items-center" style={{ gap: 30 }}>
                            <NavLink to="/" className="returnP">Return to homepage ➜</NavLink>
                            <button onClick={() => downloadOrder2()} className="buttonDownL">
                                <svg style={{ width: 20, height: 20 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" /></svg>
                                <p className="m-0">Download order</p>
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="pb-3 businessWay">
                        <NavLink className="joiboy" to="/Cart"> Shopping Cart</NavLink> <span className='slash'>˃</span> <NavLink className="joiboy" to="/CheckOut">Checkout Details</NavLink> <span className='slash'>˃</span> <NavLink className="joiboy" to="/OrderComplete">Order Complete</NavLink>
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
                            {Object.values(order).map((i) => {
                                return (
                                    <div key={i._id}>
                                        <hr />
                                        <div className="d-flex justify-content-between align-items-center my-2">
                                            <p className="m-0"><b>Id</b> : {i._id}</p>
                                            <p className="m-0"><b>Date</b> : {date}</p>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <p><b>Customer</b> : {i.user[0].fullname}</p>
                                            <p><b>Phone number</b> : {i.phonenumber}</p>
                                        </div>
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
                                                    <td><b>{VND.format(fulltotal)}</b></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        {i.shippingfee !== 0 ? (
                                            <p style={{ color: "gray", textAlign: "start", fontSize: 14 }}>This order already contain {VND.format(i.shippingfee)} shipping fee!</p>
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
            )}
        </>
    )
}
export default TransactionUI