
$(document).ready(function() {
	$("html, body").delay(2000).animate({scrollTop:180}, 'slow');
});

jQuery(function ($) {
	$(".jq_Spinner").css("top", 280);
	$('#gmap').ajaxStart(function () {
		$(".jq_Spinner").css("top", 280);
		$('#gmap').Loading(true, getDefaultLoaderSettings());
	});
	$('#gmap').ajaxStop(function () {
		$('#gmap').Loading(false);
	});
});

var map;
var directionsRenderer;
var directionsService;
var geocodeService;
var userid = "";
var showPoint = 0;

var brasilPoint = new google.maps.LatLng(-8.233237,-55.371094);
var timeout = 3000; /* 3 seconds */

function initialize() {
	var gmap = document.getElementById("gmap");

	/* Instantiate a directions service. */
	directionsService = new google.maps.DirectionsService();//used in 'routing.js'

	/* Instantiate a geocoding service. */
	geocodeService = new google.maps.Geocoder();

	/* Map options */
	var mapOptions = {
		zoom: 3,
		center: brasilPoint,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		panControl: false,        /* panorâmica */
		mapTypeControl: true,     /* tipo de mapa */
		overviewMapControl: true, /* miniatura */
		scaleControl: true,       /* escala */
		streetViewControl: true,  /* street view */
		zoomControl: true,        /* zoom */
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.HYBRID, google.maps.MapTypeId.TERRAIN],
			style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
			position: google.maps.ControlPosition.RIGHT_TOP
        },
		streetViewControlOptions: {
			position: google.maps.ControlPosition.LEFT_TOP
		},
		zoomControlOptions: {
			style: google.maps.ZoomControlStyle.SMALL,
			position: google.maps.ControlPosition.LEFT_TOP
		}
	};

	/* Creating the map */
	map = new google.maps.Map(gmap, mapOptions);

	/* Create a renderer for directions and bind it to the map. */
	directionsRenderer = new google.maps.DirectionsRenderer(); /* used in 'routing.js' */
	directionsRenderer.setMap(map);
	
	/* Show the legend */
	getIconsLegend();

	/* Show the point to insert */
	var app = document.location.href;
	
	/* Getting the user id */
	isUserLogged().done(function(data) {
		userid = data;
		$("#userid").val(userid);

		/* Getting routes and problems from database by Ajax */
		GetData(userid);

		/* Getting list of problems */
		$("#div_listProblems").hide();
		GetListProblems();
		$("#div_listMyProblems").hide();
		GetListMyProblems();
		
		/* For showing marker after login */
		//http://localhost:86/ProtesteOnRoad?latitude=-14.235004&longitude=-51.92528
		var search = document.location.search;
		if (search.length > 0 && search.lastIndexOf("?") >= 0)
		{
			var id = getParameterByName("id");
			var latitude = getParameterByName("latitude");
			var longitude = getParameterByName("longitude");
			var icon = customIcons["newProblem"];
			latitude = parseFloat(latitude);
			longitude = parseFloat(longitude);
			if (id == "0" && latitude != NaN && longitude != NaN)
			{
				createMarker("new", 0, "", "", "", "", latitude, longitude, icon, "0", "", "", userid);
			}
			else if (id != "0")
			{
				showPoint = id;
				showPoint = parseInt(showPoint);
			}
		}
	});

	/* Putting a marker on map */
	google.maps.event.addListener(map, 'click', function(event) {
		isUserLogged().done(function(data) {
			userid = data;
			if (!mapHasMarker)
			{
				closeAllInfoWindow();
				var latLng = event.latLng;
				var latitude = latLng.lat();
				var longitude = latLng.lng();
				var icon = customIcons["newProblem"];
				createMarker(event, "0", "", "", "", "", latitude, longitude, icon, "0", "", "", userid);
			}
		});
	});
}

/* Adding the 'initialize' to the 'load' event of page */
google.maps.event.addDomListener(window, "load", initialize);

/// *** Add point
$("#savePoint").click(function () {
    var ext = $("#photoImg").val().split(".").pop().toLowerCase();
	var description = $("#description").val();
	description = description.replace('Descreva o problema.', '');
	var accept = $('#accept:checked').val();
    if (ext != "jpg")
	{
		$.colorbox({html: labels.Req_Type, close: 'Fechar', className: 'MsgError'});
	}
	else if (description == "")
	{
		$.colorbox({html: labels.Req_Descr, close: 'Fechar', className: 'MsgError'});
	}
	else if (accept == undefined)
	{
		$.colorbox({html: labels.Req_Terms, close: 'Fechar', className: 'MsgError'});
	} else
	{
		return true;
	}
	return false;
});

/// *** Edit point
$("#editPoint").click(function () {
	
});

/// *** Update point
$("#updatePoint").click(function () {
    var ext = $("#photoImg").val().split(".").pop().toLowerCase();
	var description = $("#description").val();
	description = description.replace('Descreva o problema.', '');
	var accept = $('#accept:checked').val();
    if (ext != "jpg")
	{
		$.colorbox({html: labels.Req_Type, close: 'Fechar', className: 'MsgError'});
	}
	else if (description == "")
	{
		$.colorbox({html: labels.Req_Descr, close: 'Fechar', className: 'MsgError'});
	}
	else if (accept == undefined)
	{
		$.colorbox({html: labels.Req_Terms, close: 'Fechar', className: 'MsgError'});
	}
	else
	{
		return true;
	}
	return false;
});

/// *** Remove point
$("#removePoint").click(function () {
	id = $("id").val();
	lat = $("latitude").val();
	lng = $("longitude").val();
	event.preventDefault();if(confirm(labels.Confirm)) { removeMarker(id, lat, lng); }
});

function getParameterByName(name)
{
	var search = decodeURIComponent(location.search);
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
