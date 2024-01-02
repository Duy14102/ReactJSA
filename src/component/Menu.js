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
            url: "https://eatcom.onrender.com/GetTheMenuWow",
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
                if (a.name === "lsneuszzbne2v2iyecaj") {
                    setKakadu({
                        "background": `url(${a.url})`,
                        "backgroundSize": "100% 100%",
                        "backgroundRepeat": "no-repeat",
                        "backgroundPosition": "center center"
                    })
                }
                if (a.name === "lwur9bwvniiygtyu6daf") {
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
                                <svg style={{ fill: "#FEA116", fontSize: "x-large" }} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M160 265.2c0 8.5-3.4 16.6-9.4 22.6l-26.8 26.8c-12.3 12.3-32.5 11.4-49.4 7.2C69.8 320.6 65 320 60 320c-33.1 0-60 26.9-60 60s26.9 60 60 60c6.3 0 12 5.7 12 12c0 33.1 26.9 60 60 60s60-26.9 60-60c0-5-.6-9.8-1.8-14.5c-4.2-16.9-5.2-37.1 7.2-49.4l26.8-26.8c6-6 14.1-9.4 22.6-9.4H336c6.3 0 12.4-.3 18.5-1c11.9-1.2 16.4-15.5 10.8-26c-8.5-15.8-13.3-33.8-13.3-53c0-61.9 50.1-112 112-112c8 0 15.7 .8 23.2 2.4c11.7 2.5 24.1-5.9 22-17.6C494.5 62.5 422.5 0 336 0C238.8 0 160 78.8 160 176v89.2z" /></svg>
                                <div className='ps-3'>
                                    <small className="text-muted">Cate</small>
                                    <h6 className="mt-n1 mb-0 text-white">Meat</h6>
                                </div>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink reloadDocument className="nav-hex d-flex align-items-center text-start mx-3 pb-3" to="/CategorySite/Vegetables/nto">
                                <svg style={{ fill: "#FEA116", fontSize: "x-large" }} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M346.7 6C337.6 17 320 42.3 320 72c0 40 15.3 55.3 40 80s40 40 80 40c29.7 0 55-17.6 66-26.7c4-3.3 6-8.2 6-13.3s-2-10-6-13.2c-11.4-9.1-38.3-26.8-74-26.8c-32 0-40 8-40 8s8-8 8-40c0-35.7-17.7-62.6-26.8-74C370 2 365.1 0 360 0s-10 2-13.3 6zM244.6 136c-40 0-77.1 18.1-101.7 48.2l60.5 60.5c6.2 6.2 6.2 16.4 0 22.6s-16.4 6.2-22.6 0l-55.3-55.3 0 .1L2.2 477.9C-2 487-.1 497.8 7 505s17.9 9 27.1 4.8l134.7-62.4-52.1-52.1c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0L199.7 433l100.2-46.4c46.4-21.5 76.2-68 76.2-119.2C376 194.8 317.2 136 244.6 136z" /></svg>
                                <div className="ps-3">
                                    <small className="text-muted">Cate</small>
                                    <h6 className="mt-n1 mb-0 text-white">Vegetables</h6>
                                </div>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink reloadDocument className="nav-hex d-flex align-items-center text-start mx-3 me-0 pb-3" to="/CategorySite/Drink/nto">
                                <svg style={{ fill: "#FEA116", fontSize: "x-large" }} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512"><path d="M96 64c0-17.7 14.3-32 32-32H448h64c70.7 0 128 57.3 128 128s-57.3 128-128 128H480c0 53-43 96-96 96H192c-53 0-96-43-96-96V64zM480 224h32c35.3 0 64-28.7 64-64s-28.7-64-64-64H480V224zM32 416H544c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32z" /></svg>
                                <div className="ps-3">
                                    <small className="text-muted">Cate</small>
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