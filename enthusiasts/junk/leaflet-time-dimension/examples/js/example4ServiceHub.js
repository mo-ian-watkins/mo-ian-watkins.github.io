var endDate = new Date();
endDate.setUTCMinutes(0, 0, 0);

var map = L.map('map', {
    zoom: 7,
    minZoom: 3,
    maxZoom: 11,
    maxBounds: L.latLngBounds(L.latLng(46.5, -13.5), L.latLng(61.5, 5.5)),
    fullscreenControl: false,
    center: [52.0, -2],
    timeDimension: true,
    timeDimensionControl: true,
    timeDimensionOptions: {
        timeInterval: "PT6H/" + endDate.toISOString(),
        period: "PT5M"
    },
    timeDimensionControlOptions: {
        maxSpeed: 15,
        autoPlay: true,
        playReverseButton: true,
        loopButton: true,
        timeZones: ["Local", "UTC"],
        playerOptions: {
            transitionTime: 100,
            loop: true,
            startOver: true
        }
    }
});

L.tileLayer('http://ec2-3-8-19-236.eu-west-2.compute.amazonaws.com/styles/dev-atlas-mountain-theme/{z}/{x}/{y}.jpeg', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var testLayer = L.nonTiledLayer.wms("https://mdda.hub.metoffice.cloud/wms/glm/long", {
    layers: 'cloud_amount_high',
    styles: 'grey_scale_gradient',
    format: 'image/png',
    transparent: 'TRUE',
    attribution: 'Met Office',
    version: "1.3.0",
    uppercase: true,
    opacity: 0.9,
    bounds: L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180))
});
var testTimeLayer = L.timeDimension.layer.wms(testLayer, {
    wmsVersion: "1.3.0",
    updateTimeDimension: true,
    requestTimeFromCapabilities: true,
    setDefaultTime: true
}).addTo(map);

/* var testLegend = L.control({
    position: 'topright'
});
testLegend.onAdd = function(map) {
    var src = testWMS + "?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&FORMAT=image/png&LAYER=ukmo-500m-radar%3Aprecip_raw_5min%3Amm&RADAR_LOG";
    var div = L.DomUtil.create('div', 'info legend');
    div.style.width = '65px';
    div.style.height = '380px';
    div.style['background-image'] = 'url(' + src + ')';
    return div;
};
testLegend.addTo(map);
 */