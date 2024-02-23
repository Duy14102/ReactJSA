import { useState, useRef, useEffect } from 'react';
import Modal from 'react-modal';
import JoditEditor from 'jodit-react'
import axios from 'axios';
import Swal from 'sweetalert2';
import ReactPaginate from "react-paginate";
import socketIOClient from "socket.io-client";

function GetAnnounce({ decode }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [ModalData, setModalData] = useState([])
    const [news, setNews] = useState([])
    const [title, setTitle] = useState()
    const [message, setMessage] = useState()
    const editor = useRef(null)
    const socketRef = useRef();
    const [pageCount, setPageCount] = useState(6);
    const currentPage = useRef();
    const limit = 8

    const date2 = new Date(ModalData.createdAt).toLocaleDateString()
    const time2 = new Date(ModalData.createdAt).toLocaleTimeString()
    const datetime2 = date2 + " - " + time2
    var status = ""
    if (ModalData.status === 1) {
        status = "🟢"
    }
    if (ModalData.status === 2) {
        status = "🔴"
    }

    function Success() {
        Swal.fire(
            `Successfully!`,
            '',
            'success'
        ).then(function () {
            window.location.reload();
        })
    }

    function Fail() {
        Swal.fire(
            `Fail!`,
            '',
            'error'
        )
    }

    useEffect(() => {
        currentPage.current = 1;
        Pagination()

        socketRef.current = socketIOClient.connect("https://eatcom.onrender.com")

        socketRef.current.on('UpdateNewsSuccess', dataGot => {
            if (dataGot.mag === decode.userId) {
                Success()
            } else {
                Pagination();
            }
        })

        socketRef.current.on('UpdateNewsFail', dataGot => {
            if (dataGot.mag === decode.userId) {
                Fail()
            } else {
                Pagination();
            }
        })

        return () => {
            socketRef.current.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function handlePageClick(e) {
        currentPage.current = e.selected + 1
        Pagination();
    }

    function Pagination() {
        const configuration = {
            method: "get",
            url: "https://eatcom.onrender.com/GetAllNews",
            params: {
                page: currentPage.current,
                limit: limit
            }
        }
        axios(configuration)
            .then((result) => {
                setNews(result.data.results.result)
                setPageCount(result.data.results.pageCount)
            }).catch((err) => {
                console.log(err);
            })
    }

    const addAnn = (e) => {
        e.preventDefault()
        const data = { id: ModalData._id, title: title, message: message, status: ModalData.status, mag: decode.userId }
        socketRef.current.emit('UpdateNewsSocket', data)
    }

    const deleteAnn = () => {
        const data = { id: ModalData._id, mag: decode.userId }
        socketRef.current.emit('DeleteNewsSocket', data)
    }

    const changeStatus = () => {
        const data = { id: ModalData._id, status: ModalData.status, mag: decode.userId }
        socketRef.current.emit('ChangeNewsStatusSocket', data)
    }
    return (
        <>
            {news.length > 0 ? (
                <>
                    <table className="table table-bordered solotable text-center">
                        <thead>
                            <tr className="text-white" style={{ background: "#374148" }}>
                                <th className='thhuhu'>Title</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody style={{ background: "#2C343A", color: "lightgray", verticalAlign: "middle" }}>
                            {Object.values(news).map((i) => {
                                const date = new Date(i.createdAt).toLocaleDateString()
                                const time = new Date(i.createdAt).toLocaleTimeString()
                                const datetime = date + " - " + time
                                var call = ""
                                if (i.status === 1) {
                                    call = "Inactive"
                                } if (i.status === 2) {
                                    call = "Active"
                                }
                                return (
                                    <tr key={i._id}>
                                        <td className='thhuhu'>{i.title}</td>
                                        <td>{datetime}</td>
                                        <td>{call}</td>
                                        <td><button onClick={() => { setModalOpen(true); setModalData(i) }} className="btn btn-success">Detail</button></td>
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
            ) : (
                <p className="text-center text-muted">There's no announcement!</p>
            )}
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
                        width: "70vw",
                        height: "57vh",
                        zIndex: 999
                    },
                }}>
                <h2 className='text-center'>Announce Detail</h2>
                <div className='coverNOut'>
                    <p><b>Date</b> : {datetime2}</p>
                    <p className='m-0'><b>Change Status</b> : <button className='colorButtonAc' onClick={() => changeStatus()}>{status}</button></p>
                </div>
                <hr />
                <form onSubmit={(e) => addAnn(e)}>
                    <label htmlFor="putTheFuckName2">Title</label>
                    <input id="putTheFuckName2" defaultValue={ModalData.title} value={title} className="textDeny" onChange={(e) => setTitle(e.target.value)} required />
                    <label className="pt-4" htmlFor="">Message</label>
                    <JoditEditor
                        required
                        ref={editor}
                        value={ModalData.message}
                        onChange={(e) => setMessage(e)}
                    />
                    <div className="d-flex align-items-center pt-3 justify-content-evenly" style={{ gap: 1 + "%" }}>
                        <button type="submit" className="btn btn-primary">Update</button>
                        <button type="button" onClick={() => deleteAnn()} className="btn btn-danger">Delete</button>
                    </div>
                </form>
                <button className='closeModal' onClick={() => setModalOpen(false)}>x</button>
            </Modal>
        </>
    )
}
export default GetAnnounce