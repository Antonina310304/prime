
function Modal() {
    this.modal = $('.modal');
    this.cbCloseModal = function () {return true};
    this.keys = {
        ESCAPE: 'Escape'
    }
}



Modal.prototype.setCloseCb = function (cb) {
    this.cbCloseModal = cb;
}

Modal.prototype.open = function () {
    var _this = this;
    overflowHidden();
    this.modal.css({
        'visibility': 'visible',
        'z-index': '20'
    });

    this.modal.animate({
        top: '0',
        opacity: 1
    }, {
        easing: $.bez([0.215, 0.61, 0.355, 1]),
        duration: 400,
        complete: function () {
        }
    })
}

Modal.prototype.close = function (cb) {
    var _this = this;
    this.modal.animate({
        top: '80px',
        opacity: 0
    }, {
        duration: 400,
        easing: $.bez([0.215, 0.61, 0.355, 1]),
        complete: function () {
            _this.modal.css({
                'visibility': '',
                'z-index': ''
            });
            _this.cbCloseModal();
        }
    })
}

var modal = new Modal();