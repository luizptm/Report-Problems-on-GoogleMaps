
var dists = [5000];

function calculateRoute(id, startLatLng, endLatLng)
{
	$('#routes a[id*="rota"]').removeClass("active");
	$("#rota" + id).addClass("active");

	var startLat = startLatLng.split(",")[0];
	var startLong = startLatLng.split(",")[1];
	startLatLng = new google.maps.LatLng(startLat, startLong);

	var endLat = endLatLng.split(",")[0];
	var endLong = endLatLng.split(",")[1];
	endLatLng = new google.maps.LatLng(endLat, endLong);

	var request = {
		origin: startLatLng,
		destination: endLatLng,
		optimizeWaypoints: true,
		travelMode: google.maps.TravelMode.DRIVING,
		unitSystem: google.maps.UnitSystem.METRIC
	};

	directionsService.route(request, function (directionResult, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			directionsRenderer.setDirections(directionResult);
			GetProblems();
		}
	});

	google.maps.event.addListener(directionsRenderer, 'directions_changed', function () {
		/* NOT USED */
	});

	var destination = endLatLng;
	var bounds = new google.maps.LatLngBounds();
	bounds.extend(destination);
	map.fitBounds(bounds);
}

function calculateRouteByAddress(id, startAddress, endAddress)
{
	$('#routes a[id*="rota"]').removeClass("active");
	$("#rota" + id).addClass("active");

	var request = {
		origin: startAddress,
		destination: endAddress,
		optimizeWaypoints: true,
		travelMode: google.maps.TravelMode.DRIVING,
		unitSystem: google.maps.UnitSystem.METRIC
	};

	directionsService.route(request, function (directionResult, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			directionsRenderer.setDirections(directionResult);
			GetProblems();
		}
	});

	google.maps.event.addListener(directionsRenderer, 'directions_changed', function () {
		/* NOT USED */
	});
}