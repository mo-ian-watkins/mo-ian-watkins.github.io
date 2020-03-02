var mymap = L.map('mapid').setView([52, -10], 4);

L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
  maxZoom: 18
}).addTo(mymap);

var velocity = L.velocityLayer({

  displayValues: false,
/*   displayOptions: {
    velocityType: 'GBR Wind',
    position: 'bottomleft',
    emptyString: 'No velocity data',
    angleConvention: 'bearingCW',
    displayPosition: 'bottomleft',
    displayEmptyString: 'No velocity data',
    speedUnit: 'kt'
  }, */
  data: data, // see demo/*.json, or wind-js-server for example data service

  // OPTIONAL
  minVelocity: 0,
  maxVelocity: 10,
  velocityScale: 0.005,
  colorScale: ["#999999"],
  particleAge: 90,
  lineWidth: 1,
  particleMultiplier: 0.0033
});

mymap.addLayer(velocity);

function removeWind(){
  mymap.removeLayer(velocity);
}

function addWind(){
  mymap.addLayer(velocity);
}
/*
setTimeout(function () {
  velocity._clearWind();
}, 3000);

setTimeout(function () {
  velocity.setData(data);
}, 6000); */