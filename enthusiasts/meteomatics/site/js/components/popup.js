/* jshint strict: global */
/* global window, console, L */

"use strict";
window.metoffice = window.metoffice || {};
window.metoffice.enthusiast = window.metoffice.enthusiast || {};

window.metoffice.enthusiast.popup = (function() {

    var map,
        popup,
        content,
        configuration,
        latestRuns,
        currentModel,
        currentLayer,
        currentAltitude,
        currentLocation,
        currentTimestep,
        availableTimesteps;

    var init = function() {

        // Configuration from Core
        window.metoffice.eventBus.subscribeToEvent(window.metoffice.enthusiast.eventDefinitions.CONFIGURATION_LOADED, function(payload) {

            configuration = payload;

        });

        // Latest runs from Core
        window.metoffice.eventBus.subscribeToEvent(window.metoffice.enthusiast.eventDefinitions.LATEST_RUNS_LOADED, function(payload) {

            latestRuns = payload;

        });

        // Map from Core
        window.metoffice.eventBus.subscribeToEvent(window.metoffice.enthusiast.eventDefinitions.MAP_READY, function(payload) {

            map = payload;

            createPopup();

        });

        // Layer Change from Layer Picker
        window.metoffice.eventBus.subscribeToEvent(window.metoffice.enthusiast.eventDefinitions.LAYER_CHANGED, function(payload) {

            currentModel = payload.modelConfig;
            currentLayer = payload.layerConfig;

            // Change the layer unless currentLayer.parameter has a vertical component, then clear currentAltitude
            if (typeof currentLayer.parameter.vertical === "undefined") {

                // Clear currentAltitude
                currentAltitude = undefined;

            }

        });

        // Altitude Change from Altitude Picker
        window.metoffice.eventBus.subscribeToEvent(window.metoffice.enthusiast.eventDefinitions.ALTITUDE_CHANGED, function(payload) {

            currentAltitude = payload;

        });

        // Timeline timeDimension changed
        window.metoffice.eventBus.subscribeToEvent(window.metoffice.enthusiast.eventDefinitions.TIME_DIMENSION_CHANGED, function(payload) {

            availableTimesteps = payload.timeSteps;

        });

        // Timeline timestep changed
        window.metoffice.eventBus.subscribeToEvent(window.metoffice.enthusiast.eventDefinitions.TIMELINE_CHANGED, function(payload) {

            currentTimestep = Math.abs(payload.timestepIndex);

            // Only need to update what data values to show on popup if it is open
            if (popup.isOpen()) {
                updatePopupContentAndShow();
            }

        });

        // Listen for map click
        window.metoffice.eventBus.subscribeToEvent(window.metoffice.enthusiast.eventDefinitions.MAP_CLICKED, function(payload) {

            currentLocation = payload;

            // Toggle display of popup
            togglePopup(currentLocation);

        });

    };

    var createPopup = function() {

        // Create popup
            popup = L.responsivePopup({
            closeButton: false,
            closeOnClick: false,
            autoPanPaddingTopLeft: configuration.map.offsets.leftTop,
            autoPanPaddingBottomRight: configuration.map.offsets.rightBottom
        });

    };

    var togglePopup = function(location) {

        if (!popup.isOpen()) {

            // Position it
            popup.setLatLng(location);

            // Update the content and show it
            updatePopupContentAndShow();

            window.metoffice.eventBus.notifyEventSubscribers(window.metoffice.enthusiast.eventDefinitions.MAP_POPUP_SHOWN);


        } else {

            // Close it
            map.closePopup();

        }

    };

    var updatePopupContentAndShow = function() {

        getPopupDataFromAPI(map.wrapLatLng(currentLocation), latestRuns, function(response) {

            content = preparePopupContent(content, response);
            popup.setContent(content);

            if (!popup.isOpen()) {
                popup.openOn(map);
            }

        });

    };

    var getPopupDataFromAPI = function(normalisedCoordinates, latestRuns, callback) {

        var url,
            xhr = new window.XMLHttpRequest(),
            responseJSON,
            startDateTime,
            endDateTime,
            counter;

        // Prepare API call
        url = configuration.paths.pathAPI;

        // Set up date/time for request
        startDateTime = new Date(availableTimesteps[0]).toISOString();
        endDateTime = new Date(availableTimesteps[availableTimesteps.length - 1]).toISOString();
        url = url + "/" + startDateTime + "--" + endDateTime + ":" + currentLayer.time.step + "/";

        // Popup parameters
        for (counter = 0; counter < currentLayer.popup.length; counter++) {

            if (typeof currentLayer.popup[counter].parameter !== "undefined") {

                url = url + currentLayer.popup[counter].parameter;

                if (typeof currentLayer.popup[counter].interval !== "undefined") {
                    url = url + "_" + currentLayer.popup[counter].interval;
                }

                if (typeof currentAltitude !== "undefined") {
                    url = url + "_" + currentAltitude;
                }

                url = url + ":" + currentLayer.popup[counter].units[0];

                if (counter < currentLayer.popup.length - 1) {
                    url = url + ",";
                }

            }

        }

        url = url + "/" + normalisedCoordinates.lat.toFixed(4);
        url = url + "," + normalisedCoordinates.lng.toFixed(4);
        url = url + "/json?model=" + currentModel.id;

        // Latest run for the currentModel (cache buster)
        if (typeof latestRuns[currentModel.id] !== "undefined") {
            url = url + "&run=" + latestRuns[currentModel.id];
        }

        // Toggle off downsampling?
        if (!currentModel.downsampling) {
            url = url + "&interp_select=none";
        }

        // Make the API call
        xhr.open("GET", url);

        xhr.onload = function() {

            if (xhr.status !== 200) {
                console.error("Error loading API data", xhr.responseText);
            }

            responseJSON = JSON.parse(xhr.responseText);

            if (typeof callback === "function") {
                callback(responseJSON);
            }

        };

        xhr.send();

    };

    var preparePopupContent = function(content, results) {

        var counter,
            offset = 0,
            currentValue;

        if (results.status !== "ERROR") {

            // Reset
            content = "";

            // Special case for just popup labels without parameters
            if (typeof currentLayer.popup[0].parameter === "undefined") {

                // If no parameter just show the label
                content += '<div class="leaflet-popup-content">' + currentLayer.popup[0].label + '</div>';

                // Increse offset
                offset = offset + 1;

            }

            // Popup parameters
            for (counter = 0; counter < results.data.length; counter++) {

                // Data
                currentValue = results.data[counter].coordinates[0].dates[currentTimestep].value;

                // Modify for reserved values
                currentValue = reservedValueCheck(currentValue, configuration.units[currentLayer.popup[counter + offset].units[0]]);

                // Content
                content += '<div class="leaflet-popup-content">' + currentLayer.popup[counter + offset].label + '<br><span>' + currentValue + '</span></div>';

            }

        } else {

            content = '<div class="leaflet-popup-content">No data</div>';

        }

        return content;

    };

    var reservedValueCheck = function (value, units) {

        if (value === -999 || value === -888 || value === -777) {
            value = "No data";
        } else if (value === -666) {
            value = "Not<br>applicable to<br>this location";
        } else {
            value = value + ' ' + units;
        }

        return value;

    };

    // Only return functions that need to be accessed outside the module
    return {
        init: init
    };

})();

window.addEventListener("DOMContentLoaded", window.metoffice.enthusiast.popup.init);