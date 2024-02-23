import { useEffect, useState, useRef } from "react";
import GetUsingTable from "./GetUsingTable";
import GetHistoryTable from "./GetHistoryTable";
import Modal from 'react-modal';
import Swal from "sweetalert2";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import socketIOClient from "socket.io-client";

function MainTable() {
    const cookies = new Cookies()
    const token = cookies.get("TOKEN")
    const decode = jwtDecode(token)
    const socketRef = useRef();
    const [modalOpenDetail, setModalOpenDetail] = useState(false);
    const [deleteTable, setDeleteTable] = useState(false)
    const [changeNameTable, setChangeNameTable] = useState(false)
    const [changeTable, setChangeTable] = useState(false)
    const [newTable, setNewTable] = useState(false)
    const [completeTable, setCompleteTable] = useState(false)
    const [tablename, setTablename] = useState()

    function HandleDeleteTable(countTabs) {
        if (countTabs === "table") {
            localStorage.removeItem("CountNewTable")
        }
        setDeleteTable(true)
    }

    function HandleChangeNameTable(countTabs) {
        if (countTabs === "table") {
            localStorage.removeItem("CountNewTable")
        }
        setChangeNameTable(true)
    }

    function HandleChangeTable(countTabs) {
        if (countTabs === "table") {
            localStorage.removeItem("CountNewTable")
        }
        setChangeTable(true)
    }

    function HandleNew(countTabs) {
        if (countTabs === "table") {
            localStorage.removeItem("CountNewTable")
        }
        setNewTable(true)
    }

    function HandleComplete(countTabs) {
        if (countTabs === "table") {
            localStorage.removeItem("CountNewTable")
        }
        setCompleteTable(true)
    }

    useEffect(() => {
        const countTabs = localStorage.getItem('tabs')
        document.getElementById("defaultOpen3").click();

        socketRef.current = socketIOClient.connect("http://localhost:3000")

        socketRef.current.on('AddTableByHandSuccess', dataGot => {
            if (dataGot?.mag === decode.userId) {
                Swal.fire(
                    'Add Table Successfully!',
                    '',
                    'success'
                ).then(function () {
                    window.location.reload()
                })
            } else {
                HandleNew(countTabs)
            }
        })

        socketRef.current.on('AddTableByHandFail', dataGot => {
            if (dataGot?.mag === decode.userId) {
                Swal.fire(
                    'Add Table Fail!',
                    '',
                    'error'
                )
            }
        })

        socketRef.current.on('DeleteTableSuccess', dataGot => {
            if (dataGot?.mag !== decode.userId) {
                HandleDeleteTable(countTabs)
            }
        })

        socketRef.current.on('ChangeTableNameSuccess', dataGot => {
            if (dataGot?.mag !== decode.userId) {
                HandleChangeNameTable(countTabs)
            }
        })

        socketRef.current.on('ChangeTableSuccess', dataGot => {
            if (dataGot?.mag !== decode.userId) {
                HandleChangeTable(countTabs)
            }
        })

        socketRef.current.on('AddTableCustomerSuccess', dataGot => {
            if (dataGot?.mag !== decode.userId) {
                HandleNew(countTabs)
            }
        })

        socketRef.current.on('CheckoutNormalSuccess', dataGot => {
            if (dataGot?.mag !== decode.userId) {
                HandleComplete(countTabs)
            }
        })

        socketRef.current.on('CheckoutBookingSuccess', dataGot => {
            if (dataGot?.mag !== decode.userId) {
                HandleComplete(countTabs)
            }
        })

        socketRef.current.on('QrCodeTableActiveSuccess', dataGot => {
            HandleNew(countTabs)
        })

        socketRef.current.on('Checkout4QrSuccess', dataGot => {
            HandleComplete(countTabs)
        })

        return () => {
            socketRef.current.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (deleteTable) {
            setTimeout(() => {
                setDeleteTable(false)
            }, 1500);
        }
        if (changeNameTable) {
            setTimeout(() => {
                setChangeNameTable(false)
            }, 1500);
        }
        if (changeTable) {
            setTimeout(() => {
                setChangeTable(false)
            }, 1500);
        }
        if (newTable) {
            setTimeout(() => {
                setNewTable(false)
            }, 1500);
        }
        if (completeTable) {
            setTimeout(() => {
                setCompleteTable(false)
            }, 1500);
        }
    }, [deleteTable, changeNameTable, changeTable, newTable, completeTable])

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
        const data = { tablename: tablename, mag: decode.userId }
        socketRef.current.emit('AddTableByHandSocket', data)
    }
    return (
        <>
            <div className="fatherNewUserNoti">
                {newTable ? (
                    <div className="newUserNoti" style={{ backgroundColor: "#03ba5f" }}>
                        <h6>✓ Table updated!</h6>
                    </div>
                ) : null}
                {completeTable ? (
                    <div className="newUserNoti" style={{ backgroundColor: "#fea116" }}>
                        <h6>✓ Table completed!</h6>
                    </div>
                ) : null}
                {deleteTable ? (
                    <div className="newUserNoti" style={{ backgroundColor: "tomato" }}>
                        <h6>X Table deleted!</h6>
                    </div>
                ) : null}
                {changeNameTable ? (
                    <div className="newUserNoti" style={{ backgroundColor: "#2298F1" }}>
                        <h6>✓ Table name changed!</h6>
                    </div>
                ) : null}
                {changeTable ? (
                    <div className="newUserNoti" style={{ backgroundColor: "#ff9999" }}>
                        <h6>✓ Table changed!</h6>
                    </div>
                ) : null}
            </div>
            <div className="myDIVdad">
                <div style={{ gap: 5 + "%" }} id="myDIV3" className="d-flex align-items-center">
                    <button id="defaultOpen3" className="MBbutton3 active3" onClick={(e) => openCity3(e, 'tbactive')}><p >Table Active</p></button>
                    <button className="MBbutton3" onClick={(e) => openCity3(e, 'tbhistory')}><p>Table History</p></button>
                </div>
                {decode.userRole === 3 ? (
                    <button onClick={() => setModalOpenDetail(true)} className="btn btn-primary">➕ Table</button>
                ) : null}
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