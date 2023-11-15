import { useState, useEffect, useRef, Fragment, useCallback } from "react"
import { NavLink, useParams } from "react-router-dom"
import Modal from 'react-modal';
import NotFound from "../component/outOfBorder/NotFound";
import ReactPaginate from "react-paginate";
import axios from "axios";
import $ from 'jquery'
import Swal from "sweetalert2";
import Layout from "../Layout";
import Cookies from "universal-cookie";
import {jwtDecode} from "jwt-decode";

function QrCodeTable() {
    let appler = useParams()
    const cookies = new Cookies()
    const token = cookies.get("TOKEN")
    const [Category, setCategory] = useState([]);
    var Cunt = null
    var Kunt = null
    const [Count, setCount] = useState([]);
    const [Table, GetTable] = useState([])
    const [detect, setDetect] = useState(null)
    const [modalOpenDetail, setModalOpenDetail] = useState(false);
    const [sidebar, setSidebar] = useState(false);
    const [QuantityAdd, setQuantityAdd] = useState(1)
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getTable4 = useCallback(() => {
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
    }, [appler.id])

    useEffect(() => {
        getTable4()
        setDetect(null)
    }, [getTable4, detect])

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
                limit: limit,
                filter: appler.fil
            }
        };
        axios(configuration)
            .then((result) => {
                console.log(result);
                setCategory(result.data.results.result);
                setCount(result.data.results.total)
                setPageCount(result.data.results.pageCount)
            })
            .catch((error) => {
                console.log(error);
            });
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

    function setQrType() {
        var kock = null
        if (token) {
            const decode = jwtDecode(token)
            kock = decode.userId
        }
        const configuration = {
            method: "post",
            url: "http://localhost:3000/QrCodeTableActive",
            data: {
                id: appler.id,
                cusid: kock
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

    const takeitNow = (e, k) => {
        const item = { item: k, quantity: QuantityAdd, status: 1 }
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
            .then((res) => {
                setDetect(res.data.data)
                setTimeout(() => {
                    const configuration2 = {
                        method: "post",
                        url: "http://localhost:3000/UpdateItemQrStatus",
                        data: {
                            tableid: appler.id,
                            foodname: res.data.data.foodname,
                            status: 2
                        }
                    }
                    axios(configuration2)
                        .then(() => {
                            setDetect(res.data.data)
                        }).catch((err) => { console.log(err); })
                }, 15000)
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

    const deleteItem = (name, item) => {
        const configuration = {
            method: "post",
            url: "http://localhost:3000/DeleteQritem",
            data: {
                tableid: appler.id,
                quantity: QuantityAdd,
                foodname: name,
                item: item
            }
        };
        axios(configuration)
            .then(() => {
                Swal.fire(
                    'Delete Successfully!',
                    '',
                    'success'
                ).then(() => {
                    window.location.reload()
                })
            })
            .catch((err) => {
                Swal.fire(
                    'Delete Fail!',
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
                id: e._id
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

    function refreshButton() {
        window.location.reload()
    }
    return (
        <>
            {Table.data ? (
                <>
                    <Modal isOpen={modalOpenDetail} onRequestClose={() => setModalOpenDetail(false)} ariaHideApp={false}
                        style={{
                            overlay: {
                                position: 'fixed',
                                zIndex: 998,
                                backgroundColor: 'rgb(33 33 33 / 100%)'
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
                                {Table.data.tablestatus !== 1 ? (
                                    <>
                                        <div style={{ gap: 1 + "%" }} className="d-flex align-items-center justify-content-center mb-2">
                                            <h3 className="m-0">This table is in process of payment</h3>
                                            <div className="rotateYUI">
                                                <i className="fi fi-br-refresh"></i>
                                            </div>
                                        </div>
                                        <button onClick={() => refreshButton()} className="btn btn-primary">Refresh</button>
                                    </>
                                ) : (
                                    <>
                                        <h3>Would you like to use this table ?</h3>
                                        <div className="typicalR pt-4">
                                            <button onClick={() => setQrType()} className="btn btn-primary">Yes I will use it</button>
                                            <NavLink reloadDocument to="/" className="btn btn-secondary">No I don't use it</NavLink>

                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </Modal>
                    <Layout>
                        {sidebar ? (
                            <>
                                <button onClick={() => setSidebar(false)} className="sideTick">
                                    <i className="fi fi-br-menu-burger manaZone"></i>
                                </button>
                                <div className="sidebarCutton">
                                    <h6 className="text-center">Your Cart</h6>
                                    {Object.values(Table).map((a) => {
                                        if (a.tableitems.length === 0) {
                                            return (
                                                <p className="text-center" key={a._id}>Your cart empty!</p>
                                            )
                                        } else {
                                            return (
                                                <Fragment key={a._id}>
                                                    <table className="table table-bordered solotable">
                                                        <thead>
                                                            <tr>
                                                                <th>Name</th>
                                                                <th>Quantity</th>
                                                                <th>Price</th>
                                                                {a.tableitems?.map((z) => {
                                                                    if (z.status === 1) {
                                                                        Kunt = "Yes"
                                                                        return null
                                                                    }
                                                                    return null
                                                                })}
                                                                {Kunt ? (
                                                                    <th></th>
                                                                ) : null}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {a.tableitems?.map((z) => {
                                                                var total = z.quantity * z.item.foodprice
                                                                fulltotal += total
                                                                return (
                                                                    <tr key={z.item._id}>
                                                                        <td className="text-nowrap">{z.item.foodname}</td>
                                                                        <td>{z.quantity}</td>
                                                                        <td>{VND.format(z.item.foodprice)}</td>
                                                                        {z.status === 1 ? (
                                                                            <td><button onClick={() => deleteItem(z.item.foodname, z)} className="btn btn-danger">x</button></td>
                                                                        ) : null}
                                                                    </tr>
                                                                )
                                                            })}
                                                            <tr>
                                                                <th colSpan={2}>Fulltotal</th>
                                                                {a.tableitems?.map((z) => {
                                                                    if (z.status === 1) {
                                                                        Cunt = "No"
                                                                        return null
                                                                    } else {
                                                                        Cunt = "Yes"
                                                                        return null
                                                                    }
                                                                })}
                                                                {Cunt === "Yes" ? (
                                                                    <th>{VND.format(fulltotal)}</th>
                                                                ) : Cunt === "No" ? (
                                                                    <th colSpan={2}>{VND.format(fulltotal)}</th>
                                                                ) : null}
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </Fragment>
                                            )
                                        }
                                    })}
                                    <div className="text-center">
                                        {Object.values(Table).map((t) => {
                                            if (t.tableitems.length > 0) {
                                                return (
                                                    <button key={t._id} onClick={() => CheckOutQr(t)} className="btn btn-primary">Checkout</button>
                                                )
                                            }
                                            return null
                                        })}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <button onClick={() => setSidebar(true)} className="sideTick">
                                <i className="fi fi-br-menu-burger manaZone"></i>
                            </button>
                        )}
                        <div className="bg-white">
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
                                            {Object.values(Table).map((a) => {
                                                if (a.tableitems.length === 0) {
                                                    return (
                                                        <p className="text-center" key={a._id}>Your cart empty!</p>
                                                    )
                                                } else {
                                                    return (
                                                        <Fragment key={a._id}>
                                                            <table className="table table-bordered solotable">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Name</th>
                                                                        <th>Quantity</th>
                                                                        <th>Price</th>
                                                                        {a.tableitems?.map((z) => {
                                                                            if (z.status === 1) {
                                                                                Kunt = "Yes"
                                                                                return null
                                                                            }
                                                                            return null
                                                                        })}
                                                                        {Kunt ? (
                                                                            <th></th>
                                                                        ) : null}
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {a.tableitems?.map((z) => {
                                                                        var total = z.quantity * z.item.foodprice
                                                                        fulltotal += total
                                                                        return (
                                                                            <tr key={z.item._id}>
                                                                                <td className="text-nowrap">{z.item.foodname}</td>
                                                                                <td>{z.quantity}</td>
                                                                                <td>{VND.format(z.item.foodprice)}</td>
                                                                                {z.status === 1 ? (
                                                                                    <td><button onClick={() => deleteItem(z.item.foodname, z)} className="btn btn-danger">x</button></td>
                                                                                ) : null}
                                                                            </tr>
                                                                        )
                                                                    })}
                                                                    <tr>
                                                                        <th colSpan={2}>Fulltotal</th>
                                                                        {a.tableitems?.map((z) => {
                                                                            if (z.status === 1) {
                                                                                Cunt = "No"
                                                                                return null
                                                                            } else {
                                                                                Cunt = "Yes"
                                                                                return null
                                                                            }
                                                                        })}
                                                                        {Cunt === "Yes" ? (
                                                                            <th>{VND.format(fulltotal)}</th>
                                                                        ) : Cunt === "No" ? (
                                                                            <th colSpan={2}>{VND.format(fulltotal)}</th>
                                                                        ) : null}
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </Fragment>
                                                    )
                                                }
                                            })}
                                            <div className="text-center">
                                                {Object.values(Table).map((t) => {
                                                    if (t.tableitems.length > 0) {
                                                        return (
                                                            <button key={t._id} onClick={() => CheckOutQr(t)} className="btn btn-primary">Checkout</button>
                                                        )
                                                    }
                                                    return null
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
                                        <p className="text-muted"><b>Note</b> : items will automatically confirm after 15s</p>
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
                                                            <td><input type="number" onChange={(e) => setQuantityAdd(e.target.value)} min={1} max={i.foodquantity} defaultValue={1} className="textDeny" /></td>
                                                            <td><button className="addIQr" onClick={(e) => takeitNow(e, i)}><i className="fi fi-ss-shopping-cart"></i></button></td>
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
                        </div>
                    </Layout>
                </>
            ) : (
                <NotFound />
            )
            }
        </>
    )
}
export default QrCodeTable