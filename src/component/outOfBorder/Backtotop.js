import jQuery from "jquery";
function Backtotop() {
    jQuery(function ($) {
        // Back to top button
        $(window).on("scroll", function () {
            if ($(this).scrollTop() > 300) {
                $('.back-to-top').fadeIn('slow');
            } else {
                $('.back-to-top').fadeOut('slow');
            }
        });
        $('.back-to-top').on("click", function () {
            $('html, body').animate({ scrollTop: 0 }, 'fast');
        });
    })
    return (
        <>
            <div className="back-to-top">
                <button className="btn btn-lg btn-primary btn-lg-square"><i className="bi bi-arrow-up text-center"></i></button>
            </div>
        </>
    );
}
export default Backtotop;