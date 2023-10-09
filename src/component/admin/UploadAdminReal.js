import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
function UploadAdminReal() {
    const [email, setEmail] = useState("");
    const [fullname, setFullname] = useState("");
    const [password, setPassword] = useState("");
    const [phonenumber, setPhonenumber] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, displayError] = useState(false);

    const handleSubmit = (e) => {
        // prevent the form from refreshing the whole page
        e.preventDefault();
        const configuration = {
            method: "post",
            url: "http://localhost:3000/AddAdmin",
            data: {
                email,
                password,
                fullname,
                phonenumber
            },
        };
        if (password !== confirm) {
            displayError(true);
        } else {
            axios(configuration)
                .then((result) => {
                    Swal.fire(
                        'Added Successfully!',
                        'Welcome ' + result.data.fullname,
                        'success'
                    ).then(function () {
                        window.location.reload();
                    })
                })
                .catch((error) => {
                    Swal.fire(
                        'Added Fail!',
                        '',
                        'error'
                    )
                });
        }
    }
    return (
        <>
            <div className="p-3">
                <div className="text-center">
                    <h2>Add Admin</h2>
                </div>
                <hr />
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div>
                        <label>Email</label>
                        <input className='form-control' type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <label>Password</label>
                        <input className='form-control' type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    <div>
                        <label>Repeat Password</label>
                        <input className='form-control' type="password" name="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                    </div>
                    {error ? (
                        <p className="text-danger">Repeat correcly password!</p>
                    ) : (
                        <input type='hidden' />
                    )}

                    <div>
                        <label>Fullname</label>
                        <input className='form-control' type="text" name="fullname" value={fullname} onChange={(e) => setFullname(e.target.value)} />
                    </div>

                    <div>
                        <label>Phone Number</label>
                        <input className='form-control' type="number" name="phonenumber" value={phonenumber} onChange={(e) => setPhonenumber(e.target.value)} />
                    </div>
                    <div className='text-center mt-3'>
                        <button className="btn btn-primary" type='submit' onClick={(e) => handleSubmit(e)}>
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
export default UploadAdminReal;