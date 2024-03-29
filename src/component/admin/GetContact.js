import { useState, useEffect, useRef } from "react";
import axios from 'axios';
import ReactPaginate from "react-paginate";
import Modal from 'react-modal';
import Swal from "sweetalert2";
import socketIOClient from "socket.io-client";

function GetContact({ decode }) {
    const [ModalData, setModalData] = useState([])
    var [modalOpenDetail2, setModalOpenDetail2] = useState(false);
    const [newContact, setNewContact] = useState(false)
    const [finishTask, setFinishTask] = useState(false)
    const [GetContact, setGetContact] = useState([])
    const socketRef = useRef();
    const [pageCount, setPageCount] = useState(6);
    const currentPage = useRef();
    const limit = 8

    useEffect(() => {
        currentPage.current = 1;
        getPagination()

        socketRef.current = socketIOClient.connect("https://eatcom.onrender.com")

        socketRef.current.on('AddContactSuccess', dataGot => {
            getPagination()
            setNewContact(true)
            const countTabs = localStorage.getItem('tabs')
            if (countTabs === "dashboard") {
                localStorage.removeItem("CountNewContact")
            }
        })

        socketRef.current.on('FinishTaskSuccess', dataGot => {
            getPagination()
            setFinishTask(true)
            if (localStorage.getItem('tabs') === "dashboard") {
                localStorage.removeItem("CountNewTask")
            }
        })

        socketRef.current.on('DeleteContactSuccess', dataGot => {
            if (dataGot.mag === decode.userId) {
                Swal.fire(
                    'Delete Success!',
                    '',
                    'success'
                ).then(function () {
                    window.location.reload();
                })
            } else {
                getPagination()
            }
        })

        socketRef.current.on('DeleteContactFail', dataGot => {
            if (dataGot.mag === decode.userId) {
                Swal.fire(
                    'Delete Fail!',
                    '',
                    'error'
                )
            }
        })

        return () => {
            socketRef.current.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (newContact) {
            setTimeout(() => {
                setNewContact(false)
            }, 1500);
        }
        if (finishTask) {
            setTimeout(() => {
                setFinishTask(false)
            }, 1500);
        }
    }, [newContact, finishTask])

    function handlePageClick(e) {
        currentPage.current = e.selected + 1
        getPagination();
    }

    function getPagination() {
        const configuration = {
            method: "get",
            url: "https://eatcom.onrender.com/GetContact",
            params: {
                page: currentPage.current,
                limit: limit
            }
        };
        axios(configuration)
            .then((result) => {
                setGetContact(result.data.results.result);
                setPageCount(result.data.results.pageCount)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const DeleteContact = (e) => {
        const data = { id: e, mag: decode.userId }
        socketRef.current.emit('DeleteContactSocket', data)
    }

    const date = new Date(ModalData.createdAt).toLocaleDateString()
    const time = new Date(ModalData.createdAt).toLocaleTimeString()
    const datemodal = date + " - " + time
    return (
        <>
            <div className="fatherNewUserNoti">
                {newContact ? (
                    <div className="newUserNoti" style={{ backgroundColor: "#03ba5f" }}>
                        <h6>✓ New contact added!</h6>
                    </div>
                ) : null}
                {finishTask ? (
                    <div className="newUserNoti" style={{ backgroundColor: "#fea116" }}>
                        <h6>✓ Task finished!</h6>
                    </div>
                ) : null}
            </div>
            {GetContact.length > 0 ? (
                <>
                    <table className='table table-bordered solotable'>
                        <thead>
                            <tr className='text-center text-white' style={{ background: "#374148" }}>
                                <th>Name</th>
                                <th className="thhuhu">Email</th>
                                <th>Date</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {GetContact.map((i) => {
                                const date = new Date(i.createdAt).toLocaleDateString()
                                const time = new Date(i.createdAt).toLocaleTimeString()
                                const datetime = date + " - " + time
                                return (
                                    <tr key={i._id} className='text-center' style={{ background: "#2C343A", color: "lightgray" }}>
                                        <td>{i.name}</td>
                                        <td className="thhuhu">{i.email}</td>
                                        <td>{datetime}</td>
                                        <td><button onClick={() => { setModalData(i); setModalOpenDetail2(true) }} className='btn btn-success'>Detail</button></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel=">"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={5}
                        pageCount={pageCount}
                        previousLabel="<"
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
                    <Modal id="otpModal" isOpen={modalOpenDetail2} onRequestClose={() => setModalOpenDetail2(false)} ariaHideApp={false}
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
                                height: "45vh",
                                zIndex: 999
                            },
                        }}>
                        <h2 className='text-center'>Contact Details</h2>
                        <div className="coverNOut">
                            <p className="m-0"><b>Date</b> : {datemodal}</p>
                            <button onClick={() => DeleteContact(ModalData._id)} className="btn btn-danger thhuhu">Delete</button>
                        </div>
                        <hr />
                        <div className="hugeImpace">
                            <p><b>Name</b> : {ModalData.name}</p>
                            <p><b>Email</b> : {ModalData.email}</p>
                            <p><b>Title</b> : {ModalData.title}</p>
                            <textarea className="contactMessage" defaultValue={ModalData.message} />
                        </div>
                        <div className="d-flex justify-content-center">
                            <button onClick={() => DeleteContact(ModalData._id)} className="btn btn-danger deleteTH">Delete</button>
                        </div>
                        <button className='closeModal' onClick={() => setModalOpenDetail2(false)}>x</button>
                    </Modal>
                </>
            ) : (
                <p className="text-center" style={{ color: "lightgray" }}>Contact list empty!</p>
            )}
        </>
    )
}
export default GetContact