/* jshint strict: global */
/* global window, document, L, WMSCapabilities, nezasa, XMLHttpRequest, console */

"use strict";
window.metoffice = window.metoffice || {};
window.metoffice.serviceHub = window.metoffice.serviceHub || {};

window.metoffice.serviceHub.core = (function() {

    var map,
        capabilities,
        timeSteps = [];

    var init = function() {

        getCapabilities("https://mdda.hub.metoffice.cloud/wms/glm/long?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities");

    };

    var getCapabilities = function(capabilitiesURL) {

        var xhr = new XMLHttpRequest();

        xhr.open("GET", capabilitiesURL);
        xhr.setRequestHeader("x-api-key", "29095ff2ff043405adb7913eba4844e536a54136f7dd70fa50cc613c94dfe93c");
        xhr.onload = function() {
            afterGetCapabilities(xhr);
        };
        xhr.send();

    };

    var afterGetCapabilities = function(xhr) {

        if (xhr.status === 200) {
            parseCapabilities(xhr.responseText);
        } else {
            console.error("Capabilities failed to load", xhr.responseURL);
        }

    };

    var parseCapabilities = function(responseText) {

        var layers,
            defaultRun,
            timeStrings;

        capabilities = new WMSCapabilities().parse(responseText);
        layers = capabilities.Capability.Layer.Layer;

        layers.forEach(function(layer) {

            //console.log(layer.Title);

            defaultRun = Date.parse(layer.Dimension[0].default);
            timeStrings = layer.Dimension[1].values.split(",");
            timeSteps = [];

            timeStrings.forEach(function(timeString, index) {

                var valueInMilliSeconds = window.nezasa.iso8601.Period.parseToTotalSeconds(timeString) * 1000,
                    timeStep = {
                        index: index,
                        epoch: defaultRun + valueInMilliSeconds,
                        periodISO8601: timeString,
                        stepISO8601: new Date(defaultRun + valueInMilliSeconds).toISOString()
                    };

                timeSteps.push(timeStep);

            });

            console.log(layer.Title, timeSteps);

        });

        console.log(capabilities);

    };

    // Only return functions that need to be accessed outside the module
    return {
        init: init
    };

})();

window.addEventListener("DOMContentLoaded", window.metoffice.serviceHub.core.init);