/* jshint strict: global */
/* global window, console, L, d3 */

"use strict";
window.metoffice = window.metoffice || {};
window.metoffice.enthusiast = window.metoffice.enthusiast || {};

window.metoffice.enthusiast.leafletControls = (function() {

    var map,
        configuration,
        currentLayer,
        currentModel,
        currentAltitude,
        attributionControl,
        shareControl,
        explainerControl,
        zoomControl,
        keyControl;

    var init = function() {

        // Configuration from Core
        window.metoffice.eventBus.subscribeToEvent(window.metoffice.enthusiast.eventDefinitions.CONFIGURATION_LOADED, function(payload) {

            configuration = payload;

        });

        // Map from Core
        window.metoffice.eventBus.subscribeToEvent(window.metoffice.enthusiast.eventDefinitions.MAP_READY, function(payload) {

            map = payload;

        });

        // Layer Change from Layer Picker
        window.metoffice.eventBus.subscribeToEvent(window.metoffice.enthusiast.eventDefinitions.LAYER_CHANGED, function(payload) {

            currentLayer = payload.layerConfig;
            currentModel = payload.modelConfig;

            // Create the controls unless layer.parameter has a vertical component, then wait until the altitude picker changes
            if (typeof currentLayer.parameter.vertical === "undefined") {
                createControls();
            }

        });

        // Altitude Change from Altitude Picker
        window.metoffice.eventBus.subscribeToEvent(window.metoffice.enthusiast.eventDefinitions.ALTITUDE_CHANGED, function(payload) {

            currentAltitude = payload;

            // Create the controls
            createControls();

        });

    };

    var createControls = function() {

        explainerControl = createExplainerControl(map, explainerControl);
        shareControl = createShareControl(map, shareControl);       
        keyControl = createKeyControl(map, keyControl);
        zoomControl = createZoomControl(map, zoomControl);
        attributionControl = createAttributionControl(map, attributionControl);

    };

    var createAttributionControl = function(map, control) {

        // Remove if already exists
        removeControl(control);

        // Only add attribution if text is found in configuration
        if (configuration.map.attributionText) {

            control = L.control.attribution({
                prefix: configuration.map.attributionText,
                position: "bottomleft",
            }).addTo(map);

            return control;

        }

    };

    var createShareControl = function(map, control) {

        // Remove if already exists
        removeControl(control);

        if (!L.Browser.mobile) {

            // Create Leaflet Control container
            control = L.control({
                position: "topright",
            });

            // Add a div on add
            control.onAdd = function() {

                var share = L.DomUtil.create('div', 'share-control');

                L.DomEvent.disableClickPropagation(share);

                share.setAttribute("id", "share-control");

                return share;

            };

            // Add Leaflet Control to the map
            control.addTo(map);

            // Notify the Share component that the control is ready
            window.metoffice.eventBus.notifyEventSubscribers(window.metoffice.enthusiast.eventDefinitions.SHARE_DETAILS_READY, {
                control: control
            });

            return control;
        }

    };

    var createExplainerControl = function(map, control) {

        var controlPosition = "topright";


        // Remove if already exists
        removeControl(control);

        // Create Leaflet Control container
        control = L.control({
            position: controlPosition
        });

        control.onAdd = function() {
            var explainer = L.DomUtil.create('div', 'explainer-control');
            L.DomEvent.disableClickPropagation(explainer);
            explainer.setAttribute("id", "explainer-control");
            return explainer;
        };

        control.addTo(map);

        // Notify the Explainer component that the control is ready
        window.metoffice.eventBus.notifyEventSubscribers(window.metoffice.enthusiast.eventDefinitions.EXPLAINER_DETAILS_READY, {
            control: control
        });

        return control;

    };

    var createZoomControl = function(map, control) {

        // Remove if already exists
        removeControl(control);

        // Zoom Control setup only on non "mobile" devices
        if (!L.Browser.mobile) {

            control = L.control.zoom({
                position: "bottomright"
            }).addTo(map);

            return control;

        }

    };

    var createKeyControl = function(map, control) {

        var keyControl, keyContainer, keySvgContainer, keyLabelContainer;

        // Remove if already exists
        removeControl(control);

        // Only create in the layer has details for the Key
        if (typeof currentLayer.key !== "undefined") {

            // Create Leaflet Control container
            control = L.control({
                position: "bottomright"
            });

            // Add a div on add
            control.onAdd = function() {

                keyControl = L.DomUtil.create("div", "key-control");

                L.DomEvent.disableClickPropagation(keyControl);
                keyControl.setAttribute("id", "key-control");

                keyContainer = L.DomUtil.create("div", "key-container hidden");
                keyContainer.setAttribute("id", "key-container");

                keyLabelContainer = L.DomUtil.create("div", "key-label-container");
                keyLabelContainer.setAttribute("id", "key-label-container");

                keySvgContainer = L.DomUtil.create("div", "");
                keySvgContainer.setAttribute("id", "key-svg-container");

                // Add a SVG
                d3.select(keySvgContainer)
                    .append("svg")
                    .attr("id", "key")
                    .attr("class", "key");


                keyContainer.appendChild(keyLabelContainer);
                keyContainer.appendChild(keySvgContainer);

                keyControl.appendChild(keyContainer);

                return keyControl;

            };

            // Add Leaflet Control to the map
            control.addTo(map);

            // Notify the Key component that the control is ready
            window.metoffice.eventBus.notifyEventSubscribers(window.metoffice.enthusiast.eventDefinitions.KEY_DETAILS_READY, {
                control: control,
                configuration: configuration,
                currentLayer: currentLayer,
                currentModel: currentModel,
                currentAltitude: currentAltitude
            });

            return control;

        }

    };

    var removeControl = function(control) {

        if (typeof control !== "undefined") {
            control.remove();
        }

    };

    // Only return functions that need to be accessed outside the module
    return {
        init: init
    };

})();

window.addEventListener("DOMContentLoaded", window.metoffice.enthusiast.leafletControls.init);