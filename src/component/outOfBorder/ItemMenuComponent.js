import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const ItemMenuComponent = ({ Name, start, end }) => {
    const [menu, setMenu] = useState([]);

    useEffect(() => {
        const configuration = {
            method: "get",
            url: "http://localhost:3000/GetThisMenu",
            params: {
                Name: Name,
                start: start,
                end: end
            }
        }
        axios(configuration)
            .then((res) => {
                setMenu(res.data.data)
            }).catch((err) => {
                console.log(err);
            })
    }, [Name, start, end])

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    return (
        <>
            {Object.values(menu).map((i) => {
                return (
                    <div className="col-lg-12 p-3 upPerTown" key={i._id}>
                        <div className="d-flex align-items-center" style={{ padding: 2 + "%" }} >
                            <NavLink reloadDocument to={`/DetailMenuPage/${i.foodname}/${i.foodcategory}`}>
                                <img loading="lazy" className="flex-shrink-0 img-fluid rounded" src={i.foodimage} alt="" style={{ width: 100 + "px", height: 70 + "px" }} />
                            </NavLink>
                            <div className="w-100 d-flex flex-column text-start ps-4">
                                <h5 className="d-flex justify-content-between border-bottom pb-2">
                                    <NavLink className="text-black" reloadDocument to={`/DetailMenuPage/${i.foodname}/${i.foodcategory}`}>{i.foodname}</NavLink>
                                    <span className="text-primary">{VND.format(i.foodprice)}</span>
                                </h5>
                                <div className='d-flex justify-content-between'>
                                    <small className="fst-italic text-secondary">{i.foodcategory}</small>
                                    <i className="fa fa-cart-shopping text-primary"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </>
    )
}
ItemMenuComponent.propTypes = {
    Name: PropTypes.string.isRequired
};
export default ItemMenuComponent;