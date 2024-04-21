import { NavLink, useParams } from "react-router-dom";
import { useEffect, useRef, useReducer } from "react";
import NotFound from "../../component/outOfBorder/NotFound";
import $ from 'jquery';
import axios from "axios";
import ReactPaginate from 'react-paginate';
import Layout from '../../Layout';
import Header from "../../component/Header";

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

    useEffect(() => {
        if (searchState.callAlert) {
            setTimeout(() => {
                setSearchState({ callAlert: false })
            }, 2000)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchState.callAlert])

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
            {searchState.callAlert ? (
                <div className="danguru">
                    <div className='alertNow'>
                        <div className='kikuny'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" /></svg>
                        </div>
                        <div className='d-flex' style={{ flexDirection: "column", marginRight: 25 }}>
                            <p className='m-0'><b>Success</b></p>
                            <p className='m-0'>Cart have new item!</p>
                        </div>
                        <button onClick={() => setSearchState({ callAlert: false })} className='closeAlertKikuny'></button>
                    </div>
                </div>
            ) : null}
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
                                        <div className="product-box p-0 CateColumn col-6 col-md-4" key={i._id}>
                                            <div className="product-item">
                                                <NavLink reloadDocument to={`/DetailMenuPage/${i.foodname}/${i.foodcategory}`}>
                                                    <div className="product-item-image">
                                                        <img loading='lazy' src={i.foodimage} alt="" />
                                                        <div className="product-item-image-hover">
                                                        </div>
                                                    </div>
                                                    <div className="product-item-content" style={{ position: "relative" }}>
                                                        <div className="product-item-title text-nowrap">{i.foodname} </div>
                                                        <div className="product-item-category">{i.fooddescription} </div>
                                                        <div className="py-1">
                                                            <div className="product-item-price">
                                                                {VND.format(i.foodprice)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </NavLink>
                                                <div style={{ position: "absolute", bottom: 10, right: 10 }}>
                                                    <button onClick={() => addToCart(i.foodname, 1)} className="btnSonCallingUpperT">
                                                        <svg className="sonCallingUpperT" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" /></svg></button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <ReactPaginate
                                breakLabel="..."
                                nextLabel=">"
                                onPageChange={handlePageClick}
                                pageRangeDisplayed={5}
                                pageCount={searchState.pageCount}
                                previousLabel="<"
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