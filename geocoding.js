
var resultsGeocode = null;

function getAddress(lat, lng, callback)
{
	var result = "";
	var latlng = new google.maps.LatLng(lat, lng);
	try
	{
		geocodeService.geocode({ 'latLng': latlng , 'region': 'br' }, function (results, status) {
			if (status == google.maps.GeocoderStatus.OK)
			{
				resultsGeocode = results;
				if (results != undefined || results != null)
				{
					result = results[0].formatted_address;
					//results[1] : full address
					//results[2] : city and country
					//results[1] : country
					callback(result);
				}
			}
			else
			{
				setTimeout('', 1000);
				if (currentMarker != undefined) currentMarker.setMap(null);
				mapHasMarker = false; /*when the insert window not exists anymore*/
				markers.pop();
				infoWindowList.pop();
				currentMarker = undefined;
				$.colorbox({html: labels.Msg_Point, close: 'Fechar', className: 'MsgError'});
			}
		});
	}
	catch(e) { }
	return result;
}

function setAddressCallback(result)
{
	var addressDiv = document.getElementById("addressPopup");
	if (addressDiv != undefined)
	{
		result = result.replace(/República Federativa do Brasil/g, "Brasil");
		var address = result;
		if (address.length > 43)
			address  = address.substr(0, 43) + ' ...';
		document.getElementById("addressPopup").innerHTML = address;
		$("#addressPopup").attr("title", result);
	}
	if (result.indexOf('Brasil') < 0)
	{
		setTimeout('', 1000);
		if (currentMarker != undefined) currentMarker.setMap(null);
		mapHasMarker = false; /*when the insert window not exists anymore*/
		markers.pop();
		infoWindowList.pop();
		currentMarker = undefined;
		$.colorbox({html: labels.Msg_Point, close: 'Fechar', className: 'MsgError'});
	}
}
