import { useState, useEffect, useRef } from "react";
import ReactPaginate from "react-paginate";
import Modal from 'react-modal';
import axios from "axios";

function GetHistoryTable() {
    const [table, setTable] = useState([])
    const [modalOpenDetail, setModalOpenDetail] = useState(false);
    const [ModalData, setModalData] = useState([])
    const [pageCount, setPageCount] = useState(6);
    const currentPage = useRef();
    const limit = 9
    var total = 0
    var fulltotal = 0

    useEffect(() => {
        currentPage.current = 1;
        getPagination()
    }, [])

    function handlePageClick(e) {
        currentPage.current = e.selected + 1
        getPagination();
    }

    function getPagination() {
        const configuration = {
            method: "get",
            url: "http://localhost:3000/GetHistoryTable",
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

    const date = new Date(ModalData.tabledate).toLocaleDateString()
    const time = new Date(ModalData.tabledate).toLocaleTimeString()
    const datetime = date + " - " + time

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    return (
        <>
            <table className="table table-bordered text-center">
                <thead>
                    <tr className="text-white" style={{ background: "#374148" }}>
                        <th>Name</th>
                        <th>Date</th>
                        <th>Employee</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {table.map((i) => {
                        const date = new Date(i.tabledate).toLocaleDateString()
                        const time = new Date(i.tabledate).toLocaleTimeString()
                        const datetime = date + " - " + time
                        return (
                            <tr key={i._id} style={{ background: "#2C343A", color: "lightgray", verticalAlign: "middle" }}>
                                <td>{i.tablename}</td>
                                <td>{datetime}</td>
                                {i.employee?.map((a) => {
                                    return (
                                        <td key={a}>{a.email}</td>
                                    )
                                })}
                                <td><button onClick={() => { setModalOpenDetail(true); setModalData(i) }} className="btn btn-success">Detail</button></td>
                            </tr>
                        )
                    })}
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
                        width: "70vw",
                        zIndex: 999
                    },
                }}>
                <h2 className='text-center'>Table Detail</h2>
                <div className="coverNOut">
                    <p className="m-0"><b>Id</b> : {ModalData._id}</p>
                    {ModalData.customerid ? (
                        <p className="m-0"><b>Type</b> : Pre-order table</p>
                    ) : (
                        <p className="m-0"><b>Type</b> : Normal Table</p>
                    )}
                </div>
                <hr />
                <div className="coverNOut">
                    <p><b>Table name</b> : {ModalData.tablename}</p>
                    {ModalData.employee?.map((u) => {
                        return (
                            <p><b>Employee</b> : {u.email}</p>
                        )
                    })}
                </div>
                <p><b>Date</b> : {datetime}</p>
                <p><b>Items</b> : </p>
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
                            total = a.item.foodprice * a.quantity
                            fulltotal += total
                            return (
                                <tr key={a.item._id}>
                                    <td>{a.item.foodname}</td>
                                    <td>{a.item.foodcategory}</td>
                                    <td>{a.quantity}</td>
                                    <td>{VND.format(a.item.foodprice)}</td>
                                </tr>
                            )
                        })}
                        <tr>
                            <th colSpan={3}>Fulltotal</th>
                            <th>{VND.format(fulltotal)}</th>
                        </tr>
                    </tbody>
                </table>
                <button className='closeModal' onClick={() => setModalOpenDetail(false)}>x</button>
            </Modal>
        </>
    )
}
export default GetHistoryTable