import Modal from 'react-modal';
import GetOtherUser from './GetOtherUser';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';
import GetUser from './GetUser';

function MainUser() {
    const [modalOpenAdmin, setModalOpenAdmin] = useState(false);
    const [modalOpenAdmin2, setModalOpenAdmin2] = useState(false);
    const [openTable, setOpenTable] = useState(false)
    const [nameInput, setNameInput] = useState("")
    const [dataafter, setDataAfter] = useState([])
    const [email, setEmail] = useState("");
    const [fullname, setFullname] = useState("");
    const [password, setPassword] = useState("");
    const [phonenumber, setPhonenumber] = useState("");
    const [role, setRole] = useState()
    const [confirm, setConfirm] = useState("");
    const [error, displayError] = useState(false);
    const [error2, displayError2] = useState(false);

    const [pageCount, setPageCount] = useState(6);
    const currentPage = useRef();
    const limit = 8

    useEffect(() => {
        currentPage.current = 1;
        document.getElementById("defaultOpen4").click();
    }, [])

    function openCity4(evt, cityName) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent4");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("MBbutton4");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active4", "");
        }
        document.getElementById(cityName).style.display = "block";
        evt.currentTarget.className += " active4";
    }


    const handleSubmit = (e) => {
        // prevent the form from refreshing the whole page
        e.preventDefault();
        const configuration = {
            method: "post",
            url: "https://eatcom.onrender.com/AddAdmin",
            data: {
                email,
                password,
                fullname,
                phonenumber,
                role
            },
        };
        if (password !== confirm) {
            displayError(true);
        } else {
            if (role) {
                axios(configuration)
                    .then(() => {
                        Swal.fire(
                            'Added Successfully!',
                            '',
                            'success'
                        ).then(function () {
                            window.location.reload();
                        })
                    })
                    .catch((err) => {
                        Swal.fire(
                            'Added Fail!',
                            '',
                            'error'
                        ).then(() => {
                            console.log(err);
                        })
                    });
            } else {
                displayError2(true);
            }
        }
    }

    function handlePageClick(e) {
        currentPage.current = e.selected + 1
        findUser();
    }

    const findUser = (e) => {
        e?.preventDefault()
        const configuration = {
            method: "get",
            url: "https://eatcom.onrender.com/Find4User",
            params: {
                name: nameInput,
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

    return (
        <>
            <div className="myDIVdad">
                <div style={{ gap: 5 + "%" }} id="myDIV4" className="d-flex align-items-center">
                    <button id="defaultOpen4" className="MBbutton4 active4" onClick={(e) => openCity4(e, 'Userse')}><p >User account</p></button>
                    <button className="MBbutton4" onClick={(e) => openCity4(e, 'Other')}><p>Other account</p></button>
                    <button className="MBbutton4 thirdClassMb" onClick={(e) => openCity4(e, 'OtherBlock')}><p>Banned account</p></button>
                </div>
                <div className='laughtale'>
                    <button onClick={() => setModalOpenAdmin2(true)} className="btn btn-primary">🔎 Account</button>
                    <button onClick={() => setModalOpenAdmin(true)} className="btn btn-primary">➕ Employee</button>
                </div>
            </div>
            <div id="Userse" className="tabcontent4">
                <div className="pt-4">
                    <GetUser type={1} status={1} />
                </div>
            </div>

            <div id="Other" className="tabcontent4">
                <div className="pt-4">
                    <GetOtherUser type={2} type2={2.5} pipe={3} hype={4} />
                </div>
            </div>

            <div id="OtherBlock" className="tabcontent4">
                <div className="pt-4">
                    <GetUser type={1} status={2} />
                </div>
            </div>
            <Modal
                isOpen={modalOpenAdmin2} onRequestClose={() => setModalOpenAdmin2(false)} ariaHideApp={false}
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
                <div className='pt-3'>
                    <h2 className='text-center'>Input user name</h2>
                    <div className='overOutsider'>
                        <div className='outsider'>
                            <form onSubmit={(e) => findUser(e)}>
                                <input type='submit' style={{ display: "none" }} />
                                <div className='d-flex justify-content-between w-100'>
                                    <input onInput={(e) => setNameInput(e.target.value)} type='text' placeholder='User name...' required />
                                    <button style={{ width: 10 + "%" }} type="submit"><i className="fi fi-br-search"></i></button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                {openTable ? (
                    <>
                        <table className='table solotable mt-3 text-center'>
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th className='thhuhu'>Fullname</th>
                                    <th className='thhuhu'>Role</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.values(dataafter).map((i) => {
                                    return (
                                        <tr key={i._id}>
                                            <td>{i.email}</td>
                                            <td className='thhuhu'>{i.fullname}</td>
                                            <td className='thhuhu'>{i.role === 1 ? "User" : i.role === 2 ? "Order coordinator" : i.role === 2.5 ? "Chef" : i.role === 3 ? "Manager" : i.role === 4 ? "Admin" : null}</td>
                                            <td><button className='btn btn-success'>Detail</button></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
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
                    </>
                ) : null}
                <button className='closeModal' onClick={() => { setModalOpenAdmin2(false); setOpenTable(false) }}>x</button>
            </Modal>
            <Modal
                isOpen={modalOpenAdmin} onRequestClose={() => setModalOpenAdmin(false)} ariaHideApp={false}
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
                <div className="p-3">
                    <div className="text-center">
                        <h3>Add Employee</h3>
                    </div>
                    <hr />
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <div className='overHereB'>
                            <div className='insideHereB'>
                                <label>Email</label>
                                <input className='textDeny' type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className='insideHereB'>
                                <label>Password</label>
                                <input className='textDeny' type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        </div>

                        <div className='overHereB pt-3'>
                            <div className='insideHereB'>
                                <label>Fullname</label>
                                <input className='textDeny' type="text" name="fullname" value={fullname} onChange={(e) => setFullname(e.target.value)} />
                            </div>

                            <div className='insideHereB'>
                                <label>Repeat Password</label>
                                <input className='textDeny' type="password" name="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                                {error ? (
                                    <p className="text-danger">Repeat correcly password!</p>
                                ) : (
                                    <input type='hidden' />
                                )}
                            </div>
                        </div>

                        <div className='overHereB py-3'>
                            <div className='insideHereB'>
                                <label>Phone Number</label>
                                <input className='textDeny' type="number" name="phonenumber" value={phonenumber} onChange={(e) => setPhonenumber(e.target.value)} />
                            </div>

                            <div className='insideHereB'>
                                <label>Role</label>
                                <select className={navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1 ? "cutSaf" : "textDeny"} onChange={(e) => setRole(e.target.value)}>
                                    <option disabled hidden selected>Choose Role</option>
                                    <option value={3}>Manager</option>
                                    <option value={2}>Order coordinator</option>
                                    <option value={2.5}>Chef</option>
                                </select>
                            </div>
                        </div>
                        {error2 ? (
                            <p className='text-danger text-center'>Choose Role !</p>
                        ) : null}
                        <hr />
                        <div className='d-flex justify-content-around align-items-center pt-2'>
                            <button className="btn btn-secondary" onClick={() => setModalOpenAdmin(false)} type='button'>Cancel</button>
                            <button className="btn btn-primary" type='submit'>Confirm</button>
                        </div>
                    </form>
                </div>
                <button className='closeModal' onClick={() => setModalOpenAdmin(false)}>x</button>
            </Modal>
        </>
    );
}
export default MainUser;