import $ from 'jquery';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
function Menu() {
    $(function () {
        // Variables
        const $tabLink = $('.nav-item .nav-hex');
        const $tabBody = $('.tab-content .tab-pane');
        let timerOpacity;

        // Toggle Class
        const init = () => {
            // Menu Click
            $tabLink.off('click').on('click', function (e) {
                // Prevent Default
                e.preventDefault();
                e.stopPropagation();

                // Clear Timers
                window.clearTimeout(timerOpacity);

                // Toggle Class Logic
                // Remove Active Classes
                $tabLink.removeClass('active ');
                $tabBody.removeClass('active ');
                $tabBody.removeClass('activeThis');

                // Add Active Classes
                $(this).addClass('active');
                $($(this).attr('href')).addClass('active');

                // Opacity Transition Class
                timerOpacity = setTimeout(() => {
                    $($(this).attr('href')).addClass('activeThis');
                }, 50);
            });
        };

        // Document Ready
        $(function () {
            init();
        });
    });
    const [menu, setMenu] = useState([]);
    useEffect(() => {
        fetch("http://localhost:3000/GetThisMenu", {
            method: "get",
        }).then((res) => res.json()).then((menu) => {
            setMenu(menu.data);
        })
    }, [])
    return (
        <div className="container-fluid py-5">
            <div className="container">
                <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                    <h5 className="section-title ff-secondary text-center text-primary fw-normal">Food Menu</h5>
                    <h1 className="mb-5">Most Popular Items</h1>
                </div>
                <div className="tab-className text-center wow fadeInUp" data-wow-delay="0.1s">
                    <ul className="nav nav-pills d-inline-flex justify-content-center border-bottom mb-5">
                        <li className="nav-item">
                            <a className="nav-hex d-flex align-items-center text-start mx-3 pb-3 active" href="#tab-1">
                                <i className="fa fa-drumstick-bite fa-2x text-primary"></i>
                                <div className='ps-3'>
                                    <small className="text-body">Popular</small>
                                    <h6 className="mt-n1 mb-0">Meat</h6>
                                </div>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-hex d-flex align-items-center text-start mx-3 pb-3" href="#tab-2">
                                <i className="fa fa-carrot fa-2x text-primary"></i>
                                <div className="ps-3">
                                    <small className="text-body">Special</small>
                                    <h6 className="mt-n1 mb-0">Vegetables</h6>
                                </div>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-hex d-flex align-items-center text-start mx-3 me-0 pb-3" href="#tab-3">
                                <i className="fa fa-bottle-water fa-2x text-primary"></i>
                                <div className="ps-3">
                                    <small className="text-body">Lovely</small>
                                    <h6 className="mt-n1 mb-0">Drink</h6>
                                </div>
                            </a>
                        </li>
                    </ul>
                    <div className="tab-content">
                        < div id="tab-1" className="tab-pane p-0 active activeThis">
                            <div className="row d-flex" >
                                {menu.map((i, index) => {
                                    if (index > 9) {
                                        return null;
                                    }
                                    return (
                                        <>
                                            {i.foodcategory === "Meat" ? (
                                                <div className="col-lg-6 p-2">
                                                    <NavLink to="/DetailMenuPage" state={{ id: i._id }}>
                                                        <div className="hexThis d-flex align-items-center" style={{ padding: 2 + "%" }}>
                                                            <img className="flex-shrink-0 img-fluid rounded" src={i.foodimage} alt="" style={{ width: 80 + "px", height: 80 + "px" }} />
                                                            <div className="w-100 d-flex flex-column text-start ps-4">
                                                                <h5 className="d-flex justify-content-between border-bottom pb-2">
                                                                    <span>{i.foodname}</span>
                                                                    <span className="text-primary">{i.foodprice} đ</span>
                                                                </h5>
                                                                <div className='d-flex justify-content-between'>
                                                                    <small className="fst-italic text-secondary">{i.fooddescription}</small>
                                                                    <i className="fa fa-cart-shopping text-primary"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </NavLink>
                                                </div>
                                            ) : null}
                                        </>
                                    )
                                })}
                            </div>
                        </div >

                        < div id="tab-2" className="tab-pane p-0">
                            <div className="row d-flex" >
                                {menu.map((i, index) => {
                                    if (index > 9) {
                                        return null;
                                    }
                                    return (
                                        <>
                                            {i.foodcategory === "Vegetables" ? (
                                                <div className="col-lg-6 p-2">
                                                    <NavLink to="/DetailMenuPage" state={{ id: i._id }}>
                                                        <div className="hexThis d-flex align-items-center" style={{ padding: 2 + "%" }}>
                                                            <img className="flex-shrink-0 img-fluid rounded" src={i.foodimage} alt="" style={{ width: 80 + "px", height: 80 + "px" }} />
                                                            <div className="w-100 d-flex flex-column text-start ps-4">
                                                                <h5 className="d-flex justify-content-between border-bottom pb-2">
                                                                    <span>{i.foodname}</span>
                                                                    <span className="text-primary">{i.foodprice} đ</span>
                                                                </h5>
                                                                <div className='d-flex justify-content-between'>
                                                                    <small className="fst-italic text-secondary">{i.fooddescription}</small>
                                                                    <i className="fa fa-cart-shopping text-primary"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </NavLink>
                                                </div>
                                            ) : null}
                                        </>
                                    )
                                })}
                            </div>
                        </div >

                        < div id="tab-3" className="tab-pane p-0">
                            <div className="row d-flex" >
                                {menu.map((i, index) => {
                                    if (index > 9) {
                                        return null;
                                    }
                                    return (
                                        <>
                                            {i.foodcategory === "Drink" ? (
                                                <div className="col-lg-6 p-2">
                                                    <NavLink to="/DetailMenuPage" state={{ id: i._id }}>
                                                        <div className="hexThis d-flex align-items-center" style={{ padding: 2 + "%" }}>
                                                            <img className="flex-shrink-0 img-fluid rounded" src={i.foodimage} alt="" style={{ width: 80 + "px", height: 80 + "px" }} />
                                                            <div className="w-100 d-flex flex-column text-start ps-4">
                                                                <h5 className="d-flex justify-content-between border-bottom pb-2">
                                                                    <span>{i.foodname}</span>
                                                                    <span className="text-primary">{i.foodprice} đ</span>
                                                                </h5>
                                                                <div className='d-flex justify-content-between'>
                                                                    <small className="fst-italic text-secondary">{i.fooddescription}</small>
                                                                    <i className="fa fa-cart-shopping text-primary"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </NavLink>
                                                </div>
                                            ) : null}
                                        </>
                                    )
                                })}
                            </div>
                        </div >
                    </div>
                </div>
            </div>
        </div >
    );
}
export default Menu;