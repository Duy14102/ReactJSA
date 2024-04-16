import Contact from "../component/frontPage/Contact";
import Layout from "../Layout";
import About from '../component/frontPage/About'
import Services from '../component/frontPage/Services'
import HeroBadge from "../component/outOfBorder/HeroBadge";
import Header from "../component/Header";

function ContactSite() {
    document.title = "EatCom - About";
    return (
        <Layout>

            <Header type={null} />

            <HeroBadge word={"About"} />

            <div className="bg-white">
                <Services />

                <About />

                <Contact />
            </div>

        </Layout>
    );
}
export default ContactSite;