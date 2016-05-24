//TODO: Configure stakeholder, driver, assessment, requirement, constraint, Work Package, Deliverable, Plateau, Gap
//TODO: care for junctinos in the future
//TODO: care for edge attribtues

this.configuration = {

  author:"Sebastian Bittmann",
  email:"SebastianBittmann@gmail.com",

  globalDelimiter: 50,
  globalParagraph: 4,
  globalTextlines: 13,
  globalCharheight: 8,
  edgedistance: 10,
  modelfiletype:function(xml,data){
    return "xml";
  },
  idgenerator:function(){
    var result = '';
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var length = 8;
    var found = true;
    while(found){
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        result = "id-"+result;
        //Check that Node id and element id are not already in use.
        if($(documentmodengine.xml).find("[identifier='"+result+"']").size()==0){
          found = false;
        }
    }
    return result;
  },
  models:function(xml){return $(xml).children("model");},
  model:{
    new:function(lang){
      var xml = '<?xml version="1.0"?><model/>';
      var result = jQuery.parseXML(xml);
      var model = $(result).children("model");
      model.attr("xmlns",'http://www.opengroup.org/xsd/archimate');
      model.attr("xmlns:dc",'http://purl.org/dc/elements/1.1/');
      model.attr("xmlns:xsi",'http://www.w3.org/2001/XMLSchema-instance');
      model.attr("xsi:schemaLocation",'http://www.opengroup.org/xsd/archimate archimate_v2p1.xsd http://purl.org/dc/elements/1.1/ http://dublincore.org/schemas/xmls/qdc/2008/02/11/dc.xsd');
      model.attr("identifier",configuration.idgenerator());

      var metadata = $("<metadata></metadata>");
      var schema = $("<schema></schema>");
      metadata.append(schema);
      var schemaversion = $("<schemaversion></schemaversion>");
      metadata.append(schemaversion);
      var title = $("<dc:title></dc:title>");
      metadata.append(title);
      var creator = $("<dc:creator></dc:creator>");
      metadata.append(creator);
      var subject = $("<dc:subject></dc:subject>");
      metadata.append(subject);
      var description = $("<dc:description></dc:description>");
      metadata.append(description);
      var format = $("<dc:format></dc:format>");
      metadata.append(format);
      var language = $("<dc:language></dc:language>");
      metadata.append(language);
      model.append(metadata);

      var documentation = $("<documentation></documentation>");
      documentation.attr("xml:lang",lang);
      model.append(documentation);

      var name = $("<name></name>");
      name.attr("xml:lang",lang);
      model.append(name);

      var properties = $("<properties></properties>");
      model.append(properties);
      var elements = $("<elements></elements>");
      model.append(elements);
      var relationships = $("<relationships></relationships>");
      model.append(relationships);
      var organization = $("<organization></organization>");
      model.append(organization);
      var propertydefs = $("<propertydefs></propertydefs>");
      model.append(propertydefs);
      var views = $("<views></views>");
      model.append(views);


      return result;
    },
    name:function(xml,data){
      return $(data).children("name[xml\\:lang="+documentmodengine.usersettings.lang+"]").text()
    },
    views:function(model){return $(model).children().children('views').children();},
    id:function(model){return $(model).attr("identifier")},
    byid:function(xml,modelid){return $(xml).children("model[identifier='"+modelid+"'")[0];},
    modelelements:function(model){
      return $(model).find("element");
    },
    relations:function(model){
      return $(model).find("relationship");
    },
    attributes:{
      creator:{
        get:function(xml,model){
          return $(model).children("metadata").children("dc\\:creator").text();
        },
        set:function(xml,model,value){
          return $(model).children("metadata").children("dc\\:creator").text(value);
        },
        type:"String"
      },
      title:{
        get:function(xml,model){
          return $(model).children("metadata").children("dc\\:title").text();
        },
        set:function(xml,model,value){
          return $(model).children("metadata").children("dc\\:title").text(value);
        },
        type:"String"
      },
      subject:{
        get:function(xml,model){
          return $(model).children("metadata").children("dc\\:subject").text();
        },
        set:function(xml,model,value){
          return $(model).children("metadata").children("dc\\:subject").text(value);
        },
        type:"String"
      },
      description:{
        get:function(xml,model){
          return $(model).children("metadata").children("dc\\:description").text();
        },
        set:function(xml,model,value){
          return $(model).children("metadata").children("dc\\:description").text(value);
        },
        type:"String"
      },
      format:{
        get:function(xml,model){
          return $(model).children("metadata").children("dc\\:format").text();
        },
        set:function(xml,model,value){
          return $(model).children("metadata").children("dc\\:format").text(value);
        },
        type:"String"
      },
      language:{
        get:function(xml,model){
          return $(model).children("metadata").children("dc\\:language").text();
        },
        set:function(xml,model,value){
          return $(model).children("metadata").children("dc\\:language").text(value);
        },
        type:"String"
      },
      schema:{
        get:function(xml,model){
          return $(model).children("metadata").children("schema").text();
        },
        set:function(xml,model,value){
          return $(model).children("metadata").children("schema").text(value);
        },
        type:"String"
      },
      schemaversion:{
        get:function(xml,model){
          return $(model).children("metadata").children("schemaversion").text();
        },
        set:function(xml,model,value){
          return $(model).children("metadata").children("schemaversion").text(value);
        },
        type:"String"
      },
    }
  },
  view:{

    new:function(xml){
      var views = $(xml).children("model").children("views");
      var viewid = configuration.idgenerator();
      var view = $("<view></view>");
      view.attr("identifier",viewid);
      var label = $("<label></label>");
      label.attr("xml:lang",documentmodengine.usersettings.lang);
      var documentation = $("<documentation></documentation>");
      documentation.attr("xml:lang",documentmodengine.usersettings.lang);
      view.append(label);
      view.append(documentation);
      views.append(view);
      return view[0];
    },
    id:function(view){
      var viewid = $(view).attr("identifier");
      return viewid;
    },
    byid:function(model,viewid){
      return $(model).children('model').children("views").children("view[identifier='"+viewid+"']")[0];
    },
    edges:function(xml,viewid){
      return $(xml).children('model').children("views").children("view[identifier='"+viewid+"']").find("connection");
    },
    nodes:function(xml,viewid){
      return $(xml).children('model').children("views").children("view[identifier='"+viewid+"']").find("node");
    },
    attributes:{
      name:{
        get:function(data){
          return $(data).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
        },
        set:function(data,value){
          return $(data).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text(value);
        },
        type:"String"
      },
    },
    delete:function(view){
      $(view).remove();
    }
  },
  node:{
    delete:function(xml,view,data){
      $(data).remove();
    },
    type:function(xml,data){
      var nodetype = undefined;
      nodetype = $(data).attr("xsi:type")
      return nodetype;
    },
    new:function(xml,type,name,fillcolorr,fillcolorg,fillcolorb,linecolorr,linecolorg,linecolorb,x,y,w,h){
      var element = {};
      //Generate Node and Element Id
      var nodeid = configuration.idgenerator();
      var elementid = configuration.idgenerator();
      var node = $("<node x='0' y='0' w='120' h='55'></node>");
      node.attr("identifier",nodeid);
      node.attr("elementref",elementid);
      var style = $("<style></style>");
      node.append(style);
      var fillColor = $("<fillColor r='201' g='231' b='183' />");
      if(fillcolorr){
          fillColor.attr("r",fillcolorr);
      }
      if(fillcolorg){
          fillColor.attr("g",fillcolorg);
      }
      if(fillcolorb){
          fillColor.attr("b",fillcolorb);
      }
      var lineColor = $("<lineColor r='92' g='92' b='92' />");
      if(linecolorr){
          lineColor.attr("r",linecolorr);
      }
      if(linecolorg){
          lineColor.attr("g",linecolorg);
      }
      if(linecolorb){
          lineColor.attr("b",linecolorb);
      }
      style.append(fillColor);
      style.append(lineColor);
      var element = $("<element></element>");
      element.attr("identifier",elementid);
      element.attr("xsi:type",type);
      var label = $("<label xml\:lang='en'></label>");
      label.text(name);
      element.append(label);
      configuration.modelelement.add(xml,element);
      return node[0];
    },
    id:function(node){
      var nodeid = $(node).attr("identifier");
      return nodeid;
    },
    byid:function(xml,id){
      return $(xml).find("node[identifier='"+id+"']");
    },
    position:function(node){
      var result = {};
      result.x = $(node).attr('x');
      result.y = $(node).attr('y');
      result.width = $(node).attr('w');
      result.height = $(node).attr('h');


      return result;
    },
    modelelement:function(xml,node){
      //Retrieve the elements that is represented by the node
      var eref = $(node).attr("elementref");
      var element_ref = undefined;
      if(eref){
        element_ref = $(xml).children().children("elements").children('element[identifier="'+eref+'"]')[0];
      }
      return element_ref;
    },
    nodeBelongsToGroup:function(data1,data2){
      var actionrequired = $.contains( data2, data1 );
      return actionrequired;
    },
    removeFromGroup:function(xml,data){

      //If current parent is a node, move node one level higher;
      var tagnameofparent = $(data.parentNode).prop("tagName");
      if(data.parentNode.parentNode && tagnameofparent == "node"){
        $(data.parentNode.parentNode).append(data);
      }
    },
    nodeupdates:function(xml,node){
      var updates = [];
      var nodes = $(node).children('node');
      return nodes;
    },
    edgeupdates:function(xml,node){
      var updates = [];
      var edges = [];
      var nodeid = configuration.node.id(node);
      var edges_source = $(xml).find('[source="'+nodeid+'"]');
      for(var i = 0;i< edges_source.size();i++){
        edges.push(edges_source[i]);
      }
      var edges_target = $(xml).find('[target="'+nodeid+'"]');
      for(var i = 0;i< edges_target.size();i++){
        edges.push(edges_target[i]);
      }
      return edges;
    },


    addNodeToGroup:function(xml,data1,data2){
      var actionrequired = !configuration.node.nodeBelongsToGroup(data1,data2);
      if(actionrequired){
          $(data2).append(data1);
          //check for available groups
          var element1 = configuration.node.modelelement(xml,data1);
          var element2 = configuration.node.modelelement(xml,data2);
          var nodetype1 = configuration.modelelement.type(element1);
          var nodetype2 = configuration.modelelement.type(element2);
          //setup first to find as a relation
          var found  = false;
          var relation = undefined;
          var group = undefined;
          var groupid = undefined;
          for(var i in configuration.edges){
            if(!found){
              groupid = i;
              group = configuration.edges[i];
              if(group.allowHierarchiallyGrouping){
                for(var j = 0;j<group.relates.length&&!found;j++){
                  relation = group.relates[j];
                  if(relation.begin == nodetype1 && relation.end == nodetype2){
                    found = true;
                  }
                }
              }
            }


          }
          if(found&&group){
              //we need to create a model-relation for configuration.
              configuration.relation.new(xml,groupid,element2,element1);

          }

      }

    }
  },
  edge:{
    id:function(edge,data){
      var edgeid = $(edge).attr("identifier");
      return edgeid;
    },
    byid:function(xml,id){
      return $(xml).find("connection[identifier='"+id+"']")[0];
    },
    delete:function(xml,view,edge){
      $(edge).remove();
    },
    source:function(xml,edge){
      var srcref_nd = $(edge).attr("source");
      var sourceref_node = $(xml).children().find('node[identifier="'+srcref_nd+'"]')[0];
      return sourceref_node;
    },
    target:function(xml,edge){
      var srcref_nd = $(edge).attr("target");
      var sourceref_node = $(xml).children().find('node[identifier="'+srcref_nd+'"]')[0];
      return sourceref_node;
    },
    relation:function(xml,edge){
      var relref = $(edge).attr("relationshipref");

      if(relref){
        var relationship_ref = $(xml).children().children("relationships").children('relationship[identifier="'+relref+'"]');
        elementref = relationship_ref[0];
      }
      return elementref;
    },
    new:function(xml,type,name,linecolorr,linecolorg,linecolorb){
      //Fetch current selection
      var selected_nodes = documentmodengine.nodeselection().data;
      var source = selected_nodes[0];
      var target = selected_nodes[1];

      //Create Element Data
      var element = {};
      var relations = configuration.edges[type].relates;
      var elementidsource = $(source.element).attr("identifier");
      var nodeidsource = $(source.self).attr("identifier");

      var elementidtarget = $(target.element).attr("identifier");
      var nodeidtarget = $(target.self).attr("identifier");
      element.source = source.element;
      element.target = target.element;
      element.source_node = source.self;
      element.target_node = target.self;

      var relationship = configuration.relation.new(xml,type,source,target)
      var relationsshipid = relationship.attr("identifier");

      var connection = $("<connection></connection>");
      var connectionid = configuration.idgenerator();
      connection.attr("identifier",connectionid);
      connection.attr("relationshipref",relationsshipid);
      connection.attr("source",nodeidsource);
      connection.attr("target",nodeidtarget);
      var style = $("<style/>");
      var lineColor = $("<lineColor r='0' g='0' b='0' />");
      //add rgb by parameters
      if(linecolorr){
        lineColor.attr("r",linecolorr);
      }
      if(linecolorg){
        lineColor.attr("g",linecolorg);
      }
      if(linecolorb){
        lineColor.attr("b",linecolorb);
      }
      style.append(lineColor);
      connection.append(style);
      element.self = connection[0];
      element.element = relationship[0];
      element.id = connectionid;

      return element;
    },
  },
  modelelement:{
    id:function(xml,data){
      var id = $(data).attr("identifier");
      return id;
    },
    type:function(modelelement){
      return $(modelelement).attr("xsi:type");
    },
    delete:function(xml,modelelement){
      $(modelelement).remove();
    },
    used:function(xml,data){
      var elementid = $(data).attr("identifier");
      var refs = $(xml).find("node[elementref='"+elementid+"']");
      if(refs.size()>0){
        return true
      }else{
        return false;
      }
    },
    add:function(xml,modelelement){
      $(documentmodengine.xml).children("model").children("elements").append(modelelement);
    }

  },
  relation:{
    id:function(relation){
      return $(relation).attr("identifier");
    },
    new:function(xml,type,source,target){

      var relationship = configuration.relation.exists(xml,source,target,type);
      if(!relationship){
        var relationsshipid = configuration.idgenerator();
        var relationship = $("<relationship/>");
        relationship.attr("identifier",relationsshipid);
        relationship.attr("xsi:type",type);
        relationship.attr("source",configuration.modelelement.id(xml,source));
        relationship.attr("target",configuration.modelelement.id(xml,target));

        $(xml).children("model").children("relationships").append(relationship);
      }else{
        relationship = $(relationship);
      }
      return relationship;
    },
    exists:function(xml,modelelement1,modelelement2,relationsshiptype){
      var result = $(xml).children("model").children("relationships").children("relationship[xsi\\:type='"+relationsshiptype+"'][source='"+configuration.modelelement.id(xml,modelelement1)+"'][target='"+configuration.modelelement.id(xml,modelelement2)+"']")
      if(result.length>0){
        return result[0]
      }
      return undefined;
    },
    delete:function(xml,data){
      $(data).remove();
    },
    source:function(xml,relation){
      var srcref_el = $(relation).attr("source");
      var sourceref_element = $(xml).children().children("elements").children('element[identifier="'+srcref_el+'"]')[0];
      return sourceref_element;
    },
    target:function(xml,relation){
      var srcref_el = $(relation).attr("target");
      var sourceref_element = $(xml).children().children("elements").children('element[identifier="'+srcref_el+'"]')[0];
      return sourceref_element;
    },
    type:function(relation){return $(relation).attr("xsi:type");},
    used:function(xml,relation){
      var elementid = configuration.relation.id(relation);
      var refs = $(xml).find("connection[relationshipref='"+elementid+"']");
      if(refs.size()>0){
        return true
      }else{
        //Check if a hierarchial reltation exists
        var edgetype = configuration.relation.type(relation);
        edgetype = configuration.edges[edgetype];
        if(edgetype.allowHierarchiallyGrouping){
          var source = configuration.modelelement.id(xml,configuration.relation.source(xml,relation))
          var target = configuration.modelelement.id(xml,configuration.relation.target(xml,relation))
          var sourcenodes = $(xml).find("node[elementref='"+source+"']");
          for(var i = 0; i<sourcenodes.size();i++){
            var relatedtargets = $(sourcenodes[i]).children("node[elementref='"+target+"']");
            if(relatedtargets.size()>0){
              return true;
            }
          }
          return false;
        }else{
          return false;
        }

      }
    },

  },

  nodeupdates:function(node,data){
    //Retrieve all element ids that require an update, after a change
    var updates = [];
    var nodes = $(node).children('node');
    for(var i=0;i<nodes.size();i++){
      var id = nodes.eq(i).attr("identifier");
      updates.push(id);
    }
    return updates;
  },
  edgeupdates:function(node,data){
    var updates = [];
    var nodeid = configuration.node.id(node);
    var edges = $(data).find('[source="'+nodeid+'"]');
    for(var i=0;i<edges.size();i++){
      var id = edges.eq(i).attr("identifier");
      updates.push(id);
    }
    var edges = $(data).find('[target="'+nodeid+'"]');
    for(var i=0;i<edges.size();i++){
      var id = edges.eq(i).attr("identifier");
      updates.push(id);
    }
    return updates;
  },


  nodeadder:function(xml,view,node){
    var element = configuration.node.modelelement(xml,node);

    //$(xml).children("model").children("elements").append(element);
    $(view).append(node);
  },
  updateNodePosition: function(node,x,y){
    $(node.self).attr("x",x);
    $(node.self).attr("y",y);
  },
  addBendPoint:function(edge,x,y){
    $(edge).append("<bendpoint x='"+x+"' y='"+y+"' ></bendpoint>");
  },updateEdgePosition: function(edge,index,x,y){
    $(edge).children("bendpoint").eq(index).attr("x",x)
    $(edge).children("bendpoint").eq(index).attr("y",y);
  },
  deleteEdgeBendpoint: function(edge,index){
    $(edge).children("bendpoint").eq(index).remove();
  },
  edgeadder:function(xml,view,element){
    //$(xml).children("model").children("relationships").append(element.element);
    $(view).append(element.self);
  },
  nodes:{
    undefined:{
      look:
      [{
        type:"polygon",
        points:function(xml,data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
          type:"text",
          innerHtml:function(xml,data){
            var text = $(data.self).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"))},
          x:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(xml,data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        },{
            type:"text",
            innerHtml:function(xml,data){
              var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
              return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"))},
            x:function(xml,data){
              if($(data.self).children("node").size()>0){
                return 6;
              }else{
                return $(data.self).attr('w')/2
              }
            },
            y:function(xml,data){
              if($(data.self).children("node").size()>0){
                return 8;
              }else
                {
                  return $(data.self).attr('h')/2
                }
              },
            "alignment-baseline":"central",
            "text-anchor":function(xml,data){
              if($(data.self).children("node").size()>0){
                return "start";
              }else{
                return "middle";
              }
            }
          }],feel:{
            points:function(xml,data){
              var result = [];
              var x = parseInt(configuration.node.position(data).x);
              var y = parseInt(configuration.node.position(data).y);
              var w = parseInt(configuration.node.position(data).width);
              var h = parseInt(configuration.node.position(data).height);
              var point1 = {};
              var point2 = {};
              var point3 = {};
              var point4 = {};
              point1.x = (x +(w/2));
              point1.y = y;
              point2.x = x;
              point2.y = (y+(h/2));
              point3.x = (x +(w/2));
              point3.y = (y+h);
              point4.x = (x+w);
              point4.y = (y+(h/2));
              result.push(point1);
              result.push(point2);
              result.push(point3);
              result.push(point4);
              return result;
            }
          }},
          group:{

            look:
            [{
              type:"path",
              d:function(xml,data){
                //return "M"+$(data.self).attr("x")+","+$(data.self).attr("y")+" l"+$(data.self).attr("w")+",0 l0,"+$(data.self).attr("h")+" l"+(-$(data.self).attr("w"))+",0 z";
                return "M0,0 l"+$(data.self).attr("w")/2+",0 l0,20 l-"+$(data.self).attr("w")/2+",0 z";
              },
              fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");
                    return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
              stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");
                    return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";},
              "stroke-dasharray":"5,5"
            },{
              type:"path",
              d:function(xml,data){
                //return "M"+$(data.self).attr("x")+","+$(data.self).attr("y")+" l"+$(data.self).attr("w")+",0 l0,"+$(data.self).attr("h")+" l"+(-$(data.self).attr("w"))+",0 z";
                return "M0,20 l"+$(data.self).attr("w")+",0 l0,"+$(data.self).attr("h")+" l"+(-$(data.self).attr("w"))+",0 z";
              },
              fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");
                    return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
              stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");
                    return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";},
              "stroke-dasharray":"5,5"
            },{
                type:"text",
                innerHtml:function(xml,data){
                  var text = $(data).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
                  var ref_x;
                  var width;
                  var ref_y;
                  var height;
                  if($(data).children("node").size()>0){
                    ref_x = 6;
                    ref_y = 12;
                    height = 20;
                  }else
                    {
                      ref_x = $(data.self).attr('w')/2
                      ref_y = $(data.self).attr('h')/2
                      height = $(data.self).attr("h")
                    }
                    width = $(data.self).attr("w")/2
                    return documentmodengine.functions.textDistributionToTSpan(text,width,height,ref_x,ref_y)},
                x:function(xml,data){
                  if($(data).children("node").size()>0){
                    return 6;}else{
                  return $(data.self).attr("w")/2;
                  }
                },
                y:function(xml,data){
                  if($(data).children("node").size()>0){
                    return 8;
                  }else{
                    return $(data.self).attr('h')/2;
                  }
                },
                "alignment-baseline":"central",
                "text-anchor":function(xml,data){
                  if($(data.self).children("node").size()>0){
                    return "start";
                  }else
                    return "middle";
                }
              }],
              feel:{
                points:function(xml,data){
                  var result = [];
                  var x = parseInt(configuration.node.position(data).x);
                  var y = parseInt(configuration.node.position(data).y);
                  var w = parseInt(configuration.node.position(data).width);
                  var h = parseInt(configuration.node.position(data).height);
                  var point1 = {};
                  var point2 = {};
                  var point3 = {};
                  var point4 = {};
                  point1.x = (x +(w/2));
                  point1.y = y;
                  point2.x = x;
                  point2.y = (y+(h/2));
                  point3.x = (x +(w/2));
                  point3.y = (y+h);
                  point4.x = (x+w);
                  point4.y = (y+(h/2));
                  result.push(point1);
                  result.push(point2);
                  result.push(point3);
                  result.push(point4);
                  return result;
                }
              }},
      Principle:{
        new:function(xml){
          return configuration.node.new(xml,"Principle","My Principle",204,204,255,92,92,92);
        },
        attributes:{
          name:{
            get:function(data){
              return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            },
            set:function(data,value){
              return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text(value);
            },
            type:"String"
          },
          "height and width":{
            get:function(data){
              return $(data.self).attr("h")+" "+$(data.self).attr("w");
            },
            set:function(data,value){
              var newvalues = value.split(" ");
              $(data.self).attr("h",newvalues[0]);
              $(data.self).attr("w",newvalues[1]);
            },
            type:"String"
          }

        },
        look:
        [{
          type:"path",
          d:function(xml,data){

            return "M 5,0 l "+($(data.self).attr("w")-5)+",0 l 5,5 l 0,"+($(data.self).attr("h")-5)+" l-5,5 l"+(-$(data.self).attr("w")+5)+",0 l-5,-5 l0,"+(-$(data.self).attr("h")+5)+" z";
          },
          fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");
                return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
          stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");
                return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
        },{
          type:"rect",
          x:function(xml,data){return $(data.self).attr("w")-10},
          y:3.5,
          w:10,
          h:10,
          fill:"none",
          stroke:"black",
          "stroke-width":"0.5"
        },
        {
          type:"text",
          "text":"!",
          x:function(xml,data){return $(data.self).attr("w")-7},
          y:12,
          style:"font-size:10px"
        },
        {
        type:"text",
        innerHtml:function(xml,data){
          var text = $(data).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
          return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"))},
        x:function(xml,data){
          if($(data.self).children("node").size()>0){
            return 6;
          }else{
            return $(data.self).attr('w')/2
          }
        },
        y:function(xml,data){
          if($(data.self).children("node").size()>0){
            return 8;
          }else
            {
              return $(data.self).attr('h')/2
            }
          },
        "alignment-baseline":"central",
        "text-anchor":function(xml,data){
          if($(data.self).children("node").size()>0){
            return "start";
          }else{
            return "middle";
          }
        }
      },{
          type:"text",
          innerHtml:function(xml,data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"))},
          x:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(xml,data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }]},
        Requirement:{
          new:function(xml){
            return configuration.node.new(xml,"Requirement","My Requirement",204,204,255,92,92,92);
          },
          attributes:{
            name:{
              get:function(data){
                return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
              },
              set:function(data,value){
                return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text(value);
              },
              type:"String"
            },
            "height and width":{
              get:function(data){
                return $(data.self).attr("h")+" "+$(data.self).attr("w");
              },
              set:function(data,value){
                var newvalues = value.split(" ");
                $(data.self).attr("h",newvalues[0]);
                $(data.self).attr("w",newvalues[1]);
              },
              type:"String"
            }
          },
          look:
          [{
            type:"path",
            d:function(xml,data){

              return "M 5,0 l "+($(data.self).attr("w")-5)+",0 l 5,5 l 0,"+($(data.self).attr("h")-5)+" l-5,5 l"+(-$(data.self).attr("w")+5)+",0 l-5,-5 l0,"+(-$(data.self).attr("h")+5)+" z";
            },
            fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");
                  return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
            stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");
                  return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
          },{
            type:"path",
            d:function(xml,data){return "M "+(parseFloat($(data.self).attr("w"))-10)+",5 l10,0 l-3,5 l-10,0 l3,-5"},
            fill:"none",
            stroke:"black",
            "stroke-width":"0.5"
          }

      ,{
          type:"text",
          innerHtml:function(xml,data){
            var text = $(data).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"))},
          x:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(xml,data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        },{
            type:"text",
            innerHtml:function(xml,data){
              var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
              return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"))},
            x:function(xml,data){
              if($(data.self).children("node").size()>0){
                return 6;
              }else{
                return $(data.self).attr('w')/2
              }
            },
            y:function(xml,data){
              if($(data.self).children("node").size()>0){
                return 8;
              }else
                {
                  return $(data.self).attr('h')/2
                }
              },
            "alignment-baseline":"central",
            "text-anchor":function(xml,data){
              if($(data.self).children("node").size()>0){
                return "start";
              }else{
                return "middle";
              }
            }
          }]},Goal:{
            new:function(xml){
              return configuration.node.new(xml,"Goal","My Goal",204,204,255,92,92,92);
            },
            attributes:{
              name:{
                get:function(data){
                  return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
                },
                set:function(data,value){
                  return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text(value);
                },
                type:"String"
              },
              "height and width":{
                get:function(data){
                  return $(data.self).attr("h")+" "+$(data.self).attr("w");
                },
                set:function(data,value){
                  var newvalues = value.split(" ");
                  $(data.self).attr("h",newvalues[0]);
                  $(data.self).attr("w",newvalues[1]);
                },
                type:"String"
              }
            },
            look:
            [{
              type:"path",
              d:function(xml,data){

                return "M 5,0 l "+($(data.self).attr("w")-5)+",0 l 5,5 l 0,"+($(data.self).attr("h")-5)+" l-5,5 l"+(-$(data.self).attr("w")+5)+",0 l-5,-5 l0,"+(-$(data.self).attr("h")+5)+" z";
              },
              fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");
                    return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
              stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");
                    return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
            },{
              type:"circle",
              r:2,
              cx:function(xml,data){return $(data.self).attr("w")-10},
              cy:function(xml,data){return 10}
            },{
              type:"circle",
              r:4,
              cx:function(xml,data){return $(data.self).attr("w")-10},
              cy:function(xml,data){return 10},
              fill:"none",
              stroke:"black"
            },{
              type:"circle",
              r:6,
              cx:function(xml,data){return $(data.self).attr("w")-10},
              cy:function(xml,data){return 10},
              fill:"none",
              stroke:"black"
            }

        ,{
            type:"text",
            innerHtml:function(xml,data){
              var text = $(data).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
              return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"))},
            x:function(xml,data){
              if($(data.self).children("node").size()>0){
                return 6;
              }else{
                return $(data.self).attr('w')/2
              }
            },
            y:function(xml,data){
              if($(data.self).children("node").size()>0){
                return 8;
              }else
                {
                  return $(data.self).attr('h')/2
                }
              },
            "alignment-baseline":"central",
            "text-anchor":function(xml,data){
              if($(data.self).children("node").size()>0){
                return "start";
              }else{
                return "middle";
              }
            }
          },{
              type:"text",
              innerHtml:function(xml,data){
                var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
                return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"))},
              x:function(xml,data){
                if($(data.self).children("node").size()>0){
                  return 6;
                }else{
                  return $(data.self).attr('w')/2
                }
              },
              y:function(xml,data){
                if($(data.self).children("node").size()>0){
                  return 8;
                }else
                  {
                    return $(data.self).attr('h')/2
                  }
                },
              "alignment-baseline":"central",
              "text-anchor":function(xml,data){
                if($(data.self).children("node").size()>0){
                  return "start";
                }else{
                  return "middle";
                }
              }
            }],feel:{
              points:function(xml,data){
                var result = [];
                var x = parseInt(configuration.node.position(data).x);
                var y = parseInt(configuration.node.position(data).y);
                var w = parseInt(configuration.node.position(data).width);
                var h = parseInt(configuration.node.position(data).height);
                var point1 = {};
                var point2 = {};
                var point3 = {};
                var point4 = {};
                point1.x = (x +(w/2));
                point1.y = y;
                point2.x = x;
                point2.y = (y+(h/2));
                point3.x = (x +(w/2));
                point3.y = (y+h);
                point4.x = (x+w);
                point4.y = (y+(h/2));
                result.push(point1);
                result.push(point2);
                result.push(point3);
                result.push(point4);
                return result;
              }
            }},
    BusinessObject:{
      new:function(xml){
        return configuration.node.new(xml,"BusinessObject","My Business Object",255,255,181,92,92,92);
      },
      attributes:{
        name:{
          get:function(data){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
          },
          set:function(data,value){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text(value);
          },
          type:"String"
        },
        "height and width":{
          get:function(data){
            return $(data.self).attr("h")+" "+$(data.self).attr("w");
          },
          set:function(data,value){
            var newvalues = value.split(" ");
            $(data.self).attr("h",newvalues[0]);
            $(data.self).attr("w",newvalues[1]);
          },
          type:"String"
        }
      },
      look:
      [{
        type:"polygon",
        points:function(xml,data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"polygon",
        points:function(xml,data){
          return "0,0 0,"+$(data).attr("h")/3+" "+$(data).attr("w")+","+$(data).attr("h")/3+" "+$(data).attr("w")+",0";
        },
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
          type:"text",
          innerHtml:function(xml,data){
            return documentmodengine.functions.textDistributionToTSpan($(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text(),$(data.self).attr("w"),
            $(data.self).attr("h")/3.5);
          },
          "alignment-baseline":"central",
          "text-anchor":"middle",
          x:function(xml,data){
            return $(data.self).attr("w")/2
          },
          y:function(xml,data){
            return configuration.globalCharheight/2+5;
          }

        }
    ],feel:{
      points:function(xml,data){
        var result = [];
        var x = parseInt(configuration.node.position(data).x);
        var y = parseInt(configuration.node.position(data).y);
        var w = parseInt(configuration.node.position(data).width);
        var h = parseInt(configuration.node.position(data).height);
        var point1 = {};
        var point2 = {};
        var point3 = {};
        var point4 = {};
        point1.x = (x +(w/2));
        point1.y = y;
        point2.x = x;
        point2.y = (y+(h/2));
        point3.x = (x +(w/2));
        point3.y = (y+h);
        point4.x = (x+w);
        point4.y = (y+(h/2));
        result.push(point1);
        result.push(point2);
        result.push(point3);
        result.push(point4);
        return result;
      }
    }},BusinessActor:{
      new:function(xml){
        return configuration.node.new(xml,"BusinessActor","My Business Actor",255,255,181,92,92,92);
      },
      attributes:{
        name:{
          get:function(data){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
          },
          set:function(data,value){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text(value);
          },
          type:"String"
        },
        "height and width":{
          get:function(data){
            return "h:"+$(data.self).attr("h")+",w:"+$(data.self).attr("w");
          },
          set:function(data,value){
            var newvalues = value.split(" ");
            var newvalues = value.split(",");
            for(var val in newvalues){
              var vallist = newvalues[val].split(":");
              if(vallist[0]=="h"){
                  $(data.self).attr("h",vallist[1]);
              }else
              if(vallist[0]=="w"){
                  $(data.self).attr("w",vallist[1]);
              }
            }
          },
          type:"String"
        },
        linecolor:{
          get:function(data){
            return "r:"+$(data.self).children("style").children("lineColor").attr("r")+","+
            "g:"+$(data.self).children("style").children("lineColor").attr("g")+","+
            "b:"+$(data.self).children("style").children("lineColor").attr("b")

          },
          set:function(data,value){
            var newvalues = value.split(",");
            for(var val in newvalues){
              var vallist = newvalues[val].split(":");
              if(vallist[0]=="r"){
                  $(data.self).children("style").children("lineColor").attr("r",vallist[1]);
              }else
              if(vallist[0]=="g"){
                  $(data.self).children("style").children("lineColor").attr("g",vallist[1]);
              }else
              if(vallist[0]=="b"){
                  $(data.self).children("style").children("lineColor").attr("b",vallist[1]);
              }
            }
          },
          type:"String"
        },
        fillcolor:{
          get:function(data){
            return "r:"+$(data.self).children("style").children("fillColor").attr("r")+","+
            "g:"+$(data.self).children("style").children("fillColor").attr("g")+","+
            "b:"+$(data.self).children("style").children("fillColor").attr("b")
          },
          set:function(data,value){
            var newvalues = value.split(",");
            for(var val in newvalues){
              var vallist = newvalues[val].split(":");
              if(vallist[0]=="r"){
                  $(data.self).children("style").children("fillColor").attr("r",vallist[1]);
              }else
              if(vallist[0]=="g"){
                  $(data.self).children("style").children("fillColor").attr("g",vallist[1]);
              }else
              if(vallist[0]=="b"){
                  $(data.self).children("style").children("fillColor").attr("b",vallist[1]);
              }
            }
          },
          type:"String"
        }
      },
      look:
      [{
        type:"rect",
        points:function(xml,data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        x:0,
        y:0,
        w:function(xml,data){return $(data.self).attr("w")},
        h:function(xml,data){return $(data.self).attr("h")},
        rx:5,
        ry:5,
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },{
        type:"circle",
        r:4,
        stroke:"black",
        "stroke-width":3,
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        cx:function(xml,data){return $(data.self).attr("w")-10},
        cy:function(xml,data){return 7},
      },{
        type:"line",
        x1:function(xml,data){return $(data.self).attr("w")-10},
        y1:function(xml,data){return 11},
        x2:function(xml,data){return $(data.self).attr("w")-10},
        y2:function(xml,data){return 20},
        stroke:"black",
        "stroke-width":3
      },{
        type:"line",
        x1:function(xml,data){return $(data.self).attr("w")-10},
        y1:function(xml,data){return 20},
        x2:function(xml,data){return $(data.self).attr("w")-14},
        y2:function(xml,data){return 25},
        stroke:"black",
        "stroke-width":3
      },{
        type:"line",
        x1:function(xml,data){return $(data.self).attr("w")-10},
        y1:function(xml,data){return 20},
        x2:function(xml,data){return $(data.self).attr("w")-6},
        y2:function(xml,data){return 25},
        stroke:"black",
        "stroke-width":3
      },{
        type:"line",
        x1:function(xml,data){return $(data.self).attr("w")-14},
        y1:function(xml,data){return 14},
        x2:function(xml,data){return $(data.self).attr("w")-6},
        y2:function(xml,data){return 14},
        stroke:"black",
        "stroke-width":3
      },{
          type:"text",
          innerHtml:function(xml,data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            var x = 0;
            if($(data.self).children("node").size()>0){
              x = 6;
            }else{
              x = $(data.self).attr('w')/2
            }
            var y = 0;
            if($(data.self).children("node").size()>0){
              y = 8;
            }else
              {
                y = $(data.self).attr('h')/2
              }
            var linebyline = $(data.self).children("node").size()>0
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"),linebyline,x,y)},
          x:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(xml,data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
        feel:{
          points:function(xml,data){
            return configuration.nodes[undefined].feel.points(xml,data);
          }
        }
    },BusinessInterface:{
      new:function(xml){
        return configuration.node.new(xml,"BusinessInterface","My Business Interface",255,255,181,92,92,92);
      },
      attributes:{
        name:{
          get:function(data){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
          },
          set:function(data,value){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text(value);
          },
          type:"String"
        },
        "height and width":{
          get:function(data){
            return $(data.self).attr("h")+" "+$(data.self).attr("w");
          },
          set:function(data,value){
            var newvalues = value.split(" ");
            $(data.self).attr("h",newvalues[0]);
            $(data.self).attr("w",newvalues[1]);
          },
          type:"String"
        }
      },
      look:
      [{
        type:"rect",
        points:function(xml,data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        x:0,
        y:0,
        w:function(xml,data){return $(data.self).attr("w")},
        h:function(xml,data){return $(data.self).attr("h")},
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },{
        type:"circle",
        r:4,
        stroke:"black",
        "stroke-width":3,
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        cx:function(xml,data){return $(data.self).attr("w")-10},
        cy:function(xml,data){return 7},
      },{
        type:"line",
        x1:function(xml,data){return $(data.self).attr("w")-14},
        y1:function(xml,data){return 7},
        x2:function(xml,data){return $(data.self).attr("w")-22},
        y2:function(xml,data){return 7},
        stroke:"black",
        "stroke-width":3
      },{
          type:"text",
          innerHtml:function(xml,data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            var x = 0;
            if($(data.self).children("node").size()>0){
              x = 6;
            }else{
              x = $(data.self).attr('w')/2
            }
            var y = 0;
            if($(data.self).children("node").size()>0){
              y = 8;
            }else
              {
                y = $(data.self).attr('h')/2
              }
            var linebyline = $(data.self).children("node").size()>0
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"),linebyline,x,y)},
          x:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(xml,data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
        feel:{
          points:function(xml,data){
            return configuration.nodes[undefined].feel.points(xml,data);
          }
        }
    },InfrastructureInterface:{
      new:function(xml){
        return configuration.node.new(xml,"InfrastructureInterface","My Infrastructure Interface",201,231,183,92,92,92);
      },
      attributes:{
        name:{
          get:function(data){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
          },
          set:function(data,value){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text(value);
          },
          type:"String"
        },
        "height and width":{
          get:function(data){
            return $(data.self).attr("h")+" "+$(data.self).attr("w");
          },
          set:function(data,value){
            var newvalues = value.split(" ");
            $(data.self).attr("h",newvalues[0]);
            $(data.self).attr("w",newvalues[1]);
          },
          type:"String"
        }
      },
      look:
      [{
        type:"rect",
        points:function(xml,data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        x:0,
        y:0,
        w:function(xml,data){return $(data.self).attr("w")},
        h:function(xml,data){return $(data.self).attr("h")},
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },{
        type:"circle",
        r:4,
        stroke:"black",
        "stroke-width":3,
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        cx:function(xml,data){return $(data.self).attr("w")-10},
        cy:function(xml,data){return 7},
      },{
        type:"line",
        x1:function(xml,data){return $(data.self).attr("w")-14},
        y1:function(xml,data){return 7},
        x2:function(xml,data){return $(data.self).attr("w")-22},
        y2:function(xml,data){return 7},
        stroke:"black",
        "stroke-width":3
      },{
          type:"text",
          innerHtml:function(xml,data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            var x = 0;
            if($(data.self).children("node").size()>0){
              x = 6;
            }else{
              x = $(data.self).attr('w')/2
            }
            var y = 0;
            if($(data.self).children("node").size()>0){
              y = 8;
            }else
              {
                y = $(data.self).attr('h')/2
              }
            var linebyline = $(data.self).children("node").size()>0
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"),linebyline,x,y)},
          x:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(xml,data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
        feel:{
          points:function(xml,data){
            return configuration.nodes[undefined].feel.points(xml,data);
          }
        }
    },ApplicationInterface:{
      new:function(xml){
        return configuration.node.new(xml,"ApplicationInterface","My Application Interface",181,255,255,92,92,92);
      },
      attributes:{
        name:{
          get:function(data){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
          },
          set:function(data,value){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text(value);
          },
          type:"String"
        },
        "height and width":{
          get:function(data){
            return $(data.self).attr("h")+" "+$(data.self).attr("w");
          },
          set:function(data,value){
            var newvalues = value.split(" ");
            $(data.self).attr("h",newvalues[0]);
            $(data.self).attr("w",newvalues[1]);
          },
          type:"String"
        }
      },
      look:
      [{
        type:"rect",
        points:function(xml,data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        x:0,
        y:0,
        w:function(xml,data){return $(data.self).attr("w")},
        h:function(xml,data){return $(data.self).attr("h")},
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },{
        type:"circle",
        r:4,
        stroke:"black",
        "stroke-width":3,
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        cx:function(xml,data){return $(data.self).attr("w")-10},
        cy:function(xml,data){return 7},
      },{
        type:"line",
        x1:function(xml,data){return $(data.self).attr("w")-14},
        y1:function(xml,data){return 7},
        x2:function(xml,data){return $(data.self).attr("w")-22},
        y2:function(xml,data){return 7},
        stroke:"black",
        "stroke-width":3
      },{
          type:"text",
          innerHtml:function(xml,data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            var x = 0;
            if($(data.self).children("node").size()>0){
              x = 6;
            }else{
              x = $(data.self).attr('w')/2
            }
            var y = 0;
            if($(data.self).children("node").size()>0){
              y = 8;
            }else
              {
                y = $(data.self).attr('h')/2
              }
            var linebyline = $(data.self).children("node").size()>0
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"),linebyline,x,y)},
          x:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(xml,data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
        feel:{
          points:function(xml,data){
            return configuration.nodes[undefined].feel.points(xml,data);
          }
        }
    },
    BusinessRole:{
      new:function(xml){
        return configuration.node.new(xml,"BusinessRole","My Business Role",255,255,181,92,92,92);
      },
      attributes:{
        name:{
          get:function(data){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
          },
          set:function(data,value){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text(value);
          },
          type:"String"
        },
        "height and width":{
          get:function(data){
            return $(data.self).attr("h")+" "+$(data.self).attr("w");
          },
          set:function(data,value){
            var newvalues = value.split(" ");
            $(data.self).attr("h",newvalues[0]);
            $(data.self).attr("w",newvalues[1]);
          },
          type:"String"
        }
      },
      look:
      [{
        type:"polygon",
        points:function(xml,data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },
      {
        type:"ellipse",
        stroke:"black",
        "stroke-width":1,
        fill:"none",
        cx:function(xml,data){return $(data.self).attr("w")-15},
        cy:function(xml,data){return 7},
        rx:function(xml,data){return 2.5},
        ry:function(xml,data){return 5}
      },{
        type:"rect",
        stroke:"black",
        "stroke-width":1,
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        x:function(xml,data){return $(data.self).attr("w")-15},
        y:function(xml,data){return 2},
        w:function(xml,data){return 10},
        h:function(xml,data){return 10}
      },{
        type:"rect",
        stroke:"none",
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        x:function(xml,data){return $(data.self).attr("w")-15.5},
        y:function(xml,data){return 2},
        w:function(xml,data){return 12},
        h:function(xml,data){return 10}
      },{
        type:"ellipse",
        stroke:"black",
        "stroke-width":1,
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        cx:function(xml,data){return $(data.self).attr("w")-5},
        cy:function(xml,data){return 7},
        rx:function(xml,data){return 2.5},
        ry:function(xml,data){return 5}
      },{
          type:"text",
          innerHtml:function(xml,data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            var x = 0;
            if($(data.self).children("node").size()>0){
              x = 6;
            }else{
              x = $(data.self).attr('w')/2
            }
            var y = 0;
            if($(data.self).children("node").size()>0){
              y = 8;
            }else
              {
                y = $(data.self).attr('h')/2
              }
            var linebyline = $(data.self).children("node").size()>0
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"),linebyline,x,y)},
          x:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(xml,data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
        feel:{
          points:function(xml,data){
            return configuration.nodes[undefined].feel.points(xml,data);
          }
        }
    },BusinessInteraction:{
      new:function(xml){
        return configuration.node.new(xml,"BusinessInteraction","My Business Interaction",255,255,181,92,92,92);
      },
      attributes:{
        name:{
          get:function(data){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
          },
          set:function(data,value){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text(value);
          },
          type:"String"
        },
        "height and width":{
          get:function(data){
            return $(data.self).attr("h")+" "+$(data.self).attr("w");
          },
          set:function(data,value){
            var newvalues = value.split(" ");
            $(data.self).attr("h",newvalues[0]);
            $(data.self).attr("w",newvalues[1]);
          },
          type:"String"
        }
      },
      look:
      [{
        type:"rect",
        points:function(xml,data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        x:0,
        y:0,
        w:function(xml,data){return $(data.self).attr("w")},
        h:function(xml,data){return $(data.self).attr("h")},
        rx:5,
        ry:5,
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },
      {
        type:"circle",
        stroke:"black",
        "stroke-width":3,
        fill:"none",
        cx:function(xml,data){return $(data.self).attr("w")-7},
        cy:function(xml,data){return 7},
        r:function(xml,data){return 5},
      },{
        type:"rect",
        stroke:"black",
        "stroke-width":1,
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        x:function(xml,data){return $(data.self).attr("w")-11.5},
        y:function(xml,data){return 2},
        w:function(xml,data){return 3},
        h:function(xml,data){return 10}
      },{
        type:"circle",
        stroke:"black",
        "stroke-width":3,
        fill:"none",
        cx:function(xml,data){return $(data.self).attr("w")-13},
        cy:function(xml,data){return 7},
        r:function(xml,data){return 5},
      },{
        type:"rect",
        stroke:"none",
        "stroke-width":1,
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        x:function(xml,data){return $(data.self).attr("w")-11.5},
        y:function(xml,data){return 1},
        w:function(xml,data){return 3},
        h:function(xml,data){return 12}
      },{
          type:"text",
          innerHtml:function(xml,data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            var x = 0;
            if($(data.self).children("node").size()>0){
              x = 6;
            }else{
              x = $(data.self).attr('w')/2
            }
            var y = 0;
            if($(data.self).children("node").size()>0){
              y = 8;
            }else
              {
                y = $(data.self).attr('h')/2
              }
            var linebyline = $(data.self).children("node").size()>0
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"),linebyline,x,y)},
          x:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(xml,data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
        feel:{
          points:function(xml,data){
            return configuration.nodes[undefined].feel.points(xml,data);
          }
        }
    },BusinessCollaboration:{
      new:function(xml){
        return configuration.node.new(xml,"BusinessCollaboration","My Business Collaboration",255,255,181,92,92,92);
      },
      attributes:{
        name:{
          get:function(data){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
          },
          set:function(data,value){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text(value);
          },
          type:"String"
        },
        "height and width":{
          get:function(data){
            return $(data.self).attr("h")+" "+$(data.self).attr("w");
          },
          set:function(data,value){
            var newvalues = value.split(" ");
            $(data.self).attr("h",newvalues[0]);
            $(data.self).attr("w",newvalues[1]);
          },
          type:"String"
        }
      },
      look:
      [{
        type:"polygon",
        points:function(xml,data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },
      {
        type:"circle",
        stroke:"black",
        "stroke-width":3,
        fill:"none",
        cx:function(xml,data){return $(data.self).attr("w")-7},
        cy:function(xml,data){return 7},
        r:function(xml,data){return 5},
      },{
        type:"circle",
        stroke:"black",
        "stroke-width":3,
        fill:"none",
        cx:function(xml,data){return $(data.self).attr("w")-13},
        cy:function(xml,data){return 7},
        r:function(xml,data){return 5},
      },{
          type:"text",
          innerHtml:function(xml,data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            var x = 0;
            if($(data.self).children("node").size()>0){
              x = 6;
            }else{
              x = $(data.self).attr('w')/2
            }
            var y = 0;
            if($(data.self).children("node").size()>0){
              y = 8;
            }else
              {
                y = $(data.self).attr('h')/2
              }
            var linebyline = $(data.self).children("node").size()>0
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"),linebyline,x,y)},
          x:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(xml,data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
        feel:{
          points:function(xml,data){
            return configuration.nodes[undefined].feel.points(xml,data);
          }
        }
    },ApplicationCollaboration:{
      new:function(xml){
        return configuration.node.new(xml,"ApplicationCollaboration","My Application Collaboration",181,255,255,92,92,92);
      },
      attributes:{
        name:{
          get:function(data){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
          },
          set:function(data,value){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text(value);
          },
          type:"String"
        },
        "height and width":{
          get:function(data){
            return $(data.self).attr("h")+" "+$(data.self).attr("w");
          },
          set:function(data,value){
            var newvalues = value.split(" ");
            $(data.self).attr("h",newvalues[0]);
            $(data.self).attr("w",newvalues[1]);
          },
          type:"String"
        }
      },
      look:
      [{
        type:"polygon",
        points:function(xml,data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },
      {
        type:"circle",
        stroke:"black",
        "stroke-width":3,
        fill:"none",
        cx:function(xml,data){return $(data.self).attr("w")-7},
        cy:function(xml,data){return 7},
        r:function(xml,data){return 5},
      },{
        type:"circle",
        stroke:"black",
        "stroke-width":3,
        fill:"none",
        cx:function(xml,data){return $(data.self).attr("w")-13},
        cy:function(xml,data){return 7},
        r:function(xml,data){return 5},
      },{
          type:"text",
          innerHtml:function(xml,data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            var x = 0;
            if($(data.self).children("node").size()>0){
              x = 6;
            }else{
              x = $(data.self).attr('w')/2
            }
            var y = 0;
            if($(data.self).children("node").size()>0){
              y = 8;
            }else
              {
                y = $(data.self).attr('h')/2
              }
            var linebyline = $(data.self).children("node").size()>0
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"),linebyline,x,y)},
          x:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(xml,data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
        feel:{
          points:function(xml,data){
            return configuration.nodes[undefined].feel.points(xml,data);
          }
        }
    },ApplicationInteraction:{
      new:function(xml){
        return configuration.node.new(xml,"ApplicationInteraction","My Application Interaction",181,255,255,92,92,92);
      },
      attributes:{
        name:{
          get:function(data){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
          },
          set:function(data,value){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text(value);
          },
          type:"String"
        },
        "height and width":{
          get:function(data){
            return $(data.self).attr("h")+" "+$(data.self).attr("w");
          },
          set:function(data,value){
            var newvalues = value.split(" ");
            $(data.self).attr("h",newvalues[0]);
            $(data.self).attr("w",newvalues[1]);
          },
          type:"String"
        }
      },
      look:
      [{
        type:"polygon",
        points:function(xml,data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}

      },
      {
        type:"circle",
        stroke:"black",
        "stroke-width":3,
        fill:"none",
        cx:function(xml,data){return $(data.self).attr("w")-7},
        cy:function(xml,data){return 7},
        r:function(xml,data){return 5},
      },{
        type:"rect",
        stroke:"black",
        "stroke-width":1,
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        x:function(xml,data){return $(data.self).attr("w")-11.5},
        y:function(xml,data){return 2},
        w:function(xml,data){return 3},
        h:function(xml,data){return 10}
      },{
        type:"circle",
        stroke:"black",
        "stroke-width":3,
        fill:"none",
        cx:function(xml,data){return $(data.self).attr("w")-13},
        cy:function(xml,data){return 7},
        r:function(xml,data){return 5},
      },{
        type:"rect",
        stroke:"none",
        "stroke-width":3,
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        x:function(xml,data){return $(data.self).attr("w")-11.5},
        y:function(xml,data){return 1},
        w:function(xml,data){return 3},
        h:function(xml,data){return 12}
      },{
          type:"text",
          innerHtml:function(xml,data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            var x = 0;
            if($(data.self).children("node").size()>0){
              x = 6;
            }else{
              x = $(data.self).attr('w')/2
            }
            var y = 0;
            if($(data.self).children("node").size()>0){
              y = 8;
            }else
              {
                y = $(data.self).attr('h')/2
              }
            var linebyline = $(data.self).children("node").size()>0
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"),linebyline,x,y)},
          x:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(xml,data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
        feel:{
          points:function(xml,data){
            return configuration.nodes[undefined].feel.points(xml,data);
          }
        }
    },BusinessService:{
      new:function(xml){
        return configuration.node.new(xml,"BusinessService","My Business Service",255,255,181,92,92,92);
      },
      attributes:{
        name:{
          get:function(data){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
          },
          set:function(data,value){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text(value);
          },
          type:"String"
        },
        "height and width":{
          get:function(data){
            return $(data.self).attr("h")+" "+$(data.self).attr("w");
          },
          set:function(data,value){
            var newvalues = value.split(" ");
            $(data.self).attr("h",newvalues[0]);
            $(data.self).attr("w",newvalues[1]);
          },
          type:"String"
        }
      },
      look:
      [{
        type:"rect",
        points:function(xml,data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        x:0,
        y:0,
        w:function(xml,data){return $(data.self).attr("w")},
        h:function(xml,data){return $(data.self).attr("h")},
        rx:5,
        ry:5,
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },
      {
        type:"path",
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:"none",
        d:function(xml,data){return "M "+($(data.self).attr("w")-17)+","+(13)+" c -5,0 -5,-10 0,-10 l 10 0 c +5,0 +5,+10 0,+10 z"}
      },{
          type:"text",
          innerHtml:function(xml,data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            var x = 0;
            if($(data.self).children("node").size()>0){
              x = 6;
            }else{
              x = $(data.self).attr('w')/2
            }
            var y = 0;
            if($(data.self).children("node").size()>0){
              y = 8;
            }else
              {
                y = $(data.self).attr('h')/2
              }
            var linebyline = $(data.self).children("node").size()>0
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"),linebyline,x,y)},
          x:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(xml,data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
        feel:{
          points:function(xml,data){
            return configuration.nodes[undefined].feel.points(xml,data);
          }
        }
    },InfrastructureService:{
      new:function(xml){
        return configuration.node.new(xml,"InfrastructureService","My Infrastructure Service",201,231,183,92,92,92);
      },
      attributes:{
        name:{
          get:function(data){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
          },
          set:function(data,value){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text(value);
          },
          type:"String"
        },
        "height and width":{
          get:function(data){
            return $(data.self).attr("h")+" "+$(data.self).attr("w");
          },
          set:function(data,value){
            var newvalues = value.split(" ");
            $(data.self).attr("h",newvalues[0]);
            $(data.self).attr("w",newvalues[1]);
          },
          type:"String"
        }
      },
      look:
      [{
        type:"rect",
        points:function(xml,data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        x:0,
        y:0,
        w:function(xml,data){return $(data.self).attr("w")},
        h:function(xml,data){return $(data.self).attr("h")},
        rx:5,
        ry:5,
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },
      {
        type:"path",
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:"none",
        d:function(xml,data){return "M "+($(data.self).attr("w")-17)+","+(13)+" c -5,0 -5,-10 0,-10 l 10 0 c +5,0 +5,+10 0,+10 z"}
      },{
          type:"text",
          innerHtml:function(xml,data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            var x = 0;
            if($(data.self).children("node").size()>0){
              x = 6;
            }else{
              x = $(data.self).attr('w')/2
            }
            var y = 0;
            if($(data.self).children("node").size()>0){
              y = 8;
            }else
              {
                y = $(data.self).attr('h')/2
              }
            var linebyline = $(data.self).children("node").size()>0
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"),linebyline,x,y)},
          x:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(xml,data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
        feel:{
          points:function(xml,data){
            return configuration.nodes[undefined].feel.points(xml,data);
          }
        }
    },ApplicationService:{
      new:function(xml){
        return configuration.node.new(xml,"ApplicationService","My Application Service",181,255,255,92,92,92);
      },
      attributes:{
        name:{
          get:function(data){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
          },
          set:function(data,value){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text(value);
          },
          type:"String"
        },
        "height and width":{
          get:function(data){
            return $(data.self).attr("h")+" "+$(data.self).attr("w");
          },
          set:function(data,value){
            var newvalues = value.split(" ");
            $(data.self).attr("h",newvalues[0]);
            $(data.self).attr("w",newvalues[1]);
          },
          type:"String"
        }
      },
      look:
      [{
        type:"rect",
        points:function(xml,data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        x:0,
        y:0,
        w:function(xml,data){return $(data.self).attr("w")},
        h:function(xml,data){return $(data.self).attr("h")},
        rx:5,
        ry:5,
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },
      {
        type:"path",
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:"none",
        d:function(xml,data){return "M "+($(data.self).attr("w")-17)+","+(13)+" c -5,0 -5,-10 0,-10 l 10 0 c +5,0 +5,+10 0,+10 z"}
      },{
          type:"text",
          innerHtml:function(xml,data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            var x = 0;
            if($(data.self).children("node").size()>0){
              x = 6;
            }else{
              x = $(data.self).attr('w')/2
            }
            var y = 0;
            if($(data.self).children("node").size()>0){
              y = 8;
            }else
              {
                y = $(data.self).attr('h')/2
              }
            var linebyline = $(data.self).children("node").size()>0
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"),linebyline,x,y)},
          x:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(xml,data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
        feel:{
          points:function(xml,data){
            return configuration.nodes[undefined].feel.points(xml,data);
          }
        }
    },
    Value:{
      new:function(xml){
        return configuration.node.new(xml,"Value","My Value",255,255,181,92,92,92);
      },
      attributes:{
        name:{
          get:function(data){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
          },
          set:function(data,value){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text(value);
          },
          type:"String"
        },
        "height and width":{
          get:function(data){
            return $(data.self).attr("h")+" "+$(data.self).attr("w");
          },
          set:function(data,value){
            var newvalues = value.split(" ");
            $(data.self).attr("h",newvalues[0]);
            $(data.self).attr("w",newvalues[1]);
          },
          type:"String"
        }
      },

      look:[{
        type:"ellipse",
        cx:function(xml,data){return $(data.self).attr("w")/2},
        cy:function(xml,data){return $(data.self).attr("h")/2},
        ry:function(xml,data){return $(data.self).attr("h")/2},
        rx:function(xml,data){return $(data.self).attr("w")/2},
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },{
          type:"text",
          innerHtml:function(xml,data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            var x = 0;
            if($(data.self).children("node").size()>0){
              x = 6;
            }else{
              x = $(data.self).attr('w')/2
            }
            var y = 0;
            if($(data.self).children("node").size()>0){
              y = 8;
            }else
              {
                y = $(data.self).attr('h')/2
              }
            var linebyline = $(data.self).children("node").size()>0
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"),linebyline,x,y)},
          x:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(xml,data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
        feel:{
          points:function(xml,data){
            var result = [];
            var x = parseInt(configuration.node.position(data).x);
            var y = parseInt(configuration.node.position(data).y);
            var w = parseInt(configuration.node.position(data).width);
            var h = parseInt(configuration.node.position(data).height);
            var point1 = {};
            var point2 = {};
            var point3 = {};
            var point4 = {};
            point1.x = (x +(w/2));
            point1.y = y;
            point2.x = x;
            point2.y = (y+(h/2));
            point3.x = (x +(w/2));
            point3.y = (y+h);
            point4.x = (x+w);
            point4.y = (y+(h/2));
            result.push(point1);
            result.push(point2);
            result.push(point3);
            result.push(point4);
            return result;
          }
        }
    },Contract:{
      new:function(xml){
        return configuration.node.new(xml,"Contract","My Contract",255,255,181,92,92,92);
      },
      attributes:{
        name:{
          get:function(data){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
          },
          set:function(data,value){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text(value);
          },
          type:"String"
        },
        "height and width":{
          get:function(data){
            return $(data.self).attr("h")+" "+$(data.self).attr("w");
          },
          set:function(data,value){
            var newvalues = value.split(" ");
            $(data.self).attr("h",newvalues[0]);
            $(data.self).attr("w",newvalues[1]);
          },
          type:"String"
        }
      },
      look:
      [{
        type:"polygon",
        points:function(xml,data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"polygon",
        points:function(xml,data){
          return "0,0 0,"+$(data).attr("h")/3+" "+$(data).attr("w")+","+$(data).attr("h")/3+" "+$(data).attr("w")+",0";
        },
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
          type:"text",
          text:function(xml,data){return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text()},
          "alignment-baseline":"central",
          "text-anchor":"middle",
          x:function(xml,data){
            return $(data.self).attr("w")/2
          },
          y:function(xml,data){
            return configuration.globalCharheight/2+5;
          }

        }
    ],feel:{
      points:function(xml,data){
        return configuration.nodes[undefined].feel.points(xml,data);
      }
    }},
    DataObject:{
      new:function(xml){
        return configuration.node.new(xml,"DataObject","My Data Object",181,255,255,92,92,92);
      },
      attributes:{
        name:{
          get:function(data){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
          },
          set:function(data,value){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text(value);
          },
          type:"String"
        },
        "height and width":{
          get:function(data){
            return $(data.self).attr("h")+" "+$(data.self).attr("w");
          },
          set:function(data,value){
            var newvalues = value.split(" ");
            $(data.self).attr("h",newvalues[0]);
            $(data.self).attr("w",newvalues[1]);
          },
          type:"String"
        }
      },
      look:
      [{
        type:"polygon",
        points:function(xml,data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"polygon",
        points:function(xml,data){
          return "0,0 0,"+$(data).attr("h")/3+" "+$(data).attr("w")+","+$(data).attr("h")/3+" "+$(data).attr("w")+",0";
        },
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
          type:"text",
          innerHtml:function(xml,data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            var x = 0;
            if($(data.self).children("node").size()>0){
              x = 6;
            }else{
              x = $(data.self).attr('w')/2
            }
            var y = 0;
            if($(data.self).children("node").size()>0){
              y = 8;
            }else
              {
                y = $(data.self).attr('h')/2
              }
            var linebyline = $(data.self).children("node").size()>0
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"),linebyline,x,y)},
          "alignment-baseline":"central",
          "text-anchor":"middle",
          x:function(xml,data){
            return $(data.self).attr("w")/2
          },
          y:function(xml,data){
            return configuration.globalCharheight/2+5;
          }

        }
    ],feel:{
      points:function(xml,data){
        return configuration.nodes[undefined].feel.points(xml,data);
      }
    }},Artifact:{
      new:function(xml){
        return configuration.node.new(xml,"Artifact","My Artifact",201,231,183,92,92,92);
      },
      attributes:{
        name:{
          get:function(data){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
          },
          set:function(data,value){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text(value);
          },
          type:"String"
        },
        "height and width":{
          get:function(data){
            return $(data.self).attr("h")+" "+$(data.self).attr("w");
          },
          set:function(data,value){
            var newvalues = value.split(" ");
            $(data.self).attr("h",newvalues[0]);
            $(data.self).attr("w",newvalues[1]);
          },
          type:"String"
        }
      },
      look:
      [{
        type:"polygon",
        points:function(xml,data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"path",
        d:function(xml,data){

          return "M"+($(data.self).attr("w")-15)+" "+5+" l5 0 l5 5 l-5 0 l0 -5 m5 5 l0 10 l-10 0 l0 -15";
        },

        style:"stroke: black; fill:none;",
        fill:"none",
        stroke:"black"

      },{
            type:"text",
            innerHtml:function(xml,data){
              var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
              var x = 0;
              if($(data.self).children("node").size()>0){
                x = 6;
              }else{
                x = $(data.self).attr('w')/2
              }
              var y = 0;
              if($(data.self).children("node").size()>0){
                y = 8;
              }else
                {
                  y = $(data.self).attr('h')/2
                }
              var linebyline = $(data.self).children("node").size()>0
              return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"),linebyline,x,y)},
            x:function(xml,data){
              if($(data.self).children("node").size()>0){
                return 6;
              }else{
                return $(data.self).attr('w')/2
              }
            },
            y:function(xml,data){
              if($(data.self).children("node").size()>0){
                return 8;
              }else
                {
                  return $(data.self).attr('h')/2
                }
              },
            "alignment-baseline":"central",
            "text-anchor":function(xml,data){
              if($(data.self).children("node").size()>0){
                return "start";
              }else{
                return "middle";
              }
            }
          }
    ],feel:{
      points:function(xml,data){
        return configuration.nodes[undefined].feel.points(xml,data);
      }
    }},ApplicationFunction:{
      new:function(xml){
        return configuration.node.new(xml,"ApplicationFunction","My Application Function",181,255,255,92,92,92);
      },
      attributes:{
        name:{
          get:function(data){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
          },
          set:function(data,value){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text(value);
          },
          type:"String"
        },
        "height and width":{
          get:function(data){
            return $(data.self).attr("h")+" "+$(data.self).attr("w");
          },
          set:function(data,value){
            var newvalues = value.split(" ");
            $(data.self).attr("h",newvalues[0]);
            $(data.self).attr("w",newvalues[1]);
          },
          type:"String"
        }
      },
      look:
      [{
        type:"polygon",
        points:function(xml,data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"path",
        d:function(xml,data){

          return "M"+($(data.self).attr("w")-15)+" "+5+" l5 -2 l5 2 l0 7 l-5 -2 l-5 2 z";
        },

        style:"stroke: black; fill:none;",
        fill:"none",
        stroke:"black"

      },{
          type:"text",
          innerHtml:function(xml,data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            var x = 0;
            if($(data.self).children("node").size()>0){
              x = 6;
            }else{
              x = $(data.self).attr('w')/2
            }
            var y = 0;
            if($(data.self).children("node").size()>0){
              y = 8;
            }else
              {
                y = $(data.self).attr('h')/2
              }
            var linebyline = $(data.self).children("node").size()>0
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"),linebyline,x,y)},
          x:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(xml,data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }
    ],feel:{
      points:function(xml,data){
        return configuration.nodes[undefined].feel.points(xml,data);
      }
    }},InfrastructureFunction:{
      new:function(xml){
        return configuration.node.new(xml,"InfrastructureFunction","My Infrastructure Function",201,231,183,92,92,92);
      },
      attributes:{
        name:{
          get:function(data){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
          },
          set:function(data,value){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text(value);
          },
          type:"String"
        },
        "height and width":{
          get:function(data){
            return $(data.self).attr("h")+" "+$(data.self).attr("w");
          },
          set:function(data,value){
            var newvalues = value.split(" ");
            $(data.self).attr("h",newvalues[0]);
            $(data.self).attr("w",newvalues[1]);
          },
          type:"String"
        }
      },
      look:
      [{
        type:"polygon",
        points:function(xml,data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"path",
        d:function(xml,data){

          return "M"+($(data.self).attr("w")-15)+" "+5+" l5 -2 l5 2 l0 7 l-5 -2 l-5 2 z";
        },

        style:"stroke: black; fill:none;",
        fill:"none",
        stroke:"black"

      },{
          type:"text",
          innerHtml:function(xml,data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            var x = 0;
            if($(data.self).children("node").size()>0){
              x = 6;
            }else{
              x = $(data.self).attr('w')/2
            }
            var y = 0;
            if($(data.self).children("node").size()>0){
              y = 8;
            }else
              {
                y = $(data.self).attr('h')/2
              }
            var linebyline = $(data.self).children("node").size()>0
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"),linebyline,x,y)},
          x:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(xml,data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }
    ],feel:{
      points:function(xml,data){
        return configuration.nodes[undefined].feel.points(xml,data);
      }
    }},
    ApplicationComponent:{
      new:function(xml){
        return configuration.node.new(xml,"ApplicationComponent","My Application Component",181,255,255,92,92,92);
      },
      attributes:{
        name:{
          get:function(data){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
          },
          set:function(data,value){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text(value);
          },
          type:"String"
        },
        "height and width":{
          get:function(data){
            return $(data.self).attr("h")+" "+$(data.self).attr("w");
          },
          set:function(data,value){
            var newvalues = value.split(" ");
            $(data.self).attr("h",newvalues[0]);
            $(data.self).attr("w",newvalues[1]);
          },
          type:"String"
        }
      },
      look:
      [{
        type:"polygon",
        points:function(xml,data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"rect",
        x:function(xml,data){return $(data.self).attr("w")-21+3},
        y:0+3,
        w:15,
        h:15,
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },{
        type:"rect",
        x:function(xml,data){return $(data.self).attr("w")-21},
        y:3+3,
        w:7,
        h:3,
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },{
        type:"rect",
        x:function(xml,data){return $(data.self).attr("w")-21},
        y:9+3,
        w:7,
        h:3,
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },{
          type:"text",
          innerHtml:function(xml,data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            var x = 0;
            if($(data.self).children("node").size()>0){
              x = 6;
            }else{
              x = $(data.self).attr('w')/2
            }
            var y = 0;
            if($(data.self).children("node").size()>0){
              y = 8;
            }else
              {
                y = $(data.self).attr('h')/2
              }
            var linebyline = $(data.self).children("node").size()>0
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"),linebyline,x,y)},
          x:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(xml,data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }
    ],feel:{
      points:function(xml,data){
        return configuration.nodes[undefined].feel.points(xml,data);
      }
    }},Node:{
      new:function(xml){
        return configuration.node.new(xml,"Node","My Node",201,231,183,92,92,92);
      },
      attributes:{
        name:{
          get:function(data){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
          },
          set:function(data,value){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text(value);
          },
          type:"String"
        },
        "height and width":{
          get:function(data){
            return $(data.self).attr("h")+" "+$(data.self).attr("w");
          },
          set:function(data,value){
            var newvalues = value.split(" ");
            $(data.self).attr("h",newvalues[0]);
            $(data.self).attr("w",newvalues[1]);
          },
          type:"String"
        }
      },
      look:
      [{
        type:"polygon",
        points:function(xml,data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"rect",
        x:function(xml,data){return $(data.self).attr("w")-21-3},
        y:0+3+5,
        w:15,
        h:10,
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },{
        type:"path",
        d:function(xml,data){return "M"+($(data.self).attr("w")-21-3)+",8 l5,-3 l15,0 l-5,3 m5,-3 l0,10 l-5,3"},
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },{
          type:"text",
          innerHtml:function(xml,data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            var x = 0;
            if($(data.self).children("node").size()>0){
              x = 6;
            }else{
              x = $(data.self).attr('w')/2
            }
            var y = 0;
            if($(data.self).children("node").size()>0){
              y = 8;
            }else
              {
                y = $(data.self).attr('h')/2
              }
            var linebyline = $(data.self).children("node").size()>0
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"),linebyline,x,y)},
          x:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 12;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(xml,data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }
    ],feel:{
      points:function(xml,data){
        return configuration.nodes[undefined].feel.points(xml,data);
      }
    }},Device:{
      new:function(xml){
        return configuration.node.new(xml,"Device","My Device",201,231,183,92,92,92);
      },
      attributes:{
        name:{
          get:function(data){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
          },
          set:function(data,value){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text(value);
          },
          type:"String"
        },
        "height and width":{
          get:function(data){
            return $(data.self).attr("h")+" "+$(data.self).attr("w");
          },
          set:function(data,value){
            var newvalues = value.split(" ");
            $(data.self).attr("h",newvalues[0]);
            $(data.self).attr("w",newvalues[1]);
          },
          type:"String"
        }
      },
      look:
      [{
        type:"polygon",
        points:function(xml,data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"rect",
        x:function(xml,data){return $(data.self).attr("w")-15},
        y:0+3,
        w:10,
        h:5,
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },{
        type:"path",
        d:function(xml,data){return "M"+($(data.self).attr("w")-15+2)+",8 l-2,2 l10,0 l-2,-2"},
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },{
          type:"text",
          innerHtml:function(xml,data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            var x = 0;
            if($(data.self).children("node").size()>0){
              x = 6;
            }else{
              x = $(data.self).attr('w')/2
            }
            var y = 0;
            if($(data.self).children("node").size()>0){
              y = 8;
            }else
              {
                y = $(data.self).attr('h')/2
              }
            var linebyline = $(data.self).children("node").size()>0
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"),linebyline,x,y)},
          x:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(xml,data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }
    ],feel:{
      points:function(xml,data){
        return configuration.nodes[undefined].feel.points(xml,data);
      }
    }},SystemSoftware:{
      new:function(xml){
        return configuration.node.new(xml,"SystemSoftware","My System Software",201,231,183,92,92,92);
      },
      attributes:{
        name:{
          get:function(data){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
          },
          set:function(data,value){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text(value);
          },
          type:"String"
        },
        "height and width":{
          get:function(data){
            return $(data.self).attr("h")+" "+$(data.self).attr("w");
          },
          set:function(data,value){
            var newvalues = value.split(" ");
            $(data.self).attr("h",newvalues[0]);
            $(data.self).attr("w",newvalues[1]);
          },
          type:"String"
        }
      },
      look:
      [{
        type:"polygon",
        points:function(xml,data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"circle",
        r:4,
        cx:function(xml,data){return $(data.self).attr("w")-9},
        cy:function(xml,data){return 9},
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"circle",
        r:4,
        cx:function(xml,data){return $(data.self).attr("w")-10},
        cy:function(xml,data){return 10},
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
          type:"text",
          innerHtml:function(xml,data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            var x = 0;
            if($(data.self).children("node").size()>0){
              x = 6;
            }else{
              x = $(data.self).attr('w')/2
            }
            var y = 0;
            if($(data.self).children("node").size()>0){
              y = 8;
            }else
              {
                y = $(data.self).attr('h')/2
              }
            var linebyline = $(data.self).children("node").size()>0
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"),linebyline,x,y)},
          x:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(xml,data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }
    ],feel:{
      points:function(xml,data){
        return configuration.nodes[undefined].feel.points(xml,data);
      }
    }},Network:{
      new:function(xml){
        return configuration.node.new(xml,"Network","My Network",201,231,183,92,92,92);
      },
      attributes:{
        name:{
          get:function(data){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
          },
          set:function(data,value){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text(value);
          },
          type:"String"
        },
        "height and width":{
          get:function(data){
            return $(data.self).attr("h")+" "+$(data.self).attr("w");
          },
          set:function(data,value){
            var newvalues = value.split(" ");
            $(data.self).attr("h",newvalues[0]);
            $(data.self).attr("w",newvalues[1]);
          },
          type:"String"
        }
      },
      look:
      [{
        type:"polygon",
        points:function(xml,data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"polygon",
        points:function(xml,data){
          return ($(data).attr("w")-10)+",5 "+($(data).attr("w")-12)+",10 "+($(data).attr("w")-6)+",10 "+($(data).attr("w")-4)+",5 ";
        },
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"circle",
        r:1,
        cx:function(xml,data){return $(data.self).attr("w")-10},
        cy:function(xml,data){return 5},
        fill:"black",
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"circle",
        r:1,
        cx:function(xml,data){return $(data.self).attr("w")-12},
        cy:function(xml,data){return 10},
        fill:"black",
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"circle",
        r:1,
        cx:function(xml,data){return $(data.self).attr("w")-4},
        cy:function(xml,data){return 5},
        fill:"black",
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"circle",
        r:1,
        cx:function(xml,data){return $(data.self).attr("w")-6},
        cy:function(xml,data){return 10},
        fill:"black",
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
          type:"text",
          innerHtml:function(xml,data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            var x = 0;
            if($(data.self).children("node").size()>0){
              x = 6;
            }else{
              x = $(data.self).attr('w')/2
            }
            var y = 0;
            if($(data.self).children("node").size()>0){
              y = 8;
            }else
              {
                y = $(data.self).attr('h')/2
              }
            var linebyline = $(data.self).children("node").size()>0
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"),linebyline,x,y)},
          x:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(xml,data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }
    ],feel:{
      points:function(xml,data){
        return configuration.nodes[undefined].feel.points(xml,data);
      }
    }},BusinessFunction:{
      new:function(xml){
        return configuration.node.new(xml,"BusinessFunction","My Business Function",255,255,181,92,92,92);
      },
      attributes:{
        name:{
          get:function(data){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
          },
          set:function(data,value){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text(value);
          },
          type:"String"
        },
        "height and width":{
          get:function(data){
            return $(data.self).attr("h")+" "+$(data.self).attr("w");
          },
          set:function(data,value){
            var newvalues = value.split(" ");
            $(data.self).attr("h",newvalues[0]);
            $(data.self).attr("w",newvalues[1]);
          },
          type:"String"
        }
      },
      look:
      [{
        type:"rect",
        points:function(xml,data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        x:0,
        y:0,
        w:function(xml,data){return $(data.self).attr("w")},
        h:function(xml,data){return $(data.self).attr("h")},
        rx:5,
        ry:5,
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },{
        type:"path",
        d:function(xml,data){

          return "M"+($(data.self).attr("w")-15)+" "+5+" l5 -2 l5 2 l0 7 l-5 -2 l-5 2 z";
        },

        style:"stroke: black; fill:none;",
        fill:"none",
        stroke:"black"

      },{
          type:"text",
          innerHtml:function(xml,data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            var x = 0;
            if($(data.self).children("node").size()>0){
              x = 6;
            }else{
              x = $(data.self).attr('w')/2
            }
            var y = 0;
            if($(data.self).children("node").size()>0){
              y = 8;
            }else
              {
                y = $(data.self).attr('h')/2
              }
            var linebyline = $(data.self).children("node").size()>0
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"),linebyline,x,y)},
          x:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(xml,data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }
    ],feel:{
      points:function(xml,data){
  return configuration.nodes[undefined].feel.points(xml,data);
}
    }},BusinessProcess:{
      new:function(xml){
        return configuration.node.new(xml,"BusinessProcess","My Business Process",255,255,181,92,92,92);
      },
      attributes:{
        name:{
          get:function(data){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
          },
          set:function(data,value){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text(value);
          },
          type:"String"
        },
        "height and width":{
          get:function(data){
            return $(data.self).attr("h")+" "+$(data.self).attr("w");
          },
          set:function(data,value){
            var newvalues = value.split(" ");
            $(data.self).attr("h",newvalues[0]);
            $(data.self).attr("w",newvalues[1]);
          },
          type:"String"
        }
      },
      look:
      [{
        type:"rect",
        points:function(xml,data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        x:0,
        y:0,
        w:function(xml,data){return $(data.self).attr("w")},
        h:function(xml,data){return $(data.self).attr("h")},
        rx:5,
        ry:5,
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },{
        type:"path",
        d:function(xml,data){

          return "M"+($(data.self).attr("w")-20)+" "+5+" l10 0 l0 -2 l5 6 l-5 6 l0 -2 l-10 0 z";
        },

        style:"stroke: black; fill:none;",
        fill:"none",
        stroke:"black"

      },{
          type:"text",
          innerHtml:function(xml,data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            var x = 0;
            if($(data.self).children("node").size()>0){
              x = 6;
            }else{
              x = $(data.self).attr('w')/2
            }
            var y = 0;
            if($(data.self).children("node").size()>0){
              y = 8;
            }else
              {
                y = $(data.self).attr('h')/2
              }
            var linebyline = $(data.self).children("node").size()>0
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"),linebyline,x,y)},
          x:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(xml,data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }
    ],feel:{
      points:function(xml,data){
  return configuration.nodes[undefined].feel.points(xml,data);
}
    }},BusinessEvent:{
      new:function(xml){
        return configuration.node.new(xml,"BusinessEvent","My Business Event",255,255,181,92,92,92);
      },
      attributes:{
        name:{
          get:function(data){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
          },
          set:function(data,value){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text(value);
          },
          type:"String"
        },
        "height and width":{
          get:function(data){
            return $(data.self).attr("h")+" "+$(data.self).attr("w");
          },
          set:function(data,value){
            var newvalues = value.split(" ");
            $(data.self).attr("h",newvalues[0]);
            $(data.self).attr("w",newvalues[1]);
          },
          type:"String"
        }
      },
      look:
      [{
        type:"rect",
        points:function(xml,data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        x:0,
        y:0,
        w:function(xml,data){return $(data.self).attr("w")},
        h:function(xml,data){return $(data.self).attr("h")},
        rx:5,
        ry:5,
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },
      {
        type:"path",
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:"none",
        d:function(xml,data){return "M "+($(data.self).attr("w")-25)+","+(13)+" c +5,0 +5,-10 0,-10 l 15 0 c +5,0 +5,+10 0,+10 z"}
      },{
          type:"text",
          innerHtml:function(xml,data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            var x = 0;
            if($(data.self).children("node").size()>0){
              x = 6;
            }else{
              x = $(data.self).attr('w')/2
            }
            var y = 0;
            if($(data.self).children("node").size()>0){
              y = 8;
            }else
              {
                y = $(data.self).attr('h')/2
              }
            var linebyline = $(data.self).children("node").size()>0
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"),linebyline,x,y)},
          x:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(xml,data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
        feel:{
          points:function(xml,data){
  return configuration.nodes[undefined].feel.points(xml,data);
}
        }
    },Representation:{
      new:function(xml){
        return configuration.node.new(xml,"Representation","My Representation",255,255,181,92,92,92);
      },
      attributes:{
        name:{
          get:function(data){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
          },
          set:function(data,value){
            return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text(value);
          },
          type:"String"
        },
        "height and width":{
          get:function(data){
            return $(data.self).attr("h")+" "+$(data.self).attr("w");
          },
          set:function(data,value){
            var newvalues = value.split(" ");
            $(data.self).attr("h",newvalues[0]);
            $(data.self).attr("w",newvalues[1]);
          },
          type:"String"
        }
      },
      look:
      [{
        type:"path",
        stroke:function(xml,data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(xml,data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        d:function(xml,data){return "M 0,0 l "+$(data.self).attr("w")+",0 l 0,"+$(data.self).attr("h")+" c -15,-5 "+(-$(data.self).attr("w")/2)+",-5 "+(-$(data.self).attr("w")/2)+",10 c -10,10 "+(-$(data.self).attr("w")/2)+",0 "+(-$(data.self).attr("w")/2)+",-10 z"}
      },{
          type:"text",
          innerHtml:function(xml,data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            var x = 0;
            if($(data.self).children("node").size()>0){
              x = 6;
            }else{
              x = $(data.self).attr('w')/2
            }
            var y = 0;
            if($(data.self).children("node").size()>0){
              y = 8;
            }else
              {
                y = $(data.self).attr('h')/2
              }
            var linebyline = $(data.self).children("node").size()>0
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"),linebyline,x,y)},
          x:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(xml,data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(xml,data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
        feel:{
          points:function(xml,data){
            var result = [];
            var x = parseInt(configuration.node.position(data).x);
            var y = parseInt(configuration.node.position(data).y);
            var w = parseInt(configuration.node.position(data).width);
            var h = parseInt(configuration.node.position(data).height);
            var point1 = {};
            var point2 = {};
            var point3 = {};
            var point4 = {};
            point1.x = (x +(w/2));
            point1.y = y;
            point2.x = x;
            point2.y = (y+(h/2));
            point3.x = (x +(w/2));
            point3.y = (y+h);
            point4.x = (x+w);
            point4.y = (y+(h/2));
            result.push(point1);
            result.push(point2);
            result.push(point3);
            result.push(point4);
            return result;
          }
        }
    }
  },
  edges:{
    AggregationRelationship:{
      new:function(xml){
        return configuration.edge.new(xml,"AggregationRelationship","MyAggregationRelationship")
      },
      relates:[

        {end:"BusinessObject", begin:"BusinessObject"},
        {end:"DataObject", begin:"DataObject"},

        {end:"Contract", begin:"Product"},
        {end:"BusinessService", begin:"Product"},
        {end:"BusinessActor", begin:"BusinessCollaboration"},
        {end:"BusinessRole", begin:"BusinessCollaboration"},


        {end:"BusinessProcess", begin:"BusinessProcess"},
        {end:"BusinessFunction", begin:"BusinessRole"},

        {end:"BusinessActor", begin:"BusinessActor"},
        {end:"ApplicationComponent", begin:"ApplicationCollaboration"},

        {end:"ApplicationFunction", begin:"ApplicationComponent"},
        {end:"ApplicationFunction", begin:"ApplicationFunction"},

        {end:"Device", begin:"Node"},
        {end:"SystemSoftware", begin:"Node"},
      ],
      allowHierarchiallyGrouping: true,
      look:[
        {
            type:"text",
            innerHtml:function(xml,data){
              var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text()
              return text
            },
            x:function(xml,data){
              //TODO
            },
            y:function(xml,data){
              //TODO
              },
            "alignment-baseline":"auto"
          }
      ],
      stroke:function(xml,data){return configuration.edges[undefined].stroke(xml,data)},
      "stroke-width":function(xml,data){return $(data).children("style").attr("lineWidth")},
      "marker-start":"url(#AggregationRelationshipStart)",
      "style":function(xml,data){return "marker-start:url(#AggregationRelationshipStart);"},
      points:function(xml,data){
        return configuration.edges[undefined].points(xml,data);
      }
    },
    CompositionRelationship:{
      new:function(xml){
        return configuration.edge.new(xml,"CompositionRelationship","MyCompositionRelationship")

      },
      relates:[
        {end:"BusinessInterface", begin:"BusinessRole"},
        {end:"ApplicationInterface", begin:"ApplicationComponent"},
        {end:"ApplicationComponent", begin:"ApplicationComponent"},
        {end:"InfrastructureInterface", begin:"Node"},



      ],
      look:[

      ],
      stroke:function(xml,data){return configuration.edges[undefined].stroke(xml,data)},
      "stroke-width":function(xml,data){return $(data).children("style").attr("lineWidth")},
      "marker-start":"url(#AggregationRelationshipStart)",
      "style":function(xml,data){return "marker-start:url(#CompositionRelationshipStart);"},
      points:function(xml,data){
        return configuration.edges[undefined].points(xml,data);
      }
    },
    RealisationRelationship:{
      new:function(xml){
        return configuration.edge.new(xml,"RealisationRelationship","MyRealisationRelationship")

      },
      relates:[
        {end:"BusinessObject", begin:"DataObject"},
        {end:"BusinessObject", begin:"Representation"},
        {end:"BusinessService",begin:"ApplicationFunction"},
        {end:"Plateau",begin:"Deliverable"},
        {end:"Deliverable",begin:"WorkPackage"},
        {end:"BusinessService",begin:"BusinessFunction"},
        {end:"BusinessService",begin:"BusinessProcess"},
        {end:"BusinessService",begin:"BusinessInteraction"},
        {end:"BusinessService",begin:"ApplicationComponent"},

        {end:"ApplicationService",begin:"ApplicationComponent"},

        {end:"SystemSoftware",begin:"ApplicationComponent"},
        {end:"Device",begin:"ApplicationComponent"},

        {end:"SystemSoftware",begin:"InfrastructureService"},
        {end:"Device",begin:"InfrastructureService"},


      ],
      look:[

      ],
      stroke:function(xml,data){return configuration.edges[undefined].stroke(xml,data)},
      "stroke-width":function(xml,data){return $(data).children("style").attr("lineWidth")},
      "marker-start":"url(#AggregationRelationshipStart)",
      "marker-end":"url(#RealisationRelationshipEnd)",
      "stroke-dasharray":"5,5",
      points:function(xml,data){
        return configuration.edges[undefined].points(xml,data);
      }
    },
    AssociationRelationship:{
      new:function(xml){
        return configuration.edge.new(xml,"AssociationRelationship","MyAssociationRelationship")
      },
      relates:[
        {end:"Value", begin:"Product"},
        {end:"Value", begin:"BusinessService"},
        {end:"Value", begin:"BusinessRole"},
        {end:"Meaning",begin:"BusinessObject"},
        {end:"Node",begin:"CommunicationPath"},
        {end:"Device",begin:"Network"},
        {end:"Node",begin:"Network"},
        {end:"Stakeholder",begin:"MotivationalElement"},
        {end:"Goal",begin:"Driver"},
        {end:"Assesment",begin:"Driver"},
        {end:"Assesment",begin:"Goal"},
        {end:"Gap",begin:"Plateau"},
        {end:"BusinessInterface",begin:"BusinessActor"},
        {end:"BusinessActor",begin:"BusinessActor"},

      ],
      look:[

      ],
      stroke:function(xml,data){return configuration.edges[undefined].stroke(xml,data)},
      "stroke-width":function(xml,data){return $(data).children("style").attr("lineWidth")},
      "style":function(xml,data){return ""},
      points:function(xml,data){
        return configuration.edges[undefined].points(xml,data);
      }
    },
    AssignmentRelationship:{
      new:function(xml){
        return configuration.edge.new(xml,"AssignmentRelationship","MyAssignmentRelationship")
      },
      relates:[
        {end:"Location", begin:"BusinessObject"},
        {end:"Location", begin:"Representations"},
        {end:"BusinessRole",begin:"BusinessActor"},

        {end:"BusinessEvent",begin:"BusinessRole"},

        {end:"BusinessActor",begin:"Location"},
        {end:"BusinessProcess",begin:"BusinessRole"},
        {end:"BusinessFunction",begin:"BusinessRole"},
        {end:"BusinessInteraction",begin:"BusinessRole"},


        {end:"BusinessInteraction",begin:"BusinessCollaboration"},

        {end:"ApplicationInterface",begin:"ApplicationService"},
        {end:"ApplicationComponent",begin:"ApplicationFunction"},
        {end:"ApplicationComponent",begin:"ApplicationInteraction"},
        {end:"InfrastructureService",begin:"InfrastructureInterface"},
        {end:"SystemSoftware",begin:"Device"},
        {end:"Artifact",begin:"Node"},
        {end:"InfrastructureFunction",begin:"Node"}
      ],
      look:[

      ],
      stroke:function(xml,data){return configuration.edges[undefined].stroke(xml,data)},
      "stroke-width":function(xml,data){return $(data).children("style").attr("lineWidth")},
      "style":function(xml,data){return "marker-start:url(#AssignmentRelationshipStartEnd);marker-end:url(#AssignmentRelationshipStartEnd);"},
      points:function(xml,data){
        return configuration.edges[undefined].points(xml,data);
      }
    },
    UsedByRelationship:{
      new:function(xml){
        return configuration.edge.new(xml,"UsedByRelationship","MyUsedByRelationship")
      },
      relates:[
        /*Business*/
        {end:"BusinessActor", begin:"BusinessService"},
        {end:"BusinessRole", begin:"BusinessService"},
        {end:"BusinessService", begin:"BusinessRole"},
        {end:"BusinessService", begin:"BusinessProcess"},
        {end:"BusinessProcess", begin:"BusinessService"},

        {end:"BusinessService",begin:"BusinessFunction"},
        {end:"BusinessService",begin:"BusinessInteraction"},
        {end:"BusinessActor",begin:"BusinessInterface"},
        {end:"BusinessRole",begin:"BusinessInterface"},
        /*Application*/
        {end:"ApplicationComponent",begin:"ApplicationComponent"},



        {end:"ApplicationComponent",begin:"ApplicationService"},
        {end:"ApplicationFunction",begin:"ApplicationService"},
        {end:"ApplicationInteraction",begin:"ApplicationService"},

        {end:"BusinessProcess",begin:"ApplicationService"},
        {end:"BusinessInteraction",begin:"ApplicationService"},

        {end:"InfrastructureService",begin:"ApplicationComponent"},

        {end:"InfrastructureInterface",begin:"Node"},
        {end:"InfrastructureService",begin:"InfrastructureFunction"},
        {end:"InfrastructureService",begin:"Node"}

      ],
      look:[

      ],
      stroke:function(xml,data){return configuration.edges[undefined].stroke(xml,data)},
      "stroke-width":function(xml,data){return $(data).children("style").attr("lineWidth")},
      "style":function(xml,data){return "marker-end:url(#UsedByRelationshipEnd);"},
      points:function(xml,data){
        return configuration.edges[undefined].points(xml,data);
      }
    },
    TriggeringRelationship:{
      new:function(xml){
        return configuration.edge.new(xml,"TriggeringRelationship","MyTriggeringRelationship")
      },
      relates:[
        {end:"BusinessProcess", begin:"BusinessEvent"},
        {end:"BusinessFunction", begin:"BusinessEvent"},
        {end:"BusinessInteraction", begin:"BusinessEvent"},
        {end:"BusinessEvent", begin:"BusinessProcess"},
        {end:"BusinessEvent", begin:"BusinessFunction"},
        {end:"BusinessEvent", begin:"BusinessInteraction"},

        {end:"BusinessProcess", begin:"BusinessProcess"},
        {end:"BusinessFunction", begin:"BusinessProcess"},
        {end:"BusinessInteraction", begin:"BusinessProcess"},

        {end:"BusinessProcess", begin:"BusinessFunction"},
        {end:"BusinessFunction", begin:"BusinessFunction"},
        {end:"BusinessInteraction", begin:"BusinessFunction"},

        {end:"BusinessProcess", begin:"BusinessInteraction"},
        {end:"BusinessFunction", begin:"BusinessInteraction"},
        {end:"BusinessInteraction", begin:"BusinessInteraction"},

        {end:"ApplicationFunction", begin:"ApplicationFunction"},
        {end:"ApplicationFunction", begin:"ApplicationInteraction"},
        {end:"ApplicationInteraction", begin:"ApplicationFunction"},
        {end:"ApplicationInteraction", begin:"ApplicationInteraction"},

        {end:"InfrastructureFunction", begin:"InfrastructureFunction"},

        {end:"Plateau", begin:"Plateau"},
        {end:"WorkPackage", begin:"WorkPackage"},

      ],
      look:[

      ],
      stroke:function(xml,data){return configuration.edges[undefined].stroke(xml,data)},
      "stroke-width":function(xml,data){return $(data).children("style").attr("lineWidth")},
      "style":function(xml,data){return "marker-end:url(#TriggeringRelationshipEnd);"},
      points:function(xml,data){
        return configuration.edges[undefined].points(xml,data);
      }
    },
    FlowRelationship:{
      new:function(xml){
        return configuration.edge.new(xml,"FlowRelationship","MyFlowRelationship")
      },
      relates:[
        /*Business*/
        {end:"BusinessProcess", begin:"BusinessProcess"},
        {end:"BusinessFunction", begin:"BusinessProcess"},
        {end:"BusinessInteraction", begin:"BusinessProcess"},
        {end:"BusinessProcess", begin:"BusinessFunction"},
        {end:"BusinessFunction", begin:"BusinessFunction"},
        {end:"BusinessInteraction", begin:"BusinessFunction"},
        {end:"BusinessProcess", begin:"BusinessInteraction"},
        {end:"BusinessFunction", begin:"BusinessInteraction"},
        {end:"BusinessInteraction", begin:"BusinessInteraction"},
        {end:"BusinessActor", begin:"BusinessActor"},
        {end:"BusinessRole", begin:"BusinessFunction"},
        {end:"BusinessFunction", begin:"BusinessRole"},
        /*Application*/
        {end:"ApplicationFunction", begin:"ApplicationFunction"},
        {end:"ApplicationFunction", begin:"ApplicationInteraction"},
        {end:"ApplicationInteraction", begin:"ApplicationFunction"},
        {end:"ApplicationInteraction", begin:"ApplicationInteraction"},
        /*Technology*/
        {end:"InfrastructureFunction", begin:"InfrastructureFunction"},
        /*Implementation*/
        {end:"WorkPackage", begin:"WorkPackage"},

      ],
      look:[

      ],
      stroke:function(xml,data){return configuration.edges[undefined].stroke(xml,data)},
      "stroke-width":function(xml,data){return $(data).children("style").attr("lineWidth")},
      "style":function(xml,data){return "marker-end:url(#TriggeringRelationshipEnd);"},
      "stroke-dasharray":"5,5",
      points:function(xml,data){
        return configuration.edges[undefined].points(xml,data);
      }
    },
    SpecialisationRelationship:{
      new:function(xml){
        return configuration.edge.new(xml,"FlowRelationship","MyFlowRelationship")
      },
      relates:[
        /*Business*/
        {end:"BusinessCollaboration",begin:"BusinessRole"},
        {end:"Contract",begin:"BusinessObject"},
        {end:"BusinessObject",begin:"BusinessObject"},
        /*Application*/
        {end:"ApplicationCollaboration",begin:"ApplicationComponent"},
        {end:"Device",begin:"Node"},
        /*Motivation*/
        {end:"Stakeholder",begin:"StructureElement"},
        {end:"Goal",begin:"MotivationalElement"},
        {end:"Driver",begin:"MotivationalElement"},
        {end:"Assessment",begin:"MotivationalElement"},
        {end:"Principle",begin:"MotivationalElement"},
        {end:"Requirement",begin:"MotivationalElement"},
        {end:"Constraint",begin:"Requirement"},
        /*Implementation*/
        {end:"WorkPackage",begin:"BehaviourElement"},
      ],
      look:[

      ],
      stroke:function(xml,data){return configuration.edges[undefined].stroke(xml,data)},
      "stroke-width":function(xml,data){return $(data).children("style").attr("lineWidth")},
      "marker-start":"url(#AggregationRelationshipStart)",
      "style":function(xml,data){return "marker-end:url(#RealisationRelationshipEnd);"},
      points:function(xml,data){
        return configuration.edges[undefined].points(xml,data);
      }
    },
    AccessRelationship:{
      new:function(xml){
        return configuration.edge.new(xml,"AccessRelationship","MyAccessRelationship")
      },
      relates:[
        /*Business*/
        {end:"BusinessObject",begin:"BusinessEvent"},
        {end:"BusinessObject",begin:"BusinessProcess"},
        {end:"BusinessObject",begin:"BusinessFunction"},
        {end:"BusinessObject",begin:"BusinessInteraction"},
        {end:"BusinessObject",begin:"BusinessService"},
        /*Application*/
        {end:"DataObject",begin:"ApplicationService"},
        {end:"DataObject",begin:"ApplicationFunction"},
        {end:"DataObject",begin:"ApplicationInteraction"},
        {end:"DataObject",begin:"ApplicationComponent"},
        /*Technology*/
        {end:"Artifact",begin:"InfrastructureFunction"},
        {end:"Artifact",begin:"InfrastructureService"},

      ],
      look:[

      ],
      stroke:function(xml,data){return configuration.edges[undefined].stroke(xml,data)},
      "stroke-width":function(xml,data){return $(data).children("style").attr("lineWidth")},
      "style":function(xml,data){return "marker-end:url(#AccessRelationshipEnd);"},
      points:function(xml,data){
        return configuration.edges[undefined].points(xml,data);
      }
    },
    undefined:{
      attributes:{
        name:{
          type:"String",
          get:function(xml,edge){
            var relation = configuration.edge.relation(xml,edge);
            return relation.children("label[xml:lang='"+configuration.usersettings.lang+"']").text();
          },
          set:function(xml,edge,value){
            var relation = configuration.edge.relation(xml,edge);
            return relation.children("label[xml:lang='"+configuration.usersettings.lang+"']").text(value);
          }
        }
      },
      look:[

      ],
      stroke:function(xml,data){var fc = $( data ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
      "stroke-width":function(xml,data){return $(data).children("style").attr("lineWidth")},
      points:function(xml,data){
        var result = {
          shape1:[],
          path:[],
          shape2:[]
        };
        var source_node = configuration.edge.source(documentmodengine.xml,data);
        var target_node = configuration.edge.target(documentmodengine.xml,data);


        var points1f = configuration.nodes[configuration.modelelement.type(configuration.node.modelelement(source_node,documentmodengine.xml))].feel.points;
        var points2f = configuration.nodes[configuration.modelelement.type(configuration.node.modelelement(target_node,documentmodengine.xml))].feel.points;
        result.shape1 = points1f(xml,source_node);
        result.shape2 = points2f(xml,target_node);
        var bendpoints = $(data).find("bendpoint");
        for(var i = 0;i< bendpoints.size();i++){
          var point = {};
          point.x = bendpoints.eq(i).attr("x");
          point.y = bendpoints.eq(i).attr("y");
          result.path.push(point);
        }

        return result;
      }
    }
  },
  definitions:[
    /* Definitoins are used for specifying reusable svg parts, like arrows for edges */
    {
      id:"AggregationRelationshipStart",
      type:"marker",
      markerWidth:32,
      markerHeight:32,
      refX:0,
      refY:8,
      orient:"auto",
      look:[
        {
          type:"path",
          d:"M0,8 L8,4 L16,8 L8,12 L0,8",
          style:"stroke: black; fill:white;"
        }
      ]
    },{
      id:"CompositionRelationshipStart",
      type:"marker",
      markerWidth:32,
      markerHeight:32,
      refX:0,
      refY:8,
      orient:"auto",
      look:[
        {
          type:"path",
          d:"M0,8 L8,4 L16,8 L8,12 L0,8",
          style:"stroke: black; fill:black;"
        }
      ]
    },{
      id:"AggregationRelationshipEnd",
      type:"marker",
      markerWidth:16,
      markerHeight:16,
      refX:11.5,
      refY:7,
      look:[
        {
          type:"path",
          d:"M2,2 L2,11 L11,11 L11,2",
          style:"stroke: purple; fill:purple;"
        }
      ]
    },
    {
      id:"RealisationRelationshipEnd",
      type:"marker",
      markerWidth:17,
      markerHeight:17,
      refX:8,
      refY:6,
      orient:"auto",
      look:[
        {
          type:"path",
          d:"M8,6 L0,12 L0,0 L8,6",
          style:"stroke:black;fill:white;"
        }
      ]
    },{
      id:"RealisationRelationshipStart",
      type:"marker",
      markerWidth:16,
      markerHeight:16,
      refX:0,
      refY:6,
      orient:"auto",
      look:[
        {
          type:"path",
          d:"M0,6 L8,12 L8,0 L0,6",
          style:"stroke:black;fill:white;"
        }
      ]
    },
    {
      id:"UsedByRelationshipEnd",
      type:"marker",
      markerWidth:16,
      markerHeight:16,
      refX:8,
      refY:6,
      orient:"auto",
      look:[
        {
          type:"path",
          d:"M8,6 L0,0 M8,6 L0,12 ",
          style:"stroke:black;fill:none;"
        }
      ]
    },
    {
      id:"TriggeringRelationshipEnd",
      type:"marker",
      markerWidth:16,
      markerHeight:16,
      refX:8,
      refY:6,
      orient:"auto",
      look:[
        {
          type:"path",
          d:"M8,6 L0,3 L0,9 L8,6",
          style:"stroke:black;fill:black;"
        }
      ]
    },
    {
      id:"AccessRelationshipEnd",
      type:"marker",
      markerWidth:16,
      markerHeight:16,
      refX:8,
      refY:6,
      orient:"auto",
      look:[
        {
          type:"path",
          d:"M8,6 L0,3 M8,6 L0,9",
          style:"stroke:black;fill:black;"
        }
      ]
    },
    {
      id:"AssignmentRelationshipStartEnd",
      type:"marker",
      markerWidth:16,
      markerHeight:16,
      refX:3,
      refY:3,
      orient:"auto",
      look:[
        {
          type:"circle",
          cx:"3",
          cy:"3",
          r:"2.5",
          style:"stroke:black;fill:black;"
        }
      ]
    }
  ]
}
