function isOpenSomeMenu() {
    return !!$('.header.open-maker').length || !!$('.header.open').length;
}

function getHeaderWidth() {
    var screenWidth = $(window).width();
    var makerNavWidth = $('.header__maker-nav').length ? $('.header__maker-nav').height() : 0;
    var headerWidth = $('.header').height() + makerNavWidth;
    var fixedHeaderWidth = $('.header__fixed').height();

    return (screenWidth > 767 ? headerWidth : fixedHeaderWidth);
}

function scrollToBlock(block) {
    var scrollTop = block.offset().top - getHeaderWidth();
    console.log(scrollTop)

    $('html, body').animate({
        scrollTop: scrollTop
    }, 500);
}


$('.js-callback').on('click', function (evt) {
    evt.preventDefault();

    var screenWidth = $(window).width();
    if(screenWidth < 768) {
        controller.closeMobileMainNav();
    }

    scrollToBlock($('[data-scroll="callback"]'));
    var firstInput = $('.js-form').find('.input__input').eq(0);
    firstInput.focus();
    firstInput.parent().addClass('focus');
})