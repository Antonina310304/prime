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

