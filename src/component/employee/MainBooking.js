import { useEffect, useState } from "react";
import GetBooking from "./GetBooking";
import BookingHistory from "./BookingHistory";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";

function MainBooking() {
    const cookies = new Cookies()
    const token = cookies.get("TOKEN")
    const decode = jwtDecode(token)
    const [dateInput, setDateInput] = useState()
    const [cityName, setCityName] = useState()

    useEffect(() => {
        document.getElementById("defaultOpen").click();
    }, [])

    function openCity(evt, cityName) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("MBbutton");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(cityName).style.display = "block";
        evt.currentTarget.className += " active";
    }

    return (
        <>
            <div className="myDIVdad">
                <div style={{ gap: 5 + "%" }} id="myDIV" className="d-flex align-items-center">
                    <button id="defaultOpen" className="MBbutton active" onClick={(e) => { openCity(e, 'London'); setCityName("London") }}><p >Booking Table</p></button>
                    <button className="MBbutton" onClick={(e) => { openCity(e, 'Tokyo'); setCityName("Tokyo") }}><p>Booking History</p></button>
                </div>
                {navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1 ? (
                    <input onInput={(e) => setDateInput(e.target.value)} className="safari2" type='date' placeholder="📅" required />
                ) : (
                    <input onInput={(e) => setDateInput(e.target.value)} style={{ width: 170, height: 40 }} type='date' required />
                )}
            </div>
            <div id="London" className="tabcontent">
                <div className="pt-4">
                    <GetBooking decode={decode} dateInput={dateInput} cityName={cityName} />
                </div>
            </div>

            <div id="Tokyo" className="tabcontent">
                <div className="pt-4">
                    <BookingHistory decode={decode} dateInput={dateInput} cityName={cityName} />
                </div>
            </div>
        </>
    )
}
export default MainBooking