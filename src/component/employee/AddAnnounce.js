import { useState, useRef } from "react"
import Modal from 'react-modal';
import JoditEditor from 'jodit-react'
import axios from "axios";
import Swal from "sweetalert2";

function AddAnnounce() {
    const [modalOpenDetail, setModalOpenDetail] = useState(false);
    const [title, setTitle] = useState()
    const [message, setMessage] = useState("")
    const editor = useRef(null)

    const addAnn = (e) => {
        e.preventDefault()
        const configuration = {
            method: "post",
            url: "http://localhost:3000/AddNews",
            data: {
                title: title,
                message: message
            }
        }
        axios(configuration)
            .then(() => {
                Swal.fire(
                    'Add Successfully!',
                    '',
                    'success'
                ).then(function () {
                    window.location.reload();
                })
            }).catch(() => {
                Swal.fire(
                    'Add Fail!',
                    '',
                    'error'
                )
            })
    }
    return (
        <>
            <button onClick={() => setModalOpenDetail(true)} className="btn btn-primary">➕ Announce</button>
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
                        height: "52vh",
                        zIndex: 999
                    },
                }}>
                <h2 className='text-center'>Add Announce</h2>
                <form onSubmit={(e) => addAnn(e)}>
                    <label htmlFor="putTheFuckName2">Title</label>
                    <input id="putTheFuckName2" className="textDeny" onChange={(e) => setTitle(e.target.value)} required />
                    <label className="pt-4" htmlFor="">Message</label>
                    <JoditEditor
                        required
                        ref={editor}
                        value={message}
                        onChange={(e) => setMessage(e)}
                    />
                    <div className="d-flex align-items-center pt-3" style={{ gap: 1 + "%" }}>
                        <button type="submit" className="btn btn-primary">Confirm</button>
                        <button type="button" onClick={() => setModalOpenDetail(false)} className="btn btn-secondary">Cancel</button>
                    </div>
                </form>
                <button className='closeModal' onClick={() => setModalOpenDetail(false)}>x</button>
            </Modal>
        </>
    )
}
export default AddAnnounce