function initDemoMap() {

    var darkTheme = L.tileLayer(
      "https://betatest.metoffice.gov.uk/weather/maps-and-charts/enthusiast/tileserver/styles/dev-atlas-dark-theme-base/{z}/{x}/{y}{r}.jpg",
      {
        attribution:
          "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, " +
          "NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community"
      }
    );

    var baseLayers = {
      "Grey Canvas": darkTheme
    };

    var map = L.map("map", {
      layers: [darkTheme],
      minZoom: 3,
      maxBounds: [
        [83, -270],
        [-83, 270]
      ]
    });

    var layerControl = L.control.layers(baseLayers);
    layerControl.addTo(map);
    map.setView([55, -30], 4);

    return {
      map: map,
      layerControl: layerControl
    };
  }

  // demo map
  var mapStuff = initDemoMap();
  var map = mapStuff.map;
  var layerControl = mapStuff.layerControl;

  $.getJSON("wind-test.json", function(data) {
    var velocityLayer = L.velocityLayer({
      opacity: 0.01,
      displayValues: true,
      velocityScale: 0.005, // modifier for particle animations, arbitrarily defaults to 0.005
      data: data,
      colorScale: ['#30123b','#321543','#33184a','#341b51','#351e58','#36215f','#372466','#38276d','#392a73','#3a2d79','#3b2f80','#3c3286','#3d358b','#3e3891','#3f3b97','#3f3e9c','#4040a2','#4143a7','#4146ac','#4249b1','#424bb5','#434eba','#4451bf','#4454c3','#4456c7','#4559cb','#455ccf','#455ed3','#4661d6','#4664da','#4666dd','#4669e0','#466be3','#476ee6','#4771e9','#4773eb','#4776ee','#4778f0','#477bf2','#467df4','#4680f6','#4682f8','#4685fa','#4687fb','#458afc','#458cfd','#448ffe','#4391fe','#4294ff','#4196ff','#4099ff','#3e9bfe','#3d9efe','#3ba0fd','#3aa3fc','#38a5fb','#37a8fa','#35abf8','#33adf7','#31aff5','#2fb2f4','#2eb4f2','#2cb7f0','#2ab9ee','#28bceb','#27bee9','#25c0e7','#23c3e4','#22c5e2','#20c7df','#1fc9dd','#1ecbda','#1ccdd8','#1bd0d5','#1ad2d2','#1ad4d0','#19d5cd','#18d7ca','#18d9c8','#18dbc5','#18ddc2','#18dec0','#18e0bd','#19e2bb','#19e3b9','#1ae4b6','#1ce6b4','#1de7b2','#1fe9af','#20eaac','#22ebaa','#25eca7','#27eea4','#2aefa1','#2cf09e','#2ff19b','#32f298','#35f394','#38f491','#3cf58e','#3ff68a','#43f787','#46f884','#4af880','#4ef97d','#52fa7a','#55fa76','#59fb73','#5dfc6f','#61fc6c','#65fd69','#69fd66','#6dfe62','#71fe5f','#75fe5c','#79fe59','#7dff56','#80ff53','#84ff51','#88ff4e','#8bff4b','#8fff49','#92ff47','#96fe44','#99fe42','#9cfe40','#9ffd3f','#a1fd3d','#a4fc3c','#a7fc3a','#a9fb39','#acfb38','#affa37','#b1f936','#b4f836','#b7f735','#b9f635','#bcf534','#bef434','#c1f334','#c3f134','#c6f034','#c8ef34','#cbed34','#cdec34','#d0ea34','#d2e935','#d4e735','#d7e535','#d9e436','#dbe236','#dde037','#dfdf37','#e1dd37','#e3db38','#e5d938','#e7d739','#e9d539','#ebd339','#ecd13a','#eecf3a','#efcd3a','#f1cb3a','#f2c93a','#f4c73a','#f5c53a','#f6c33a','#f7c13a','#f8be39','#f9bc39','#faba39','#fbb838','#fbb637','#fcb336','#fcb136','#fdae35','#fdac34','#fea933','#fea732','#fea431','#fea130','#fe9e2f','#fe9b2d','#fe992c','#fe962b','#fe932a','#fe9029','#fd8d27','#fd8a26','#fc8725','#fc8423','#fb8122','#fb7e21','#fa7b1f','#f9781e','#f9751d','#f8721c','#f76f1a','#f66c19','#f56918','#f46617','#f36315','#f26014','#f15d13','#f05b12','#ef5811','#ed5510','#ec530f','#eb500e','#ea4e0d','#e84b0c','#e7490c','#e5470b','#e4450a','#e2430a','#e14109','#df3f08','#dd3d08','#dc3b07','#da3907','#d83706','#d63506','#d43305','#d23105','#d02f05','#ce2d04','#cc2b04','#ca2a04','#c82803','#c52603','#c32503','#c12302','#be2102','#bc2002','#b91e02','#b71d02','#b41b01','#b21a01','#af1801','#ac1701','#a91601','#a71401','#a41301','#a11201','#9e1001','#9b0f01','#980e01','#950d01','#920b01','#8e0a01','#8b0902','#880802','#850702','#810602','#7e0502','#7a0403']
    });

    layerControl.addOverlay(velocityLayer, "Wind - Global");

    velocityLayer.addTo(map);
  });