function Services() {
    return (
        <div className="container-fluid bg-white py-5">
            <div className="container">
                <div className="row g-4">
                    <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.1s">
                        <div className="service-item rounded pt-3">
                            <div className="p-4">
                                <i style={{ fontSize: "xx-large" }} className="fi fi-sr-id-card-clip-alt text-primary mb-4"></i>
                                <h5>Certificate Chefs</h5>
                                <p>Up to 10 with full food service expertise </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.3s">
                        <div className="service-item rounded pt-3">
                            <div className="p-4">
                                <i style={{ fontSize: "xx-large" }} className="fi fi-ss-utensils text-primary mb-4"></i>
                                <h5>Quality Food</h5>
                                <p>Food is carefully selected and prepared</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.5s">
                        <div className="service-item rounded pt-3">
                            <div className="p-4">
                                <i style={{ fontSize: "xx-large" }} className="fi fi-ss-shopping-cart-check text-primary mb-4"></i>
                                <h5>Online Order</h5>
                                <p>Order food and reserve a table online or at the restaurant</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.7s">
                        <div className="service-item rounded pt-3">
                            <div className="p-4">
                                <i style={{ fontSize: "xx-large" }} className="fi fi-sr-headset text-primary mb-4"></i>
                                <h5>24/7 Service</h5>
                                <p>Support service is always available at all times</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Services;