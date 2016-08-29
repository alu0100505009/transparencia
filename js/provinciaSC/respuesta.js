var map = L.map('map').setView([28.278825, -16.594223], 10);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
		'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="http://mapbox.com">Mapbox</a>',
	id: 'mapbox.light'
}).addTo(map);


//-------------------------------------------------------------------
// Funcion para mostrar la información en el div superior
//-------------------------------------------------------------------
var info = L.control();
var ultimoprops;

info.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info');
	this.update();
	return this._div;
};

info.update = function (props) {
	ultimoprops = props;
};

info.muestra = function () {
	if (ultimoprops == null) {
		this._div.innerHTML = '<h4>Mapa de Transparencia</h4>' + '<br />' + 'Haga click sobre un municipio para' + '<br />' + 'obtener la información referente a él';
	} else {
		this._div.innerHTML = '<h4>Mapa de Transparencia</h4>';
		for (var i in tabla) {
			if (tabla[i].ayuntamiento == ultimoprops.MUNICIPIO) {
				this._div.innerHTML += '<b>' + tabla[i].ayuntamiento + '<br />' +
					'<a href=' + tabla[i].urlayuntamiento + ' ' + 'target=”_blank”>' + "URL Ayuntamiento" + '</a> <br />' +
					'<a href=' + tabla[i].urlportal + ' ' + 'target=”_blank”>' + "URL Portal Transparencia" + '</a> <br />' +
					"Fecha de solicitud: " + '</b>' + tabla[i].fechasolicitud + '<br />' + '<b>' +
					"Fecha de respuesta: " + '</b>' + tabla[i].fecharespuesta;
			}
		}
	}
}

info.addTo(map);
//*******************************************************************
//*******************************************************************


//-------------------------------------------------------------------
// Funcion para cargar el spreadsheet
//-------------------------------------------------------------------
var tabla = new Array();
var code = "1YQ6T8iPq1b2GdXOWGLhBroiqo1EjTskhfepke5695XU";

function cargaTabla() {
	Tabletop.init({
		key: code,
		callback: function (sheet, tabletop) {
			for (var i in sheet) {
				var place = sheet[i]
				tabla[i] = sheet[i]
			}
		},
		simpleSheet: true
	})

	tablaCargada()
}

function tablaCargada() {
	if (tabla.length == 0) {
		setTimeout(tablaCargada, 100);
	} else {
		$(".loader").hide();
		loadMap();
	}
}

document.addEventListener('DOMContentLoaded', cargaTabla);
//*******************************************************************
//*******************************************************************


//-------------------------------------------------------------------
// Funcion para pintar los municipios segun su nivel de transparencia
//-------------------------------------------------------------------
function getColor(d) {
	return d == "Si" ? '#00CC00' :
		d == "Fuera de plazo" ? '#FF6600' :
		d == "No" ? '#CC0000' :
		'#FFEDA0';
}

var tablaFeatures = new Array();

function style(feature) {
	console.log(tabla.length);

	if (tabla.length < tablaFeatures.length) {
		tablaFeatures[tablaFeatures.length] = feature;
	}
	for (var i in tabla) {
		if (tabla[i].ayuntamiento == feature.properties.MUNICIPIO) {
			return {
				weight: 2,
				opacity: 1,
				color: 'white',
				dashArray: '3',
				fillOpacity: 0.7,
				fillColor: getColor(tabla[i].respuesta)
			};
		}
	};
}
//*******************************************************************
//*******************************************************************


//-------------------------------------------------------------------
// Funcion para resaltar el municipio seleccionado.
//-------------------------------------------------------------------
var ultimo;

function highlightFeature(e) {
	console.log(e);
	var layer = e.target;

	if (ultimo != null)
		resetHighlight(ultimo);

	layer.setStyle({
		weight: 5,
		color: '#01579b',
		dashArray: '',
		fillOpacity: 0.7
	});

	if (!L.Browser.ie && !L.Browser.opera) {
		layer.bringToFront();
	}

	info.update(layer.feature.properties);
	ultimo = e;
	info.muestra();
}

function showText(e) {
	var layer = e.target;
	//console.log(layer.feature.properties.MUNICIPIO);
	//onmouseover: layer.tooltip(layer.feature.properties.MUNICIPIO);
	//layer.tooltip(layer.feature.properties.MUNICIPIO);
	/*var tooltip = L.tooltip({
		target: layer,
		map: map,
		html: layer.feature.properties.MUNICIPIO
	});
	onmouseout: tooltip.hide();*/
	$(document).tooltip({
  		content: layer.feature.properties.MUNICIPIO
	});
}
//*******************************************************************
//*******************************************************************


//-------------------------------------------------------------------
// Función para mostrar la leyenda de los municipios
//-------------------------------------------------------------------
var legend = L.control({
	position: 'bottomright'
});

legend.onAdd = function (map) {
	var div = L.DomUtil.create('div', 'info legend'),
		grades = ["Si", "Fuera de plazo", "No"],
		labels = [];
	div.innerHTML = '<h4>Respuesta a peticiones</h4>';
	// loop through our density intervals and generate a label with a colored square for each interval
	for (var i = 0; i < grades.length; i++) {
		div.innerHTML +=
			'<i style="background:' + getColor(grades[i]) + '"></i> ' +
			grades[i] + '<br>';
	}
	return div;
};

legend.addTo(map);
//*******************************************************************
//*******************************************************************


var geojson;

function resetHighlight(e) {
	geojson.resetStyle(e.target);
	info.update();
}

function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
	layer.on({
		click: highlightFeature,
		mouseover: showText
	});
}

function loadMap() {
	geojson = L.geoJson(municipios, {
		style: style,
		onEachFeature: onEachFeature
	}).addTo(map);
}