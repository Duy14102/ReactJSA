import { useState, useEffect, useRef } from "react";
import axios from 'axios';
import ReactPaginate from "react-paginate";
import Modal from 'react-modal';
import Swal from "sweetalert2";

function GetContact() {
    const [ModalData, setModalData] = useState([])
    var [modalOpenDetail2, setModalOpenDetail2] = useState(false);
    const [GetContact, setGetContact] = useState([])
    const [pageCount, setPageCount] = useState(6);
    const currentPage = useRef();
    const limit = 8

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
            url: "http://localhost:3000/GetContact",
            params: {
                page: currentPage.current,
                limit: limit
            }
        };
        axios(configuration)
            .then((result) => {
                setGetContact(result.data.results.result);
                setPageCount(result.data.results.pageCount)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const DeleteContact = (e) => {
        const configuration = {
            method: "post",
            url: "http://localhost:3000/DeleteContact",
            data: {
                id: e
            }
        }
        axios(configuration)
            .then(() => {
                Swal.fire(
                    'Delete Success!',
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
                ).then(function () {
                    window.location.reload();
                })
            })
    }

    const datemodal = new Date(ModalData.createdAt)
    return (
        <>
            {GetContact.length > 0 ? (
                <>

                    <table className='table table-bordered'>
                        <thead>
                            <tr className='text-center text-white' style={{ background: "#374148" }}>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Date</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {GetContact.map((i) => {
                                const datetime = new Date(i.createdAt)
                                return (
                                    <tr key={i._id} className='text-center' style={{ background: "#2C343A", color: "lightgray" }}>
                                        <td>{i.name}</td>
                                        <td>{i.email}</td>
                                        <td>{datetime.toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })}</td>
                                        <td onClick={setModalOpenDetail2}><button onClick={() => setModalData(i)} className='btn btn-success'>Detail</button></td>
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
                    <Modal id="otpModal" isOpen={modalOpenDetail2} onRequestClose={() => setModalOpenDetail2(false)} ariaHideApp={false}
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
                                zIndex: 999
                            },
                        }}>
                        <h2 className='text-center'>Contact Details</h2>
                        <div className="coverNOut">
                            <p className="m-0"><b>Date</b> : {datemodal.toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })}</p>
                            <button onClick={() => DeleteContact(ModalData._id)} className="btn btn-danger">Delete</button>
                        </div>
                        <hr />
                        <p><b>Name</b> : {ModalData.name}</p>
                        <p><b>Email</b> : {ModalData.email}</p>
                        <p><b>Title</b> : {ModalData.title}</p>
                        <textarea className="contactMessage" defaultValue={ModalData.message} />
                        <button className='closeModal' onClick={() => setModalOpenDetail2(false)}>x</button>
                    </Modal>
                </>
            ) : (
                <p className="text-center" style={{ color: "lightgray" }}>Contact list empty!</p>
            )}
        </>
    )
}
export default GetContact