
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options = {}) {

    options = {
        path: '/',
        ...options
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}



function Cookies() {
    this.cookies = $('.js-cookies');
    if(!this.cookies.length) return;
    this.hide = $.proxy(this.hide, this);
    this.init();
    this.age = 86400 * 360;
}

Cookies.prototype.init = function () {

    if(getCookie('PRIME_COOKIES') === 'SHOW') return;

    this.show();
}
Cookies.prototype.show = function () {
    this.cookies.addClass('show');
    this.cookies.find('.cookies__button').on('click', this.hide)
}

Cookies.prototype.hide = function () {
    setCookie('PRIME_COOKIES', 'SHOW', {'max-age': this.age});
    this.cookies.removeClass('show');
    this.cookies.find('.cookies__button').off('click', this.hide);
}

$(document).ready(function () {
    var cookies = new Cookies();
    cookies.init();
})