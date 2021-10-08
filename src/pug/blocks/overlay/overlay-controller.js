function OverlayController() {
    this.template = $('<div class="overlay"></div>');
    //this.init();
}

OverlayController.prototype.render = function () {
    if(!this.isRendered()) {
        $('body').prepend(this.template);
    } else {
        this.template = $('.overlay');
    }
}

OverlayController.prototype.remove = function () {
    var _this = this;
    this.template.animate({
        opacity: 0
    },200, function () {
        _this.template.remove();
        _this.template.css({
            'opacity': '',
            'top': ''
        })
    })
}

OverlayController.prototype.setTopCoord = function (topCoord) {
    this.top = topCoord;
    this.template.css({top: topCoord});
}

OverlayController.prototype.getTopCoord = function () {
    return this.top;
}

OverlayController.prototype.setRightCoord = function (rightCoord) {
    this.right = rightCoord;
    this.template.css({right: rightCoord});

}

OverlayController.prototype.isRendered = function () {
    return $('.overlay').length;
}