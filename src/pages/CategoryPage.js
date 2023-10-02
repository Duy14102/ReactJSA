import '../css/Category.css';
import Footer from '../component/Footer';
import Header from '../component/Header';
import { NavLink, useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import NotFound from '../component/outOfBorder/NotFound';
import axios from 'axios';
import $ from 'jquery'
import ReactPaginate from 'react-paginate';
import LazyLoad from 'react-lazyload';

function CategoryPage() {
    let appler = useParams()
    const [Category, setCategory] = useState([]);
    const [Count, setCount] = useState([]);
    const [pageCount, setPageCount] = useState(6);
    const currentPage = useRef();
    const limit = 9
    //Get Detail
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
            url: "http://localhost:3000/GetCategoryMenu",
            params: {
                category: appler.id,
                page: currentPage.current,
                limit: limit
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

    switch (appler.fil) {
        case "nto":
            Category.sort((a, b) => a._id - b._id).reverse()
            break;
        case "otn":
            Category.sort((a, b) => a._id - b._id)
            break;
        case "hpf":
            Category.sort((a, b) => a.foodprice - b.foodprice).reverse()
            break;
        case "lpf":
            Category.sort((a, b) => a.foodprice - b.foodprice)
            break;
        case "atz":
            Category.sort((a, b) => a.foodname > b.foodname ? 1 : -1,)
            break;
        default:
            Category.sort((a, b) => a._id - b._id).reverse()
            break;
    }

    const Filter = (e) => {
        if (e === "lpf") {
            window.location.href = `/CategorySite/${appler.id}/lpf`
        } if (e === "hpf") {
            window.location.href = `/CategorySite/${appler.id}/hpf`
        } if (e === "nto") {
            window.location.href = `/CategorySite/${appler.id}/nto`
        } if (e === "otn") {
            window.location.href = `/CategorySite/${appler.id}/otn`
        } if (e === "atz") {
            window.location.href = `/CategorySite/${appler.id}/atz`
        }
    }
    $(function () {
        $("#select").val(appler.fil);
    })

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    if (!appler) {
        return NotFound();
    }
    return (
        <>
            <Header />
            <div className='container'>
                <div className='ruler pt-3'>
                    <p className='encot' style={{ margin: 0 }}><NavLink className="textNavlink" to="/">Home</NavLink> / <NavLink reloadDocument className="textNavlink" to={`/CategorySite/${appler.id}/nto`}><b>{appler.id}</b></NavLink></p>
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
                        {Object.values(Category).map(i => {
                            return (
                                <div className="product-box column p-0 col-4" key={i._id}>
                                    <LazyLoad>
                                        <NavLink reloadDocument to={`/DetailMenuPage/${i.foodname}/${i.foodcategory}`} className="product-item">
                                            <div className="product-item-image">
                                                <img loading='lazy' src={i.foodimage} alt="" />
                                                <div className="product-item-image-hover">
                                                </div>
                                            </div>
                                            <div className="product-item-content">
                                                <div className="product-item-category">
                                                    {i.foodcategory}
                                                </div>
                                                <div className="product-item-title">
                                                    {i.foodname}
                                                </div>
                                                <div className="product-item-price">
                                                    {VND.format(i.foodprice)}
                                                </div>
                                            </div>
                                        </NavLink>
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
    )
}
export default CategoryPage;