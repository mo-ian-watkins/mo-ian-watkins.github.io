/* jshint strict: global */
/* global window */

"use strict";
window.metoffice = window.metoffice || {};
window.metoffice.enthusiast = window.metoffice.enthusiast || {};

window.metoffice.enthusiast.share = (function() {

    var control, popupElement, inputElement;

    var init = function() {

        // Request to build share control content from Leaflet-Controls
        window.metoffice.eventBus.subscribeToEvent(window.metoffice.enthusiast.eventDefinitions.SHARE_DETAILS_READY, function(payload) {
            var shareButtonElement = createShareButton();
                
            popupElement = createPopup();
            control = payload.control;
            
            control.getContainer().appendChild(shareButtonElement);
            control.getContainer().appendChild(popupElement);

            // Update share URL when relevant events occur
            window.metoffice.eventBus.subscribeToEvent(window.metoffice.enthusiast.eventDefinitions.MODEL_CHANGED, updateShareUrl);
            window.metoffice.eventBus.subscribeToEvent(window.metoffice.enthusiast.eventDefinitions.ALTITUDE_CHANGED, updateShareUrl);
            window.metoffice.eventBus.subscribeToEvent(window.metoffice.enthusiast.eventDefinitions.TIMELINE_CHANGED, updateShareUrl);

        });

        window.metoffice.eventBus.subscribeToEvent(window.metoffice.enthusiast.eventDefinitions.MAP_CLICKED, hidePopup);
        window.metoffice.eventBus.subscribeToEvent(window.metoffice.enthusiast.eventDefinitions.EXPLAINER_BUTTON_CLICKED, hidePopup);
      
    };

    var createShareButton = function() {
        var buttonElement = window.metoffice.uiFactory.createStandardButtonElement("share-button", "", "button--black", false),
            buttonIconElement = document.createElement("span");

        buttonIconElement.setAttribute("class", "icon icon--share");
        buttonElement.appendChild(buttonIconElement);

        buttonElement.addEventListener("click", showPopup);

        return buttonElement;
    };

    var createPopup = function () {
        var popupElement = document.createElement("div"),
            headerElement = document.createElement("div"),
            headerTextElement = document.createElement("h2"),
            mainElement = document.createElement("div"),
            closeButtonElement = document.createElement("button"),
            copyLinkButtonElement = window.metoffice.uiFactory.createStandardButtonElement("share-copy-link-button", "Copy link", "button--teal", false),
            closeIconElement = document.createElement("span");
            
        inputElement = document.createElement("input");
        inputElement.setAttribute("class", "popup__input");
        inputElement.setAttribute("id", "share-input");
        inputElement.setAttribute("readonly", "true");

        headerTextElement.textContent = "Share this map";
        headerTextElement.setAttribute("class", "popup__heading");

        closeIconElement.setAttribute("class", "icon icon--close");

        closeButtonElement.setAttribute("class", "button");
        closeButtonElement.appendChild(closeIconElement);
        closeButtonElement.addEventListener("click", hidePopup);

        headerElement.setAttribute("class", "popup__header");
        headerElement.appendChild(headerTextElement);
        headerElement.appendChild(closeButtonElement);

        copyLinkButtonElement.dataset.clipboardTarget = "#share-input";

        new ClipboardJS(copyLinkButtonElement);
        
        mainElement.setAttribute("class", "popup__main");
        mainElement.appendChild(inputElement);
        mainElement.appendChild(copyLinkButtonElement);

        popupElement.setAttribute("class", "popup popup--share hidden");
        popupElement.appendChild(headerElement);
        popupElement.appendChild(mainElement);

        return popupElement;
    };


    var showPopup = function() {
        popupElement.classList.remove("hidden");
        updateShareUrl();
        window.metoffice.eventBus.notifyEventSubscribers(window.metoffice.enthusiast.eventDefinitions.SHARE_BUTTON_CLICKED);
    };

    var hidePopup = function() {
        if (typeof popupElement !== "undefined") {
            popupElement.classList.add("hidden");
        }
    };

    var updateShareUrl = function() {
        inputElement.setAttribute("value", window.location.href);
    };

    // Only return functions that need to be accessed outside the module
    return {
        init: init
    };

})();

window.addEventListener("DOMContentLoaded", window.metoffice.enthusiast.share.init);