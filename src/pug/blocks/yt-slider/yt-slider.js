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