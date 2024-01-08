import axios from 'axios';
import { useState, useEffect, Fragment } from 'react';
import Modal from 'react-modal';
import Swal from 'sweetalert2';

function UserAddressControl({ address, edit, userid, user }) {
    const [modalOpenDetail, setModalOpenDetail] = useState(false);
    const [Identity, setIdentity] = useState(false)
    const [CheckNull, setCheckNull] = useState(false)
    const [GetAddress, setGetAddress] = useState([])
    const [ProAddress, setProAddress] = useState("")
    function dropdownThis() {
        document.getElementById("myDropdownThis").classList.toggle("show");
    }

    // Close the dropdown if the user clicks outside of it
    window.onclick = function (event) {
        if (!event.target.matches('.dropbtn')) {
            var dropdowns = document.getElementsByClassName("dropdown-content");
            var i;
            for (i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }

    useEffect(() => {
        setGetAddress(user)
    }, [user])

    const deleteAddress = (e) => {
        const configuration = {
            method: "post",
            url: "http://localhost:3000/RemoveAddressUser",
            data: {
                userid: userid,
                address: e
            }
        }
        axios(configuration)
            .then(() => {
                Swal.fire(
                    'Remove Successfully!',
                    '',
                    'success'
                ).then(function () {
                    window.location.reload();
                })
            }).catch((err) => {
                console.log(err);
            })
    }

    const addAddress = () => {
        if (ProAddress === "") {
            setCheckNull(true)
        } else {
            const configuration = {
                method: "post",
                url: "http://localhost:3000/AddAddressUser",
                data: {
                    id: userid,
                    address: ProAddress
                }
            }
            axios(configuration)
                .then(() => {
                    Swal.fire(
                        'Added Successfully!',
                        '',
                        'success'
                    ).then(function () {
                        window.location.reload();
                    })
                }).catch((err) => {
                    console.log(err);
                })
        }
    }

    return (
        <>
            <div id="address" className="dropdown">
                <div style={{ gap: 5 + "%" }} className="d-flex">
                    {address.length === 0 ? (
                        <button type="button" className="dropbtn">
                            Address empty
                        </button>
                    ) : (
                        <button type="button" onClick={() => dropdownThis()} className="dropbtn">
                            Touch me
                        </button>
                    )}
                    {edit ? (
                        <button onClick={() => setModalOpenDetail(true)} type="button" className="plusElf"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" /></svg></button>
                    ) : null}
                </div>
                <div id="myDropdownThis" className="dropdown-content">
                    {address.map((a) => {
                        return (
                            <p key={a} className="m-0">{a}</p>
                        )
                    })}
                </div>
            </div>
            <Modal isOpen={modalOpenDetail} onRequestClose={() => setModalOpenDetail(false)} ariaHideApp={false}
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
                        width: "70vw",
                        overflow: "hidden",
                    },
                }}>
                <h4 className='text-center pt-2'>Address List</h4>
                <table className='table'>
                    <thead>
                        <tr className='text-end'>
                            {Identity ? (
                                <th colSpan={3}><button onClick={() => setIdentity(false)} className='plusElf'>Done</button></th>
                            ) : (
                                <th colSpan={3}><button onClick={() => setIdentity(true)} className='plusElf'>Add New</button></th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {Identity ? (
                            <>
                                <tr style={{ verticalAlign: "middle", width: 100 + "%" }}>
                                    <td style={{ width: 85 + "%" }}>
                                        <textarea type='text' className='uninput textDeny' onChange={(e) => setProAddress(e.target.value)} required />
                                        {CheckNull ? (
                                            <p className='text-danger'>Address needed!</p>
                                        ) : null}
                                    </td>
                                    <td style={{ background: "gray", padding: 0.1 + "px", opacity: 0.2 }}></td>
                                    <td style={{ height: 10 + "vh" }} className='text-center anotherJackass'><button onClick={() => addAddress()} type='submit' className='btn btn-success'>✓</button></td>
                                    <td style={{ width: 15 + "%" }} className='text-center thhuhu'><button onClick={() => addAddress()} type='submit' className='btn btn-success' >Confirm</button></td>
                                </tr>
                            </>
                        ) : (
                            <>
                                {Object.values(GetAddress).map((i) => {
                                    if (i.address.length > 0) {
                                        return (
                                            <Fragment key={i}>
                                                {i.address?.map((a) => {
                                                    return (
                                                        <tr key={a} style={{ width: 100 + "%" }}>
                                                            <td style={{ width: 85 + "%", verticalAlign: "middle" }}>{a}</td>
                                                            <td style={{ background: "gray", padding: 0.1 + "px", opacity: 0.2 }}></td>
                                                            <td className='text-center anotherJackass'><button onClick={() => deleteAddress(a)} style={{ padding: 4 + "%" }} className='btn btn-danger px-1'>X</button></td>
                                                            <td className='text-center thhuhu' style={{ width: 15 + "%" }}><button onClick={() => deleteAddress(a)} style={{ padding: 4 + "%" }} className='btn btn-danger px-1'>Delete</button></td>
                                                        </tr>
                                                    )
                                                })}
                                            </Fragment>
                                        )
                                    } else {
                                        return (
                                            <tr key={i}>
                                                <td><p className='text-center'>Your address is empty!</p></td>
                                            </tr>
                                        )
                                    }
                                })}
                            </>
                        )}
                    </tbody>
                </table>
                <button className='closeModal' onClick={() => setModalOpenDetail(false)}>x</button>
            </Modal>
        </>
    )
}
export default UserAddressControl