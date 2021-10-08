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