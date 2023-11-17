import $ from 'jquery';
import ItemMenuComponent from './outOfBorder/ItemMenuComponent';
import { NavLink } from 'react-router-dom';
import Hammer from 'hammerjs'
import { Fragment, useEffect, useState } from 'react';
import axios from 'axios';

function Menu() {
    const [Load1, setLoad1] = useState(false)
    const [Load2, setLoad2] = useState(false)
    const [Load3, setLoad3] = useState(false)
    const [menu, setMenu] = useState([])
    const [kakadu, setKakadu] = useState()
    const [spacekaka, setSpacekaka] = useState()
    useEffect(() => {
        const configuration = {
            method: "get",
            url: "http://localhost:3000/GetTheMenuWow",
        }
        axios(configuration)
            .then((res) => {
                setMenu(res.data)
            }).catch((err) => {
                console.log(err);
            })
    }, [])

    useEffect(() => {
        Object.values(menu).map((i) => {
            i.image?.map((a) => {
                if (a.name === "menucover") {
                    setKakadu({
                        "background": `url(${a.url})`,
                        "backgroundSize": "100% 100%",
                        "backgroundRepeat": "no-repeat",
                        "backgroundPosition": "center center"
                    })
                }
                if (a.name === "menupage") {
                    setSpacekaka({
                        "background": `url(${a.url})`,
                        "backgroundSize": "100% 100%",
                        "backgroundRepeat": "no-repeat",
                        "backgroundPosition": "center center"
                    })
                }
                return null
            })
            return null
        })
    }, [menu])

    useEffect(() => {
        const elem = document.getElementById("book")
        const hammer = new Hammer(elem)

        $(".front").on('click', nextPage)
        $(".back").on('click', prevPage)

        $('.front .upPerTown').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
        })

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
            .removeClass('d-none')
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
        if ($('section.paged:nth-child(2)').hasClass('activet') === true) {
            setLoad1(true)
        }
        if ($('section.paged:nth-child(3)').hasClass('activet') === true) {
            setLoad2(true)
        }
        if ($('section.paged:nth-child(4)').hasClass('activet') === true) {
            setLoad3(true)
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
                                <i className="fi fi-sr-drumstick-bite text-primary foodquit"></i>
                                <div className='ps-3'>
                                    <small className="text-muted">Popular</small>
                                    <h6 className="mt-n1 mb-0 text-white">Meat</h6>
                                </div>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink reloadDocument className="nav-hex d-flex align-items-center text-start mx-3 pb-3" to="/CategorySite/Vegetables/nto">
                                <i className="fi fi-sr-carrot text-primary foodquit"></i>
                                <div className="ps-3">
                                    <small className="text-muted">Special</small>
                                    <h6 className="mt-n1 mb-0 text-white">Vegetables</h6>
                                </div>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink reloadDocument className="nav-hex d-flex align-items-center text-start mx-3 me-0 pb-3" to="/CategorySite/Drink/nto">
                                <i className="fi fi-sr-mug-hot-alt text-primary foodquit"></i>
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
                                <div className="front" style={kakadu}>
                                </div>
                                <div className="back p-5" style={spacekaka}>
                                    <h4 className='text-center mt-3'>Foreword</h4>
                                    <div className='text-start'>
                                        {Object.values(menu).map((i) => {
                                            return (
                                                <Fragment key={i._id}>
                                                    <p className='pt-3'><b>1. </b> {i.word.up}</p>
                                                    <p className='pt-2'><b>2. </b> {i.word.middle}</p>
                                                    <p className='pt-2'><b>3. </b> {i.word.down}</p>
                                                </Fragment>
                                            )
                                        })}
                                    </div>
                                </div>
                            </section>

                            <section className="paged d-none">
                                <div className="front p-5" style={spacekaka}>
                                    <h4 className='text-center mt-3'>Meat</h4>
                                    {Load1 ? (
                                        <ItemMenuComponent Name='Meat' start={0} end={4} />
                                    ) : null}
                                </div>
                                <div className="back p-5" style={spacekaka}>
                                    <h4 className='text-center mt-3'>Meat</h4>
                                    {Load1 ? (
                                        <ItemMenuComponent Name='Meat' start={4} end={8} />
                                    ) : null}
                                    <div className='text-center'>
                                        <NavLink reloadDocument to="/CategorySite/Meat/nto" className="btn hahaPri btn-primary">All</NavLink>
                                    </div>
                                </div>
                            </section>

                            <section className="paged d-none">
                                <div className="front p-5" style={spacekaka}>
                                    <h4 className='text-center mt-3'>Vegetables</h4>
                                    {Load2 ? (
                                        <ItemMenuComponent Name='Vegetables' start={0} end={4} />
                                    ) : null}
                                </div>
                                <div className="back p-5" style={spacekaka}>
                                    <h4 className='text-center mt-3'>Vegetables</h4>
                                    {Load2 ? (
                                        <ItemMenuComponent Name='Vegetables' start={4} end={8} />
                                    ) : null}
                                    <div className='text-center'>
                                        <NavLink reloadDocument to="/CategorySite/Vegetables/nto" className="btn hahaPri btn-primary">All</NavLink>
                                    </div>
                                </div>
                            </section>

                            <section className="paged d-none">
                                <div className="front p-5" style={spacekaka}>
                                    <h4 className='text-center mt-3'>Drink</h4>
                                    {Load3 ? (
                                        <ItemMenuComponent Name='Drink' start={0} end={4} />
                                    ) : null}
                                </div>
                                <div className="back p-5" style={spacekaka}>
                                    <h4 className='text-center mt-3'>Drink</h4>
                                    {Load3 ? (
                                        <ItemMenuComponent Name='Drink' start={4} end={8} />
                                    ) : null}
                                    <div className='text-center'>
                                        <NavLink reloadDocument to="/CategorySite/Drink/nto" className="btn hahaPri btn-primary">All</NavLink>
                                    </div>
                                </div>
                            </section>

                            <section className="paged d-none">
                                <div className="front" style={spacekaka}>
                                </div>
                                <div className="back" style={kakadu}>
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