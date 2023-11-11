import axios from "axios";
import jwtDecode from "jwt-decode";
import Modal from 'react-modal';
import Swal from "sweetalert2";
import Cookies from "universal-cookie";

function CancelRequest({ ModalData, fulltotal, modal, setmodal }) {
    const cookies = new Cookies()
    const token = cookies.get("TOKEN")
    const decode = jwtDecode(token)
    const deliverEmployee = { id: decode.userId, email: decode.userEmail }
    const denyOrderKin = () => {
        const configuration = {
            method: "post",
            url: "http://localhost:3000/VnpayRefund",
            data: {
                orderId: ModalData._id,
                transDate: ModalData.createdAt,
                amount: fulltotal,
                transType: "02",
                user: "Manager",
                reason: "Canceled by Manager"
            }
        }
        axios(configuration).then(() => {
            Swal.fire(
                'Canceled successfully!',
                '',
                'success'
            ).then(function () {
                window.location.reload();
            })
        }).catch((err) => {
            console.log(err);
        })
    }

    const cancelIt = () => {
        const configuration = {
            method: "post",
            url: "http://localhost:3000/totaldenyNow",
            data: {
                id: ModalData._id,
                employee: deliverEmployee,
                status: 6,
            }
        }
        axios(configuration)
            .then(() => {
                Swal.fire(
                    'Canceled successfully!',
                    '',
                    'success'
                ).then(function () {
                    window.location.reload();
                })
            }).catch((err) => {
                Swal.fire(
                    'Canceled fail!',
                    '',
                    'error'
                ).then(function () {
                    console.log(err);
                })
            })
    }

    const cancelItNow = () => {
        const configuration = {
            method: "post",
            url: "http://localhost:3000/totaldenyNow",
            data: {
                id: ModalData._id,
                employee: deliverEmployee,
                status: 6,
            }
        }
        axios(configuration)
            .then(() => {
                denyOrderKin()
            }).catch((err) => {
                Swal.fire(
                    'Canceled fail!',
                    '',
                    'error'
                ).then(function () {
                    console.log(err);
                })
            })
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
export default CancelRequest