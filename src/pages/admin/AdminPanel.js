import '../../css/Admin.css';
import '../../css/style.css';
import Waves from '../../component/admin/Waves';
import $ from 'jquery';
import { useState } from 'react';
import Modal from 'react-modal';
import Cookies from 'universal-cookie';
import MainMenu from '../../component/admin/MainMenu';
import MainUser from '../../component/admin/MainUser';
import LazyLoad from 'react-lazyload';
import GetOrder from '../../component/admin/GetOrder';
import GetOrderHistory from '../../component/admin/GetOrderHistory';

function AdminPanel() {

    $(function () {
        // Variables
        const $tabLink = $('#tabs-section .tab-link');
        const $tabBody = $('#tabs-section .tab-body');
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
                $tabBody.removeClass('active-content');

                // Add Active Classes
                $(this).addClass('active');
                $($(this).attr('href')).addClass('active');

                // Opacity Transition Class
                timerOpacity = setTimeout(() => {
                    $($(this).attr('href')).addClass('active-content');
                }, 50);
            });
        };

        // Document Ready
        $(function () {
            init();
        });
    });

    const [logout, setLogout] = useState(false);

    const cookies = new Cookies();
    const logoutThis = () => {
        cookies.remove("TOKEN");
        localStorage.clear();
        window.location.href = '/';
    }
    return (
        <>
            <LazyLoad>
                <Waves />
            </LazyLoad>
            <div className="site-wrapper">
                <section className="tabs-wrapper">
                    <div className="tabs-container">
                        <div className="tabs-block">
                            <div id="tabs-section" className="tabs">
                                <ul className="tab-head text-center">
                                    <li>
                                        <a href="#tab-1" className="tab-link active"> <i className="fa-solid fa-house w-100"></i><span className="tab-label">Home</span></a>
                                    </li>
                                    <li>
                                        <a href="#tab-2" className="tab-link"><i className="fas fa-shopping-cart w-100"></i><span className="tab-label">Order</span></a>
                                    </li>
                                    <li>
                                        <a href="#tab-3" className="tab-link"><i className="fas fa-history w-100"></i><span className="tab-label">Order History</span></a>
                                    </li>
                                    <li>
                                        <a href="#tab-4" className="tab-link"><i className="fa-solid fa-utensils w-100"></i><span className="tab-label">Menu</span></a>
                                    </li>
                                    <li>
                                        <a href="#tab-5" className="tab-link"><i className="fa-solid fa-user w-100"></i><span className="tab-label">Account</span></a>
                                    </li>
                                    <li>
                                        <a href='# ' onClick={setLogout}>
                                            <i className="fa-solid fa-right-from-bracket w-100"></i><span className="tab-label">Logout</span></a>
                                    </li>
                                </ul>
                                <Modal
                                    isOpen={logout} onRequestClose={() => setLogout(false)} ariaHideApp={false}
                                    style={{
                                        overlay: {
                                            backgroundColor: 'rgb(33 33 33 / 75%)'
                                        },
                                        content: {
                                            top: "50%",
                                            left: "50%",
                                            right: "auto",
                                            bottom: "auto",
                                            marginRight: "-50%",
                                            transform: "translate(-50%, -50%)",
                                            backgroundColor: "white",
                                            width: 400,
                                            overflow: "hidden",
                                        },
                                    }}>
                                    <h5>Are you sure you want to logout?</h5>
                                    <hr />
                                    <div className='d-flex justify-content-around'>
                                        <button className='btn btn-warning' onClick={logoutThis}>Yes</button>
                                        <button className='btn btn-secondary' onClick={() => setLogout(false)}>No</button>
                                    </div>
                                    <button className='closeModal' onClick={() => setLogout(false)}>x</button>
                                </Modal>
                                <section id="tab-1" className="tab-body entry-content active active-content">
                                    <h1>Home</h1>
                                </section>
                                <section id="tab-2" className="tab-body entry-content">
                                    <GetOrder />
                                </section>

                                <section id="tab-3" className="tab-body entry-content">
                                    <GetOrderHistory />
                                </section>

                                <section id="tab-4" className="tab-body entry-content">
                                    <MainMenu />
                                </section>

                                <section id="tab-5" className="tab-body entry-content">
                                    <MainUser />
                                </section>
                            </div>
                        </div>
                    </div>
                </section >
            </div >
        </>
    );
}
export default AdminPanel;