/************************************HeaderController********************************************/
function HeaderController() {
    this.openMainNavBtb = $('.js-main-nav');
    this.openDropdownBtb = $('.js-dropdown');
    this.closeDropdownBtb = $('.js-dropdown-back');
    this.mainNavList = $('.header__main-nav');
    this.dropdownList = $('.maker-nav__in');
    this.makerNavWrapper = $('.header__maker-nav');
    this.openMakerBtb = $('.js-maker');
    this.mainNav = $('.header__in');
    this.header = $('.header');
    this.headerInner = $('.header__inner');
    this.makerList = $('.header__maker-list');
    this.dropdown = $('.maker-nav__dropdown');
    this.newFixed = $('.header__new-fixed');
    this.openMakerController = $.proxy(this._openMakerController, this);
    this.scrollWindow = $.proxy(this._scrollWindow, this);
    this.makerListIsOpen = false;
    this.dropdownIsOpen = false;
    this.mainNavIsOpen = false;
    this.isMobile = $(window).width() <= 767;
    this.fixedMenuHeight = 65;
    this.makerListItems = $('.maker-list__item');
    this.overlay = new OverlayController();
    this.animateDirecton = {
        FORWARD: 'forward',
        BACKWARD: 'backward'
    }


    this.watchers();
}

HeaderController.prototype.watchers = function () {
    var _this = this;
    this.openMainNavBtb.on('click', function () {
        _this.openMainNav();
    })
    this.openMakerBtb.on('click', function () {
        _this.openMakerController();
    })

    this.closeDropdownBtb.on('click', function (evt) {
        evt.preventDefault();
        // _this.dropdownController();
        _this.header.removeClass('dropdown-open');
        _this.dropdownIsOpen = false;
        _this.dropdown.css({'transition': ''});
        //вернем оверлей в начальное состояние
        _this.overlay.setTopCoord(_this.headerInner.height())
    })

    this.openDropdownBtb.on('click', function (evt) {
        evt.preventDefault();
        _this.dropdownController();
    })

    $('body').on('click', '.overlay', function (evt) {
        evt.preventDefault();
        _this.overlayWatchers();
    })

    $(window).resize('click', function (evt) {
        _this.resize();
    })
}


HeaderController.prototype.resize = function () {
    var screenWight = $(window).width();

    function resetStyle() {
        $('.header').attr('style', '');
        $('.header__inner').attr('style', '');
        // this.overlay.remove();
        $('.header__maker-list').attr('style', '');
        overflowInherit();
    }

    //для оверлея моб. меню
    if(screenWight <= 767 && this.isMobile && this.dropdownIsOpen) {
        var screenHeght = $(window).height();
        console.log(screenHeght)
        $('.overlay').css('top', 'auto');
    }

    if(screenWight > 767 && this.isMobile) {
        this.isMobile = false;

        if(this.mainNavIsOpen) {
            resetStyle();
            this.openMainNavBtb.removeClass('open');

        }
        if(this.makerListIsOpen) {
            resetStyle();
            this.openMakerDesktop();
        }
        if(this.dropdownIsOpen) {
            this.openDropdownDesktopController()
        }

    } else if(screenWight <= 767 && !this.isMobile) {
        //если меньше 768

        if(this.makerListIsOpen) {
            this.resetMakerDesktopStyle();
            this.openMakerMobile();
        }

        if(this.dropdownIsOpen) {
            $('header').css('paddingRight', '');
            $('main').css('marginRight', '');
            $('.maker-nav__dropdown').attr('style', '');
            this.makerNavWrapper.attr('style', '');

            $('.maker-nav__in').scrollbar('destroy');
            this.openMainNav();
            this.openDropdownMobile();
        }

        this.isMobile = true;
    }
}


HeaderController.prototype.overlayWatchers = function () {
    var screenWight = $(window).width();

    if(screenWight > 768) {
        if(this.dropdownIsOpen) {
            this.closeDropdownDesktopController();
        }
    } else {
        if(this.makerListIsOpen) {
            this.closeMakerMobile();
        }
        if(this.mainNavIsOpen) {
            // _this.close
            this.closeMobileMainNav();
        }
    }
}

HeaderController.prototype.getHeightDropdown = function () {
    //высчитываю высоту выпадающего меню и высоту основного меню
    var dropdownListHeight = $('.catalog-dropdown').outerHeight(true) + $('.header__maker-nav').outerHeight(true);
    var menuHeight = $('.header-wrap').outerHeight(true);
    var maxHeight = 0.92 * $(window).height() - menuHeight;
    console.log(dropdownListHeight, maxHeight)
    console.log(dropdownListHeight > maxHeight ? maxHeight : dropdownListHeight)
    return dropdownListHeight > maxHeight ? maxHeight : dropdownListHeight;
}

HeaderController.prototype.animateDropdownMenu = function (height, cb) {
    var _this = this;
    var headerHeight = $('.header').height();
    this.makerNavWrapper.animate({
        height: height
    }, {
        step: function (step) {
            _this.overlay.setTopCoord(step + headerHeight);
        }
    }).promise().then(function () {
        if(cb) {
            cb();
        }
    })
}

function alignBlocks(value) {
    $('.header-wrap').css('paddingRight', value);
    $('.maker-nav').css('paddingRight', value);
    $('.catalog-dropdown').css('marginRight', value);
    $('.page-footer').css('marginRight', value);
    $('main').css('marginRight', value);
}

HeaderController.prototype.openDropdownDesktopController = function () {
    var _this = this;
    this.openDropdownBtb.addClass('open');
    this.overlay.render();
    this.dropdownIsOpen = true;
    this.animateDropdownMenu(this.getHeightDropdown(), function () {
        _this.dropdown.animate({opacity: 1});
        overflowHidden();
        alignBlocks(getScrollbarSize())
        $('.maker-nav__in').scrollbar();
    })

}

HeaderController.prototype.closeDropdownDesktopController = function () {
    var _this = this;
    this.openDropdownBtb.removeClass('open');
    this.dropdownIsOpen = false;
    _this.dropdown.animate({'opacity': 0}, function () {
        var newHeight = $('.maker-nav').height();
        _this.animateDropdownMenu(newHeight, function () {
            overflowInherit();
            alignBlocks('')
            $('.maker-nav__in').scrollbar('destroy');
            _this.overlay.remove();
            _this.makerNavWrapper.css('height', '');
        })
    });
}

HeaderController.prototype.dropdownDesktopController = function () {

    if(this.dropdownIsOpen) {
        this.closeDropdownDesktopController();
        // если меню открыто

    } else {
        // если меню закрыто
        this.openDropdownDesktopController();
    }

}

HeaderController.prototype.openDropdownMobile = function () {
    var screenHeight = $(window).height();
    this.header.addClass('dropdown-open');
    $('.overlay').css('top', 'auto');
    this.dropdownIsOpen = true;
}

HeaderController.prototype.dropdownMobileController = function () {
    //возвращаю transition в дефолтное состояние
    //если открыто меню производителей - закрываю его
    if(this.makerListIsOpen) {
        this.closeMaker();
    }
    this.dropdown.css({'transition': ''})
    switch (this.dropdownIsOpen) {
        case true:
            this.header.removeClass('dropdown-open');
            overflowInherit();
            this.dropdownIsOpen = false;
            break;
        case false:
            this.openDropdownMobile();
            break;
    }
}

HeaderController.prototype.dropdownController = function () {
    var screenWight = $(window).width();

    if(screenWight > 768) {
        this.dropdownDesktopController()
    } else {
        this.dropdownMobileController()
    }
}


HeaderController.prototype.closeMakerMobile = function () {
    this.makerListIsOpen = false;
    this.openMakerBtb.removeClass('open');
    var _this = this;
    var screenHeight = $(window).height();
    var newHeight = this.headerInner.height() - this.makerList.outerHeight();
    var bonus = this.mainNavIsOpen ? this.mainNav.height() : 0;

    this.header.off('scroll', this.scrollWindow);
    this.headerInner.animate({
        height: newHeight
    },  {
        duration: 500,
        step: function (step) {
            _this.overlay.setTopCoord(step);
            var newTop = step - _this.makerList.outerHeight() - bonus;
            _this.makerList.css('top', newTop);
            // если высота контента меньше высоты экрана, убираем bottom
            if(step <= screenHeight) {
                _this.header.css({
                    bottom: '',
                    height: step
                })
            }
        },
    }).promise().then(function () {
        _this.newFixed.css('border-bottom', '');
        if(!_this.mainNavIsOpen) {
            _this.overlay.remove();
            overflowInherit();
        }
    })
}
// добавляю бордер при скролле header
HeaderController.prototype._scrollWindow = function (evt) {
    if(evt.target.scrollTop > this.makerList.height()) {
        this.newFixed.css('border-bottom', '');
    } else {
        this.newFixed.css('border-bottom', '0');
    }
}


HeaderController.prototype.resetMakerDesktopStyle = function () {
    this.makerListItems.css('opacity', '');
    this.makerList.attr('style', '');
    this.mainNavList.css('visibility', '');

}
HeaderController.prototype.closeMakerDesktop = function () {
    var _this = this;
    this.animateMakerItem(this.makerListItems.length - 1, this.animateDirecton.BACKWARD, function () {
        _this.resetMakerDesktopStyle();
        // _this.makerListItems.css('opacity', '');
        // _this.makerList.attr('style', '');
        // _this.mainNavList.css('visibility', '');
    })
}
HeaderController.prototype.openMakerDesktop = function () {
    this.mainNavList.css('visibility', 'hidden');
    this.makerList.css('zIndex', 0);
    this.makerList.css('opacity', 1);

    this.animateMakerItem(0, this.animateDirecton.FORWARD, function () {
    })
}

HeaderController.prototype.closeMaker = function () {
    var screenWight = $(window).width();
    this.makerListIsOpen = false;
    this.openMakerBtb.removeClass('open');

    if(screenWight < 768) {
        this.closeMakerMobile();
    } else {
        this.closeMakerDesktop();
    }
}

HeaderController.prototype.openMaker = function () {
    var screenWight = $(window).width();
    this.makerListIsOpen = true;
    this.openMakerBtb.addClass('open');

    if(screenWight < 768) {
        this.openMakerMobile();
    } else {
        this.openMakerDesktop();
    }
}

// открытие меню
HeaderController.prototype.openMakerMobile = function () {
    var _this = this;
    var screenHeight = $(window).height();

    overflowHidden();
    this.overlay.render();
    var newHeight = this.headerInner.height() + this.makerList.height();
    _this.newFixed.css('border-bottom', '0');

    this.header.on('scroll', this.scrollWindow);

    if(this.mainNavIsOpen) {
        // если открыто меню производителей
        this.headerInner.animate({
            height: newHeight,
        }, {
            step: function (step) {
                //начиная с начальной высоты заканчивая new
                _this.overlay.setTopCoord(step);
                _this.header.css('height', step);
                var h = _this.makerList.outerHeight() + _this.mainNav.height();
                _this.makerList.css('top', step - h);
            },
        }).promise().then(function() {
            if(newHeight > screenHeight) {
                _this.header.css({
                    'bottom': 0,
                    'height': 'auto'
                })
            }

        })
    } else {
        this.overlay.render();
        this.header.animate({
            height: newHeight,
        }, {
            step: function (step) {
                _this.overlay.setTopCoord(step);
                _this.headerInner.css('height', step);
                _this.makerList.css('top', step - _this.makerList.height())
                _this.header.css('height', step);
            },
        }).promise().then(function() {
            if(newHeight > screenHeight) {
                _this.header.css({
                    'bottom': 0,
                    'height': 'auto'
                })
            }
        });
    }
}
HeaderController.prototype._openMakerController = function () {

    switch (this.makerListIsOpen) {
        case true:
            this.closeMaker();
            break;
        case false:
            this.openMaker();
            break;
    }
}

HeaderController.prototype.closeMobileMainNav = function () {
    var screenHeight = $(window).height();
    var _this = this;

    this.openMainNavBtb.removeClass('open');
    var newHeight = this.headerInner.height() - this.mainNav.height();

    //если открыто подменю
    if(this.dropdownIsOpen) {
        this.dropdownIsOpen = false;
        this.headerInner.css('height', screenHeight); // меняю высоту основного контейнера, чтобы корректно уехал оверлей
        // убираю transition чтобы не было анимации при закрытии меню
        this.dropdown.css({
            'top': 'auto',
            'transition': 'none'
        });
        this.dropdown.animate({
            bottom: '100%',
        }, {
            // duration: 15000,
            complete: function () {
                _this.header.removeClass('dropdown-open');
                _this.dropdown.css({
                    'top': '',
                    'bottom' : '',
                })
            }
        })
    }

    this.headerInner.animate({
        height: newHeight,
    }, {
        // duration: 15000,
        step: function (step) {
            _this.overlay.setTopCoord(step)
            _this.headerInner.css('height', step);
            // если высота контента меньше высоты экрана, убираем bottom
            if(step <= screenHeight) {
                _this.header.css({
                    bottom: '',
                    height: step
                })
            }
        },
    }).promise().then(function () {
        if(!_this.makerListIsOpen) {
            _this.overlay.remove();
            overflowInherit();
        }
    })
    this.mainNavIsOpen = false;
}

HeaderController.prototype.openMainNav = function () {
    switch (this.mainNavIsOpen) {
        case false:
            this.openMainNavBtb.addClass('open');
            overflowHidden();
            var newHeight = this.headerInner.height() + this.mainNav.height();
            this.animateMainNav(newHeight);
            this.mainNavIsOpen = true;
            break;
        case true:
            this.closeMobileMainNav();
            break;
        // если открыто меню
    }
}

HeaderController.prototype.animateMainNav = function (height) {
    var _this = this;
    var screenHeight = $(window).height();
    this.overlay.render();
    this.header.animate({
        height: height,
    }, {
        step: function (step) {
            _this.headerInner.css('height', step);
            _this.overlay.setTopCoord(step);
        },
    }).promise().then(function () {
        // если высота контента больше высоты экрана, header добавляем свойства
        if(height > screenHeight) {
            _this.header.css({
                'bottom': 0,
                'height': 'auto'
            })
        }
    })
}


//анимация скрытия и отображения пунктов меню
HeaderController.prototype.animateMakerItem = function (i, direction, cb) {
    var _this = this;
    var item = i;
    this.makerListItems.eq(item).animate({
        opacity: direction == (_this.animateDirecton.FORWARD) ? 1 : 0,
    }, 120, "linear", function () {
        item = direction == (_this.animateDirecton.FORWARD) ? item + 1 : item - 1;
        if(
            (direction == _this.animateDirecton.FORWARD && item < _this.makerListItems.length) ||
            (direction == _this.animateDirecton.BACKWARD && item >= 0)
        ) {
            _this.animateMakerItem(item, direction, cb)
        } else {
            cb();
        }
    })
}



var controller = new HeaderController();