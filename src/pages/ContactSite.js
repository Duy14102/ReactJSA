import Contact from "../component/Contact";
import Layout from "../Layout";
import About from '../component/About'
import Services from '../component/Services'
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