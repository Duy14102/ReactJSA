import { useEffect, useState } from "react";
import GetUsingTable from "./GetUsingTable";
import GetHistoryTable from "./GetHistoryTable";
import Modal from 'react-modal';
import axios from "axios";
import Swal from "sweetalert2";

function MainTable() {
    const [modalOpenDetail, setModalOpenDetail] = useState(false);
    const [tablename, setTablename] = useState()
    useEffect(() => {
        document.getElementById("defaultOpen3").click();
    }, [])

    function openCity3(evt, cityName) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent3");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("MBbutton3");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active3", "");
        }
        document.getElementById(cityName).style.display = "block";
        evt.currentTarget.className += " active3";
    }

    const addtable = (e) => {
        e.preventDefault()
        const configuration = {
            method: "post",
            url: "http://localhost:3000/AddTableByHand",
            data: {
                tablename: tablename
            }
        }
        axios(configuration)
            .then(() => {
                Swal.fire(
                    'Add Table Successfully!',
                    '',
                    'success'
                ).then(function () {
                    window.location.reload()
                })
            }).catch(() => {
                Swal.fire(
                    'Add Table Fail!',
                    '',
                    'error'
                ).then(function () {
                    window.location.reload()
                })
            })
    }
    return (
        <>
            <div className="myDIVdad">
                <div style={{ gap: 5 + "%" }} id="myDIV3" className="d-flex align-items-center">
                    <button id="defaultOpen3" className="MBbutton3 active3" onClick={(e) => openCity3(e, 'tbactive')}><p >Table Active</p></button>
                    <button className="MBbutton3" onClick={(e) => openCity3(e, 'tbhistory')}><p>Table History</p></button>
                </div>
                <button onClick={() => setModalOpenDetail(true)} className="btn btn-primary">Add Table</button>
            </div>
            <div id="tbactive" className="tabcontent3">
                <div className="pt-4">
                    <GetUsingTable />
                </div>
            </div>

            <div id="tbhistory" className="tabcontent3">
                <div className="pt-4">
                    <GetHistoryTable />
                </div>
            </div>
            <Modal isOpen={modalOpenDetail} onRequestClose={() => setModalOpenDetail(false)} ariaHideApp={false}
                style={{
                    overlay: {
                        position: 'fixed',
                        zIndex: 998,
                        backgroundColor: 'rgb(33 33 33 / 75%)'
                    },
                    content: {
                        top: "50%",
                        left: "50%",
                        right: "auto",
                        bottom: "auto",
                        marginRight: "-50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "white",
                        width: "70vw",
                        zIndex: 999
                    },
                }}>
                <h2 className='text-center'>Add Table</h2>
                <form onSubmit={(e) => addtable(e)}>
                    <label htmlFor="putTheFuckName">Table Name</label>
                    <input id="putTheFuckName" className="textDeny" onChange={(e) => setTablename(e.target.value)} required />
                    <div className="pt-3 d-flex justify-content-around align-items-center">
                        <button onClick={() => setModalOpenDetail(false)} type="button" className="btn btn-secondary">Cancel</button>
                        <button type="submit" className="btn btn-primary">Confirm</button>
                    </div>
                </form>
                <button className='closeModal' onClick={() => setModalOpenDetail(false)}>x</button>
            </Modal>
        </>
    )
}
export default MainTable