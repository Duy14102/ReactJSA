import { useEffect, useState, useRef } from "react";
import Modal from 'react-modal';
import axios from "axios";
import Swal from "sweetalert2";
import ReactPaginate from 'react-paginate';

function GetOtherUser({ type, type2, pipe, hype }) {
    const [data, setData] = useState([]);
    const [ModalData, setModalData] = useState([]);
    const [modalOpenDetail, setModalOpenDetail] = useState(false);
    const [updateemail, setEmail] = useState();
    const [updatepassword, setPassword] = useState();
    const [updatefullname, setFullname] = useState();
    const [updatephone, setUpdatephone] = useState();

    const [pageCount, setPageCount] = useState(6);
    const currentPage = useRef();
    const limit = 8

    useEffect(() => {
        currentPage.current = 1;
        getPagination()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function handlePageClick(e) {
        currentPage.current = e.selected + 1
        getPagination();
    }

    function getPagination() {
        const configuration = {
            method: "get",
            url: "https://eatcom.onrender.com/GetAllUser",
            params: {
                type: type,
                type2: type2,
                pipe: pipe,
                hype: hype,
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

    //Update User
    const handleSubmit2 = (e, id) => {
        // prevent the form from refreshing the whole page
        e.preventDefault();
        const configuration = {
            method: "post",
            url: "https://eatcom.onrender.com/UpdateUser",
            data: {
                updateid: id,
                updateemail,
                updatepassword,
                updatefullname,
                updatephone
            },
        };
        axios(configuration)
            .then(() => {
                Swal.fire(
                    'Update Successfully!',
                    '',
                    'success'
                ).then(function () {
                    window.location.reload();
                })
            })
            .catch(() => {
                Swal.fire(
                    'Update Fail!',
                    '',
                    'error'
                )
            });
    }
    return (
        <>
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
                                <td className="thhuhu">{i.role === 1 ? "User" : i.role === 2 ? "Order coordinator" : i.role === 2.5 ? "Chef" : i.role === 3 ? "Manager" : i.role === 4 ? "Admin" : null}</td>
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
                    <form onSubmit={(e) => handleSubmit2(e, ModalData._id)} className="login100-form validate-form">
                        <div className="overHereB">
                            <div className="insideHereB">
                                <label>Email</label>
                                <input className='textDeny' defaultValue={ModalData.email} value={updateemail} type='email' name='updateemail' onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="insideHereB">
                                <label>Password</label>
                                <input className='textDeny' value={updatepassword} type='password' name='updatepassword' onChange={(e) => setPassword(e.target.value)} placeholder="●●●●●●●●●●" />
                            </div>
                        </div>
                        <div className="overHereB">
                            <div className="insideHereB">
                                <label>Fullname</label>
                                <input className='textDeny' defaultValue={ModalData.fullname} value={updatefullname} type='text' name='updatefullname' onChange={(e) => setFullname(e.target.value)} />
                            </div>
                            <div className="insideHereB">
                                <label>Phone number</label>
                                <input className='textDeny' defaultValue={ModalData.phonenumber} value={updatephone} type='number' name='updatephone' onChange={(e) => setUpdatephone(e.target.value)} />
                            </div>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-around align-items-center">
                            <button type='button' onClick={() => setModalOpenDetail(false)} className='btn btn-secondary'>Cancel</button>
                            <button type='submit' className='btn btn-primary'>Update</button>
                        </div>
                    </form>
                </div >
                <button className='closeModal' onClick={() => setModalOpenDetail(false)}>x</button>
            </Modal>
        </>
    );
}
export default GetOtherUser;