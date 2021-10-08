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

