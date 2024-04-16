import Testimonial from "../component/frontPage/Testimonial";
import HeroBanner from "../component/frontPage/HeroBanner";
import Layout from "../Layout";
import Header from "../component/Header";
import BestSeller from "../component/frontPage/BestSeller";

function App() {
  document.title = "EatCom - Home";
  return (
    <>
      <Layout>

        <Header type={null} />
        {/* Loading Screen */}
        {/* <div id="spinner" className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" style={{ width: 3 + "rem", height: 3 + "rem" }} role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div> */}

        <HeroBanner />

        <div style={{ zIndex: 5, position: "relative" }}>

          <BestSeller />

          <Testimonial />

        </div>

      </Layout>
    </>
  );
}

export default App;
