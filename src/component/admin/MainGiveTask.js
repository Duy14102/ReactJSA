import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2';
import socketIOClient from "socket.io-client";

function MainGiveTask({ modalOpenAdmin, setModalOpenAdmin, decode }) {
    const [modalOpenAdmin2, setModalOpenAdmin2] = useState(false);
    const [modalOpenAdmin3, setModalOpenAdmin3] = useState(false);
    const [openGiveTask, setOpenGiveTask] = useState(false)
    const [taskData, setTaskData] = useState([])
    const [ModalData, setModalData] = useState([])
    const [data, setData] = useState([])
    const [Title, setTitle] = useState("")
    const [Message, setMessage] = useState("")
    const date = new Date().toLocaleDateString()
    const time = new Date().toLocaleTimeString()
    const datetime = date + " - " + time
    const Both = { title: Title, message: Message, date: datetime, status: 1, datefinish: null }
    const socketRef = useRef();

    const [pageCount, setPageCount] = useState(6);
    const currentPage = useRef();
    const limit = 8

    useEffect(() => {
        currentPage.current = 1;
        getPagination()

        socketRef.current = socketIOClient.connect("http://localhost:3000")

        socketRef.current.on('GiveTaskSuccess', dataGot => {
            if (dataGot.mag === decode.userId) {
                Swal.fire(
                    'Give Task Successfully!',
                    '',
                    'success'
                ).then(function () {
                    window.location.reload();
                })
            } else {
                getPagination()
            }
        })

        socketRef.current.on('GiveTaskFail', dataGot => {
            if (dataGot.mag === decode.userId) {
                Swal.fire(
                    'Give Task Fail!',
                    '',
                    'error'
                )
            }
        })

        socketRef.current.on('FinishTaskSuccess', dataGot => {
            getPagination()
            if (localStorage.getItem('tabs') === "dashboard") {
                localStorage.removeItem("CountNewTask")
            }
        })

        return () => {
            socketRef.current.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function handlePageClick(e) {
        currentPage.current = e.selected + 1
        getPagination();
    }

    const getPagination = () => {
        const configuration = {
            method: "get",
            url: "http://localhost:3000/GetEmploy4Mana",
            params: {
                page: currentPage.current,
                limit: limit
            },
        };
        axios(configuration)
            .then((result) => {
                setData(result.data.results.result);
                setPageCount(result.data.results.pageCount)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const GiveTask = (e) => {
        e.preventDefault()
        const data = { id: ModalData._id, task: Both, mag: decode.userId }
        socketRef.current.emit('GiveTaskEmployeeSocket', data)
    }
    return (
        <>
            <Modal
                isOpen={modalOpenAdmin} onRequestClose={() => setModalOpenAdmin(false)} ariaHideApp={false}
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
                        height: "55vh",
                        zIndex: 999
                    },
                }}>
                <div className="text-center">
                    <h3>All Employee</h3>
                </div>
                <hr />
                <table className='table table-bordered solotable text-center mt-4' style={{ wordBreak: "break-word" }}>
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th className='thhuhu'>Fullname</th>
                            <th className='thhuhu'>Role</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((i) => {
                            var tookRole = ""
                            if (i.role === 2) {
                                tookRole = "Employee"
                            }
                            return (
                                <tr key={i._id}>
                                    <td>{i.email}</td>
                                    <td className='thhuhu'>{i.fullname}</td>
                                    <td className='thhuhu'>{tookRole}</td>
                                    <td><button onClick={() => { setModalOpenAdmin(false); setModalOpenAdmin2(true); setModalData(i) }} className='btn btn-success'>Detail</button></td>
                                </tr>
                            )
                        })}
                    </tbody>
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
                <button className='closeModal' onClick={() => setModalOpenAdmin(false)}>x</button>
            </Modal>
            <Modal
                isOpen={modalOpenAdmin2} onRequestClose={() => setModalOpenAdmin2(false)} ariaHideApp={false}
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
                        height: "55vh",
                        zIndex: 999
                    },
                }}>
                <div className='p-3'>
                    <div className='text-center'>
                        <h3>Employee Detail</h3>
                    </div>
                    <div className='hugeImpace'>
                        <p><b>Id</b> : {ModalData._id}</p>
                    </div>
                    <hr />
                    <div className='hudeImpace text-nowrap'>
                        <p><b>Email</b> : {ModalData.email}</p>
                        <p><b>Fullname</b> : {ModalData.fullname}</p>
                        <p><b>Phone Number</b> : {ModalData.phonenumber}</p>
                    </div>
                    <hr />
                    <div className='text-center'>
                        <h4>Task</h4>
                    </div>
                    <div className='text-end pb-2'>
                        <button onClick={() => setOpenGiveTask(true)} className='btn btn-info'>+Task</button>
                    </div>
                    {openGiveTask ? (
                        <>
                            <form onSubmit={(e) => GiveTask(e)}>
                                <label htmlFor='title'>Title</label>
                                <input value={Title} onChange={(e) => setTitle(e.target.value)} id='title' name='title' className="textDeny" required />
                                <label className='pt-3' htmlFor='message'>Message</label>
                                <textarea value={Message} onChange={(e) => setMessage(e.target.value)} id='message' className="textDeny" name='message' required />
                                <div className='d-flex justify-content-around pt-1'>
                                    <button type='button' onClick={() => setOpenGiveTask(false)} className='btn btn-secondary'>Cancel</button>
                                    <button type='submit' className='btn btn-success'>Confirm</button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <table className='table table-bordered solotable text-center'>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th className='thhuhu'>Date</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {ModalData.task?.map((a) => {
                                    var yup = ""
                                    if (a.task.status === 1) {
                                        yup = "Pending"
                                    } else if (a.task.status === 2) {
                                        yup = "Completed"
                                    }
                                    return (
                                        <tr key={a.id}>
                                            <td>{a.task.title}</td>
                                            <td className='thhuhu'>{a.task.date}</td>
                                            <td>{yup}</td>
                                            <td><button onClick={() => { setModalOpenAdmin2(false); setModalOpenAdmin3(true); setTaskData(a) }} className='btn btn-success'>Detail</button></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
                <button className='closeModal' onClick={() => { setModalOpenAdmin2(false); setModalOpenAdmin(true) }}>x</button>
            </Modal>
            <Modal
                isOpen={modalOpenAdmin3} onRequestClose={() => setModalOpenAdmin3(false)} ariaHideApp={false}
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
                        height: "55vh",
                        zIndex: 999
                    },
                }}>
                <div className='p-3'>
                    <div className='text-center'>
                        <h4>Task Detail</h4>
                    </div>
                    <div className='coverNOut'>
                        <p><b>Id</b> : {taskData.id}</p>
                        <p><b>Date</b> : {taskData.task?.date}</p>
                    </div>
                    <hr />
                    <div className='hugeImpace'>
                        <p><b>Title</b> : {taskData.task?.title}</p>
                        {taskData.task?.status === 1 ? (
                            <p><b>Status</b> : Pending</p>
                        ) : (
                            <p><b>Status</b> : Completed</p>
                        )}
                        {taskData.task?.datefinish ? (
                            <p><b>Date Finish</b> : {taskData.task?.datefinish}</p>
                        ) : null}
                        <p><b>Message :</b></p>
                        <textarea className='textDeny' defaultValue={taskData.task?.message} />
                    </div>
                </div>
                <button className='closeModal' onClick={() => { setModalOpenAdmin3(false); setModalOpenAdmin2(true) }}>x</button>
            </Modal>
        </>
    )
}
export default MainGiveTask