/*jshint strict: global, esversion: 6 */
/*global window, document, L, console, SimpleBar */

"use strict";

window.metoffice = window.metoffice || {};
window.metoffice.enthusiast = window.metoffice.enthusiast || {};

window.metoffice.enthusiast.layerPicker = (function() {

    var configuration, map, currentLayer, currentModel, currentAltitude, selectedLayerElement, selectedModelHeaderElement, selectedAltitudeElement, queryParameters;

    var init = function() {

        window.metoffice.eventBus.subscribeToEvent(window.metoffice.enthusiast.eventDefinitions.MAP_READY, function(payload) {
            map = payload;
            initLayers();
        });

        window.metoffice.eventBus.subscribeToEvent(window.metoffice.enthusiast.eventDefinitions.LAYER_CHANGED, function(payload) {

            var defaultAltitude,
                queryParameters = window.metoffice.queryStringUtils.getAllHashedQueryStringParameters();

            if (typeof payload.layerConfig.parameter.vertical !== "undefined") {

                // set default altitude if in query parameters, otherwise first in configuration
                if (payload.layerConfig.parameter.vertical.indexOf(queryParameters.altitude) !== -1) {
                    defaultAltitude = queryParameters.altitude;
                } else {
                    defaultAltitude = payload.layerConfig.parameter.vertical[0];
                }
    
                setAltitude(defaultAltitude, payload.layerConfig.id);

            }

        });

    };

    var initLayers = function() {
        var defaultLayerConfiguration, defaultModelConfiguration;
            
        queryParameters = window.metoffice.queryStringUtils.getAllHashedQueryStringParameters();
        configuration = window.metoffice.enthusiast.core.getConfiguration();

        if (typeof configuration.models !== "undefined") {
            createLayerPickerControl();

            selectedLayerElement = document.getElementById("layer-select-current");

            selectedModelHeaderElement = window.metoffice.uiFactory.createSubHeaderElement("model-select-current");
            selectedLayerElement.parentNode.insertBefore(selectedModelHeaderElement, selectedLayerElement);

            selectedAltitudeElement = window.metoffice.uiFactory.createHeadingElement("altitude-select");
            selectedLayerElement.parentNode.appendChild(selectedAltitudeElement);

            defaultModelConfiguration = getDefaultModelConfiguration(queryParameters);
            defaultLayerConfiguration = getDefaultLayerConfiguration(queryParameters, defaultModelConfiguration);
            
            window.metoffice.eventBus.subscribeToEvent(window.metoffice.enthusiast.eventDefinitions.CORE_INITIALISED, function() {
                populateModelList(configuration.models);
                setModel(defaultModelConfiguration);
                
                populateLayersList(defaultModelConfiguration);
                setLayer(defaultLayerConfiguration);

                // update the available layers list when the model changes, ensure this event only fires after we have set the initial model and layer
                window.metoffice.eventBus.subscribeToEvent(window.metoffice.enthusiast.eventDefinitions.MODEL_CHANGED, modelChangeHandler);
            });

        } else {
            console.error("No models found in configuration, control not created");
        }

    };

    var getDefaultModelConfiguration = function(queryParameters) {

        // Set first element as default initially
        var modelConfigurations = configuration.models,
            defaultModelConfiguration = modelConfigurations[0];

        // Set default model if in query parameters
        if (queryParameters.model) {
            for (let i=0; i < modelConfigurations.length; i++) {
                if (modelConfigurations[i].id === queryParameters.model) {
                    defaultModelConfiguration = modelConfigurations[i];
                    break;
                }
            }
        }

        return defaultModelConfiguration;

    };

    var getDefaultLayerConfiguration = function(queryParameters, defaultModelConfiguration) {

        // Set first element as default initially
        var layerConfigurations = defaultModelConfiguration.layers,
            defaultLayerConfiguration = layerConfigurations[0];

        // Set default layer if in query parameters
        if (queryParameters.layer) {
            for (let i=0; i < layerConfigurations.length; i++) {
                if (layerConfigurations[i].id === queryParameters.layer) {
                    defaultLayerConfiguration = layerConfigurations[i];
                    break;
                }
            }
        }

        return defaultLayerConfiguration;

    };


    var modelChangeHandler = function(modelConfig) {
        var defaultLayerConfiguration = populateLayersList(modelConfig);

        // Set layer to same as currently selected if available, otherwise default to first
        if (typeof defaultLayerConfiguration !== "undefined") {
            setLayer(defaultLayerConfiguration);
        }

    };

    var populateLayersList = function(modelConfig) {

        var currentLayerElement, defaultLayerConfiguration, altitudeConfiguration, altitudeConfigurationList, altitudeOptionsList, altitudePanelId,
            layerOptionsElement = document.getElementById("layer-options");

        layerOptionsElement.innerHTML = "";

        for (let i=0; i < modelConfig.layers.length; i++) {
            currentLayerElement = createLayerItemElement(modelConfig.layers[i]);
            altitudeConfigurationList = modelConfig.layers[i].parameter.vertical;
            layerOptionsElement.appendChild(currentLayerElement);
            
            if (typeof altitudeConfigurationList !== "undefined") {
                altitudeConfiguration = {"layerId": modelConfig.layers[i].id, "value": altitudeConfigurationList};
                altitudeOptionsList = createAltitudeListElement(altitudeConfiguration);
                altitudePanelId = "altitude-panel-" + modelConfig.layers[i].id;
                altitudeOptionsList.setAttribute("id", altitudePanelId);
                currentLayerElement.setAttribute("aria-controls", altitudePanelId);
                layerOptionsElement.appendChild(altitudeOptionsList);
            }

            // set the default layer to the first one that matches this model, or the currently selected one if available in this model
            if (typeof defaultLayerConfiguration === "undefined" || (typeof currentLayer !== "undefined" && currentLayer.id === modelConfig.layers[i].id) ) {
                defaultLayerConfiguration = modelConfig.layers[i];
            }
        }

        return defaultLayerConfiguration;

    };

    var populateModelList = function(modelConfiguration) {
        var modelElement, modelOptionsElement = document.getElementById("model-options");

        modelOptionsElement.innerHTML = "";

        for (let i=0; i < modelConfiguration.length; i++) {
            modelElement = createModelItemElement(modelConfiguration[i]);
            modelOptionsElement.appendChild(modelElement);
        }

    };

    var createAltitudeListElement = function(altitudeConfiguration) {
        var altitudeElement,
            altitudeOptionsElement = document.createElement("div");

        altitudeOptionsElement.setAttribute("class", "picker__altitude-container hidden");

        for (let i=0; i < altitudeConfiguration.value.length; i++) {
            altitudeElement = createAltitudeItemElement(altitudeConfiguration.layerId, altitudeConfiguration.value[i]);
            altitudeOptionsElement.appendChild(altitudeElement);
        }

        return altitudeOptionsElement;

    };


    var createLayerPickerControl = function() {

        var control = L.control();

        control.onAdd = function() {

            var pickerElement = document.createElement("div"),
                layerPickerHeaderElement = window.metoffice.uiFactory.createHeaderElement("layer-select", "", "", "icon--layer icon--layer-accordion", "icon--chevron-white", 
                                                                                        "layer-picker-panel", "picker__button--top-level"),

                modelHeaderElement = window.metoffice.uiFactory.createHeaderElement("model-select", "Data source", "picker__header--model", "", "icon--chevron-white", 
                                                                                    "model-picker-panel", ""),
                                                                                    
                layerPanelElement = window.metoffice.uiFactory.createPanelElement("layer-picker-panel", "layer-select"),
                layerPanelContentElement = SimpleBar.instances.get(layerPanelElement).getContentElement(),
                layerSelectionOptionsPanel = window.metoffice.uiFactory.createOptionsElement("layer-options"),
                modelSelectionElement = createModelSelectionElement(),
                layerPickerContainer = document.createElement("div"),
                modelPickerContainer = document.createElement("div"),
                layerPickerHeadingElement = window.metoffice.uiFactory.createContainerHeaderElement("Weather layer");

            pickerElement.setAttribute("class", "picker picker--layer");
            layerPickerContainer.setAttribute("class", "picker__layers-container");
            modelPickerContainer.setAttribute("class", "picker__models-container");

            pickerElement.dataset.allowMultiple = true;

            modelPickerContainer.appendChild(modelHeaderElement);
            modelPickerContainer.appendChild(modelSelectionElement);

            layerPickerContainer.appendChild(layerPickerHeadingElement);
            layerPickerContainer.appendChild(layerSelectionOptionsPanel);

            layerPanelContentElement.appendChild(modelPickerContainer);
            layerPanelContentElement.appendChild(layerPickerContainer);

            pickerElement.appendChild(layerPickerHeaderElement);
            pickerElement.appendChild(layerPanelElement);

            L.DomEvent.disableClickPropagation(pickerElement);
            L.DomEvent.disableScrollPropagation(pickerElement);

            window.metoffice.accordion.init(pickerElement);

            return pickerElement;

        };

        control.setPosition("topleft");
        control.addTo(map);

    };



    var createModelSelectionElement = function() {
        var modelSelectionPanelElement = document.createElement("div"),
            modelSelectionOptionsElement = window.metoffice.uiFactory.createOptionsElement("model-options", "picker__options--model");

        modelSelectionPanelElement.setAttribute("id", "model-picker-panel");
        modelSelectionPanelElement.setAttribute("role", "region");
        modelSelectionPanelElement.setAttribute("aria-labelledby", "model-select");
        modelSelectionPanelElement.setAttribute("hidden", "");

        modelSelectionPanelElement.appendChild(modelSelectionOptionsElement);

        return modelSelectionPanelElement;
    };

    var createLayerItemElement = function(layerConfiguration) {

        var layerItemElement = document.createElement("button");
        
        layerItemElement.setAttribute("class", "picker__item picker__item--layer");

        layerItemElement.dataset.type = layerConfiguration.id;
        layerItemElement.textContent = layerConfiguration.label;

        layerItemElement.addEventListener("click", function(event) {
            setLayer(layerConfiguration);
        });

        return layerItemElement;

    };

    
    var createModelItemElement = function(modelConfiguration) {

        var modelItemElement = document.createElement("button");

        modelItemElement.setAttribute("class", "picker__item picker__item--model");

        modelItemElement.dataset.type = modelConfiguration.id;
        modelItemElement.textContent = modelConfiguration.label;

        modelItemElement.addEventListener("click", function(event) {
            setModel(modelConfiguration);
        });

        return modelItemElement;

    };

    var createAltitudeItemElement = function(layerId, altitudeValue) {

        var altitudeItemElement = document.createElement("button");

        altitudeItemElement.setAttribute("class", "picker__item picker__item--altitude");

        altitudeItemElement.dataset.type = layerId;
        altitudeItemElement.dataset.value = altitudeValue;
        altitudeItemElement.textContent = altitudeValue;

        altitudeItemElement.addEventListener("click", function(event) {
            setAltitude(altitudeValue, layerId);
        });

        return altitudeItemElement;

    };

    var getCurrentLayer = function() {
        return currentLayer;
    };

    var getCurrentModel = function() {
        return currentModel;
    };

    var getCurrentAltitude = function() {
        return currentAltitude;
    };

    var setLayer = function(layerConfiguration) {

        var layerItems = document.getElementsByClassName("picker__item--layer"),
            selectedLayerAltitudeElement, 
            altitudeContainerElements = document.getElementsByClassName("picker__altitude-container"),
            selectedLayerButtonElement = document.querySelector(".picker__item--layer[data-type='" + layerConfiguration.id + "']"),
            itemActiveClass = "picker__item--active";

        // deselect all layer items
        for (let i=0; i < layerItems.length; i++) {
            layerItems[i].classList.remove(itemActiveClass);
        }

        // hide any expanded altitude pickers
        for (let i=0; i < altitudeContainerElements.length; i++) {
            altitudeContainerElements[i].classList.add("hidden");
        }

        currentLayer = layerConfiguration;
        selectedLayerElement.textContent = layerConfiguration.label;

        // select required layer item, doing this outside the different layer select code to ensure focus remains when interacting via keyboard
        if (typeof selectedLayerButtonElement !== "undefined" && selectedLayerButtonElement !== null) {
            selectedLayerButtonElement.classList.add(itemActiveClass);
        }

        window.metoffice.queryStringUtils.setHashedQueryStringParameter("layer", layerConfiguration.id);

        if (typeof layerConfiguration.parameter.vertical === "undefined") {
            window.metoffice.queryStringUtils.removeHashedQueryStringParameter("altitude");
            selectedAltitudeElement.textContent = "";
            currentAltitude = null;
        } else {
            // show relevant altitude picker
            selectedLayerAltitudeElement = document.getElementById("altitude-panel-" + layerConfiguration.id);
            selectedLayerAltitudeElement.classList.remove("hidden");
        }

        // allow other modules to identify the layer change, providing the layer configuration as a payload
        window.metoffice.eventBus.notifyEventSubscribers(window.metoffice.enthusiast.eventDefinitions.LAYER_CHANGED, {
            layerConfig: layerConfiguration,
            modelConfig: currentModel,
            altitudeConfig: currentAltitude
        });

    };

    var setModel = function(modelConfiguration) {

        var modelItems = document.getElementsByClassName("picker__item--model"),
            selectedModelButtonElement = document.querySelector(".picker__item--model[data-type='" + modelConfiguration.id + "']"),
            itemActiveClass = "picker__item--model-active";

        // deselect all model items
        for (let i=0; i < modelItems.length; i++) {
            modelItems[i].classList.remove(itemActiveClass);
        }

        // select required model item, doing this outside the different layer select code to ensure focus remains when interacting via keyboard
        if (typeof selectedModelButtonElement !== "undefined" && selectedModelButtonElement !== null) {
            selectedModelButtonElement.classList.add(itemActiveClass);
        }

        if (typeof currentModel === "undefined" || currentModel.id !== modelConfiguration.id) {
            currentModel = modelConfiguration;
            selectedModelHeaderElement.textContent = modelConfiguration.label;

            window.metoffice.queryStringUtils.setHashedQueryStringParameter("model", modelConfiguration.id);

            // allow other modules to identify the layer change, providing the layer configuration as a payload
            window.metoffice.eventBus.notifyEventSubscribers(window.metoffice.enthusiast.eventDefinitions.MODEL_CHANGED, modelConfiguration);

        }

    };

    var setAltitude = function(altitudeConfiguration, layerId) {

        var altitudeItems = document.getElementsByClassName("picker__item--altitude"),
            selectedButtonElement = document.querySelector(".picker__item--altitude[data-value='" + altitudeConfiguration + "'][data-type='" + layerId + "']"),
            itemActiveClass = "picker__item--altitude-active";

        // deselect all model items
        for (let i=0; i < altitudeItems.length; i++) {
            altitudeItems[i].classList.remove(itemActiveClass);
        }

        currentAltitude = altitudeConfiguration;
        selectedAltitudeElement.textContent = altitudeConfiguration;

        window.metoffice.queryStringUtils.setHashedQueryStringParameter("altitude", altitudeConfiguration);

        // select required model item, doing this outside the different layer select code to ensure focus remains when interacting via keyboard
        if (typeof selectedButtonElement !== "undefined") {
            selectedButtonElement.classList.add(itemActiveClass);
        }

        // allow other modules to identify the altitude change
        window.metoffice.eventBus.notifyEventSubscribers(window.metoffice.enthusiast.eventDefinitions.ALTITUDE_CHANGED, altitudeConfiguration);

    };

    // Only return functions that need to be accessed outside the module
    return {
        init: init,
        getCurrentLayer: getCurrentLayer,
        getCurrentModel: getCurrentModel,
        getCurrentAltitude: getCurrentAltitude
    };


})();

window.addEventListener("DOMContentLoaded", window.metoffice.enthusiast.layerPicker.init);
