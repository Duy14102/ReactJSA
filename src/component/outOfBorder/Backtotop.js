import jQuery from "jquery";
function Backtotop() {
    jQuery(function ($) {
        $(window).on("scroll", function () {
            if ($(this).scrollTop() > 300) {
                $('.back-to-top').fadeIn('slow');
            } else {
                $('.back-to-top').fadeOut('slow');
            }
        });
    })
    function scrollToTop() {
        window.scroll({ top: 0, behavior: "smooth" })
    }
    return (
        <>
            <div className="back-to-top">
                <button onClick={() => scrollToTop()} className="btn btn-lg btn-primary btn-lg-square"><svg className="topButtonSvg" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z" /></svg></button>
            </div>
        </>
    );
}
export default Backtotop;