import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";

function DetailSearchMenu({ i }) {
    const [updatename, setFoodname] = useState();
    const [updateprice, setFoodprice] = useState();
    const [updatequantity, setFoodquantity] = useState();
    const [updatecategory, setFoodcategory] = useState();
    const [updatedescription, setFooddescription] = useState();
    const [updateimage, setFoodimage] = useState();

    // Image Menu
    function convertToBase64(e) {
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            setFoodimage(reader.result);
        };
        reader.onerror = error => {
            console.log(error);
        }
    }

    //Update Menu
    const updateMenu = (e, id) => {
        // prevent the form from refreshing the whole page
        e.preventDefault();
        const configuration = {
            method: "post",
            url: "https://eatcom.onrender.com/UpdateMenu",
            data: {
                updateid: id,
                updatename,
                updateprice,
                updatequantity,
                updatecategory,
                updatedescription,
                base64: updateimage
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

    //Delte Menu
    const DeleteMenu = (id) => {
        const configuration = {
            method: "post",
            url: "https://eatcom.onrender.com/DeleteMenu",
            params: {
                deleteid: id
            }
        };
        axios(configuration)
            .then((result) => {
                Swal.fire(
                    'Delete Successfully!',
                    '',
                    'success'
                ).then(function () {
                    window.location.reload();
                })
            })
            .catch(() => {
                Swal.fire(
                    'Delete Fail!',
                    '',
                    'error'
                )
            });
    }
    return (
        <>
            <div className='juh' key={i._id}>
                <h3 className="text-center">Menu Detail</h3>
                <hr />
                <form onSubmit={(e) => updateMenu(e, i._id)} className="login100-form validate-form">
                    <div className='reft'>
                        <div className="reftson1">
                            <label className="inputImageDup" htmlFor="inputimage2">
                                <div className="aboveCameraAppear">
                                    <div className="cameraAppear">
                                        <i style={{ fontSize: "xx-large" }} className="fi fi-sr-camera"></i>
                                    </div>
                                </div>
                                <img id="output2" width="100%" height="100%" alt="" src={i.foodimage} />
                            </label>
                            <input id="inputimage2" onChange={convertToBase64} className="fuckThatImage" type="file" style={{ display: "none" }} />
                        </div>
                        <div className="reftson2">
                            <div className="overHereB">
                                <div className="insideHereB">
                                    <label>Name</label>
                                    <input className='textDeny' type='text' name='updatename' defaultValue={i.foodname} value={updatename} onChange={(e) => setFoodname(e.target.value)}></input>
                                </div>
                                <div className="insideHereB">
                                    <label>Category</label>
                                    <input className='textDeny' type='text' name='updatecategory' defaultValue={i.foodcategory} value={updatecategory} onChange={(e) => setFoodcategory(e.target.value)} ></input>
                                </div>
                            </div>
                            <div className="overHereB">
                                <div className="insideHereB">
                                    <label>Price</label>
                                    <input className='textDeny' type='number' name='updateprice' defaultValue={i.foodprice} value={updateprice} onChange={(e) => setFoodprice(e.target.value)} ></input>
                                </div>
                                <div className="insideHereB">
                                    <label>Quantity</label>
                                    <input className='textDeny' type='number' name='updatequantity' defaultValue={i.foodquantity} value={updatequantity} onChange={(e) => setFoodquantity(e.target.value)} ></input>
                                </div>
                            </div>
                            <label>Description</label>
                            <textarea className='textDeny' type='text' name='updatedescription' defaultValue={i.fooddescription} value={updatedescription} onChange={(e) => setFooddescription(e.target.value)}></textarea>
                        </div>
                    </div>
                    <hr />
                    <div className='d-flex justify-content-around mt-3'>
                        <button onClick={() => DeleteMenu(i._id)} type="button" className='btn btn-danger'>Delete</button>
                        <button type='submit' className='btn btn-primary'>Update</button>
                    </div>
                </form>
            </div >
        </>
    )
}
export default DetailSearchMenu