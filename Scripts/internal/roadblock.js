;

(function($, argonRoadblock, undefined) {

    window.onclick = function (e) {
        argonRoadblock.lastElementClicked = e.target;
        return true;
    }

    argonRoadblock.alreadyBlocked = false;

    // Parameter 'excludedElements' is optional and is an array of selectors that match elements that should not
    // trigger the roadblock...
    argonRoadblock.registerRoadblock = function(message, excludedElements) {
        window.addEventListener('beforeunload', function(e) {
            if (argonRoadblock.alreadyBlocked == false) {

                var triggerRoadblock = true;

                if (excludedElements) {
                    if (excludedElements.length) {
                        for (var i = 0; i <= excludedElements.length - 1; i++) {
                            var excludedElement = $(excludedElements[i]);
                            var lastElementClicked = $(argonRoadblock.lastElementClicked);

                            // If the last element clicked was found in the excluded list, set the flag to false
                            // and break as we don't want to trigger the roadblock...
                            if (excludedElement.is(lastElementClicked)) {
                                triggerRoadblock = false;
                                break;
                            }
                        }
                    } 
                }

                if (triggerRoadblock === true) {
                    argonRoadblock.alreadyBlocked = true;

                    (e || window.event).returnValue = message; //Gecko + IE
                    return message; // Webkit, Safari, Chrome etc.    
                }
            }
        });
    };
})
(window.jQuery, namespace('argon.roadBlock'));