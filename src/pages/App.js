import Services from "../component/Services";
import About from "../component/About";
import Menu from "../component/Menu";
import Testimonial from "../component/Testimonial";
import Header from "../component/Header";
import Footer from "../component/Footer";
import { NavLink } from "react-router-dom";
import "../css/style.css";

function App() {
  document.title = "EatCom - Home";
  return (
    <>
      <Header />
      {/* Loading Screen */}
      {/* <div id="spinner" className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" style={{ width: 3 + "rem", height: 3 + "rem" }} role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div> */}

      {/* Hero Banner */}
      <div className="container-fluid py-5 hero-header mb-5">
        <div className="container my-5 py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 text-center text-lg-start">
              <h1 className="display-3 text-white animated slideInLeft">Hi There!<br />This Is EatCom</h1>
              <p className="text-white animated slideInLeft mb-4 pb-2">We hope you will have a great experience using our services. Have a good day!</p>
              <NavLink reloadDocument to="/BookingSite" className="btn btn-primary py-sm-3 px-sm-5 me-3 animated slideInLeft">Book A Table</NavLink>
            </div>
            <div className="col-lg-6 text-center text-lg-end overflow-hidden">
              <img loading="lazy" className="img-fluid" src={require('../assets/image/hero0.png')} alt="" />
            </div>
          </div>
        </div>
      </div>

      <Services />

      <About />

      <Menu />

      <Testimonial />

      <Footer />
    </>
  );
}

export default App;
