# -*- coding: utf-8 -*-
#! /usr/bin/python
 
import libxslt
import libxml2
import re
import urllib
import os
import csv
 
# Program to produce amenity layers for OpenLayers
# * Download data from OSM
# * Use XSLT to extract lat/lon pairs for each type of amenity
# * Build the poi.html framework for the layers
 
# Released for OSM under CC-by-SA licence
 
def main():
 
  libxml2.lineNumbersDefault(1)
  libxml2.substituteEntitiesDefault(1)
  
  # Filename for OSM map data
  xml_filename = "generators.xml"
 
  # Filename for XSLT to extract POIs
  xsl_filename = "trans_pois.xsl"
 
 
  # Layers we are going to extract (in a dict)
  # The key is the layer name, the value is a list of parameters:
  # 0,1: OSM key, value
  # 2: POI text output file name
  # 3: icon for this type of POI
  # 4,5: icon width,height (px)
  # 6,7: icon offset (x,y) (px)
  marker_layers={
    "Generators":["power", "generator", "data_generators.csv"],
     }
 
  # Read the XML into memory.  We will use it many times.
  osmdoc = libxml2.parseFile(xml_filename)
 
  # Read the XSLT
  styledoc = libxml2.parseFile(xsl_filename)
  style = libxslt.parseStylesheetDoc(styledoc)
 
  output_kml = """<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2">\n<Document>\n<Style id="solar">\n\t<IconStyle>\n\t\t<Icon>\n\t\t\t<href>http://tomchance.dev.openstreetmap.org/pois/power_solar.png</href>\n\t\t</Icon>\n\t</IconStyle>\n</Style>\n<Folder><name>Power generators in London</name>\n\n\n"""
 
  # Extract POIs to layer text files
  for layer,tags in marker_layers.iteritems():
    layer_filename = tags[2]
    result = style.applyStylesheet(osmdoc,\
    { "key":"'%s'"%tags[0], "value":"'%s'"%tags[1]})
    style.saveResultToFilename(layer_filename, result, 0)
    
    # Read CSV file into dict
    pdata = csv.DictReader(open(layer_filename, 'rb'), delimiter='	')
    for row in pdata:
      if (row['source'] == 'solar' and row['type'] == 'heat'):
	gen_type = "Solar thermal panel(s)"
	gen_style = "solar"
      elif (row['source'] == 'solar' and row['type'] == 'electricity'):
	gen_type = "Solar photovoltaic panel(s)"
	gen_style = "solar"
      elif (row['source'] == 'wind'):
	gen_type = "Wind turbine(s)"
	gen_style = "default"
      else:
        continue
        gen_type = "Unknown power generator"
	gen_style = "default"
      if (row['rating'] == ''):
	row['rating'] = "Unknown"
      if (row['description'] == ''):
	row['description'] = "No information available"
      output_kml = ''.join([output_kml, """<Placemark>\n\t<name>%s</name>\n\t<description><![CDATA[<strong>Description:</strong> %s<br><br><strong>Output capacity rating:</strong> %s]]></description>\n\t<StyleUrl>#%s</StyleUrl>\n\t<Point>\n\t\t<coordinates>%s,%s</coordinates>\n\t</Point>\n</Placemark>\n""" % (gen_type, row['description'], row['rating'], gen_style, row['lon'], row['lat'])])

  output_kml = ''.join([output_kml, "</Folder></Document></kml>"])
  
  print output_kml
  
if __name__=="__main__":
  main()
