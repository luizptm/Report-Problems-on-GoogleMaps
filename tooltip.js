
//http://www.wolfpil.de/v3/picture-gallery.html
/**
* Tooltip based on Label overlay by Marc Ridey
* http://blog.mridey.com/2009/09/label-overlay-example-for-google-maps.html
*/

function Tooltip(opt_options)
{
	// Initialization
	this.setValues(opt_options);
	var div = this.div_ = document.createElement("div");
	// Absolute position is absolutely necessary
	div.style.cssText = "position:absolute;"
	div.className = "tooltip";
};

Tooltip.prototype = new google.maps.OverlayView();

Tooltip.prototype.visible_changed = function()
{
	var vis = this.get("visible");
	this.div_.style.display  = vis ? "block" : "none";
};

Tooltip.prototype.onAdd = function()
{
	var pane = this.getPanes().floatPane;
	pane.appendChild(this.div_);
	this.set("visible", true);
};

Tooltip.prototype.onRemove = function()
{
	var parent = this.div_.parentNode;
	if (parent) parent.removeChild(this.div_);
};

Tooltip.prototype.draw = function()
{
	var proj = this.getProjection();
	var pos = proj.fromLatLngToDivPixel(this.get("position"));
	var div = this.div_;
	this.set("visible", false);
	div.style.left = pos.x + 18 + "px";
	div.style.top  = pos.y - 80 + "px";
	if (this.get("html") != undefined && this.get("html") != "undefined")
	{
		div.innerHTML = this.get("html").toString();
	}
};