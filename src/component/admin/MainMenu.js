import Modal from 'react-modal';
import UploadMenuReal from './UploadMenuReal';
import GetMenu from './GetMenu';
import { useState } from 'react';
function MainMenu() {
    const [modalOpen, setModalOpen] = useState(false);
    return (
        <>
            <div className='text-right pb-3'>
                {/* <NavLink to="/UploadMenuReal" className="btn btn-primary" >Add</NavLink> */}
                <button className='btn btn-primary' onClick={setModalOpen}>
                    Add Menu
                </button>
            </div>
            <Modal
                isOpen={modalOpen} onRequestClose={() => setModalOpen(false)} ariaHideApp={false}
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
                        width: 400,
                        overflow: "hidden",
                        zIndex: 999
                    },
                }}>
                <UploadMenuReal />

                <button className='closeModal' onClick={() => setModalOpen(false)}>x</button>
            </Modal>
            <GetMenu />
        </>
    );
}
export default MainMenu;