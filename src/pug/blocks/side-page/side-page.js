//добавление скроллбара для sidepage
function scrollSidePage() {
    var scrollbarContainer = $('.js-scrollbar-side-page');
    if(!scrollbarContainer.length) return;
    scrollbarContainer.scrollbar();
}
//добавление скроллбара для sidepage
function scrollSidePageCheckLocation() {
    var scrollbarContainer = $('.js-check-location .js-scrollbar-side-page');
    if(!scrollbarContainer.length) return;
    scrollbarContainer.scrollbar();
}
scrollSidePageCheckLocation();

function SidePageController() {
    this.overlay = new SidePageOverlay();
    this.closeAllSidePage = $.proxy(this.closeAllSidePage, this);
}

/**
 * открывает sidepage
 * принимает cb после закрытия окна и элемент, который надо закрыть
 * */
SidePageController.prototype.closeAllSidePage = function () {
    var _this = this;
    $('body').off('click', '.overlay-side-page', this.closeAllSidePage);
    $('.side-page__close').off('click');

    $('.js-side-page').each(function () {
        var that = $(this);
        _this.closeSidePage({
            sidePage: $(this),
            complete: function () {
                _this.afterAnimationClose();
                if(!that.hasClass('js-side-page-default')) {
                    $('.product-card__side-page-content').append(that.find('.js-side-page-content'));
                    that.remove();
                }
            }
        })
    })
}

SidePageController.prototype.openSidePage = function ({sidePage, removeAfterClose = true, afterAnimationClose = function() {return false}, beforeClose = function() {return false}, complete = function() {return false}}) {
    this.afterAnimationClose = afterAnimationClose;
    //добавляю отступы, чтобы не дергался экран при удалении скроллбара
    alignBlocks(getScrollbarSize())
    // $('header').css('paddingRight', getScrollbarSize());
    // $('html').css('marginRight', getScrollbarSize());
    overflowHidden();
    function stepAnimation() {return};
    var _this = this;
    var width = sidePage.width();
    var isRenderOverlay = this.overlay.isRender();

    if(!isRenderOverlay) {
        this.overlay.render();
        $('body').on('click', '.overlay-side-page', this.closeAllSidePage);

        // если не был отрендерен оверлей, то в step падает новая фукнция
        stepAnimation = function (step) {
            var overlayWidth = width + step;
            _this.overlay.setWidth('calc(100% - ' + overlayWidth + 'px');
        }
    }

    var btnClose = sidePage.find('.side-page__close');
    btnClose.on('click', closeModal);

    sidePage.animate({
        right: 0,
    }, {
        duration: 400,
        easing: $.bez([0.42, 0.0, 0.58, 1.0]),
        complete: function () {
            complete();
        },
        step: function (step) {
            stepAnimation(step);
        }
    })

    function closeModal() {
        $('body').off('click', '.overlay-side-page', this.closeAllSidePage);
        _this.closeSidePage({
            beforeClose: beforeClose,
            sidePage: sidePage,
            complete: function () {
                afterAnimationClose();
                btnClose.off('click', closeModal);
                if(removeAfterClose) {
                    sidePage.remove();
                }
            }
        })
    }
}
/**
 * закрывает sidepage,
 * принимает cb после закрытия окна и элемент, который надо закрыть
 * */
SidePageController.prototype.closeSidePage = function ({sidePage, complete = function() {return false} , removeOverlay = true}) {
    var _this = this;
    var screenWight = $(window).width();
    var width = sidePage.width();
    var right = screenWight > 767 ? '-576rem' : '-100%';
    function stepAnimate() {return false};

    if(removeOverlay) {

        stepAnimate = function (step) {
            var overlayWidth = width + (step * (screenWight/1440));
            if(screenWight > 767) {
                _this.overlay.setWidth('calc(100% - ' + overlayWidth + 'px');
            } else {
                _this.overlay.setWidth(step * -1 + '%');
            }

        }
    }
    sidePage.animate({
        right: right,
    }, {
        duration: 400,
        easing: $.bez([0.42, 0.0, 0.58, 1.0]),
        complete: function () {
            complete();
            if(removeOverlay) {
                overflowInherit();
                alignBlocks('')
                // $('header').css('paddingRight', '');
                $('html').css('marginRight', '');
                _this.overlay.remove();
            }
        },
        step: function (step) {
            stepAnimate(step)
        }
    })
}

SidePageController.prototype.defaultPageTemplate = function () {
    return $('<div class="side-page light js-side-page">\n' +
        '        <div class="side-page__inner">\n' +
        '          <div class="side-page__head">\n' +
        '            <div class="side-page__close js-side-page-close">\n' +
        '              <button class="button-close">\n' +
        '                <div class="button-close__icon"></div>\n' +
        '              </button>\n' +
        '            </div>\n' +
        '          </div>\n' +
        '          <div class="side-page__body scrollbar-inner js-scrollbar-side-page">\n' +
        '            <div class="side-page__in">\n' +
        '            </div>\n' +
        '          </div>\n' +
        '        </div>\n' +
        '      </div>')
}
SidePageController.prototype.getSuccessPageTemplate = function () {
    return $('<div class="side-page js-side-page-success dark js-side-page">\n' +
        '        <div class="side-page__inner">\n' +
        '          <div class="side-page__head">\n' +
        '            <div class="side-page__close">\n' +
        '              <button class="button-close">\n' +
        '                <div class="button-close__icon"></div>\n' +
        '              </button>\n' +
        '            </div>\n' +
        '          </div>\n' +
        '          <div class="scroll-wrapper side-page__body">\n' +
        '            <div class="side-page__in">\n' +
        '              <div class="side-page__wrapper">\n' +
        '                <h3 class="side-page__title-gold">Спасибо за&nbsp;заявку</h3>\n' +
        '                <p class="side-page__subtitle">В ближайшее время с вами свяжутся</p>\n' +
        '              </div>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '      </div>')
}

// открытие и закрытие модального окна успешной отправки формы
SidePageController.prototype.renderSidePage = function ({template, complete = function() {return false}, content = false}) {
    if(content) {
        var sidePageContent = content;
        template.find('.side-page__in').append(sidePageContent);
    }

    $('body').append(template);
    scrollSidePage();

    this.openSidePage({
        sidePage: template,
        afterAnimationClose: function () {
            $('.product-card__side-page-content').append(sidePageContent)
        },
        complete: function () {
            complete();
        }
    })
}

SidePageController.prototype.runSuccessPage = function () {
    function closeOtherSidePage() {
        $('.js-side-page:not(.js-side-page-success):not(.js-side-page-default)').each(function () {
            var that = $(this);
            _this.closeSidePage({
                sidePage: that,
                removeOverlay: false,
                complete: function () {
                    $('.product-card__side-page-content').append(that.find('.js-side-page-content'));
                    that.remove();
                }
            })
        })
    }

    var _this = this;
    var sidePageSuccess = this.getSuccessPageTemplate();
    $('body').append(sidePageSuccess);

    this.openSidePage({
        sidePage: sidePageSuccess,
        complete: function () {
            closeOtherSidePage();
            setTimeout(function () {
                _this.closeAllSidePage();
            }, 2000);
        }
    })
}

var sidePageController = new SidePageController();
// alignBlocks(getScrollbarSize())