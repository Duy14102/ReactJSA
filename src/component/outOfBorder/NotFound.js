import { useNavigate } from 'react-router-dom';
import LayoutManager from '../../pages/admin/LayoutManager';

function NotFound() {
    const navigate = useNavigate();
    return (
        <LayoutManager>
            <section className="page_404">
                <div className="container-fluid">
                    <div className="onNoff text-center d-flex justify-content-center">
                        <div>
                            <div className="four_zero_four_bg">
                                <h1 className="text-center ">404</h1>

                            </div>

                            <div className="contant_box_404">
                                <h3 className="h2">
                                    Look like you're lost
                                </h3>

                                <p>the page you are looking for not avaible!</p>

                                <button onClick={() => navigate(-1)} className="link_404">Go Back</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </LayoutManager>
    );
}
export default NotFound;