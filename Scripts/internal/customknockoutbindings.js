;
(function ($, undefined) {
    ko.bindingHandlers.slider = {
        init: function(element, valueAccessor, allBindingsAccessor) {
            var options = allBindingsAccessor().sliderOptions || {};

            $(element).slider(options);
            $(element).draggable();

            ko.utils.registerEventHandler(element, "slidechange", function(event, ui) {
                var observable = valueAccessor();
                if ($(".ui-slider-handle").is(":focus")) {
                    observable(Math.round(ui.value / 10) * 10);
                } else {
                    observable(ui.value);
                }
            });

            ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                $(element).slider("destroy");
            });

            ko.utils.registerEventHandler(element, "slide", function(event, ui) {
                var observable = valueAccessor();
                if ($(".ui-slider-handle").is(":focus")) {
                    observable(Math.round(ui.value / 10) * 10);
                } else {
                    observable(ui.value);
                }
            });
        },
        update: function(element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            if (isNaN(value)) value = 0;
            $(element).slider("value", value);
        }
    };
})(window.jQuery);


;
(function($, undefined) {
    ko.bindingHandlers.scrollVisible = {
        init: function(element, valueAccessor) {
            // Initially set the element to be instantly visible/hidden depending on the value
            var value = valueAccessor();
            $(element).toggle(ko.unwrap(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
        },
        update: function(element, valueAccessor) {
            // Whenever the value subsequently changes, slide the element in or out
            var value = valueAccessor();
            ko.unwrap(value) ? show(element) : $(element).hide();
        }
    };
    
    function show(element) {

        $('.popover').hide();

        $(element).show();
        window.scrollTo(0, 0);
    }

}(window.jQuery))