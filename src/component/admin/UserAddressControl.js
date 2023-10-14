import axios from 'axios';
import { useState, useEffect, Fragment } from 'react';
import Modal from 'react-modal';
import Swal from 'sweetalert2';

function UserAddressControl({ address, edit, userid }) {
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
        fetch(`http://localhost:3000/GetDetailUser?userid=${userid}`, {
            method: "get",
        }).then((res) => res.json()).then((data) => {
            setGetAddress(data);
        })
    }, [userid])

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
                        <button onClick={setModalOpenDetail} type="button" className="plusElf"><i className="fas fa-edit"></i></button>
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
                                    <td className='inputC' style={{ width: 85 + "%" }}>
                                        <input type='text' onChange={(e) => setProAddress(e.target.value)} className='w-100' required />
                                        {CheckNull ? (
                                            <p className='text-danger'>Address needed!</p>
                                        ) : null}
                                    </td>
                                    <td style={{ width: 15 + "%" }}>
                                        <button onClick={() => addAddress()} type='submit' className='btn btn-success'>Confirm</button>
                                    </td>
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
                                                            <td style={{ width: 85 + "%" }}>{a}</td>
                                                            <td style={{ background: "gray", padding: 0.1 + "px", opacity: 0.2 }}></td>
                                                            <td className='text-center' style={{ width: 15 + "%" }}><button onClick={() => deleteAddress(a)} style={{ padding: 4 + "%" }} className='btn btn-danger px-1'>X</button></td>
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