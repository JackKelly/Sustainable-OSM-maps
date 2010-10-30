from xml.dom.minidom import parse
import urllib

class NotTextNodeError:
  pass

def getTextFromNode(node):
  """
  scans through all children of node and gathers the
  text. if node has non-text child-nodes, then
  NotTextNodeError is raised.
  """
  t = ""
  for n in node.childNodes:
    if n.nodeType == n.TEXT_NODE:
      t += n.nodeValue
    else:
      raise NotTextNodeError
  return t

def nodeToDic(node):
  """
  nodeToDic() scans through the children of node and makes a
  dictionary from the content.
  three cases are differentiated:
	- if the node contains no other nodes, it is a text-node
  and {nodeName:text} is merged into the dictionary.
	- if the node has the attribute "method" set to "true",
    then it's children will be appended to a list and this
    list is merged to the dictionary in the form: {nodeName:list}.
	- else, nodeToDic() will call itself recursively on
    the nodes children (merging {nodeName:nodeToDic()} to
    the dictionary).
  """
  dic = {}
  for n in node.childNodes:
    print n
    if n.nodeType != n.ELEMENT_NODE:
      continue
    if n.getAttribute("multiple") == "true":
      # node with multiple children: put them in a list
      l = []
      for c in n.childNodes:
        if c.nodeType != n.ELEMENT_NODE:
          continue
        l.append(nodeToDic(c))
        dic.update({n.nodeName:l})
      continue

    try:
      text = getTextFromNode(n)
    except NotTextNodeError:
      # 'normal' node
      dic.update({n.nodeName:nodeToDic(n)})
      continue

    # text node
    dic.update({n.nodeName:text})
    continue

  return dic

def readConfig(filename):
  dom = parse(filename)
  print dom
  return nodeToDic(dom)

def main():
  # URL to fetch the OSM data from
  map_source_data_url="http://xapi.openstreetmap.org/api/0.6/*[power=generator][bbox=-0.51,51.20,0.35,51.80]" 
  # Filename for OSM map data
  xml_filename="cycleparking.xml"
  # Download the map.osm file from the net
  print "Downloading OSM data."
  print "'%s' -> '%s'"%(map_source_data_url,xml_filename)
  #urllib.urlretrieve(map_source_data_url,xml_filename)
  data = readConfig(xml_filename)
  print data

if __name__=="__main__":
  main()
