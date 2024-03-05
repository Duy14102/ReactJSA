import axios from "axios";
import { useState, useRef, useEffect, Fragment } from "react";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";

function ToppingCart({ cate, indexMain }) {
    const [topWrap, setTopWrap] = useState([])
    const [topping, setTopping] = useState([])
    const [pageCount, setPageCount] = useState(6)
    const currentPage = useRef();
    const limit = 5
    useEffect(() => {
        currentPage.current = 1;
        getPagination()
        var stored = JSON.parse(localStorage.getItem("cart"))
        for (var i = 0; i < stored.length; i++) {
            if (i === indexMain) {
                setTopWrap(stored[i].topping)
            }
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

    function removeItem() {
        var stored = JSON.parse(localStorage.getItem("cart"));
        if (stored) {
            stored.splice(indexMain, 1);
            localStorage.setItem("cart", JSON.stringify(stored));
            Swal.fire(
                'Delete Successfully!',
                '',
                'success'
            ).then(function () {
                window.location.reload();
            })
        }
    }


    function chooseTopping(e, id) {
        var anyWhat = []
        if (topWrap) {
            anyWhat = topWrap
        }
        if (e.target.checked && !topWrap?.includes(id)) {
            anyWhat?.push(id)
            const mixingE = [...anyWhat]
            setTopWrap(mixingE)
        } else if (!e.target.checked && topWrap?.includes(id)) {
            anyWhat?.pop(id)
            const mixingE = [...anyWhat]
            setTopWrap(mixingE)
        }
    }

    function updateTopping() {
        var stored = JSON.parse(localStorage.getItem("cart"))
        for (var i = 0; i < stored.length; i++) {
            if (i === indexMain) {
                stored[i].topping = topWrap
                localStorage.setItem("cart", JSON.stringify(stored));
                Swal.fire(
                    'Save Successfully!',
                    '',
                    'success'
                ).then(function () {
                    window.location.reload();
                })
            }
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
                                    {topWrap?.includes(z._id) ? (
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
                <div className="d-flex" style={{ gap: 7 }}>
                    <button onClick={() => updateTopping()} className="btn btn-success">Save</button>
                    <button onClick={() => removeItem()} className="btn btn-danger">Delete</button>
                </div>
            </div>
        </>
    )
}
export default ToppingCart