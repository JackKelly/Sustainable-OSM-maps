#!/usr/bin/env python

import sys
import urllib
import pprint
import flickr

#photoData = flickr._doget('flickr.photos.getSizes', photo_id=3763496262)
#for psize in photoData.rsp.sizes.size:
#  print psize.source, psize.label

otherData = flickr._doget('flickr.photos.getInfo', photo_id=3763496262)
u = flickr.User(otherData.rsp.photo.owner)
print u.username
