
//source: http://stackoverflow.com/questions/8248077/google-maps-v3-standard-icon-shadow-names-equiv-of-g-default-icon-in-v2
var customIcons = {
	newProblem: {
		icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|00FFFF',
		shadow: 'http://chart.apis.google.com/chart?chst=d_map_pin_shadow',
		name: 'Novo Problema'
	},
	problemProteste: {
		icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|72B01C',
		shadow: 'http://chart.apis.google.com/chart?chst=d_map_pin_shadow',
		name: 'Problema Relatado pela Proteste'
	},
	problemByUser: {
		icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|FF9900',
		shadow: 'http://chart.apis.google.com/chart?chst=d_map_pin_shadow',
		name: 'Problema Relatado pelo Usuário'
	},
	problemInAnalysis: {
		icon: 'https://maps.gstatic.com/mapfiles/ms2/micons/yellow-dot.png',
		shadow: 'http://chart.apis.google.com/chart?chst=d_map_pin_shadow',
		name: 'Problema em Análise'
	},
	problemResolved: {
		icon: 'https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png',
		shadow: 'http://chart.apis.google.com/chart?chst=d_map_pin_shadow',
		name: 'Problema Resolvido'
	}
};

function getIconsLegend()
{
	var data = "<p>Legenda</p><ul>";
	data += "<li><div><img src=\"" + customIcons.problemProteste.icon + "\" /></div><span>" + customIcons.problemProteste.name + "</span></li></li>";
	data += "<li><div><img src=\"" + customIcons.problemByUser.icon + "\" /></div><span>" + customIcons.problemByUser.name + "</span></li></li>";
	data += "</ul>";
	$("#icons-pt-estrada").html(data);
}

var useMaxChars = true;
var maxCharsInTextArea = 1000;

var currentMarker = undefined;

var markers = [];
infoWindowList = [];
var mapHasMarker = false;
var editingMarker = false;

function createMarker(event, id, name, description, address, image, latitude, longitude, icon, creatorId, creatorName, creationDate, userid)
{
	var open = false;
	var position = null;
	if (event != null) {
		open = true;
		position = event.latLng;
	} else {
		position = new google.maps.LatLng(latitude, longitude);
	}
	if (event == "new") {
		open = true;
		position = new google.maps.LatLng(latitude, longitude);
	}

	var pinImage = new google.maps.MarkerImage(icon.icon,
        new google.maps.Size(21, 34),
        new google.maps.Point(0,0),
        new google.maps.Point(10, 34));

    var pinShadow = new google.maps.MarkerImage(icon.shadow,
        new google.maps.Size(40, 37),
        new google.maps.Point(0, 0),
        new google.maps.Point(12, 35));

	var marker = new google.maps.Marker({
		map: map,
		position: position,
		clickable: true,
		draggable: false,
		optimized: false,
		raiseOnDrag: false,
		icon: pinImage,
		shadow: pinShadow
	});

	if (image != "" && image != undefined && image != "undefined")
	{
		//marker = showTooltip(marker, image, position, pinImage, pinShadow)
	}

	var problemInfoWindow = bindInfoWindow(marker, id, name, description, address, image, latitude, longitude, creatorId, creatorName, creationDate, userid, open);
	infoWindowList.push(problemInfoWindow);

	if (!open)
	{
		google.maps.event.addListener(marker, 'click', function () {
			closeAllInfoWindow();
			problemInfoWindow.open(map, marker);
		});
	}
	else
	{
		google.maps.event.addListener(marker, 'click', function () {
			closeAllInfoWindow();
			problemInfoWindow.open(map, marker);
		});
		google.maps.event.addListener(problemInfoWindow, 'closeclick', function () {
			marker.setMap(null);
			mapHasMarker = false; /*when the insert window not exists anymore*/
			markers.pop(marker);
			infoWindowList.pop(problemInfoWindow);
		});
	}
	return marker;
}

function showTooltip(marker, image, position, pinImage, pinShadow)
{
	var tipimg = '<img src="data:image/jpg;base64,' + image + '" style="width: 30%" /><br/>';

	marker = new google.maps.Marker({
		map: map,
		position: position,
		clickable: true,
		draggable: false,
		optimized: false,
		raiseOnDrag: false,
		icon: pinImage,
		shadow: pinShadow,
		tooltip: tipimg
	});

	var tooltip = new Tooltip({ map: map });
	tooltip.bindTo("position", marker, "position");
	tooltip.bindTo("html", marker, "tooltip");

	google.maps.event.addListener(marker, "mouseover", function() {
		tooltip.onAdd();
	});

	google.maps.event.addListener(marker, "mouseout", function() {
		tooltip.onRemove();
	});

	return marker;
}

function bindInfoWindow(marker, id, name, description, address, image, latitude, longitude, creatorId, creatorName, creationDate, userid, open)
{
	var infoProblemWindow = new google.maps.InfoWindow();

	var html = "";
	if (open)
	{
		if (userid != "" && userid != "0")
		{
			html = getHtmlInsertProblem(latitude, longitude);
			currentMarker = marker;
			mapHasMarker = true;
		}
		else
		{
			html = getHtmlLogin(latitude, longitude, userid);
			mapHasMarker = true;
		}
	}
	else
	{
		html = getHtmlViewProblem(marker, id, name, description, address, image, latitude, longitude, creatorId, creatorName, creationDate, userid);
	}
	
	infoProblemWindow.setContent(html);

	if (open)
	{
		infoProblemWindow.open(map, marker);
	}
	else if (id == showPoint && showPoint != NaN && showPoint != 0 && showPoint != "0")
	{
		infoProblemWindow.open(map, marker);
	}
		
	return infoProblemWindow;
}

function getHtmlLogin(latitude, longitude, userid)
{
	var html = "";

	var href = document.location.pathname;
	if (href.lastIndexOf("/") == href.length - 1)
	{
		href = href.substr(0, href.length - 1);
	}
	//var application = href + "0/" + latitude + "/" + longitude;
	var application = href + "?id=0%26latitude=" + latitude + "%26longitude=" + longitude;
	
	var onclick = '';
	onclick += 'var username = $(\'#Username\').val();var password = $(\'#Password\').val();'
	onclick += 'if (username == \'\' || password == \'\'){alert(\'' + labels.Req_Login + '\');'
	onclick += '} else{$(\'#windowForm\').submit();}';
	
	html += '<div id="pt-estrada-pop-login">';
	html += '<h4>'+ labels.Title_login + '</h4>';
	html += '<form id="windowForm" action="../Shared/LogOn?returnUrl=' + application + '" method="post" target = "_parent">';
	html += '<input id="latitude" name="latitude" type="hidden" value="' + latitude + '"></input>';
	html += '<input id="longitude" name="longitude" type="hidden" value="' + longitude + '"></input>';
	html += '<div>' + labels.Name + ':<input id="UserName" name="UserName" type="text" value="" /></div>';
	html += '<div>' + labels.Pass + ':<input id="Password" name="Password" type="password" value="" /></div>';
	html += '<p><input type="submit" id="entrar" value="' + labels.Enter + '" class="btn" onclick="' + onclick + '" /></p>';
	html += '</form>';
	html += '<div class="cadastro">'; 
	html += labels.New_reg; 
	html += '&nbsp;<a href="/registrar?returnUrl=' + application + '">' + labels.Register + '</a></div>';
	html += '</div>';

	return html;
}

function getHtmlViewProblem(marker, id, name, description, address, image, latitude, longitude, creatorId, creatorName, creationDate, userid)
{
	var html = "";
	
	var address_short = '';
	if (address.length > 43)
	{
		address_short  = address.substr(0, 43) + ' ...';
	}

	html += '<div id="pt-estrada-pop">';
	html += '<input id="id" name="id" type="hidden" value="' + id + '"></input>';
	html += '<input id="latitude" name="latitude" type="hidden" value="' + latitude + '"></input>';
	html += '<input id="longitude" name="longitude" type="hidden" value="' + longitude + '"></input>';
	html += '<h4>'+ description + '</h4>';
	html += '<table border="0" cellspacing="0" cellpadding="5"><tbody>';
	if (image != undefined && image != "undefined" && image != "")
	{
		html += '<tr><td align="center">';
		html += '<img src="data:image/jpg;base64,' + image + '" class="img" />';
		html += '</td></tr>';
	}
	//html += '<tr><td><div class="desc">' + description + '</div></td></tr>';
	if (address != "") {
		html += '<tr><td><div id="addressPopup" class="local" title="' + address + '">' + address_short + '</div></td></tr>';
	}
	html += '<tr><td>';
	if (creatorName != "") {
		html += '<span class="user">' + creatorName + '</span><span class="date"> - ' + creationDate + '</span>';
	}
	html += '</td></tr>';
	html += '<tr><td style="width: 260px;"><div class="remove">';
	if (creatorId != "0")
	{
		if (userid != "0")
		{
			var remove_onclick = 'event.preventDefault();if(confirm(\''+ labels.Confirm + '\')) { removeMarker(' + id + '); }';
			html += '<input type="button" id="removePoint" value="' + labels.Remove + '" onclick="' + remove_onclick + '" class="btn" />';
		}
		else
		{
			var href = document.location.pathname;
			if (href.lastIndexOf("/") != href.length - 1)
			{
				href = href + '/';
			}
			//var application = href + "0/" + latitude + "/" + longitude;
			var application = href + "?id=0&latitude=" + latitude + "&longitude=" + longitude;
			html += '<div class="cadastro">'; 
			html += labels.IsResolved; 
			html += '&nbsp;<a href="/registrar?returnUrl=' + application + '">' + labels.Register + '</a>';
			html += '</div>';
		}
	}
	html += '</div>';
	html += shareHtml(id, name, description, image, latitude, longitude);
	html += '</td></tr>';
	html += '</tbody></table>';
	html += '</div>';

	return html;
}

function getHtmlInsertProblem(latitude, longitude)
{
	var html = "";

	getAddress(latitude, longitude, setAddressCallback);

	var text_description = labels.TxtDesc;
	if (useMaxChars)
		text_description += ' em até ' + maxCharsInTextArea + ' caracteres.';

	var onclick_description = 'var description = $(\'#description\').val();';
	onclick_description += 'if (description == \'' + text_description + '\'){ $(this).val(\'\'); }';

	var onblur_description = 'var description = $(\'#description\').val();';
	onblur_description += 'if (description == \'\'){ $(this).val(\'' + text_description + '\'); }';

	var onclick = '';
	onclick += 'var ext = $(\'#photoImg\').val().split(\'.\').pop().toLowerCase();';
	onclick += 'var description = $(\'#description\').val(); description = description.replace(\'' + text_description + '\', \'\');';
	onclick += 'var accept = $(\'#accept:checked\').val();';
	onclick += 'if (ext != \'\' && ext != \'jpg\'){'
	onclick += '$.colorbox({html: \'' + labels.Req_Type + '\', close: \'Fechar\', transition: \'none\', opacity: 0, className: \'MsgError\'});return false;';
	onclick += '} else if (description == \'\'){';
	onclick += '$.colorbox({html: \'' + labels.Req_Descr + '\', close: \'Fechar\', transition: \'none\', opacity: 0, className: \'MsgError\'});return false;';
	onclick += '} else if (accept == undefined){';
	onclick += '$.colorbox({html: \'' + labels.Req_Terms + '\', close: \'Fechar\', transition: \'none\', opacity: 0, className: \'MsgError\'});return false;';
	onclick += '} else{return true;}return false;';
	
	onclick_accept = '$(\'.inline\').colorbox({inline:true, width:\'50%\', close:\'Fechar\'});';
	
	html += '<div id="pt-estrada-pop">';
	html += '<form id="windowForm" action="/ProtesteOnRoad/" method="post" enctype="multipart/form-data">';
	html += '<input id="latitude" name="latitude" type="hidden" value="' + latitude + '"></input>';
	html += '<input id="longitude" name="longitude" type="hidden" value="' + longitude + '"></input>';
	html += '<h4>' + labels.Title_Insert + '</h4>';
	html += '<div id="addressPopup" title="">' + labels.Wait + '</div>';
	html += '<div><textarea id="description" name="description"';
	html += 'onclick="' + onclick_description + '" onblur="' + onblur_description + '" onkeyup="if(useMaxChars){ textLimit(this, ' + maxCharsInTextArea + ') }">' + text_description + '</textarea>';
	//if (useMaxChars)
	//	html += '<br/>(Até ' + maxCharsInTextArea + ' caracteres)';
	html += '</div>';
	html += '<div><input id="photoImg" name="photoImg" type="file"></input> (.jpg) </div>';
	html += '<div align="right">';
	html += '<span class="termos"><input id="accept" name="accept" type="checkbox" value="1"></input>&nbsp;' + labels.Msg_Terms1;
	html += '&nbsp;<a href="#conditions" class="inline" onclick="' + onclick_accept + '">' + labels.Msg_Terms2 + '</a></span>&nbsp;';
	html += '<input type="submit" id="savePoint" value="' + labels.Send + '" onclick="' + onclick + '" class="btn"/></input>';
	html += '</div>';
	html += '</form>';
	html += '</div>';

	return html;
}

function getHtmlEditProblem(id, latitude, longitude)
{
	var html = "";

	getAddress(latitude, longitude, setAddressCallback);

	var name         = "";
	var description  = "";
	var image        = "";
	var creatorId    = "";
	var creatorName  = "";
	var address     = "";
	
	var data = getMarker(id);
	var xml = parseXml(data);
    var mark = xml.documentElement.getElementsByTagName("marker");
    if (mark != undefined && mark.length > 0)
	{
		id          = mark.childNodes[0].childNodes != undefined && mark.childNodes[0].childNodes.length > 0 ? mark.childNodes[0].childNodes[0].data : "";
		name        = mark.childNodes[1].childNodes != undefined && mark.childNodes[1].childNodes.length > 0 ? mark.childNodes[1].childNodes[0].data : "";
		description = mark.childNodes[2].childNodes != undefined && mark.childNodes[2].childNodes.length > 0 ? mark.childNodes[2].childNodes[0].data : "";
		image       = mark.childNodes[3].childNodes != undefined && mark.childNodes[3].childNodes.length > 0 ? mark.childNodes[3].childNodes[0].data : "";
		latitude    = mark.childNodes[4].childNodes != undefined && mark.childNodes[4].childNodes.length > 0 ? mark.childNodes[4].childNodes[0].data : "";
		longitude   = mark.childNodes[5].childNodes != undefined && mark.childNodes[5].childNodes.length > 0 ? mark.childNodes[5].childNodes[0].data : "";
		creatorId   = mark.childNodes[6].childNodes != undefined && mark.childNodes[6].childNodes.length > 0 ? mark.childNodes[6].childNodes[0].data : "";
		creatorName = mark.childNodes[7].childNodes != undefined && mark.childNodes[7].childNodes.length > 0 ? mark.childNodes[7].childNodes[0].data : "PROTESTE";
		address     = mark.childNodes[8].childNodes != undefined && mark.childNodes[8].childNodes.length > 0 ? mark.childNodes[7].childNodes[0].data : "";
    }

	var onclick = '';
	onclick += 'var ext = $(\'#photoImg\').val().split(\'.\').pop().toLowerCase();';
	onclick += 'var description = $(\'#description\').val(); description = description.replace(\'' + labels.TxtDesc + '\', \'\');';
	onclick += 'var accept = $(\'#accept:checked\').val();';
	onclick += 'if (ext != \'\' && ext != \'jpg\'){'
	onclick += '$.colorbox({html: \'' + labels.Req_Type + '\', close: \'Fechar\', transition: \'none\', opacity: 0, className: \'MsgError\'});return false;';
	onclick += '} else if (description == \'\'){';
	onclick += '$.colorbox({html: \'' + labels.Req_Descr + '\', close: \'Fechar\', transition: \'none\', opacity: 0, className: \'MsgError\'});return false;';
	onclick += '} else if (accept == undefined){';
	onclick += '$.colorbox({html: \'' + labels.Req_Terms + '\', close: \'Fechar\', transition: \'none\', opacity: 0, className: \'MsgError\'});return false;';
	onclick += '} else{return true;}return false;';

	html += '<div id="pt-estrada-pop">';
	html += '<form id="windowForm" method="post" enctype="multipart/form-data">';
	html += '<input id="latitude" name="latitude" type="hidden" value="' + latitude + '"></input>';
	html += '<input id="longitude" name="longitude" type="hidden" value="' + longitude + '"></input>';
	html += '<h4>' + labels.Title_Edit + '</h4>';
	html += '<div id="addressPopup">' + address + '</div>';
	html += '<div><textarea id="description" name="description" onkeyup="if(useMaxChars){ textLimit(this, ' + maxCharsInTextArea + ') }">' + description + '</textarea>';
	if (useMaxChars)
		html += '<br/>(Até ' + maxCharsInTextArea + ' caracteres)';
	html += '</div>';
	html += '<div><input id="photoImg" name="photoImg" type="file"></input> (.jpg) </div>';
	html += '<div align="right">';
	html += '<input type="button" id="updatePoint" value="' + labels.Send + '" onclick="' + onclick + '" class="btn"/></input>';
	html += '</div>';
	html += '</form>';
	html += '</div>';

	return html;
}

function shareHtml(id, name, description, image, latitude, longitude)
{
	var html = "";
	
	var href = document.location.href;
	if (href.lastIndexOf("/") != href.length - 1)
	{
		href = href + '/';
	}
	var url = href+ "?id=" + id + "&latitude=" + latitude + "&longitude=" + longitude;;

	//http://bit.ly/17F0ktI = 21 characters = http://www.proteste.org.br/proteste-na-estrada
	var description_twitter = description;
	var descLength = 140 - 21 - 3;
	if (description_twitter.length > 119)
	{
		description_twitter = description_twitter.substr(0, descLength);
	}
	description_twitter = description_twitter + ' - http://bit.ly/17F0ktI';

	var appId = '462559237163054';//Teste proteste on road
	var caption = 'Proteste%20Na%20Estrada';
	var name_facebook = 'Ajude%20a%20resolver%20os%20problemas%20nas%20estradas!';

	var url_twitter  = 'http://twitter.com/intent/tweet?source=sharethiscom&text=' + description_twitter + '&url=' + url;
	var url_facebook = 'https://www.facebook.com/dialog/feed?app_id=' + appId + '&link=' + url + '&picture=& name=' + name_facebook + '&caption=' + caption;
	url_facebook += '&description=' + description + '&redirect_uri=' + document.location.href;
	var url_google   = 'https://plus.google.com/share?title=' + description + '&url=' + document.location.href;
	
	html += '<div class="share"><img src="/Content/Images/ProtesteOnRoad/compartilhe.png" width="84" height="45" border="0" usemap="#Map21">';
	html += '<map name="Map21" id="Map21">';
	html += '<area shape="rect" coords="3,15,26,42"  href="' + url_twitter  + '" target="_blank">';
	html += '<area shape="rect" coords="28,13,56,44" href="' + url_facebook + '" target="_blank">';
	html += '<area shape="rect" coords="57,14,84,45" href="' + url_google   + '" target="_blank">';
	html += '</map>';
	html += '</div>';

	return html;
}

function clearAllMarkers()
{
	for (var i = 0; i < markers.length; i++)
	{
		markers[i].setMap(null);
		markers.pop(markers[i]);
	}
	markers = [];
}

function closeAllInfoWindow()
{
	for(var i= 0; i< infoWindowList.length; i++)
	{
		infoWindowList[i].close();
	}
}

function textLimit(field, maxlen)
{
	if (useMaxChars)
	{
		if (field.value.length > maxlen + 1)
		{
			//alert('o limite de caracteres foi atingido');
			$.colorbox({html: 'O limite de caracteres foi atingido', close: 'Fechar', transition: 'none', opacity: 0, className: 'MsgError'});
		}
		if (field.value.length > maxlen)
		{
			field.value = field.value.substring(0, maxlen);
		}
	}
}