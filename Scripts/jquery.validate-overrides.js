;
(function ($, undefined) {
    
    // Bootstrap overrides...
    function boostrapHighlight(element, errorClass, validClass) {
        $(element).closest('.form-group').addClass('has-error');
        $(element).trigger('highlated');
    }

    function boostrapUnhighlight(element, errorClass, validClass) {
        var $formGroup = $(element).closest('.form-group');

        if (!$formGroup.find('.field-validation-error').length) {
            $(element).closest('.form-group').removeClass('has-error');
            $(element).trigger('unhighlated');
        }
    }

    $.validator.setDefaults({
        ignore: '.data-val-ignore',
        highlight: function (element, errorClass, validClass) {
            boostrapHighlight(element, errorClass, validClass);
        },
        unhighlight: function (element, errorClass, validClass) {
            boostrapUnhighlight(element, errorClass, validClass);
        }
    });

    // Trigger inline validation for checkboxes and radios.
    $(document).on('change', 'input[type="checkbox"], input[type="radio"]', function (e) {
        var $input = $(e.target);

        $input.parents('form:first')
            .validate()
            .check($input);
    });

    // Date decorator...
    var _date = $.validator.methods.date;

    $.validator.methods.date = function (value, element) {
        return _date.call(this, Globalize.parseDate(value), element);
    };

    // Date ISO decorator...
    var _dateISO = $.validator.methods.dateISO;

    $.validator.methods.dateISO = function (value, element) {
        return date_ISO.call(this, Globalize.parseDate(value), element);
    };

    // Number decorator...
    var _number = $.validator.methods.number;

    $.validator.methods.number = function (value, element) {
        return _number.call(this, Globalize.parseFloat(value), element);
    };

    // Range decorator...
    var _range = $.validator.methods.range;

    $.validator.methods.range = function (value, element, param) {
        return _range.call(this, Globalize.parseFloat(value), element, param);
    };

    // AgeRangeAttribute...
    $.validator.unobtrusive.adapters.add('agerange', ['minimumage', 'maximumage'],
        function (options) {
            options.rules['agerange'] = options.params;
            options.messages['agerange'] = options.message;
        });

    $.validator.addMethod('agerange', function (value, element, params) {

        var now = new Date();

        var maximumDate = new Date(now.getFullYear() - parseInt(params.maximumage), now.getMonth(), now.getDate());
        var minimumDate = new Date(now.getFullYear() - parseInt(params.minimumage), now.getMonth(), now.getDate());

        var dateParts = value.split('/');
        var valueAsDate = new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0]));

        if (valueAsDate < (maximumDate) || valueAsDate > (minimumDate)) {
            return false;
        }

        return true;
    }, '');

    // NumberOfAttribute...
    $.validator.unobtrusive.adapters.add('numberof', ['conditionpropertyname', 'conditiondifference', 'conditioncomparisonoperator', 'conditionmathematicaloperator'],
        function (options) {
            options.rules['numberof'] = options.params;
            options.messages['numberof'] = options.message;
        });

    $.validator.addMethod('numberof', function (value, element, params) {
        var $conditionProperty = $('[name$="' + params.conditionpropertyname + '"]:first');

        if (!$conditionProperty.length) {
            return false;
        }

        var expression = Globalize.parseFloat(value) + params.conditioncomparisonoperator + '(' + Globalize.parseFloat($conditionProperty.val()) + ' ' + params.conditionmathematicaloperator + ' ' + Globalize.parseFloat(params.conditiondifference) + ')';

        return eval(expression);
    }, '');

    // MonthYearAttribute...
    $.validator.unobtrusive.adapters.add('monthyear', ['comparisonoperator'],
        function (options) {
            options.rules['monthyear'] = options.params;
            options.messages['monthyear'] = options.message;
        });

    $.validator.addMethod('monthyear', function (value, element, params) {
        var $element = $(element);
        var $formGroup = $element.parents('.form-group:first');
        var $month = $formGroup.find('[name$="Month"]:first');
        var $year = $formGroup.find('[name$="Year"]:first');

        if (!parseInt($month.val()) || !parseInt($year.val())) {
            return false;
        }

        var now = new Date();
        var expression = 'new Date(' + $year.val() + ', ' + $month.val() + ', 1, 0, 0, 0, 0)' + params.comparisonoperator + 'new Date(' + now.getFullYear() + ', ' + now.getMonth() + ', 1, 0, 0, 0, 0)';

        return eval(expression);
    }, '');

    // PercentageOfAttribute...
    $.validator.unobtrusive.adapters.add('percentageof', ['conditionpropertyname', 'conditionpercentage', 'conditioncomparisonoperator'],
        function (options) {
            options.rules['percentageof'] = options.params;
            options.messages['percentageof'] = options.message;
        });

    $.validator.addMethod('percentageof', function (value, element, params) {
        var $conditionProperty = $('[name$="' + params.conditionpropertyname + '"]:first');

        if (!$conditionProperty.length) {
            return false;
        }

        var expression = Globalize.parseFloat(value) + params.conditioncomparisonoperator + '((' + Globalize.parseFloat($conditionProperty.val()) + ' / 100) * ' + params.conditionpercentage + ')';

        return eval(expression);
    }, '');

    // Regex...
    $.validator.unobtrusive.adapters.add('regex', ['conditionpropertyname', 'conditionvalue'],
        function (options) {
            var $element = $(options.element);
            var $conditionProperty = $('[name$="' + options.params.conditionpropertyname + '"]:first');
            var validateElement = function () {
                $element.validate();
            };

            $conditionProperty.change(validateElement).keyup(validateElement);

            // These get ignored for some reason!?
            //options.rules['regex'] = options.params;
            //options.messages['regex'] = options.message;
        });

    var _regex = $.validator.methods.regex;

    $.validator.methods.regex = function (value, element, params) {
        var $element = $(element);
        var conditionPropertyName = $element.attr('data-val-regex-conditionpropertyname');
        var conditionValue = $element.attr('data-val-regex-conditionvalue');

        if (conditionPropertyName === undefined || conditionValue === undefined) {
            return _regex.call(this, value, element, params);
        }

        var $conditionProperty = $('[name$="' + conditionPropertyName + '"]:first');

        if (!$conditionProperty.length) {
            return _regex.call(this, value, element, params);
        }

        if ($conditionProperty.is(':checkbox')) {
            if ($conditionProperty[0].checked.toString().toLowerCase() === conditionValue.toLowerCase()) {
                return _regex.call(this, value, element, params);
            }
        }
        else if ($conditionProperty.val().toLowerCase() === conditionValue.toLowerCase()) {
            return _regex.call(this, value, element, params);
        }

        return true;
    };

    // RequiredIfAttribute...
    $.validator.unobtrusive.adapters.add('requiredif', ['conditionpropertyname', 'conditionvalue'],
        function (options) {
            var $element = $(options.element);
            var $conditionProperty = $('[name$="' + options.params.conditionpropertyname + '"]:first');
            var validateElement = function () {
                $element.validate();
            };

            $conditionProperty.change(validateElement).keyup(validateElement);

            options.rules['requiredif'] = options.params;
            options.messages['requiredif'] = options.message;
        });

    $.validator.addMethod('requiredif', function (value, element, params) {
        var $conditionProperty = $('[name$="' + params.conditionpropertyname + '"]:first');

        if (!$conditionProperty.length) {
            return false;
        }

        if ($conditionProperty.is(':checkbox')) {
            if ($conditionProperty[0].checked.toString().toLowerCase() === params.conditionvalue.toLowerCase() && !value.length) {
                return false;
            }
        }
            //else if ($conditionProperty.val().toLowerCase() === params.conditionvalue.toLowerCase() && !value.length) {
            //    return false;
            //}
        else {
            var conditionValues = params.conditionvalue.toLowerCase().split(',');

            if (_.indexOf(conditionValues, $conditionProperty.val().toLowerCase()) != -1 && !value.length) {
                return false;
            }
        }

        return true;
    }, '');

    // RequiredValueAttribute...
    $.validator.unobtrusive.adapters.add('requiredvalue', ['value'],
        function (options) {
            options.rules['requiredvalue'] = options.params;
            options.messages['requiredvalue'] = options.message;
        });

    $.validator.addMethod('requiredvalue', function (value, element, params) {
        var $element = $(element);

        if ($element.is(':checkbox')) {
            if (element.checked.toString().toLowerCase() !== params.value.toLowerCase()) {
                return false;
            }
        }
        else if ($element.is(':radio')) {
            var name = $element.attr('name');
            var isValid = false;

            $('input[name="' + name + '"][type="radio"]').each(function (i, radio) {
                if (radio.checked) {
                    if ($(radio).val().toString().toLowerCase() === params.value.toLowerCase()) {
                        isValid = true;

                        return false;
                    }
                }
            });

            return isValid;
        }
        else if ($(element).val().toLowerCase() !== params.value.toLowerCase()) {
            return false;
        }

        return true;
    }, '');

    // MinimumAgeAttribute...
    $.validator.unobtrusive.adapters.add('minimumage', ['minimumage'],
        function (options) {
            options.rules['minimumage'] = options.params;
            options.messages['minimumage'] = options.message;
        });

    $.validator.addMethod('minimumage', function (value, element, params) {

        var now = new Date();

        var minimumDate = new Date(now.getFullYear() - parseInt(params.minimumage), now.getMonth(), now.getDate());

        var dateParts = value.split('/');
        var valueAsDate = new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0]));

        if (valueAsDate > (minimumDate)) {
            return false;
        }

        return true;
    }, '');
    
    // MatchesPropertyAttribute...
    $.validator.unobtrusive.adapters.add('matchesproperty', ['conditionpropertyname'],
        function (options) {
            options.rules['matchesproperty'] = options.params;
            options.messages['matchesproperty'] = options.message;
        });

    $.validator.addMethod('matchesproperty', function (value, element, params) {
        var $conditionProperty = $('[name$="' + params.conditionpropertyname + '"]:first');

        if (!$conditionProperty.length) {
            return false;
        }

        if (value === $conditionProperty.val()) {
            return true;
        }

        return false;
    }, '');
})(window.jQuery);