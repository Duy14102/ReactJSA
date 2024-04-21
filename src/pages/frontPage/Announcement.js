import AnnounceMe from "../../component/frontPage/AnnounceMe"
import Layout from "../../Layout"
import Header from "../../component/Header"
import HeroBadge from "../../component/outOfBorder/HeroBadge"

function Announcement() {
    return (
        <Layout>

            <Header type={null} />

            <HeroBadge word={"Announcement"} />

            <div className="bg-white p-5">
                <AnnounceMe />
            </div>

        </Layout>
    )
}
export default Announcement