import axios from "axios";
import { Fragment, useEffect, useState, useRef } from "react";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";

function Topping({ cate, setDetailState, modalData, setOpen }) {
    const [topWrap, setTopWrap] = useState([])
    const [topping, setTopping] = useState([])
    const [pageCount, setPageCount] = useState(6)
    const currentPage = useRef();
    const limit = 5
    useEffect(() => {
        currentPage.current = 1;
        if (modalData?.foodcategory === "Main") {
            getPagination()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cate])

    function handlePageClick(e) {
        currentPage.current = e.selected + 1
        getPagination();
    }

    function getPagination() {
        const configuration = {
            method: "get",
            url: "https://eatcom.onrender.com/GetToppingByCate",
            params: {
                cate: cate,
                page: currentPage.current,
                limit: limit,
            }
        };
        axios(configuration)
            .then((result) => {
                setTopping(result.data.results.result)
                setPageCount(result.data.results.pageCount)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    function chooseTopping(e, id) {
        const anyWhat = topWrap
        if (e.target.checked && !topWrap.includes(id)) {
            anyWhat.push(id)
            const mixingE = [...anyWhat]
            setTopWrap(mixingE)
        } else if (!e.target.checked && topWrap.includes(id)) {
            anyWhat.pop(id)
            const mixingE = [...anyWhat]
            setTopWrap(mixingE)
        }
    }

    function Success() {
        Swal.fire(
            'Successfully!',
            '',
            'success'
        ).then(function () {
            setOpen(false)
        })
    }

    // function Fail(){
    //     Swal.fire(
    //         'Fail!',
    //         '',
    //         'error'
    //     ).then(function () {
    //         setOpen(false)
    //     })
    // }

    async function addToCart(name, quantity, maxQ) {
        var stored = await JSON.parse(localStorage.getItem("cart"));
        if (!stored) {
            var students = [];
            var student1 = { name: name, quantity: quantity, topping: topWrap };
            students.push(student1);
            localStorage.setItem("cart", JSON.stringify(students));
            Success()
        } else {
            var sameItem = await JSON.parse(localStorage.getItem("cart")) || [];
            var storedX = await JSON.parse(localStorage.getItem("cart"));
            for (var element of sameItem) {
                if (topWrap.length > 0) {
                    if (element.topping?.every((item) => topWrap?.includes(item))) {
                        if (element.topping?.every((item) => topWrap?.includes(item))) {
                            var studentX = { name: name, quantity: quantity, topping: topWrap };
                            storedX.push(studentX);
                            localStorage.setItem("cart", JSON.stringify(storedX));
                            Success()
                            break
                        }
                    }
                }
            };
            for (var i = 0; i < sameItem.length; i++) {
                if (name === sameItem[i].name) {
                    if (sameItem[i].quantity + quantity > maxQ) {
                        setDetailState({ callAlert2: true })
                    } else {
                        if (sameItem[i].topping?.every((item) => topWrap?.includes(item)) && sameItem[i].topping.length > 0 && sameItem[i].topping?.length === topWrap?.length && topWrap?.length > 0) {
                            sameItem[i].quantity += quantity;
                            localStorage.setItem('cart', JSON.stringify(sameItem))
                            Success()
                            break
                        }
                        else if (!sameItem[i].topping?.every((item) => topWrap?.includes(item)) && sameItem[i].topping.length > 0 && topWrap?.length > 0) {
                            var studentH = { name: name, quantity: quantity, topping: topWrap };
                            storedX.push(studentH);
                            localStorage.setItem("cart", JSON.stringify(storedX));
                            Success()
                        }
                        if (topWrap.length === 0) {
                            if (sameItem.find(e => e.topping.length === 0)) {
                                if (sameItem[i].topping.length === 0) {
                                    sameItem[i].quantity += quantity;
                                    localStorage.setItem('cart', JSON.stringify(sameItem))
                                    Success()
                                }
                            } else {
                                var studentK = { name: name, quantity: quantity, topping: topWrap };
                                storedX.push(studentK);
                                localStorage.setItem("cart", JSON.stringify(storedX));
                                Success()
                                break
                            }
                        }
                    }
                } else if (i === sameItem.length - 1) {
                    var stored2 = JSON.parse(localStorage.getItem("cart"));
                    var student2 = { name: name, quantity: quantity, topping: topWrap };
                    stored2.push(student2);
                    localStorage.setItem("cart", JSON.stringify(stored2));
                    Success()
                }
            };
        }
    }
    return (
        <>
            {topping?.map((z) => {
                return (
                    z.foodcategory === cate ? (
                        <Fragment key={z._id}>
                            <div className='d-flex justify-content-between w-100' style={{ gap: 20 }}>
                                <div style={{ width: "15%" }}>
                                    <img src={z.foodimage} width={"100%"} height={"65%"} alt='' />
                                </div>
                                <div style={{ width: "65%" }}>
                                    <p className='m-0'><b>{z.foodname}</b></p>
                                    <p className="cutTextRightNow" style={{ fontSize: 15, color: "gray" }}>{z.fooddescription}</p>
                                </div>
                                <p style={{ width: "10%", textAlign: "center" }}>{VND.format(z.foodprice)}</p>
                                <div style={{ width: "10%", textAlign: "center", position: "relative" }}>
                                    {topWrap.includes(z._id) ? (
                                        <input defaultChecked id="checkHut" onClick={(e) => chooseTopping(e, z._id)} style={{ opacity: z.foodquantity < 1 ? 0.5 : 1, pointerEvents: z.foodquantity < 1 ? "none" : "auto", width: 20, height: 20, accentColor: "#FEA116" }} type="checkbox" />
                                    ) : (
                                        <input id="checkHut" onClick={(e) => chooseTopping(e, z._id)} style={{ opacity: z.foodquantity < 1 ? 0.5 : 1, pointerEvents: z.foodquantity < 1 ? "none" : "auto", width: 20, height: 20, accentColor: "#FEA116" }} type="checkbox" />
                                    )}
                                    {z.foodquantity < 1 ? (
                                        <div style={{ position: "absolute", bottom: 5, right: 5 }}>
                                            <p className='m-0 text-danger text-nowrap'>Out of stock</p>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                            <hr style={{ color: "lightgray", marginTop: 0 }} />
                        </Fragment>
                    ) : null
                )
            })}
            <div className="d-flex align-items-center justify-content-between">
                <ReactPaginate
                    breakLabel="..."
                    nextLabel=">"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    previousLabel="<"
                    renderOnZeroPageCount={null}
                    marginPagesDisplayed={2}
                    containerClassName="pagination justify-content-center m-0"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    activeClassName="active"
                    forcePage={currentPage.current - 1}
                />
                <button onClick={() => { addToCart(modalData?.foodname, 1, modalData?.foodquantity); setOpen(false) }} className="btnSonCallingUpperT">
                    <p className="m-0 text-white">Order</p>
                </button>
            </div>
        </>
    )
}
export default Topping