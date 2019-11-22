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

L.tileLayer('http://donotbeonfire.co.uk:8080/styles/klokantech-terrain/{z}/{x}/{y}.jpeg', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
}).addTo(map);


var testWMS = "https://betatest.metoffice.gov.uk/enthusiast/api/proxy/wms"
var testLayer = L.nonTiledLayer.wms(testWMS, {
    layers: 'ukmo-500m-radar:precip_raw_5min:mm',
    format: 'image/png',
    transparent: true,
    attribution: 'Meteomatics',
    wmsVersion: "1.3.0",
    uppercase: true,
    styles: "RADAR_LOG",
    opacity: 0.9,
    bounds: L.latLngBounds(L.latLng(47.5, -12.5), L.latLng(60.5, 4.5))
});
var testTimeLayer = L.timeDimension.layer.wms(testLayer);
testTimeLayer.addTo(map);

var testLegend = L.control({
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
