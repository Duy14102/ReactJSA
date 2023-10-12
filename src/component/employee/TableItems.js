import axios from "axios";
import { useEffect } from "react";
import { useState, useRef } from "react";
import ReactPaginate from "react-paginate"
import Swal from "sweetalert2";

function TableItems({ ModalData }) {
    const [pageCount2, setPageCount2] = useState(6);
    const currentPage = useRef();
    const limit = 9
    var [QuantityAdd, setQuantityAdd] = useState()
    const [menu, setMenu] = useState([])

    useEffect(() => {
        currentPage.current = 1;
        getAdminMenu()
    }, [])

    function handlePageClick2(e) {
        currentPage.current = e.selected + 1
        getAdminMenu();
    }

    function getAdminMenu() {
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
                setPageCount2(result.data.results.pageCount)
            })
            .catch((error) => {
                console.log(error);
            });
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
                tableid: ModalData._id,
                statusCheck: ModalData.tablestatus,
                item: item,
                quantity: QuantityAdd,
                foodname: foodname
            }
        };
        axios(configuration)
            .then(() => {
                Swal.fire(
                    'Added Successfully!',
                    '',
                    'success'
                )
            })
            .catch(() => {
                Swal.fire(
                    'Added Fail!',
                    '',
                    'error'
                )
            });
    }
    return (
        <>
            <h2 className='text-center'>Items List</h2>
            <table className="table table-bordered">
                <thead>
                    <tr className="text-center">
                        <th>Name</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {menu.map((k) => {
                        return (
                            <tr key={k._id} className="text-center">
                                <td>{k.foodname}</td>
                                <td>{k.foodcategory}</td>
                                <td><input onChange={(e) => setQuantityAdd(e.target.value)} style={{ width: 60 + "px" }} type="number" defaultValue={1} min={1} max={k.foodquantity} /></td>
                                <td>{k.foodprice}</td>
                                <td><button onClick={(e) => takeitNow(e, k)} className="btn btn-success">Add</button></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick2}
                pageRangeDisplayed={5}
                pageCount={pageCount2}
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
        </>
    )
}
export default TableItems