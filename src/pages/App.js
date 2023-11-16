import About from "../component/About";
import Services from "../component/Services"
import Menu from "../component/Menu";
import Testimonial from "../component/Testimonial";
import Layout from "../Layout";
import HeroBanner from "../component/HeroBanner";

function App() {
  document.title = "EatCom - Home";
  return (
    <Layout>
      {/* Loading Screen */}
      {/* <div id="spinner" className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" style={{ width: 3 + "rem", height: 3 + "rem" }} role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div> */}

      <HeroBanner />

      <Services />

      <About />

      <Menu />

      <Testimonial />
    </Layout>
  );
}

export default App;
