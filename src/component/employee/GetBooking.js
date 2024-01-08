import axios from "axios"
import $ from 'jquery'
import { useState, useEffect, useRef } from "react"
import ReactPaginate from "react-paginate";
import Modal from 'react-modal';
import Swal from "sweetalert2";
import socketIOClient from "socket.io-client";

function GetTable({ decode }) {
    const [booking, setBooking] = useState([])
    const [ModalData, setModalData] = useState([])
    const [GetTable, setGetTable] = useState([])
    const [TableId, setTableId] = useState()
    const [modalOpenDetail, setModalOpenDetail] = useState(false);
    const [Denyreason, setDenyreason] = useState("")
    const [correct, setCorrect] = useState(false)
    const [deny, setDeny] = useState(false)
    const [CheckTableId, setCheckTableId] = useState(false)
    const [newOrder, setNewOrder] = useState(false)
    const [cancelOrder, setCancelOrder] = useState(false)
    const [denyOrder, setDenyOrder] = useState(false)
    const socketRef = useRef();

    const deliverEmployee = { id: decode.userId, email: decode.userEmail }
    const takeEmployee = []
    takeEmployee.push(deliverEmployee)

    const [pageCount, setPageCount] = useState(6);
    const currentPage = useRef();
    const limit = 8

    function HandleNew(countTabs) {
        if (countTabs === "booking") {
            localStorage.removeItem("CountNewBook")
        }
        getPagination()
        setNewOrder(true)
    }

    function HandleCancel(countTabs) {
        if (countTabs === "booking") {
            localStorage.removeItem("CountNewBook")
        }
        getPagination()
        setCancelOrder(true)
    }

    function HandleDeny(countTabs) {
        if (countTabs === "booking") {
            localStorage.removeItem("CountNewBook")
        }
        getPagination()
        setDenyOrder(true)
    }

    useEffect(() => {
        if (newOrder) {
            setTimeout(() => {
                setNewOrder(false)
            }, 1500);
        }
        if (cancelOrder) {
            setTimeout(() => {
                setCancelOrder(false)
            }, 1500);
        }
    }, [newOrder, cancelOrder])

    function Success() {
        Swal.fire(
            'Successfully!',
            '',
            'success'
        ).then(function () {
            window.location.reload()
        })
    }

    function Fail() {
        Swal.fire(
            'Fail!',
            '',
            'error'
        )
    }

    useEffect(() => {
        const countTabs = localStorage.getItem('tabs')
        currentPage.current = 1;
        getPagination()
        getTableActive()

        socketRef.current = socketIOClient.connect("http://localhost:3000")

        socketRef.current.on('AddTableByHandSuccess', dataGot => {
            getTableActive()
        })

        socketRef.current.on('AddNewBookingSuccess', dataGot => {
            HandleNew(countTabs)
        })

        socketRef.current.on('CancelBookingSuccess', dataGot => {
            HandleCancel(countTabs)
        })

        socketRef.current.on('DenyBookingSuccess', dataGot => {
            if (decode.userId === dataGot.mag) {
                Success()
            } else {
                HandleDeny(countTabs)
            }
        })

        socketRef.current.on('DenyBookingFail', dataGot => {
            if (decode.userId === dataGot.mag) {
                Fail()
            }
        })

        socketRef.current.on('AddTableCustomerSuccess', dataGot => {
            if (decode.userId === dataGot.mag) {
                Success()
            } else {
                getPagination()
                getTableActive()
            }
        })

        socketRef.current.on('AddTableCustomerFail', dataGot => {
            if (decode.userId === dataGot.mag) {
                Fail()
            }
        })

        socketRef.current.on('ChangeTableNameSuccess', dataGot => {
            getTableActive()
        })

        socketRef.current.on('DeleteTableSuccess', dataGot => {
            getTableActive()
        })

        socketRef.current.on('ChangeTableSuccess', dataGot => {
            getTableActive()
        })

        socketRef.current.on('CheckoutNormalSuccess', dataGot => {
            getTableActive()
        })

        socketRef.current.on('CheckoutBookingSuccess', dataGot => {
            getPagination()
            getTableActive()
        })

        socketRef.current.on('QrCodeTableActiveSuccess', dataGot => {
            getTableActive()
        })

        socketRef.current.on('Checkout4QrSuccess', dataGot => {
            getTableActive()
        })

        return () => {
            socketRef.current.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (newOrder) {
            setTimeout(() => {
                setNewOrder(false)
            }, 1500);
        }
        if (cancelOrder) {
            setTimeout(() => {
                setCancelOrder(false)
            }, 1500);
        }
        if (denyOrder) {
            setTimeout(() => {
                setDenyOrder(false)
            }, 1500);
        }
    }, [newOrder, cancelOrder, denyOrder])

    function handlePageClick(e) {
        currentPage.current = e.selected + 1
        getPagination();
    }

    function getPagination() {
        const configuration = {
            method: "get",
            url: "http://localhost:3000/GetBookingByStatus",
            params: {
                page: currentPage.current,
                limit: limit
            }
        };
        axios(configuration)
            .then((result) => {
                setBooking(result.data.results.result);
                setPageCount(result.data.results.pageCount)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function getTableActive() {
        const configuration = {
            method: "get",
            url: "http://localhost:3000/GetAllTableActive",
        }
        axios(configuration)
            .then((res) => {
                setGetTable(res.data.data)
            }).catch((err) => {
                console.log(err);
            })
    }

    const addTableBooking = (e, id, userX) => {
        e.preventDefault()
        let selText = $("#box1Y option:selected").text();
        if (TableId) {
            setCheckTableId(false)
            const data = { tableid: TableId, tablename: selText, cusid: id, userid: userX, mag: decode.userId }
            socketRef.current.emit('AddTableCustomerSocket', data)
        } else {
            setCheckTableId(true)
        }
    }

    const denybooking = (e, id, userX) => {
        e.preventDefault()
        const data = { id: id, status: 4, denyreason: Denyreason, employee: takeEmployee, mag: decode.userId, userid: userX }
        socketRef.current.emit('DenyBookingCustomerSocket', data)
    }

    const date = new Date(ModalData.createdAt).toLocaleDateString()
    const time = new Date(ModalData.createdAt).toLocaleTimeString()
    const date2 = new Date(ModalData.date).toLocaleDateString()
    const time2 = new Date(ModalData.date).toLocaleTimeString()
    const datemodal = date + " - " + time
    const datemodal2 = date2 + " - " + time2
    return (
        <>
            <div className="fatherNewUserNoti">
                {newOrder ? (
                    <div className="newUserNoti" style={{ backgroundColor: "#03ba5f" }}>
                        <h6>✓ New booking!</h6>
                    </div>
                ) : null}
                {cancelOrder ? (
                    <div className="newUserNoti" style={{ backgroundColor: "tomato" }}>
                        <h6>X Booking cancel!</h6>
                    </div>
                ) : null}
                {denyOrder ? (
                    <div className="newUserNoti" style={{ backgroundColor: "tomato" }}>
                        <h6>X Booking deny!</h6>
                    </div>
                ) : null}
            </div>
            <table className='table table-bordered text-center'>
                <thead>
                    <tr className="text-white text-center" style={{ background: "#374148" }}>
                        <th >Name</th>
                        <th className="thhuhu">Phone number</th>
                        <th className="thhuhu">Date</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                {booking.map(i => {
                    const date = new Date(i.createdAt).toLocaleDateString()
                    const time = new Date(i.createdAt).toLocaleTimeString()
                    const datetime = date + " - " + time
                    var stau = ""
                    if (i.status === 1) {
                        stau = "Pending"
                    } else if (i.status === 2) {
                        stau = "Serving"
                    }
                    return (
                        <tbody key={i._id}>
                            <tr style={{ background: "#2C343A", color: "lightgray", verticalAlign: "middle" }}>
                                <td>{i.customer.fullname}</td>
                                <td className="thhuhu">{i.customer.phonenumber}</td>
                                <td className="thhuhu">{datetime}</td>
                                <td>{stau}</td>
                                <td><button onClick={() => { setModalData(i); setModalOpenDetail(true) }} className='btn btn-success'>Detail</button></td>
                            </tr>
                        </tbody>
                    )
                })}
            </table>
            <ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="< previous"
                renderOnZeroPageCount={null}
                marginPagesDisplayed={2}
                containerClassName="pagination justify-content-center text-nowrap"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                activeClassName="active"
                forcePage={currentPage.current - 1}
            />
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
                        height: "60vh",
                        zIndex: 999
                    },
                }}>
                <h2 className='text-center'>Booking Detail</h2>
                <div className="coverNOut">
                    <p className="m-0"><b>Id</b> : {ModalData._id}</p>
                    <p className="m-0"><b>Date</b> : {datemodal}</p>
                </div>
                <hr />
                <div className="hugeImpace">
                    <p><b>Name</b> : {ModalData.customer?.fullname}</p>
                    <p><b>Phone Number</b> : {ModalData.customer?.phonenumber}</p>
                    <p><b>People</b> : {ModalData.people}</p>
                    <p><b>Date Arrived</b> : {datemodal2}</p>
                    {ModalData.status === 1 ? (
                        <p><b>Status</b> : Pending</p>
                    ) : ModalData.status === 2 ? (
                        <p><b>Status</b> : Serving</p>
                    ) : null}
                    <p><b>Note</b> : </p>
                    <textarea className="contactMessage" style={{ pointerEvents: "none" }} defaultValue={ModalData.message} />
                    {ModalData.status === 1 ? (
                        <div className="d-flex justify-content-around pt-2">
                            {correct ? (
                                <>
                                    <button className="btn btn-success">Approve</button>
                                    <button style={{ pointerEvents: "none", opacity: 0.5 }} className="btn btn-danger">Deny</button>
                                </>
                            ) : deny ? (
                                <>
                                    <button style={{ pointerEvents: "none", opacity: 0.5 }} className="btn btn-success">Approve</button>
                                    <button className="btn btn-danger">Deny</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => setCorrect(true)} className="btn btn-success">Approve</button>
                                    <button onClick={() => setDeny(true)} className="btn btn-danger">Deny</button>
                                </>
                            )}
                        </div>
                    ) : null}
                </div>
                {correct ? (
                    <div className="pt-3">
                        <p>Choosing Table : </p>
                        <form onSubmit={(e) => addTableBooking(e, ModalData._id, ModalData.customer.id)}>
                            <div className="ytui" style={{ gap: 2 + "%" }}>
                                <select id="box1Y" onInput={(e) => setTableId(e.target.value)} className="neul" required>
                                    <option selected disabled hidden>Choose Table</option>
                                    {Object.values(GetTable).map((i) => {
                                        return (
                                            <option value={i._id} key={i._id}>{i.tablename}</option>
                                        )
                                    })}
                                </select>
                                {CheckTableId ? (
                                    <p className="m-0 neul text-danger text-nowrap">Table need to be choose!</p>
                                ) : null}
                            </div>
                            <div style={{ gap: 1 + "%" }} className="d-flex mt-3">
                                <button type="submit" className="btn btn-primary ">Comfirm</button>
                                <button onClick={() => { setCheckTableId(false); setCorrect(false) }} className="btn btn-secondary ">Cancel</button>
                            </div>
                        </form>
                    </div>
                ) : deny ? (
                    <div className="pt-3">
                        <p>Reason why deny : </p>
                        <form onSubmit={(e) => denybooking(e, ModalData._id, ModalData.customer.id)}>
                            <textarea onChange={(e) => setDenyreason(e.target.value)} className="textDeny" required />
                            <div style={{ gap: 1 + "%" }} className="d-flex mt-2">
                                <button type="submit" className="btn btn-primary ">Comfirm</button>
                                <button onClick={() => setDeny(false)} className="btn btn-secondary ">Cancel</button>
                            </div>
                        </form>
                    </div>
                ) : null}
                <button className='closeModal' onClick={() => setModalOpenDetail(false)}>x</button>
            </Modal>
        </>
    )
}
export default GetTable