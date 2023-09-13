import $ from 'jquery';
function Backtotop() {
    $(function () {
        // Back to top button
        $(window).scroll(function () {
            if ($(this).scrollTop() > 300) {
                $('.back-to-top').fadeIn('slow');
            } else {
                $('.back-to-top').fadeOut('slow');
            }
        });
        $('.back-to-top').click(function () {
            $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
            return false;
        });
    })
    return (
        <>
            <div className="back-to-top">
                <a href="/#" className="btn btn-lg btn-primary btn-lg-square"><i className="bi bi-arrow-up text-center"></i></a>
            </div>
        </>
    );
}
export default Backtotop;