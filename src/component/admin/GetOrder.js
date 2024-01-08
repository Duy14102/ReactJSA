import { useState, useEffect, useRef } from "react";
import OrderAdmin from "../outOfBorder/OrderAdmin";
import ReactPaginate from "react-paginate";
import axios from "axios";
import socketIOClient from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";

function GetOrder() {
    const cookies = new Cookies()
    const token = cookies.get("TOKEN")
    const decode = jwtDecode(token)
    const [Order, setOrder] = useState([])
    const [newOrder, setNewOrder] = useState(false)
    const [orderComplete, setOrderComplete] = useState(false)
    const [cancelByMag, setCancelByMag] = useState(false)
    const [cancelOrder, setCancelOrder] = useState(false)
    const [cancelRemove, setCancelRemove] = useState(false)
    const [pendingCancelOrder, setPendingCancelOrder] = useState(false)
    const socketRef = useRef();
    const [pageCount, setPageCount] = useState(6);
    const currentPage = useRef();
    const limit = 9

    function HandleNew(countTabs) {
        if (countTabs === "about") {
            localStorage.removeItem("CountNewCart")
        }
        getPagination()
        setNewOrder(true)
    }

    function HandleComplete(countTabs) {
        if (countTabs === "about") {
            localStorage.removeItem("CountNewCart")
        }
        getPagination()
        setOrderComplete(true)
    }

    function HandlePendingCancel(countTabs) {
        if (countTabs === "about") {
            localStorage.removeItem("CountNewCart")
        }
        getPagination()
        setPendingCancelOrder(true)
    }

    function HandleCancelRemove(countTabs) {
        if (countTabs === "about") {
            localStorage.removeItem("CountNewCart")
        }
        getPagination()
        setCancelRemove(true)
    }

    function HandleCancel(countTabs) {
        if (countTabs === "about") {
            localStorage.removeItem("CountNewCart")
        }
        getPagination()
        setCancelOrder(true)
    }

    function HandleCancelByMag(countTabs) {
        if (countTabs === "about") {
            localStorage.removeItem("CountNewCart")
        }
        getPagination()
        setCancelByMag(true)
    }

    useEffect(() => {
        const countTabs = localStorage.getItem('tabs')
        currentPage.current = 1;
        getPagination()
        socketRef.current = socketIOClient.connect("https://eatcom.onrender.com")

        socketRef.current.on('UpdateStatusOrderSuccess', dataGot => {
            if (dataGot.emp !== decode.userId) {
                getPagination()
            }
        })

        socketRef.current.on('CustomerWantCancel', dataGot => {
            HandlePendingCancel(countTabs)
        })

        socketRef.current.on('CompleteOrderSuccess', dataGot => {
            if (decode.userRole === 3) {
                HandleComplete()
            }
        })

        socketRef.current.on('CancelRequestFourSuccess', dataGot => {
            HandleCancelRemove(countTabs)
        })

        socketRef.current.on('PaidCodSuccess', dataGot => {
            HandleNew(countTabs)
        })

        socketRef.current.on('PaidPaypalSuccess', dataGot => {
            HandleNew(countTabs)
        })

        socketRef.current.on('PaidVnpaySuccess', dataGot => {
            HandleNew(countTabs)
        })

        socketRef.current.on('CancelVnpaySuccess', dataGot => {
            if (decode.userRole === 3) {
                HandleCancel(countTabs)
            }
        })

        socketRef.current.on('DenyOrderNormalSuccess', dataGot => {
            getPagination()
        })

        socketRef.current.on('DenyOrderPaidSuccess', dataGot => {
            getPagination()
        })

        socketRef.current.on('DenyOrderWaitingSuccess', dataGot => {
            getPagination()
        })

        socketRef.current.on('totaldenyNormalSuccess', dataGot => {
            getPagination()
        })

        socketRef.current.on('totaldenyPaidSuccess', dataGot => {
            getPagination()
        })

        socketRef.current.on('CancelByMagNormalSuccess', dataGot => {
            if (decode.userId === dataGot.emp) {
                HandleCancelByMag(countTabs)
            }
        })

        socketRef.current.on('CancelByMagPaidSuccess', dataGot => {
            if (decode.userId === dataGot.emp) {
                HandleCancelByMag(countTabs)
            }
        })

        return () => {
            socketRef.current.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (newOrder) {
            setTimeout(() => {
                setNewOrder(false)
            }, 1500);
        }
        if (cancelOrder) {
            setTimeout(() => {
                setCancelOrder(false)
            }, 1500);
        }
        if (pendingCancelOrder) {
            setTimeout(() => {
                setPendingCancelOrder(false)
            }, 1500);
        }
        if (cancelRemove) {
            setTimeout(() => {
                setCancelRemove(false)
            }, 1500);
        }
        if (orderComplete) {
            setTimeout(() => {
                setOrderComplete(false)
            }, 1500);
        }
        if (cancelByMag) {
            setTimeout(() => {
                setCancelByMag(false)
            }, 1500);
        }
    }, [newOrder, cancelOrder, pendingCancelOrder, cancelRemove, orderComplete, cancelByMag])

    function handlePageClick(e) {
        currentPage.current = e.selected + 1
        getPagination();
    }

    function getPagination() {
        const configuration = {
            method: "get",
            url: "https://eatcom.onrender.com/GetAllOrderActive",
            params: {
                page: currentPage.current,
                limit: limit
            }
        };
        axios(configuration)
            .then((result) => {
                setOrder(result.data.results.result);
                setPageCount(result.data.results.pageCount)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <>
            <div className="fatherNewUserNoti">
                {newOrder ? (
                    <div className="newUserNoti" style={{ backgroundColor: "#03ba5f" }}>
                        <h6>✓ New order!</h6>
                    </div>
                ) : null}
                {cancelOrder ? (
                    <div className="newUserNoti" style={{ backgroundColor: "tomato" }}>
                        <h6>X Order cancel!</h6>
                    </div>
                ) : null}
                {pendingCancelOrder ? (
                    <div className="newUserNoti" style={{ backgroundColor: "#2298F1" }}>
                        <h6>🕒 Order pending cancel!</h6>
                    </div>
                ) : null}
                {cancelRemove ? (
                    <div className="newUserNoti" style={{ backgroundColor: "#ff9999" }}>
                        <h6>✓ Customer no longer want cancel!</h6>
                    </div>
                ) : null}
                {orderComplete ? (
                    <div className="newUserNoti" style={{ backgroundColor: "#FEA116" }}>
                        <h6>✓ An order completed!</h6>
                    </div>
                ) : null}
                {cancelByMag ? (
                    <div className="newUserNoti" style={{ backgroundColor: "tomato" }}>
                        <h6>X Order progress canceled by manager!</h6>
                    </div>
                ) : null}
            </div>
            <table className='table table-bordered text-center solotable'>
                <thead>
                    <tr className="text-white" style={{ background: "#374148" }}>
                        <th>Fullname</th>
                        <th className="thhuhu">Phone Number</th>
                        <th className="thhuhu">Date</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <OrderAdmin Data={Order} />
                </tbody>
            </table>
            <ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="< previous"
                renderOnZeroPageCount={null}
                marginPagesDisplayed={2}
                containerClassName="pagination justify-content-center text-nowrap"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                activeClassName="active"
                forcePage={currentPage.current - 1}
            />
        </>
    )
}
export default GetOrder;