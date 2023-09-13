import Modal from 'react-modal';
import UploadAdminReal from './UploadAdminReal';
import GetUser from './GetUser';
import { useState } from 'react';
function MainUser() {
    const [modalOpenAdmin, setModalOpenAdmin] = useState(false);
    return (
        <>
            <div className='text-right'>
                {/* <NavLink to="/UploadMenuReal" className="btn btn-primary" >Add</NavLink> */}
                <button className='btn btn-primary' onClick={setModalOpenAdmin}>
                    Add Admin
                </button>
            </div>
            <Modal
                isOpen={modalOpenAdmin} onRequestClose={() => setModalOpenAdmin(false)} ariaHideApp={false}
                style={{
                    overlay: {
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
                        width: 400,
                        overflow: "hidden",
                    },
                }}>
                <UploadAdminReal />

                <button className='closeModal' onClick={() => setModalOpenAdmin(false)}>x</button>
            </Modal>
            <GetUser />
        </>
    );
}
export default MainUser;