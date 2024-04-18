import Modal from 'react-modal';
import GetMenu from './GetMenu';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function MainMenu() {
    const [modalOpen, setModalOpen] = useState(false);
    const [spinner, setSpinner] = useState(false)
    const [spinner2, setSpinner2] = useState(false)
    const [search, setSearch] = useState("")
    const [mainSearch, setMainSearch] = useState("")
    const [cityName, setCityName] = useState()
    const [foodname, setFoodname] = useState("");
    const [foodprice, setFoodprice] = useState("");
    const [foodquantity, setFoodquantity] = useState("");
    const [foodcategory, setFoodcategory] = useState("");
    const [fooddescription, setFooddescription] = useState("");
    const [foodimage, setFoodimage] = useState("");

    useEffect(() => {
        document.getElementById("defaultOpen5").click();
    }, [])

    function openCity5(evt, cityName) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent5");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("MBbutton5");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active5", "");
        }
        document.getElementById(cityName).style.display = "block";
        evt.currentTarget.className += " active5";
    }

    const handleSubmit = (e) => {
        // prevent the form from refreshing the whole page
        e.preventDefault();
        const configuration = {
            method: "post",
            url: "https://eatcom.onrender.com/UploadMenu",
            data: {
                foodname,
                foodprice,
                foodquantity,
                foodcategory,
                fooddescription,
                base64: foodimage,
            },
        };
        setSpinner(true)
        axios(configuration)
            .then(() => {
                setSpinner(false)
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
            document.getElementById("output").src = reader.result
        };
        reader.onerror = error => {
            console.log(error);
        }
    }

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setMainSearch(search)
        }, 1000)
        return () => clearTimeout(delayDebounceFn)
    }, [search])
    return (
        <>
            <div className="myDIVdad">
                <div style={{ gap: 5 + "%" }} id="myDIV5" className="d-flex align-items-center">
                    <button id="defaultOpen5" className="MBbutton5 active5" onClick={(e) => { openCity5(e, 'Main'); setCityName('Main') }}><p >Main</p></button>
                    <button className="MBbutton5" onClick={(e) => { openCity5(e, 'Meat'); setCityName('Meat') }}><p>Meat</p></button>
                    <button className="MBbutton5" onClick={(e) => { openCity5(e, 'Drink'); setCityName('Drink') }}><p>Drink</p></button>
                    <button className="MBbutton5" onClick={(e) => { openCity5(e, 'Vegetables'); setCityName('Vegetables') }}><p>Vegetables</p></button>
                </div>
                <div className='laughtale'>
                    <input onChange={(e) => setSearch(e.target.value)} style={{ height: 37 }} placeholder='Input name to search' />
                    <button onClick={() => setModalOpen(true)} className="btn btn-primary">➕ Items</button>
                </div>
            </div>
            <div id="Main" className="tabcontent5">
                <div className="pt-4">
                    <GetMenu cate={"Main"} search={mainSearch} spinner2={spinner2} setSpinner2={setSpinner2} cityName={cityName} />
                </div>
            </div>
            <div id="Meat" className="tabcontent5">
                <div className="pt-4">
                    <GetMenu cate={"Meat"} search={mainSearch} spinner2={spinner2} setSpinner2={setSpinner2} cityName={cityName} />
                </div>
            </div>

            <div id="Drink" className="tabcontent5">
                <div className="pt-4">
                    <GetMenu cate={"Drink"} search={mainSearch} spinner2={spinner2} setSpinner2={setSpinner2} cityName={cityName} />
                </div>
            </div>

            <div id="Vegetables" className="tabcontent5">
                <div className="pt-4">
                    <GetMenu cate={"Vegetables"} search={mainSearch} spinner2={spinner2} setSpinner2={setSpinner2} cityName={cityName} />
                </div>
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
                    {spinner ? (
                        <div style={{ background: "rgba(255, 255, 255, 0.6)" }} id="spinner" className="show position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
                            <div className="spinner-border text-primary" style={{ width: 3 + "rem", height: 3 + "rem" }} role="status">
                                <span className="sr-only"></span>
                            </div>
                        </div>
                    ) : null}
                    <h3 className="text-center">Add Menu</h3>
                    <hr />
                    <form onSubmit={(e) => handleSubmit(e)} className="login100-form validate-form">
                        <div className='reft'>
                            <div className='reftson1'>
                                <label className="inputImageDup" htmlFor="inputimage">
                                    <div className="aboveCameraAppear">
                                        <div className="cameraAppear">
                                            <svg style={{ fontSize: "xx-large", fill: "#fff" }} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M149.1 64.8L138.7 96H64C28.7 96 0 124.7 0 160V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H373.3L362.9 64.8C356.4 45.2 338.1 32 317.4 32H194.6c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z" /></svg>
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
                                        <select className='textDeny' onChange={(e) => setFoodcategory(e.target.value)} required>
                                            <option value="">Click me</option>
                                            <option value="Main">Main dishes</option>
                                            <option value="Meat">Meat</option>
                                            <option value="Drink">Drink</option>
                                            <option value="Vegetables">Vegetables</option>
                                        </select>
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
                </div>
                <button className='closeModal' onClick={() => setModalOpen(false)}>x</button>
            </Modal>
        </>
    );
}
export default MainMenu;