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

  var layerMapnik = new OpenLayers.Layer.OSM.Mapnik("Mapnik");
  map.addLayer(layerMapnik);

  OpenLayers.Feature.prototype.popupClass = OpenLayers.Popup.FramedCloud;
  OpenLayers.Layer.Text.prototype.markerClick = function(evt) {
    var sameMarkerClicked = (this == this.layer.selectedFeature);
    if (this.popup) {
	this.popup.toggle(); 
    } else {
	this.layer.map.addPopup(this.createPopup(true));
    }
    this.layer.selectedFeature = (!sameMarkerClicked) ? this : null;
    OpenLayers.Event.stop(evt);        
  }
  var pois = new OpenLayers.Layer.Text( "Solar",
	  { location:"http://tomchance.dev.openstreetmap.org/pois/pois_solar.txt",
	    projection: map.displayProjection,
	    visibility: 1
	  });
  map.addLayer(pois);var pois = new OpenLayers.Layer.Text( "Wind",
	  { location:"http://tomchance.dev.openstreetmap.org/pois/pois_wind.txt",
	    projection: map.displayProjection,
	    visibility: 1
	  });
  map.addLayer(pois);var pois = new OpenLayers.Layer.Text( "Tidal",
	  { location:"http://tomchance.dev.openstreetmap.org/pois/pois_tidal.txt",
	    projection: map.displayProjection,
	    visibility: 1
	  });
  map.addLayer(pois);var pois = new OpenLayers.Layer.Text( "Wave",
	  { location:"http://tomchance.dev.openstreetmap.org/pois/pois_wave.txt",
	    projection: map.displayProjection,
	    visibility: 1
	  });
  map.addLayer(pois);var pois = new OpenLayers.Layer.Text( "Geothermal",
	  { location:"http://tomchance.dev.openstreetmap.org/pois/pois_geothermal.txt",
	    projection: map.displayProjection,
	    visibility: 1
	  });
  map.addLayer(pois);var pois = new OpenLayers.Layer.Text( "Hydro",
	  { location:"http://tomchance.dev.openstreetmap.org/pois/pois_hydro.txt",
	    projection: map.displayProjection,
	    visibility: 1
	  });
  map.addLayer(pois);var pois = new OpenLayers.Layer.Text( "Biomass",
	  { location:"http://tomchance.dev.openstreetmap.org/pois/pois_biomass.txt",
	    projection: map.displayProjection,
	    visibility: 1
	  });
  map.addLayer(pois);var pois = new OpenLayers.Layer.Text( "Gas",
	  { location:"http://tomchance.dev.openstreetmap.org/pois/pois_gas.txt",
	    projection: map.displayProjection,
	    visibility: 1
	  });
  map.addLayer(pois);var pois = new OpenLayers.Layer.Text( "Waste",
	  { location:"http://tomchance.dev.openstreetmap.org/pois/pois_waste.txt",
	    projection: map.displayProjection,
	    visibility: 1
	  });
  map.addLayer(pois); 
  map.addControl(new OpenLayers.Control.LayerSwitcher());
  map.addControl(new OpenLayers.Control.PanZoomBar());
  map.addControl(new OpenLayers.Control.Navigation());
  map.addControl(new OpenLayers.Control.Permalink("link to this view"));

  var lonLat = new OpenLayers.LonLat(lat, lon).transform(map.displayProjection,  map.projection);
  if (!map.getCenter()) map.setCenter (lonLat, zoom);

  return map;
}