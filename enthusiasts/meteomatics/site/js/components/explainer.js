/* jshint strict: global */
/* global window */

"use strict";
window.metoffice = window.metoffice || {};
window.metoffice.enthusiast = window.metoffice.enthusiast || {};

window.metoffice.enthusiast.explainer = (function() {

    var control, popupElement, configuration;

    var init = function() {

        window.metoffice.eventBus.subscribeToEvent(window.metoffice.enthusiast.eventDefinitions.CONFIGURATION_LOADED, function(payload) {
            configuration = payload;
        });

        window.metoffice.eventBus.subscribeToEvent(window.metoffice.enthusiast.eventDefinitions.MAP_CLICKED, hidePopup);
        window.metoffice.eventBus.subscribeToEvent(window.metoffice.enthusiast.eventDefinitions.SHARE_BUTTON_CLICKED, hidePopup);

        // Request to build share control content from Leaflet-Controls
        window.metoffice.eventBus.subscribeToEvent(window.metoffice.enthusiast.eventDefinitions.EXPLAINER_DETAILS_READY, function(payload) {
            var readMoreUrl = "",
                feedbackUrl = "",
                upperExplainerText = "",
                lowerExplainerText = "",
                explainerButtonElement = createExplainerButton();

            if (typeof configuration.map.explainerReadMoreLink !== "undefined") {
                readMoreUrl = configuration.map.explainerReadMoreLink;
            }

            if (typeof configuration.map.explainerFeedbackLink !== "undefined") {
                feedbackUrl = configuration.map.explainerFeedbackLink;
            }

            if (typeof configuration.map.upperExplainerText !== "undefined") {
                upperExplainerText = configuration.map.upperExplainerText;
            }

            if (typeof configuration.map.lowerExplainerText !== "undefined") {
                lowerExplainerText = configuration.map.lowerExplainerText;
            }

            popupElement = createPopup(upperExplainerText, lowerExplainerText, readMoreUrl, feedbackUrl);
            control = payload.control;
            
            control.getContainer().appendChild(explainerButtonElement);
            control.getContainer().appendChild(popupElement);

        });
      
    };

    var createExplainerButton = function() {
        var buttonElement = window.metoffice.uiFactory.createStandardButtonElement("explainer-button", "", "button--black", false),
            buttonIconElement = document.createElement("span");

        buttonIconElement.setAttribute("class", "explainer-icon");
        buttonIconElement.textContent = "i";
        buttonElement.appendChild(buttonIconElement);

        buttonElement.addEventListener("click", showPopup);

        return buttonElement;
    };

    var createPopup = function (upperExplainerText, lowerExplainerText, readMoreUrl, feedbackUrl) {
        var popupElement = document.createElement("div"),
            headerElement = document.createElement("div"),
            headerTextElement = document.createElement("h2"),
            mainElement = document.createElement("div"),
            closeButtonElement = document.createElement("button"),
            upperContainerElement = document.createElement("div"),
            centerContainerElement = document.createElement("div"),
            lowerContainerElement = document.createElement("div"),
            feedbackLinkElement = document.createElement("a"),
            readMoreLinkElement = document.createElement("a"),
            readMoreButtonElement =  window.metoffice.uiFactory.createStandardButtonElement("explainer-read-more-button", "Open information page", "button--teal", true),
            closeIconElement = document.createElement("span");
        
        headerTextElement.textContent = "About this weather map";
        headerTextElement.setAttribute("class", "popup__heading");

        closeIconElement.setAttribute("class", "icon icon--close");

        closeButtonElement.setAttribute("class", "button");
        closeButtonElement.appendChild(closeIconElement);
        closeButtonElement.addEventListener("click", hidePopup);

        headerElement.setAttribute("class", "popup__header");
        headerElement.appendChild(headerTextElement);
        headerElement.appendChild(closeButtonElement);

        feedbackLinkElement.textContent = "Send us your feedback";
        feedbackLinkElement.setAttribute("href", feedbackUrl);
        feedbackLinkElement.setAttribute("target", "_blank");
        feedbackLinkElement.setAttribute("rel", "noopener");

        readMoreLinkElement.setAttribute("href", readMoreUrl);
        readMoreLinkElement.appendChild(readMoreButtonElement);

        upperContainerElement.textContent = upperExplainerText;
        
        centerContainerElement.setAttribute("class", "popup__center");
        centerContainerElement.appendChild(readMoreLinkElement);

        lowerContainerElement.textContent = lowerExplainerText;
        lowerContainerElement.appendChild(feedbackLinkElement);
        
        mainElement.setAttribute("class", "popup__main");
        mainElement.appendChild(upperContainerElement);
        mainElement.appendChild(centerContainerElement);
        mainElement.appendChild(lowerContainerElement);

        popupElement.setAttribute("class", "popup popup--explainer hidden");
        popupElement.appendChild(headerElement);
        popupElement.appendChild(mainElement);

        return popupElement;
    };


    var showPopup = function() {
        popupElement.classList.remove("hidden");
        window.metoffice.eventBus.notifyEventSubscribers(window.metoffice.enthusiast.eventDefinitions.EXPLAINER_BUTTON_CLICKED);
    };

    var hidePopup = function() {
        if (typeof popupElement !== "undefined") {
            popupElement.classList.add("hidden");
        }
    };

    // Only return functions that need to be accessed outside the module
    return {
        init: init
    };

})();

window.addEventListener("DOMContentLoaded", window.metoffice.enthusiast.explainer.init);