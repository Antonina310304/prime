function SidePageOverlay() {
    this.template = $('<div class="overlay-side-page"></div>');
}

SidePageOverlay.prototype.setWidth = function (width) {
    this.template.css({width: width})
}

SidePageOverlay.prototype.render = function () {
    $('body').append(this.template);
}

SidePageOverlay.prototype.isRender = function () {
    return !!$('.overlay-side-page').length;
}

SidePageOverlay.prototype.remove = function () {
    var _this = this;
    this.template.animate({
        opacity: 0
    }, {
        duration: 200,
        easing: $.bez([0.42, 0.0, 0.58, 1.0]),
        complete: function () {
            _this.template.remove();
            _this.template.css({opacity: ''})
        }
    });
}
