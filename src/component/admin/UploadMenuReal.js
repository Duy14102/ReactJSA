import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
function UploadMenuReal() {
    const [foodname, setFoodname] = useState("");
    const [foodprice, setFoodprice] = useState("");
    const [foodquantity, setFoodquantity] = useState("");
    const [foodcategory, setFoodcategory] = useState("");
    const [fooddescription, setFooddescription] = useState("");
    const [foodimage, setFoodimage] = useState("");

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

    const handleSubmit = (e) => {
        // prevent the form from refreshing the whole page
        e.preventDefault();
        const configuration = {
            method: "post",
            url: "http://localhost:3000/UploadMenu",
            data: {
                foodname,
                foodprice,
                foodquantity,
                foodcategory,
                fooddescription,
                base64: foodimage,
            },
        };
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
            .catch((error) => {
                Swal.fire(
                    'Added Fail!',
                    '',
                    'error'
                )
            });
    }
    return (
        <>
            <div className="p-3">
                <div className="text-center">
                    <h2>Add Menu</h2>
                </div>
                <hr />
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div className='row'>
                        <div className='col'>
                            <label>Name</label>
                            <input className='form-control' type="text" name="foodname" value={foodname} onChange={(e) => setFoodname(e.target.value)} />
                        </div>
                        <div className='col'>
                            <label>Price</label>
                            <input className='form-control' type="number" name="foodprice" value={foodprice} onChange={(e) => setFoodprice(e.target.value)} />
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col'>
                            <label>category</label>
                            <input className='form-control' type="text" name="foodcategory" value={foodcategory} onChange={(e) => setFoodcategory(e.target.value)} />
                        </div>
                        <div className='col'>
                            <label>Quantity</label>
                            <input className='form-control' type="number" name="foodquantity" value={foodquantity} onChange={(e) => setFoodquantity(e.target.value)} />
                        </div>
                    </div>
                    <div className="row">
                        <div className='col'>
                            <label>description</label>
                            <input className='form-control' type="text" name="fooddescription" value={fooddescription} onChange={(e) => setFooddescription(e.target.value)} />
                        </div>
                        <div className='col'>
                            <label>Image</label>
                            <input className='form-control' name='foodimage' type='file' accept='image/*' onChange={convertToBase64}></input>
                        </div>
                    </div>
                    <div className='text-center mt-3'>
                        <button className='btn btn-primary' type='submit' onClick={(e) => handleSubmit(e)}>
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
export default UploadMenuReal;