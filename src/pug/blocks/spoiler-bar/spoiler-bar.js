function SpoilerBar() {
    this.bar = $('.spoiler-bar');
    this.toggle = $.proxy(this.toggle, this);
    this.activeClass = 'show';
    this.btnText = {
        SHOW: 'развернуть',
        HIDE: 'свернуть'
    }
    this.init();
}

SpoilerBar.prototype.hideBlock = function (body) {
    var button = body.parent().find('.spoiler-bar__button');
    var _this = this;

    body.animate({
        height: 0
    }, 400, function () {
        button.text(_this.btnText.SHOW)
    })
}

SpoilerBar.prototype.showBlock = function (body) {
    var height = body.find('.spoiler-bar__body-in').outerHeight(true);
    var button = body.parent().find('.spoiler-bar__button');
    var _this = this;
    body.animate({
        height: height
    }, 400, function () {
        button.text(_this.btnText.HIDE);
        body.css('height', '');
    })
}

SpoilerBar.prototype.toggle = function (target) {
    var body = target.next();
    var spoiler = target.parent();

    if(spoiler.hasClass(this.activeClass)) {
        this.hideBlock(body);
        spoiler.removeClass(this.activeClass);
    } else {
        this.showBlock(body);
        spoiler.addClass(this.activeClass);
    }
}

SpoilerBar.prototype.init = function () {
    var _this = this;
    $('body').on('click', '[data-target="spoiler"]', function () {
        _this.toggle($(this))
    });
}

var spoilerBar = new SpoilerBar();