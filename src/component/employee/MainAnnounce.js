import axios from "axios"
import ReactPaginate from "react-paginate";
import { useState, useEffect, useRef } from "react"
import AddAnnounce from "./AddAnnounce"
import GetAnnounce from "./GetAnnounce"
import Modal from 'react-modal';
import JoditEditor from 'jodit-react'
import Swal from "sweetalert2";

function MainAnnounce() {
    const [modalOpenDetail, setModalOpenDetail] = useState(false);
    const [modalOpenDetail2, setModalOpenDetail2] = useState(false);
    const [DateInput, setDateInput] = useState()
    const [openTable, setOpenTable] = useState(false)
    const [dataafter, setDataAfter] = useState([])
    const [ModalData, setModalData] = useState([])
    const [title, setTitle] = useState()
    const [message, setMessage] = useState()

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

    useEffect(() => {
        currentPage.current = 1;
    }, [])

    function handlePageClick(e) {
        currentPage.current = e.selected + 1
        findAnnounce();
    }

    const findAnnounce = (e) => {
        e?.preventDefault()
        const configuration = {
            method: "get",
            url: "http://localhost:3000/SearchAllAnnounce",
            params: {
                date: DateInput,
                page: currentPage.current,
                limit: limit
            },
        };
        axios(configuration)
            .then((result) => {
                setOpenTable(true)
                setDataAfter(result.data.results.result);
                setPageCount(result.data.results.pageCount)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const addAnn = (e) => {
        e.preventDefault()
        const configuration = {
            method: "post",
            url: "http://localhost:3000/UpdateNews",
            data: {
                id: ModalData._id,
                title: title,
                message: message
            }
        }
        axios(configuration)
            .then(() => {
                Swal.fire(
                    'Update Successfully!',
                    '',
                    'success'
                ).then(function () {
                    window.location.reload();
                })
            }).catch(() => {
                Swal.fire(
                    'Update Fail!',
                    '',
                    'error'
                )
            })
    }

    const deleteAnn = () => {
        const configuration = {
            method: "post",
            url: "http://localhost:3000/DeleteNews",
            data: {
                id: ModalData._id
            }
        }
        axios(configuration)
            .then(() => {
                Swal.fire(
                    'Delete Successfully!',
                    '',
                    'success'
                ).then(function () {
                    window.location.reload();
                })
            }).catch(() => {
                Swal.fire(
                    'Delete Fail!',
                    '',
                    'error'
                )
            })
    }

    const changeStatus = () => {
        const configuration = {
            method: "post",
            url: "http://localhost:3000/ChangeNewsStatus",
            data: {
                id: ModalData._id,
                status: ModalData.status
            }
        }
        axios(configuration)
            .then(() => {
                Swal.fire(
                    'Change Status Successfully!',
                    '',
                    'success'
                ).then(function () {
                    window.location.reload();
                })
            }).catch(() => {
                Swal.fire(
                    'Change Status Fail!',
                    '',
                    'error'
                )
            })
    }

    return (
        <>
            <div className="addAnn">
                <button onClick={() => setModalOpenDetail(true)} className="btn btn-primary">🔎 Announce</button>
                <AddAnnounce />
            </div>
            <Modal
                isOpen={modalOpenDetail} onRequestClose={() => setModalOpenDetail(false)} ariaHideApp={false}
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
                        height: "55vh",
                        zIndex: 999
                    },
                }}>
                <h2 className='text-center text-nowrap'>Input announce date</h2>
                <div className='overOutsider'>
                    <div className='outsider'>
                        <form onSubmit={(e) => findAnnounce(e)}>
                            <input type='submit' style={{ display: "none" }} />
                            <div className='d-flex justify-content-between w-100'>
                                <input onInput={(e) => setDateInput(e.target.value)} type='date' required />
                                <button style={{ width: 10 + "%" }} type="submit"><i className="fi fi-br-search"></i></button>
                            </div>
                        </form>
                    </div>
                </div>
                {openTable ? (
                    <>
                        <table className='table solotable mt-3 text-center'>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.values(dataafter).map((i) => {
                                    const date = new Date(i.createdAt).toLocaleDateString()
                                    const time = new Date(i.createdAt).toLocaleTimeString()
                                    const datetime = date + " - " + time
                                    var statusCheck = ""
                                    if (i.status === 1) {
                                        statusCheck = "Inactive"
                                    } else if (i.status === 2) {
                                        statusCheck = "Active"
                                    }
                                    return (
                                        <tr key={i._id}>
                                            <td>{i.title}</td>
                                            <td>{datetime}</td>
                                            <td>{statusCheck}</td>
                                            <td><button onClick={() => { setModalOpenDetail(false); setModalOpenDetail2(true); setModalData(i) }} className='btn btn-success'>Detail</button></td>
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
                ) : null}
                <button className='closeModal' onClick={() => { setModalOpenDetail(false); setOpenTable(false) }}>x</button>
            </Modal>
            <Modal
                isOpen={modalOpenDetail2} onRequestClose={() => setModalOpenDetail2(false)} ariaHideApp={false}
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
                        height: "55vh",
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
                        value={ModalData.message}
                        onChange={(e) => setMessage(e)}
                    />
                    <div className="d-flex align-items-center pt-3 justify-content-evenly" style={{ gap: 1 + "%" }}>
                        <button type="submit" className="btn btn-primary">Update</button>
                        <button type="button" onClick={() => deleteAnn()} className="btn btn-danger">Delete</button>
                    </div>
                </form>
                <button className='closeModal' onClick={() => { setModalOpenDetail(true); setModalOpenDetail2(false) }}>x</button>
            </Modal>
            <div className="pt-4">
                <GetAnnounce />
            </div>
        </>
    )
}
export default MainAnnounce