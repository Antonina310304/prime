function initSliderCardSlider() {
    var sliderCard = $('.js-slider-card');

    if(!sliderCard.length) return;

    sliderCard.each(function () {
        var swiper = new Swiper($(this)[0], {
            slidesPerView: 'auto',
            spaceBetween: 0,
            navigation: {
                nextEl: $(this).find('.swiper-arrow.right')[0],
                prevEl: $(this).find('.swiper-arrow.left')[0],
                disabledClass: 'disabled'
            },
            pagination: {
                el: $(this).find('.bullet-list')[0],
                type: 'bullets',
                bulletClass: 'bullet-list__item',
                bulletActiveClass: 'active',
            },
        })
    })
}

initSliderCardSlider();

