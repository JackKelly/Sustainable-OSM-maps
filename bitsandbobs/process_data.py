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
 
  # URL to fetch the OSM data from
  map_source_data_url="http://xapi.openstreetmap.org/api/0.6/*[power=generator][bbox=-0.51,51.20,0.35,51.80]"
 
  # Filename for OSM map data
  xml_filename = "generators.xml"
 
  # Filename for XSLT to extract POIs
  xsl_filename = "trans_csv_generators.xsl"
 
  # Download the map.osm file from the net, if we don't already have one.
  #if os.path.isfile(xml_filename):
    #print "Not downloading map data.  '%s' already exists."%xml_filename
  #else:
  #print "Downloading OSM data."
  #print "'%s' -> '%s'"%(map_source_data_url,xml_filename)
  #urllib.urlretrieve(map_source_data_url,xml_filename)
 
  # Read the XML into memory.  We will use it many times.
  osmdoc = libxml2.parseFile(xml_filename)
 
  # Read the XSLT
  styledoc = libxml2.parseFile(xsl_filename)
  style = libxslt.parseStylesheetDoc(styledoc)
 
  # Extract POIs to layer text files
  result = style.applyStylesheet(osmdoc, {"key":"power", "value":"generator"})
  style.saveResultToFilename("temp.csv", result, 0)

if __name__=="__main__":
  main()
