import axios from "axios"
import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"

function BestSeller() {
    const [data, setData] = useState()
    const [callAlert, setCallAlert] = useState(false)

    useEffect(() => {
        const called = () => {
            const configuration = {
                method: "get",
                url: "https://eatcom.onrender.com/GetHomeMenu"
            }
            axios(configuration)
                .then((res) => {
                    setData(res.data.data)
                }).catch((err) => {
                    console.log(err);
                })
        }
        called()
    }, [])

    useEffect(() => {
        if (callAlert) {
            setTimeout(() => {
                setCallAlert(false)
            }, 2000)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callAlert])

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    function addToCart(name, quantity) {
        var stored = JSON.parse(localStorage.getItem("cart"));
        if (!stored) {
            var students = [];
            var student1 = { name: name, quantity: quantity };
            students.push(student1);
            localStorage.setItem("cart", JSON.stringify(students));
            setCallAlert(true)
        } else {
            var sameItem = JSON.parse(localStorage.getItem("cart")) || [];
            for (var i = 0; i < sameItem.length; i++) {
                if (name === sameItem[i].name) {
                    sameItem[i].quantity += quantity;
                    localStorage.setItem('cart', JSON.stringify(sameItem))
                    setCallAlert(true)
                } else if (i === sameItem.length - 1) {
                    var stored2 = JSON.parse(localStorage.getItem("cart"));
                    var student2 = { name: name, quantity: quantity };
                    stored2.push(student2);
                    localStorage.setItem("cart", JSON.stringify(stored2));
                    setCallAlert(true)
                }
            }
        }
    }

    return (
        <div className="bg-white py-5">
            {callAlert ? (
                <div className="danguru">
                    <div className='alertNow'>
                        <div className='kikuny'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" /></svg>
                        </div>
                        <div className='d-flex' style={{ flexDirection: "column", marginRight: 25 }}>
                            <p className='m-0'><b>Success</b></p>
                            <p className='m-0'>Cart have new item!</p>
                        </div>
                        <button onClick={() => setCallAlert(false)} className='closeAlertKikuny'></button>
                    </div>
                </div>
            ) : null}
            <div className="container">
                <div className="text-center">
                    <h5 className="section-title ff-secondary text-center text-primary fw-normal">Best selling</h5>
                    <h1>Today's best</h1>
                </div>
                <div className="row">
                    {data?.map((i) => {
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
                <div className="text-center mt-2">
                    <NavLink reloadDocument to="/CategorySite/Menu/nto" className="viewAllBestPro">
                        See all items ➜
                    </NavLink>
                </div>
            </div>
        </div>
    )
}

export default BestSeller