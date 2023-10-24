import { useEffect, useState } from "react";
import GetBooking from "./GetBooking";
import BookingHistory from "./BookingHistory";
import Modal from 'react-modal';

function MainBooking() {
    const [modalOpenAdmin, setModalOpenAdmin] = useState(false);
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
                    <button id="defaultOpen" className="MBbutton active" onClick={(e) => openCity(e, 'London')}><p >Booking Table</p></button>
                    <button className="MBbutton" onClick={(e) => openCity(e, 'Tokyo')}><p>Booking History</p></button>
                </div>
                <button onClick={() => setModalOpenAdmin(true)} className="btn btn-primary">🔎 Booking</button>
            </div>
            <div id="London" className="tabcontent">
                <div className="pt-4">
                    <GetBooking />
                </div>
            </div>

            <div id="Tokyo" className="tabcontent">
                <div className="pt-4">
                    <BookingHistory />
                </div>
            </div>
        </>
    )
}
export default MainBooking