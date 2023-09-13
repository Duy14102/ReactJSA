import { NavLink } from "react-router-dom";
import $ from 'jquery';
import Cookies from "universal-cookie";
function Header() {
    $(function () {
        // Sticky Navbar
        $(window).scroll(function () {
            if ($(this).scrollTop() > 45) {
                $('.navbar').addClass('sticky-top shadow-sm');
            } else {
                $('.navbar').removeClass('sticky-top shadow-sm');
            }
        });

        // Dropdown on mouse hover
        const $dropdown = $(".dropdown");
        const $dropdownToggle = $(".dropdown-toggle");
        const $dropdownMenu = $(".dropdown-menu");
        const showClass = "show";

        $dropdown.hover(
            function () {
                const $this = $(this);
                $this.addClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "true");
                $this.find($dropdownMenu).addClass(showClass);
            },
            function () {
                const $this = $(this);
                $this.removeClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "false");
                $this.find($dropdownMenu).removeClass(showClass);
            }
        );
    })
    const cookies = new Cookies();
    const token = cookies.get("TOKEN");

    const logoutThis = () => {
        cookies.remove("TOKEN");
        localStorage.clear();
        window.location.href = '/';
    }
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 px-lg-5 py-3 py-lg-0">
            <a href="/" className="navbar-brand p-0">
                <h1 className="text-primary m-0"><i className="fa fa-utensils me-3"></i>EatCom</h1>
                {/*<img src="img/logo.png" alt="Logo">*/}
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                <span className="fa fa-bars"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
                <div className="navbar-nav ms-auto py-0 pe-4">
                    <NavLink to="/" activeclassname="active" className="nav-item nav-link">Home</NavLink>
                    <div id="headups" className="nav-item dropdown">
                        <a href="/#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Menu</a>
                        <div className="dropdown-menu m-0">
                            <NavLink to="/CategorySite" state={{ category: "Meat" }} className="dropdown-item">Meat</NavLink>
                            <NavLink to="/CategorySite" state={{ category: "Drink" }} className="dropdown-item">Drink</NavLink>
                            <NavLink to="/CategorySite" state={{ category: "Vegetables" }} className="dropdown-item">Vegetables</NavLink>
                        </div>
                    </div>
                    <NavLink to="/AboutSite" className="nav-item nav-link">About</NavLink>
                    <NavLink to="/ServicesSite" className="nav-item nav-link">Services</NavLink>
                    <NavLink to="/ContactSite" className="nav-item nav-link">Contact</NavLink>
                    <div id="headups" className="nav-item dropdown">
                        <a href="/#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">More</a>
                        <div className="dropdown-menu m-0">
                            <NavLink to="/BookingSite" className="dropdown-item">Booking</NavLink>
                            <NavLink to="/TeamSite" className="dropdown-item">Our Team</NavLink>
                            <NavLink to="/TestiSite" className="dropdown-item">Testimonial</NavLink>
                        </div>
                    </div>
                </div>
                {token ? (
                    <button onClick={logoutThis} className="btn btn-primary py-2 px-4">Logout</button>
                ) : (
                    <NavLink to="/LoginSite" className="btn btn-primary py-2 px-4">Login</NavLink>
                )}
            </div>
        </nav>

    );
}
export default Header;