import { NavLink, useParams } from "react-router-dom";
import { useEffect, useRef, useReducer } from "react";
import NotFound from "../component/outOfBorder/NotFound";
import $ from 'jquery';
import axios from "axios";
import ReactPaginate from 'react-paginate';
import Layout from '../Layout';

function SearchSite() {
    let appler = useParams()
    const [searchState, setSearchState] = useReducer((prev, next) => ({
        ...prev, ...next
    }), {
        Count: [],
        searchdata: [],
        pageCount: 6,
        callAlert: false,
    })
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
            url: "https://eatcom.onrender.com/GetSearch",
            params: {
                foodSearch: appler.id,
                page: currentPage.current,
                limit: limit,
                filter: appler.fil
            }
        };
        axios(configuration)
            .then((result) => {
                setSearchState({ searchdata: result.data.results.result })
                setSearchState({ Count: result.data.results.total })
                setSearchState({ pageCount: result.data.results.pageCount })
            })
            .catch((error) => {
                console.log(error);
            });
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
            setSearchState({ callAlert: true })
        } else {
            var sameItem = JSON.parse(localStorage.getItem("cart")) || [];
            for (var i = 0; i < sameItem.length; i++) {
                if (name === sameItem[i].name) {
                    sameItem[i].quantity += quantity;
                    localStorage.setItem('cart', JSON.stringify(sameItem))
                    setSearchState({ callAlert: true })

                } else if (i === sameItem.length - 1) {
                    var stored2 = JSON.parse(localStorage.getItem("cart"));
                    var student2 = { name: name, quantity: quantity };
                    stored2.push(student2);
                    localStorage.setItem("cart", JSON.stringify(stored2));
                    setSearchState({ callAlert: true })
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
        <Layout>
            {searchState.callAlert ? (
                <div className="d-flex justify-content-end danguru">
                    <div class='alertNow'>
                        <i className="fas fa-check-circle alert__icon"></i>
                        <p class='m-0'>Add to cart success!</p>
                    </div>
                </div>
            ) : null}
            <div className='bg-white'>
                <div className='container'>
                    <div className='ruler pt-3'>
                        <p style={{ margin: 0 }}><NavLink className="textNavlink" to="/">Home</NavLink> / <b>Search result for : "{appler.id}"</b></p>
                        <div className='ThirdRow'>
                            <p style={{ margin: 0, width: 100 + "%", marginBottom: 5 }}>Display all {searchState.Count} results</p>
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
                            {Object.values(searchState.searchdata).map(i => {
                                var quantity = 1
                                return (
                                    <div className="product-box column p-0 CateColumn" key={i._id}>
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
                                                <NavLink reloadDocument to={`/DetailMenuPage/${i.foodname}/${i.foodcategory}`} className="product-item-title text-nowrap">{i.foodname}</NavLink>
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
                                    </div>
                                )
                            })}
                            <ReactPaginate
                                breakLabel="..."
                                nextLabel="next >"
                                onPageChange={handlePageClick}
                                pageRangeDisplayed={5}
                                pageCount={searchState.pageCount}
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
            </div>
        </Layout>
    );
}
export default SearchSite;