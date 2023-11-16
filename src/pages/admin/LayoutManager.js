import "../../css/Admin.css";
import "../../css/style.css";
import "../../css/Cart.css";
import "../../css/Category.css";
import "../../css/DetailMenuPage.css";
import "../../css/main.css";
import "../../css/NotFound.css";
import "../../css/util.css";
import "../../css/bootstrap.min.css";
import "../../lib/animate/animate.min.css";
import "../../lib/tempusdominus/css/tempusdominus-bootstrap-4.min.css";

function LayoutManager({ children }) {
    return (
        <main style={{ height: 100 + "vh" }}>{children}</main>
    )
}
export default LayoutManager