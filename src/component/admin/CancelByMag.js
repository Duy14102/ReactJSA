import axios from "axios";
import { useState, useRef, useEffect } from "react";
import socketIOClient from "socket.io-client";
import Swal from "sweetalert2";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";

function CancelByMag({ ModalData, fulltotal, setmodal }) {
    const [spinner, setSpinner] = useState(false)
    const socketRef = useRef();
    const cookies = new Cookies()
    const token = cookies.get("TOKEN")
    const decode = jwtDecode(token)

    function Success() {
        Swal.fire(
            'Successfully!',
            '',
            'success'
        ).then(function () {
            window.location.reload();
        })
    }

    function Fail() {
        Swal.fire(
            'Fail!',
            '',
            'error'
        )
    }

    useEffect(() => {
        socketRef.current = socketIOClient.connect("https://eatcom.onrender.com")

        socketRef.current.on('CancelByMagNormalSuccess', dataGot => {
            if (decode.userId === dataGot.mag) {
                Success()
            }
        })

        socketRef.current.on('CancelByMagPaidSuccess', dataGot => {
            if (decode.userId === dataGot.mag) {
                denyOrderKin(dataGot.id, dataGot.date, dataGot.fulltotal)
            }
        })

        socketRef.current.on('CancelByMagFail', dataGot => {
            if (decode.userId === dataGot.mag) {
                Fail()
            }
        })

        return () => {
            socketRef.current.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const denyOrderKin = (id, date, fulltotals) => {
        const configuration = {
            method: "post",
            url: "https://eatcom.onrender.com/VnpayRefund",
            data: {
                orderId: id,
                transDate: date,
                amount: fulltotals,
                transType: "02",
                user: "Manager",
                reason: "Canceled by Manager"
            }
        }
        setSpinner(true)
        axios(configuration).then(() => {
            setSpinner(false)
            Success()
        }).catch(() => {
            Fail()
        })
    }

    const cancelIt = () => {
        const data = { id: ModalData._id, userid: ModalData?.user[0].id, type: "Normal", empid: ModalData?.employee[0].id, mag: decode.userId }
        socketRef.current.emit('CancelByMagSocket', data)
    }

    const cancelItNow = () => {
        const data = { id: ModalData._id, userid: ModalData?.user[0].id, type: "Paid", fulltotal: fulltotal, date: ModalData.createdAt, empid: ModalData?.employee[0].id, mag: decode.userId }
        socketRef.current.emit('CancelByMagSocket', data)
    }
    return (
        <div className="pt-2">
            {spinner ? (
                <div style={{ background: "rgba(255, 255, 255, 0.6)" }} id="spinner" className="show position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
                    <div className="spinner-border text-primary" style={{ width: 3 + "rem", height: 3 + "rem" }} role="status">
                        <span className="sr-only"></span>
                    </div>
                </div>
            ) : null}
            <h5 className="text-center pb-2">Are you sure ?</h5>
            <div className="d-flex justify-content-evenly align-items-center">
                {ModalData.paymentmethod?.method === 1 && ModalData.paymentmethod?.status === 2 ? (
                    <button onClick={() => cancelItNow()} className="btn btn-primary">Yes</button>
                ) : (
                    <button onClick={() => cancelIt()} className="btn btn-primary">Yes</button>
                )}
                <button className="btn btn-secondary" onClick={() => setmodal({ modalOpenDetail3: false })}>No</button>
            </div>
        </div>
    )
}
export default CancelByMag