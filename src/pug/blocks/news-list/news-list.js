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

