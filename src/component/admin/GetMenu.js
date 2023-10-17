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

    useEffect(() => {
        const getHome = document.getElementById('inputimage2')
        if (getHome) {
            getHome.onchange = function () {
                var files = this.files;
                for (var i = 0; i < files.length; i++) {
                    var file = files[i],
                        src = (URL || window.webkitURL).createObjectURL(file);
                    document.getElementById('output2').src = src
                }
            }
        }
    })

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
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
            <Modal
                isOpen={modalOpenDetail} onRequestClose={() => setModalOpenDetail(false)} ariaHideApp={false}
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

                {Object.values(detail).map(i => {
                    return (
                        <div className='juh' key={i._id}>
                            <h3 className="text-center">Menu Detail</h3>
                            <hr />
                            <form onSubmit={(e) => handleSubmit(e, i._id)} className="login100-form validate-form">
                                <div className='reft'>
                                    <div className="reftson1">
                                        <label className="inputImageDup" htmlFor="inputimage2">
                                            <div className="aboveCameraAppear">
                                                <div className="cameraAppear">
                                                    <i className="fa fa-camera fa-2x"></i>
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
                            </form>
                            <div className='d-flex justify-content-around mt-3'>
                                <button onClick={() => DeleteMenu(i._id)} className='btn btn-danger'>Delete</button>
                                <button type='submit' className='btn btn-primary'>Update</button>
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