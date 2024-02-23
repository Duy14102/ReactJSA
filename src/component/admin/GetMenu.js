import { useEffect, useState, useRef } from "react";
import Modal from 'react-modal';
import axios from "axios";
import Swal from "sweetalert2";
import ReactPaginate from 'react-paginate';

function GetMenu({ cate }) {
    const [menu, setMenu] = useState([]);
    const [ModalData, setModalData] = useState([])
    const [reviewData, setReviewData] = useState([])
    const [modalOpenDetail, setModalOpenDetail] = useState(false);
    const [modalOpenDetail2, setModalOpenDetail2] = useState(false);
    // UpdateMenu
    const [updatename, setFoodname] = useState();
    const [updateprice, setFoodprice] = useState();
    const [updatequantity, setFoodquantity] = useState();
    const [updatecategory, setFoodcategory] = useState();
    const [updatedescription, setFooddescription] = useState();
    const [updateimage, setFoodimage] = useState();
    const [spinner, setSpinner] = useState(false)

    const [pageCount, setPageCount] = useState(6);
    const currentPage = useRef();
    const limit = 8

    useEffect(() => {
        currentPage.current = 1;
        getPagination()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    /*      Pagination     */
    function handlePageClick(e) {
        currentPage.current = e.selected + 1
        getPagination();
    }

    function getPagination() {
        const configuration = {
            method: "get",
            url: "https://eatcom.onrender.com/GetAdminMenu",
            params: {
                cate: cate,
                page: currentPage.current,
                limit: limit
            }
        };
        axios(configuration)
            .then((result) => {
                setMenu(result.data.results.result);
                setPageCount(result.data.results.pageCount)
            })
            .catch((error) => {
                console.log(error);
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
        setSpinner(true)
        axios(configuration)
            .then(() => {
                setSpinner(false)
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

    // Image Menu
    function convertToBase64(e) {
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            setFoodimage(reader.result);
            document.getElementById("output2").src = reader.result
        };
        reader.onerror = error => {
            console.log(error);
        }
    }

    //Update Menu
    const handleSubmit = (e, id) => {
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
        setSpinner(true)
        axios(configuration)
            .then(() => {
                setSpinner(false)
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

    const deleteReview = () => {
        const configuration = {
            method: "post",
            url: "https://eatcom.onrender.com/DeleteReviewByMag",
            data: {
                itemid: ModalData._id,
                reviewid: reviewData.id
            }
        }
        axios(configuration)
            .then(() => {
                Swal.fire(
                    'Delete Review Successfully!',
                    '',
                    'success'
                ).then(function () {
                    window.location.reload();
                })
            }).catch(() => {
                Swal.fire(
                    'Delete Review Fail!',
                    '',
                    'error'
                )
            })
    }

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    const rating = stars => '★★★★★☆☆☆☆☆'.slice(5 - stars, 10 - stars);

    return (
        <>
            <table className='table table-bordered text-center'>
                <thead>
                    <tr className="text-white text-center" style={{ background: "#374148" }}>
                        <th>Name</th>
                        <th className="thhuhu">Price</th>
                        <th className="thhuhu">Quantity</th>
                        <th >Category</th>
                        <th ></th>
                    </tr>
                </thead>
                {menu.map(i => {
                    return (
                        <tbody key={i._id}>
                            <tr style={{ background: "#2C343A", color: "lightgray", verticalAlign: "middle" }}>
                                <td>{i.foodname}</td>
                                <td className="thhuhu">{VND.format(i.foodprice)}</td>
                                <td className="thhuhu">{i.foodquantity}</td>
                                <td>{i.foodcategory}</td>
                                <td><button onClick={() => { setModalData(i); setModalOpenDetail(true) }} className='btn btn-success'>Detail</button></td>
                            </tr>
                        </tbody>
                    )
                })}
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
            <Modal isOpen={modalOpenDetail} onRequestClose={() => setModalOpenDetail(false)} ariaHideApp={false}
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
                <div className='juh' key={ModalData._id}>
                    {spinner ? (
                        <div style={{ background: "rgba(255, 255, 255, 0.6)" }} id="spinner" className="show position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
                            <div className="spinner-border text-primary" style={{ width: 3 + "rem", height: 3 + "rem" }} role="status">
                                <span className="sr-only"></span>
                            </div>
                        </div>
                    ) : null}
                    <h3 className="text-center">Menu Detail</h3>
                    <hr />
                    <form onSubmit={(e) => handleSubmit(e, ModalData._id)} className="login100-form validate-form">
                        <div className='reft'>
                            <div className="reftson1">
                                <label className="inputImageDup" htmlFor="inputimage2">
                                    <div className="aboveCameraAppear">
                                        <div className="cameraAppear">
                                            <svg style={{ fontSize: "xx-large", fill: "#fff" }} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M149.1 64.8L138.7 96H64C28.7 96 0 124.7 0 160V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H373.3L362.9 64.8C356.4 45.2 338.1 32 317.4 32H194.6c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z" /></svg>
                                        </div>
                                    </div>
                                    <img id="output2" width="100%" height="100%" alt="" src={ModalData.foodimage} />
                                </label>
                                <input id="inputimage2" onChange={convertToBase64} className="fuckThatImage" type="file" style={{ display: "none" }} />
                            </div>
                            <div className="reftson2">
                                <div className="overHereB">
                                    <div className="insideHereB">
                                        <label><b>Name</b></label>
                                        <input className='textDeny' type='text' name='updatename' defaultValue={ModalData.foodname} onChange={(e) => setFoodname(e.target.value)}></input>
                                    </div>
                                    <div className="insideHereB">
                                        <label><b>Category</b></label>
                                        <input className='textDeny' type='text' name='updatecategory' defaultValue={ModalData.foodcategory} onChange={(e) => setFoodcategory(e.target.value)} ></input>
                                    </div>
                                </div>
                                <div className="overHereB">
                                    <div className="insideHereB">
                                        <label><b>Price</b></label>
                                        <input className='textDeny' type='number' name='updateprice' defaultValue={ModalData.foodprice} onChange={(e) => setFoodprice(e.target.value)} ></input>
                                    </div>
                                    <div className="insideHereB">
                                        <label><b>Quantity</b></label>
                                        <input className='textDeny' type='number' name='updatequantity' defaultValue={ModalData.foodquantity} onChange={(e) => setFoodquantity(e.target.value)} ></input>
                                    </div>
                                </div>
                                <label className="pt-3"><b>Description</b></label>
                                <textarea className='textDeny' type='text' name='updatedescription' defaultValue={ModalData.fooddescription} onChange={(e) => setFooddescription(e.target.value)}></textarea>
                                {ModalData.review?.length > 0 ? (
                                    <div className="pt-3">
                                        <b>Review</b> : {ModalData.review?.length}
                                        <table className="table table-bordered solotable text-center">
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Star</th>
                                                    <th>Date</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {ModalData.review?.map((e) => {
                                                    return (
                                                        <tr key={e.id}>
                                                            <td>{e.name}</td>
                                                            <td>{rating(e.star)}</td>
                                                            <td>{e.date}</td>
                                                            <td><button onClick={() => { setReviewData(e); setModalOpenDetail(false); setModalOpenDetail2(true) }} className="btn btn-success">Detail</button></td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <><b>Review</b> : 0</>
                                )}
                            </div>
                        </div>
                        <hr />
                        <div className='d-flex justify-content-around mt-3'>
                            <button onClick={() => DeleteMenu(ModalData._id)} type="button" className='btn btn-danger'>Delete</button>
                            <button type='submit' className='btn btn-primary'>Update</button>
                        </div>
                    </form>
                </div >
                <button className='closeModal' onClick={() => setModalOpenDetail(false)}>x</button>
            </Modal>
            <Modal isOpen={modalOpenDetail2} onRequestClose={() => setModalOpenDetail2(false)} ariaHideApp={false}
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
                        height: "45vh",
                        zIndex: 999
                    },
                }}>
                <div className="p-3">
                    <h3 className="text-center">Review Detail</h3>
                    <div className="coverNOut">
                        <p className="m-0"><b>Name</b>: {reviewData.name}</p>
                        <p className="m-0"><b>Date</b>: {reviewData.date}</p>
                    </div>
                    <hr />
                    <div className="hugeImpace">
                        <p><b>Star</b>: {rating(reviewData.star)}</p>
                        <p><b>Message</b> :</p>
                        <textarea className="w-100 textDeny" style={{ pointerEvents: "none" }} defaultValue={reviewData.message} />
                    </div>
                    <hr />
                    <div className="text-center">
                        <button onClick={() => deleteReview()} className="btn btn-danger">Delete</button>
                    </div>
                </div>
                <button className='closeModal' onClick={() => { setModalOpenDetail2(false); setModalOpenDetail(true) }}>x</button>
            </Modal>
        </>
    );
}
export default GetMenu;