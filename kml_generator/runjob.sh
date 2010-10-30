#!/bin/sh

cd /home/tomchance/greenmaps
python extract_pois.py
cp kml/*.kml /home/tomchance/public_html/kml
