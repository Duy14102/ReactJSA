import axios from "axios";
import { useEffect, useState } from "react";
import HeroChange from "../outOfBorder/HeroChange";
import AboutChange from "../outOfBorder/AboutChange";
import MenuChange from "../outOfBorder/MenuChange";
import FooterChange from "../outOfBorder/FooterChange";

function MainUiux() {
    const [data, setData] = useState([])
    useEffect(() => {
        document.getElementById("defaultOpen9").click();
        const configuration = {
            method: "get",
            url: "http://localhost:3000/GetHeroManager",
        }
        axios(configuration)
            .then((res) => {
                setData(res.data.data);
            }).catch((err) => {
                console.log(err);
            })
    }, [])

    function openCity9(evt, cityName) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent9");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("MBbutton9");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active9", "");
        }
        document.getElementById(cityName).style.display = "block";
        evt.currentTarget.className += " active9";
    }
    return (
        <>
            <div className="myDIVdad">
                <div style={{ gap: 5 + "%" }} id="myDIV9" className="d-flex align-items-center">
                    <button id="defaultOpen9" className="MBbutton9 active9" onClick={(e) => openCity9(e, 'hero')}><p >Hero</p></button>
                    <button className="MBbutton9" onClick={(e) => openCity9(e, 'About')}><p>About</p></button>
                    <button className="MBbutton9" onClick={(e) => openCity9(e, 'Menu')}><p>Menu</p></button>
                    <button className="MBbutton9" onClick={(e) => openCity9(e, 'Footer')}><p>Footer</p></button>
                </div>
                <div className="d-none"></div>
            </div>
            <div id="hero" className="tabcontent9">
                <div className="pt-4">
                    <HeroChange data={data} />
                </div>
            </div>

            <div id="About" className="tabcontent9">
                <div className="pt-4">
                    <AboutChange data={data} />
                </div>
            </div>
            <div id="Menu" className="tabcontent9">
                <div className="pt-4">
                    <MenuChange data={data} />
                </div>
            </div>
            <div id="Footer" className="tabcontent9">
                <div className="pt-4">
                    <FooterChange data={data} />
                </div>
            </div>
        </>
    )
}
export default MainUiux