import { useEffect } from "react";
import GetOrder from "./GetOrder";
import GetOrderHistory from "./GetOrderHistory";

function MainOrder() {
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
    }
    return (
        <>
            <div className="myDIVdad">
                <div style={{ gap: 5 + "%" }} id="myDIV2" className="d-flex align-items-center">
                    <button id="defaultOpen2" className="MBbutton2 active2" onClick={(e) => openCity2(e, 'cartactive')}><p >Cart Active</p></button>
                    <button className="MBbutton2" onClick={(e) => openCity2(e, 'carthistory')}><p>Cart History</p></button>
                </div>
                <div></div>
            </div>
            <div id="cartactive" className="tabcontent2">
                <div className="pt-4">
                    <GetOrder />
                </div>
            </div>

            <div id="carthistory" className="tabcontent2">
                <div className="pt-4">
                    <GetOrderHistory />
                </div>
            </div>
        </>
    )
}
export default MainOrder