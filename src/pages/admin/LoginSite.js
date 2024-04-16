import Layout from '../../Layout';
import Header from '../../component/Header';
import LoginBase from '../../component/frontPage/LoginBase';

function LoginSite() {
    return (
        <Layout>
            <Header type={"Yes"} />
            <LoginBase type={"User"} />
        </Layout>
    );
}
export default LoginSite;