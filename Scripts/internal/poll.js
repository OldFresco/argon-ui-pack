;

(function ($, argon, window, document, undefined) {

    function PollException(message) {
        this.message = message;
        this.name = "PollException";
    }

    var interval;

    // Stops polling...
    argon.stopPoll = function () {
        if (interval) {
            clearInterval(interval);
        }
    };

    // Begins polling...
    argon.poll = function (options) {

        var intervalInMilliseconds = 2000;
        var timeout = 60000;
        var timeoutRedirectUrl;

        // Check options...
        if (options) {
            if (options.interval) {
                intervalInMilliseconds = options.intervalInMilliseconds;
            }

            if (options.timeout) {
                timeout = options.timeout;
            }

            if (options.timeoutRedirectUrl) {
                timeoutRedirectUrl = options.timeoutRedirectUrl;
            }
            else {
                throw new PollException('Missing timeout redirect URL.');
            }
        }

        // Timeout timer...
        var timeElapsed = 0;

        var timer = window.setInterval(function () {
            timeElapsed += 1000;

            if (timeElapsed >= timeout) {
                clearInterval(timer);
                argon.stopPoll();

                window.location = timeoutRedirectUrl;
            }
        }, 1000);

        // Polling logic...
        var ajaxInProgress = false;

        interval = setInterval(function () {
            if (!ajaxInProgress) {
                ajaxInProgress = true;

                $.ajax({
                    cache: false,
                    dataType: 'json',
                    success: function (data) {
                        if (!data.continuePolling) {
                            if (!data.redirectUrl) {
                                throw new PollException('Missing redirect URL.');
                            }

                            window.location = data.redirectUrl;
                        }

                        ajaxInProgress = false;
                    },
                    type: 'GET',
                    url: document.URL
                });
            }
        }, intervalInMilliseconds);
    };

})(window.jQuery, namespace('argon'), window, document);