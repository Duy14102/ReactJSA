import Reservation from "../component/frontPage/Reservation";
import Layout from "../Layout";
import Header from "../component/Header";
import HeroBadge from "../component/outOfBorder/HeroBadge";

function BookingSite() {
    document.title = "EatCom - Booking";
    return (
        <Layout>

            <Header type={null} />

            <HeroBadge word={"Booking"} />

            <Reservation />

        </Layout>
    );
}
export default BookingSite;