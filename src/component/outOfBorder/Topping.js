import axios from "axios";
import { Fragment, useEffect, useState, useRef } from "react";
import ReactPaginate from "react-paginate";

function Topping({ cate, setDetailState, modalData }) {
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

    function addToCart(name, quantity) {
        var stored = JSON.parse(localStorage.getItem("cart"));
        if (!stored) {
            var students = [];
            var student1 = { name: name, quantity: quantity };
            students.push(student1);
            localStorage.setItem("cart", JSON.stringify(students));
            setDetailState({ callAlert: true })
        } else {
            var sameItem = JSON.parse(localStorage.getItem("cart")) || [];
            for (var i = 0; i < sameItem.length; i++) {
                if (name === sameItem[i].name) {
                    sameItem[i].quantity += quantity;
                    localStorage.setItem('cart', JSON.stringify(sameItem))
                    setDetailState({ callAlert: true })
                } else if (i === sameItem.length - 1) {
                    var stored2 = JSON.parse(localStorage.getItem("cart"));
                    var student2 = { name: name, quantity: quantity };
                    stored2.push(student2);
                    localStorage.setItem("cart", JSON.stringify(stored2));
                    setDetailState({ callAlert: true })
                }
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
                                <div style={{ width: "10%", textAlign: "center" }}>
                                    <button onClick={() => addToCart(z.foodname, 1)} className='plusPlusDe'>+</button>
                                </div>
                            </div>
                            <hr style={{ color: "lightgray", marginTop: 0 }} />
                        </Fragment>
                    ) : null
                )
            })}
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
        </>
    )
}
export default Topping