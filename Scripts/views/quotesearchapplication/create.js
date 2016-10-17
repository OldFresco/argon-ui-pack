
(function ($, globalize, argon, undefined) {
    ko.applyBindings(new QuoteApplicationViewModel(argon, globalize));
})(window.jQuery, window.Globalize, namespace('argon'));

;
// Current address...
(function ($, argon, argonValidation, pca, undefined) {
    var $body = $('body');
    var $currentAddress = $('.current-residency .address:first');
    var $currentAddressLookup = $currentAddress.find('.address-lookup');
    var $currentAddressLookupSearch = $currentAddress.find('.address-lookup-search');
    var $currentAddressLookupSearchResult = $currentAddress.find('.address-lookup-search-result');
    var $currentAddressNotFound = $currentAddress.find('.address-not-found');
    var $currentAddressFields = $currentAddress.find('.address-fields');
    var $currentAddressSearchAgainButton = $currentAddressFields.find('.address-lookup-retry');
    var $currentAddressYour = $currentAddress.find('.address-your');
    var $currentAddressSelectedAddress = $currentAddressYour.find('.address-your-selected-address');
    var $currentResidencyAddressSearchInput = $currentAddressLookupSearch.find('input:first-of-type');
    var addressNotFoundTimeoutId;

    var timeout = setTimeout(function () {
        clearInterval(interval);
        hideAddressLookup($currentAddressLookup, $currentAddressFields);
        $currentAddressSearchAgainButton.addClass('hide');
        $currentResidencyAddressSearchInput.addClass('data-val-ignore');
    }, 1000);

    var interval = setInterval(function () {
        if (typeof (pca) !== 'undefined') {
            clearTimeout(timeout);
            clearInterval(interval);
            addCurrentAddressEventListeners();
        }
    }, 100);

    function cleanseAddress(residency) {
        var flat = residency.flat.val();
        residency.flat.val(flat.replace('apartment', 'apt').replace('Apartment', 'Apt'));
    }

    function addCurrentAddressEventListeners() {
        pca.capturePlus.controls[1].listen('populate', function () {
            cleanseAddress(argon.controls.currentResidency);

            var addressParts = new Array(argon.controls.currentResidency.flat.val(), argon.controls.currentResidency.houseName.val(), (argon.controls.currentResidency.houseNumber.val() ? argon.controls.currentResidency.houseNumber.val() + ' ' : '') + argon.controls.currentResidency.street.val(), argon.controls.currentResidency.street2.val(), argon.controls.currentResidency.district.val(), argon.controls.currentResidency.townOrCity.val(), argon.controls.currentResidency.county.val(), argon.controls.currentResidency.postcode.val()).filter(function (n) {
                return n;
            });

            argon.controls.currentResidency.formattedAddress.val(addressParts.join(', '));
            $currentAddressSelectedAddress.html(addressParts.join(', '));
            hideAddressSearch();
            showSelectedAddress();
        });

        pca.capturePlus.controls[1].listen('noresults', function () {
            addressNotFoundTimeoutId = setTimeout(function () {
                window.pca.capturePlus.controls[1].autocomplete.hide();

                $currentAddressNotFound.removeClass('hide');

                hideAddressLookup($currentAddressLookup, $currentAddressFields);
            }, 2000);
        });

        pca.capturePlus.controls[1].listen('manual', function () {
            hideAddressLookup($currentAddressLookup, $currentAddressFields);
        });

        pca.capturePlus.controls[1].listen("display", function () {
            pca.capturePlus.controls[1].autocomplete.header.clear().setContent(pca.create("div", { className: "pcamessage", innerHTML: "Can't find your address?  <span style='text-decoration:underline;'>Enter address manually.</span>", onclick: pca.capturePlus.controls[1].manualEntry }, "cursor:pointer;")).show();
        });
    };

    $body.on('click', '.current-residency .address-lookup-retry', function (e) {
        if (!$currentAddressNotFound.hasClass('hide')) {
            argon.controls.currentResidency.addressSearch.val('');

            $currentAddressNotFound.addClass('hide');
        }

        clearAddressFields();
        showAddressSearch();
        showAddressLookup();
        hideSelectedAddress();

        pca.capturePlus.controls[1].reload();

        argon.smoothScrollTo(argon.controls.currentResidency.addressSearch, function () {
            e.preventDefault();
            argon.controls.currentResidency.addressSearch.focus();
        });
    });

    $body.on('click', '.current-residency .address-lookup-search-edit', function (e) {
        hideAddressLookup();
        hideSelectedAddress();
    });

    $body.on('click', '.current-residency .address-lookup-search-retry', function (e) {
        clearAddressFields();
        showAddressSearch();
        hideSelectedAddress();

        argon.smoothScrollTo(argon.controls.currentResidency.addressSearch, function () {
            e.preventDefault();
            argon.controls.currentResidency.addressSearch.focus();
        });
    });

    $body.on('focus', argon.selectors.currentResidency.addressSearch, function (e) {
        pca.capturePlus.controls[1].search(argon.controls.currentResidency.addressSearch.val());
    });

    $body.on('keyup', argon.selectors.currentResidency.addressSearch, function (e) {
        clearTimeout(addressNotFoundTimeoutId);
    });

    function clearAddressFields() {
        argon.controls.currentResidency.flat.val('');
        argon.controls.currentResidency.houseName.val(''),
        argon.controls.currentResidency.houseNumber.val(''),
        argon.controls.currentResidency.street.val(''),
        argon.controls.currentResidency.street2.val(''),
        argon.controls.currentResidency.district.val(''),
        argon.controls.currentResidency.townOrCity.val(''),
        argon.controls.currentResidency.county.val(''),
        argon.controls.currentResidency.postcode.val('');
    }

    function hideAddressLookup() {
        argonValidation.setAddressEditModeValidation(true);
        $currentAddressLookup.addClass('hide');
        $currentAddressFields.removeClass('hide');
    }

    function hideAddressSearch() {
        $currentAddressLookupSearch.addClass('hide');
        $currentAddressLookupSearchResult.removeClass('hide');
    }

    function hideSelectedAddress() {
        $currentAddressYour.addClass('hide');
    }

    function showAddressLookup() {
        argonValidation.setAddressEditModeValidation(false);
        $currentAddressLookup.removeClass('hide');
        $currentAddressFields.addClass('hide');
    }

    function showAddressSearch() {
        $currentAddressLookupSearch.removeClass('hide');
        $currentAddressLookupSearchResult.addClass('hide');
    }

    function showSelectedAddress() {
        $currentAddressYour.removeClass('hide');
    }
})(window.jQuery, namespace('argon'), namespace('argon.validation'), window.pca);

;
// Previous address...
(function ($, argon, argonValidation, pca, undefined) {
    var $body = $('body');
    var $previousAddress = $('.previous-residency .address:first');
    var $previousAddressLookup = $previousAddress.find('.address-lookup');
    var $previousAddressLookupSearch = $previousAddress.find('.address-lookup-search');
    var $previousAddressLookupSearchResult = $previousAddress.find('.address-lookup-search-result');
    var $previousAddressNotFound = $previousAddress.find('.address-not-found');
    var $previousAddressFields = $previousAddress.find('.address-fields');
    var $previousAddressSearchAgainButton = $previousAddressFields.find('.address-lookup-retry');
    var $previousAddressYour = $previousAddress.find('.address-your');
    var $previousAddressSelectedAddress = $previousAddressYour.find('.address-your-selected-address');
    var $previousResidencyAddressSearchInput = $previousAddressLookupSearch.find('input:first-of-type');
    var $previousAddressMessagePrompt = $('.previous-residency .previous-residency-warn:first');
    var addressNotFoundTimeoutId;

    var timeout = setTimeout(function () {
        clearInterval(interval);
        hideAddressLookup($previousAddressLookup, $previousAddressFields);
        $previousAddressSearchAgainButton.addClass('hide');
        $previousResidencyAddressSearchInput.addClass('data-val-ignore');
    }, 1000);

    var interval = setInterval(function () {
        if (typeof (pca) !== 'undefined') {
            clearTimeout(timeout);
            clearInterval(interval);
            addPreviousAddressEventListeners();
        }
    }, 100);


    function cleanseAddress(residency) {
        var flat = residency.flat.val();
        residency.flat.val(flat.replace('apartment', 'apt').replace('Apartment', 'Apt'));
    }

    function addPreviousAddressEventListeners() {
        pca.capturePlus.controls[0].listen('populate', function () {
            
            cleanseAddress(argon.controls.currentResidency);

            var addressParts = new Array(argon.controls.previousResidency.flat.val(), argon.controls.previousResidency.houseName.val(), (argon.controls.previousResidency.houseNumber.val() ? argon.controls.previousResidency.houseNumber.val() + ' ' : '') + argon.controls.previousResidency.street.val(), argon.controls.previousResidency.street2.val(), argon.controls.previousResidency.district.val(), argon.controls.previousResidency.townOrCity.val(), argon.controls.previousResidency.county.val(), argon.controls.previousResidency.postcode.val()).filter(function (n) {
                return n;
            });

            argon.controls.previousResidency.formattedAddress.val(addressParts.join(', '));
            $previousAddressSelectedAddress.html(addressParts.join(', '));
            hideAddressSearch();
            showSelectedAddress();
            $previousAddressMessagePrompt.hide();
        });

        pca.capturePlus.controls[0].listen('noresults', function () {
            addressNotFoundTimeoutId = setTimeout(function () {
                window.pca.capturePlus.controls[0].autocomplete.hide();

                $previousAddressNotFound.removeClass('hide');

                hideAddressLookup($previousAddressLookup, $previousAddressFields);
            }, 2000);
        });

        pca.capturePlus.controls[0].listen('manual', function () {
            hideAddressLookup($previousAddressLookup, $previousAddressFields);
        });

        pca.capturePlus.controls[0].listen("display", function () {
            pca.capturePlus.controls[0].autocomplete.header.clear().setContent(pca.create("div", { className: "pcamessage", innerHTML: "Can't find your address? <span style='text-decoration:underline;'>Enter address manually.</span>", onclick: pca.capturePlus.controls[0].manualEntry }, "cursor:pointer;")).show();
        });
    }

    $body.on('click', '.previous-residency .address-lookup-retry', function (e) {
        if (!$previousAddressNotFound.hasClass('hide')) {
            argon.controls.previousResidency.addressSearch.val('');

            $previousAddressNotFound.addClass('hide');
        }

        clearAddressFields();
        showAddressSearch();
        showAddressLookup();
        hideSelectedAddress();

        pca.capturePlus.controls[0].reload();

        argon.smoothScrollTo(argon.controls.previousResidency.addressSearch, function () {
            e.preventDefault();
            argon.controls.previousResidency.addressSearch.focus();
        });
    });

    $body.on('click', '.previous-residency .address-lookup-search-edit', function (e) {
        hideAddressLookup();
        hideSelectedAddress();
    });

    $body.on('click', '.previous-residency .address-lookup-search-retry', function (e) {
        clearAddressFields();
        showAddressSearch();
        hideSelectedAddress();

        argon.smoothScrollTo(argon.controls.previousResidency.addressSearch, function () {
            e.preventDefault();
            argon.controls.previousResidency.addressSearch.focus();
        });
    });

    $body.on('focus', argon.selectors.previousResidency.addressSearch, function (e) {
        pca.capturePlus.controls[0].search(argon.controls.previousResidency.addressSearch.val());
    });

    $body.on('keyup', argon.selectors.previousResidency.addressSearch, function (e) {
        clearTimeout(addressNotFoundTimeoutId);
    });

    function clearAddressFields() {
        argon.controls.previousResidency.flat.val('');
        argon.controls.previousResidency.houseName.val(''),
        argon.controls.previousResidency.houseNumber.val(''),
        argon.controls.previousResidency.street.val(''),
        argon.controls.previousResidency.street2.val(''),
        argon.controls.previousResidency.district.val(''),
        argon.controls.previousResidency.townOrCity.val(''),
        argon.controls.previousResidency.county.val(''),
        argon.controls.previousResidency.postcode.val('');
    }
    function hideAddressLookup() {
        argonValidation.setAddressEditModeValidation(true);
        $previousAddressLookup.addClass('hide');
        $previousAddressFields.removeClass('hide');
    }

    function hideAddressSearch() {
        $previousAddressLookupSearch.addClass('hide');
        $previousAddressLookupSearchResult.removeClass('hide');
    }

    function hideSelectedAddress() {
        $previousAddressYour.addClass('hide');
        $previousAddressMessagePrompt.show();
    }

    function showAddressLookup() {
        argonValidation.setAddressEditModeValidation(false);
        $previousAddressLookup.removeClass('hide');
        $previousAddressFields.addClass('hide');
    }

    function showAddressSearch() {
        $previousAddressLookupSearch.removeClass('hide');
        $previousAddressLookupSearchResult.addClass('hide');
    }

    function showSelectedAddress() {
        $previousAddressYour.removeClass('hide');
        $previousAddressMessagePrompt.hide();
    }
})(window.jQuery, namespace('argon'), namespace('argon.validation'), window.pca);

;
(function ($, argon, undefined) {

    function togglePreviousResidencyValidation(yearsAtCurrentResidency) {
        var $previousResidencySection = $('.previous-residency');
        var $previousResidencyYearsAtAddress = $previousResidencySection.find('.time-at-years');
        var $previousResidencyMonthsAtAddress = $previousResidencySection.find('.time-at-months');
        var $previousResidencyPostcode = $previousResidencySection.find('#PreviousResidency_Address_Postcode');
        var $previousResidencyAddressSearch = $previousResidencySection.find('.address-lookup-search input:first-of-type');

        if (yearsAtCurrentResidency < 1) {
            $previousResidencyYearsAtAddress.removeClass('data-val-ignore');
            $previousResidencyMonthsAtAddress.removeClass('data-val-ignore');
            $previousResidencyPostcode.removeClass('data-val-ignore');
            $previousResidencyAddressSearch.removeClass('data-val-ignore');
            $previousResidencySection.show("slow");
        } else {
            $previousResidencyYearsAtAddress.addClass('data-val-ignore');
            $previousResidencyMonthsAtAddress.addClass('data-val-ignore');
            $previousResidencyPostcode.addClass('data-val-ignore');
            $previousResidencyAddressSearch.addClass('data-val-ignore');
            $previousResidencySection.hide("slow");
        }
    }

    var $yearsAtCurrentResidency = $('.current-residency .time-at-years');

    $yearsAtCurrentResidency.change(function () {
        togglePreviousResidencyValidation($(this).val());
    });

    if ($yearsAtCurrentResidency.val() != '') {
        togglePreviousResidencyValidation($yearsAtCurrentResidency.val());
    }

})(window.jQuery, namespace('argon'));


// Printing
;
(function ($, undefined) {

    $('.print-loan-terms-and-conditions').click(function () {
        $termsAndConditions = $('.terms-and-conditions').clone();
        $('.print-view-content').append($termsAndConditions);

        displayPrintView(true);
    });

    $('.print-pre-contract').click(function () {
        $preContractCreditInformation = $('.pre-contract-credit-information').clone();
        $('.print-view-content').append($preContractCreditInformation);

        displayPrintView(true);
    });

    $('.print-view-return').click(function () {
        $('.print-view-content').empty();
        displayPrintView(false);
    });

    $('.print-view-print').click(function () {
        window.print();
    });

    function displayPrintView(display) {
        if (display === true) {
            $('.print-view').show();
            $('.application > div, footer').not('.print-view').hide();
            $('.application').addClass('application-print-view');
        } else {
            $('.print-view').hide();
            $('.application > div, footer').not('.print-view, .modal').show();
            $('.application').removeClass('application-print-view');
        }
    }

})(window.jQuery);


// Disable email copy and paste...
(function ($, undefined) {
    $('#EmailAddress, #EmailAddressConfirmation').bind('copy paste', function (e) {
        e.preventDefault();
    });
})(window.jQuery);


// Prevent non-numeric key-presses on inputs that have been marked as such. See http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
// for the meaning of the values on the e.which property. See SUL-741 for details around this.
(function ($, undefined) {

    $('input[data-numeric-only=true]').on('keypress', function (ev) {

        var charCode = (ev.which) ? ev.which : ev.keyCode;

        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            ev.preventDefault();
        }
    });
})(window.jQuery);

// For numeric-only values we enforce numeric input after every change - this seems to be the most reliable method to handle pasting
// in of nonsense (the only scenario which isn't caught by the other handler attached to inputs with this attribute). See SUL-741
// for details around this.
(function ($, undefined) {

    $("input[data-numeric-only=true]").bind('change', function (e) {

        var replaced = $(this).val().replace(/[^\d]/g, "");
        $(this).val(replaced);
    });

})(window.jQuery);

// Temp date of birth select change function...
(function ($, argonValidation, undefined) {

    var dateOfBirth = namespace('argon.validation.dateOfBirth');

    dateOfBirth.intialDayInputMade = false;
    dateOfBirth.intialMonthInputMade = false;
    dateOfBirth.intialYearInputMade = false;

    $('select[name^=DateOfBirth]').change(function () {

        if ($(this).attr('id') == 'DateOfBirth_Day') {
            argonValidation.dateOfBirth.initialDayInputMade = true;
        }

        if ($(this).attr('id') == 'DateOfBirth_Month') {
            argonValidation.dateOfBirth.initialMonthInputMade = true;
        }

        if ($(this).attr('id') == 'DateOfBirth_Year') {
            argonValidation.dateOfBirth.initialYearInputMade = true;
        }

        if (argonValidation.dateOfBirth.initialDayInputMade && argonValidation.dateOfBirth.initialMonthInputMade && argonValidation.dateOfBirth.initialYearInputMade) {
            argonValidation.validateDateOfBirthTemp();
        }
    });

})(window.jQuery, namespace('argon.validation'));

;
// Submission modal
(function ($, argonValidation, undefined) {
    $('body').on('click', 'button[type="submit"]', function (e) {
        argonValidation.validateCurrentStep();

        if (!$(e.target).parents('form:first').valid()) {
            e.preventDefault();
        } else {
            var $submitModal = $('#submit-modal');
            $submitModal.modal({
                backdrop: 'static',
                keyboard: false
            });

            $submitModal.modal('show');
        }
    });

    $("[data-auto-tab]").each(function () {
        var input = $(this);
        var tabTo = $('#' + input.attr("data-auto-tab"));
        var maxLength = input.attr("maxlength");

        if (tabTo != undefined && maxLength != undefined) {
            input.keyup(function (e) {
                var unicode = e.keyCode ? e.keyCode : e.charCode;
                var len = input.val().length;
                var maxLen = parseInt(maxLength);
                if ((len >= maxLen) && ((unicode >= 48 && unicode <= 57) || (unicode >= 96 && unicode <= 105))) {
                    if (len > maxLen) {
                        input.val(input.val().substring(0, maxLen));
                    }

                    tabTo.focus();
                    tabTo.trigger("click");//Persists keyboard on (some) mobiles
                }
            });
        }
    });
})(window.jQuery, namespace('argon.validation'));

// Rescroll collapsed accordions...
;
(function ($, undefined) {
    $('.panel-collapse').on('hidden.bs.collapse', function (e) {
        var accordionOffset = $(e.target).parents('.box-yl').offset();

        // For aesthetic padding...
        var adjustedAccordionOffsetTop = accordionOffset.top - 5;

        var windowScrollTop = $(window).scrollTop();

        // Only run the animation if the current scroll position of the window is below the target accordion...
        if (adjustedAccordionOffsetTop < windowScrollTop) {
            $('body').animate({ scrollTop: adjustedAccordionOffsetTop }, '50');
        }
    });
})(window.jQuery);

(function (helloSoda, undefined) {
    if (!helloSoda) {
        return;
    }

    var dateOfBirthName = 'HelloSoda.DateOfBirth';
    var $dateOfBirth = $('[name="' + dateOfBirthName + '"]');
    var $day = $('[name="DateOfBirth.Day"]');
    var $month = $('[name="DateOfBirth.Month"]');
    var $year = $('[name="DateOfBirth.Year"]');

    helloSoda.init({
        productId: "568aa84ac7b933082e3f8096",
        buttons: true,
        connect: 'socialconnect/popup',
        form: "#apply-form",
        events: {
            onSocialProfileAvailable: function () {
                if ($dateOfBirth.length) {
                    var dateOfBirth = $dateOfBirth.val();
                    var parts = dateOfBirth.split('/');

                    if (parts.length < 3) {
                        return;
                    }

                    var day = parseInt(parts[0], 10);
                    var month = parseInt(parts[1], 10);
                    var year = parseInt(parts[2], 10);

                    if (!$day.val()) {
                        $day.val(day);
                    }

                    if (!$month.val()) {
                        $month.val(month);
                    }

                    if (!$year.val()) {
                        $year.val(year);
                    }
                }
            }
        }
    }, [
        { formfield: 'FirstName', api: 'data.first_name' },
        { formfield: 'LastName', api: 'data.last_name' },
        { formfield: 'EmailAddress', api: 'data.contact.email' },
        { formfield: 'EmailAddressConfirmation', api: 'data.contact.email' },
        { formfield: dateOfBirthName, api: 'data.birthdate', translate: HelloSoda.date('dd/MM/yyyy') }
    ]);
})(window.HelloSoda);