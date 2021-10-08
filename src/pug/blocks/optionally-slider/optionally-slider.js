/**
* инициализирует слайдер доп. товаров в карточке товара
* выравнивает высоту заголовков и описания в одну линию
* */

function OptionallySlider() {
    var _this = this;
    this.slider = $('.js-optionally-slider');

    this.slider.each(function (){
        _this.initSlider($(this));
        _this.buildHeight($(this));
    })
}

OptionallySlider.prototype.buildHeight = function (slider) {
    var items = slider.find('.optionally-slider__item');

    if(!items.length) return;

    var maxHeightTop = 0;
    var maxHeightDescription = 0;

    items.each(function () {
        var _this = $(this);
        var heightTop  = _this.find('.catalog-card__top-in').height();
        var heightDescription  = _this.find('.catalog-card__description-in').height();
        maxHeightTop = heightTop > maxHeightTop ? heightTop : maxHeightTop;
        maxHeightDescription = heightDescription > maxHeightDescription ? heightDescription : maxHeightDescription;
    })

    items.each(function () {
        var _this = $(this);
        _this.find('.js-top-wrap').height(maxHeightTop);
        _this.find('.js-description-wrap').height(maxHeightDescription);
    })
}

OptionallySlider.prototype.initSlider = function (slider) {

    if(!slider.length) return;
    var container = slider.find('.swiper-container');

    var swiper = new Swiper(container[0], {
        slidesPerView: 'auto',
        // spaceBetween: 8,
        grabCursor: true,
        navigation: {
            nextEl: slider.find('.swiper-arrow.right')[0],
            prevEl: slider.find('.swiper-arrow.left')[0],
            disabledClass: 'disabled'
        },
    })
}

$(document).ready(function () {
    setTimeout(function () {
        var optionallySlider = new OptionallySlider;
    }, 30)
})



