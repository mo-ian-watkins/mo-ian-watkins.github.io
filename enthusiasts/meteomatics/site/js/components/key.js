/* jshint strict: global */
/* global window, console, d3 */

"use strict";
window.metoffice = window.metoffice || {};
window.metoffice.enthusiast = window.metoffice.enthusiast || {};

window.metoffice.enthusiast.key = (function() {

    var control,
        keyVisibleState = true,
        configuration,
        currentLayer,
        currentModel,
        currentAltitude,
        buttonIconElement;

    var init = function() {

        // Request to build key control content from Leaflet-Controls
        window.metoffice.eventBus.subscribeToEvent(window.metoffice.enthusiast.eventDefinitions.KEY_DETAILS_READY, function(payload) {

            control = payload.control;
            configuration = payload.configuration;
            currentLayer = payload.currentLayer;
            currentModel = payload.currentModel;
            currentAltitude = payload.currentAltitude;

            createKey();
            updateKeyControl(control, configuration, currentLayer, currentModel, currentAltitude);

            // restore state of key between layer changes
            if (keyVisibleState === true) {
                showKey();
            }

        });

    };

    var createKey = function() {
        var keyButton = createKeyButton(),
            container = control.getContainer();

        if (typeof container !== "undefined") {
            container.appendChild(keyButton);
        }

    };

    var createKeyButton = function() {
        var buttonElement = window.metoffice.uiFactory.createStandardButtonElement("key-button", "", "button--black button--key", false);
        
        buttonIconElement = document.createElement("span");

        buttonIconElement.setAttribute("class", "icon icon--key");
        buttonIconElement.setAttribute("id", "key-button-icon");
        buttonElement.appendChild(buttonIconElement);

        buttonElement.addEventListener("click", toggleKey);

        return buttonElement;
    };

    var toggleKey = function() {

        keyVisibleState = !keyVisibleState;

        if (keyVisibleState) {
            showKey();
        } else {
            hideKey();
        }
        
    };

    var showKey = function() {
        var keyElement = document.getElementById("key-container");

        keyElement.classList.remove("hidden");
        buttonIconElement.classList.remove("icon--key");
        buttonIconElement.classList.add("icon--chevron-white");
    };

    var hideKey = function() {
        var keyElement = document.getElementById("key-container");

        keyElement.classList.add("hidden");
        buttonIconElement.classList.add("icon--key");
        buttonIconElement.classList.remove("icon--chevron-white");
    };

    var updateKeyControl = function(control, config, layer, model, altitude) {

        var container;

        container = control.getContainer();

        if (typeof container !== "undefined") {

            getKeyDataFromAPI(layer, config, model, altitude, function(data) {

                if (layer.key.type === "continuous") {

                    // Create continous scale using a linear gradient
                    // e.g. for continous scales such as wind speed
                    createContinuousKeyGraphic(layer, data);

                } else if (layer.key.type === "ordinal") {

                    // Create ordinal scale using colour filled blocks with axis labels on the breaks
                    // e.g. for ordinal scales such rainfall
                    createOrdinalKeyGraphic(layer, data);

                }

            });

        }

    };

    var getKeyDataFromAPI = function(layer, config, currentModel, currentAltitude, callback) {

        var xhr = new window.XMLHttpRequest(),
            csvDataString,
            url,
            unit,
            vertical;

        // Build up URL for get_colormap call
        url = config.paths.pathAPI + "/get_colormap?format=csv&parameter=";

        // Special case for units with altitude
        if (layer.key.scaling && layer.parameter.units[0] === "m") {
            unit = "km";
        } else {
            unit = layer.parameter.units[0];
        }

        // Check for altitude
        if (layer.parameter.vertical) {
            if (typeof currentAltitude !== "undefined") {
                vertical = currentAltitude;
            } else {
                vertical = layer.parameter.vertical[0];
            }
        }

        // Add parameter from layer configuration
        if (layer.parameter.interval) {
            // Interval based
            url = url + currentModel.id + ":" + layer.parameter.name + "_" + layer.parameter.interval + ":" + unit;
        } else if (layer.parameter.vertical) {
            // Vertical based
            url = url + currentModel.id + ":" + layer.parameter.name + "_" + vertical + ":" + unit;
        } else {
            // Neither
            url = url + currentModel.id + ":" + layer.parameter.name + ":" + unit;
        }

        // Add colour scale from layer configuration
        url = url + "&style=" + layer.style;

        // Get the data
        xhr.open("GET", url);

        xhr.onload = function() {

            if (xhr.status !== 200) {
                console.error("Error loading API data", xhr.responseText);
            } else {
                csvDataString = xhr.responseText;

                if (typeof callback === "function") {
                    callback(csvDataString);
                }
            }
        };

        xhr.send();

    };
    
    var getLabelText = function(layer) {
        var labelText;

        // Create label text for key from units.label and interval (if latter exists)
        if (layer.parameter.interval) {
            labelText = configuration.units[layer.parameter.units[0]] + " / <br>" + layer.parameter.interval;
        } else {
            labelText = configuration.units[layer.parameter.units[0]];
        }

        return labelText;
    };

    var createContinuousKeyGraphic = function(layer, data) {

        // Create a continous linear gradient scale key

        var key,
            width,
            height,
            extent,
            padding = 12,
            outsideTick = 4,
            barLength,
            barThickness = padding,
            labelElement,
            labelText,
            scale,
            axis,
            scaleBar,
            defs,
            linearGradient;

        key = d3.select("#key");

        // Clear any previous content
        key.selectAll("*").remove();

        // Get key width and height
        width = parseInt(key.style("width"));
        height = window.innerHeight - (window.innerHeight * 0.7);

        document.getElementById("key").style.height = height + "px";

        // Strip alphas from colors, essential for IE11 otherwise all fills = black
        data = data.replace(/FF\n/g, '\n');

        // Parse the delimited data string
        data = d3.dsvFormat(";").parse(data, function(d) {

            d.Value = Number(d.Value);

            // Scaling for values that need them
            if (layer.key.scaling && layer.parameter.units[0] === "m") {
                d.Value = Number(d.Value) * layer.key.scaling;
            }

            return {
                value: d.Value,
                color: d["Hex Color"]
            };

        });

        labelText = getLabelText(layer);

        // Get extent
        extent = d3.extent(data, function(d) {
            return d.value;
        });

        // Create bar and axis

        // Portrait key
        barLength = height - (padding * 2);

        // Label
        labelElement = document.getElementById("key-label-container");
        labelElement.innerHTML = labelText;

        // Bar & Axis
        scale = d3.scaleLinear().range([barLength, 0]).domain(extent);
        axis = d3.axisRight(scale).tickSize(barThickness + outsideTick).ticks(6);
        scaleBar = key.append("g").attr("transform", "translate(0, " + padding + ")");

        defs = key.append("defs");

        linearGradient = defs.append("linearGradient")
            .attr("id", "myGradient")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "0%")
            .attr("y2", "100%");

        linearGradient.selectAll("stop").data(data).enter()
            .append("stop")
            .attr("offset", function(d) {
                return ((d.value - extent[1]) / (extent[0] - extent[1]) * 100) + "%";
            })
            .attr("stop-color", function(d) {
                return d.color;
            });

        scaleBar.append("rect")
            .attr("width", barThickness)
            .attr("height", barLength)
            .style("fill", "url(#myGradient)");

        scaleBar.append("g")
            .attr("class", "key-axis")
            .call(axis)
            .select(".domain").remove();

    };

    var createOrdinalKeyGraphic = function(layer, data) {

        // Create a ordinal scale key

        var key,
            breaks,
            colors = [],
            range = [],
            temp = [],
            i,
            width,
            height,
            padding = 12,
            outsideTick = 4,
            barLength,
            barThickness = padding,
            labelElement,
            labelText,
            scale,
            axisScale,
            axis,
            scaleBar;

        key = d3.select("#key");

        // Clear any previous content
        key.selectAll("*").remove();

        // Get key width and height
        width = parseInt(key.style("width"));
        height = window.innerHeight - (window.innerHeight * 0.7);

        document.getElementById("key").style.height = height + "px";

        // Strip alphas from colors, essential for IE11 otherwise all fills = black
        data = data.replace(/FF\n/g, '\n');

        // Parse the delimited data string
        data = d3.dsvFormat(";").parse(data, function(d) {

            d.Value = Number(d.Value);

            // Scaling for values that need them
            if (layer.key.scaling && layer.parameter.units[0] === "m") {
                d.Value = Number(d.Value) * layer.key.scaling;
            }

            return {
                value: Number(d.Value),
                color: d["Hex Color"]
            };

        });

        // Remove values less than layer.key.minimum if exists
        if (typeof layer.key.minimum !== "undefined") {

            temp = [];

            for (i = 0; i < data.length; i++) {
                if (Number(data[i].value) >= layer.key.minimum) {
                    temp.push(data[i]);
                }
            }

            data = temp;

        }

        // Remove values less than layer.key.maximum if exists
        if (typeof layer.key.maximum !== "undefined") {

            temp = [];

            for (i = 0; i < data.length; i++) {
                if (Number(data[i].value) <= layer.key.maximum) {
                    temp.push(data[i]);
                }
            }

            data = temp;

        }

        // Create arrays for ordinal scale but ensure deep copy
        breaks = JSON.parse(JSON.stringify(layer.key.ticks));

        // Get colours
        for (i = 0; i < data.length; i++) {
            colors.push(data[i].color);
        }

        // Now get only unique colours
        colors = colors.filter(function (value, index, self) {
            return self.indexOf(value) === index;
        });
        colors.reverse();

        labelText = getLabelText(layer);

        // Create bar and axis
        // Portrait key
        barLength = height - (padding * 2);

        // Get range for each colour bar based on bar length
        for (i = 0; i < colors.length; i++) {
            range.push(barLength / colors.length * i);
        }

        // Label
        labelElement = document.getElementById("key-label-container");
        labelElement.innerHTML = labelText;    

        // Bar & Axis
        scaleBar = key.append("g").attr("transform", "translate(0, " + padding + ")");

        colors.reverse();
        scale = d3.scaleOrdinal().domain(range).range(colors);

        scaleBar.selectAll("rect").data(range).enter()
            .append("rect")
            .attr("x", function(d) {return 0;})
            .attr("y", function(d) {return d;})
            .attr("height", function(d) {return barLength / colors.length;})
            .attr("width", function(d) {return barThickness;})
            .attr("fill", function(d) {
                return scale(d);
            });

        // Add extra "fencepost"
        range.push(range[colors.length-1] + (barLength / colors.length));

        breaks.reverse();
        axisScale = d3.scaleOrdinal()
            .domain(breaks)
            .range(range);

        axis = d3.axisRight(axisScale)
            .tickSize(barThickness + outsideTick)
            .tickFormat(d3.format(",.1r"));

        scaleBar.append("g")
            .attr("class", "key-axis")
            .call(axis)
            .select(".domain").remove();

    };

    // Only return functions that need to be accessed outside the module
    return {
        init: init
    };

})();

window.addEventListener("DOMContentLoaded", window.metoffice.enthusiast.key.init);