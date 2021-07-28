function initDemoMap () {
	var Esri_WorldImagery = L.tileLayer(
		"https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
		{
			attribution:
				"Tiles &copy; Esri"
		}
	);
	var map = L.map("map", {
		layers: [Esri_WorldImagery],
		zoomControl: false,
		maxBounds: [[42, -20], [65, 15]],
		maxZoom: 18,
		minZoom: 5
	});

	map.setView([55, -3], 5);

	return {
		map: map,
	};
}
// colour on precip
// arrows on wind from table
// switch for map background
// popup on share button with dummy share options here & fake url
// click timeline change sector circle

// recenter button when the user pans away

// add some of the other precip types - drizzle, rain

// char limit 50
// search box disallow xss




// demo map
var mapStuff = initDemoMap();
var map = mapStuff.map;
const postcodeRegex = new RegExp('^[A-Z]{1,2}\\d[A-Z\\d]? ?\\d[A-Z]{2}$')
const latLonRegex = new RegExp('^[-+]?([1-8]?\\d(\\.\\d+)?|90(\\.0+)?),\\s*[-+]?(180(\\.0+)?|((1[0-7]\\d)|([1-9]?\\d))(\\.\\d+)?)$')
const ORGridRegex = new RegExp('^([STNHOstnho][A-Za-z]\\s?)(\\d{5}\\s?\\d{5}|\\d{4}\\s?\\d{4}|\\d{3}\\s?\\d{3}|\\d{2}\\s?\\d{2}|\\d{1}\\s?\\d{1})$')
const what3wordsRegex = new RegExp('^\\/{0,}[^0-9`~!@#$%^&*()+\\-_=[{\\]}\\\\|\'<,.>?/";:£§º©®\\s]{1,}[.｡。･・︒។։။۔።।][^0-9`~!@#$%^&*()+\\-_=[{\\]}\\\\|\'<,.>?/";:£§º©®\\s]{1,}[.｡。･・︒។։။۔።।][^0-9`~!@#$%^&*()+\\-_=[{\\]}\\\\|\'<,.>?/";:£§º©®\\s]{1,}$')
const esriPlacesAPI = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=pjson&searchExtent=-20,42,15,65&SingleLine=';
const sectorIcon = L.icon({
	iconUrl: 'sector-circle-CDE.svg',
	iconSize:250,
});
let sectorMarker;
$(document).ready(function () {

	$('#searchBox').focus();
	let dataTable = $('#data');
	let hammerElement = new Hammer(document.getElementById('data'));
	hammerElement.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

	hammerElement.on("swipeup", function () {
		dataTable.animate({bottom:'0px'}, 200);
	});
	hammerElement.on("swipedown", function () {
		dataTable.animate({bottom:'-100px'}, 200);
	});

	$('#searchButton').click(function() {
		showSearchBox();
	});
	map.on('click', (e)=> {
		hideSearchBox();
	})
	map.on('contextmenu', (e)=> {
		pandAndZoomMap(e.latlng);
	})

	let marker = L.marker();
	proj4.defs('EPSG:27700', '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs');

	callEsriAPI = function (searchTerm) {
		$.ajax({
			url: esriPlacesAPI + searchTerm,
			async: false,
			success: function (data) {
				const response = (JSON.parse(data)).candidates
				if (response.length > 0){
					const location = response[0].location;
					pandAndZoomMap([location.y, location.x])
				} else {
					alert('location not found')
				}
			}
		})
	}
	pandAndZoomMap = function (latlng){
		map.setView(latlng, 16);
		dataTable.animate({bottom:'-100px'}, 200);
		hideSearchBox();
		if (sectorMarker){
			sectorMarker.remove();
		}
		sectorMarker = L.marker(latlng, {icon:sectorIcon}).addTo(map);
	}

	hideSearchBox = function () {
		$('#search').hide();
		$('#searchButton').show();
		$('#searchBox').val('');
	}
	showSearchBox = function () {
		$('#search').show();
		$('#searchButton').hide();
		$('#searchBox').focus();
	}

	$('#geoLocate').click(function() {
		if(!navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				const latitude  = position.coords.latitude;
				const longitude = position.coords.longitude;
				alert(`lat = ${latitude} lon = ${longitude}`);
				pandAndZoomMap([latitude, longitude]);
			}, ()=>{})
		} else {
			alert('geolocation not available');
		}
	});
	$('#searchForm').submit(function (event) {
		event.preventDefault();
		let searchTerm = $('#searchBox').val();
		if (latLonRegex.test(searchTerm)) {
			alert('it is a lat lon');
		} else if (postcodeRegex.test(searchTerm.toUpperCase())) {
			callEsriAPI(searchTerm);
		} else if (ORGridRegex.test(searchTerm)) {
			// alert('it is a OS grid ref');
			const eastNorthing = os.Transform.fromGridRef(searchTerm);
			const location = os.Transform.toLatLng(eastNorthing);
			pandAndZoomMap([location.lat, location.lng]);
		} else if (what3wordsRegex.test(searchTerm)) {
			alert('You\'ve entered a What3Words location, we have not fully linked this up in the prototype yet, so we will take you to pre-defined location');
			pandAndZoomMap([50.727125, -3.474888]); // met office lat lon
		} else {
			callEsriAPI(searchTerm);
		}
	})
});
