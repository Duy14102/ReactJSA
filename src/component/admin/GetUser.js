import jwtDecode from "jwt-decode";
import { useEffect, useState, useRef } from "react";
import Cookies from "universal-cookie";
import Modal from 'react-modal';
import axios from "axios";
import Swal from "sweetalert2";
import ReactPaginate from 'react-paginate';
import GiveTask from "./GiveTask";

function GetUser({ type, pipe }) {
    const [data, setData] = useState([]);
    const [detail, setDetail] = useState([]);
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
            url: "http://localhost:3000/GetAllUser",
            params: {
                type: type,
                pipe: pipe,
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

    // Detail User
    const DetailUser = (id) => {
        const configuration = {
            method: "get",
            url: "http://localhost:3000/GetDetailUser",
            params: {
                userid: id
            }
        };
        axios(configuration)
            .then((result) => {
                setDetail(result.data);
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
            url: "http://localhost:3000/UpdateUser",
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
    const cookies = new Cookies();
    const token = cookies.get("TOKEN");
    const decode = jwtDecode(token);
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
                                {i.role === 1 ? (
                                    <td className="thhuhu">User</td>
                                ) : i.role === 3 ? (
                                    <td className="thhuhu">Admin</td>
                                ) : (
                                    <td className="thhuhu">Employee</td>
                                )}
                                {decode.userId === i._id ? (
                                    <td onClick={setModalOpenDetail}><button onClick={() => DetailUser(i._id)} className="btn btn-success">Detail</button></td>
                                ) : i.role === 2 ? (
                                    <td ><GiveTask id={i._id} /></td>
                                ) : (<td></td>)}
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

                {Object.values(detail).map(i => {
                    if (updatepassword === null) {
                        setPassword(i.password)
                    }
                    return (
                        <div className='p-3' key={i._id}>
                            <h3 className="text-center">User Detail</h3>
                            <hr />
                            <form onSubmit={(e) => handleSubmit2(e, i._id)} className="login100-form validate-form">
                                <div className="overHereB">
                                    <div className="insideHereB">
                                        <label>Email</label>
                                        <input className='textDeny' defaultValue={i.email} value={updateemail} type='email' name='updateemail' onChange={(e) => setEmail(e.target.value)} />
                                    </div>
                                    <div className="insideHereB">
                                        <label>Password</label>
                                        <input className='textDeny' value={updatepassword} type='password' name='updatepassword' onChange={(e) => setPassword(e.target.value)} placeholder="●●●●●●●●●●" />
                                    </div>
                                </div>
                                <div className="overHereB">
                                    <div className="insideHereB">
                                        <label>Fullname</label>
                                        <input className='textDeny' defaultValue={i.fullname} value={updatefullname} type='text' name='updatefullname' onChange={(e) => setFullname(e.target.value)} />
                                    </div>
                                    <div className="insideHereB">
                                        <label>Phone number</label>
                                        <input className='textDeny' defaultValue={i.phonenumber} value={updatephone} type='number' name='updatephone' onChange={(e) => setUpdatephone(e.target.value)} />
                                    </div>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-around align-items-center">
                                    <button type='button' onClick={() => setModalOpenDetail(false)} className='btn btn-secondary'>Cancel</button>
                                    <button type='submit' className='btn btn-primary'>Update</button>
                                </div>
                            </form>
                        </div >
                    )
                })}
                <button className='closeModal' onClick={() => setModalOpenDetail(false)}>x</button>
            </Modal>
        </>
    );
}
export default GetUser;