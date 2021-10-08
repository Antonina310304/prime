$('.js-features').on('click', function (evt) {
    evt.preventDefault();
    var contentId = $(this).attr('data-content');

    var contentSidePage = $('[data-id="' +contentId +  '"]');
    if(!contentSidePage.length) return;
    sidePageController.renderSidePage({content: contentSidePage, template: sidePageController.defaultPageTemplate()});
})