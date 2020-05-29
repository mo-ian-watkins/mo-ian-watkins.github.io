/* jshint strict: global */
/* global window, L, d3, console */

"use strict";

window.metoffice = window.metoffice || {};
window.metoffice.enthusiast = window.metoffice.enthusiast || {};

window.metoffice.enthusiast.particleLayer = (function() {

    var map,
        layer,
        configuration,
        latestRuns,
        layerConfig,
        currentModel,
        currentAltitude,
        currentTimestep,
        timelineAnimating = false,
        debounceTimer;

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

        });

        // Altitude Change from Altitude Picker
        window.metoffice.eventBus.subscribeToEvent(window.metoffice.enthusiast.eventDefinitions.ALTITUDE_CHANGED, function(payload) {

            currentAltitude = payload;

        });

        // Timeline timestep changed
        window.metoffice.eventBus.subscribeToEvent(window.metoffice.enthusiast.eventDefinitions.TIMELINE_CHANGED, function(payload) {

            var availableTimes = map.timeDimension.getAvailableTimes();

            currentTimestep = availableTimes[payload.timestepIndex];

            showParticleLayer();

        });

        // Timeline playing changed
        window.metoffice.eventBus.subscribeToEvent(window.metoffice.enthusiast.eventDefinitions.TIMELINE_ANIMATING_CHANGED, function(payload) {

            timelineAnimating = payload.isPlaying;

            showParticleLayer();

        });

    };

    var showParticleLayer = function() {

        // Clear previous particle layers
        removeParticleLayer();

        // Create the particle layer after debounced delay
        window.clearTimeout(debounceTimer);
        debounceTimer = window.setTimeout(function () {

            // Test if primary layer requires a secondary layer and only if timeline is not animating
            if (typeof layerConfig.secondary !== "undefined" && layerConfig.secondary === true && !timelineAnimating) {
                getParticleData();
            }

        }, 1000);

    };

    var removeParticleLayer = function() {

        // Remove particle layer
        try {

            map.eachLayer(function(mapLayer) {

                if (typeof mapLayer.options.type !== "undefined" && mapLayer.options.type === "particleLayer") {
                    mapLayer._windy.stop();
                    map.removeLayer(mapLayer);
                }

            });

        }
        catch(error) {

            console.log("Error clearing particle layer : ", error.message);

        }

    };

    var getParticleData = function() {

        var url,
            latestRun = "",
            downsampling = "",
            requestTemplate,
            uWindRequest,
            vWindRequest,
            params = {
                resolution: 1,
                maxLat: 85,
                minLat: -85,
                minLon: -180,
                maxLon: 180
            },
            uWindObject = {},
            vWindObject = {},
            header = {},
            data = [];

        // Limited domain models
        if (typeof currentModel.bounds !== "undefined") {
            params.maxLat = currentModel.bounds[1][0];
            params.minLat = currentModel.bounds[0][0];
            params.minLon = currentModel.bounds[0][1];
            params.maxLon = currentModel.bounds[1][1];

            // Data resolution
            if (typeof currentModel.resolution !== "undefined") {
                params.resolution = currentModel.resolution;
            }

        }

        // Prepare API calls
        url = configuration.paths.pathAPI;

        // Latest run for the currentModel (cache buster)
        if (typeof latestRuns[currentModel.id] !== "undefined") {
            latestRun = "&run=" + latestRuns[currentModel.id];
        }

        // Downsampling
        if (typeof currentModel.downsampling !== "undefined" && !currentModel.downsampling) {
            downsampling = "&interp_select=none";
        }

        requestTemplate = url + "/" +
            new Date(currentTimestep).toISOString() + "/" +
            "{layer}" + currentAltitude + ":" + layerConfig.parameter.units[0] + "/" +
            params.maxLat + "," + params.minLon + "_" + params.minLat + "," + params.maxLon + ":" +
            params.resolution + "," + params.resolution +
            "/csv?model=" + currentModel.id + latestRun + downsampling;

        // Requests
        uWindRequest = requestTemplate.replace("{layer}", "wind_speed_u_");
        vWindRequest = requestTemplate.replace("{layer}", "wind_speed_v_");

        // Get the data
        d3.text(uWindRequest, function (error, uCSV) {

            if (error) {

                console.log("Error loading API data");

            } else {

                d3.text(vWindRequest, function (error, vCSV) {

                    if (error) {

                        console.log("Error loading API data");

                    } else {

                        // Create the headers
                        header.la1 = params.maxLat;
                        header.la2 = params.minLat;
                        header.lo1 = params.minLon;
                        header.lo2 = params.maxLon;
                        header.dx = params.resolution;
                        header.dy = params.resolution;
                        header.nx = Math.round(((header.lo2 - header.lo1) * (1/header.dx))) + 1;
                        header.ny = Math.round(((header.la1 - header.la2) * (1/header.dy))) + 1;

                        // Deep copy header
                        uWindObject.header = JSON.parse(JSON.stringify(header));

                        // Process the U wind header
                        uWindObject.header.parameterCategory = 2;
                        uWindObject.header.parameterNumber = 2;

                        // Process the U wind data
                        uWindObject.data = processCSVData(uCSV);
                        data.push(uWindObject);

                        // Deep copy header
                        vWindObject.header = JSON.parse(JSON.stringify(header));

                        // Process the V wind header
                        vWindObject.header.parameterCategory = 2;
                        vWindObject.header.parameterNumber = 3;

                        // Process the V wind data
                        vWindObject.data = processCSVData(vCSV);
                        data.push(vWindObject);

                        // Clear any previous particle layers
                        removeParticleLayer();

                        // Check layer hasn't been changed while fetching/processing data
                        if (typeof layerConfig.secondary !== "undefined" && layerConfig.secondary === true && !timelineAnimating) {

                            // Create particle layer, add it to the map and then set the data
                            layer = L.velocityLayer({
                                type: "particleLayer",
                                displayValues: false,
                                velocityScale: 0.005,
                                colorScale: ["#FFFFFF"],
                                particleAge: 80,
                                lineWidth: 1,
                                particleMultiplier: 0.001,
                            }).addTo(map);

                            layer.setData(data);

                        }

                    }

                });

            }

        });

    };

    var processCSVData = function(csvString) {

        var line,
            lines,
            lineCounter,
            data = [];

        if (typeof csvString !== "undefined") {

            // Split and remove first three header lines
            lines = csvString.split("\n").slice(3);

            // Parse into number arrays
            for (lineCounter = 0; lineCounter < lines.length - 1; lineCounter++) {

                // Remove first value from line
                line = lines[lineCounter].split(";");
                line.shift();

                // Concat line with existing data
                data = data.concat(line);

            }

            return data;

        }

    };

    // Only return functions that need to be accessed outside the module
    return {
        init: init
    };

})();

window.addEventListener("DOMContentLoaded", window.metoffice.enthusiast.particleLayer.init);