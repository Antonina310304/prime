function staffGrid() {
    var staffBlock = $('.js-staff');
    if(!staffBlock.length) return;


    staffBlock.on('click', '.staff__img', function () {
        console.log('adsfadf')
        var screenWidth = $(window).width();
        if(screenWidth < 768) onHoverStaff($(this));

    })

    staffBlock.on('mouseleave', '.staff__item', function () {
        var screenWidth = $(window).width();
        if(screenWidth > 768) onHoverStaff($(this));

    });

    staffBlock.on('mouseenter', '.staff__item', function () {
        var screenWidth = $(window).width();
        if(screenWidth > 768) onHoverStaff($(this));

    });

    function onHoverStaff(block) {
        var img = block.find('img');
        if(img.length > 1) {
            img.toggleClass('hide')
        }
    }

    staffBlock.each(function () {
        var staffItem = $(this).find('.js-staff-content');
        if(!staffItem.length) return;
        applyWight(staffItem)
    })

    $(window).resize(function () {
        $('.js-staff-content').parent().css('width', '');
        var screenWidth = $(window).width();

        if(screenWidth > 767) {
            staffBlock.each(function () {
                var staffItem = $(this).find('.js-staff-content');
                if(!staffItem.length) return;
                applyWight(staffItem)
            })
        }
    })

    function applyWight(content) {
        var maxWidth = 0;

        content.each(function () {
            var width = $(this).width();
            maxWidth = width > maxWidth ? width : maxWidth;
        })

        content.each(function () {
            $(this).parent().css('width', maxWidth);
        })
    }
}

staffGrid();