import { NavLink, useParams } from "react-router-dom";
import { useEffect, useRef, useReducer } from "react";
import NotFound from "../component/outOfBorder/NotFound";
import $ from 'jquery';
import axios from "axios";
import ReactPaginate from 'react-paginate';
import Layout from '../Layout';
import Header from "../component/Header";

function SearchSite() {
    let appler = useParams()
    const [searchState, setSearchState] = useReducer((prev, next) => ({
        ...prev, ...next
    }), {
        Count: [],
        searchdata: [],
        pageCount: 6,
        callAlert: false,
        classify: false,
        countChoose: null
    })
    const currentPage = useRef();
    const limit = 15
    // Get Search Data
    useEffect(() => {
        currentPage.current = 1;
        var countPro = 0
        if (appler.cate.includes("Meat")) {
            countPro++
        }
        if (appler.cate.includes("Vegetables")) {
            countPro++
        }
        if (appler.cate.includes("Drink")) {
            countPro++
        }
        if (appler.cate.includes("Main")) {
            countPro++
        }
        setSearchState({ countChoose: countPro })
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
                category: appler.cate,
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
            window.location.href = `/SearchSite/${appler.id}/${appler.cate}/lpf`
        } if (e === "hpf") {
            window.location.href = `/SearchSite/${appler.id}/${appler.cate}/hpf`
        } if (e === "nto") {
            window.location.href = `/SearchSite/${appler.id}/${appler.cate}/nto`
        } if (e === "otn") {
            window.location.href = `/SearchSite/${appler.id}/${appler.cate}/otn`
        } if (e === "atz") {
            window.location.href = `/SearchSite/${appler.id}/${appler.cate}/atz`
        }
    }

    function changeMain(e) {
        if (!e.target.checked) {
            appler.cate = appler.cate.replace(",Main", "")
        } else if (e.target.checked) {
            appler.cate += ",Main"
        }
    }
    function changeMeat(e) {
        if (!e.target.checked) {
            appler.cate = appler.cate.replace(",Meat", "")
        } else if (e.target.checked) {
            appler.cate += ",Meat"
        }
    }
    function changeVege(e) {
        if (!e.target.checked) {
            appler.cate = appler.cate.replace(",Vegetables", "")
        } else if (e.target.checked) {
            appler.cate += ",Vegetables"
        }
    }
    function changeDrink(e) {
        if (!e.target.checked) {
            appler.cate = appler.cate.replace(",Drink", "")
        } else if (e.target.checked) {
            appler.cate += ",Drink"
        }
    }

    function clearCate() {
        appler.cate = "Menu"
        window.location.href = `/SearchSite/${appler.id}/${appler.cate}/nto`
    }

    function changeCate() {
        window.location.href = `/SearchSite/${appler.id}/${appler.cate}/nto`
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
        $("#select").val(appler.fil);
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
            <Header type={"Yes"} />
            <div style={{ backgroundColor: "#f2f2f2", paddingTop: 20, paddingBottom: 22 }}>
                <div className='containerNephew'>
                    <div className='pt-4'>
                        <div className="row">
                            <div className='Jkaem'>
                                <div className='ownerOfX'>
                                    <button style={searchState.classify ? { backgroundColor: "#fff", fontWeight: "bold" } : null} onClick={() => searchState.classify ? setSearchState({ classify: false }) : setSearchState({ classify: true })} className='AigButton'>Categories</button>
                                    {searchState.classify ? (
                                        <div className='CatuRespon'>
                                            <div className='fatherCheckMuck'>
                                                <div className='checkMuck'>
                                                    <input onClick={(e) => changeMain(e)} defaultChecked={appler.cate.includes("Main") ? "checked" : null} type="checkbox" id="Main" value="Main" />
                                                    <label htmlFor="Main" className='text-nowrap'>Main dishes</label>
                                                </div>
                                                <div className='checkMuck'>
                                                    <input onClick={(e) => changeMeat(e)} defaultChecked={appler.cate.includes("Meat") ? "checked" : null} type="checkbox" id="Main" value="Main" />
                                                    <label htmlFor="Main" className='text-nowrap'>Meat</label>
                                                </div>
                                                <div className='checkMuck'>
                                                    <input onClick={(e) => changeVege(e)} defaultChecked={appler.cate.includes("Vegetables") ? "checked" : null} type="checkbox" id="Main" value="Main" />
                                                    <label htmlFor="Main" className='text-nowrap'>Vegetables</label>
                                                </div>
                                                <div className='checkMuck'>
                                                    <input onClick={(e) => changeDrink(e)} defaultChecked={appler.cate.includes("Drink") ? "checked" : null} type="checkbox" id="Main" value="Main" />
                                                    <label htmlFor="Main" className='text-nowrap'>Drink</label>
                                                </div>
                                            </div>
                                            <hr className='m-0' />
                                            <div className='d-flex' style={{ gap: "10px", marginTop: 15 }}>
                                                <button onClick={() => changeCate()} className='greekBas' style={{ backgroundColor: "#239839" }}>Confirm</button>
                                                <button onClick={() => setSearchState({ classify: false })} className='greekBas' style={{ backgroundColor: "gray" }}>Cancel</button>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                                <div className='ThirdRow'>
                                    <p className='allover3'>Display all {searchState.Count} results</p>
                                    <select id='select' onChange={(e) => Filter(e.target.value)} className='FilterDrop'>
                                        <option value={"nto"}>New to old</option>
                                        <option value={"otn"}>Old to new</option>
                                        <option value={"hpf"}>High price first</option>
                                        <option value={"lpf"}>Low price first</option>
                                        <option value={"atz"}>A to Z</option>
                                    </select>
                                </div>
                            </div>
                            {searchState.countChoose > 0 ? (
                                <div className='hasCateX'>
                                    <p className='m-0'>Categories <b>{`(${searchState.countChoose})`}</b></p>
                                    <button onClick={() => clearCate()} className='deleteTagX'>x</button>
                                </div>
                            ) : null}
                            <div className='row pb-2'>
                                {Object.values(searchState.searchdata).map(i => {
                                    return (
                                        <NavLink className="product-box p-0 CateColumn col-6 col-md-2" key={i._id} reloadDocument to={`/DetailMenuPage/${i.foodname}/${i.foodcategory}`}>
                                            <div className='coolerStatus' style={{ backgroundColor: i.foodquantity > 0 ? "#239839" : "tomato" }}></div>
                                            <div className="product-item">
                                                <div className="product-item-image">
                                                    <img loading='lazy' src={i.foodimage} alt="" />
                                                    <div className="product-item-image-hover">
                                                    </div>
                                                </div>
                                                <div className="product-item-content">
                                                    <div className="product-item-title text-nowrap">{i.foodname} </div>
                                                    <div className="product-item-category">
                                                        {i.foodcategory}
                                                    </div>
                                                    <div className="product-item-price">
                                                        {VND.format(i.foodprice)}
                                                    </div>
                                                </div>
                                            </div>
                                        </NavLink>
                                    )
                                })}
                            </div>
                            <ReactPaginate
                                breakLabel="..."
                                nextLabel="Next >"
                                onPageChange={handlePageClick}
                                pageRangeDisplayed={5}
                                pageCount={searchState.pageCount}
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
        </Layout>
    );
}
export default SearchSite;