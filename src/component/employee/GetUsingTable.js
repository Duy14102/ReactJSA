import axios from "axios"
import { useState, useRef, useEffect } from "react"
import ReactPaginate from "react-paginate";
import Modal from 'react-modal';
import Swal from "sweetalert2";

function GetUsingTable() {
    const [table, setTable] = useState([])
    const [modalOpenDetail, setModalOpenDetail] = useState(false);
    const [modalOpenDetail2, setModalOpenDetail2] = useState(false);
    const [ModalData, setModalData] = useState([])
    var [QuantityAdd, setQuantityAdd] = useState()
    const [menu, setMenu] = useState([])
    const [pageCount, setPageCount] = useState(6);
    const [pageCount2, setPageCount2] = useState(6);
    const currentPage = useRef();
    const limit = 8

    useEffect(() => {
        currentPage.current = 1;
        getPagination()
        getAdminMenu()
    }, [])

    function handlePageClick(e) {
        currentPage.current = e.selected + 1
        getPagination();
    }

    function handlePageClick2(e) {
        currentPage.current = e.selected + 1
        getAdminMenu();
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

    function getAdminMenu() {
        const configuration = {
            method: "get",
            url: "http://localhost:3000/GetAdminMenu",
            params: {
                page: currentPage.current,
                limit: limit
            }
        };
        axios(configuration)
            .then((result) => {
                setMenu(result.data.results.result);
                setPageCount2(result.data.results.pageCount)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    if (!QuantityAdd) {
        QuantityAdd = 1
    }

    const takeitNow = (e, k) => {
        const item = { item: k, quantity: QuantityAdd }
        var foodname = ""
        if (k) {
            foodname = k.foodname
        }
        e.preventDefault()
        const configuration = {
            method: "post",
            url: "http://localhost:3000/AddItemToTable",
            data: {
                tableid: ModalData._id,
                item: item,
                foodname: foodname
            }
        };
        axios(configuration)
            .then(() => {
                Swal.fire(
                    'Added Successfully!',
                    '',
                    'success'
                )
            })
            .catch(() => {
                Swal.fire(
                    'Added Fail!',
                    '',
                    'error'
                )
            });
    }

    function resetTable() {
        window.location.reload()
    }

    var denver = ""
    if (ModalData.tablestatus === 2) {
        denver = "Serving"
    }
    return (
        <>
            <table className='table table-bordered text-center'>
                <thead>
                    <tr className="text-white" style={{ background: "#374148" }}>
                        <th className="text-center">Table</th>
                        <th className="text-center">Status</th>
                        <th className="text-center"></th>
                    </tr>
                </thead>
                {table.map(i => {
                    var stau = ""
                    if (i.tablestatus === 2) {
                        stau = "Serving"
                    }
                    return (
                        <tbody key={i._id}>
                            <tr style={{ background: "#2C343A", color: "lightgray", verticalAlign: "middle" }}>
                                <td>{i.tablename}</td>
                                <td>{stau}</td>
                                <td onClick={setModalOpenDetail}><button onClick={() => setModalData(i)} className='btn btn-success'>Detail</button></td>
                            </tr>
                        </tbody>
                    )
                })}
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
                containerClassName="pagination justify-content-center"
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
                        width: 800,
                        overflow: "hidden",
                        zIndex: 999
                    },
                }}>
                <h2 className='text-center'>Table Detail</h2>
                <div className="coverNOut">
                    <p className="m-0"><b>Id</b> : {ModalData._id}</p>
                    <p className="m-0"><b>Date</b> : {ModalData.customerid}</p>
                </div>
                <hr />
                <p><b>Table name</b> : {ModalData.tablename}</p>
                <p><b>Status</b> : {denver}</p>
                <div className="d-flex justify-content-between align-items-center pb-2">
                    <p><b>Items</b> : </p>
                    <button onClick={() => { setModalOpenDetail(false); setModalOpenDetail2(true) }} className="btn btn-primary">Add items</button>
                </div>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Quantity</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ModalData.tableitems?.map((a) => {
                            return (
                                <tr>
                                    <td>{a.item.foodname}</td>
                                    <td>{a.item.foodcategory}</td>
                                    <td>{a.quantity}</td>
                                    <td>{a.item.foodprice}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                <button className='closeModal' onClick={() => setModalOpenDetail(false)}>x</button>
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
                        width: 800,
                        overflow: "hidden",
                        zIndex: 999
                    },
                }}>
                <h2 className='text-center'>Items List</h2>
                <table className="table table-bordered">
                    <thead>
                        <tr className="text-center">
                            <th>Name</th>
                            <th>Category</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {menu.map((k) => {
                            return (
                                <tr key={k._id} className="text-center">
                                    <td>{k.foodname}</td>
                                    <td>{k.foodcategory}</td>
                                    <td><input onChange={(e) => setQuantityAdd(e.target.value)} style={{ width: 60 + "px" }} type="number" defaultValue={1} min={1} max={k.foodquantity} /></td>
                                    <td>{k.foodprice}</td>
                                    <td><button onClick={(e) => takeitNow(e, k)} className="btn btn-success">Add</button></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <ReactPaginate
                    breakLabel="..."
                    nextLabel="next >"
                    onPageChange={handlePageClick2}
                    pageRangeDisplayed={5}
                    pageCount={pageCount2}
                    previousLabel="< previous"
                    renderOnZeroPageCount={null}
                    marginPagesDisplayed={2}
                    containerClassName="pagination justify-content-center"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    activeClassName="active"
                    forcePage={currentPage.current - 1}
                />
                <button className='closeModal' onClick={() => { setModalOpenDetail2(false); resetTable() }}>x</button>
            </Modal>
        </>
    )
}
export default GetUsingTable