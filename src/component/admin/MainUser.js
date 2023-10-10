import Modal from 'react-modal';
import GetUser from './GetUser';
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function MainUser() {
    const [modalOpenAdmin, setModalOpenAdmin] = useState(false);
    const [email, setEmail] = useState("");
    const [fullname, setFullname] = useState("");
    const [password, setPassword] = useState("");
    const [phonenumber, setPhonenumber] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, displayError] = useState(false);


    const handleSubmit = (e) => {
        // prevent the form from refreshing the whole page
        e.preventDefault();
        const configuration = {
            method: "post",
            url: "http://localhost:3000/AddAdmin",
            data: {
                email,
                password,
                fullname,
                phonenumber
            },
        };
        if (password !== confirm) {
            displayError(true);
        } else {
            axios(configuration)
                .then((result) => {
                    Swal.fire(
                        'Added Successfully!',
                        'Welcome ' + result.data.fullname,
                        'success'
                    ).then(function () {
                        window.location.reload();
                    })
                })
                .catch((error) => {
                    Swal.fire(
                        'Added Fail!',
                        '',
                        'error'
                    )
                });
        }
    }
    return (
        <>
            <div className='text-right pb-3'>
                {/* <NavLink to="/UploadMenuReal" className="btn btn-primary" >Add</NavLink> */}
                <button className='btn btn-primary' onClick={setModalOpenAdmin}>
                    Add Employee
                </button>
            </div>
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
                        width: 700,
                        zIndex: 999
                    },
                }}>
                <div className="p-3">
                    <div className="text-center">
                        <h3>Add Employee</h3>
                    </div>
                    <hr />
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <div className='overHereB'>
                            <div className='insideHereB'>
                                <label>Email</label>
                                <input className='textDeny' type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className='insideHereB'>
                                <label>Password</label>
                                <input className='textDeny' type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        </div>

                        <div className='overHereB pt-3'>
                            <div className='insideHereB'>
                                <label>Fullname</label>
                                <input className='textDeny' type="text" name="fullname" value={fullname} onChange={(e) => setFullname(e.target.value)} />
                            </div>

                            <div className='insideHereB'>
                                <label>Repeat Password</label>
                                <input className='textDeny' type="password" name="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                                {error ? (
                                    <p className="text-danger">Repeat correcly password!</p>
                                ) : (
                                    <input type='hidden' />
                                )}
                            </div>
                        </div>

                        <div style={{ width: 45 + "%" }} className='mt-3'>
                            <div>
                                <label>Phone Number</label>
                                <input style={{ padding: 2 + "%" }} className='textDeny' type="number" name="phonenumber" value={phonenumber} onChange={(e) => setPhonenumber(e.target.value)} />
                            </div>
                        </div>
                        <hr />
                        <div className='d-flex justify-content-around align-items-center'>
                            <button className="btn btn-secondary" onClick={() => setModalOpenAdmin(false)} type='button'>Cancel</button>
                            <button className="btn btn-primary" type='submit'>Confirm</button>
                        </div>
                    </form>
                </div>
                <button className='closeModal' onClick={() => setModalOpenAdmin(false)}>x</button>
            </Modal>
            <GetUser />
        </>
    );
}
export default MainUser;