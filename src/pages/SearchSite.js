import '../css/Category.css';
import { NavLink, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../component/Header";
import Footer from "../component/Footer";
import Range from "../component/outOfBorder/Range";
import NotFound from "../component/outOfBorder/NotFound";
import $ from 'jquery';
import axios from "axios";

function SearchSite() {
    let appler = useParams()
    const [Count, setCount] = useState([]);
    const [searchdata, setSearchData] = useState([]);
    useEffect(() => {
        const DetailMenu = () => {
            const configuration = {
                method: "get",
                url: "http://localhost:3000/GetSearch",
                params: {
                    foodSearch: appler.id
                }
            };
            axios(configuration)
                .then((result) => {
                    setSearchData(result.data.data);
                    setCount(result.data.data.length)
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        DetailMenu();
    }, [appler.id])

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

    $(function () {
        $("#select2").val(appler.fil);
    })

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
                        <h5>Filter by price</h5>
                        <hr style={{ width: 15 + "%", height: 3 + "px" }} />
                        <Range min={0} max={1000} onChange={({ min, max }) => ({})} />
                        <button className='btn btn-secondary mt-2'>Filter</button>
                        <div className='mt-4 nOthing'>
                            <h5>Product Category</h5>
                            <hr style={{ width: 15 + "%", height: 3 + "px" }} />
                            <NavLink reloadDocument to={`/CategorySite/Meat/${appler.fil}`} activeclassname='active' className="text-black"><p>Meat</p></NavLink>
                            <NavLink reloadDocument to={`/CategorySite/Drink/${appler.fil}`} className="text-black" ><p>Drink</p></NavLink>
                            <NavLink reloadDocument to={`/CategorySite/Vegetables/${appler.fil}`} className="text-black"><p>Vegetables</p></NavLink>
                        </div>
                    </div>
                    <div className="row SecondRow">
                        {Object.values(searchdata).map(i => {
                            return (
                                <div className="product-box column p-0 col-4" key={i._id}>
                                    <NavLink reloadDocument to={`/DetailMenuPage/${i._id}`} className="product-item">
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
                                                {i.foodprice}
                                            </div>
                                        </div>
                                    </NavLink>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
export default SearchSite;