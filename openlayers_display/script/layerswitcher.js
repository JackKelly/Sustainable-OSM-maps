OpenLayers.Control.NicerLayerSwitcher=OpenLayers.Class(OpenLayers.Control,
  {
  conditions:[],
  defaultCondition:1,
  divs:[],
  layers:[],
  layerStates:null,

  initialize: function(options)
    {
    OpenLayers.Control.prototype.initialize.apply(this,arguments);
    for(var i=0;i<this.divs.length;i++)
      {
        this.divs[i]=OpenLayers.Util.getElement(this.divs[i])
      }
    this.layerStates=[];
        },


  destroy:function()
    {
    OpenLayers.Event.stopObservingElement(this.div);
    this.clearLayersArray("base");
    this.clearLayersArray("data");
    this.map.events.un(
      {
      "addlayer":this.redraw,
      "changelayer":this.redraw,
      "removelayer":this.redraw,
      "changebaselayer":this.redraw,
      scope:this
      });
    OpenLayers.Control.prototype.destroy.apply(this,arguments);
    },


  setMap:function(map)
    {
    OpenLayers.Control.prototype.setMap.apply(this,arguments);
    this.map.events.on(
      {
      "addlayer":this.redraw,
      "changelayer":this.redraw,
      "removelayer":this.redraw,
      "changebaselayer":this.redraw,
      scope:this
      });
    },


  draw:function()
    {
    OpenLayers.Control.prototype.draw.apply(this);
    for(var i=0;i<this.divs.length;i++)
      {
      OpenLayers.Rico.Corner.round(this.divs[i],{blend:false});
      this.divs[i]=this.divs[i].getElementsByTagName('ul')[0];
      }
    this.redraw();
    },

  clearLayersArray:function()
    {
    for(var d=0;d<this.divs.length;d++)
      {
      var layers=this.layers[d];
      if(layers)
        {
        for(var i=0,len=layers.length;i<len;i++)
          {
          var layer=layers[i];
          OpenLayers.Event.stopObservingElement(layer.inputElem);
          OpenLayers.Event.stopObservingElement(layer.labelSpan);
          }
        }
      this.divs[d].innerHTML="";
      this.layers[d]=[];
      }
    },


  checkRedraw:function()
    {
    var redraw=false;
    if(!this.layerStates.length||(this.map.layers.length!=this.layerStates.length))
      {
      redraw=true;
      }
    else
      {
      for(var i=0,len=this.layerStates.length;i<len;i++)
        {
        var layerState=this.layerStates[i];
        var layer=this.map.layers[i];
        if ((layerState.name!=layer.name)||(layerState.inRange!=layer.inRange)||(layerState.id!=layer.id)||(layerState.visibility!=layer.visibility))
          {
          redraw=true;break;
          }
        }
      }
    return redraw;
    },


  redraw:function()
    {
    if(!this.checkRedraw())
      {
      return;
      }
    this.clearLayersArray();
    var len=this.map.layers.length;
    this.layerStates=new Array(len);
    for(var i=0;i<len;i++)
      {
      var layer=this.map.layers[i];
      this.layerStates[i]=
        {
        'name':layer.name,'visibility':layer.visibility,'inRange':layer.inRange,'id':layer.id
        };
      }
    var layers=this.map.layers.slice();
    for(var i=0,len=layers.length;i<len;i++)
      {
      var layer=layers[i];
      var baseLayer=layer.isBaseLayer;
      if(layer.displayInLayerSwitcher)
        {
        var checked=(baseLayer)?(layer==this.map.baseLayer):layer.getVisibility();
        var li=document.createElement("li");
        var inputElem=document.createElement("input");
        inputElem.id=this.id+"_input_"+layer.name;
        inputElem.name=(baseLayer)?"baseLayers":layer.name;
        inputElem.type=(baseLayer)?"radio":"checkbox";
        inputElem.value=layer.name;
        inputElem.checked=checked;
        inputElem.defaultChecked=checked;
        if(!baseLayer&&!layer.inRange)
          {
          inputElem.disabled=true;
          }
        var context={'inputElem':inputElem,'layer':layer,'layerSwitcher':this};
        OpenLayers.Event.observe(inputElem,"mouseup",OpenLayers.Function.bindAsEventListener(this.onInputClick,context));
        var labelSpan=document.createElement("span");
        if(!baseLayer&&!layer.inRange)
          {
          labelSpan.style.color="gray";
          }
        labelSpan.innerHTML=layer.name;
        labelSpan.style.verticalAlign=(baseLayer)?"bottom":"baseline";
        OpenLayers.Event.observe(labelSpan,"click",OpenLayers.Function.bindAsEventListener(this.onInputClick,context));
        var section=this.defaultCondition;
        for(var d=0;d<this.conditions.length;d++)
          {
          if(layer[this.conditions[d]])
            {
            section=d;
            }
          }
        this.layers[section].push({'layer':layer,'inputElem':inputElem,'labelSpan':labelSpan});
        var groupDiv=this.divs[section];
        li.appendChild(inputElem);
        li.appendChild(labelSpan);
        groupDiv.appendChild(li);
        }
      }
      return this.div;
    },

  onInputClick:function(e)
    {
    if(!this.inputElem.disabled)
      {
      if(this.inputElem.type=="radio")
        {
        this.inputElem.checked=true;
        this.layer.map.setBaseLayer(this.layer);
        }
      else
        {
        this.inputElem.checked=!this.inputElem.checked;
        this.layerSwitcher.updateMap();
        }
      }
    OpenLayers.Event.stop(e);
    },

  onLayerClick:function(e)
    {
    this.updateMap();
    },

  updateMap:function()
    {
    for(var i=0,len=this.layers[0].length;i<len;i++)
      {
      var layerEntry=this.layers[0][i];
      if(layerEntry.inputElem.checked)
        {
        this.map.setBaseLayer(layerEntry.layer,false);
        }
      }
    for(var d=1,dl=this.layers.length;d<dl;d++)
      {
      for(var i=0,len=this.layers[d].length;i<len;i++)
        {
        var layerEntry=this.layers[d][i];
        layerEntry.layer.setVisibility(layerEntry.inputElem.checked);
        }
      }
    },

  ignoreEvent:function(evt)
    {
    OpenLayers.Event.stop(evt);
    },

  mouseDown:function(evt)
    {
    this.isMouseDown=true;
    this.ignoreEvent(evt);
    },

  mouseUp:function(evt)
    {
    if(this.isMouseDown)
      {
      this.isMouse      Down=false;
      this.ignoreEvent(evt);
      }
    },

  CLASS_NAME:"OpenLayers.Control.NicerLayerSwitcher"
});