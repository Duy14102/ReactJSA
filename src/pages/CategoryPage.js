import '../css/Category.css';
import Footer from '../component/Footer';
import Header from '../component/Header';
import { NavLink, useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import NotFound from '../component/outOfBorder/NotFound';
import axios from 'axios';
import $ from 'jquery'
import ReactPaginate from 'react-paginate';

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
        if (e === "nto") {
            window.location.href = `/CategorySite/${appler.id}/nto`
        }
        if (e === "otn") {
            window.location.href = `/CategorySite/${appler.id}/otn`
        }
        if (e === "hpf") {
            window.location.href = `/CategorySite/${appler.id}/hpf`
        }
        if (e === "lpf") {
            window.location.href = `/CategorySite/${appler.id}/lpf`
        }
        if (e === "atz") {
            window.location.href = `/CategorySite/${appler.id}/atz`
        }
    }

    const CateFilter = (e) => {
        if (e === "Meat") {
            window.location.href = `/CategorySite/${e}/nto`
        } if (e === "Vegetables") {
            window.location.href = `/CategorySite/${e}/nto`
        } if (e === "Drink") {
            window.location.href = `/CategorySite/${e}/nto`
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
        $("#select").val(appler.fil);
        $("#mix2up").val(appler.id);
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
            <Header type={"Yes"} />
            <div className='bg-white'>
                <div className='container'>
                    <div className='pt-3'>
                        <p className='encot' style={{ margin: 0 }}><NavLink className="textNavlink" to="/">Home</NavLink> / <NavLink reloadDocument className="textNavlink" to={`/CategorySite/${appler.id}/nto`}><b>{appler.id}</b></NavLink></p>
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
                            <div className='d-flex justify-content-between Jkaem'>
                                <div className='CatuRespon'>
                                    <select id='mix2up' onChange={(e) => CateFilter(e.target.value)} className='FilterDrop'>
                                        <option value={"Meat"}>Meat</option>
                                        <option value={"Vegetables"}>Vegetables</option>
                                        <option value={"Drink"}>Drink</option>
                                    </select>
                                </div>
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
                            {Object.values(Category).map(i => {
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
                                                <NavLink reloadDocument to={`/DetailMenuPage/${i.foodname}/${i.foodcategory}`} className="product-item-title">{i.foodname} </NavLink>
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
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
export default CategoryPage;