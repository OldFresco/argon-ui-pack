;
(function ($, argon, undefined) {
    'use strict';
    

    var $hasOptedOut = $('#iAmNotSure');
    var $bankVerificationQuestions = $('div.kyc-questions').find('select.form-control')
    var $errorMessage = $('.kyc-questions-error');

    var bankQuestionsAnswered = {};
    $bankVerificationQuestions.each(function() {
        bankQuestionsAnswered[$(this).attr('id')] = false;
    });

    var optedOutInitiallyClicked = false;

    function allBankVerificationQuestionsInitiallyAnswered() {
        var initiallyAnswered = true;

        $.each(bankQuestionsAnswered, function(index, value) {

            if(initiallyAnswered)
            initiallyAnswered = value;
        });

        return initiallyAnswered;
    }

    function toggleBankVerificationQuestionsValidation(hasOptedOut) {
        if (hasOptedOut === true) {
            $bankVerificationQuestions.addClass('data-val-ignore');
            $errorMessage.addClass('hide');
        } else {
            
            $bankVerificationQuestions.removeClass('data-val-ignore');

            if (allBankVerificationQuestionsAreValid()) {
                $errorMessage.addClass('hide');
            } else {
                $errorMessage.removeClass('hide');
            }
        }
    }

    $hasOptedOut.change(function () {
        optedOutInitiallyClicked = true;
        
        toggleBankVerificationQuestionsValidation($(this).is(':checked'));
    });

    $bankVerificationQuestions.change(function () {

        bankQuestionsAnswered[$(this).attr('id')] = true;

        if (allBankVerificationQuestionsInitiallyAnswered()) {

            if (!$hasOptedOut.is(':checked')) {
                var isValid = allBankVerificationQuestionsAreValid();

                if (isValid !== true) {
                    $errorMessage.removeClass('hide');
                } else {
                    $errorMessage.addClass('hide');
                }
            }
        }
    });

    var $button = $('button[type=submit]');

    $button.click(function () {
       
        if ($hasOptedOut.is(':checked')) {
            $errorMessage.addClass('hide');
            return;
        }

        var isValid = allBankVerificationQuestionsAreValid();
        
        if (isValid !== true) {
            $errorMessage.removeClass('hide');
        } else {
            $errorMessage.addClass('hide');
        }
    });
    
    function allBankVerificationQuestionsAreValid() {
        
        var isValid = true;

        $bankVerificationQuestions.each(function () {
            if (isValid === true) {
                isValid = $(this).valid();
            }
        });

        return isValid;
    }

    var $contract = $('.fixed-sum-loan-agreement').clone();
    $('.print-view-content').append($contract);

    $('.print').click(function () {
        $('.print-view').show();
        $('.application > div, footer').not('.print-view').not('.modal').hide();
        $('.application').addClass('application-print-view');
    });

    $('.print-view-return').click(function () {
        $('.print-view').hide();
        $('.application > div, footer').not('.print-view').not('.modal').show();
        $('.application').removeClass('application-print-view');
    });

    $('.print-view-print').click(function() {
        window.print();
    });

    argon.roadBlock.registerRoadblock('You have not signed the contract yet. Please sign the contract by checking the box and clicking the \'Complete\' button.', ['button[type="submit"]']);

})(window.jQuery, namespace('argon'))