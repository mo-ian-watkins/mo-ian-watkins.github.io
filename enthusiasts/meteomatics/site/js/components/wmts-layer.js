/* jshint strict: global */
/* global window, L */

"use strict";
window.metoffice = window.metoffice || {};
window.metoffice.enthusiast = window.metoffice.enthusiast || {};

window.metoffice.enthusiast.wmtsLayer = (function() {

    var map,
        layer,
        configuration,
        latestRuns,
        layerConfig,
        currentModel,
        currentAltitude;

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

        });

        // Layer Change from Layer Picker
        window.metoffice.eventBus.subscribeToEvent(window.metoffice.enthusiast.eventDefinitions.LAYER_CHANGED, function(payload) {

            currentModel = payload.modelConfig;
            layerConfig = payload.layerConfig;

            // Change the timedimension unless layer.parameter has a vertical component, then wait until the altitude picker changes
            if (typeof layerConfig.parameter.vertical === "undefined") {
                changeTimeDimension(layerConfig);
            }

        });

        // Altitude Change from Altitude Picker
        window.metoffice.eventBus.subscribeToEvent(window.metoffice.enthusiast.eventDefinitions.ALTITUDE_CHANGED, function(payload) {

            currentAltitude = payload;

            changeTimeDimension(layerConfig);

        });

        // Timeline timestep changed
        window.metoffice.eventBus.subscribeToEvent(window.metoffice.enthusiast.eventDefinitions.TIMELINE_CHANGED, function(payload) {

            var availableTimes = map.timeDimension.getAvailableTimes();

            if (payload.isRewindingWhilePlaying) {
                map.timeDimension.setCurrentTime(availableTimes[0]);
            } else {
                map.timeDimension.setCurrentTime(availableTimes[payload.timestepIndex]);
            }

            // Request and cache frames ahead for animation
            //map.timeDimension.prepareNextTimes(1, currentModel.preloadCount, true);

        });

    };

    var changeTimeDimension = function(layerConfig) {

        // Create TimeDimension and attach to map
        map.timeDimension = createTimeDimension(layerConfig);

        // Notify that the TimeDimension has changed for Time Scrubber
        window.metoffice.eventBus.notifyEventSubscribers(window.metoffice.enthusiast.eventDefinitions.TIME_DIMENSION_CHANGED, {
            currentTime: map.timeDimension.getCurrentTime(),
            currentTimeIndex: map.timeDimension.getCurrentTimeIndex(),
            period: map.timeDimension.options.period,
            timeSteps: map.timeDimension.getAvailableTimes(),
            defaultTimeStep: layerConfig.time.default
        });

        // Create TimeDimensionLayer but remove previous one if it already exists
        if (map.hasLayer(layer)) {
            map.removeLayer(layer);
        }

        layer = createTimeDimensionLayer(map, configuration, layerConfig, currentModel, latestRuns);

        // Add the new layer to the map
        layer.addTo(map);

        // Request and cache frames ahead for animation
        //map.timeDimension.prepareNextTimes(1, currentModel.preloadCount, true);

    };

    var createTimeDimension = function(layerConfig) {

        var dateNow,
            dateRoundedBack,
            timeDimension,
            valueInMilliSeconds;

        dateNow = new Date();

        // If the layer has a delay, subtract that from the dataNow
        if (layerConfig.time.delay) {

            valueInMilliSeconds = window.nezasa.iso8601.Period.parseToTotalSeconds(layerConfig.time.delay) * 1000;
            dateNow = new Date(dateNow.getTime() - valueInMilliSeconds);

        }

        // Set initial date to dateNow but rounded back to previous whole layerConfig.time.step
        valueInMilliSeconds = window.nezasa.iso8601.Period.parseToTotalSeconds(layerConfig.time.step) * 1000;
        dateRoundedBack = new Date((dateNow.getTime() - (dateNow.getTime() % valueInMilliSeconds)));

        // Create TimeDimension and set current time step based on layerConfig.time.default
        if (layerConfig.time.default === "first") {

            timeDimension = new L.TimeDimension({
                timeInterval: dateRoundedBack.toISOString() + "/" + layerConfig.time.period,
                period: layerConfig.time.step,
                currentTime: dateRoundedBack
            });

        } else {

            timeDimension = new L.TimeDimension({
                timeInterval: layerConfig.time.period + "/" + dateRoundedBack.toISOString(),
                period: layerConfig.time.step,
                currentTime: dateRoundedBack
            });

        }

        // Once a layer loads, then fire preloads for more timesteps
        timeDimension.on("timeload", function(e) {
            e.target.prepareNextTimes(1, currentModel.preloadCount, true);
        });

        return timeDimension;

    };

    var createTimeDimensionLayer = function(map, appConfig, layerConfig, currentModel, latestRuns) {

        var layerOptions = {},
            layer,
            timeDimensionLayer;

        // Create base WMTS options
        layerOptions = {
            service: 'WMTS',
            version: "1.0.0",
            request: "GetTile",
            style: layerConfig.style,
            uppercase: true,
            zIndex: 300,
            updateWhenIdle: true,
            updateWhenZooming: false
        };

        // model:parameter{_vertical level}/{_interval} : units
        if (layerConfig.parameter.interval) {
            // Interval based
            layerOptions.layer = currentModel.id + ":" + layerConfig.parameter.name + "_" + layerConfig.parameter.interval + ":" + layerConfig.parameter.units[0];
        } else if (layerConfig.parameter.vertical) {
            // Vertical based
            layerOptions.layer = currentModel.id + ":" + layerConfig.parameter.name + "_" + currentAltitude + ":" + layerConfig.parameter.units[0];
        } else {
            // Neither
            layerOptions.layer = currentModel.id + ":" + layerConfig.parameter.name + ":" + layerConfig.parameter.units[0];
        }

        // Image format
        layerOptions.format = "image/" + layerConfig.format;

        // Latest run for the currentModel (cache buster)
        if (typeof latestRuns[currentModel.id] !== "undefined") {
            layerOptions.run = latestRuns[currentModel.id];
        }

        // Create custom WMTS layer using Key Value Pair (KVP) method
        L.TileLayer.WMTS = L.TileLayer.WMS.extend({

            getTileUrl: function(coords) {

                // Remove unnecessary properties
                delete this.wmsParams.layers;
                delete this.wmsParams.styles;
                delete this.wmsParams.transparent;
                delete this.wmsParams.width;
                delete this.wmsParams.height;

                // Add coordinate properties
                this.wmsParams.tilematrixset = "webmercator";
                this.wmsParams.tilematrix = coords.z;
                this.wmsParams.tilecol = coords.x;
                this.wmsParams.tilerow = coords.y;

                // Return new URL
                return this._url + L.Util.getParamString(this.wmsParams, this._url, this.options.uppercase);

            }

        });

        // Create the WMTS layer
        layer = new L.TileLayer.WMTS(appConfig.paths.pathWMTS, layerOptions);

        // Create it as a TimeDimension WMS layer
        timeDimensionLayer = L.timeDimension.layer.wms(layer, {
            getCapabilitiesUrl: "getcapabilities.xml"
        });

        // Once a layer loads, then fire preloads for more timesteps
        timeDimensionLayer.on("timeload", function(e) {
            map.timeDimension.prepareNextTimes(1, currentModel.preloadCount, true);
        });

        return timeDimensionLayer;

    };

    // Only return functions that need to be accessed outside the module
    return {
        init: init
    };

})();

window.addEventListener("DOMContentLoaded", window.metoffice.enthusiast.wmtsLayer.init);