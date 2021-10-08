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
