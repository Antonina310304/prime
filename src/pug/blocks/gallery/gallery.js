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
