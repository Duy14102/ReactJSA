import $ from 'jquery';
import ItemMenuComponent from './outOfBorder/ItemMenuComponent';
import { NavLink } from 'react-router-dom';
import Hammer from 'hammerjs'
import { Fragment, useEffect, useRef, useReducer } from 'react';
import axios from 'axios';
import socketIOClient from "socket.io-client";
import ReactPaginate from 'react-paginate';

function Menu({ dataX, CategoryRespon, handleX, pCount, curP }) {
    const [menuState, setMenuState] = useReducer((prev, next) => ({
        ...prev, ...next
    }), {
        Load1: false,
        Load2: false,
        Load3: false,
        menu: [],
        kakadu: null,
        spacekaka: null,
        callAlert: false
    })
    const socketRef = useRef();

    const called = () => {
        const configuration = {
            method: "get",
            url: "https://eatcom.onrender.com/GetTheMenuWow",
        }
        axios(configuration)
            .then((res) => {
                setMenuState({ menu: res.data })
            }).catch((err) => {
                console.log(err);
            })
    }
    useEffect(() => {
        called()
        socketRef.current = socketIOClient.connect("https://eatcom.onrender.com")

        socketRef.current.on('ChangeHeroImageSuccess', dataGot => {
            if (dataGot.title === "Menu") {
                called()
            }
        })

        socketRef.current.on('ChangeWordUpSuccess', dataGot => {
            if (dataGot.title === "Menu") {
                called()
            }
        })

        socketRef.current.on('ChangeWordMiddleSuccess', dataGot => {
            if (dataGot.title === "Menu") {
                called()
            }
        })

        socketRef.current.on('ChangeWordDownSuccess', dataGot => {
            if (dataGot.title === "Menu") {
                called()
            }
        })

        return () => {
            socketRef.current.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (menuState.callAlert) {
            setTimeout(() => {
                setMenuState({ callAlert: false })
            }, 2000)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [menuState.callAlert])

    useEffect(() => {
        Object.values(menuState.menu).map((i) => {
            i.image?.map((a) => {
                if (a.name === "lsneuszzbne2v2iyecaj") {
                    const Hook = {
                        "background": `url(${a.url})`,
                        "backgroundSize": "100% 100%",
                        "backgroundRepeat": "no-repeat",
                        "backgroundPosition": "center center",
                    }
                    setMenuState({ kakadu: Hook })
                }
                if (a.name === "lwur9bwvniiygtyu6daf") {
                    const Hook = {
                        "background": `url(${a.url})`,
                        "backgroundSize": "100% 100%",
                        "backgroundRepeat": "no-repeat",
                        "backgroundPosition": "center center",
                    }
                    setMenuState({ spacekaka: Hook })
                }
                return null
            })
            return null
        })
    }, [menuState.menu])

    useEffect(() => {
        const elem = document.getElementById("book")
        const hammer = new Hammer(elem)

        $(".moveToNextPage").on('click', nextPage)
        $(".moveToPrevPage").on('click', prevPage)

        $('.front .upPerTown').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
        })

        hammer.on("swipeleft", nextPage);
        hammer.on("swiperight", prevPage);

        setTimeout(() => {
            document.getElementById("firstFatherFirst").click()
        }, 520);
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
    }

    const pageButton = (count) => {
        return Array.from(Array(count), (e, i) => {
            return (
                <section key={i} className="paged d-none">
                    <div className="front" style={menuState.spacekaka}>
                        <div className='p-5' style={{ position: "relative", width: "100%", height: "100%" }}>
                            <div className='moveToNextPage'></div>
                            <div className='mt-5'>
                                <ItemMenuComponent data={dataX} start={(5 * i) * 2} end={(5 * (i + 1)) * 2 - 5} setMainState={setMenuState} />
                            </div>
                        </div>
                    </div>
                    <div className="back" style={menuState.spacekaka}>
                        <div className='p-5' style={{ position: "relative", width: "100%", height: "100%" }}>
                            <div className='moveToPrevPage'></div>
                            <div className='mt-5'>
                                <ItemMenuComponent data={dataX} start={(5 * (i + 1)) * 2 - 5} end={(5 * (i + 2)) * 2 - 10} setMainState={setMenuState} />
                            </div>
                        </div>
                    </div>
                </section>
            )
        })
    }

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    return (
        <>
            {menuState.callAlert ? (
                <div className="danguru">
                    <div className='alertNow'>
                        <div className='kikuny'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" /></svg>
                        </div>
                        <div className='d-flex' style={{ flexDirection: "column", marginRight: 25 }}>
                            <p className='m-0'><b>Success</b></p>
                            <p className='m-0'>Cart have new item!</p>
                        </div>
                        <button onClick={() => setMenuState({ callAlert: false })} className='closeAlertKikuny'></button>
                    </div>
                </div>
            ) : null}
            <div className="tab-className text-center wow fadeInUp pt-1" data-wow-delay="0.1s">
                <div className='pb-2 perKnow'>
                    <div className='row'>
                        {Object.values(CategoryRespon).map(i => {
                            return (
                                <NavLink className="product-box p-0 CateColumn" key={i._id} reloadDocument to={`/DetailMenuPage/${i.foodname}/${i.foodcategory}`}>
                                    <div className='coolerStatus' style={{ backgroundColor: i.foodquantity > 0 ? "#239839" : "tomato" }}></div>
                                    <div className="product-item">
                                        <div className="product-item-image">
                                            <img loading='lazy' src={i.foodimage} alt="" />
                                            <div className="product-item-image-hover">
                                            </div>
                                        </div>
                                        <div className="product-item-content">
                                            <div className="product-item-title text-nowrap">{i.foodname} </div>
                                            <div className="product-item-category">
                                                {i.foodcategory}
                                            </div>
                                            <div className="product-item-price">
                                                {VND.format(i.foodprice)}
                                            </div>
                                        </div>
                                    </div>
                                </NavLink>
                            )
                        })}
                    </div>
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel="Next >"
                        onPageChange={handleX}
                        pageRangeDisplayed={5}
                        pageCount={pCount}
                        previousLabel="< Previous"
                        renderOnZeroPageCount={null}
                        marginPagesDisplayed={2}
                        containerClassName="pagination justify-content-center"
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        activeClassName="active"
                        forcePage={curP.current - 1}
                    />
                </div>
                <div className="scene thhuhu" id="scene">
                    <article id="book">
                        <section className="paged activet">
                            <div className="front" style={menuState.kakadu}>
                                <div style={{ position: "relative", width: "100%", height: "100%" }}>
                                    <div id='firstFatherFirst' className='moveToNextPage'></div>
                                </div>
                            </div>
                            <div className="back" style={menuState.spacekaka}>
                                <div style={{ position: "relative", width: "100%", height: "100%" }} className='p-5'>
                                    <div className='moveToPrevPage'></div>
                                    <h4 className='text-center mt-3'>Foreword</h4>
                                    <div className='text-start'>
                                        {Object.values(menuState.menu).map((i) => {
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
                            </div>
                        </section>

                        {pageButton(pCount)}

                        <section className="paged d-none">
                            <div className="front" style={menuState.spacekaka}>
                                <div className='moveToNextPage'></div>
                            </div>
                            <div className="back" style={menuState.kakadu}>
                                <div className='moveToPrevPage'></div>
                            </div>
                        </section>
                    </article>
                </div>
            </div>
        </>
    );
}
export default Menu;