function tab(target) {
    var activeClass = 'active';
    var disabledClass = 'disabled';
    var selectAttr = 'data-selected';
    var parentClass = '.tabs';
    var groupName = target.closest(parentClass).attr('data-tab-group');
    var group = $('.tab-content[data-tab-group="'+ groupName + '"]');

    if(target.hasClass(activeClass) || target.hasClass(disabledClass) ) return;

    var contentId = target.attr('data-id-content');
    var content = group.find('[data-content="'+ contentId + '"]');

    if(contentId == 'all') {
        group.find('[data-content]').each(function () {
            show($(this));
        })

        hide($('.nav-tabs__item.' + activeClass));
        show(target);
        return;
    }

    function show(element) {
        element.addClass(activeClass);
        element.attr(selectAttr, true);
    }

    function hide(element) {
        element.removeClass(activeClass);
        element.attr(selectAttr, false);
    }

    hide($('.nav-tabs__item.' + activeClass));
    hide($('.tab-content__item.' + activeClass));

    show(content);
    show(target);
}

$('body').on('click', '[data-target="tab"]', function () {
    tab($(this));
});
