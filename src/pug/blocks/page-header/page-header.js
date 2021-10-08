function scrollPageHeader() {
    var jarallax = $('.jarallax');
    var screenWidth = $(window).width();
    var headerHeight = screenWidth > 768 ? $('.header__in').height() : $('.header__fixed').height();

    if(!jarallax.length) return;

    $(window).scroll(function (evt) {
        var scrollTop = $(this).scrollTop();

        var titleHeight = $('.js-scroll-to').offset().top - headerHeight;

        var co = scrollTop/titleHeight;
        jarallax.css('opacity', 1 - co);

        jarallax.css('transform', 'translate3d(0px, '+ scrollTop/3 + 'px, 0px)')
    })
}
scrollPageHeader();
