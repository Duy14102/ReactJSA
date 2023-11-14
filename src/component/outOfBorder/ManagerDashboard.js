import axios from "axios"
import { useEffect, useState } from "react"
import Givetask from "../admin/MainGiveTask"
import GetContact from "../admin/GetContact"
import RevenueDay from "../outOfBorder/RevenueDay"
import RevenueMonth from "../outOfBorder/RevenueMonth"
import RevenueYear from "../outOfBorder/RevenueYear"

function ManagerDashboard() {
    const [modalOpenAdmin, setModalOpenAdmin] = useState(false);
    const [CountData, setCountData] = useState()
    const [load1, setLoad1] = useState(false)
    const [load2, setLoad2] = useState(false)
    const [load3, setLoad3] = useState(false)
    useEffect(() => {
        document.getElementById("defaultMe").click();

        const configuration = {
            method: "get",
            url: "http://localhost:3000/GetData4Admin",
        }
        axios(configuration)
            .then((res) => {
                setCountData(res.data)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

    function openMe(evt, cityName) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("contentMe");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("buttonMe");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" activeMe", "");
        }
        document.getElementById(cityName).style.display = "block";
        evt.currentTarget.className += " activeMe";
        if (document.getElementById("IncomeDay").style.display === "block") {
            setLoad1(true)
        }
        if (document.getElementById("IncomeMonth").style.display === "block") {
            setLoad2(true)
        }
        if (document.getElementById("IncomeYear").style.display === "block") {
            setLoad3(true)
        }
    }
    return (
        <>
            <div className="grid pt-4">
                <div className="card-verticle ">
                    <div className="card-small" style={{ background: "#2298F1" }}>
                        <span className="title">
                            Total Employee
                        </span>
                        <h2 className="text">{CountData?.userLength}</h2>
                        <hr />
                        <div className='d-flex justify-content-between'>
                            <p className='m-0 text-white'>1% increase</p>
                            <button onClick={() => setModalOpenAdmin(true)} className='text-white'>See all ˃˃</button>
                            {modalOpenAdmin ? (
                                <Givetask modalOpenAdmin={modalOpenAdmin} setModalOpenAdmin={setModalOpenAdmin} />
                            ) : null}
                        </div>
                    </div>
                </div>
                <div className="card-verticle">
                    <div className="card-small" style={{ background: "#66B92E" }}>
                        <span className="title">
                            Active Order
                        </span>
                        <h2 className="text">{CountData?.orderLength}</h2>
                        <hr />
                        <p className='m-0 text-white'>5% increase</p>
                    </div>
                </div>
                <div className="card-verticle">
                    <div className="card-small" style={{ background: "#FEA116" }}>
                        <span className="title">
                            Active Table
                        </span>
                        <h2 className="text">{CountData?.tableLength}</h2>
                        <hr />
                        <p className='m-0 text-white'>9% increase</p>
                    </div>
                </div>
                <div className="card-verticle">
                    <div className="card-small" style={{ background: "#ff9999" }}>
                        <div className='flexOverPage'>
                            <div>
                                <span className="title">Active Booking</span>
                                <h2 className="text text-center">{CountData?.actBookingLength}</h2>
                            </div>
                            <div>
                                <span className="title">Serving Booking</span>
                                <h2 className="text text-center">{CountData?.waitBookingLength}</h2>
                            </div>
                        </div>
                        <hr />
                        <p className='m-0 text-white'>1.5% increase</p>
                    </div>
                </div>
                <div className="card-verticle">
                    <div className="card-small" style={{ background: "#D65B4A" }}>
                        <span className="title">
                            Total Menu
                        </span>
                        <h2 className="text">{CountData?.menuLength}</h2>
                        <hr />
                        <p className='m-0 text-white'>0% increase</p>
                    </div>
                </div>
            </div>
            <div className='butItWrong'>
                <div className='bestie'>
                    <h4 className='text-center text-white'>Income</h4>
                    <div style={{ background: "#2C343A", borderRadius: 3 + "px" }}>
                        <div className='d-flex' style={{ gap: 1 + "%" }}>
                            <button id='defaultMe' className='btn btn-secondary w-100 buttonMe activeMe' onClick={(e) => openMe(e, 'IncomeDay')}>Day</button>
                            <button className='btn btn-secondary w-100 buttonMe' onClick={(e) => openMe(e, 'IncomeMonth')}>Month</button>
                            <button className='btn btn-secondary w-100 buttonMe' onClick={(e) => openMe(e, 'IncomeYear')}>Year</button>
                        </div>
                    </div>
                    <div id="IncomeDay" className="contentMe">
                        {load1 ? (
                            <RevenueDay />
                        ) : null}
                    </div>
                    <div id="IncomeMonth" className="contentMe">
                        {load2 ? (
                            <RevenueMonth />
                        ) : null}
                    </div>
                    <div id="IncomeYear" className="contentMe">
                        {load3 ? (
                            <RevenueYear />
                        ) : null}
                    </div>
                </div>
                <div className="bestie">
                    <h4 className='text-center text-white'>Contact</h4>
                    <GetContact />
                </div>
            </div>
        </>
    )
}
export default ManagerDashboard