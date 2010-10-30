var map;

/**
 * Function: initMap
 * Sets up the map, its layers and controls.
 * lat, lon, zoom are the initial map position, provided a permalink has not been used
 */
function initMap(lat, lon, zoom){
  map = new OpenLayers.Map('map',
	  { maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
	    numZoomLevels: 10,
	    maxResolution: 'auto',
	    units: 'm',
	    controls: [],
	    projection: new OpenLayers.Projection("EPSG:900913"),
	    displayProjection: new OpenLayers.Projection("EPSG:4326")
	  });

  var layerDefault = new OpenLayers.Layer.OSM.Mapnik("Default map");
  var layerCycling = new OpenLayers.Layer.OSM.CycleMap("Cycling map");
  map.addLayers([layerDefault, layerCycling]);

  var layerPower = addKMLLayer("Low carbon power", "kml/power.kml");
  var layerWaste = addKMLLayer("Zero waste", "kml/waste.kml");
  var layerFood = addKMLLayer("Sustainable food", "kml/food.kml");
  var layerTransport = addKMLLayer("Sustainable transport", "kml/transport.kml");
  var layersPOI = [layerPower, layerWaste, layerFood, layerTransport];

  map.addLayers(layersPOI);
  var selectControl = new OpenLayers.Control.SelectFeature(layersPOI, {onSelect: onFeatureSelect, onUnselect: onFeatureUnselect});
  map.addControl(selectControl);
  selectControl.activate();  

  var layerSwitcherControl = new OpenLayers.Control.LayerSwitcher();
  map.addControl(layerSwitcherControl);
  layerSwitcherControl.maximizeControl();
  map.addControl(new OpenLayers.Control.PanZoomBar());
  map.addControl(new OpenLayers.Control.Navigation());
  map.addControl(new OpenLayers.Control.Permalink("link to this view"));

  var lonLat = new OpenLayers.LonLat(lat, lon).transform(map.displayProjection,  map.projection);
  if (!map.getCenter()) map.setCenter (lonLat, zoom);

  return map;
}

/**
 * Function: addKMLLayer
 * Sets up a KML layer with popup classes
 * layername and layerurl are pretty self-explanatory
 */
function addKMLLayer(layername,layerurl){
  var kmllayer = new OpenLayers.Layer.GML(layername, layerurl,
  {
    format: OpenLayers.Format.KML,
    projection: new OpenLayers.Projection("EPSG:4326"),
    visibility: 0,
    formatOptions: {
      extractStyles: true,
      extractAttributes: true
    }
  });
  return kmllayer;
}

/**
 * Various functions for popup windows
 */
function onPopupClose(evt) {
//  selectControl.unselect(selectedFeature);
  onFeatureUnselect(selectedFeature);
}
function onFeatureSelect(feature) {
  selectedFeature = feature;
  popup = new OpenLayers.Popup.FramedCloud("chicken", 
    feature.geometry.getBounds().getCenterLonLat(),
    new OpenLayers.Size(100,100),
      "<div><strong>"+feature.attributes.name+"</strong><br/>"+feature.attributes.description+"</div>",
      null, true, onPopupClose);
  feature.popup = popup;
  map.addPopup(popup);
}
function onFeatureUnselect(feature) {
  if (feature.popup) {
    map.removePopup(feature.popup);
    feature.popup.destroy();
    feature.popup = null;
  }
}
