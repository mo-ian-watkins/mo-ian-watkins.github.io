L.Control.OverlayMessage = L.Control.extend({

    options: {

    },

    initialize: function () {

    },

    onAdd: function (map) {

        // Base container
        this.container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');

        // Create messages
        this.rotateToPortraitMessage = this.createRotateToPortraitMessage();
        this.noDataMessage = this.createNoDataMessageMessage();

        return this.container;

    },

    createRotateToPortraitMessage: function () {

        this.rotateToPortraitContainer = L.DomUtil.create('div', 'leaflet-message-container', this._map.getContainer());
        this.rotateToPortraitBackground = L.DomUtil.create('div', 'background-rotate-to-portrait', this.rotateToPortraitContainer);

        // Other message stuff here
        //this.xxxx = L.DomUtil.create('div', '', this.rotateToPortraitBackground);
        //this.xxxx.innerHTML = "HELLO";

        // Don't show it yet
        this.rotateToPortraitContainer.style.display = "none";

        // Disable map interactions while showing
        L.DomEvent.disableClickPropagation(this.rotateToPortraitContainer);

        return this.rotateToPortraitContainer;

    },

    showRotateToPortraitMessage: function (timeToShow) {

        // Display it
        this.rotateToPortraitContainer.style.display = "block";

        // Timer then hide it
        setTimeout(function () {
            this.hideRotateToPortraitMessage();
        }.bind(this), timeToShow);

    },

    hideRotateToPortraitMessage: function () {

        // Hide it
        this.rotateToPortraitContainer.style.display = "none";

    },

    createNoDataMessageMessage: function () {

        this.noDataContainer = L.DomUtil.create('div', 'leaflet-message-container', this._map.getContainer());
        this.noDataBackground = L.DomUtil.create('div', 'background-no-data', this.noDataContainer);

        // Other message stuff here
        //this.xxxx = L.DomUtil.create('div', '', this.noDataContainer);
        //this.xxxx.innerHTML = "HELLO";

        // Don't show it yet
        this.noDataContainer.style.display = "none";

        // Disable map interactions while showing
        L.DomEvent.disableClickPropagation(this.noDataContainer);

        return this.noDataContainer;

    },

    showNoDataMessage: function (timeToShow) {

        // Display it
        this.noDataContainer.style.display = "block";

        // Timer then hide it
        setTimeout(function () {
            this.hideNoDataMessage();
        }.bind(this), timeToShow);

    },

    hideNoDataMessage: function () {

        // Hide it
        this.noDataContainer.style.display = "none";

    }

});

L.control.overlaymessage = function(options) {
    return new L.Control.OverlayMessage(options);
};
