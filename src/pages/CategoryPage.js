import '../css/Category.css';
import Footer from '../component/Footer';
import Header from '../component/Header';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import NotFound from '../component/NotFound';
import axios from 'axios';

function CategoryPage() {
    let Location = useLocation();
    const [Category, setCategory] = useState([]);
    const [Count, setCount] = useState([]);
    //Get Detail
    useEffect(() => {
        const DetailMenu = () => {
            const configuration = {
                method: "get",
                url: "http://localhost:3000/GetCategoryMenu",
                params: {
                    category: Location.state.category
                }
            };
            axios(configuration)
                .then((result) => {
                    setCategory(result.data.data);
                    setCount(result.data.data.length)
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        DetailMenu();
    }, [Location.state.category])

    if (!Location.state) {
        return NotFound();
    }
    return (
        <>
            <Header />
            <div className="grid-container">
                <div className='container'>
                    <div className='d-flex justify-content-between align-items-center pt-3'>
                        <p>Trang Chủ / {Location.state.category}</p>
                        <div>
                            <h1>{Count}</h1>
                        </div>
                    </div>
                    <div className="grid-x grid-margin-x small-up-1 medium-up-2 large-up-4 grid-x-wrapper">
                        {Object.values(Category).map(i => {
                            return (
                                <div className="product-box column p-0" key={i._id}>
                                    <a href="/#" className="product-item">
                                        <div className="product-item-image">
                                            <img src={i.foodimage} alt="" />
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
                                    </a>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
export default CategoryPage;