import axios from "axios";
import { Fragment, useEffect, useState, useRef } from "react";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";

function Topping2({ cate, father, setFather, i, indexChange }) {
    const [topping, setTopping] = useState([])
    const [pageCount, setPageCount] = useState(6)
    const [newItems, setNewItems] = useState()
    const currentPage = useRef();
    const limit = 5
    useEffect(() => {
        currentPage.current = 1;
        getPagination()
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

    useEffect(() => {
        if (father.mainChoose) {
            const configuration = {
                method: "get",
                url: "https://eatcom.onrender.com/GetDetailMenu2",
                params: {
                    id: father.mainChoose
                }
            };
            axios(configuration)
                .then((result) => {
                    setNewItems(result.data.data)
                })
        }
    }, [father.mainChoose])

    function changeItems() {
        if (cate === "Main") {
            const configuration = {
                method: "post",
                url: "https://eatcom.onrender.com/UpdateMainItemsX",
                data: {
                    id: i._id,
                    id2: indexChange,
                    data: newItems
                }
            };
            axios(configuration)
                .then(() => {
                    Swal.fire(
                        'Successfully!',
                        '',
                        'success'
                    ).then(function () {
                        window.location.reload();
                    })
                })
        }
        else {
            const configuration = {
                method: "post",
                url: "https://eatcom.onrender.com/UpdateToppingItemsX",
                data: {
                    id: i._id,
                    id2: indexChange,
                    oldId: father.indexChange2,
                    data: newItems
                }
            };
            axios(configuration)
                .then(() => {
                    Swal.fire(
                        'Successfully!',
                        '',
                        'success'
                    ).then(function () {
                        window.location.reload();
                    })
                })
        }
    }

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    return (
        <>
            {topping?.map((z) => {
                console.log(father.mainChoose === z._id)
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
                                    {father.indexChange === z._id || father.mainChoose === z._id ? (
                                        <input defaultChecked id="checkHut" onClick={() => setFather({ mainChoose: null, indexChange: null })} style={{ opacity: z.foodquantity < 1 ? 0.5 : 1, pointerEvents: z.foodquantity < 1 ? "none" : "auto", width: 20, height: 20, accentColor: "#FEA116" }} type="checkbox" />
                                    ) : (
                                        <input onClick={() => setFather({ mainChoose: z._id, indexChange: null })} id="checkHut" style={{ opacity: z.foodquantity < 1 || father.mainChoose ? 0.5 : 1, pointerEvents: z.foodquantity < 1 || father.mainChoose ? "none" : "auto", width: 20, height: 20, accentColor: "#FEA116" }} type="checkbox" />
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
                <button onClick={() => changeItems()} style={father.mainChoose ? null : { opacity: 0.5, pointerEvents: "none" }} className="btnSonCallingUpperT">
                    <p className="m-0 text-white">Done</p>
                </button>
            </div>
        </>
    )
}
export default Topping2