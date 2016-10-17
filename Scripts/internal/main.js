;
// File upload
(function($, undefined) {                             
    $(".upload").change(function () {
        var fileName = $(this).val().replace('C:\\fakepath\\', '');
        var fileNameWrap = $(this).parent().parent().find('.doc-uploaded');
        $(fileNameWrap).html(fileName);
        });              
})(window.jQuery);

;
// Feefo modal...
(function($, undefined) {
    var $feefoLink = $('.feefo-modal-link');

    $feefoLink.click(function () {
        $.ajax({
            type: 'GET',
            url: '/CustomerFeedback/LatestComments',
            success: function (data) {
                $('.modal-feefo-inner-content').replaceWith(data);
            }
        });
    });

})(window.jQuery);

;
// Cookie bar
(function ($, undefined) {
    'use strict';

    $(function () {
        var cookieDisplayed = $.cookie('c');

        if (cookieDisplayed === undefined) {
            var $section = $('.cookiebar');
            $section.removeClass('hidden');

            $(document).on('click', '.cookiebar button', function () {
                $section.addClass('hidden');
                $.cookie('c', '', { expires: 3650 /* 10 years */ });
            });
        }
    });
})(window.jQuery);

;
(function($, argon, undefined) {
    var chars = ["l", "o", "a", "n", "s", "@", "l", "i", "k", "e", "l", "y", "l", "o", "a", "n", "s", ".", "c", "o", "m"];

    var emailAddress = chars.join('');
    $emailLink = $('.ll-contact-mail-link');

    $emailLink.html(emailAddress);

    $(document).on('click', '.ll-contact-mail-link', function(e) {

        window.location.href = "mailto:" + emailAddress;
    });
})(window.jQuery, namespace('argon'));

;
(function ($, undefined) {
    var chars = ["g", "u", "a", "r", "a", "n", "t", "o", "r", "@", "l", "i", "k", "e", "l", "y", "l", "o", "a", "n", "s", ".", "c", "o", "m"];
    var emailAddress = chars.join('');
    $emailLink = $('.guarantor-loan-contact-mail-link');

    $emailLink.html(emailAddress);

    $(document).on('click', '.guarantor-loan-contact-mail-link', function (e) {

        window.location.href = "mailto:" + emailAddress;
    });
})(window.jQuery);

// Prevent submit using enter key...
;
(function (undefined) {
    $(document).on('keypress', 'form', function(e) {        
        var code = e.keyCode || e.which;

        if (code == 13) {
            e.preventDefault();
            return false;
        }
    });
})()

// Rebrand modal...
    ;
(function ($, undefined) {

    var $modal = $('#rbrand');

    if ($modal.length > 0) {

        var vars = [], hash;
        var q = document.URL.split('?')[1];
        if (q != undefined) {
            q = q.split('&');
            for (var i = 0; i < q.length; i++) {
                hash = q[i].split('=');
                vars.push(hash[1]);
                vars[hash[0]] = hash[1];
            }
        }

        var r = vars['r'];

        if (r !== undefined) {
            if (r == 'true') {
                $modal.modal('show');
            }
        }
    }

})(window.jQuery)
