
var fontFamily = 'Arial,sans-serif';
var controlDiv;

createControlUI = function()
{
	var controlUI = document.createElement("div");
	controlUI.style.backgroundColor = "white";
	controlUI.style.borderStyle = "solid";
	controlUI.style.borderColor = "#000000";
	controlUI.style.borderWidth = "1px";
	controlUI.style.cursor = "pointer";
	controlUI.style.textAlign = "center";
	return controlUI;
}

function initializeMapControls(map)
{
	controlDiv = document.createElement("div");
	controlDiv.style.padding = "5px";

	homeControl(map);
	//maximizeControl(map);
	return controlDiv;
}

function homeControl(map)
{
	var controlUI = createControlUI();
	controlDiv.appendChild(controlUI);

	var controlBrasil = document.createElement("div");
	controlBrasil.style.fontFamily = fontFamily;
	controlBrasil.style.fontSize = "12px";
	controlBrasil.style.paddingLeft = "4px";
	controlBrasil.style.paddingRight = "4px";
	controlBrasil.innerHTML = "<strong>Brasil</strong>";
	controlUI.appendChild(controlBrasil);

	google.maps.event.addDomListener(controlBrasil, "click", function() {
		map.setCenter(brasilPoint); //setCenter(latlng:LatLng)
		map.setZoom(4);             //setZoom(zoom:number)
	});

	return controlDiv;
}

function maximizeControl(map)
{
	var controlUI = createControlUI();
	controlDiv.appendChild(controlUI);

	var maxControl = document.createElement('div');
	maxControl.style.fontFamily = fontFamily;
	maxControl.style.fontSize = '12px';
	maxControl.style.paddingLeft = '4px';
	maxControl.style.paddingRight = '4px';
	maxControl.innerHTML = '<b>Maximizar</b>';
	controlUI.appendChild(maxControl);

	google.maps.event.addDomListener(maxControl, "click", function() {
		//TODO
	});

	return controlDiv;
}