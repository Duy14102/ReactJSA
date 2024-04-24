import Tracking from "../../component/frontPage/Tracking";
import Layout from "../../Layout";
import Header from "../../component/Header";
import HeroBadge from "../../component/outOfBorder/HeroBadge";

function TrackOrder() {
    document.title = "EatCom - Contact";
    return (
        <Layout>

            <Header type={null} />

            <HeroBadge word={"Track order"} />

            <div className="bg-white p-5">
                <Tracking />
            </div>

        </Layout>
    );
}
export default TrackOrder;