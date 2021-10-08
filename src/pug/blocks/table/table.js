function getTableWrapper() {
    var table = $('.catalog-content table');

    if(!table.length) return;

    table.each(function () {
        $(this).wrap('<div class="table-wrap"></div>')
    })

}

getTableWrapper()