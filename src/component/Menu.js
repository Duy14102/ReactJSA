import $ from 'jquery';
import ItemMenuComponent from './outOfBorder/ItemMenuComponent';
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
    return (
        <div className="container-fluid py-5">
            <div className="container">
                <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                    <h5 className="section-title ff-secondary text-center text-primary fw-normal">Food Menu</h5>
                    <h1 className="mb-5">Most Popular Items</h1>
                </div>
                <div className="tab-className text-center wow fadeInUp" data-wow-delay="0.1s">
                    <ul style={{ flexWrap: "nowrap" }} className="nav nav-pills d-inline-flex justify-content-center border-bottom mb-5">
                        <li className="nav-item">
                            <a className="nav-hex d-flex align-items-center text-start pb-3 active" href="#tab-1">
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
                            <div className="row costumeUI" >
                                <ItemMenuComponent Name={"Meat"} />
                            </div>
                            <div className='text-center pt-4'>
                                <NavLink to="/CategorySite/Meat/nto" reloadDocument className="btn btn-primary">More</NavLink>
                            </div>
                        </div >

                        < div id="tab-2" className="tab-pane p-0">
                            <div className="row costumeUI" >
                                <ItemMenuComponent Name={"Vegetables"} />
                            </div>
                            <div className='text-center pt-4'>
                                <NavLink to="/CategorySite/Vegetables/nto" reloadDocument className="btn btn-primary">More</NavLink>
                            </div>
                        </div >

                        < div id="tab-3" className="tab-pane p-0">
                            <div className="row costumeUI" >
                                <ItemMenuComponent Name={"Drink"} />
                            </div>
                            <div className='text-center pt-4'>
                                <NavLink to="/CategorySite/Drink/nto" reloadDocument className="btn btn-primary">More</NavLink>
                            </div>
                        </div >
                    </div>
                </div>
            </div>
        </div >
    );
}
export default Menu;