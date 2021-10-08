function ShowImgFloatNav() {
    this.img = $('.js-float-nav-img');
    this.init();
}

ShowImgFloatNav.prototype.init = function() {
    if(!this.img.length) return;
    this.heightBlock = $('.float-nav__img-wrap').outerHeight();
    this.resize();
    this.watchers();

}
ShowImgFloatNav.prototype.watchers = function() {
    var _this = this;
    $('.js-float-nav').on('mouseenter', function () {
        _this.img.height(_this.heightBlock);
    })

    $('.js-float-nav').on('mouseleave', function () {
        _this.img.css('height', '');
    })

}

ShowImgFloatNav.prototype.resize = function () {
    var _this = this;

    $(window).resize(function () {
        _this.heightBlock = $('.float-nav__img-wrap').outerHeight();

    })
}

function initHoverFloat() {
    var img = $('.js-float-nav-img');
    if(!img.length) return;
    var heightBlock = $('.float-nav__img-wrap').outerHeight();

    $('.js-float-nav').on('mouseenter', function () {
        img.height(heightBlock);
    })

    $('.js-float-nav').on('mouseleave', function () {
        img.css('height', '')
    })
}

function initFloatNav() {
    var floatNav = $('.js-float-nav');
    var container = floatNav.find('.swiper-container');

    if(!floatNav.length) return;


    console.log(activeSlide)
    var countSlides = $('.float-nav__item').length;


    function isAllSlidesVisible() {
        var item = $('.float-nav__item.swiper-slide');
        var itemWidth = item.width();
        var itemCount = item.length;
        var screenWidth = $('.float-nav .swiper-container').width();
        return (itemWidth * itemCount) < screenWidth;
    }

    function visibleArrows() {
        var arrows = $('.float-nav__arrow');

        if(isAllSlidesVisible()) {
            arrows.addClass('hidden');
        } else {
            arrows.removeClass('hidden');
        }
    }
    visibleArrows();
    // убираю -1, т.к. первый элемент это фейковый слайдер
    var activeSlide = $('.float-nav__item.swiper-slide.active').index() - 1;


    var swiper = new Swiper(container[0], {
        slidesPerView: 'auto',
        spaceBetween: 0,
        initialSlide: activeSlide,
        // centeredSlidesBounds: isAllSlidesVisible() ? true : false,
        // centeredSlides: isAllSlidesVisible() ? true : false,
        centeredSlidesBounds: isAllSlidesVisible() ? false : true,
        centeredSlides: isAllSlidesVisible() ? false : true,
        navigation: {
            nextEl: floatNav.find('.float-nav__arrow.right')[0],
            prevEl:floatNav.find('.float-nav__arrow.left')[0],
            disabledClass: 'disabled'
        },
        on: {
            init: function () {
                console.log('asdfasdf')
                // visibleArrows();
            },
        }
    })

    $(window).resize(function () {
        visibleArrows();
    })
}

initFloatNav();

var test = new ShowImgFloatNav();
// initHoverFloat();

