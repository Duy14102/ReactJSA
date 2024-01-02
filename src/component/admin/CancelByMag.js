import axios from "axios";
import { useState } from "react";
import Modal from 'react-modal';

function CancelByMag({ ModalData, fulltotal, modal, setmodal }) {
    const [spinner, setSpinner] = useState(false)
    const denyOrderKin = () => {
        const configuration = {
            method: "post",
            url: "https://eatcom.onrender.com/VnpayRefund",
            data: {
                orderId: ModalData._id,
                transDate: ModalData.createdAt,
                amount: fulltotal,
                transType: "02",
                user: "Manager",
                reason: "Canceled by Manager"
            }
        }
        setSpinner(true)
        axios(configuration).then(() => {
            setSpinner(false)
            window.location.reload();
        }).catch((err) => {
            console.log(err);
        })
    }

    const cancelIt = () => {
        const configuration = {
            method: "post",
            url: "https://eatcom.onrender.com/CancelByMag",
            params: {
                id: ModalData._id
            }
        };
        setSpinner(true)
        axios(configuration)
            .then(() => {
                setSpinner(false)
                window.location.reload()
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const cancelItNow = () => {
        const configuration = {
            method: "post",
            url: "https://eatcom.onrender.com/CancelByMag",
            params: {
                id: ModalData._id
            }
        };
        axios(configuration)
            .then(() => {
                denyOrderKin()
            })
            .catch((error) => {
                console.log(error);
            });
    }
    return (
        <>
            <Modal isOpen={modal} onRequestClose={() => setmodal(false)} ariaHideApp={false}
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
                        width: "20vw",
                        height: "20vh",
                        zIndex: 999
                    },
                }}>
                {spinner ? (
                    <div style={{ background: "rgba(255, 255, 255, 0.6)" }} id="spinner" className="show position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
                        <div className="spinner-border text-primary" style={{ width: 3 + "rem", height: 3 + "rem" }} role="status">
                            <span className="sr-only"></span>
                        </div>
                    </div>
                ) : null}
                <div className="p-3 text-center">
                    <h5>Are you sure ?</h5>
                    <div className="d-flex justify-content-evenly pt-4">
                        {ModalData.paymentmethod?.method === 1 && ModalData.paymentmethod?.status === 2 ? (
                            <button onClick={() => cancelItNow()} className="btn btn-primary">Yes</button>
                        ) : (
                            <button onClick={() => cancelIt()} className="btn btn-primary">Yes</button>
                        )}
                        <button onClick={() => setmodal(false)} className="btn btn-secondary">No</button>
                    </div>
                </div>
            </Modal>
        </>
    )
}
export default CancelByMag