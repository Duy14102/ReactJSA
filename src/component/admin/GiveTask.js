import Modal from 'react-modal';
import PropTypes from "prop-types";
import axios from 'axios';
import { useState } from 'react';
import Swal from 'sweetalert2';

function GiveTask({ id }) {
    const [modalOpenDetail, setModalOpenDetail] = useState(false);
    const [Title, setTitle] = useState("")
    const [Message, setMessage] = useState("")
    const date = new Date().toLocaleDateString()
    const time = new Date().toLocaleTimeString()
    const datetime = date + " - " + time
    const Both = { title: Title, message: Message, date: datetime }

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
                    <h3 className="text-center">Give Task</h3>
                    <hr />
                    <form onSubmit={(e) => GiveTask(e)}>
                        <label htmlFor='title'>Title</label>
                        <input value={Title} onChange={(e) => setTitle(e.target.value)} id='title' name='title' className="textDeny" required />
                        <label className='pt-3' htmlFor='message'>Message</label>
                        <textarea value={Message} onChange={(e) => setMessage(e.target.value)} id='message' className="textDeny" name='message' required />
                        <div className='d-flex justify-content-around pt-1'>
                            <button type='button' onClick={() => setModalOpenDetail(false)} className='btn btn-secondary'>Cancel</button>
                            <button type='submit' className='btn btn-success'>Confirm</button>
                        </div>
                    </form>
                </div >
                <button className='closeModal' onClick={() => setModalOpenDetail(false)}>x</button>
            </Modal>
        </>
    )
}
GiveTask.propTypes = {
    id: PropTypes.string.isRequired
};
export default GiveTask