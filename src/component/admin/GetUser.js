import { useEffect, useState, useRef } from "react";
import Modal from 'react-modal';
import axios from "axios";
import ReactPaginate from 'react-paginate';
import Swal from "sweetalert2";
import socketIOClient from "socket.io-client";

function GetUser({ type, status }) {
    const [data, setData] = useState([]);
    const [ModalData, setModalData] = useState([])
    const [modalOpenDetail, setModalOpenDetail] = useState(false);
    const [modalOpenDetail2, setModalOpenDetail2] = useState(false);
    const [newUser, setNewUser] = useState(false)
    const [deleteUser, setDeleteUser] = useState(false)
    const socketRef = useRef();

    const [pageCount, setPageCount] = useState(6);
    const currentPage = useRef();
    const limit = 8

    useEffect(() => {
        currentPage.current = 1;
        getPagination()

        socketRef.current = socketIOClient.connect("https://eatcom.onrender.com")

        socketRef.current.on('RegisterSuccess', dataGot => {
            getPagination()
            setNewUser(true)
        })

        socketRef.current.on('DeleteAcountSuccess', dataGot => {
            getPagination()
            setDeleteUser(true)
        })

        return () => {
            socketRef.current.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (newUser) {
            setTimeout(() => {
                setNewUser(false)
            }, 1500);
        }
        if (deleteUser) {
            setTimeout(() => {
                setDeleteUser(false)
            }, 1500);
        }
    }, [newUser, deleteUser])

    function handlePageClick(e) {
        currentPage.current = e.selected + 1
        getPagination();
    }

    function getPagination() {
        const configuration = {
            method: "get",
            url: "https://eatcom.onrender.com/GetAllUser2",
            params: {
                type: type,
                status: status,
                page: currentPage.current,
                limit: limit
            }
        };
        axios(configuration)
            .then((result) => {
                setData(result.data.results.result);
                setPageCount(result.data.results.pageCount)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function bannedAc(e) {
        const configuration = {
            method: "post",
            url: "https://eatcom.onrender.com/BannedByAdmin",
            data: {
                id: ModalData._id,
                status: e
            }
        };
        axios(configuration)
            .then(() => {
                Swal.fire(
                    'Progress Successfully!',
                    '',
                    'success'
                ).then(function () {
                    window.location.reload();
                })
            })
            .catch((error) => {
                Swal.fire(
                    'Progress Fail!',
                    '',
                    'error'
                ).then(function () {
                    console.log(error);
                })
            });
    }

    return (
        <>
            <div className="fatherNewUserNoti">
                {newUser ? (
                    <div className="newUserNoti" style={{ backgroundColor: "#03ba5f" }}>
                        <h6>✓ New user registered!</h6>
                    </div>
                ) : null}
                {deleteUser ? (
                    <div className="newUserNoti" style={{ backgroundColor: "tomato" }}>
                        <h6>X An account deleted!</h6>
                    </div>
                ) : null}
            </div>
            <table className='table table-bordered text-center solotable'>
                <thead>
                    <tr className="text-white" style={{ background: "#374148" }}>
                        <th>Email</th>
                        <th className="thhuhu">FullName</th>
                        <th className="thhuhu">Role</th>
                        <th></th>
                    </tr>
                </thead>
                {data.map(i => {
                    return (
                        <tbody key={i._id}>
                            <tr style={{ background: "#2C343A", color: "lightgray", verticalAlign: "middle" }}>
                                <td>{i.email}</td>
                                <td className="thhuhu">{i.fullname}</td>
                                {i.role === 1 ? (
                                    <td className="thhuhu">User</td>
                                ) : null}
                                <td><button onClick={() => { setModalData(i); setModalOpenDetail(true) }} className="btn btn-success">Detail</button></td>
                            </tr>
                        </tbody>
                    )
                })}
            </table>
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
                        height: "45vh",
                        zIndex: 999
                    },
                }}>
                <div className='p-3' key={ModalData._id}>
                    <h3 className="text-center">User Detail</h3>
                    <hr />
                    <form className="login100-form validate-form" style={{ pointerEvents: "none" }}>
                        <div className="overHereB">
                            <div className="insideHereB">
                                <label>Email</label>
                                <input className='textDeny' defaultValue={ModalData.email} type='email' name='updateemail' />
                            </div>
                            <div className="insideHereB">
                                <label>Password</label>
                                <input className='textDeny' type='password' name='updatepassword' placeholder="●●●●●●●●●●" />
                            </div>
                        </div>
                        <div className="overHereB">
                            <div className="insideHereB">
                                <label>Fullname</label>
                                <input className='textDeny' defaultValue={ModalData.fullname} type='text' name='updatefullname' />
                            </div>
                            <div className="insideHereB">
                                <label>Phone number</label>
                                <input className='textDeny' defaultValue={ModalData.phonenumber} type='number' name='updatephone' />
                            </div>
                        </div>
                    </form>
                    <hr />
                    {ModalData.status === 1 ? (
                        <button onClick={() => setModalOpenDetail2(true)} className="btn btn-danger">Banned</button>
                    ) : null}
                    {ModalData.status === 2 ? (
                        <button onClick={() => setModalOpenDetail2(true)} className="btn btn-danger">Unbanned</button>
                    ) : null}
                </div>
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
                        width: "20vw",
                        height: "20vh",
                        zIndex: 999
                    },
                }}>
                <div className="p-3 text-center">
                    <h5>Are you sure ?</h5>
                    <div className="d-flex justify-content-evenly pt-4">
                        {ModalData.status === 1 ? (
                            <button onClick={() => bannedAc(2)} className="btn btn-primary">Yes</button>
                        ) : ModalData.status === 2 ? (
                            <button onClick={() => bannedAc(1)} className="btn btn-primary">Yes</button>
                        ) : null}
                        <button onClick={() => setModalOpenDetail2(false)} className="btn btn-secondary">No</button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
export default GetUser;