import Modal from 'react-modal';
import PropTypes from "prop-types";
import axios from 'axios';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { useEffect } from 'react';

function GiveTask({ id }) {
    const [modalOpenDetail, setModalOpenDetail] = useState(false);
    const [modalOpenDetail2, setModalOpenDetail2] = useState(false);
    const [modalOpenDetail3, setModalOpenDetail3] = useState(false);
    const [proData, setProData] = useState([])
    const [nameE, setNameE] = useState()
    const [Title, setTitle] = useState("")
    const [Message, setMessage] = useState("")
    const [employeed, setEmployeed] = useState([])
    const date = new Date().toLocaleDateString()
    const time = new Date().toLocaleTimeString()
    const datetime = date + " - " + time
    const Both = { title: Title, message: Message, date: datetime, status: 1, datefinish: null }

    useEffect(() => {
        fetch(`http://localhost:3000/TakeEmployeeTask?id=${id}`, {
            method: "get",
        }).then((res) => res.json()).then((data) => {
            setEmployeed(data)
        })
    }, [id])

    const GiveTask = (e) => {
        e.preventDefault()
        const configuration = {
            method: "post",
            url: "http://localhost:3000/GiveTaskEmployee",
            data: {
                id: id,
                task: Both
            }
        }
        axios(configuration)
            .then(() => {
                Swal.fire(
                    'Give Task Successfully!',
                    '',
                    'success'
                ).then(function () {
                    window.location.reload();
                })
            }).catch(() => {
                Swal.fire(
                    'Give Task Fail!',
                    '',
                    'error'
                ).then(function () {
                    window.location.reload();
                })
            })
    }

    var drawed = ""
    if (proData.status === 1) {
        drawed = "Pending"
    }
    else if (proData.status === 2) {
        drawed = "Completed"
    }
    return (
        <>
            <button onClick={setModalOpenDetail} className="btn btn-info text-nowrap">+Task</button>
            <Modal
                isOpen={modalOpenDetail} onRequestClose={() => setModalOpenDetail(false)} ariaHideApp={false}
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
                        height: "43vh",
                        zIndex: 999
                    },
                }}>
                <div className='px-1 py-3'>
                    <h3 className="text-center">Task List</h3>
                    <div className='thyoi'>
                        <button onClick={() => { setModalOpenDetail(false); setModalOpenDetail2(true) }} className='plusElf'>Give Task</button>
                    </div>
                    <hr />
                    <table className='table table-bordered solotable text-center'>
                        <thead>
                            <tr>
                                <th className='thhuhu'>Title</th>
                                <th>Date</th>
                                <th className='thhuhu'>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.values(employeed).map((i) => {
                                return (
                                    i.task?.map((a) => {
                                        var draw = ""
                                        if (a.task.status === 1) {
                                            draw = "Pending"
                                        }
                                        else if (a.task.status === 2) {
                                            draw = "Completed"
                                        }
                                        return (
                                            <tr key={a}>
                                                <td className='thhuhu'>{a.task.title}</td>
                                                <td>{a.task.date}</td>
                                                <td className='thhuhu'>{draw}</td>
                                                <td><button onClick={() => { setModalOpenDetail(false); setModalOpenDetail3(true); setProData(a.task); setNameE(i.email) }} className='btn btn-success'>Detail</button></td>
                                            </tr>
                                        )
                                    })
                                )
                            })}
                        </tbody>
                    </table>
                </div >
                <button className='closeModal' onClick={() => setModalOpenDetail(false)}>x</button>
            </Modal>
            <Modal
                isOpen={modalOpenDetail3} onRequestClose={() => setModalOpenDetail3(false)} ariaHideApp={false}
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
                        height: "50vh",
                        zIndex: 999
                    },
                }}>
                <div className='px-1 py-3'>
                    <h3 className="text-center">Task Detail</h3>
                    <div className='coverNOut'>
                        <p><b>Date</b> : {proData.date}</p>
                    </div>
                    <hr />
                    <div className='hugeImpace'>
                        <p><b>Employee</b> : {nameE}</p>
                        <p><b>Title</b> : {proData.title}</p>
                        {proData.datefinish != null ? (
                            <p><b>Date Finish</b> : {proData.title}</p>
                        ) : null}
                        <p><b>Status</b>: {drawed}</p>
                        <textarea className='contactMessage' defaultValue={proData.message}></textarea>
                    </div>
                </div >
                <button className='closeModal' onClick={() => { setModalOpenDetail3(false); setModalOpenDetail(true) }}>x</button>
            </Modal>
            <Modal
                isOpen={modalOpenDetail2} onRequestClose={() => setModalOpenDetail2(false)} ariaHideApp={false}
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
                        height: "43vh",
                        zIndex: 999
                    },
                }}>
                <div className='px-1 py-3'>
                    <h3 className="text-center">Give Task</h3>
                    <hr />
                    <form onSubmit={(e) => GiveTask(e)}>
                        <label htmlFor='title'>Title</label>
                        <input value={Title} onChange={(e) => setTitle(e.target.value)} id='title' name='title' className="textDeny" required />
                        <label className='pt-3' htmlFor='message'>Message</label>
                        <textarea value={Message} onChange={(e) => setMessage(e.target.value)} id='message' className="textDeny" name='message' required />
                        <div className='d-flex justify-content-around pt-1'>
                            <button type='button' onClick={() => { setModalOpenDetail2(false); setModalOpenDetail(true) }} className='btn btn-secondary'>Cancel</button>
                            <button type='submit' className='btn btn-success'>Confirm</button>
                        </div>
                    </form>
                </div>
                <button className='closeModal' onClick={() => { setModalOpenDetail2(false); setModalOpenDetail(true) }}>x</button>
            </Modal>
        </>
    )
}
GiveTask.propTypes = {
    id: PropTypes.string.isRequired
};
export default GiveTask