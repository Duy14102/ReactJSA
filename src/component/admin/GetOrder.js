import { useState, useEffect, useRef } from "react";
import OrderAdmin from "../outOfBorder/OrderAdmin";
import ReactPaginate from "react-paginate";
import axios from "axios";

function GetOrder() {

    const [Order, setOrder] = useState([])
    const [pageCount, setPageCount] = useState(6);
    const currentPage = useRef();
    const limit = 9

    useEffect(() => {
        currentPage.current = 1;
        getPagination()
    }, [])

    function handlePageClick(e) {
        currentPage.current = e.selected + 1
        getPagination();
    }

    function getPagination() {
        const configuration = {
            method: "get",
            url: "https://eatcom.onrender.com/GetAllOrderActive",
            params: {
                page: currentPage.current,
                limit: limit
            }
        };
        axios(configuration)
            .then((result) => {
                setOrder(result.data.results.result);
                setPageCount(result.data.results.pageCount)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <>
            <table className='table table-bordered text-center solotable'>
                <thead>
                    <tr className="text-white" style={{ background: "#374148" }}>
                        <th>Fullname</th>
                        <th className="thhuhu">Phone Number</th>
                        <th className="thhuhu">Date</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <OrderAdmin Data={Order} />
                </tbody>
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
        </>
    )
}
export default GetOrder;