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
import { jwtDecode } from "jwt-decode";
import socketIOClient from "socket.io-client";
import Header from "../component/Header";
// import "../css/CategoryCss.css";

function QrCodeTable() {
    var Cunt = null
    var Kunt = null
    let appler = useParams()
    const cookies = new Cookies()
    const token = cookies.get("TOKEN")
    const socketRef = useRef();
    const [Category, setCategory] = useState([]);
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

    function Success() {
        Swal.fire(
            'Successfully!',
            '',
            'success'
        )
    }

    function Fail() {
        Swal.fire(
            'Fail!',
            '',
            'error'
        )
    }

    useEffect(() => {
        if (getQr === "2") {
            setModalOpenDetail(false)
        } else {
            setModalOpenDetail(true)
        }
        currentPage.current = 1;
        getPagination();

        socketRef.current = socketIOClient.connect("https://eatcom.onrender.com")

        socketRef.current.on('AddItemToTableSuccess', dataGot => {
            console.log(dataGot);
            if (dataGot.type === "QR" && appler.id === dataGot.tableid) {
                getTable4()
                setDetect(dataGot)
                setTimeout(() => {
                    const configuration2 = {
                        method: "post",
                        url: "https://eatcom.onrender.com/UpdateItemQrStatus",
                        data: {
                            tableid: dataGot.tableid,
                            foodname: dataGot.foodname,
                            status: 2
                        }
                    }
                    axios(configuration2)
                        .then(() => {
                            setDetect(dataGot)
                        }).catch((err) => { console.log(err); })
                }, 15000)
            }
        })

        socketRef.current.on('AddItemToTableFail', dataGot => {
            if (dataGot.type === "QR" && appler.id === dataGot.tableid) {
                Fail()
            }
        })

        socketRef.current.on('DeleteQritemSuccess', dataGot => {
            if (appler.id === dataGot.tableid) {
                Success()
                getTable4()
            }
        })

        socketRef.current.on('Checkout4QrSuccess', dataGot => {
            if (appler.id === dataGot.tableid) {
                Swal.fire(
                    'Checkout Successfully!',
                    'Thank you for using our services',
                    'success'
                ).then(() => {
                    localStorage.removeItem("QrCode")
                    window.location.href = "/"
                })
            }
        })

        socketRef.current.on('Checkout4QrFail', dataGot => {
            if (appler.id === dataGot.tableid) {
                Fail()
            }
        })

        socketRef.current.on('QrCodeTableActiveSuccess', dataGot => {
            if (appler.id === dataGot.tableid) {
                appler.qr = "2"
                localStorage.setItem("QrCode", appler.qr)
                window.location.reload()
            }
        })

        return () => {
            socketRef.current.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getTable4 = useCallback(() => {
        const configuration = {
            method: "get",
            url: "https://eatcom.onrender.com/QrCodeItemTB",
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
            url: "https://eatcom.onrender.com/GetCategoryMenu",
            params: {
                category: appler.cate,
                page: currentPage.current,
                limit: limit,
                filter: appler.fil
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
        const data = { id: appler.id, cusid: kock }
        socketRef.current.emit('QrCodeTableActiveSocket', data)
    }

    const takeitNow = (e, k) => {
        const item = { item: k, quantity: QuantityAdd, status: 1 }
        var foodname = ""
        if (k) {
            foodname = k.foodname
        }
        e.preventDefault()
        const data = { tableid: appler.id, item: item, quantity: QuantityAdd, foodname: foodname, type: "QR" }
        socketRef.current.emit('AddItemToTableSocket', data)
    }

    const deleteItem = (name, item) => {
        const data = { tableid: appler.id, quantity: QuantityAdd, foodname: name, item: item }
        socketRef.current.emit('DeleteQritemSocket', data)
    }

    const CheckOutQr = (e) => {
        const data = { id: e._id, tableid: appler.id }
        socketRef.current.emit('Checkout4QrYeahSocket', data)
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
                        <Header type={"Yes"} />
                        {sidebar ? (
                            <>
                                <button onClick={() => setSidebar(false)} className="sideTick">
                                    <svg className="manaZone" xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" /></svg>
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
                                <svg className="manaZone" xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" /></svg>
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
                                                            <td><button className="addIQr" onClick={(e) => takeitNow(e, i)}>
                                                                <svg style={{ fill: "#0f172b" }} xmlns="http://www.w3.org/2000/svg" height="16" width="18" viewBox="0 0 576 512"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" /></svg>
                                                            </button></td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                        <ReactPaginate
                                            breakLabel="..."
                                            nextLabel=">"
                                            onPageChange={handlePageClick}
                                            pageRangeDisplayed={5}
                                            pageCount={pageCount}
                                            previousLabel="<"
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