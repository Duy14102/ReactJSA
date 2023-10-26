import { useState, useEffect, useRef, Fragment } from "react"
import { NavLink, useParams } from "react-router-dom"
import Modal from 'react-modal';
import NotFound from "../component/outOfBorder/NotFound";
import Header from "../component/Header";
import Footer from "../component/Footer";
import ReactPaginate from "react-paginate";
import axios from "axios";
import $ from 'jquery'
import Swal from "sweetalert2";

function QrCodeTable() {
    let appler = useParams()
    const [Category, setCategory] = useState([]);
    const [Count, setCount] = useState([]);
    const [Table, GetTable] = useState([])
    const [modalOpenDetail, setModalOpenDetail] = useState(false);
    var [QuantityAdd, setQuantityAdd] = useState()
    const getQr = localStorage.getItem("QrCode")

    const [pageCount, setPageCount] = useState(6);
    const currentPage = useRef();
    const limit = 9
    //Get Detail
    useEffect(() => {
        if (getQr === "2") {
            setModalOpenDetail(false)
        } else {
            setModalOpenDetail(true)
        }
        currentPage.current = 1;
        getPagination();
        getTable4()
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
            url: "http://localhost:3000/GetCategoryMenu",
            params: {
                category: appler.cate,
                page: currentPage.current,
                limit: limit
            }
        };
        axios(configuration)
            .then((result) => {
                setCategory(result.data.results.result);
                setCount(result.data.results.total)
                setPageCount(result.data.results.pageCount)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function getTable4() {
        const configuration = {
            method: "get",
            url: "http://localhost:3000/QrCodeItemTB",
            params: {
                id: appler.id
            }
        };
        axios(configuration)
            .then((result) => {
                GetTable(result.data)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    switch (appler.fil) {
        case "nto":
            Category.sort((a, b) => a._id - b._id).reverse()
            break;
        case "otn":
            Category.sort((a, b) => a._id - b._id)
            break;
        case "hpf":
            Category.sort((a, b) => a.foodprice - b.foodprice).reverse()
            break;
        case "lpf":
            Category.sort((a, b) => a.foodprice - b.foodprice)
            break;
        case "atz":
            Category.sort((a, b) => a.foodname > b.foodname ? 1 : -1,)
            break;
        default:
            Category.sort((a, b) => a._id - b._id).reverse()
            break;
    }

    const Filter = (e) => {
        if (e === "lpf") {
            window.location.href = `/QrCodeTable/${appler.id}/${getQr}/${appler.cate}/${e}`
        } if (e === "hpf") {
            window.location.href = `/QrCodeTable/${appler.id}/${getQr}/${appler.cate}/${e}`
        } if (e === "nto") {
            window.location.href = `/QrCodeTable/${appler.id}/${getQr}/${appler.cate}/${e}`
        } if (e === "otn") {
            window.location.href = `/QrCodeTable/${appler.id}/${getQr}/${appler.cate}/${e}`
        } if (e === "atz") {
            window.location.href = `/QrCodeTable/${appler.id}/${getQr}/${appler.cate}/${e}`
        }
    }

    const CateFilter = (e) => {
        if (e === "Meat") {
            window.location.href = `/QrCodeTable/${appler.id}/${getQr}/${e}/nto`
        } if (e === "Vegetables") {
            window.location.href = `/QrCodeTable/${appler.id}/${getQr}/${e}/nto`
        } if (e === "Drink") {
            window.location.href = `/QrCodeTable/${appler.id}/${getQr}/${e}/nto`
        }
    }

    if (appler.qr !== "1" && appler.qr !== "2") {
        return NotFound()
    }

    function setQrType() {
        const configuration = {
            method: "post",
            url: "http://localhost:3000/QrCodeTableActive",
            data: {
                id: appler.id
            }
        };
        axios(configuration)
            .then(() => {
                appler.qr = "2"
                localStorage.setItem("QrCode", appler.qr)
                window.location.reload()
            })
            .catch((err) => {
                console.log(err);
            })
    }

    if (!QuantityAdd) {
        QuantityAdd = 1
    }

    const takeitNow = (e, k) => {
        const item = { item: k, quantity: QuantityAdd }
        var foodname = ""
        if (k) {
            foodname = k.foodname
        }
        e.preventDefault()
        const configuration = {
            method: "post",
            url: "http://localhost:3000/AddItemToTable",
            data: {
                tableid: appler.id,
                item: item,
                quantity: QuantityAdd,
                foodname: foodname
            }
        };
        axios(configuration)
            .then(() => {
                window.location.reload()
            })
            .catch((err) => {
                Swal.fire(
                    'Added Fail!',
                    '',
                    'error'
                ).then(() => {
                    console.log(err);
                })
            });
    }

    const CheckOutQr = (e) => {
        const configuration = {
            method: "post",
            url: "http://localhost:3000/Checkout4QrYeah",
            params: {
                id: e
            }
        };
        axios(configuration)
            .then(() => {
                Swal.fire(
                    'Checkout Successfully!',
                    'Thank you for using our services',
                    'success'
                ).then(() => {
                    localStorage.removeItem("QrCode")
                    window.location.href = "/"
                })
            })
            .catch((err) => {
                Swal.fire(
                    'Checkout Fail!',
                    '',
                    'error'
                ).then(() => {
                    console.log(err);
                })
            });
    }

    $(function () {
        $("#select").val(appler.fil);
        $("#mix2up").val(appler.cate);
    })

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    var fulltotal = 0
    return (
        <>
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
                        height: "47vh",
                        zIndex: 999
                    },
                }}>
                <div className="p-3">
                    <div className="text-center">
                        <h3 className="section-title ff-secondary text-primary fw-normal">Welcome</h3>
                    </div>
                    <h6>1. Hello</h6>
                    <p>First of all, our store would like to thank you for trusting and ordering here and it is wonderful to receive your order. Thank you very much. Have a nice day.</p>
                    <h6>2. Commit</h6>
                    <p>Our store is always confident to offer reasonable prices along with the most perfect deliciousness to suit the taste of every customer.</p>
                    <h6>3. Enjoy the meal</h6>
                    <hr />
                    <div className="text-center">
                        <h3>Would you like to use this table ?</h3>
                    </div>
                    <div className="d-flex justify-content-evenly align-items-center pt-4">
                        <button onClick={() => setQrType()} className="btn btn-primary">Yes I will use it</button>
                        <NavLink reloadDocument to="/" className="btn btn-secondary">No I don't use it</NavLink>
                    </div>
                </div>
                <button className='closeModal' onClick={() => setModalOpenDetail(false)}>x</button>
            </Modal>
            <Header />
            <div className='container'>
                <div className='pt-3'>
                    <p className='encot' style={{ margin: 0 }}><NavLink className="textNavlink" to="/">Home</NavLink> / {Object.values(Table).map((i) => { return (<Fragment key={i._id}>{i.tablename}</Fragment>) })}</p>
                </div>
                <div className='ruler pt-4'>
                    <div className='FirstRow'>
                        <div className='nOthing'>
                            <h5>Product Category</h5>
                            <hr style={{ width: 15 + "%", height: 3 + "px" }} />
                            <NavLink reloadDocument to={`/QrCodeTable/${appler.id}/2/Meat/${appler.fil}`} activeclassname='active' className="text-black"><p>Meat</p></NavLink>
                            <NavLink reloadDocument to={`/QrCodeTable/${appler.id}/2/Drink/${appler.fil}`} className="text-black" ><p>Drink</p></NavLink>
                            <NavLink reloadDocument to={`/QrCodeTable/${appler.id}/2/Vegetables/${appler.fil}`} className="text-black"><p>Vegetables</p></NavLink>
                            <hr />
                        </div>
                        <div className="nOthing">
                            <h6 className="text-center">Your Cart</h6>
                            <table className="table table-bordered solotable">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.values(Table).map((a) => {
                                        return (
                                            <Fragment key={a._id}>
                                                {a.tableitems?.map((z) => {
                                                    var total = z.quantity * z.item.foodprice
                                                    fulltotal += total
                                                    return (
                                                        <tr key={z.item._id}>
                                                            <td>{z.item.foodname}</td>
                                                            <td>{z.quantity}</td>
                                                            <td>{VND.format(z.item.foodprice)}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </Fragment>
                                        )
                                    })}
                                    <tr>
                                        <th colSpan={2}>Fulltotal</th>
                                        <th>{VND.format(fulltotal)}</th>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="text-center">
                                {Object.values(Table).map((t) => {
                                    return (
                                        <button key={t._id} onClick={() => CheckOutQr(t._id)} className="btn btn-primary">Checkout</button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="row SecondRow">
                        <div className='d-flex justify-content-between Jkaem'>
                            <div className='CatuRespon'>
                                <select id='mix2up' onChange={(e) => CateFilter(e.target.value)} className='FilterDrop'>
                                    <option value={"Meat"}>Meat</option>
                                    <option value={"Vegetables"}>Vegetables</option>
                                    <option value={"Drink"}>Drink</option>
                                </select>
                            </div>
                            <div className='ThirdRow'>
                                <p className='allover3'>Display all {Count} results</p>
                                <select id='select' onChange={(e) => Filter(e.target.value)} className='FilterDrop'>
                                    <option value={"nto"}>New to old</option>
                                    <option value={"otn"}>Old to new</option>
                                    <option value={"hpf"}>High price first</option>
                                    <option value={"lpf"}>Low price first</option>
                                    <option value={"atz"}>A to Z</option>
                                </select>
                            </div>
                        </div>
                        <table className="table solotable text-center" style={{ verticalAlign: "middle" }}>
                            <thead>
                                <tr>
                                    <th colSpan={2}>Name</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.values(Category).map(i => {
                                    return (
                                        <tr key={i._id}>
                                            <td><img alt="" src={i.foodimage} loading="lazy" height={60} width={70} /></td>
                                            <td>{i.foodname}</td>
                                            <td>{VND.format(i.foodprice)}</td>
                                            <td><input onChange={(e) => setQuantityAdd(e.target.value)} min={1} max={i.foodquantity} defaultValue={1} className="textDeny" /></td>
                                            <td><button onClick={(e) => takeitNow(e, i)} className="btn btn-success">Add to cart</button></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        <ReactPaginate
                            breakLabel="..."
                            nextLabel="Next >"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={5}
                            pageCount={pageCount}
                            previousLabel="< Previous"
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
                    </div>
                </div>
            </div >
            <Footer />
        </>
    )
}
export default QrCodeTable