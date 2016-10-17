;

(function ($, argonValidation, argon) {

    // Temp time at validation...
    argonValidation.isTimeAtValid = function ($element) {
        $timeAtSiblingInput = $element.parent().siblings('.timeat').find('input[name*="TimeAt"]');

        var validationPassed = true;

        if (parseInt($element.val(), 10) == 0 && parseInt($timeAtSiblingInput.val()) == 0) {
            validationPassed = false;
        }

        return validationPassed;
    };

    // Temp time at validation...
    // This is called in create.js...
    argonValidation.validateTimeAt = function ($element) {

        var validationPassed = argonValidation.isTimeAtValid($element);

        // Temp span element put in TimeAtModel editor template...
        $timeAtValidationMessage = $element.parent().parent().find('span.time-at-validation-message');

        if (validationPassed === false) {
            timeAtValidationMessage = '<span id="' + $element.attr('id') + '-error">The given time must be greater than 0</span>';

            $timeAtValidationMessage.addClass('field-validation-error');
            $timeAtValidationMessage.removeClass('field-validation-valid');
            $timeAtValidationMessage.empty();
            $timeAtValidationMessage.append(timeAtValidationMessage);
        }
        else {
            $timeAtValidationMessage.removeClass('field-validation-error');
            $timeAtValidationMessage.addClass('field-validation-valid');
            $timeAtValidationMessage.empty();
        }

        return validationPassed;
    };

    // Temp date of birth validation...
    argonValidation.isDateOfBirthValid = function () {
        $day = $('#DateOfBirth_Day');
        $month = $('#DateOfBirth_Month');
        $year = $('#DateOfBirth_Year');

        var validationPassed = true;

        if (!parseInt($month.val(), 10) || !parseInt($year.val(), 10) || !parseInt($day.val(), 10)) {
            validationPassed = false;
        }

        // correct month...
        var month = $month.val() - 1;

        var checkDate = new Date($year.val(), month, $day.val());

        if (checkDate.getDate() != $day.val() || checkDate.getMonth() != month || checkDate.getFullYear() != $year.val()) {
            validationPassed = false;
        }

        // check age if valid date
        if (validationPassed) {
            var age = getAge(checkDate);

            if (age < 18) {
                validationPassed = false;
            }
        }

        return validationPassed;
    };

    // Temp date of birth validation...
    // This is called in create.js...
    argonValidation.validateDateOfBirthTemp = function () {

        var validationPassed = argonValidation.isDateOfBirthValid();

        $dateOfBirthValidationMessage = $('span[data-valmsg-for="DateOfBirth"]');
        dateOfBirthValidationMessage = '<span id="DateOfBirth-error">This is not a valid date of birth</span>';

        if (validationPassed === false) {
            $dateOfBirthValidationMessage.addClass('field-validation-error');
            $dateOfBirthValidationMessage.removeClass('field-validation-valid');
            $dateOfBirthValidationMessage.empty();
            $dateOfBirthValidationMessage.append(dateOfBirthValidationMessage);

        } else {
            $dateOfBirthValidationMessage.removeClass('field-validation-error');
            $dateOfBirthValidationMessage.addClass('field-validation-valid');
            $dateOfBirthValidationMessage.empty();
        }

        return validationPassed;
    };

    function getAge(dob, from) {
        from = from || new Date();
        var diff = from.getTime() - dob.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    }

    argonValidation.isCurrentStepValid = function () {

        // Get all form inputs from current step...
        var $elements = $('.step:visible input:not(\'.data-val-ignore\'):visible, .step:visible select:not(\'.data-val-ignore\'):visible');

        var isCurrentStepValid = true;

        // Temp date of birth validation...
        var dateOfBirthInCurrentStep = false;

        // Temp time at validation...
        var timeAtInCurrentStep = false;
        var visibleTimeAtElements = new Array();

        // Validate each input in current step...
        $elements.each(function () {
            var elementIsValid = $(this).valid();

            if (isCurrentStepValid) {
                isCurrentStepValid = elementIsValid;
            }

            // Temp date of birth validation...
            if (!dateOfBirthInCurrentStep) {
                if ($(this).attr('name').indexOf('DateOfBirth') > -1) {
                    dateOfBirthInCurrentStep = true;
                }
            }
            // Temp time at validation...
            if ($(this).attr('name').indexOf('PreviousResidency.TimeAt.Years') > -1) {
                timeAtInCurrentStep = true;
                visibleTimeAtElements.push($(this));
            }
            if ($(this).attr('name').indexOf('PreviousResidency.TimeAt.Months') > -1) {
                timeAtInCurrentStep = true;
                visibleTimeAtElements.push($(this));
            }
            if ($(this).attr('name').indexOf('CurrentResidency.TimeAt.Years') > -1) {
                timeAtInCurrentStep = true;
                visibleTimeAtElements.push($(this));
            }
            if ($(this).attr('name').indexOf('CurrentResidency.TimeAt.Months') > -1) {
                timeAtInCurrentStep = true;
                visibleTimeAtElements.push($(this));
            }
            if ($(this).attr('name').indexOf('BankAccount.TimeAt.Years') > -1) {
                timeAtInCurrentStep = true;
                visibleTimeAtElements.push($(this));
            }
            if ($(this).attr('name').indexOf('BankAccount.TimeAt.Months') > -1) {
                timeAtInCurrentStep = true;
                visibleTimeAtElements.push($(this));
            }
        });

        // Temp date of birth validation...
        if (dateOfBirthInCurrentStep === true) {
            var isDateOfBirthValid = argonValidation.validateDateOfBirthTemp();

            if (isCurrentStepValid)
                isCurrentStepValid = isDateOfBirthValid;
        }

        // Temp time at validation...
        if (timeAtInCurrentStep === true) {
            var isTimeAtValid = true;

            for (var i = 0; i < visibleTimeAtElements.length; i++) {
                isTimeAtValid = argonValidation.validateTimeAt(visibleTimeAtElements[i]);
            }

            if (isCurrentStepValid)
                isCurrentStepValid = isTimeAtValid;
        }

        return isCurrentStepValid;
    };

    // Flag to show when current step is displaying an error message...
    argonValidation.isGeneralErrorVisible = function () {
        return $('.step:visible .general-error').is(':visible');
    };

    argonValidation.validateCurrentStep = function () {
        var isCurrentStepValid = argonValidation.isCurrentStepValid();

        if (!isCurrentStepValid) {
            $('.step:visible .general-error').removeClass('hide');
        } else {
            $('.step:visible .general-error').addClass('hide');
        }

        return isCurrentStepValid;

    };

    argonValidation.setAddressEditModeValidation = function(isEditMode) {
        var previousMaxLengthMessage = argon.controls.currentResidency.flat.data("val-maxlength");
        var previousMaxLength = argon.controls.currentResidency.flat.data("val-maxlength-max");

        if (isEditMode) {
            
            if (!argon.controls.currentResidency.flat.data("maxlength-unedited")) {
                argon.controls.currentResidency.flat.data("maxlength-unedited", previousMaxLength);
            }
            
            var maxLengthEdited = +argon.controls.currentResidency.flat.data("maxlength-edited");

            argon.controls.currentResidency.flat.rules("remove", "maxlength");
            argon.controls.currentResidency.flat.rules("add",
            {
                maxlength: maxLengthEdited,
                messages: {
                    maxlength: previousMaxLengthMessage.replace(previousMaxLength, maxLengthEdited)
                }
            });
            argon.controls.currentResidency.flat.valid();
        } else {
            var undeditedMaxLength = argon.controls.currentResidency.flat.data("maxlength-raw");

            argon.controls.currentResidency.flat.rules("remove", "maxlength");
            argon.controls.currentResidency.flat.rules("add",
            {
                maxlength: undeditedMaxLength,
                messages: {
                    maxlength: previousMaxLengthMessage.replace(previousMaxLength, undeditedMaxLength)
                }
            });
            argon.controls.currentResidency.flat.valid();
        }
    }


})(window.jQuery, namespace('argon.validation'), namespace('argon'));

;
(function ($, argonValidation, undefined) {
    $(document).on('change', '.step:visible input:not(\'.data-val-ignore\'), .step:visible select:not(\'.data-val-ignore\')', function (e) {
        if (argonValidation.isGeneralErrorVisible()) {
            argonValidation.validateCurrentStep();
        }
    });
})(window.jQuery, namespace('argon.validation'));

;
(function ($, argonValidation, undefined) {
    $.validator.unobtrusive.adapters.addSingleVal("lessThanAge", "selectors");

    $.validator.addMethod("lessThanAge", function (val, element, selectorsJson) {
        if (!argonValidation.isDateOfBirthValid()) {
            return true;
        }

        var selectors = $.parseJSON(selectorsJson);

        var dateOfBirthMonth = parseInt($("#DateOfBirth_Month").val());
        var dateOfBirthYear = parseInt($("#DateOfBirth_Year").val());
        var currentYear = new Date().getFullYear();
        var currentMonth = new Date().getMonth() + 1;
        var $timeAtYear = $(selectors.year);
        var $timeAtMonth = $(selectors.month);
        var timeAtYear = parseInt($timeAtYear.val()) || 0;
        var timeAtMonth = parseInt($timeAtMonth.val()) || 0;
        var ageInMonths = ((currentYear - dateOfBirthYear) * 12) + (currentMonth - dateOfBirthMonth);
        var timeAtTotalInMonths = (timeAtYear * 12) + timeAtMonth;

        return timeAtTotalInMonths <= ageInMonths;
    });
})(window.jQuery, namespace('argon.validation'));

;
(function ($, argonValidation, undefined) {
    $.validator.unobtrusive.adapters.add('requiredif', ['conditionpropertyname', 'conditionvalue'], function (options) {
        options.rules['requiredif'] = options.params;
        options.messages['requiredif'] = options.message;
    });

    $.validator.addMethod('requiredif', function (value, element, parameters) {
        var desiredvalue = parameters.conditionvalue;
        desiredvalue = (desiredvalue == null ? '' : desiredvalue).toString();
        var controlType = $("input[id$='" + parameters.conditionpropertyname + "']").attr("type");
        var actualvalue = {}
        if (controlType === "checkbox" || controlType === "radio") {
            var control = $("input[id$='" + parameters.conditionpropertyname + "']:checked");
            actualvalue = control.val();
        } else {
            actualvalue = $("#" + parameters.conditionpropertyname).val();
        }
        if ($.trim(desiredvalue).toLowerCase() === $.trim(actualvalue).toLocaleLowerCase()) {
            var isValid = $.validator.methods.required.call(this, value, element, parameters);
            return isValid;
        }
        return true;
    });
})(window.jQuery, namespace('argon.validation'));

;
(function ($, undefined) {
    $(function () {
        $(document).on('change', '[data-timeat="true"]', function () {
            var $this = $(this);
            var $timeAtYears = $($this.data('timeatYears'));
            var $timeAtMonths = $($this.data('timeatMonths'));
            var $timeAtTotalMonths = $($this.data('timeatTotalmonths'));

            if (!$timeAtYears.length || !$timeAtMonths.length || !$timeAtTotalMonths.length) {
                return;
            }

            var timeAtYears = parseInt($timeAtYears.val(), 10) || 0;
            var timeAtMonths = parseInt($timeAtMonths.val(), 10) || 0;

            var timeAtTotalMonths = (timeAtYears * 12) + timeAtMonths;
            $timeAtTotalMonths.val(timeAtTotalMonths)
                .valid();
        });
    });
})(window.jQuery);
