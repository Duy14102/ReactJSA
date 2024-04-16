import { useState, useEffect, useRef } from "react";
import OrderAdmin from "../outOfBorder/OrderAdmin";
import ReactPaginate from "react-paginate";
import axios from "axios";
import socketIOClient from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";
import Swal from "sweetalert2";

function GetOrder({ DateInput, filter }) {
    const cookies = new Cookies()
    const token = cookies.get("TOKEN")
    const decode = jwtDecode(token)
    const [Order, setOrder] = useState([])
    const [newOrder, setNewOrder] = useState(false)
    const [orderComplete, setOrderComplete] = useState(false)
    const [cancelByMag, setCancelByMag] = useState(false)
    const [cancelByChef, setCancelByChef] = useState(false)
    const [cancelOrder, setCancelOrder] = useState(false)
    const [cancelRemove, setCancelRemove] = useState(false)
    const [expiredOrder, setExpiredOrder] = useState(false)
    const [pendingCancelOrder, setPendingCancelOrder] = useState(false)
    const [checkBack, setCheckBack] = useState(false)
    const socketRef = useRef();
    const [pageCount, setPageCount] = useState(6);
    const currentPage = useRef();
    const limit = 9

    function HandleThings(countTabs, handle) {
        if (countTabs === "about") {
            localStorage.removeItem("CountNewCart")
        }
        switch (handle) {
            case "cancelByChef":
                setCancelByChef(true)
                break;
            case "cancelByMag":
                setCancelByMag(true)
                break;
            case "cancelOrder":
                setCancelOrder(true)
                break;
            case "cancelRemove":
                setCancelRemove(true)
                break;
            case "pendingCancel":
                setPendingCancelOrder(true)
                break;
            case "complete":
                setOrderComplete(true)
                break;
            case "new":
                setNewOrder(true)
                break;
            case "expiredOrder":
                setExpiredOrder(true)
                break;
            default:
                break;
        }
        getPagination()
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
            HandleThings(countTabs, "pendingCancel")
        })

        socketRef.current.on('CompleteOrderSuccess', dataGot => {
            if (decode.userRole === 3) {
                HandleThings(countTabs, "complete")
            }
        })

        socketRef.current.on('CancelRequestFourSuccess', dataGot => {
            HandleThings(countTabs, "cancelRemove")
        })

        socketRef.current.on('PaidCodSuccess', dataGot => {
            HandleThings(countTabs, "new")
        })

        socketRef.current.on('PaidPaypalSuccess', dataGot => {
            HandleThings(countTabs, "new")
        })

        socketRef.current.on('PaidVnpaySuccess', dataGot => {
            HandleThings(countTabs, "new")
        })

        socketRef.current.on('CancelVnpaySuccess', dataGot => {
            if (decode.userRole === 3) {
                HandleThings(countTabs, "cancelOrder")
            }
        })

        socketRef.current.on('CancelOrderTransSuccess', dataGot => {
            HandleThings(countTabs, "cancelOrder")
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
                HandleThings(countTabs, "cancelByMag")
            }
        })

        socketRef.current.on('CancelByMagPaidSuccess', dataGot => {
            if (decode.userId === dataGot.emp) {
                HandleThings(countTabs, "cancelByMag")
            }
        })

        socketRef.current.on('ShippingReadySuccess', dataGot => {
            if (dataGot.mag === decode.userId) {
                Swal.fire(
                    'Sended to transportation!',
                    "",
                    'success'
                ).then(() => window.location.reload())
            } else {
                getPagination()
            }
        })

        socketRef.current.on('ExpiredOrderSuccess', dataGot => {
            HandleThings(countTabs, "expiredOrder")
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
        if (cancelByChef) {
            setTimeout(() => {
                setCancelByChef(false)
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
        if (expiredOrder) {
            setTimeout(() => {
                setExpiredOrder(false)
            }, 1500);
        }
    }, [newOrder, cancelOrder, pendingCancelOrder, cancelRemove, orderComplete, cancelByMag, cancelByChef, expiredOrder])

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
                limit: limit,
                date: DateInput,
                filter: filter
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

    useEffect(() => {
        setCheckBack(true)
        setTimeout(() => {
            getPagination()
            setCheckBack(false)
        }, 1000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [DateInput, filter])

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
                {cancelByChef ? (
                    <div className="newUserNoti" style={{ backgroundColor: "tomato" }}>
                        <h6>X Order canceled by chef!</h6>
                    </div>
                ) : null}
                {expiredOrder ? (
                    <div className="newUserNoti" style={{ backgroundColor: "tomato" }}>
                        <h6>X Order expired!</h6>
                    </div>
                ) : null}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", marginBottom: 25 }}>
                <OrderAdmin Data={Order} checkBack={checkBack} />
            </div>
            <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="<"
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