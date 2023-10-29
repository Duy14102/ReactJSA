import $ from 'jquery';
import ItemMenuComponent from './outOfBorder/ItemMenuComponent';
import { NavLink } from 'react-router-dom';
import Hammer from 'hammerjs'
import { useEffect } from 'react';

function Menu() {
    useEffect(() => {
        const elem = document.getElementById("book")
        const hammer = new Hammer(elem)
        $('#book')
            .on('click', '.activet', nextPage)
            .on('click', '.flipped', prevPage);

        hammer.on("swipeleft", nextPage);
        hammer.on("swiperight", prevPage);
    }, [])

    function prevPage() {
        $('.flipped')
            .last()
            .removeClass('flipped')
            .addClass('activet')
            .siblings('.paged')
            .removeClass('activet')

        $('#scene').animate({}, function () {
            $(this).css({ 'margin-left': '50%' })
        });

        if ($('section.paged:nth-child(1)').hasClass('activet') === true) {
            $('#scene').animate({}, function () {
                $(this).css({ "margin-left": 'auto' })
            });
        }
    }

    function nextPage() {
        $('.activet')
            .removeClass('activet')
            .addClass('flipped')
            .next('.paged')
            .addClass('activet')
            .siblings()

        $('#scene').animate({
            'margin-left': '50%'
        });

        if ($('.right-set').hasClass('flipped') === true) {
            $('#scene').animate({
                'margin-left': '65%'
            });
        }
    }
    return (
        <div className="container-fluid py-5">
            <div className="container">
                <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                    <h5 className="section-title ff-secondary text-center text-primary fw-normal">Food Menu</h5>
                </div>
                <div className="tab-className text-center wow fadeInUp" data-wow-delay="0.1s">
                    <ul style={{ flexWrap: "nowrap" }} className="nav nav-pills perKnow">
                        <li className="nav-item">
                            <NavLink reloadDocument className="nav-hex d-flex align-items-center text-start pb-3" to="/CategorySite/Meat/nto">
                                <i className="fa fa-drumstick-bite fa-2x text-primary"></i>
                                <div className='ps-3'>
                                    <small className="text-muted">Popular</small>
                                    <h6 className="mt-n1 mb-0 text-white">Meat</h6>
                                </div>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink reloadDocument className="nav-hex d-flex align-items-center text-start mx-3 pb-3" to="/CategorySite/Vegetables/nto">
                                <i className="fa fa-carrot fa-2x text-primary"></i>
                                <div className="ps-3">
                                    <small className="text-muted">Special</small>
                                    <h6 className="mt-n1 mb-0 text-white">Vegetables</h6>
                                </div>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink reloadDocument className="nav-hex d-flex align-items-center text-start mx-3 me-0 pb-3" to="/CategorySite/Drink/nto">
                                <i className="fa fa-bottle-water fa-2x text-primary"></i>
                                <div className="ps-3">
                                    <small className="text-muted">Lovely</small>
                                    <h6 className="mt-n1 mb-0 text-white">Drink</h6>
                                </div>
                            </NavLink>
                        </li>
                    </ul>
                    <div className="scene thhuhu" id="scene">
                        <article id="book">
                            <section className="paged activet">
                                <div className="front kakaDu">
                                </div>
                                <div className="back spaceKaka p-5">
                                    <h4 className='text-center'>Foreword</h4>
                                    <p className='pt-3'><b>1. </b> Hello and thank you for using our service</p>
                                    <p className='pt-2'><b>2. </b> This is a menu containing a number of dishes that you can refer to before enjoying</p>
                                    <p className='pt-2'><b>3. </b> We hope you have a great experience with our services. Have a nice day and enjoy the food</p>
                                </div>
                            </section>

                            <section className="paged">
                                <div className="front spaceKaka p-5">
                                    <h4 className='text-center'>Meat</h4>
                                    <ItemMenuComponent Name='Meat' start={0} end={4} />
                                </div>
                                <div className="back spaceKaka p-5">
                                    <h4 className='text-center'>Meat</h4>
                                    <ItemMenuComponent Name='Meat' start={4} end={8} />
                                    <div className='text-center'>
                                        <NavLink reloadDocument to="/CategorySite/Meat/nto" className="btn btn-primary">All</NavLink>
                                    </div>
                                </div>
                            </section>

                            <section className="paged">
                                <div className="front spaceKaka p-5">
                                    <h4 className='text-center'>Vegetables</h4>
                                    <ItemMenuComponent Name='Vegetables' start={0} end={4} />
                                </div>
                                <div className="back spaceKaka p-5">
                                    <h4 className='text-center'>Vegetables</h4>
                                    <ItemMenuComponent Name='Vegetables' start={4} end={8} />
                                    <div className='text-center'>
                                        <NavLink reloadDocument to="/CategorySite/Vegetables/nto" className="btn btn-primary">All</NavLink>
                                    </div>
                                </div>
                            </section>

                            <section className="paged">
                                <div className="front spaceKaka p-5">
                                    <h4 className='text-center'>Drink</h4>
                                    <ItemMenuComponent Name='Drink' start={0} end={4} />
                                </div>
                                <div className="back spaceKaka p-5">
                                    <h4 className='text-center'>Drink</h4>
                                    <ItemMenuComponent Name='Drink' start={4} end={8} />
                                    <div className='text-center'>
                                        <NavLink reloadDocument to="/CategorySite/Drink/nto" className="btn btn-primary">All</NavLink>
                                    </div>
                                </div>
                            </section>

                            <section className="paged">
                                <div className="front spaceKaka">

                                </div>
                                <div className="back kakaDu">

                                </div>
                            </section>
                        </article>
                    </div>
                </div>
            </div>
        </div >
    );
}
export default Menu;