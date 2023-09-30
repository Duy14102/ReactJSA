import PropTypes from "prop-types";
import { useCallback } from "react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const ItemMenuComponent = ({ Name }) => {
    const [menu, setMenu] = useState([]);

    const fetchData = useCallback(() => {
        fetch(`http://localhost:3000/GetThisMenu?Name=${Name}`, {
            method: "get",
        }).then((res) => res.json()).then((menu) => {
            console.log(menu.data)
            setMenu(menu.data);
        })
    }, [Name])
    
    useEffect(() => {
        fetchData()
    }, [fetchData])

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    return (
        <>
            {menu.slice(0, 8).map((i) => {
                return (
                    <div className="col-lg-6 p-2" key={i._id}>
                        <NavLink reloadDocument to={`/DetailMenuPage/${i.foodname}/${i.foodcategory}`}>
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
                )
            })}
        </>
    )
}
ItemMenuComponent.propTypes = {
    Name: PropTypes.string.isRequired
};
export default ItemMenuComponent;