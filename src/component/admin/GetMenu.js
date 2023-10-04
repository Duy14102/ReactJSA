import { useEffect, useState, useRef } from "react";
import Modal from 'react-modal';
import axios from "axios";
import Swal from "sweetalert2";
import ReactPaginate from 'react-paginate';

function GetMenu() {
    const [menu, setMenu] = useState([]);
    const [detail, setDetail] = useState([]);
    const [modalOpenDetail, setModalOpenDetail] = useState(false);
    // UpdateMenu
    const [updatename, setFoodname] = useState();
    const [updateprice, setFoodprice] = useState();
    const [updatequantity, setFoodquantity] = useState();
    const [updatecategory, setFoodcategory] = useState();
    const [updatedescription, setFooddescription] = useState();
    const [updateimage, setFoodimage] = useState();

    const [pageCount, setPageCount] = useState(6);
    const currentPage = useRef();
    const limit = 8

    useEffect(() => {
        currentPage.current = 1;
        getPagination()
    }, [])

    /*      Pagination     */
    function handlePageClick(e) {
        currentPage.current = e.selected + 1
        getPagination();
    }

    function getPagination() {
        const configuration = {
            method: "get",
            url: "http://localhost:3000/GetAdminMenu",
            params: {
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

    // Detail Menu
    const DetailMenu = (id) => {
        const configuration = {
            method: "get",
            url: "http://localhost:3000/GetDetailMenu",
            params: {
                foodid: id
            }
        };
        axios(configuration)
            .then((result) => {
                setDetail(result.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    //Delte Menu
    const DeleteMenu = (id) => {
        const configuration = {
            method: "post",
            url: "http://localhost:3000/DeleteMenu",
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
    const handleSubmit = (e, id) => {
        // prevent the form from refreshing the whole page
        e.preventDefault();
        const configuration = {
            method: "post",
            url: "http://localhost:3000/UpdateMenu",
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

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    return (
        <>
            <table className='table table-bordered text-center'>
                <thead>
                    <tr>
                        <th className="text-center">Name</th>
                        <th className="text-center">Price</th>
                        <th className="text-center">Quantity</th>
                        <th className="text-center">Category</th>
                        <th className="text-center"></th>
                    </tr>
                </thead>
                {menu.map(i => {
                    return (
                        <tbody key={i._id}>
                            <tr>
                                <td>{i.foodname}</td>
                                <td>{VND.format(i.foodprice)}</td>
                                <td>{i.foodquantity}</td>
                                <td>{i.foodcategory}</td>
                                <td onClick={setModalOpenDetail}><button onClick={() => DetailMenu(i.foodname)} className='btn btn-success'>Detail</button></td>
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
                containerClassName="pagination justify-content-center"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                activeClassName="active"
                forcePage={currentPage.current - 1}
            />
            <Modal
                isOpen={modalOpenDetail} onRequestClose={() => setModalOpenDetail(false)} ariaHideApp={false}
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
                        width: 650,
                        overflow: "hidden",
                    },
                }}>

                {Object.values(detail).map(i => {
                    if (updatename === null) {
                        setFoodname(i.foodname)
                    }
                    if (updatecategory === null) {
                        setFoodcategory(i.foodcategory)
                    }
                    if (updateprice === null) {
                        setFoodprice(i.foodprice)
                    }
                    if (updatequantity === null) {
                        setFoodquantity(i.foodquantity)
                    }
                    if (updatedescription === null) {
                        setFooddescription(i.fooddescription)
                    }
                    if (updateimage === null) {
                        convertToBase64()
                    }
                    return (
                        <div className='p-3' key={i._id}>
                            <form onSubmit={(e) => handleSubmit(e, i._id)} className="login100-form validate-form">
                                <div className='d-flex mx-auto'>
                                    <div>
                                        <img loading="lazy" alt='' width={300} height={300} src={i.foodimage} />
                                    </div>
                                    <div className='text-left' style={{ paddingLeft: 10 + "px" }}>
                                        <label>Name</label>
                                        <input className='form-control' type='text' name='updatename' value={updatename} onChange={(e) => setFoodname(e.target.value)} placeholder={i.foodname}></input>
                                        <label>Category</label>
                                        <input className='form-control' type='text' name='updatecategory' value={updatecategory} onChange={(e) => setFoodcategory(e.target.value)} placeholder={i.foodcategory}></input>
                                        <label>Price</label>
                                        <input className='form-control' type='number' name='updateprice' value={updateprice} onChange={(e) => setFoodprice(e.target.value)} placeholder={i.foodprice}></input>
                                        <label>Quantity</label>
                                        <input className='form-control' type='number' name='updatequantity' value={updatequantity} onChange={(e) => setFoodquantity(e.target.value)} placeholder={i.foodquantity}></input>
                                        <label>Description</label>
                                        <input className='form-control' type='text' name='updatedescription' value={updatedescription} onChange={(e) => setFooddescription(e.target.value)} placeholder={i.fooddescription}></input>
                                        <label>Image</label>
                                        <input className='form-control' type='file' name='updateimage' onChange={convertToBase64} />
                                    </div>
                                </div>
                                <hr />
                            </form>
                            <div className='d-flex justify-content-around mt-3'>
                                <div>
                                    <button type='submit' onClick={(e) => handleSubmit(e, i._id)} className='btn btn-success'>Update</button>
                                </div>
                                <div>
                                    <button onClick={() => DeleteMenu(i._id)} className='btn btn-danger'>Delete</button>
                                </div>
                            </div>
                        </div >
                    )
                })}
                <button className='closeModal' onClick={() => setModalOpenDetail(false)}>x</button>
            </Modal>
        </>
    );
}
export default GetMenu;