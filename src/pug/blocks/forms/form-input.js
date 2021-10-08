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