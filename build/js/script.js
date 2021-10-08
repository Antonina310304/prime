function overflowHidden() {
    $('html').css('overflow', 'hidden');
}

function overflowInherit() {
    $('html').css('overflow', 'inherit');
}

function getScrollbarSize() {
    var outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.width = '100px';
    outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
    document.body.appendChild(outer);
    var widthNoScroll = outer.offsetWidth;
    // force scrollbars
    outer.style.overflow = 'scroll';
    // add innerdiv
    var inner = document.createElement('div');
    inner.style.width = '100%';
    outer.appendChild(inner);
    var widthWithScroll = inner.offsetWidth;
    // remove divs
    outer.parentNode.removeChild(outer);

    var scrollWidth;

    if(document.body.offsetHeight > window.innerHeight) {
        scrollWidth = widthNoScroll - widthWithScroll;
    } else {
        scrollWidth = 0;
    }
    return scrollWidth;
}
//возвращает true если блок находится выше окна браузера
function isTop(block, scrollTop) {
    // var scrollTop = $(window).scrollTop();
    var offsetTop = block.offset().top;

    return offsetTop < scrollTop;
}

function inViewport(block, scrollTop) {
    //var scrollTop = $(window).scrollTop();
    var windowHeight = $(window).height();
    var headerHeight = $('.header').height();

    var offsetTop = block.offset().top;
    var offsetBottom = block.outerHeight();
    var bottomY = offsetTop + offsetBottom;

    var isVisibilityTop = (offsetTop > scrollTop) && (offsetTop < scrollTop + windowHeight);
    var isVisibilityBottom = (bottomY > scrollTop) && (bottomY < scrollTop + windowHeight);

    //если верхняя часть и нижняя часть находится в рамках окна
    if(isVisibilityTop) {
        return true;
    }

    // if(isVisibilityTop && isVisibilityBottom) {
    //     return true;
    // }
    //
    // if(et > wt && et < wt + wh) {
    //     return console.log(true)
    //
    // }
}

function _inViewport(block, scrollTop) {
    //var scrollTop = $(window).scrollTop();
    var windowHeight = $(window).height();
    var headerHeight = $('.header').height();

    var offsetTop = block.offset().top;
    var offsetBottom = block.outerHeight();
    var bottomY = offsetTop + offsetBottom;

    var isVisibilityTop = (offsetTop > scrollTop) && (offsetTop < scrollTop + windowHeight);
    var isVisibilityBottom = (bottomY > scrollTop) && (bottomY < scrollTop + windowHeight);

    //если верхняя часть и нижняя часть находится в рамках окна
    if(isVisibilityTop && isVisibilityBottom) {
        return true;
    }
}

//отрисовывает нумерацию у заголовком
function initCounterHeaders() {
    var counters = $('.js-counter-title');
    if(!counters.length) return;

    counters.each(function (i) {
        var currCounter = i + 1;
        var count = currCounter < 10 ? '0' + currCounter : currCounter;
        $(this).text(count);
    })

}

initCounterHeaders()



function debounce(func, wait, immediate) {
    var timeout;

    return function executedFunction() {
        var context = this;
        var args = arguments;

        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };

        var callNow = immediate && !timeout;

        clearTimeout(timeout);

        timeout = setTimeout(later, wait);

        if (callNow) func.apply(context, args);
    };
};

// анимация главного заголовка сайта
function animateMainTitle(mainTitle) {
    var mainTitleIn = mainTitle.find('.main-title__in');
    var color = [colors.grayLight, colors.goldLight, colors.goldLight];

    mainTitleIn.each(function (index) {
        var item = $(this);
        setTimeout(function () {
            animateTitle(item, color[index]);
        }, (index * 250));
    })
}

//анимация блока заголовка раздела //вот тут куча всего
function animateTitle(title, color, cb) {
    var p = title.find('p');
    if(!p.length) {
        p = title.find('.js-title-text');
    }
    var span = title.find('.animate-title-block');

    p.animate({
        color: color
    }, durationAnimationColorTitle, easingInOut, function () {
        if(cb) {
            cb();
        }
    });
    span.animate({
        right: span.parent().innerWidth()
    }, durationAnimationBlock, easingInOut);
}

//анимация заголовков раздела
function animateTitleSection(title, colorTitle) {

    title.find('.counter-title').animate({
        color: '#888B8D'
    }, durationAnimationColorTitle, easingInOut)
    animateTitle(title, colorTitle);
}

function AnimateSections() {
    this.onScroll = $.proxy(this._onScroll, this);
    this.init();
}

AnimateSections.prototype.animate = function(scrollTop) {
    var animateBlock = $('.js-animate');
    var _this = this;

    animateBlock.each(function () {
        var that = $(this);
        if(inViewport(that, scrollTop) || isTop(that, scrollTop)) {

            // var block =  that.find('.js-soa');
            var mainTitle = that.find('.js-main-title');
            if(mainTitle.length) {
                setTimeout(function () {
                    var mainTitle = $('.js-main-title');
                    animateMainTitle(mainTitle);
                }, 150)
            }
            //
            // var sectionTitle = that.find('.js-section-title');
            // var colorTitle = (sectionTitle.hasClass('dark') ? colors.goldLight : colors.darkTitleColor);
            // if(sectionTitle.length) {
            //     animateTitleSection(sectionTitle, colorTitle);
            // }

            setTimeout(function () {
                // _this.animateSection(block);
                that.removeClass('js-animate');
                that.addClass('js-animate-load');
            }, 80)
        }
    })
}

AnimateSections.prototype.animateSection = function(block, cb) {
    if(!block.hasClass('is-scroll-invisible')) return;

    block.removeClass('is-scroll-invisible');
    block.animate({
        opacity: 1,
    }, durationAnimationSection, easingInOut, function () {

        setTimeout(function () {
            if(!cb) return;
            cb();
        }, timeoutCb)
    })

}
AnimateSections.prototype._onScroll = function(evt) {
    var _this = this;
    var scrollTop = $(evt.target).scrollTop();
    var hiddenBlock = $('.is-scroll-invisible');

    //удаляю обработчик когда все блоки отображены
    if(hiddenBlock.length == 0) {
        $(window).off('scroll', this.onScroll);
        return;
    }

    setTimeout(function () {
        _this.animate(scrollTop);
    }, 100)

}
AnimateSections.prototype.init = function() {
    var scrollTop = $(window).scrollTop();
    this.animate(scrollTop);


    $(window).on('scroll', this.onScroll);
    // $(window).on('scroll', function (evt) {
    //
    //     var scrollTop = $(evt).scrollTop();
    //
    //
    //     setTimeout(function () {
    //         _this.animate(scrollTop);
    //     }, 100)
    //
    // })
}

var durationAnimationSection = 200;
var durationAnimationColorTitle = 800;
var durationAnimationBlock = 600;
var easingAnimationColor = $.bez([.93,.08,.95,.36]);
var easingInOut = $.bez([0.42, 0.0, 0.58, 1.0]);
var easingAnimationBlock = 'cubic-bezier(.62,.62,.71,.71)';
var timeoutCb = 150;
var colors = {
    grayLight: '#D9D9D6',
    goldLight: '#C0A968',
    darkTitleColor: '#303336',
    pistenbully: '#DA3828',
    reform: '#D44627',
    merlo: '#01A346',
    fae: '#E28530',
}

// анимация заголовков главных производителей
function animateTitleMaker() {
    var title = $('.js-title-maker');
    var body = $('body');
    var color;
    if(body.hasClass('pistenbully')) {
        color = colors.pistenbully;
    } else if(body.hasClass('reform')) {
        color = colors.reform;
    } else if(body.hasClass('merlo')) {
        color = colors.merlo;
    } else if(body.hasClass('fae')) {
        color = colors.fae;
    }

    animateTitle(title, color, function () {
        title.addClass('done');
    });
}

//анимация главного заголовка каталога
function animateTitleCatalog() {
    var sectionTitle = $('.js-catalog-title');
    if(sectionTitle.length) {
        animateTitleSection(sectionTitle, colors.grayLight);
    }
}
//анимация главного заголовка каталога
function animateProductTitle() {
    var sectionTitle = $('.js-card-title');
    if(sectionTitle.length) {
        animateTitle(sectionTitle, colors.darkTitleColor);
    }
}

function resizeTitleBlocks() {
    var title = $('.js-title-text');
    var block = title.find('.animate-title-block');
    block.css('right', title.width())

}

$(document).ready(function () {
    // var mainTitle = $('.js-main-title');
    // animateMainTitle(mainTitle);

    var animateSections = new AnimateSections();
    // animateTitleMaker();
    // animateTitleCatalog();
    // animateProductTitle();
})
//
// $(window).resize(function () {
//     resizeTitleBlocks()
// });


function CustomSlider(params) {
    this.isNeedFractionPagination = params.isNeedFractionPagination ? params.isNeedFractionPagination : false;
    this.isNeedBtn = params.isNeedBtn ? params.isNeedBtn : false;
    this.isNeedbullet = params.isNeedbullet ? params.isNeedbullet : false;
    this.slider = params.slider;
    this.sliderTrack = params.slider.find('.' + params.sliderTrack);
    this.sliderTrack = params.slider.find('.' + params.sliderTrack);
    this.btnPrev = params.btnPrev ? params.slider.find('.' + params.btnPrev) : false;
    this.btnNext = params.btnNext ? params.slider.find('.' + params.btnNext) : false;
    this.bulletContainer = params.slider.find('.' + params.bulletContainer);
    this.bulletTemplate = params.bulletTemplate ? params.bulletTemplate : false;
    this.currTranslate = 0;
    this.currentSlide = 0;
    this.activeBulletClass = 'active';
    this.activeBulletClass = 'active';
    this.countSlides = this.sliderTrack.children().length - 1;
    this.slides = this.sliderTrack.children();
    this.onClickCb = params.onClick ? params.onClick : function () {return false};
    this.swipeAction = params.swipeAction ? params.swipeAction : function () {return false};
    this.steps = {
        FORVARD_FIRST: 'first',
        FORWARD_LAST: 'forward_last',
        NEXT: 'next',
        PREV: 'preview',
        BACK_FIRST: 'back_first',
        BACK_LAST: 'back_last',
    }
}

CustomSlider.prototype.init = function () {
    if(this.isNeedBtn) {
        this.watchersBtn();
    }

    this.swipe();

    if(this.isNeedbullet) {
        this.renderBullets();
        this.watchersBullet();
    }

    if(this.isNeedFractionPagination) {
        this.slider.find('.custom-slider__activeNum').text(1);
        this.slider.find('.custom-slider__count').text(this.countSlides + 1);
    }
    var _this = this;

    //добавляю нумерацию слайдов
    this.slides.each(function (index) {
        $(this).attr('data-index', index)
    })

    $(window).resize(function () {
        _this.goToSlide(_this.currentSlide);
    })
}


CustomSlider.prototype.markBullet = function (activeBullet) {
    this.bulletContainer.find('.' + this.activeBulletClass).removeClass(this.activeBulletClass);
    this.bulletContainer.children().eq(activeBullet).addClass(this.activeBulletClass);
}


CustomSlider.prototype.markButton = function () {
    this.btnPrev.attr('disabled', this.currentSlide == 0);
    this.btnNext.attr('disabled', this.currentSlide == this.countSlides);
}

CustomSlider.prototype.renderBullets = function () {
    for(var i = 0; i <= this.countSlides; i++) {
        var bullet = this.bulletTemplate.clone();
        bullet.text(i+1);
        bullet.attr('data-certificate-number', i);
        this.bulletContainer.append(bullet);
    }
    this.bulletContainer.children().eq(0).addClass(this.activeBulletClass);
}

CustomSlider.prototype.watchersBullet = function () {
    var _this = this;
    this.bulletContainer.find('.custom-slider__bullet-item').on('click', function () {
        var sliderNumber = Number($(this).attr('data-certificate-number'));
        _this.goToSlide(sliderNumber);
    })
}

CustomSlider.prototype.watchersBtn = function () {
    var nextStep = $.proxy(this.nextStep, this);
    var prevStep = $.proxy(this.prevStep, this);

    this.btnNext.on('click', nextStep);
    this.btnPrev.on('click', prevStep);
}

CustomSlider.prototype.endSwipe = function (distance, direction) {
    switch (direction) {
        case 'left' :
            this.nextStep();
            break;

        case 'right':
            this.prevStep()
            break;
    }
}

CustomSlider.prototype.swipe = function () {
    var isSwiping = false;
    var _this = this;

    this.sliderTrack.swipe({
        tap:function(event, target) {

            if(!isSwiping) {
                _this.onClickCb(event.target)
            }
        },

        swipeStatus:function (event, phase, direction, distance) {
            console.log(distance)
            if(distance > 2) {
                isSwiping = true;
            }

            if (direction == 'left') {
                _this.transformSlider(_this.currTranslate - distance);
            } else if (direction == 'right') {
                _this.transformSlider(_this.currTranslate + distance);
            }
            if(phase =="cancel" || phase =="end") {
                _this.endSwipe(distance, direction);

                setTimeout(function () {
                    isSwiping = false;
                }, 50)
            }

        },
        excludedElements:"",
        //threshold:50,
        // triggerOnTouchEnd:false,
        allowPageScroll: "vertical",
        threshold:200,
        // maxTimeThreshold:600,
        // fingers:'all'
    })
}

CustomSlider.prototype.goToSlide = function (numberSlide) {
    var translateX;
    if(numberSlide != 0 && numberSlide != this.countSlides) {
        translateX = ((numberSlide - 1) * this.getSlideWidth()) + this.firstStepTranslate();
    } else if(numberSlide == this.countSlides) {
        translateX = ((numberSlide - 2) * this.getSlideWidth()) + this.firstStepTranslate() + this.lastStepTranslate();
    } else if (numberSlide == 0) {
        translateX = 0;
    }
    this.currTranslate = -translateX;
    this.translateSlider(this.currTranslate);
    this.currentSlide = numberSlide;
    if(this.isNeedBtn) {
        this.markButton();
    }
    if(this.isNeedbullet) {
        this.markBullet(this.currentSlide);
    }
}

CustomSlider.prototype.nextStep = function () {
    var step;
    if(this.currentSlide == 0) {
        step = this.steps.FORVARD_FIRST;
    } else if(this.currentSlide == this.countSlides - 1) {
        step = this.steps.FORWARD_LAST;
    } else if(this.currentSlide == this.countSlides) {
        //return;
    } else {
        step = this.steps.NEXT;
    }
    this.stepsSlide(step);
}

CustomSlider.prototype.prevStep = function () {
    var step;
    if(this.currentSlide == 0) {
        //return;
    } else if(this.currentSlide == 1) {
        step = this.steps.BACK_FIRST;
    } else if(this.currentSlide == this.countSlides) {
        step = this.steps.BACK_LAST;
    } else {
        step = this.steps.PREV;
    }
    this.stepsSlide(step);

}

CustomSlider.prototype.getSlideWidth = function() {
    return this.sliderTrack.children().eq(0).outerWidth(true);
}

CustomSlider.prototype.containerWidth = function() {
    return this.sliderTrack.width();
}

CustomSlider.prototype.translateSlider = function(width) {
    this.transformSlider(width);
    this.sliderTrack.css('transition', 'transform 350ms linear');
}

CustomSlider.prototype.transformSlider = function(width) {
    this.sliderTrack.css('transition', '');
    this.sliderTrack.css('transform', 'translate3d(' + width + 'px, 0px, 0px)');
}

CustomSlider.prototype.firstStepTranslate = function () {
    var slideWidth = this.getSlideWidth();
    var containerWidth = this.containerWidth();
    return (slideWidth * 1.5) - (containerWidth/2);
}

CustomSlider.prototype.lastStepTranslate = function () {
    var slideWidth = this.getSlideWidth();
    var containerWidth = this.containerWidth();
    return slideWidth - (containerWidth - slideWidth)/2;
}

CustomSlider.prototype.stepsSlide = function (step) {

    switch (step) {
        case this.steps.FORVARD_FIRST:
            this.currTranslate = this.firstStepTranslate() * -1;
            this.currentSlide += 1;
            break;

        case this.steps.BACK_FIRST:
            this.currTranslate = this.currTranslate + this.firstStepTranslate();
            this.currentSlide -=1;
            break;

        case this.steps.FORWARD_LAST:
            this.currTranslate = this.currTranslate - this.lastStepTranslate();
            this.currentSlide += 1;
            break;

        case this.steps.BACK_LAST:

            this.currTranslate = this.currTranslate + this.lastStepTranslate();
            this.currentSlide -= 1;
            break;

        case this.steps.NEXT:
            this.currTranslate = this.currTranslate - this.getSlideWidth();
            this.currentSlide += 1;
            break;

        case this.steps.PREV:
            this.currTranslate = this.currTranslate + this.getSlideWidth();
            this.currentSlide -= 1;
            break;
    }

    this.translateSlider(this.currTranslate);
    if(this.isNeedBtn) {
        this.markButton();
    }
    if(this.isNeedbullet) {
        this.markBullet(this.currentSlide);
    }

    var activeNum = this.slider.find('.custom-slider__activeNum');
    if(activeNum.length) {
        activeNum.text(this.currentSlide + 1);
    }


}
function stopPropagation(event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
}


function CustomSlider2() {
    var swiperSlides = $('.js-certificate-swiper');

    swiperSlides.each(function () {
        var sliderItem = $(this);
        var container = sliderItem.find('.swiper-container');
        var activeSlideIndex = 0;
        var directionSlide = 'next';

        var swiper = new Swiper(container[0], {
            slidesPerView: 'auto',
            spaceBetween: 0,
            initialSlide: 0,
            centeredSlidesBounds: true,
            centeredSlides: true,
            pagination: {
                el: sliderItem.find('.custom-slider__fraction-pagination')[0],
                type: 'fraction',
            },
            on: {
                init: function (slider) {
                    var bulletList = sliderItem.find('.custom-slider__bullet-list');
                    //добавляю порядковый номер для откытия галереи
                    $(slider.slides).each(function (index) {
                        $(this).attr('data-index', index);
                        var currIndex = index + 1;
                        var template = $('<li class="custom-slider__bullet-item'+ (slider.activeIndex == currIndex ? ' active' : '') + '" data-certificate-number="'+ currIndex + '">' + currIndex +'</li>');
                        bulletList.append(template);
                    })

                    // инициализация галереи
                    $(slider.slides).on('click', '.js-full-size-gallery', function (evt) {
                        var sliderNumber = $(evt.target).parent().parent().attr('data-index');
                        openFullGallery(sliderItem, sliderNumber);
                    })
                },
                transitionEnd: function (swiper) {

                    var activeSlider = Number(sliderItem.find('.swiper-slide-active').attr('data-index'));
                    sliderItem.find('.custom-slider__bullet-item.active').removeClass('active');
                    //такое вот извращение...
                    directionSlide = (activeSlideIndex > activeSlider + 1) ? 'prev' : 'next';
                    if((activeSlideIndex == 2) && (activeSlider == 1)) {
                        directionSlide = 'prev'
                    }

                    switch (directionSlide) {
                        case 'prev' :
                            var activeSlide = (activeSlideIndex == (activeSlider + 1)) ? activeSlider : (activeSlider + 1);
                            break;
                        case 'next' :
                            var activeSlide = (activeSlideIndex == (activeSlider + 1)) ? (activeSlider + 2) : (activeSlider + 1);
                            break;
                    }
                    sliderItem.find("[data-certificate-number=" + activeSlide + "]").addClass('active');
                    activeSlideIndex = activeSlide;
                }
            }
        })
    })
}

CustomSlider2();

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


/**
* выравнивает высоту заголовков и описания по одной высоте в линии
* */

function GridCatalogCardList() {
    this.applyGrid = $.proxy(this._applyGrid, this);
    this.init();
}

GridCatalogCardList.prototype.init = function () {
    this.applyGrid();
    var _this = this;

    $(window).resize(function () {
        _this.applyGrid();
        var screenWight = $(window).width();
    });
}

GridCatalogCardList.prototype._applyGrid = function () {
    var _this = this;
    var screenWight = $(window).width();
    var list = $('.js-catalog-list');

    if(screenWight >= 576) {
        list.each(function () {
            _this.calculate($(this));
        })

    } else {
        list.find('.js-top-wrap').css('height', '');
        list.find('.js-description-wrap').css('height', '');
    }
}

GridCatalogCardList.prototype.calculate = function (list) {
    if(!list.length) return;
    var containerWidth = list.width();
    var itemList = list.children();
    var itemWidth = itemList.eq(0).outerWidth();
    var countInLines = Math.round(containerWidth/itemWidth); //количество элементов в ряду
    var countOfLines = Math.round(itemList.length / countInLines); // количество рядов

    var counter = 0;

    for(var i = 0; i < countOfLines; i++) {
        applyMaxHeight(counter, counter + countInLines);
        counter += countInLines
    }

    function applyMaxHeight(startItem, finishItem) {
        var maxHeightTop = 0;
        var maxHeightDescription = 0;

        for(var i = startItem; i < finishItem; i++) {
            if(!itemList.eq(i).length) continue;
            var heightTop  = itemList.eq(i).find('.catalog-card__top-in').height();
            var heightDescription  = itemList.eq(i).find('.catalog-card__description-in').height();
            maxHeightTop = heightTop > maxHeightTop ? heightTop : maxHeightTop;
            maxHeightDescription = heightDescription > maxHeightDescription ? heightDescription : maxHeightDescription;
        }

        for(var y = startItem; y < finishItem; y++) {
            if(!itemList.eq(y).length) continue;
            itemList.eq(y).find('.js-top-wrap').height(maxHeightTop);
            itemList.eq(y).find('.js-description-wrap').height(maxHeightDescription);
        }
    }
}
$(document).ready(function () {
    setTimeout(function () {
        var gridCatalogCardList = new GridCatalogCardList;
    }, 100)

})


$('.js-custom-slider').each(function () {
    var sliderParams = {
        slider: $(this),
        sliderTrack: 'custom-slider__slider-track',
        btnPrev: 'custom-slider__prev',
        btnNext: 'custom-slider__next',
        bulletContainer: 'custom-slider__bullet-list',
        bulletTemplate: $('<li class="custom-slider__bullet-item"></li>'),
        isNeedBtn: false,
        isNeedbullet: true,

    }
    var certificateSlider = new CustomSlider(sliderParams);
    certificateSlider.init()
})



function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options = {}) {

    options = {
        path: '/',
        ...options
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}



function Cookies() {
    this.cookies = $('.js-cookies');
    if(!this.cookies.length) return;
    this.hide = $.proxy(this.hide, this);
    this.init();
    this.age = 86400 * 360;
}

Cookies.prototype.init = function () {

    if(getCookie('PRIME_COOKIES') === 'SHOW') return;

    this.show();
}
Cookies.prototype.show = function () {
    this.cookies.addClass('show');
    this.cookies.find('.cookies__button').on('click', this.hide)
}

Cookies.prototype.hide = function () {
    setCookie('PRIME_COOKIES', 'SHOW', {'max-age': this.age});
    this.cookies.removeClass('show');
    this.cookies.find('.cookies__button').off('click', this.hide);
}

$(document).ready(function () {
    var cookies = new Cookies();
    cookies.init();
})
$('.js-features').on('click', function (evt) {
    evt.preventDefault();
    var contentId = $(this).attr('data-content');

    var contentSidePage = $('[data-id="' +contentId +  '"]');
    if(!contentSidePage.length) return;
    sidePageController.renderSidePage({content: contentSidePage, template: sidePageController.defaultPageTemplate()});
})
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


function InitGallery(slider, activeSlider) {
    this.gallery = slider.find('.js-full-size-gallery');
    this.slider = '';
    this.activeSlider = activeSlider;
    this.openModal = $.proxy(modal.open, modal);
    this.onKeydown = $.proxy(this.onKeydown, this);
    this.keys = {
        RIGHT: 'ArrowRight',
        LEFT: 'ArrowLeft',
        ESCAPE: 'Escape',
    }
}

InitGallery.prototype.renderSlider = function () {
    var _this = this;
    var sliderWrapperTemplate = $('<div class="modal-gallery js-modal-gallery">\n' +
        '              <div class="modal-gallery__arrows">\n' +
        '                <div class="modal-gallery__arrow left"><div class="modal-gallery__arrow-in"></div></div>\n' +
        '                <div class="modal-gallery__arrow right"><div class="modal-gallery__arrow-in"></div></div>\n' +
        '              </div>\n' +
        '            <div class="modal-gallery__container swiper-container">\n' +
        '              <div class="modal-gallery__wrapper swiper-wrapper"></div>\n' +
        '            </div>\n' +
        '            <div class="modal-gallery__bullets bullet-list"></div>\n' +
        '          </div>');

    var sliderItemTemplate = $('<div class="modal-gallery__item swiper-slide"><div class="gallery"></div></div>');

   this.slider = sliderWrapperTemplate.clone();

    this.gallery.each(function () {
        var sliderItem = sliderItemTemplate.clone();
        var img = $(this).find('img').clone();
        sliderItem.find('.gallery').append(img);
        _this.slider.find('.swiper-wrapper').append(sliderItem);
    });

}

InitGallery.prototype.initSlider = function () {
    var slider = $('.js-modal-gallery');
    var swiperWrapper = slider.find('.swiper-container');
    var _this = this;

    this.swiper = new Swiper(swiperWrapper[0], {
        slidesPerView: 'auto',
        spaceBetween: 0,
        initialSlide: this.activeSlider,
        navigation: {
            nextEl: slider.find('.modal-gallery__arrow.right')[0],
            prevEl: slider.find('.modal-gallery__arrow.left')[0],
            disabledClass: 'disabled'
        },
        pagination: {
            el: slider.find('.bullet-list')[0],
            type: 'bullets',
            bulletClass: 'bullet-list__item',
            bulletActiveClass: 'active',
        },
        on: {
            init: function () {
                $('body').on('keydown', _this.onKeydown);
            }
        }
    })
}

InitGallery.prototype.destroy = function () {
    $('.js-modal-gallery').remove();
}

InitGallery.prototype.init = function () {
    this.renderSlider();

    $('.modal .modal__inner').append(this.slider);

    this.openModal();
    this.initSlider();
}

InitGallery.prototype.onKeydown = function (e) {
    if (e.key == this.keys.LEFT) {
        this.swiper.slidePrev();
    } else if(e.key == this.keys.RIGHT) {
        this.swiper.slideNext();
    } else if (e.key == this.keys.ESCAPE) {
        closeModal();
    }
}

$('.js-custom-gallery-slider').each(function () {
    var _this = $(this);
    var sliderParams = {
        slider: _this,
        sliderTrack: 'custom-slider__slider-track',
        btnPrev: 'custom-slider__prev',
        btnNext: 'custom-slider__next',
        bulletContainer: 'custom-slider__bullet-list',
        bulletTemplate: $('<li class="custom-slider__bullet-item"></li>'),
        isNeedBtn: false,
        isNeedbullet: true,
        isNeedFractionPagination: true,
        onClick: function (target) {
            var screenWidth = $(window).width();

            // if(screenWidth < 768) return;

            var gallery = _this;
            var sliderNumber = $(target).parent().parent().attr('data-index');
            openFullGallery(gallery, sliderNumber);
        },
    }
    var gallerySlider = new CustomSlider(sliderParams);
    gallerySlider.init();
})

function closeModal() {
    modal.close();
    overflowInherit();
    $('body').off('click', '.modal__close', closeModal);
    $('body').off('keydown', modal.onKeydown);
}

function openFullGallery(slider, sliderNumber) {
    var gallery = new InitGallery(slider, sliderNumber);
    gallery.init();
    modal.setCloseCb(gallery.destroy);


    $('body').on('click', '.modal__close', closeModal);
}

$('body').on('input, focus', '.input__input', function () {
    $(this).parent().addClass('focus')
})

$('body').on('blur', '.input__input', function () {
    $(this).parent().removeClass('focus')
})

// добавление zIndex для инпутов, тк в верстке блоки накладываются один на один
function initIndexInput() {
    var form = $('.form');

    var items = form.find('.form__item .input');

    items.each(function (item) {
        $(this).css('zIndex', items.length - item)
    })
}

initIndexInput()
function onSendAjax(params) {
    $.ajax({
        type: params.type,
        url: params.url,
        dataType: params.dataType,
        data: params.data,
        // processData: false,
        // contentType: false,
        cache: false,
        success: function (data) {
            //params.onSuccess(data);
        },
        error: function (data) {
            // params.onError();
        },
        complete: function () {
            params.onSuccess();
        }
    });
}


function validateForm(form) {
    var validate = {
        errorClass: 'error',
        input: null,
        attr: 'data-type',
        arrayInput: [],
        form: form,
        isSubmitForm: function () {
            var that = this;
            var isValid = true;
            this.input.each(function () {
                var $this = $(this);
                isValid = isValid && that.isValidValue($this);
            });

            return isValid;
        },

        checkAllError: function() {
            var that = this;
            this.input.each(function () {
                var $this = $(this);
                var parent = $this.parent();
                that.checkError($this, parent);
            });
        },

        checkError: function(input, parent) {
            var typeData = input.attr(this.attr);

            switch (this.isValidValue(input)) {
                case true:
                    this.hideError(parent);
                    break;
                case false:
                    this.showError(parent, typeData);
            }
        },

        hideError: function (parent) {
            parent.removeClass(this.errorClass);
        },

        showError: function(parent, typeData) {
            var errorTextContainer = parent.find('[' + this.attrError + ']');
            parent.addClass(this.errorClass);
        },

        watch: function (input, parent) {
            var that = this;
            input.on('blur', function () {
                var value = $(this).val();
                if(value == '') return;
                that.checkError($(this), parent);
            });
            input.on('input', function () {
                that.hideError(parent);
            });
        },

        addMaskTel: function() {
            this.formTel = form.find('input[' + this.attr + '="tel"]');
            if(!this.formTel.length) return;

            this.formTel.inputmask({
                mask: "+7 (999) 999 99 99",
                placeholder: "_",
                showMaskOnHover: false
            });
        },

        addMaskEmail: function () {
            this.formEmail = form.find('input[' + this.attr + '="email"]');
            if(!this.formEmail.length) return;

            this.formEmail.inputmask('email', {
                placeholder: "",
            });
        },

        addResizeTextArea: function() {
            var textarea = form.find('[' + this.attr + '="textarea"]');
            if(!textarea.length) return;
            autosize(textarea);
        },

        isValidEmail: function(address) {
            var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            return reg.test(address) == true;
        },

        disabledFields: function() {
            this.input.each(function () {
                $(this).parent().addClass('disabled');
                $(this).attr('disabled', true);
            })
            var textarea = form.find('[' + this.attr + '="textarea"]');
            if(!textarea.length) return;
            textarea.parent().addClass('disabled');
            textarea.attr('disabled', true);
        },

        resetFields: function() {
            this.input.each(function () {
                $(this).parent().removeClass('disabled');
                $(this).val('')
                $(this).attr('disabled', false);
            })
            var textarea = form.find('[' + this.attr + '="textarea"]');
            if(!textarea.length) return;
            textarea.val('');
            textarea.parent().removeClass('disabled');
            textarea.attr('disabled', false);
        },

        isValidValue: function (input) {
            var value;
            var typeData = input.attr(this.attr);

            var isValid = false;
            switch (typeData) {
                case 'tel':
                    value = input.inputmask('unmaskedvalue');
                    isValid = (value.length == 10);
                    break;
                case 'text':
                    value = input.val();
                    isValid = (value !== '');
                    break;
                case 'email':
                    value = input.val();
                    isValid = this.isValidEmail(value);
                    break;
            };
            return isValid;
        },

        init: function () {
            var that = this;
            this.input = this.form.find('input['+ this.attr +'][required]');

            this.addMaskTel();
            this.addMaskEmail();
            this.addResizeTextArea();

            this.input.each(function () {
                var input = {};
                input.input = $(this);
                input.parent = $(this).parent();
                input.type = $(this).attr(that.attr);
                that.arrayInput.push(input);
                that.watch(input.input, input.parent);
            });
        }
    }

    return validate;
};


function submitForm(form, params) {
    // var form = $(formClass);
    if (!form.length) return;

    var validate = validateForm(form);
    validate.init();


    form.on('click', 'button[type="submit"]', function (evt) {
        evt.preventDefault();
        validate.checkAllError();
        var button = form.find('button[type="submit"]');

        if(!validate.isSubmitForm()) return;

        var paramsAjax = {
            type: 'POST',
            url: params.url,
            dataType: 'json',
            data: form.serializeArray(),
            onSuccess: function () {

                //при интеграции надо удалить setTimeout
                setTimeout(function () {
                    params.success();
                    validate.resetFields();
                    button.attr('disabled', false);
                }, 1000)
            },
            onError: function () {
                //form[0].reset();
            },
        }

        //при отправке аякса блокирую поля формы и добавляю disabled кнопке
        button.attr('disabled', true);
        validate.disabledFields();

        onSendAjax(paramsAjax);
    })
}

$('.js-form').each(function () {
    var form = submitForm($(this), {
        url: $(this).attr('action'),
        success: function () {
            sidePageController.runSuccessPage();
        }
    });
})


function Modal() {
    this.modal = $('.modal');
    this.cbCloseModal = function () {return true};
    this.keys = {
        ESCAPE: 'Escape'
    }
}



Modal.prototype.setCloseCb = function (cb) {
    this.cbCloseModal = cb;
}

Modal.prototype.open = function () {
    var _this = this;
    overflowHidden();
    this.modal.css({
        'visibility': 'visible',
        'z-index': '20'
    });

    this.modal.animate({
        top: '0',
        opacity: 1
    }, {
        easing: $.bez([0.215, 0.61, 0.355, 1]),
        duration: 400,
        complete: function () {
        }
    })
}

Modal.prototype.close = function (cb) {
    var _this = this;
    this.modal.animate({
        top: '80px',
        opacity: 0
    }, {
        duration: 400,
        easing: $.bez([0.215, 0.61, 0.355, 1]),
        complete: function () {
            _this.modal.css({
                'visibility': '',
                'z-index': ''
            });
            _this.cbCloseModal();
        }
    })
}

var modal = new Modal();
function newsListSlider() {
    var slider = false;
    var screenWidth = $(window).width();
    var isMobile = screenWidth > 767 ? false : true;
    var newsList = $('.js-news-slider');
    if (!newsList.length) return;
    var newsLenght = newsList.find('.news-list__item').length;

    if(screenWidth <= 767) {
        var swiperContainer = newsList.find('.swiper-container');

        if(newsLenght < 2) return;
        slider = new Swiper(swiperContainer[0], {
            slidesPerView: 'auto',
            spaceBetween: 8,
        })
    }

    $(window).resize(function () {
        var screenWidth = $(window).width();
        if(screenWidth > 767 && isMobile) {
            slider.destroy(true, true);
            isMobile = false;
        } else if(screenWidth <= 767 && !isMobile) {
            if(!slider) {
                isMobile = true;
                slider = new Swiper(swiperContainer[0], {
                    slidesPerView: 'auto',
                    spaceBetween: 8,
                })
            }
        }
    })
}

newsListSlider();

function FirstNew() {
    this.news = $('.news');
    if(!this.news.length) return;
    this.init();

    this.resize();
}

FirstNew.prototype.init = function () {
    var screenWidth = $(window).width();
    var isMobile = screenWidth > 767 ? false : true;
    this.news = $('.news');
    var firstChild = this.news.find('.news-list__wrap').eq(0);
    var newsLenght = this.news.find('.news-list__item').length;
    if(!isMobile) {
        var sliderHeight = firstChild.height();

        if(newsLenght > 5) {
            // firstChild.css({
            //     'position': 'sticky',
            //     'top': '115rem',
            // })
        } else {
            this.news.find('.news-list__list').css('min-height', sliderHeight);
            firstChild.css('flex', '1');
        }

    } else {
        this.removeStyles();
    }

}

FirstNew.prototype.removeStyles = function () {
    this.news.find('.news-list__wrap').eq(0).attr('style', '');
    this.news.find('.news-list__list').css('min-height', '');
}

FirstNew.prototype.resize = function () {
    var _this = this;
    $(window).resize(function () {
        _this.removeStyles();
        _this.init();
    })
}

var firstNew = new FirstNew();


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




function SidePageOverlay() {
    this.template = $('<div class="overlay-side-page"></div>');
}

SidePageOverlay.prototype.setWidth = function (width) {
    this.template.css({width: width})
}

SidePageOverlay.prototype.render = function () {
    $('body').append(this.template);
}

SidePageOverlay.prototype.isRender = function () {
    return !!$('.overlay-side-page').length;
}

SidePageOverlay.prototype.remove = function () {
    var _this = this;
    this.template.animate({
        opacity: 0
    }, {
        duration: 200,
        easing: $.bez([0.42, 0.0, 0.58, 1.0]),
        complete: function () {
            _this.template.remove();
            _this.template.css({opacity: ''})
        }
    });
}

function OverlayController() {
    this.template = $('<div class="overlay"></div>');
    //this.init();
}

OverlayController.prototype.render = function () {
    if(!this.isRendered()) {
        $('body').prepend(this.template);
    } else {
        this.template = $('.overlay');
    }
}

OverlayController.prototype.remove = function () {
    var _this = this;
    this.template.animate({
        opacity: 0
    },200, function () {
        _this.template.remove();
        _this.template.css({
            'opacity': '',
            'top': ''
        })
    })
}

OverlayController.prototype.setTopCoord = function (topCoord) {
    this.top = topCoord;
    this.template.css({top: topCoord});
}

OverlayController.prototype.getTopCoord = function () {
    return this.top;
}

OverlayController.prototype.setRightCoord = function (rightCoord) {
    this.right = rightCoord;
    this.template.css({right: rightCoord});

}

OverlayController.prototype.isRendered = function () {
    return $('.overlay').length;
}
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

function initProductCardSlider() {
    var slider = $('.js-product-slider');
    if(!slider.length) return;
    var sliderContainer = slider.find('.swiper-container');

    var slidesCount = slider.find('.swiper-slide');
    if(slidesCount < 2) return;

    var swiper = new Swiper(sliderContainer[0], {
        slidesPerView: 'auto',
        slidesPerView: 1,
        spaceBetween: 0,
        grabCursor: true,
        navigation: {
            nextEl: slider.find('.swiper-arrow.right')[0],
            prevEl: slider.find('.swiper-arrow.left')[0],
            disabledClass: 'disabled'
        },
        pagination: {
            el: slider.find('.bullet-list')[0],
            type: 'bullets',
            bulletClass: 'bullet-list__item',
            bulletActiveClass: 'active',
        },
        on: {
            init: function (slider) {
                $(slider.slides).each(function (index) {
                    $(this).attr('data-index', index)
                })
            }
        }
    })


    slider.find('.js-full-size-gallery').on('click', function () {
        var sliderNumber = $(this).attr('data-index');
        openFullGallery(slider, sliderNumber);
    })

}

initProductCardSlider();


//добавление скроллбара для sidepage
function scrollSidePage() {
    var scrollbarContainer = $('.js-scrollbar-side-page');
    if(!scrollbarContainer.length) return;
    scrollbarContainer.scrollbar();
}
//добавление скроллбара для sidepage
function scrollSidePageCheckLocation() {
    var scrollbarContainer = $('.js-check-location .js-scrollbar-side-page');
    if(!scrollbarContainer.length) return;
    scrollbarContainer.scrollbar();
}
scrollSidePageCheckLocation();

function SidePageController() {
    this.overlay = new SidePageOverlay();
    this.closeAllSidePage = $.proxy(this.closeAllSidePage, this);
}

/**
 * открывает sidepage
 * принимает cb после закрытия окна и элемент, который надо закрыть
 * */
SidePageController.prototype.closeAllSidePage = function () {
    var _this = this;
    $('body').off('click', '.overlay-side-page', this.closeAllSidePage);
    $('.side-page__close').off('click');

    $('.js-side-page').each(function () {
        var that = $(this);
        _this.closeSidePage({
            sidePage: $(this),
            complete: function () {
                _this.afterAnimationClose();
                if(!that.hasClass('js-side-page-default')) {
                    $('.product-card__side-page-content').append(that.find('.js-side-page-content'));
                    that.remove();
                }
            }
        })
    })
}

SidePageController.prototype.openSidePage = function ({sidePage, removeAfterClose = true, afterAnimationClose = function() {return false}, beforeClose = function() {return false}, complete = function() {return false}}) {
    this.afterAnimationClose = afterAnimationClose;
    //добавляю отступы, чтобы не дергался экран при удалении скроллбара
    alignBlocks(getScrollbarSize())
    // $('header').css('paddingRight', getScrollbarSize());
    // $('html').css('marginRight', getScrollbarSize());
    overflowHidden();
    function stepAnimation() {return};
    var _this = this;
    var width = sidePage.width();
    var isRenderOverlay = this.overlay.isRender();

    if(!isRenderOverlay) {
        this.overlay.render();
        $('body').on('click', '.overlay-side-page', this.closeAllSidePage);

        // если не был отрендерен оверлей, то в step падает новая фукнция
        stepAnimation = function (step) {
            var overlayWidth = width + step;
            _this.overlay.setWidth('calc(100% - ' + overlayWidth + 'px');
        }
    }

    var btnClose = sidePage.find('.side-page__close');
    btnClose.on('click', closeModal);

    sidePage.animate({
        right: 0,
    }, {
        duration: 400,
        easing: $.bez([0.42, 0.0, 0.58, 1.0]),
        complete: function () {
            complete();
        },
        step: function (step) {
            stepAnimation(step);
        }
    })

    function closeModal() {
        $('body').off('click', '.overlay-side-page', this.closeAllSidePage);
        _this.closeSidePage({
            beforeClose: beforeClose,
            sidePage: sidePage,
            complete: function () {
                afterAnimationClose();
                btnClose.off('click', closeModal);
                if(removeAfterClose) {
                    sidePage.remove();
                }
            }
        })
    }
}
/**
 * закрывает sidepage,
 * принимает cb после закрытия окна и элемент, который надо закрыть
 * */
SidePageController.prototype.closeSidePage = function ({sidePage, complete = function() {return false} , removeOverlay = true}) {
    var _this = this;
    var screenWight = $(window).width();
    var width = sidePage.width();
    var right = screenWight > 767 ? '-576rem' : '-100%';
    function stepAnimate() {return false};

    if(removeOverlay) {

        stepAnimate = function (step) {
            var overlayWidth = width + (step * (screenWight/1440));
            if(screenWight > 767) {
                _this.overlay.setWidth('calc(100% - ' + overlayWidth + 'px');
            } else {
                _this.overlay.setWidth(step * -1 + '%');
            }

        }
    }
    sidePage.animate({
        right: right,
    }, {
        duration: 400,
        easing: $.bez([0.42, 0.0, 0.58, 1.0]),
        complete: function () {
            complete();
            if(removeOverlay) {
                overflowInherit();
                alignBlocks('')
                // $('header').css('paddingRight', '');
                $('html').css('marginRight', '');
                _this.overlay.remove();
            }
        },
        step: function (step) {
            stepAnimate(step)
        }
    })
}

SidePageController.prototype.defaultPageTemplate = function () {
    return $('<div class="side-page light js-side-page">\n' +
        '        <div class="side-page__inner">\n' +
        '          <div class="side-page__head">\n' +
        '            <div class="side-page__close js-side-page-close">\n' +
        '              <button class="button-close">\n' +
        '                <div class="button-close__icon"></div>\n' +
        '              </button>\n' +
        '            </div>\n' +
        '          </div>\n' +
        '          <div class="side-page__body scrollbar-inner js-scrollbar-side-page">\n' +
        '            <div class="side-page__in">\n' +
        '            </div>\n' +
        '          </div>\n' +
        '        </div>\n' +
        '      </div>')
}
SidePageController.prototype.getSuccessPageTemplate = function () {
    return $('<div class="side-page js-side-page-success dark js-side-page">\n' +
        '        <div class="side-page__inner">\n' +
        '          <div class="side-page__head">\n' +
        '            <div class="side-page__close">\n' +
        '              <button class="button-close">\n' +
        '                <div class="button-close__icon"></div>\n' +
        '              </button>\n' +
        '            </div>\n' +
        '          </div>\n' +
        '          <div class="scroll-wrapper side-page__body">\n' +
        '            <div class="side-page__in">\n' +
        '              <div class="side-page__wrapper">\n' +
        '                <h3 class="side-page__title-gold">Спасибо за&nbsp;заявку</h3>\n' +
        '                <p class="side-page__subtitle">В ближайшее время с вами свяжутся</p>\n' +
        '              </div>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '      </div>')
}

// открытие и закрытие модального окна успешной отправки формы
SidePageController.prototype.renderSidePage = function ({template, complete = function() {return false}, content = false}) {
    if(content) {
        var sidePageContent = content;
        template.find('.side-page__in').append(sidePageContent);
    }

    $('body').append(template);
    scrollSidePage();

    this.openSidePage({
        sidePage: template,
        afterAnimationClose: function () {
            $('.product-card__side-page-content').append(sidePageContent)
        },
        complete: function () {
            complete();
        }
    })
}

SidePageController.prototype.runSuccessPage = function () {
    function closeOtherSidePage() {
        $('.js-side-page:not(.js-side-page-success):not(.js-side-page-default)').each(function () {
            var that = $(this);
            _this.closeSidePage({
                sidePage: that,
                removeOverlay: false,
                complete: function () {
                    $('.product-card__side-page-content').append(that.find('.js-side-page-content'));
                    that.remove();
                }
            })
        })
    }

    var _this = this;
    var sidePageSuccess = this.getSuccessPageTemplate();
    $('body').append(sidePageSuccess);

    this.openSidePage({
        sidePage: sidePageSuccess,
        complete: function () {
            closeOtherSidePage();
            setTimeout(function () {
                _this.closeAllSidePage();
            }, 2000);
        }
    })
}

var sidePageController = new SidePageController();
// alignBlocks(getScrollbarSize())
function SpoilerBar() {
    this.bar = $('.spoiler-bar');
    this.toggle = $.proxy(this.toggle, this);
    this.activeClass = 'show';
    this.btnText = {
        SHOW: 'развернуть',
        HIDE: 'свернуть'
    }
    this.init();
}

SpoilerBar.prototype.hideBlock = function (body) {
    var button = body.parent().find('.spoiler-bar__button');
    var _this = this;

    body.animate({
        height: 0
    }, 400, function () {
        button.text(_this.btnText.SHOW)
    })
}

SpoilerBar.prototype.showBlock = function (body) {
    var height = body.find('.spoiler-bar__body-in').outerHeight(true);
    var button = body.parent().find('.spoiler-bar__button');
    var _this = this;
    body.animate({
        height: height
    }, 400, function () {
        button.text(_this.btnText.HIDE);
        body.css('height', '');
    })
}

SpoilerBar.prototype.toggle = function (target) {
    var body = target.next();
    var spoiler = target.parent();

    if(spoiler.hasClass(this.activeClass)) {
        this.hideBlock(body);
        spoiler.removeClass(this.activeClass);
    } else {
        this.showBlock(body);
        spoiler.addClass(this.activeClass);
    }
}

SpoilerBar.prototype.init = function () {
    var _this = this;
    $('body').on('click', '[data-target="spoiler"]', function () {
        _this.toggle($(this))
    });
}

var spoilerBar = new SpoilerBar();
function tab(target) {
    var activeClass = 'active';
    var disabledClass = 'disabled';
    var selectAttr = 'data-selected';
    var parentClass = '.tabs';
    var groupName = target.closest(parentClass).attr('data-tab-group');
    var group = $('.tab-content[data-tab-group="'+ groupName + '"]');

    if(target.hasClass(activeClass) || target.hasClass(disabledClass) ) return;

    var contentId = target.attr('data-id-content');
    var content = group.find('[data-content="'+ contentId + '"]');

    if(contentId == 'all') {
        group.find('[data-content]').each(function () {
            show($(this));
        })

        hide($('.nav-tabs__item.' + activeClass));
        show(target);
        return;
    }

    function show(element) {
        element.addClass(activeClass);
        element.attr(selectAttr, true);
    }

    function hide(element) {
        element.removeClass(activeClass);
        element.attr(selectAttr, false);
    }

    hide($('.nav-tabs__item.' + activeClass));
    hide($('.tab-content__item.' + activeClass));

    show(content);
    show(target);
}

$('body').on('click', '[data-target="tab"]', function () {
    tab($(this));
});

function staffGrid() {
    var staffBlock = $('.js-staff');
    if(!staffBlock.length) return;


    staffBlock.on('click', '.staff__img', function () {
        console.log('adsfadf')
        var screenWidth = $(window).width();
        if(screenWidth < 768) onHoverStaff($(this));

    })

    staffBlock.on('mouseleave', '.staff__item', function () {
        var screenWidth = $(window).width();
        if(screenWidth > 768) onHoverStaff($(this));

    });

    staffBlock.on('mouseenter', '.staff__item', function () {
        var screenWidth = $(window).width();
        if(screenWidth > 768) onHoverStaff($(this));

    });

    function onHoverStaff(block) {
        var img = block.find('img');
        if(img.length > 1) {
            img.toggleClass('hide')
        }
    }

    staffBlock.each(function () {
        var staffItem = $(this).find('.js-staff-content');
        if(!staffItem.length) return;
        applyWight(staffItem)
    })

    $(window).resize(function () {
        $('.js-staff-content').parent().css('width', '');
        var screenWidth = $(window).width();

        if(screenWidth > 767) {
            staffBlock.each(function () {
                var staffItem = $(this).find('.js-staff-content');
                if(!staffItem.length) return;
                applyWight(staffItem)
            })
        }
    })

    function applyWight(content) {
        var maxWidth = 0;

        content.each(function () {
            var width = $(this).width();
            maxWidth = width > maxWidth ? width : maxWidth;
        })

        content.each(function () {
            $(this).parent().css('width', maxWidth);
        })
    }
}

staffGrid();
function getTableWrapper() {
    var table = $('.catalog-content table');

    if(!table.length) return;

    table.each(function () {
        $(this).wrap('<div class="table-wrap"></div>')
    })

}

getTableWrapper()
function YoutubeSlider() {
    this.slider = $('.js-yt-slider');
    this.initFrame = $.proxy(this.initFrame, this);
    if(!this.slider.length) return;
    this.videoWrapper = this.slider.find('.yt-slider__video-wrapper');
    this.preloader = this.slider.find('.yt-slider__preloader');
    this.init();
}

YoutubeSlider.prototype.initFrame = function (evt) {
    var _this = this;
    var target = $(evt.target);
    var containerVideo = target.parent();
    if(containerVideo.hasClass('active')) return;
    this.slider.find('.yt-slider__thumbs-item.active').removeClass('active');
    containerVideo.addClass('active');
    var idVideo = containerVideo.attr('data-video');

    var iframe = $('<iframe>').attr({
        'frameborder': '0',
        'allowfullscreen': '',
        'src': 'https://www.youtube.com/embed/' + idVideo + '?enablejsapi=1',
        'width': '100%',
        'height': '100%',
        'style': 'opacity: 0'
    });

    this.videoWrapper.children().remove();
    this.videoWrapper.append(iframe);
    this.preloader.css('opacity', 1);

    iframe.on('load', function () {
        _this.videoWrapper.find('.yt-slider__preloader').css('opacity', 0);
        iframe.css('opacity', 1);
    })

}

YoutubeSlider.prototype.initFirstVideo = function () {
    var _this = this;
    var firstVideo = this.videoWrapper.find('frame');
    firstVideo.css('opacity', 0);
    this.preloader.find('frame').css('opacity', 1);
    this.slider.find('.yt-slider__thumbs-item').eq(0).addClass('active');

    firstVideo.on('load', function () {
        _this.videoWrapper.find('.yt-slider__preloader').css('opacity', 0);
        firstVideo.css('opacity', 1);
    })


}
YoutubeSlider.prototype.init = function () {
    var _this = this;
    this.initFirstVideo();
    var sliderContainer = this.slider.find('.swiper-container');

    var swiper = new Swiper(sliderContainer[0], {
        slidesPerView: 'auto',
        // grabCursor: true,
        navigation: {
            nextEl: _this.slider.find('.swiper-arrow.right')[0],
            prevEl: _this.slider.find('.swiper-arrow.left')[0],
            disabledClass: 'disabled'
        },

    })

    this.slider.find('.js-js-slide').on('click', this.initFrame);
}

var yt = new YoutubeSlider();
function VideoPlayerCard() {
    this.slider = $('.js-slider-video');
    this.items = $('.slider-video__iframe');
    this.onClickVideo = $.proxy(this.onClickVideo, this);
    this.scrollVideo = $.proxy(this.scrollVideo, this);
    this.players = {};

    if(!this.slider.length) return;
    this.init();

}

VideoPlayerCard.prototype.init = function () {
    var _this = this;

    // this.initSlider();
    this._initSlider();
    // this.items.each(function (index) {
    //     $(this).on('click', function (){
    //         _this.onClickVideo($(this), index);
    //     })
    // })
}

VideoPlayerCard.prototype._initSlider = function (target, index) {
    var _this = this;
    var sliderParams = {
        slider: this.slider,
        sliderTrack: 'custom-slider__slider-track',
        btnPrev: 'custom-slider__prev',
        btnNext: 'custom-slider__next',
        bulletContainer: 'custom-slider__bullet-list',
        bulletTemplate: $('<li class="custom-slider__bullet-item"></li>'),
        isNeedBtn: false,
        isNeedbullet: true,
        swipeAction: function () {
            _this.stopVideo();
        },

        isNeedFractionPagination: true,
        onClick: function (target) {
            var index = $(target).parent().attr('data-index');
            _this.onClickVideo($(target), index);
        },
    }
    var slider = new CustomSlider(sliderParams);
    slider.init()
}

VideoPlayerCard.prototype.scrollVideo = function (evt) {
    var sliderVideo = $('.js-slider-video');
    var _this = this;
    var scrollTop = $(evt.target).scrollTop();
    var test = _inViewport(sliderVideo, scrollTop);

    if(!test) {
        this.stopVideo();
    }
}


VideoPlayerCard.prototype.initSlider = function (target, index) {
    var container = this.slider.find('.swiper-container');
    if(!container.length) return;
    var _this = this;

    var swiper = new Swiper(container[0], {
        slidesPerView: 'auto',
        centeredSlides: true,
        pagination: {
            el: _this.slider.find('.custom-slider__bullets')[0],
            type: 'bullets',
            clickable: true,
            bulletClass: 'custom-bullet-list__item',
            bulletActiveClass: 'active',
            renderBullet: function (index, className) {
                return '<span class="' + className + '">' + (index + 1) + '</span>';
            },
        },
        on: {
            slideChange: function () {
                var activeVideos = $('.js-slider-video .slider-video__iframe[data-play="play"] iframe');
                activeVideos.each(function () {
                    $(this)[0].contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
                })
            },
        }
    })
}

VideoPlayerCard.prototype.stopVideo = function () {
    var activeVideos = $('.js-slider-video .slider-video__iframe[data-play="play"] iframe');
    console.log(activeVideos)
    activeVideos.each(function () {
        $(this)[0].contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
    })
}

VideoPlayerCard.prototype.onClickVideo = function (target, index) {
    var video = target.find('iframe').attr('id');
    var _this = this;

    if(target.attr('data-play') == 'pause') {
        _this.players[index].playVideo();
        // target.attr('data-play', 'play');
    } else if(target.attr('data-play') == 'play') {
        _this.players[index].pauseVideo();
        // target.attr('data-play', 'pause');
    } else {
        player = new YT.Player(video, {
            events: {
                'onReady': function () {
                    _this.players[index] = player;
                    _this.players[index].playVideo();
                    target.attr('data-play', 'play');
                },
                'onStateChange': function (evt) {
                    if(evt.data == 2) { //поставила на паузу
                        target.attr('data-play', 'pause');
                        $(window).off('scroll', _this.scrollVideo);

                    } else if(evt.data == 1) { // запустилось видео
                        target.attr('data-play', 'play');
                        $(window).on('scroll', _this.scrollVideo);
                    }
                }
            }
        });
    }

}

var videoPlayerCard = new VideoPlayerCard();

function scrollPageHeaderNews() {
    var jarallax = $('.js-parallax-news');
    var screenWidth = $(window).width();
    var headerHeight = getHeaderWidth();

    if(!jarallax.length) return;

    $(window).scroll(function (evt) {
        var scrollTop = $(this).scrollTop();

        var titleHeight = $('.js-scroll-to').offset().top - headerHeight;

        var co = scrollTop/titleHeight;
        jarallax.css('opacity', 1 - co);

        jarallax.css('transform', 'translate3d(0px, '+ scrollTop/3 + 'px, 0px)')
    })
}
scrollPageHeaderNews();

function resizeImgContent() {
    var imgColimn = $('.catalog-content  img');
    var defaultImg

    imgColimn.wrap('<div class="img-wrap"></div>');



}



resizeImgContent()

/************************************HeaderController********************************************/
function HeaderController() {
    this.openMainNavBtb = $('.js-main-nav');
    this.openDropdownBtb = $('.js-dropdown');
    this.closeDropdownBtb = $('.js-dropdown-back');
    this.mainNavList = $('.header__main-nav');
    this.dropdownList = $('.maker-nav__in');
    this.makerNavWrapper = $('.header__maker-nav');
    this.openMakerBtb = $('.js-maker');
    this.mainNav = $('.header__in');
    this.header = $('.header');
    this.headerInner = $('.header__inner');
    this.makerList = $('.header__maker-list');
    this.dropdown = $('.maker-nav__dropdown');
    this.newFixed = $('.header__new-fixed');
    this.openMakerController = $.proxy(this._openMakerController, this);
    this.scrollWindow = $.proxy(this._scrollWindow, this);
    this.makerListIsOpen = false;
    this.dropdownIsOpen = false;
    this.mainNavIsOpen = false;
    this.isMobile = $(window).width() <= 767;
    this.fixedMenuHeight = 65;
    this.makerListItems = $('.maker-list__item');
    this.overlay = new OverlayController();
    this.animateDirecton = {
        FORWARD: 'forward',
        BACKWARD: 'backward'
    }


    this.watchers();
}

HeaderController.prototype.watchers = function () {
    var _this = this;
    this.openMainNavBtb.on('click', function () {
        _this.openMainNav();
    })
    this.openMakerBtb.on('click', function () {
        _this.openMakerController();
    })

    this.closeDropdownBtb.on('click', function (evt) {
        evt.preventDefault();
        // _this.dropdownController();
        _this.header.removeClass('dropdown-open');
        _this.dropdownIsOpen = false;
        _this.dropdown.css({'transition': ''});
        //вернем оверлей в начальное состояние
        _this.overlay.setTopCoord(_this.headerInner.height())
    })

    this.openDropdownBtb.on('click', function (evt) {
        evt.preventDefault();
        _this.dropdownController();
    })

    $('body').on('click', '.overlay', function (evt) {
        evt.preventDefault();
        _this.overlayWatchers();
    })

    $(window).resize('click', function (evt) {
        _this.resize();
    })
}


HeaderController.prototype.resize = function () {
    var screenWight = $(window).width();

    function resetStyle() {
        $('.header').attr('style', '');
        $('.header__inner').attr('style', '');
        // this.overlay.remove();
        $('.header__maker-list').attr('style', '');
        overflowInherit();
    }

    //для оверлея моб. меню
    if(screenWight <= 767 && this.isMobile && this.dropdownIsOpen) {
        var screenHeght = $(window).height();
        console.log(screenHeght)
        $('.overlay').css('top', 'auto');
    }

    if(screenWight > 767 && this.isMobile) {
        this.isMobile = false;

        if(this.mainNavIsOpen) {
            resetStyle();
            this.openMainNavBtb.removeClass('open');

        }
        if(this.makerListIsOpen) {
            resetStyle();
            this.openMakerDesktop();
        }
        if(this.dropdownIsOpen) {
            this.openDropdownDesktopController()
        }

    } else if(screenWight <= 767 && !this.isMobile) {
        //если меньше 768

        if(this.makerListIsOpen) {
            this.resetMakerDesktopStyle();
            this.openMakerMobile();
        }

        if(this.dropdownIsOpen) {
            $('header').css('paddingRight', '');
            $('main').css('marginRight', '');
            $('.maker-nav__dropdown').attr('style', '');
            this.makerNavWrapper.attr('style', '');

            $('.maker-nav__in').scrollbar('destroy');
            this.openMainNav();
            this.openDropdownMobile();
        }

        this.isMobile = true;
    }
}


HeaderController.prototype.overlayWatchers = function () {
    var screenWight = $(window).width();

    if(screenWight > 768) {
        if(this.dropdownIsOpen) {
            this.closeDropdownDesktopController();
        }
    } else {
        if(this.makerListIsOpen) {
            this.closeMakerMobile();
        }
        if(this.mainNavIsOpen) {
            // _this.close
            this.closeMobileMainNav();
        }
    }
}

HeaderController.prototype.getHeightDropdown = function () {
    //высчитываю высоту выпадающего меню и высоту основного меню
    var dropdownListHeight = $('.catalog-dropdown').outerHeight(true) + $('.header__maker-nav').outerHeight(true);
    var menuHeight = $('.header-wrap').outerHeight(true);
    var maxHeight = 0.92 * $(window).height() - menuHeight;
    console.log(dropdownListHeight, maxHeight)
    console.log(dropdownListHeight > maxHeight ? maxHeight : dropdownListHeight)
    return dropdownListHeight > maxHeight ? maxHeight : dropdownListHeight;
}

HeaderController.prototype.animateDropdownMenu = function (height, cb) {
    var _this = this;
    var headerHeight = $('.header').height();
    this.makerNavWrapper.animate({
        height: height
    }, {
        step: function (step) {
            _this.overlay.setTopCoord(step + headerHeight);
        }
    }).promise().then(function () {
        if(cb) {
            cb();
        }
    })
}

function alignBlocks(value) {
    $('.header-wrap').css('paddingRight', value);
    $('.maker-nav').css('paddingRight', value);
    $('.catalog-dropdown').css('marginRight', value);
    $('.page-footer').css('marginRight', value);
    $('main').css('marginRight', value);
}

HeaderController.prototype.openDropdownDesktopController = function () {
    var _this = this;
    this.openDropdownBtb.addClass('open');
    this.overlay.render();
    this.dropdownIsOpen = true;
    this.animateDropdownMenu(this.getHeightDropdown(), function () {
        _this.dropdown.animate({opacity: 1});
        overflowHidden();
        alignBlocks(getScrollbarSize())
        $('.maker-nav__in').scrollbar();
    })

}

HeaderController.prototype.closeDropdownDesktopController = function () {
    var _this = this;
    this.openDropdownBtb.removeClass('open');
    this.dropdownIsOpen = false;
    _this.dropdown.animate({'opacity': 0}, function () {
        var newHeight = $('.maker-nav').height();
        _this.animateDropdownMenu(newHeight, function () {
            overflowInherit();
            alignBlocks('')
            $('.maker-nav__in').scrollbar('destroy');
            _this.overlay.remove();
            _this.makerNavWrapper.css('height', '');
        })
    });
}

HeaderController.prototype.dropdownDesktopController = function () {

    if(this.dropdownIsOpen) {
        this.closeDropdownDesktopController();
        // если меню открыто

    } else {
        // если меню закрыто
        this.openDropdownDesktopController();
    }

}

HeaderController.prototype.openDropdownMobile = function () {
    var screenHeight = $(window).height();
    this.header.addClass('dropdown-open');
    $('.overlay').css('top', 'auto');
    this.dropdownIsOpen = true;
}

HeaderController.prototype.dropdownMobileController = function () {
    //возвращаю transition в дефолтное состояние
    //если открыто меню производителей - закрываю его
    if(this.makerListIsOpen) {
        this.closeMaker();
    }
    this.dropdown.css({'transition': ''})
    switch (this.dropdownIsOpen) {
        case true:
            this.header.removeClass('dropdown-open');
            overflowInherit();
            this.dropdownIsOpen = false;
            break;
        case false:
            this.openDropdownMobile();
            break;
    }
}

HeaderController.prototype.dropdownController = function () {
    var screenWight = $(window).width();

    if(screenWight > 768) {
        this.dropdownDesktopController()
    } else {
        this.dropdownMobileController()
    }
}


HeaderController.prototype.closeMakerMobile = function () {
    this.makerListIsOpen = false;
    this.openMakerBtb.removeClass('open');
    var _this = this;
    var screenHeight = $(window).height();
    var newHeight = this.headerInner.height() - this.makerList.outerHeight();
    var bonus = this.mainNavIsOpen ? this.mainNav.height() : 0;

    this.header.off('scroll', this.scrollWindow);
    this.headerInner.animate({
        height: newHeight
    },  {
        duration: 500,
        step: function (step) {
            _this.overlay.setTopCoord(step);
            var newTop = step - _this.makerList.outerHeight() - bonus;
            _this.makerList.css('top', newTop);
            // если высота контента меньше высоты экрана, убираем bottom
            if(step <= screenHeight) {
                _this.header.css({
                    bottom: '',
                    height: step
                })
            }
        },
    }).promise().then(function () {
        _this.newFixed.css('border-bottom', '');
        if(!_this.mainNavIsOpen) {
            _this.overlay.remove();
            overflowInherit();
        }
    })
}
// добавляю бордер при скролле header
HeaderController.prototype._scrollWindow = function (evt) {
    if(evt.target.scrollTop > this.makerList.height()) {
        this.newFixed.css('border-bottom', '');
    } else {
        this.newFixed.css('border-bottom', '0');
    }
}


HeaderController.prototype.resetMakerDesktopStyle = function () {
    this.makerListItems.css('opacity', '');
    this.makerList.attr('style', '');
    this.mainNavList.css('visibility', '');

}
HeaderController.prototype.closeMakerDesktop = function () {
    var _this = this;
    this.animateMakerItem(this.makerListItems.length - 1, this.animateDirecton.BACKWARD, function () {
        _this.resetMakerDesktopStyle();
        // _this.makerListItems.css('opacity', '');
        // _this.makerList.attr('style', '');
        // _this.mainNavList.css('visibility', '');
    })
}
HeaderController.prototype.openMakerDesktop = function () {
    this.mainNavList.css('visibility', 'hidden');
    this.makerList.css('zIndex', 0);
    this.makerList.css('opacity', 1);

    this.animateMakerItem(0, this.animateDirecton.FORWARD, function () {
    })
}

HeaderController.prototype.closeMaker = function () {
    var screenWight = $(window).width();
    this.makerListIsOpen = false;
    this.openMakerBtb.removeClass('open');

    if(screenWight < 768) {
        this.closeMakerMobile();
    } else {
        this.closeMakerDesktop();
    }
}

HeaderController.prototype.openMaker = function () {
    var screenWight = $(window).width();
    this.makerListIsOpen = true;
    this.openMakerBtb.addClass('open');

    if(screenWight < 768) {
        this.openMakerMobile();
    } else {
        this.openMakerDesktop();
    }
}

// открытие меню
HeaderController.prototype.openMakerMobile = function () {
    var _this = this;
    var screenHeight = $(window).height();

    overflowHidden();
    this.overlay.render();
    var newHeight = this.headerInner.height() + this.makerList.height();
    _this.newFixed.css('border-bottom', '0');

    this.header.on('scroll', this.scrollWindow);

    if(this.mainNavIsOpen) {
        // если открыто меню производителей
        this.headerInner.animate({
            height: newHeight,
        }, {
            step: function (step) {
                //начиная с начальной высоты заканчивая new
                _this.overlay.setTopCoord(step);
                _this.header.css('height', step);
                var h = _this.makerList.outerHeight() + _this.mainNav.height();
                _this.makerList.css('top', step - h);
            },
        }).promise().then(function() {
            if(newHeight > screenHeight) {
                _this.header.css({
                    'bottom': 0,
                    'height': 'auto'
                })
            }

        })
    } else {
        this.overlay.render();
        this.header.animate({
            height: newHeight,
        }, {
            step: function (step) {
                _this.overlay.setTopCoord(step);
                _this.headerInner.css('height', step);
                _this.makerList.css('top', step - _this.makerList.height())
                _this.header.css('height', step);
            },
        }).promise().then(function() {
            if(newHeight > screenHeight) {
                _this.header.css({
                    'bottom': 0,
                    'height': 'auto'
                })
            }
        });
    }
}
HeaderController.prototype._openMakerController = function () {

    switch (this.makerListIsOpen) {
        case true:
            this.closeMaker();
            break;
        case false:
            this.openMaker();
            break;
    }
}

HeaderController.prototype.closeMobileMainNav = function () {
    var screenHeight = $(window).height();
    var _this = this;

    this.openMainNavBtb.removeClass('open');
    var newHeight = this.headerInner.height() - this.mainNav.height();

    //если открыто подменю
    if(this.dropdownIsOpen) {
        this.dropdownIsOpen = false;
        this.headerInner.css('height', screenHeight); // меняю высоту основного контейнера, чтобы корректно уехал оверлей
        // убираю transition чтобы не было анимации при закрытии меню
        this.dropdown.css({
            'top': 'auto',
            'transition': 'none'
        });
        this.dropdown.animate({
            bottom: '100%',
        }, {
            // duration: 15000,
            complete: function () {
                _this.header.removeClass('dropdown-open');
                _this.dropdown.css({
                    'top': '',
                    'bottom' : '',
                })
            }
        })
    }

    this.headerInner.animate({
        height: newHeight,
    }, {
        // duration: 15000,
        step: function (step) {
            _this.overlay.setTopCoord(step)
            _this.headerInner.css('height', step);
            // если высота контента меньше высоты экрана, убираем bottom
            if(step <= screenHeight) {
                _this.header.css({
                    bottom: '',
                    height: step
                })
            }
        },
    }).promise().then(function () {
        if(!_this.makerListIsOpen) {
            _this.overlay.remove();
            overflowInherit();
        }
    })
    this.mainNavIsOpen = false;
}

HeaderController.prototype.openMainNav = function () {
    switch (this.mainNavIsOpen) {
        case false:
            this.openMainNavBtb.addClass('open');
            overflowHidden();
            var newHeight = this.headerInner.height() + this.mainNav.height();
            this.animateMainNav(newHeight);
            this.mainNavIsOpen = true;
            break;
        case true:
            this.closeMobileMainNav();
            break;
        // если открыто меню
    }
}

HeaderController.prototype.animateMainNav = function (height) {
    var _this = this;
    var screenHeight = $(window).height();
    this.overlay.render();
    this.header.animate({
        height: height,
    }, {
        step: function (step) {
            _this.headerInner.css('height', step);
            _this.overlay.setTopCoord(step);
        },
    }).promise().then(function () {
        // если высота контента больше высоты экрана, header добавляем свойства
        if(height > screenHeight) {
            _this.header.css({
                'bottom': 0,
                'height': 'auto'
            })
        }
    })
}


//анимация скрытия и отображения пунктов меню
HeaderController.prototype.animateMakerItem = function (i, direction, cb) {
    var _this = this;
    var item = i;
    this.makerListItems.eq(item).animate({
        opacity: direction == (_this.animateDirecton.FORWARD) ? 1 : 0,
    }, 120, "linear", function () {
        item = direction == (_this.animateDirecton.FORWARD) ? item + 1 : item - 1;
        if(
            (direction == _this.animateDirecton.FORWARD && item < _this.makerListItems.length) ||
            (direction == _this.animateDirecton.BACKWARD && item >= 0)
        ) {
            _this.animateMakerItem(item, direction, cb)
        } else {
            cb();
        }
    })
}



var controller = new HeaderController();
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
$('.js-open-region').on('click', function () {
    var sidePage = $('.js-check-location');
    if(!sidePage.length) return;

    sidePageController.openSidePage({
        sidePage: sidePage,
        removeAfterClose: false,
        afterAnimationClose: function () {
            selectLocation.reset();
        }
    })
})

function SelectLocation() {
    this.search = $.proxy(this.search, this);
    this.selectInput = $('.js-select-location');
    this.searchList = $('.js-location-list .location-list__item:not(.active)');
    if(!this.selectInput.length) return;
    this.init();
}

SelectLocation.prototype.reset = function () {
    this.selectInput.val('');
    this.searchList.each(function () {
        $(this).removeClass('hidden');
    })
}

SelectLocation.prototype.init = function () {
    $('body').on('input', '.js-select-location', debounce(this.search, 500));
}

SelectLocation.prototype.search = function (evt) {
    var _this = $(evt.target);
    console.log(_this);
    var searchData = _this.val().trim().toLowerCase();

    this.searchList.each(function () {
        var title = $(this).attr('data-name');

        var isIncludes = title.toLowerCase().includes(searchData);

        if(!isIncludes) {
            $(this).addClass('hidden');
        } else {
            $(this).removeClass('hidden');
        }
    })
}

var selectLocation = new SelectLocation();
function MainSlider() {
    this.slider = $('.js-main-slider');
    this.swiperContainer = this.slider.find('.swiper-container')[0];
    this.sliderItem = $('.main-slider__item');
    this.resize = $.proxy(this._resize, this);
    this.indexCounter = 1;
    this.swiperObj = false;
    this.watcherInit = false;
    this.easeOutCubic = 'cubic-bezier(0, 0, 0.15, 1)';
    this.init();
}

MainSlider.prototype.transform = function () {
    var containerWidth = this.slider.width();
    var coef = containerWidth / 2 / 3;
    var elemWidth = this.sliderItem.eq(0).width();

    return elemWidth - coef;
}

MainSlider.prototype.initDesktop = function () {
    this.transformCoef = 0;
    var _this = this;

    for(var i = this.sliderItem.length - 1; i >=0; i--) {
        this.sliderItem.eq(i).css('zIndex', this.indexCounter);
        this.indexCounter++;
    }

    this.sliderItem.each(function (i) {
        $(this).attr('data-index', i+1);
        $(this).css('transform', 'translate(-' + _this.transformCoef + 'px), 0');
        _this.transformCoef = _this.transformCoef + _this.transform();
    })

    if(!this.watcherInit) {
        this.watcher();
        this.watcherInit = true;
    }

}

MainSlider.prototype.initMobile = function () {
    this.swiperObj = new Swiper(this.swiperContainer, {
        slidesPerView: 'auto',
        spaceBetween: 0,

    })
}

MainSlider.prototype.init = function () {
    if(!this.slider.length) return;
    var screenWidth = $(window).width();
    var _this = this;
    this.swiperObj = false;
    if(screenWidth < 767) {
        this.initMobile();
    } else {
        this.sliderItem.eq(0).addClass('active');
        this.initDesktop();
    }

    $(window).on('resize', this.resize)
}


MainSlider.prototype.resetDesktopStyles = function () {
    $('.main-slider__item').css({
        'transform' : '',
        'zIndex': ''
    })

    $('.main-slider__item').unbind('mouseenter mouseleave');
}

MainSlider.prototype._resize = function() {
    var screenWidth = $(window).width();
    if(screenWidth > 767) {
        if(this.swiperObj) {
            console.log(this.swiperObj)
            this.swiperObj.destroy(true, true);
            this.swiperObj = false;
        }
        this.initDesktop();
    } else {
        this.watcherInit = false;
        this.resetDesktopStyles();
        if(!this.swiperObj) {
            this.initMobile();
        }
    }

}

MainSlider.prototype.watcher = function () {
    var _this = this;
    $('.main-slider__item').hover(function () {
        if($(this).hasClass('active')) return;
        $('.main-slider__item.active').removeClass('active');
        $(this).addClass('active');
        var index = $(this).attr('data-index');
        _this.sliderItem.each(function (i) {
            var currInd = i + 1;

            if(currInd < index) {
                var currTransform = _this.transform() * i + _this.transform();
                $(this).transition({ x: '-' + currTransform + 'px' }, 300, _this.easeOutCubic);
            } else if(currInd >= index) {
                    var currTransform = _this.transform() * i;
                    $(this).transition({ x: '-' + currTransform + 'px' }, 300, _this.easeOutCubic);
            }
        })
    })
}

var mainSlider = new MainSlider()

