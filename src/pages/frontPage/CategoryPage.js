import { useParams } from 'react-router-dom';
import { useEffect, useRef, useReducer } from 'react';
import axios from 'axios';
import $ from 'jquery'
import Layout from '../../Layout';
import Header from '../../component/Header';
import Menu from '../../component/frontPage/Menu'

function CategoryPage() {
    let appler = useParams()
    const [cateState, setCateState] = useReducer((prev, next) => ({
        ...prev, ...next
    }), {
        Category: [],
        CategoryRespon: [],
        Count: [],
        pageCount: 6,
        classify: false,
        countChoose: null
    })
    const currentPage = useRef();
    const limit = window.innerWidth > 991 ? 10 : 8
    //Get Detail
    useEffect(() => {
        currentPage.current = 1;
        var countPro = 0
        if (appler.id.includes("Meat")) {
            countPro++
        }
        if (appler.id.includes("Vegetables")) {
            countPro++
        }
        if (appler.id.includes("Drink")) {
            countPro++
        }
        if (appler.id.includes("Main")) {
            countPro++
        }
        setCateState({ countChoose: countPro })
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
            url: "https://eatcom.onrender.com/GetCategoryMenu",
            params: {
                category: appler.id,
                page: currentPage.current,
                limit: limit,
                filter: appler.fil
            }
        };
        axios(configuration)
            .then((result) => {
                setCateState({ Category: result.data.results.allMatch })
                setCateState({ CategoryRespon: result.data.results.result })
                setCateState({ Count: result.data.results.total })
                setCateState({ pageCount: result.data.results.pageCount })
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const Filter = (e) => {
        if (e === "nto") {
            window.location.href = `/CategorySite/${appler?.id}/nto`
        }
        if (e === "otn") {
            window.location.href = `/CategorySite/${appler?.id}/otn`
        }
        if (e === "hpf") {
            window.location.href = `/CategorySite/${appler?.id}/hpf`
        }
        if (e === "lpf") {
            window.location.href = `/CategorySite/${appler?.id}/lpf`
        }
        if (e === "atz") {
            window.location.href = `/CategorySite/${appler?.id}/atz`
        }
    }

    function changeMain(e) {
        if (!e.target.checked) {
            appler.id = appler.id.replace(",Main", "")
        } else if (e.target.checked) {
            appler.id += ",Main"
        }
    }
    function changeMeat(e) {
        if (!e.target.checked) {
            appler.id = appler.id.replace(",Meat", "")
        } else if (e.target.checked) {
            appler.id += ",Meat"
        }
    }
    function changeVege(e) {
        if (!e.target.checked) {
            appler.id = appler.id.replace(",Vegetables", "")
        } else if (e.target.checked) {
            appler.id += ",Vegetables"
        }
    }
    function changeDrink(e) {
        if (!e.target.checked) {
            appler.id = appler.id.replace(",Drink", "")
        } else if (e.target.checked) {
            appler.id += ",Drink"
        }
    }

    function clearCate() {
        appler.id = "Menu"
        window.location.href = `/CategorySite/${appler.id}/nto`
    }

    $(function () {
        $("#select").val(appler.fil);
        $("#mix2up").val(appler?.id);
    })

    function changeCate() {
        window.location.href = `/CategorySite/${appler.id}/nto`
    }

    return (
        <Layout>
            <Header type={"Yes"} />
            <div style={{ background: "#f5f5f5" }}>
                <div className='py-4 container'>
                    <div className='Jkaem'>
                        <div className='ownerOfX'>
                            <button style={cateState.classify ? { backgroundColor: "#fff", fontWeight: "bold" } : null} onClick={() => cateState.classify ? setCateState({ classify: false }) : setCateState({ classify: true })} className='AigButton'>Categories</button>
                            {cateState.classify ? (
                                <div className='CatuRespon'>
                                    <div className='fatherCheckMuck'>
                                        <div className='checkMuck'>
                                            <input onClick={(e) => changeMain(e)} defaultChecked={appler.id.includes("Main") ? "checked" : null} type="checkbox" id="Main" value="Main" />
                                            <label htmlFor="Main" className='text-nowrap'>Main dishes</label>
                                        </div>
                                        <div className='checkMuck'>
                                            <input onClick={(e) => changeMeat(e)} defaultChecked={appler.id.includes("Meat") ? "checked" : null} type="checkbox" id="Main" value="Main" />
                                            <label htmlFor="Main" className='text-nowrap'>Meat</label>
                                        </div>
                                        <div className='checkMuck'>
                                            <input onClick={(e) => changeVege(e)} defaultChecked={appler.id.includes("Vegetables") ? "checked" : null} type="checkbox" id="Main" value="Main" />
                                            <label htmlFor="Main" className='text-nowrap'>Vegetables</label>
                                        </div>
                                        <div className='checkMuck'>
                                            <input onClick={(e) => changeDrink(e)} defaultChecked={appler.id.includes("Drink") ? "checked" : null} type="checkbox" id="Main" value="Main" />
                                            <label htmlFor="Main" className='text-nowrap'>Drink</label>
                                        </div>
                                    </div>
                                    <hr className='m-0' />
                                    <div className='d-flex' style={{ gap: "10px", marginTop: 15 }}>
                                        <button onClick={() => changeCate()} className='greekBas' style={{ backgroundColor: "#239839" }}>Confirm</button>
                                        <button onClick={() => setCateState({ classify: false })} className='greekBas' style={{ backgroundColor: "gray" }}>Cancel</button>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                        <div className='ThirdRow'>
                            <p className='allover3'>Display all {cateState.Count} results</p>
                            <select id='select' onChange={(e) => Filter(e.target.value)} className='FilterDrop'>
                                <option value={"nto"}>New to old</option>
                                <option value={"otn"}>Old to new</option>
                                <option value={"hpf"}>High price first</option>
                                <option value={"lpf"}>Low price first</option>
                                <option value={"atz"}>A to Z</option>
                            </select>
                        </div>
                    </div>
                    {cateState.countChoose > 0 ? (
                        <div className='hasCateX'>
                            <p className='m-0'>Categories <b>{`(${cateState.countChoose})`}</b></p>
                            <button onClick={() => clearCate()} className='deleteTagX'>x</button>
                        </div>
                    ) : null}

                    <Menu dataX={cateState.Category} CategoryRespon={cateState.CategoryRespon} handleX={handlePageClick} pCount={cateState.pageCount} curP={currentPage} />
                </div>
            </div>
        </Layout>
    )
}
export default CategoryPage;