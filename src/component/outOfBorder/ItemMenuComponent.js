import PropTypes from "prop-types";
import { Fragment, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const ItemMenuComponent = ({ Name }) => {
    const [menu, setMenu] = useState([]);
    useEffect(() => {
        fetch("http://localhost:3000/GetThisMenu", {
            method: "get",
        }).then((res) => res.json()).then((menu) => {
            setMenu(menu.data);
        })
    }, [])

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    return (
        <>
            {menu.filter(menu => menu.foodcategory === Name).slice(0, 8).map((i) => {
                return (
                    <Fragment key={i._id}>
                        <div className="col-lg-6 p-2">
                            <NavLink reloadDocument to={`/DetailMenuPage/${i._id}`}>
                                <div className="hexThis d-flex align-items-center" style={{ padding: 2 + "%" }}>
                                    <img loading="lazy" className="flex-shrink-0 img-fluid rounded" src={i.foodimage} alt="" style={{ width: 80 + "px", height: 80 + "px" }} />
                                    <div className="w-100 d-flex flex-column text-start ps-4">
                                        <h5 className="d-flex justify-content-between border-bottom pb-2">
                                            <span>{i.foodname}</span>
                                            <span className="text-primary">{VND.format(i.foodprice)}</span>
                                        </h5>
                                        <div className='d-flex justify-content-between'>
                                            <small className="fst-italic text-secondary">{i.fooddescription}</small>
                                            <i className="fa fa-cart-shopping text-primary"></i>
                                        </div>
                                    </div>
                                </div>
                            </NavLink>
                        </div>
                    </Fragment>
                )
            })}
        </>
    )
}
ItemMenuComponent.propTypes = {
    Name: PropTypes.string.isRequired
};
export default ItemMenuComponent;