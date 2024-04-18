import { useEffect, useState } from "react";
import GetOrder from "./GetOrder";
import GetOrderHistory from "./GetOrderHistory";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";

function MainOrder() {
    const cookies = new Cookies()
    const token = cookies.get("TOKEN")
    const decode = jwtDecode(token)
    const [DateInput, setDateInput] = useState()
    const [DateInput2, setDateInput2] = useState()
    const [activeFilter, setActiveFilter] = useState()
    const [historyFilter, setHistoryFilter] = useState()
    const [detectChange, setDetectChange] = useState(true)

    useEffect(() => {
        document.getElementById("defaultOpen2").click();
    }, [])

    function openCity2(evt, cityName) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent2");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("MBbutton2");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active2", "");
        }
        document.getElementById(cityName).style.display = "block";
        evt.currentTarget.className += " active2";
        if (document.getElementById("cartactive").getAttribute("style").indexOf("display: block") !== -1) {
            setDetectChange(true)
        } else {
            setDetectChange(false)
        }
    }
    return (
        <>
            <div className="myDIVdad">
                <div style={{ gap: 5 + "%" }} id="myDIV2" className="d-flex align-items-center">
                    <button id="defaultOpen2" className="MBbutton2 active2" onClick={(e) => openCity2(e, 'cartactive')}><p >Order Active</p></button>
                    <button className="MBbutton2" onClick={(e) => openCity2(e, 'carthistory')}><p>Order History</p></button>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    {detectChange ? (
                        <>
                            {navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1 ? (
                                <input onInput={(e) => setDateInput(e.target.value)} className="safari2" type='date' placeholder="📅" required />
                            ) : (
                                <input style={{ width: 170, height: 40 }} onInput={(e) => setDateInput(e.target.value)} type='date' required />
                            )}
                            <select onChange={(e) => setActiveFilter(e.target.value)}>
                                <option value="">All</option>
                                <option value={1}>Pending</option>
                                <option value={2}>Accept</option>
                                {decode.userRole === 3 ? (
                                    <option value={4}>Cancel pending</option>
                                ) : null}
                                <option value={5.1}>Shipping</option>
                            </select>
                        </>
                    ) : (
                        <>
                            {navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1 ? (
                                <input onInput={(e) => setDateInput2(e.target.value)} className="safari2" type='date' placeholder="📅" required />
                            ) : (
                                <input style={{ width: 170, height: 40 }} onInput={(e) => setDateInput2(e.target.value)} type='date' required />
                            )}
                            <select onChange={(e) => setHistoryFilter(e.target.value)}>
                                <option value="">All</option>
                                <option value={3}>Deny</option>
                                <option value={5}>Complete</option>
                                <option value={6}>Cancel</option>
                            </select>
                        </>
                    )}
                </div>
            </div>
            <div id="cartactive" className="tabcontent2">
                <div className="pt-4">
                    <GetOrder DateInput={DateInput} filter={activeFilter} />
                </div>
            </div>

            <div id="carthistory" className="tabcontent2">
                <div className="pt-4">
                    <GetOrderHistory DateInput={DateInput2} filter={historyFilter} />
                </div>
            </div>
        </>
    )
}
export default MainOrder