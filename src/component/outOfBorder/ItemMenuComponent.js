import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const ItemMenuComponent = ({ Name, start, end }) => {
    const [menu, setMenu] = useState([]);

    useEffect(() => {
        const configuration = {
            method: "get",
            url: "https://eatcom.onrender.com/GetThisMenu",
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
                        <NavLink reloadDocument to={`/DetailMenuPage/${i.foodname}/${i.foodcategory}`} className="d-flex align-items-center" style={{ padding: 2 + "%" }} >
                            <img loading="lazy" className="flex-shrink-0 img-fluid rounded" src={i.foodimage} alt="" />
                            <div className="w-100 d-flex flex-column text-start ps-4">
                                <h6 className="d-flex justify-content-between border-bottom pb-2">
                                    <span className="text-black">{i.foodname}</span>
                                    <span className="text-primary">{VND.format(i.foodprice)}</span>
                                </h6>
                                <small className="fst-italic text-secondary">{i.foodcategory}</small>
                            </div>
                        </NavLink>
                    </div >
                )
            })}
        </>
    )
}
ItemMenuComponent.propTypes = {
    Name: PropTypes.string.isRequired
};
export default ItemMenuComponent;