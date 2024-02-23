import { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import socketIOClient from "socket.io-client";

function TaskHandle({ id, name, decode }) {
    const [modalOpenDetail, setModalOpenDetail] = useState(false);
    const socketRef = useRef();

    var drawed = ""
    if (id.task.status === 1) {
        drawed = "Pending"
    }
    else if (id.task.status === 2) {
        drawed = "Completed"
    }

    useEffect(() => {
        socketRef.current = socketIOClient.connect("https://eatcom.onrender.com")

        socketRef.current.on('FinishTaskSuccess', dataGot => {
            if (dataGot.emp === decode.userId) {
                Swal.fire(
                    'Finish task success!',
                    '',
                    'success'
                ).then(function () {
                    window.location.reload();
                })
            }
        })

        socketRef.current.on('FinishTaskFail', dataGot => {
            if (dataGot.emp === decode.userId) {
                Swal.fire(
                    'Finish task fail!',
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

    const finishTask = () => {
        const data = { taskid: id.id, userid: name._id }
        socketRef.current.emit('FinishTaskEmployeeSocket', data)
    }
    return (
        <>
            <button onClick={() => setModalOpenDetail(true)} className='btn btn-success'>Detail</button>
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
                        height: "50vh",
                        zIndex: 999
                    },
                }}>
                <div className='px-1 py-3'>
                    <h3 className="text-center">Task Detail</h3>
                    <div className='coverNOut'>
                        <p><b>Date</b> : {id.task.date}</p>
                    </div>
                    <hr />
                    <div className='hugeImpace'>
                        <p><b>Employee</b> : {name.email}</p>
                        <p><b>Title</b> : {id.task.title}</p>
                        {id.task.datefinish != null ? (
                            <p><b>Date Finish</b> : {id.task.title}</p>
                        ) : null}
                        <p><b>Status</b>: {drawed}</p>
                        <textarea className='contactMessage' defaultValue={id.task.message}></textarea>
                    </div>
                </div >
                <div className='d-flex justify-content-around align-items-center'>
                    <button onClick={() => setModalOpenDetail(false)} className='btn btn-secondary'>Cancel</button>
                    <button onClick={() => finishTask()} className='btn btn-primary'>Finish</button>
                </div>
                <button className='closeModal' onClick={() => { setModalOpenDetail(false); }}>x</button>
            </Modal>
        </>
    )
}
export default TaskHandle