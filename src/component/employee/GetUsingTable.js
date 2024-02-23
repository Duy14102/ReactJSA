import axios from "axios"
import { useState, useRef, useEffect, Fragment } from "react"
import ReactPaginate from "react-paginate";
import Modal from 'react-modal';
import Swal from "sweetalert2";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import TableItems from "./TableItems";
import QRcode from 'qrcode.react'
import socketIOClient from "socket.io-client";

function GetUsingTable() {
    const [table, setTable] = useState([])
    const [changetable, setChangeTable] = useState(false)
    const [modalOpenDetail, setModalOpenDetail] = useState(false);
    const [modalQr, setModalQr] = useState(false);
    const [modalOpenDetail2, setModalOpenDetail2] = useState(false);
    const [ModalData, setModalData] = useState([])
    const [GetTable, setGetTable] = useState([])
    const [TableData, setTableData] = useState([])
    const [changeThis, setChangeThis] = useState()
    const [CheckTableId, setCheckTableId] = useState(false)
    const [openTBname, setopenTBname] = useState(false)
    const [pageCount, setPageCount] = useState(6);
    const [TBnamechange, setTBnamechange] = useState()
    var detect1 = null
    var detect2 = null
    const socketRef = useRef();
    const currentPage = useRef();
    const limit = 9
    const cookies = new Cookies()
    const token = cookies.get("TOKEN")
    const decode = jwtDecode(token)
    const deliverEmployee = { id: decode.userId, email: decode.userEmail }
    const takeEmployee = []
    takeEmployee.push(deliverEmployee)
    var total = 0
    var fulltotal = 0

    function Success() {
        Swal.fire(
            'Successfully!',
            '',
            'success'
        ).then(function () {
            window.location.reload()
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
        currentPage.current = 1;
        getPagination()
        getTableActive();

        socketRef.current = socketIOClient.connect("http://localhost:3000")

        socketRef.current.on('AddTableByHandSuccess', dataGot => {
            getPagination()
            getTableActive();
        })

        socketRef.current.on('AddTableCustomerSuccess', dataGot => {
            getPagination()
            getTableActive();
        })

        socketRef.current.on('AddItemToTableSuccess', dataGot => {
            getPagination()
        })

        socketRef.current.on('ChangeTableNameSuccess', dataGot => {
            if (dataGot.mag === decode.userId) {
                Success()
            } else {
                getPagination()
                getTableActive()
            }
        })

        socketRef.current.on('ChangeTableNameFail', dataGot => {
            if (dataGot.mag === decode.userId) {
                Fail()
            }
        })

        socketRef.current.on('DeleteTableSuccess', dataGot => {
            if (dataGot.mag === decode.userId) {
                Success()
            } else {
                getPagination()
                getTableActive()
            }
        })

        socketRef.current.on('DeleteTableFail', dataGot => {
            if (dataGot.mag === decode.userId) {
                Fail()
            }
        })

        socketRef.current.on('ChangeTableSuccess', dataGot => {
            if (dataGot.mag === decode.userId) {
                Success()
            } else {
                getPagination()
                getTableActive()
            }
        })

        socketRef.current.on('ChangeTableFail', dataGot => {
            if (dataGot.mag === decode.userId) {
                Fail()
            }
        })

        socketRef.current.on('CheckoutNormalSuccess', dataGot => {
            if (dataGot.mag === decode.userId) {
                Success()
            } else {
                getPagination()
                getTableActive()
            }
        })

        socketRef.current.on('CheckoutNormalFail', dataGot => {
            if (dataGot.mag === decode.userId) {
                Fail()
            }
        })

        socketRef.current.on('CheckoutBookingSuccess', dataGot => {
            if (dataGot.mag === decode.userId) {
                Success()
            } else {
                getPagination()
                getTableActive()
            }
        })

        socketRef.current.on('CheckoutBookingFail', dataGot => {
            if (dataGot.mag === decode.userId) {
                Fail()
            }
        })

        socketRef.current.on('QrCodeTableActiveSuccess', dataGot => {
            getPagination()
            getTableActive()
        })

        socketRef.current.on('DeleteQritemSuccess', dataGot => {
            getPagination()
        })

        socketRef.current.on('Checkout4QrSuccess', dataGot => {
            getPagination()
            getTableActive()
        })

        return () => {
            socketRef.current.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function handlePageClick(e) {
        currentPage.current = e.selected + 1
        getPagination();
    }

    function getPagination() {
        const configuration = {
            method: "get",
            url: "http://localhost:3000/GetTableUse",
            params: {
                page: currentPage.current,
                limit: limit
            }
        };
        axios(configuration)
            .then((result) => {
                setTable(result.data.results.result);
                setPageCount(result.data.results.pageCount)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function getTableActive() {
        const configuration = {
            method: "get",
            url: "http://localhost:3000/GetAllTableActive",
        }
        axios(configuration)
            .then((res) => {
                setGetTable(res.data.data)
            }).catch((err) => {
                console.log(err);
            })
    }

    const getThatTable = (e) => {
        const configuration = {
            method: "get",
            url: "http://localhost:3000/GetTable4BookingHistory",
            params: {
                cusid: e
            }
        };
        axios(configuration)
            .then((result) => {
                setTableData(result.data)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const checkOut = (e) => {
        const data = { mag: decode.userId, id: e, fulltotal: fulltotal, tableid: ModalData._id, employee: takeEmployee, Idhistory: ModalData.customerid, TbnameHistory: ModalData.tablename, TbDateHistory: ModalData.tabledate, TbItemHistory: ModalData.tableitems }
        socketRef.current.emit('Checkout4BookingSocket', data)
    }

    const checkOut4Normal = () => {
        const data = { id: ModalData._id, employee: takeEmployee, Idhistory: ModalData.customerid, TbnameHistory: ModalData.tablename, TbDateHistory: ModalData.tabledate, TbItemHistory: ModalData.tableitems, mag: decode.userId }
        socketRef.current.emit('Checkout4NormalSocket', data)
    }

    const changeNewtable = (e) => {
        e.preventDefault()
        if (changeThis) {
            setCheckTableId(false)
            const data = { oldid: ModalData._id, newid: changeThis, cusid: ModalData.customerid, items: ModalData.tableitems, date: ModalData.tabledate, mag: decode.userId }
            socketRef.current.emit('ChangeTableNowSocket', data)
        } else {
            setCheckTableId(true)
        }
    }

    const deleteTable = () => {
        const data = { id: ModalData._id, mag: decode.userId }
        socketRef.current.emit('DeleteTableNowSocket', data)
    }

    const changeTableName = (e) => {
        e.preventDefault()
        const data = { id: ModalData._id, name: TBnamechange, mag: decode.userId }
        socketRef.current.emit('ChangeTableNameQuickSocket', data)
    }

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    function resetTable() {
        window.location.reload()
    }

    var denver = ""
    var date = new Date(ModalData.tabledate).toLocaleDateString()
    var time = new Date(ModalData.tabledate).toLocaleTimeString()
    var datetime = date + " - " + time
    if (ModalData.tablestatus === 2) {
        denver = "Serving"
    }
    if (ModalData.tablestatus === 1) {
        denver = "Pending"
    }
    if (ModalData.tablestatus === 3) {
        denver = "Checkout Pending"
    }
    var codeQr = `https://eatcom.store/QrCodeTable/${ModalData._id}/1/Meat/nto`

    const downloadQR = () => {
        const canvas = document.getElementById('qrcode');
        const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
        let downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `${ModalData.tablename}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };
    return (
        <>
            <div className="row anser">
                {table.map((y) => {
                    return (
                        <div key={y._id} className="column sicky py-4">
                            <div onClick={() => { setModalOpenDetail(true); setModalData(y); getThatTable(y.customerid) }} className="TableVisi">
                                {y.tablestatus === 1 ? (
                                    <img alt="" src="https://cdn-icons-png.flaticon.com/512/638/638523.png" width={100} height={70} />
                                ) : (
                                    <img alt="" src="https://cdn-icons-png.flaticon.com/512/6937/6937721.png" width={100} height={70} />
                                )}
                                <p className="text-white py-2 m-0">{y.tablename}</p>
                                {y.tablestatus === 1 ? (
                                    <p className="text-success">● Pending</p>
                                ) : y.tablestatus === 2 ? (
                                    <p className="text-danger">● Serving</p>
                                ) : y.tablestatus === 3 ? (
                                    <p className="text-warning">● Checkout Pending</p>
                                ) : null}
                            </div>
                        </div>
                    )
                })}
            </div>
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
                        height: "60vh",
                        zIndex: 999
                    },
                }}>
                <h2 className='text-center'>Table Detail</h2>
                <div className="coverNOut">
                    <p className="m-0"><b>Id</b> : {ModalData._id}</p>
                    {ModalData.customerid ? (
                        <p className="m-0"><b>Type</b> : Online table</p>
                    ) : (
                        <p className="m-0"><b>Type</b> : Offline Table</p>
                    )}
                </div>
                <hr />
                <div className="hugeImpace">
                    {openTBname ? (
                        <form onSubmit={(e) => changeTableName(e)}>
                            <p className="d-flex align-items-center" style={{ gap: 1 + "%" }}>
                                <span><b>Table name</b> : <input onChange={(e) => setTBnamechange(e.target.value)} defaultValue={ModalData.tablename} /></span>
                                <div className="d-flex" style={{ gap: 5 + "px" }}>
                                    <button type="submit" className="editTableName4">✔️</button>
                                    <button onClick={() => setopenTBname(false)} type="button" className="editTableName4">✖️</button>
                                </div>
                            </p>
                        </form>
                    ) : (
                        <p className="d-flex align-items-center" style={{ gap: 1 + "%" }}>
                            <span><b>Table name</b> : {ModalData.tablename}</span>
                            {ModalData.tablestatus === 1 && decode.userRole === 3 ? (
                                <button onClick={() => setopenTBname(true)} className="editTableName4"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" /></svg></button>
                            ) : null}
                        </p>
                    )}
                    {ModalData.tablestatus === 2 ? (
                        <p><b>Date</b> : {datetime}</p>
                    ) : null}
                    <p><b>Status</b> : {denver}</p>
                    <div className="autoPurge pb-2">
                        {ModalData.tableitems?.length > 0 ? (
                            <p><b>Items</b> : </p>
                        ) : (
                            <p><b>Items</b> : Table have no items !</p>
                        )}
                        <div className="d-flex text-nowrap" style={{ gap: 3 + "%" }}>
                            <button onClick={() => { setModalOpenDetail(false); setModalOpenDetail2(true) }} className="btn btn-primary">Add items</button>
                            <button onClick={() => { setModalOpenDetail(false); setModalQr(true) }} className="entityQ"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M0 80C0 53.5 21.5 32 48 32h96c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80zM64 96v64h64V96H64zM0 336c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V336zm64 16v64h64V352H64zM304 32h96c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H304c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48zm80 64H320v64h64V96zM256 304c0-8.8 7.2-16 16-16h64c8.8 0 16 7.2 16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s7.2-16 16-16s16 7.2 16 16v96c0 8.8-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s-7.2-16-16-16s-16 7.2-16 16v64c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16V304zM368 480a16 16 0 1 1 0-32 16 16 0 1 1 0 32zm64 0a16 16 0 1 1 0-32 16 16 0 1 1 0 32z" /></svg></button>
                        </div>
                    </div>
                </div>
                <table className="table table-bordered solotable">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th className="thhuhu">Category</th>
                            <th>Quantity</th>
                            <th>Status</th>
                            <th>Price</th>
                            {ModalData.tableitems?.map((z) => {
                                if (z.status === 1) {
                                    detect2 = "Yes"
                                }
                                return null
                            })}
                            {detect2 ? (
                                <th></th>
                            ) : null}
                        </tr>
                    </thead>
                    <tbody>
                        {ModalData.tableitems?.map((a) => {
                            total = a.item.foodprice * a.quantity
                            fulltotal += total
                            var stag = ""
                            if (a.status === 1) {
                                stag = "Comfirm pending"
                            }
                            else if (a.status === 2) {
                                stag = "Confirmed"
                            }
                            return (
                                <tr key={a.item._id}>
                                    <td>{a.item.foodname}</td>
                                    <td className="thhuhu">{a.item.foodcategory}</td>
                                    <td>{a.quantity}</td>
                                    <td>{stag}</td>
                                    <td>{VND.format(a.item.foodprice)}</td>
                                    {a.status === 1 ? (
                                        <td style={{ width: 5 + "%" }} className="text-center"><button className="btn btn-danger">x</button></td>
                                    ) : null}
                                </tr>
                            )
                        })}
                        <tr className="thhuhu">
                            <th colSpan={4}>Fulltotal</th>
                            {ModalData.tableitems?.map((z) => {
                                if (z.status === 1) {
                                    detect1 = "Yes"
                                } else {
                                    detect1 = "No"
                                }
                                return null
                            })}
                            {detect1 === "Yes" ? (
                                <th colSpan={3}>{VND.format(fulltotal)}</th>
                            ) : detect1 === "No" ? (
                                <th>{VND.format(fulltotal)}</th>
                            ) : null}
                        </tr>
                        <tr className="jackass">
                            <th colSpan={3}>Fulltotal</th>
                            {ModalData.tableitems?.map((z) => {
                                if (z.status === 1) {
                                    detect1 = "Yes"
                                } else {
                                    detect1 = "No"
                                }
                                return null
                            })}
                            {detect1 === "Yes" ? (
                                <th colSpan={2}>{VND.format(fulltotal)}</th>
                            ) : detect1 === "No" ? (
                                <th>{VND.format(fulltotal)}</th>
                            ) : null}
                        </tr>
                    </tbody>
                </table>
                {decode.userRole === 3 ? (
                    ModalData.tablestatus === 1 ? (
                        <div className="text-center">
                            <button onClick={() => deleteTable()} className="btn btn-danger">Delete Table</button>
                        </div>
                    ) : null
                ) : null}
                {ModalData.tablestatus !== 1 && ModalData.tableitems?.length > 0 ? (
                    ModalData.customerid ? (
                        <div className="ladyPurge ohooo py-3">
                            {Object.values(TableData).map((q) => {
                                return (
                                    <Fragment key={q}>
                                        {changetable ? (
                                            <button style={{ pointerEvents: "none", opacity: 0.5 }} className="btn btn-success">Checkout</button>
                                        ) : (
                                            <button onClick={() => checkOut(ModalData.customerid)} className="btn btn-success">Checkout</button>
                                        )}
                                    </Fragment>
                                )
                            })}
                            {ModalData.tablestatus === 2 ? (
                                <button onClick={() => setChangeTable(true)} className="btn btn-info text-nowrap">Change Table</button>
                            ) : null}
                        </div>
                    ) : (
                        <div className="ladyPurge ohooo py-3">
                            {changetable ? (
                                <button style={{ pointerEvents: "none", opacity: 0.5 }} className="btn btn-success">Checkout</button>
                            ) : (
                                <button onClick={() => checkOut4Normal()} className="btn btn-success">Checkout</button>
                            )}
                            {ModalData.tablestatus === 2 ? (
                                <button onClick={() => setChangeTable(true)} className="btn btn-info text-nowrap">Change Table</button>
                            ) : null}
                        </div>
                    )
                ) : null}
                {changetable ? (
                    <div className="pt-3">
                        <p>Choosing Table : </p>
                        <form onSubmit={(e) => changeNewtable(e)}>
                            <div className="ytui" style={{ gap: 2 + "%" }}>
                                <select onInput={(e) => setChangeThis(e.target.value)} className="neul" required>
                                    <option selected disabled hidden>Choose Table</option>
                                    {Object.values(GetTable).map((i) => {
                                        return (
                                            <option value={i._id} key={i._id}>{i.tablename}</option>
                                        )
                                    })}
                                </select>
                                {CheckTableId ? (
                                    <p className="m-0 neul text-danger text-nowrap">Table need to be choose!</p>
                                ) : null}
                            </div>
                            <div style={{ gap: 1 + "%" }} className="d-flex mt-3">
                                <button type="submit" className="btn btn-primary ">Comfirm</button>
                                <button onClick={() => { setCheckTableId(false); setChangeTable(false) }} className="btn btn-secondary ">Cancel</button>
                            </div>
                        </form>
                    </div>
                ) : null}
                <button className='closeModal' onClick={() => setModalOpenDetail(false)}>x</button>
            </Modal>
            <Modal isOpen={modalQr} onRequestClose={() => setModalQr(false)} ariaHideApp={false}
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
                        height: "60vh",
                        zIndex: 999
                    },
                }}>
                <div className="p-3">
                    <h3 className="text-center">{ModalData.tablename} QrCode</h3>
                    <div className="qrB">
                        <QRcode
                            id='qrcode'
                            value={codeQr}
                            size={290}
                            level={'H'}
                            includeMargin={true}
                        />
                        <button onClick={() => downloadQR()} className="noPlusElf">Download</button>
                    </div>
                </div>
                <button className='closeModal' onClick={() => { setModalQr(false); setModalOpenDetail(true) }}>x</button>
            </Modal>
            <Modal isOpen={modalOpenDetail2} onRequestClose={() => setModalOpenDetail2(false)} ariaHideApp={false}
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
                        width: "72vw",
                        overflowX: "hidden",
                        height: "76vh",
                        zIndex: 999
                    },
                }}>
                <TableItems ModalData={ModalData} decode={decode} />
                <button className='closeModal' onClick={() => { setModalOpenDetail2(false); resetTable() }}>x</button>
            </Modal>
        </>
    )
}
export default GetUsingTable