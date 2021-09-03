var mymap = L.map('mapid').setView([55, -3], 6);

L.tileLayer('https://api.mapbox.com/styles/v1/metoffice/ck947ywy33v6y1iqsarthdttc/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibWV0b2ZmaWNlIiwiYSI6ImNrY2djc3Z1azBxdTQyem0yMnVveXBwZTgifQ.11MOmDoyuIkYrpPJsqHcdw', {
  attribution: '<a href="http://mapbox.com">Mapbox</a>',
  maxZoom: 10
}).addTo(mymap);

var velocity = L.velocityLayer({

  displayValues: true,
  displayOptions: {
    velocityType: 'speed',
    position: 'bottomleft',
    emptyString: 'No velocity data',
    angleConvention: 'meteoCW',
    displayPosition: 'bottomleft',
    displayEmptyString: 'No velocity data',
    speedUnit: 'mph'
  },
  data: modata, // see demo/*.json, or wind-js-server for example data service

  // OPTIONAL
  frameRate: 30,
  particleAge: 30,
  velocityScale: 0.003,
  particleMultiplier: 0.002,
  lineWidth: 2,
  minVelocity: 0,
  maxVelocity: 15,
  colorScale: ['#ffffff']
});

mymap.addLayer(velocity);
