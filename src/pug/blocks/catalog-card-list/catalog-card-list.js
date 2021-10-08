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

