import '../css/Category.css';
import { NavLink, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Header from "../component/Header";
import Footer from "../component/Footer";
import NotFound from "../component/outOfBorder/NotFound";
import $ from 'jquery';
import axios from "axios";
import ReactPaginate from 'react-paginate';
import LazyLoad from 'react-lazyload';

function SearchSite() {
    let appler = useParams()
    const [Count, setCount] = useState([]);
    const [searchdata, setSearchData] = useState([]);
    const [pageCount, setPageCount] = useState(6);
    const currentPage = useRef();
    const limit = 9
    // Get Search Data
    useEffect(() => {
        currentPage.current = 1;
        getPagination();
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
            url: "http://localhost:3000/GetSearch",
            params: {
                foodSearch: appler.id,
                page: currentPage.current,
                limit: limit
            }
        };
        axios(configuration)
            .then((result) => {
                setSearchData(result.data.results.result);
                setCount(result.data.results.total)
                setPageCount(result.data.results.pageCount)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    switch (appler.fil) {
        case "nto":
            searchdata.sort((a, b) => a._id - b._id).reverse()
            break;
        case "otn":
            searchdata.sort((a, b) => a._id - b._id)
            break;
        case "hpf":
            searchdata.sort((a, b) => a.foodprice - b.foodprice).reverse()
            break;
        case "lpf":
            searchdata.sort((a, b) => a.foodprice - b.foodprice)
            break;
        case "atz":
            searchdata.sort((a, b) => a.foodname > b.foodname ? 1 : -1,)
            break;
        default:
            searchdata.sort((a, b) => a._id - b._id).reverse()
            break;
    }

    const Filter = (e) => {
        if (e === "lpf") {
            window.location.href = `/SearchSite/${appler.id}/lpf`
        } if (e === "hpf") {
            window.location.href = `/SearchSite/${appler.id}/hpf`
        } if (e === "nto") {
            window.location.href = `/SearchSite/${appler.id}/nto`
        } if (e === "otn") {
            window.location.href = `/SearchSite/${appler.id}/otn`
        } if (e === "atz") {
            window.location.href = `/SearchSite/${appler.id}/atz`
        }
    }

    function addToCart(name, quantity) {
        var stored = JSON.parse(localStorage.getItem("cart"));
        if (!stored) {
            var students = [];
            var student1 = { name: name, quantity: quantity };
            students.push(student1);
            localStorage.setItem("cart", JSON.stringify(students));
            window.location.reload()
        } else {
            var sameItem = JSON.parse(localStorage.getItem("cart")) || [];
            for (var i = 0; i < sameItem.length; i++) {
                if (name === sameItem[i].name) {
                    sameItem[i].quantity += quantity;
                    localStorage.setItem('cart', JSON.stringify(sameItem))
                    window.location.reload()
                } else if (i === sameItem.length - 1) {
                    var stored2 = JSON.parse(localStorage.getItem("cart"));
                    var student2 = { name: name, quantity: quantity };
                    stored2.push(student2);
                    localStorage.setItem("cart", JSON.stringify(stored2));
                    window.location.reload()
                }
            }
        }
    }

    $(function () {
        $("#select2").val(appler.fil);
    })

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    if (!appler) {
        return NotFound()
    }
    return (
        <>
            <Header />
            <div className='container'>
                <div className='ruler pt-3'>
                    <p style={{ margin: 0 }}><NavLink className="textNavlink" to="/">Home</NavLink> / <b>Search result for : "{appler.id}"</b></p>
                    <div className='d-flex justify-content-between align-items-center ThirdRow'>
                        <p style={{ margin: 0, width: 100 + "%" }}>Display all {Count} results</p>
                        <select id='select2' onChange={(e) => Filter(e.target.value)} className='FilterDrop'>
                            <option value={"nto"}>New to old</option>
                            <option value={"otn"}>Old to new</option>
                            <option value={"hpf"}>High price first</option>
                            <option value={"lpf"}>Low price first</option>
                            <option value={"atz"}>A to Z</option>
                        </select>
                    </div>
                </div>
                <div className='ruler pt-4'>
                    <div className='FirstRow'>
                        <div className='nOthing'>
                            <h5>Product Category</h5>
                            <hr style={{ width: 15 + "%", height: 3 + "px" }} />
                            <NavLink reloadDocument to={`/CategorySite/Meat/${appler.fil}`} activeclassname='active' className="text-black"><p>Meat</p></NavLink>
                            <NavLink reloadDocument to={`/CategorySite/Drink/${appler.fil}`} className="text-black" ><p>Drink</p></NavLink>
                            <NavLink reloadDocument to={`/CategorySite/Vegetables/${appler.fil}`} className="text-black"><p>Vegetables</p></NavLink>
                        </div>
                    </div>
                    <div className="row SecondRow">
                        {Object.values(searchdata).map(i => {
                            var quantity = 1
                            return (
                                <div className="product-box column p-0 CateColumn" key={i._id}>
                                    <LazyLoad>
                                        <div className="product-item">
                                            <NavLink reloadDocument to={`/DetailMenuPage/${i.foodname}/${i.foodcategory}`}>
                                                <div className="product-item-image">
                                                    <img loading='lazy' src={i.foodimage} alt="" />
                                                    <div className="product-item-image-hover">
                                                    </div>
                                                </div>
                                            </NavLink>
                                            <div className="product-item-content">
                                                <div className="product-item-category">
                                                    {i.foodcategory}
                                                </div>
                                                <NavLink reloadDocument to={`/DetailMenuPage/${i.foodname}/${i.foodcategory}`} className="product-item-title">{i.foodname}</NavLink>
                                                <div className="product-item-price">
                                                    {VND.format(i.foodprice)}
                                                </div>
                                            </div>
                                            <div className='liutiudiu'>
                                                {i.foodquantity > 0 ? (
                                                    <button onClick={() => addToCart(i.foodname, quantity)} className='btn btn-primary'>Add to cart</button>
                                                ) : (
                                                    <button style={{ pointerEvents: "none", opacity: 0.5 }} className='btn btn-primary'>Add to cart</button>
                                                )}
                                            </div>
                                        </div>
                                    </LazyLoad>
                                </div>
                            )
                        })}
                        <ReactPaginate
                            breakLabel="..."
                            nextLabel="next >"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={5}
                            pageCount={pageCount}
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
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
export default SearchSite;