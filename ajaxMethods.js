
var appPath = "/ProtesteOnRoad/";

function formatErrorMessage(jqXHR, exception)
{
	var result = "";
	if (jqXHR.status == 0) {
		result = labels.Msg_Error + '\n';
	} else if (jqXHR.status == 404) {
		result = labels.Msg_Error + '\n';
	} else if (jqXHR.status == 500) {
		result = labels.Msg_Error + '\n';
	} else if (exception == 'parsererror') {
		result = labels.Msg_Error + '\n';
	} else if (exception === 'timeout') {
		result = labels.Ms_Error + '\n';
	} else if (exception == 'abort') {
		result = labels.Msg_Error + '\n';
	} else {
		result = labels.Msg_Error + '\n' + jqXHR.responseText;
	}
	$.colorbox({html: result, close: 'Fechar', className: 'MsgError'});
}

//https://developers.google.com/maps/articles/phpsqlsearch_v3?hl=pt-br
function parseXml(str)
{
	if (window.ActiveXObject) {
		var doc = new ActiveXObject('Microsoft.XMLDOM');
		doc.loadXML(str);
		return doc;
	} else if (window.DOMParser) {
		return (new DOMParser).parseFromString(str, 'text/xml');
	}
}

function getMarker(id)
{
	var result = "";
	var jqXHR = $.ajax({ url: appPath + "GetMarker", type: "GET", data: { 'id' : id } });
	jqXHR.done(function (data) {
		if (data != "")
		{
			result = data;
		}
	});
	jqXHR.fail(function (jqXHR, status, error) { formatErrorMessage(jqXHR, status); });
	return "";
}

function editMarker(latitude, longitude)
{
	var description = $("#description").val();
	description = escape(description);
	var image = $("#photoImg").val();
	
	if (description == undefined || description == "")
	{
		$.colorbox({html: labels.Req_Descr, close: 'Fechar', className: 'MsgError'});
	}
	else
	{
		var jqXHR = $.ajax({ url: appPath + "EditMarker", 
		type: "GET", data: { 'latitude' : latitude, 'longitude' : longitude, 'name' : '', 'details' : description } });
		jqXHR.done(function (data) {
			if (data == "ok")
			{
				/*closeAllInfoWindow();
				clearAllMarkers();
				GetProblems();
				alert(labels.Msg_Remove);*/
				document.location.href = appPath;
			}
			else if (data == "error")
			{
				$.colorbox({html: labels.Msg_Error, close: 'Fechar', className: 'MsgError'});
			}
		});
		jqXHR.fail(function (jqXHR, status, error) { formatErrorMessage(jqXHR, status); });
	}
}

function removeMarker(id)
{
	if (id != 0)
	{
		var jqXHR = $.ajax({ url: appPath + "RemoveMarker", 
		type: "GET", data: { 'id' : id } });
		jqXHR.done(function (data) {
			if (data == "ok")
			{
				/*closeAllInfoWindow();
				clearAllMarkers();
				GetProblems();
				alert(labels.Msg_Remove);*/
				document.location.href = appPath;
			}
			else if (data.indexOf("bloqueado") > 0)
			{
				$.colorbox({html: data, close: 'Fechar', className: 'MsgError'});
			}
			else if (data == "error")
			{
				$.colorbox({html: labels.Msg_Error, close: 'Fechar', className: 'MsgError'});
			}
		});
		jqXHR.fail(function (jqXHR, status, error) { formatErrorMessage(jqXHR, status); });
	}
}

function GetListProblems() {
	var jqXHR = $.ajax({ url: appPath + "GetListProblems", type: "GET", data: { 'onlyMyPoints': false } });
	jqXHR.done(function (data) {
		$("#listProblems").html(data);
		$("#div_listProblems").show();
	});
	jqXHR.fail(function (jqXHR, status, error) { formatErrorMessage(jqXHR, status); $("#div_listProblems").hide(); });
}

function GetListMyProblems() {
	var jqXHR = $.ajax({ url: appPath + "GetListProblems", type: "GET", data: { 'onlyMyPoints': true } });
	jqXHR.done(function (data) {
		$("#listMyProblems").html(data);
		$("#div_listMyProblems").show();
	});
	jqXHR.fail(function (jqXHR, status, error) { formatErrorMessage(jqXHR, status); $("#div_listMyProblems").hide(); });
}

function GetData(userid)
{
	var jqXHR = $.ajax({ url: appPath + "GetData", type: "GET" });
	jqXHR.done(function (data) {
		var xml = parseXml(data);

		var ini = data.indexOf('<routes>');
		var fim = data.indexOf('</routes>');
		var routes = data.substring(ini, fim);
		routes = routes.replace('<routes>', '');
		routes = routes.replace('</routes>', '');
		$("#routes").html(routes);

		var problems = xml.documentElement.getElementsByTagName("point");
		if (problems != undefined)
		{
			GetProblems(problems, userid);
		}
	});
	jqXHR.fail(function (jqXHR, status, error) { formatErrorMessage(jqXHR, status); });
}

function isUserLogged()
{
	return $.ajax({ url: appPath + "IsUserLogged", type: "GET" });
}

function GetProblems(problems, userid)
{
	markers = [];
	infoWindowList = [];
    for (var i = 0; i < problems.length; i++)
	{
		var nodes = problems[i].childNodes;
		var id           = nodes[0].childNodes != undefined && nodes[0].childNodes.length > 0 ? nodes[0].childNodes[0].data : "";
		var name         = nodes[1].childNodes != undefined && nodes[1].childNodes.length > 0 ? nodes[1].childNodes[0].data : "";
		var description  = nodes[2].childNodes != undefined && nodes[2].childNodes.length > 0 ? nodes[2].childNodes[0].data : "";
		var address      = nodes[3].childNodes != undefined && nodes[3].childNodes.length > 0 ? nodes[3].childNodes[0].data : "";
		var image        = nodes[4].childNodes != undefined && nodes[4].childNodes.length > 0 ? nodes[4].childNodes[0].data : "";
		var latitude     = nodes[5].childNodes != undefined && nodes[5].childNodes.length > 0 ? nodes[5].childNodes[0].data : "";
		var longitude    = nodes[6].childNodes != undefined && nodes[6].childNodes.length > 0 ? nodes[6].childNodes[0].data : "";
		var creatorId    = nodes[7].childNodes != undefined && nodes[7].childNodes.length > 0 ? nodes[7].childNodes[0].data : "";
		var creatorName  = nodes[8].childNodes != undefined && nodes[8].childNodes.length > 0 ? nodes[8].childNodes[0].data : "PROTESTE";
		var creationDate = nodes[9].childNodes != undefined && nodes[9].childNodes.length > 0 ? nodes[9].childNodes[0].data : "";
		var imageData    = nodes[10].childNodes != undefined && nodes[10].childNodes.length > 0 ? nodes[10].childNodes[0].data : "";
		image = imageData;
		
		var icon = customIcons["problemProteste"];
		if (creatorId != "" && creatorId != "0")
		{
			icon = customIcons["problemByUser"];
		}

		latitude = parseFloat(latitude);
		longitude = parseFloat(longitude);
		var marker = createMarker(null, id, name, description, address, image, latitude, longitude, icon, creatorId, creatorName, creationDate, userid);
		markers.push(marker);
    }
}
