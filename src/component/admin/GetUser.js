import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import Modal from 'react-modal';
import axios from "axios";
import Swal from "sweetalert2";
function GetUser() {
    const [data, setData] = useState([]);
    const [detail, setDetail] = useState([]);
    const [modalOpenDetail, setModalOpenDetail] = useState(false);
    const [updateemail, setEmail] = useState();
    const [updatepassword, setPassword] = useState();
    const [updatefullname, setFullname] = useState();

    useEffect(() => {
        fetch("http://localhost:3000/GetAllUser", {
            method: "get",
        }).then((res) => res.json()).then((data) => {
            setData(data.data);
        })
    }, [])

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
    const handleSubmit = (e, id) => {
        // prevent the form from refreshing the whole page
        e.preventDefault();
        const configuration = {
            method: "post",
            url: "http://localhost:3000/UpdateUser",
            data: {
                updateid: id,
                updateemail,
                updatepassword,
                updatefullname
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
            <table className='table table-bordered text-center'>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>FullName</th>
                        <th>Role</th>
                        <th></th>
                    </tr>
                </thead>
                {data.map(i => {
                    return (
                        <tbody key={i._id}>
                            <tr>
                                <td>{i.email}</td>
                                <td>{i.fullname}</td>
                                {i.role === 1 ? (
                                    <td>User</td>
                                ) : (
                                    <td>Admin</td>
                                )}
                                {decode.userId === i._id ? (
                                    <td onClick={setModalOpenDetail}><button onClick={() => DetailUser(i._id)} className="btn btn-success">Detail</button></td>
                                ) : (
                                    <td></td>
                                )}
                            </tr>
                        </tbody>
                    )
                })}
                <Modal
                    isOpen={modalOpenDetail} onRequestClose={() => setModalOpenDetail(false)} ariaHideApp={false}
                    style={{
                        overlay: {
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
                            width: 400,
                            overflow: "hidden",
                        },
                    }}>

                    {Object.values(detail).map(i => {
                        if (updateemail === null) {
                            setEmail(i.email)
                        }
                        if (updatefullname === null) {
                            setFullname(i.fullname)
                        }
                        return (
                            <div className='p-3' key={i._id}>
                                <form onSubmit={(e) => handleSubmit(e, i._id)} className="login100-form validate-form">
                                    <label>Email</label>
                                    <input className='form-control' type='text' name='updateemail' value={updateemail} onChange={(e) => setEmail(e.target.value)} placeholder={i.email}></input>
                                    <label>Password</label>
                                    <input className='form-control' type='password' name='updatepassword' value={updatepassword} onChange={(e) => setPassword(e.target.value)}></input>
                                    <label>Fullname</label>
                                    <input className='form-control' type='text' name='updatefullname' value={updatefullname} onChange={(e) => setFullname(e.target.value)} placeholder={i.fullname}></input>
                                    <hr />
                                </form>
                                <div className="text-center mt-3">
                                    <button type='submit' onClick={(e) => handleSubmit(e, i._id)} className='btn btn-success'>Update</button>
                                </div>
                            </div >
                        )
                    })}
                    <button className='closeModal' onClick={() => setModalOpenDetail(false)}>x</button>
                </Modal>

            </table>
        </>
    );
}
export default GetUser;