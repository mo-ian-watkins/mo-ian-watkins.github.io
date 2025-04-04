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

        return timeDimension;

    };

    var createTimeDimensionLayer = function(map, appConfig, layerConfig, currentModel, latestRuns) {

        var layerOptions = {},
            layer,
            timeDimensionLayer;

        // Create base WMS/pseudo WMTS options
        layerOptions = {
            service: "WMS",
            version: "1.3.0",
            request: "GetMap",
            format: "image/png",
            transparent: true,
            styles: layerConfig.style,
            zIndex: 300,
            pane: "tilePane"
        };

        // model:parameter{_vertical level}/{_interval} : units
        if (layerConfig.parameter.interval) {
            // Interval based
            layerOptions.layers = currentModel.id + ":" + layerConfig.parameter.name + "_" + layerConfig.parameter.interval + ":" + layerConfig.parameter.units[0];
        } else if (layerConfig.parameter.vertical) {
            // Vertical based
            layerOptions.layers = currentModel.id + ":" + layerConfig.parameter.name + "_" + currentAltitude + ":" + layerConfig.parameter.units[0];
        } else {
            // Neither
            layerOptions.layers = currentModel.id + ":" + layerConfig.parameter.name + ":" + layerConfig.parameter.units[0];
        }

        // Latest run for the currentModel (cache buster)
        if (typeof latestRuns[currentModel.id] !== "undefined") {
            layerOptions.run = latestRuns[currentModel.id];
        }

        // WMS or Pseudo WMTS
        if (currentModel.type === "WMS") {

            map.setMaxBounds(L.latLngBounds(configuration.map.bounds.wms));
            layerOptions.bounds = L.latLngBounds(currentModel.bounds);

            // Create custom WMS layer
            L.Layer.WMS = L.NonTiledLayer.WMS.extend({

                getImageUrl: function(bounds, width, height) {

                    var wmsParams = this.wmsParams,
                        nw = this._crs.project(bounds.getNorthWest()),
                        se = this._crs.project(bounds.getSouthEast()),
                        url = this._wmsUrl,
                        bbox;

                    // Check bounds of WMS overlaps with current map bounds
                    if (map.getBounds().overlaps(bounds)) {

                        // Ensure integer width and height
                        wmsParams.width = Math.round(width);
                        wmsParams.height = Math.round(height);

                        // Create bounding box
                        bbox = (this._wmsVersion >= 1.3 && this._crs === L.CRS.EPSG4326 ?
                            [se.y, nw.x, nw.y, se.x] :
                            [nw.x, se.y, se.x, nw.y]).join(',');

                        return url + L.Util.getParamString(this.wmsParams, url, this.options.uppercase) +
                            (this.options.uppercase ? '&BBOX=' : '&bbox=') + bbox;

                    } else {

                        // Return an errorImage URL to prevent 404 errors
                        return this.options.errorImageUrl;

                    }

                }

            });

            // Create the WMTS layer
            layer = new L.Layer.WMS(appConfig.paths.pathAPI + "/wms", layerOptions);

        } else {

            map.setMaxBounds(L.latLngBounds(configuration.map.bounds.max));
            layerOptions.tileSize = 512;
            layerOptions.updateWhenIdle = true;
            layerOptions.updateWhenZooming = false;

            // Toggle off downsampling
            if (!currentModel.downsampling) {
                layerOptions.interp_select = "none";
            }

            layer = L.tileLayer.wms(appConfig.paths.pathAPI + "/wms", layerOptions);

        }

        // Create it as a TimeDimension WMS layer
        timeDimensionLayer = L.timeDimension.layer.wms(layer, {
            getCapabilitiesUrl: "getcapabilities.xml"
        });

        // Once a layer first loads, then fire preloads for more timesteps
        timeDimensionLayer.once("timeload", function(e) {

            map.timeDimension.prepareNextTimes(0, currentModel.preloadCount - 1, true);

            // Then once each timestep loads, fire off more preloads
            map.timeDimension.on("timeload", function(e) {
                e.target.prepareNextTimes(0, currentModel.preloadCount - 1, true);
            });

        });

        return timeDimensionLayer;

    };

    // Only return functions that need to be accessed outside the module
    return {
        init: init
    };

})();

window.addEventListener("DOMContentLoaded", window.metoffice.enthusiast.wmtsLayer.init);