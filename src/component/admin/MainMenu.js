import Modal from 'react-modal';
import GetMenu from './GetMenu';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';
import DetailSearchMenu from './DetailSearchMenu';

function MainMenu() {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpen2, setModalOpen2] = useState(false);
    const [modalOpen3, setModalOpen3] = useState(false);
    const [openTable, setOpenTable] = useState(false)
    const [spinner, setSpinner] = useState(false)
    const [dataafter, setDataAfter] = useState([])
    const [ModalData, setModalData] = useState([])
    const [nameInput, setNameInput] = useState("")
    const [foodname, setFoodname] = useState("");
    const [foodprice, setFoodprice] = useState("");
    const [foodquantity, setFoodquantity] = useState("");
    const [foodcategory, setFoodcategory] = useState("");
    const [fooddescription, setFooddescription] = useState("");
    const [foodimage, setFoodimage] = useState("");

    const [pageCount, setPageCount] = useState(6);
    const currentPage = useRef();
    const limit = 8

    useEffect(() => {
        currentPage.current = 1;
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

    function handlePageClick(e) {
        currentPage.current = e.selected + 1
        findItem();
    }

    const findItem = (e) => {
        e?.preventDefault()
        const configuration = {
            method: "get",
            url: "https://eatcom.onrender.com/GetSearch",
            params: {
                foodSearch: nameInput,
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
            })
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
    return (
        <>
            <div className="myDIVdad">
                <div style={{ gap: 5 + "%" }} id="myDIV5" className="d-flex align-items-center">
                    <button id="defaultOpen5" className="MBbutton5 active5" onClick={(e) => openCity5(e, 'Main')}><p >Main</p></button>
                    <button className="MBbutton5" onClick={(e) => openCity5(e, 'Meat')}><p>Meat</p></button>
                    <button className="MBbutton5" onClick={(e) => openCity5(e, 'Drink')}><p>Drink</p></button>
                    <button className="MBbutton5" onClick={(e) => openCity5(e, 'Vegetables')}><p>Vegetables</p></button>
                </div>
                <div className='laughtale'>
                    <button onClick={() => setModalOpen2(true)} className="btn btn-primary">🔎 Items</button>
                    <button onClick={() => setModalOpen(true)} className="btn btn-primary">➕ Items</button>
                </div>
            </div>
            <div id="Main" className="tabcontent5">
                <div className="pt-4">
                    <GetMenu cate={"Main"} />
                </div>
            </div>
            <div id="Meat" className="tabcontent5">
                <div className="pt-4">
                    <GetMenu cate={"Meat"} />
                </div>
            </div>

            <div id="Drink" className="tabcontent5">
                <div className="pt-4">
                    <GetMenu cate={"Drink"} />
                </div>
            </div>

            <div id="Vegetables" className="tabcontent5">
                <div className="pt-4">
                    <GetMenu cate={"Vegetables"} />
                </div>
            </div>
            <Modal
                isOpen={modalOpen2} onRequestClose={() => setModalOpen2(false)} ariaHideApp={false}
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
                <div className='pt-3'>
                    <h2 className='text-center'>Input item name</h2>
                    <div className='overOutsider'>
                        <div className='outsider'>
                            <form onSubmit={(e) => findItem(e)}>
                                <input type='submit' style={{ display: "none" }} />
                                <div className='d-flex justify-content-between w-100'>
                                    <input onInput={(e) => setNameInput(e.target.value)} type='text' placeholder='User name...' required />
                                    <button style={{ width: 10 + "%" }} type="submit"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" /></svg></button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                {openTable ? (
                    <>
                        <table className='table solotable text-center mt-3'>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Category</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.values(dataafter).map((i) => {
                                    return (
                                        <tr key={i._id}>
                                            <td>{i.foodname}</td>
                                            <td>{i.foodprice}</td>
                                            <td>{i.foodquantity}</td>
                                            <td>{i.foodcategory}</td>
                                            <td><button onClick={() => { setModalOpen2(false); setModalOpen3(true); setModalData(i) }} className='btn btn-success'>Detail</button></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
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
                    </>
                ) : null}
                <button className='closeModal' onClick={() => setModalOpen2(false)}>x</button>
            </Modal>
            <Modal
                isOpen={modalOpen3} onRequestClose={() => setModalOpen3(false)} ariaHideApp={false}
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
                <DetailSearchMenu i={ModalData} />
                <button className='closeModal' onClick={() => { setModalOpen3(false); setModalOpen2(true) }}>x</button>
            </Modal>
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
                </div >
                <button className='closeModal' onClick={() => setModalOpen(false)}>x</button>
            </Modal>
        </>
    );
}
export default MainMenu;