import PAndT from "../../component/frontPage/PAndT";
import Layout from "../../Layout";
import Header from "../../component/Header";
import HeroBadge from "../../component/outOfBorder/HeroBadge";

function PrivacyAndTerm() {
    document.title = "EatCom - Privacy and policy || Term and conditions";
    return (
        <Layout>
            <Header type={null} />

            <HeroBadge word={"Privacy Policy || Terms & Condition"} />

            <div className="bg-white p-5">
                <PAndT />
            </div>

        </Layout>

    );
}
export default PrivacyAndTerm;