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
