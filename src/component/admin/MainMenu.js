import Modal from 'react-modal';
import GetMenu from './GetMenu';
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import $ from 'jquery'

function MainMenu() {
    const [modalOpen, setModalOpen] = useState(false);
    const [foodname, setFoodname] = useState("");
    const [foodprice, setFoodprice] = useState("");
    const [foodquantity, setFoodquantity] = useState("");
    const [foodcategory, setFoodcategory] = useState("");
    const [fooddescription, setFooddescription] = useState("");
    const [foodimage, setFoodimage] = useState("");

    $(function () {
        const $image = $('#inputimage')
        $image.on("change", function () {
            const $inputnow = $('#output')
            var files = this.files;
            for (var i = 0; i < files.length; i++) {
                var file = files[i],
                    src = (URL || window.webkitURL).createObjectURL(file);
                $inputnow.attr("src", src)
            }
        })
    })

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
            .catch(() => {
                Swal.fire(
                    'Added Fail!',
                    '',
                    'error'
                )
            });
    }

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
    return (
        <>
            <div className='jknoob pb-3'>
                <button className='btn btn-primary' onClick={setModalOpen}>
                    Add Menu
                </button>
            </div>
            <Modal
                isOpen={modalOpen} onRequestClose={() => setModalOpen(false)} ariaHideApp={false}
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
                        height: "57vh",
                        zIndex: 999
                    },
                }}>
                <div className='juh'>
                    <h3 className="text-center">Add Menu</h3>
                    <hr />
                    <form onSubmit={(e) => handleSubmit(e)} className="login100-form validate-form">
                        <div className='reft'>
                            <div className='reftson1'>
                                <label className="inputImageDup" htmlFor="inputimage">
                                    <div className="aboveCameraAppear">
                                        <div className="cameraAppear">
                                            <i className="fa fa-camera fa-2x"></i>
                                        </div>
                                    </div>
                                    <img id="output" width="100%" height="100%" alt="" src="https://phutungnhapkhauchinhhang.com/wp-content/uploads/2020/06/default-thumbnail.jpg" />
                                </label>
                                <input id="inputimage" onChange={convertToBase64} className="fuckThatImage" type="file" style={{ display: "none" }} />
                            </div>
                            <div className='reftson2'>
                                <div className="overHereB">
                                    <div className="insideHereB">
                                        <label>Name</label>
                                        <input className='textDeny' type='text' name='updatename' value={foodname} onChange={(e) => setFoodname(e.target.value)} required></input>
                                    </div>
                                    <div className="insideHereB">
                                        <label>Category</label>
                                        <input className='textDeny' type='text' name='updatecategory' value={foodcategory} onChange={(e) => setFoodcategory(e.target.value)} required></input>
                                    </div>
                                </div>
                                <div className="overHereB">
                                    <div className="insideHereB">
                                        <label>Price</label>
                                        <input className='textDeny' type='number' name='updateprice' value={foodprice} onChange={(e) => setFoodprice(e.target.value)} required></input>
                                    </div>
                                    <div className="insideHereB">
                                        <label>Quantity</label>
                                        <input className='textDeny' type='number' name='updatequantity' value={foodquantity} onChange={(e) => setFoodquantity(e.target.value)} required></input>
                                    </div>
                                </div>
                                <label>Description</label>
                                <textarea className='textDeny' type='text' name='updatedescription' value={fooddescription} onChange={(e) => setFooddescription(e.target.value)} required></textarea>
                            </div>
                        </div>
                        <hr />
                        <div className='d-flex justify-content-around pt-3'>
                            <button onClick={() => setModalOpen(false)} className='btn btn-secondary'>Cancel</button>
                            <button type='submit' className='btn btn-primary'>Confirm</button>
                        </div>
                    </form>
                </div >
                <button className='closeModal' onClick={() => setModalOpen(false)}>x</button>
            </Modal>
            <GetMenu />
        </>
    );
}
export default MainMenu;