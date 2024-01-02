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
            url: "https://eatcom.onrender.com/GetItemCanTable",
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

    const takeitNow = (e, k) => {
        if (!QuantityAdd) {
            QuantityAdd = 1
        }
        const item = { item: k, quantity: QuantityAdd, status: 2 }
        var foodname = ""
        if (k) {
            foodname = k.foodname
        }
        e.preventDefault()
        const configuration = {
            method: "post",
            url: "https://eatcom.onrender.com/AddItemToTable",
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
                        <th>Items</th>
                        <th className="thhuhu">Category</th>
                        <th>Quantity</th>
                        <th className="thhuhu">Price</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {menu.map((k) => {
                        return (
                            <tr key={k._id}>
                                <td><span className="jackass"><img loading="lazy" width={50} height={40} alt="" src={k.foodimage} /><br /></span><img className="thhuhu ms-5 me-2" alt="" src={k.foodimage} width={70} height={60} />{k.foodname}</td>
                                <td className="thhuhu cahu">{k.foodcategory}</td>
                                <td className="cahu"><input onChange={(e) => setQuantityAdd(e.target.value)} style={{ width: 60 + "px" }} type="number" defaultValue={1} min={1} max={k.foodquantity} /></td>
                                <td className="thhuhu cahu">{k.foodprice}</td>
                                <td className="cahu thhuhu"><button onClick={(e) => takeitNow(e, k)} className="btn btn-success">Add</button></td>
                                <td className="cahu anotherJackass"><button onClick={(e) => takeitNow(e, k)} className="btn btn-success">+</button></td>
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
export default TableItems