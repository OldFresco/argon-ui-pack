;
(function ($, globalize, web, document, undefined) {
    globalize.culture(web.culture);
    globalize.culture().numberFormat.currency.symbol = '';

    //$(function () {
    //    var regional = $.datepicker.regional[web.culture];

    //    if (!regional) {
    //        regional = $.datepicker.regional[web.culture.substring(0, 2)];
    //    }

    //    if (!regional) {
    //        regional = $.datepicker.regional[''];
    //    }

    //    $.datepicker.setDefaults(regional);
    //});

    //$(document).on('change', 'select.c', function (event) {
    //    var $culture = $(event.target);

    //    $culture.parents('form:first').submit();
    //});
})(window.jQuery, window.Globalize, namespace('argon'), document);