;

(function(argon) {
    argon.smoothScrollTo = function(target, callback) {
        var $target = $(target);

        if (!$target.length) {
            return;
        }

        var $navbar = $('.navbar');
        var offset = 10;

        if ($navbar.length) {
            offset += $navbar.outerHeight();
        }

        $('html, body').animate({
            scrollTop: $target.offset().top - offset
        }, 1000);

        callback();
    };
})(namespace('argon'));

(function (argon) {
    $(document).on('click', 'a.smooth-scroll', function (e) {
        if (!this.hash) {
            return;
        }

        if (location.pathname.replace(/^\//, '') !== this.pathname.replace(/^\//, '') || location.hostname !== this.hostname) {
            return;
        }

        var $target = $(this.hash);
        $target = $target.length ? $target : $('[name=' + this.hash.slice(1) + ']');

        argon.smoothScrollTo($target, function() {
            e.preventDefault();
        });
    });
})(namespace('argon'));