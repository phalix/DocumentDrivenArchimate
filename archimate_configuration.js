
this.configuration = {
  globalDelimiter: 50,
  globalParagraph: 4,
  globalTextlines: 20,
  globalCharheight: 8,
  edgedistance: 10,
  modelname:function(data){
    return $(data).children("name[xml\\:lang="+documentmodengine.usersettings.lang+"]").text()
  },
  modelfiletype:function(data){
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
        if($(documentmodengine.xml).find("[identifier='"+result+"']").size()==0){
          found = false;
        }
    }
    return result;
  },
  createNewNode:function(type,name,x,y,w,h,fillcolorr,fillcolorg,fillcolorb,linecolorr,linecolorg,linecolorb){
    //TODO: Generate Node and Element Id
    //TODO: Check that Node id and element id are not already in use.

    var element = {};
    var nodeid = configuration.idgenerator();
    var elementid = configuration.idgenerator();
    var node = $("<node x='0' y='0' w='120' h='55'></node>");
    node.attr("identifier",nodeid);
    node.attr("elementref",elementid);
    var style = $("<style></style>");
    node.append(style);
    var fillColor = $("<fillColor r='201' g='231' b='183' />");
    var lineColor = $("<lineColor r='92' g='92' b='92' />");
    style.append(fillColor);
    style.append(lineColor);
    var element = $("<element></element>");
    element.attr("identifier",elementid);
    element.attr("xsi:type",type);
    var label = $("<label xml\:lang='en'></label>");
    label.text(name);
    element.append(label);
    element.self = node[0];
    element.element = element[0];
    element.id = nodeid;
    element.updates = [];
    return element;
  },
  deleteNode:function(xml,view,element){


      //$(view.self).find("[source='"+element.id+"']").remove();
      //$(view.self).find("[target='"+element.id+"']").remove();
      //$(view.self).children(element.self).remove();
      element.self.remove();

  },
  createNewEdge:function(type,name,linecolorr,linecolorg,linecolorb){
    var selected_nodes = documentmodengine.nodeselection().data;

    var element = {};

    if(selected_nodes.length == 2){
      var done = false;
      var relations = configuration.edges[type].relates;
      var a;
      var b;
      for(var  i= 0;i< relations.length && !done ;i++){
        if(relations[i].begin == configuration.nodetype(selected_nodes[0]) && relations[i].end == configuration.nodetype(selected_nodes[1])){
          a = 0;
          b = 1;
          done = true;
        }/*else if(relations[i].begin == configuration.nodetype(selected_nodes[1]) && relations[i].end == configuration.nodetype(selected_nodes[0])){
          a = 1;
          b = 0;
          done = true;
        }*/

      }
      if(done){
        var elementidsource = $(selected_nodes[a].element).attr("identifier");
        var nodeidsource = $(selected_nodes[a].self).attr("identifier");

        var elementidtarget = $(selected_nodes[b].element).attr("identifier");
        var nodeidtarget = $(selected_nodes[b].self).attr("identifier");
        element.source = selected_nodes[a].element;
        element.target = selected_nodes[b].element;
        element.source_node = selected_nodes[a].self;
        element.target_node = selected_nodes[b].self;

        var relationsshipid = configuration.idgenerator();
        var connectionid = configuration.idgenerator();
        var relationship = $("<relationship/>");
        relationship.attr("identifier",relationsshipid);
        relationship.attr("xsi:type",type);
        relationship.attr("source",elementidsource);
        relationship.attr("target",elementidtarget);

        var connection = $("<connection></connection>");
        connection.attr("connection",connectionid);
        connection.attr("relationshipref",relationsshipid);
        connection.attr("source",nodeidsource);
        connection.attr("target",nodeidtarget);
        var style = $("<style/>");
        //TODO: add rgb by parameters
        var lineColor = $("<lineColor r='0' g='128' b='192' />");
        style.append(lineColor);
        connection.append(style);
        element.self = connection[0];
        element.element = relationship[0];
        element.id = connectionid;

        return element;
      }
    }
    return undefined;
  },
  view_extraction:function(data){return $(data).children().children('views');},//.children().eq(view_sel)},
  node_extraction:function(view,data){return $(view).find('node');},
  node_datacollector:function(node,data){var result = {};
    var nodeid = $(node).attr("identifier");
    var eref = $(node).attr("elementref");
    if(eref){
      var element_ref = $(data).children().children("elements").children('element[identifier="'+eref+'"]')[0];
      //attach element to node.
      result.element = element_ref;
    }
    result.updates = [];
    var nodes = $(node).find('node');
    for(var i=0;i<nodes.size();i++){
      var id = nodes.eq(i).attr("identifier");
      result.updates.push(id);
    }
    var edges = $(data).find('[source="'+nodeid+'"]');
    for(var i=0;i<edges.size();i++){
      var id = edges.eq(i).attr("identifier");
      result.updates.push(id);
    }
    var edges = $(data).find('[target="'+nodeid+'"]');
    for(var i=0;i<edges.size();i++){
      var id = edges.eq(i).attr("identifier");
      result.updates.push(id);
    }
    result.id = nodeid;
    return result;
  },
  nodetype:function(data){
    if($(data.element).attr("xsi:type")){
        return $(data.element).attr("xsi:type")
    }else{
      return $(data.self).attr("type")
    }

  },
  nodeposition:function(node){
    var result = {};
    if(node.self){
      result.x = $(node.self).attr('x');
      result.y = $(node.self).attr('y');
      result.width = $(node.self).attr('w');
      result.height = $(node.self).attr('h');
    }else{
      result.x = $(node).attr('x');
      result.y = $(node).attr('y');
      result.width = $(node).attr('w');
      result.height = $(node).attr('h');
    }

    return result;
  },
  edge_extraction:function(view,data){return $(view).find('connection');},

  edge_datacollector:function(viewid,edge,data){
    var result = {};
    result.viewid = viewid;
    var id = $(edge).attr("identifier");
    var relref = $(edge).attr("relationshipref");

    if(relref){
      var relationship_ref = $(data).children().children("relationships").children('relationship[identifier="'+relref+'"]');
      result.element = relationship_ref[0];
    }
    //references to elements
    var srcref_nd = $(edge).attr("source");
    if(srcref_nd){
      var srcref_el = $(relationship_ref).attr("source");
      if(srcref_el){
        var sourceref_element = $(data).children().children("elements").children('element[identifier="'+srcref_el+'"]');
        result.source = sourceref_element[0];
      }
      var sourceref_node = $(data).children().find('node[identifier="'+srcref_nd+'"]');
      result.source_node = sourceref_node[0];

    }
    var tarref_nd = $(edge).attr("target");
    if(tarref_nd){
      var tarref_el = $(relationship_ref).attr("target");
      if(tarref_el){
        var targetref_element = $(data).children().children("elements").children('element[identifier="'+tarref_el+'"]');
        result.target = targetref_element[0];
      }
      var targetref_node = $(data).children().find('node[identifier="'+tarref_nd+'"]');
      result.target_node = targetref_node[0];
    }
    //references to nodes

    result.id = id;
    return result;
  },


  edgetype:function(data){return $(data.element).attr("xsi:type")},
  updateNodePosition: function(node,x,y){
    $(node.self).attr("x",x);
    $(node.self).attr("y",y);
  },updateEdgePosition: function(edge,index,x,y){
    $(edge.self).children("bendpoint").eq(index).attr("x",x)
    $(edge.self).children("bendpoint").eq(index).attr("y",y);
  },deleteEdge: function(edge,index){
    $(edge.self).children("bendpoint").eq(index).remove();
  },
  addBendPoint:function(edge,x,y){
    $(edge.self).append("<bendpoint x='"+x+"' y='"+y+"' ></bendpoint>");
  },
  nodeadder:function(xml,view,element){

      $(xml).children("model").children("elements").append(element.element);
      $(view.self).append(element.self);

  },
  edgeadder:function(xml,view,element){
    $(xml).children("model").children("relationships").append(element.element);
    $(view.self).append(element.self);
  },
  nodes:{
    undefined:{
      look:
      [{
        type:"polygon",
        points:function(data){
          return "0,0 0,"+$(data.self).attr("h")+" "+$(data.self).attr("w")+","+$(data.self).attr("h")+" "+$(data.self).attr("w")+",0";
        },
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"))},
          x:function(data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        },{
            type:"text",
            innerHtml:function(data){
              var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
              return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"))},
            x:function(data){
              if($(data.self).children("node").size()>0){
                return 6;
              }else{
                return $(data.self).attr('w')/2
              }
            },
            y:function(data){
              if($(data.self).children("node").size()>0){
                return 8;
              }else
                {
                  return $(data.self).attr('h')/2
                }
              },
            "alignment-baseline":"central",
            "text-anchor":function(data){
              if($(data.self).children("node").size()>0){
                return "start";
              }else{
                return "middle";
              }
            }
          }],feel:{
            points:function(data){
              var result = [];
              var x = parseInt(configuration.nodeposition(data).x);
              var y = parseInt(configuration.nodeposition(data).y);
              var w = parseInt(configuration.nodeposition(data).width);
              var h = parseInt(configuration.nodeposition(data).height);
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
              d:function(data){
                //return "M"+$(data.self).attr("x")+","+$(data.self).attr("y")+" l"+$(data.self).attr("w")+",0 l0,"+$(data.self).attr("h")+" l"+(-$(data.self).attr("w"))+",0 z";
                return "M0,0 l"+$(data.self).attr("w")/2+",0 l0,20 l-"+$(data.self).attr("w")/2+",0 z";
              },
              fill:function(data){var fc = $( data.self ).children("style").children("fillColor");
                    return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
              stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");
                    return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";},
              "stroke-dasharray":"5,5"
            },{
              type:"path",
              d:function(data){
                //return "M"+$(data.self).attr("x")+","+$(data.self).attr("y")+" l"+$(data.self).attr("w")+",0 l0,"+$(data.self).attr("h")+" l"+(-$(data.self).attr("w"))+",0 z";
                return "M0,20 l"+$(data.self).attr("w")+",0 l0,"+$(data.self).attr("h")+" l"+(-$(data.self).attr("w"))+",0 z";
              },
              fill:function(data){var fc = $( data.self ).children("style").children("fillColor");
                    return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
              stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");
                    return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";},
              "stroke-dasharray":"5,5"
            },{
                type:"text",
                innerHtml:function(data){
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
                x:function(data){
                  if($(data).children("node").size()>0){
                    return 6;}else{
                  return $(data.self).attr("w")/2;
                  }
                },
                y:function(data){
                  if($(data).children("node").size()>0){
                    return 8;
                  }else{
                    return $(data.self).attr('h')/2;
                  }
                },
                "alignment-baseline":"central",
                "text-anchor":function(data){
                  if($(data.self).children("node").size()>0){
                    return "start";
                  }else
                    return "middle";
                }
              }],
              feel:{
                points:function(data){
                  var result = [];
                  var x = parseInt(configuration.nodeposition(data).x);
                  var y = parseInt(configuration.nodeposition(data).y);
                  var w = parseInt(configuration.nodeposition(data).width);
                  var h = parseInt(configuration.nodeposition(data).height);
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
        new:function(){
          return configuration.createNewNode("Principle","My Principle");
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
          }
        },
        look:
        [{
          type:"path",
          d:function(data){

            return "M 5,0 l "+($(data.self).attr("w")-5)+",0 l 5,5 l 0,"+($(data.self).attr("h")-5)+" l-5,5 l"+(-$(data.self).attr("w")+5)+",0 l-5,-5 l0,"+(-$(data.self).attr("h")+5)+" z";
          },
          fill:function(data){var fc = $( data.self ).children("style").children("fillColor");
                return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
          stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");
                return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
        },{
          type:"rect",
          x:function(data){return $(data.self).attr("w")-10},
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
          x:function(data){return $(data.self).attr("w")-7},
          y:12,
          style:"font-size:10px"
        },
        {
        type:"text",
        innerHtml:function(data){
          var text = $(data).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
          return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"))},
        x:function(data){
          if($(data.self).children("node").size()>0){
            return 6;
          }else{
            return $(data.self).attr('w')/2
          }
        },
        y:function(data){
          if($(data.self).children("node").size()>0){
            return 8;
          }else
            {
              return $(data.self).attr('h')/2
            }
          },
        "alignment-baseline":"central",
        "text-anchor":function(data){
          if($(data.self).children("node").size()>0){
            return "start";
          }else{
            return "middle";
          }
        }
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"))},
          x:function(data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }]},
        Requirement:{
          new:function(){
            return configuration.createNewNode("Requirement","My Requirement");
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
            }
          },
          look:
          [{
            type:"path",
            d:function(data){

              return "M 5,0 l "+($(data.self).attr("w")-5)+",0 l 5,5 l 0,"+($(data.self).attr("h")-5)+" l-5,5 l"+(-$(data.self).attr("w")+5)+",0 l-5,-5 l0,"+(-$(data.self).attr("h")+5)+" z";
            },
            fill:function(data){var fc = $( data.self ).children("style").children("fillColor");
                  return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
            stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");
                  return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
          },{
            type:"path",
            d:function(data){return "M "+(parseFloat($(data.self).attr("w"))-10)+",5 l10,0 l-3,5 l-10,0 l3,-5"},
            fill:"none",
            stroke:"black",
            "stroke-width":"0.5"
          }

      ,{
          type:"text",
          innerHtml:function(data){
            var text = $(data).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"))},
          x:function(data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        },{
            type:"text",
            innerHtml:function(data){
              var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
              return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"))},
            x:function(data){
              if($(data.self).children("node").size()>0){
                return 6;
              }else{
                return $(data.self).attr('w')/2
              }
            },
            y:function(data){
              if($(data.self).children("node").size()>0){
                return 8;
              }else
                {
                  return $(data.self).attr('h')/2
                }
              },
            "alignment-baseline":"central",
            "text-anchor":function(data){
              if($(data.self).children("node").size()>0){
                return "start";
              }else{
                return "middle";
              }
            }
          }]},Goal:{
            new:function(){
              return configuration.createNewNode("Goal","My Goal");
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
              }
            },
            look:
            [{
              type:"path",
              d:function(data){

                return "M 5,0 l "+($(data.self).attr("w")-5)+",0 l 5,5 l 0,"+($(data.self).attr("h")-5)+" l-5,5 l"+(-$(data.self).attr("w")+5)+",0 l-5,-5 l0,"+(-$(data.self).attr("h")+5)+" z";
              },
              fill:function(data){var fc = $( data.self ).children("style").children("fillColor");
                    return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
              stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");
                    return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
            },{
              type:"circle",
              r:2,
              cx:function(data){return $(data.self).attr("w")-10},
              cy:function(data){return 10}
            },{
              type:"circle",
              r:4,
              cx:function(data){return $(data.self).attr("w")-10},
              cy:function(data){return 10},
              fill:"none",
              stroke:"black"
            },{
              type:"circle",
              r:6,
              cx:function(data){return $(data.self).attr("w")-10},
              cy:function(data){return 10},
              fill:"none",
              stroke:"black"
            }

        ,{
            type:"text",
            innerHtml:function(data){
              var text = $(data).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
              return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"))},
            x:function(data){
              if($(data.self).children("node").size()>0){
                return 6;
              }else{
                return $(data.self).attr('w')/2
              }
            },
            y:function(data){
              if($(data.self).children("node").size()>0){
                return 8;
              }else
                {
                  return $(data.self).attr('h')/2
                }
              },
            "alignment-baseline":"central",
            "text-anchor":function(data){
              if($(data.self).children("node").size()>0){
                return "start";
              }else{
                return "middle";
              }
            }
          },{
              type:"text",
              innerHtml:function(data){
                var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
                return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"))},
              x:function(data){
                if($(data.self).children("node").size()>0){
                  return 6;
                }else{
                  return $(data.self).attr('w')/2
                }
              },
              y:function(data){
                if($(data.self).children("node").size()>0){
                  return 8;
                }else
                  {
                    return $(data.self).attr('h')/2
                  }
                },
              "alignment-baseline":"central",
              "text-anchor":function(data){
                if($(data.self).children("node").size()>0){
                  return "start";
                }else{
                  return "middle";
                }
              }
            }],feel:{
              points:function(data){
                var result = [];
                var x = parseInt(configuration.nodeposition(data).x);
                var y = parseInt(configuration.nodeposition(data).y);
                var w = parseInt(configuration.nodeposition(data).width);
                var h = parseInt(configuration.nodeposition(data).height);
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
      new:function(){
        return configuration.createNewNode("BusinessObject","My Business Object");
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
        }
      },
      look:
      [{
        type:"polygon",
        points:function(data){
          return "0,0 0,"+$(data.self).attr("h")+" "+$(data.self).attr("w")+","+$(data.self).attr("h")+" "+$(data.self).attr("w")+",0";
        },
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"polygon",
        points:function(data){
          return "0,0 0,"+$(data.self).attr("h")/3+" "+$(data.self).attr("w")+","+$(data.self).attr("h")/3+" "+$(data.self).attr("w")+",0";
        },
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
          type:"text",
          innerHtml:function(data){
            return documentmodengine.functions.textDistributionToTSpan($(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text(),$(data.self).attr("w"),
            $(data.self).attr("h")/3.5);
          },
          "alignment-baseline":"central",
          "text-anchor":"middle",
          x:function(data){
            return $(data.self).attr("w")/2
          },
          y:function(data){
            return configuration.globalCharheight/2+5;
          }

        }
    ],feel:{
      points:function(data){
        var result = [];
        var x = parseInt(configuration.nodeposition(data).x);
        var y = parseInt(configuration.nodeposition(data).y);
        var w = parseInt(configuration.nodeposition(data).width);
        var h = parseInt(configuration.nodeposition(data).height);
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
      new:function(){
        return configuration.createNewNode("BusinessActor","My Business Actor");
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
        }
      },
      look:
      [{
        type:"rect",
        points:function(data){
          return "0,0 0,"+$(data.self).attr("h")+" "+$(data.self).attr("w")+","+$(data.self).attr("h")+" "+$(data.self).attr("w")+",0";
        },
        x:0,
        y:0,
        w:function(data){return $(data.self).attr("w")},
        h:function(data){return $(data.self).attr("h")},
        rx:5,
        ry:5,
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },{
        type:"circle",
        r:4,
        stroke:"black",
        "stroke-width":3,
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        cx:function(data){return $(data.self).attr("w")-10},
        cy:function(data){return 7},
      },{
        type:"line",
        x1:function(data){return $(data.self).attr("w")-10},
        y1:function(data){return 11},
        x2:function(data){return $(data.self).attr("w")-10},
        y2:function(data){return 20},
        stroke:"black",
        "stroke-width":3
      },{
        type:"line",
        x1:function(data){return $(data.self).attr("w")-10},
        y1:function(data){return 20},
        x2:function(data){return $(data.self).attr("w")-14},
        y2:function(data){return 25},
        stroke:"black",
        "stroke-width":3
      },{
        type:"line",
        x1:function(data){return $(data.self).attr("w")-10},
        y1:function(data){return 20},
        x2:function(data){return $(data.self).attr("w")-6},
        y2:function(data){return 25},
        stroke:"black",
        "stroke-width":3
      },{
        type:"line",
        x1:function(data){return $(data.self).attr("w")-14},
        y1:function(data){return 14},
        x2:function(data){return $(data.self).attr("w")-6},
        y2:function(data){return 14},
        stroke:"black",
        "stroke-width":3
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"))},
          x:function(data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
        feel:{
          points:function(data){
            var result = [];
            var x = parseInt(configuration.nodeposition(data).x);
            var y = parseInt(configuration.nodeposition(data).y);
            var w = parseInt(configuration.nodeposition(data).width);
            var h = parseInt(configuration.nodeposition(data).height);
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
    },BusinessInterface:{
      new:function(){
        return configuration.createNewNode("BusinessInterface","My Business Interface");
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
        }
      },
      look:
      [{
        type:"rect",
        points:function(data){
          return "0,0 0,"+$(data.self).attr("h")+" "+$(data.self).attr("w")+","+$(data.self).attr("h")+" "+$(data.self).attr("w")+",0";
        },
        x:0,
        y:0,
        w:function(data){return $(data.self).attr("w")},
        h:function(data){return $(data.self).attr("h")},
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },{
        type:"circle",
        r:4,
        stroke:"black",
        "stroke-width":3,
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        cx:function(data){return $(data.self).attr("w")-10},
        cy:function(data){return 7},
      },{
        type:"line",
        x1:function(data){return $(data.self).attr("w")-14},
        y1:function(data){return 7},
        x2:function(data){return $(data.self).attr("w")-22},
        y2:function(data){return 7},
        stroke:"black",
        "stroke-width":3
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"))},
          x:function(data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
        feel:{
          points:function(data){
            var result = [];
            var x = parseInt(configuration.nodeposition(data).x);
            var y = parseInt(configuration.nodeposition(data).y);
            var w = parseInt(configuration.nodeposition(data).width);
            var h = parseInt(configuration.nodeposition(data).height);
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
    },InfrastructureInterface:{
      new:function(){
        return configuration.createNewNode("InfrastructureInterface","My Infrastructure Interface");
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
        }
      },
      look:
      [{
        type:"rect",
        points:function(data){
          return "0,0 0,"+$(data.self).attr("h")+" "+$(data.self).attr("w")+","+$(data.self).attr("h")+" "+$(data.self).attr("w")+",0";
        },
        x:0,
        y:0,
        w:function(data){return $(data.self).attr("w")},
        h:function(data){return $(data.self).attr("h")},
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },{
        type:"circle",
        r:4,
        stroke:"black",
        "stroke-width":3,
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        cx:function(data){return $(data.self).attr("w")-10},
        cy:function(data){return 7},
      },{
        type:"line",
        x1:function(data){return $(data.self).attr("w")-14},
        y1:function(data){return 7},
        x2:function(data){return $(data.self).attr("w")-22},
        y2:function(data){return 7},
        stroke:"black",
        "stroke-width":3
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"))},
          x:function(data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
        feel:{
          points:function(data){
            var result = [];
            var x = parseInt(configuration.nodeposition(data).x);
            var y = parseInt(configuration.nodeposition(data).y);
            var w = parseInt(configuration.nodeposition(data).width);
            var h = parseInt(configuration.nodeposition(data).height);
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
    },ApplicationInterface:{
      new:function(){
        return configuration.createNewNode("ApplicationInterface","My Application Interface");
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
        }
      },
      look:
      [{
        type:"rect",
        points:function(data){
          return "0,0 0,"+$(data.self).attr("h")+" "+$(data.self).attr("w")+","+$(data.self).attr("h")+" "+$(data.self).attr("w")+",0";
        },
        x:0,
        y:0,
        w:function(data){return $(data.self).attr("w")},
        h:function(data){return $(data.self).attr("h")},
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },{
        type:"circle",
        r:4,
        stroke:"black",
        "stroke-width":3,
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        cx:function(data){return $(data.self).attr("w")-10},
        cy:function(data){return 7},
      },{
        type:"line",
        x1:function(data){return $(data.self).attr("w")-14},
        y1:function(data){return 7},
        x2:function(data){return $(data.self).attr("w")-22},
        y2:function(data){return 7},
        stroke:"black",
        "stroke-width":3
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"))},
          x:function(data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
        feel:{
          points:function(data){
            var result = [];
            var x = parseInt(configuration.nodeposition(data).x);
            var y = parseInt(configuration.nodeposition(data).y);
            var w = parseInt(configuration.nodeposition(data).width);
            var h = parseInt(configuration.nodeposition(data).height);
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
    },
    BusinessRole:{
      new:function(){
        return configuration.createNewNode("BusinessRole","My Business Role");
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
        }
      },
      look:
      [{
        type:"polygon",
        points:function(data){
          return "0,0 0,"+$(data.self).attr("h")+" "+$(data.self).attr("w")+","+$(data.self).attr("h")+" "+$(data.self).attr("w")+",0";
        },
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },
      {
        type:"ellipse",
        stroke:"black",
        "stroke-width":1,
        fill:"none",
        cx:function(data){return $(data.self).attr("w")-15},
        cy:function(data){return 7},
        rx:function(data){return 2.5},
        ry:function(data){return 5}
      },{
        type:"rect",
        stroke:"black",
        "stroke-width":1,
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        x:function(data){return $(data.self).attr("w")-15},
        y:function(data){return 2},
        w:function(data){return 10},
        h:function(data){return 10}
      },{
        type:"rect",
        stroke:"none",
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        x:function(data){return $(data.self).attr("w")-15.5},
        y:function(data){return 2},
        w:function(data){return 12},
        h:function(data){return 10}
      },{
        type:"ellipse",
        stroke:"black",
        "stroke-width":1,
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        cx:function(data){return $(data.self).attr("w")-5},
        cy:function(data){return 7},
        rx:function(data){return 2.5},
        ry:function(data){return 5}
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"))},
          x:function(data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
        feel:{
          points:function(data){
            var result = [];
            var x = parseInt(configuration.nodeposition(data).x);
            var y = parseInt(configuration.nodeposition(data).y);
            var w = parseInt(configuration.nodeposition(data).width);
            var h = parseInt(configuration.nodeposition(data).height);
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
    },BusinessInteraction:{
      new:function(){
        return configuration.createNewNode("BusinessInteraction","My Business Interaction");
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
        }
      },
      look:
      [{
        type:"rect",
        points:function(data){
          return "0,0 0,"+$(data.self).attr("h")+" "+$(data.self).attr("w")+","+$(data.self).attr("h")+" "+$(data.self).attr("w")+",0";
        },
        x:0,
        y:0,
        w:function(data){return $(data.self).attr("w")},
        h:function(data){return $(data.self).attr("h")},
        rx:5,
        ry:5,
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },
      {
        type:"circle",
        stroke:"black",
        "stroke-width":3,
        fill:"none",
        cx:function(data){return $(data.self).attr("w")-7},
        cy:function(data){return 7},
        r:function(data){return 5},
      },{
        type:"rect",
        stroke:"black",
        "stroke-width":1,
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        x:function(data){return $(data.self).attr("w")-11.5},
        y:function(data){return 2},
        w:function(data){return 3},
        h:function(data){return 10}
      },{
        type:"circle",
        stroke:"black",
        "stroke-width":3,
        fill:"none",
        cx:function(data){return $(data.self).attr("w")-13},
        cy:function(data){return 7},
        r:function(data){return 5},
      },{
        type:"rect",
        stroke:"none",
        "stroke-width":1,
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        x:function(data){return $(data.self).attr("w")-11.5},
        y:function(data){return 1},
        w:function(data){return 3},
        h:function(data){return 12}
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"))},
          x:function(data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
        feel:{
          points:function(data){
            var result = [];
            var x = parseInt(configuration.nodeposition(data).x);
            var y = parseInt(configuration.nodeposition(data).y);
            var w = parseInt(configuration.nodeposition(data).width);
            var h = parseInt(configuration.nodeposition(data).height);
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
    },BusinessCollaboration:{
      new:function(){
        return configuration.createNewNode("BusinessCollaboration","My Business Collaboration");
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
        }
      },
      look:
      [{
        type:"polygon",
        points:function(data){
          return "0,0 0,"+$(data.self).attr("h")+" "+$(data.self).attr("w")+","+$(data.self).attr("h")+" "+$(data.self).attr("w")+",0";
        },
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },
      {
        type:"circle",
        stroke:"black",
        "stroke-width":3,
        fill:"none",
        cx:function(data){return $(data.self).attr("w")-7},
        cy:function(data){return 7},
        r:function(data){return 5},
      },{
        type:"circle",
        stroke:"black",
        "stroke-width":3,
        fill:"none",
        cx:function(data){return $(data.self).attr("w")-13},
        cy:function(data){return 7},
        r:function(data){return 5},
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"))},
          x:function(data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
        feel:{
          points:function(data){
            var result = [];
            var x = parseInt(configuration.nodeposition(data).x);
            var y = parseInt(configuration.nodeposition(data).y);
            var w = parseInt(configuration.nodeposition(data).width);
            var h = parseInt(configuration.nodeposition(data).height);
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
    },ApplicationCollaboration:{
      new:function(){
        return configuration.createNewNode("ApplicationCollaboration","My Application Collaboration");
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
        }
      },
      look:
      [{
        type:"polygon",
        points:function(data){
          return "0,0 0,"+$(data.self).attr("h")+" "+$(data.self).attr("w")+","+$(data.self).attr("h")+" "+$(data.self).attr("w")+",0";
        },
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },
      {
        type:"circle",
        stroke:"black",
        "stroke-width":3,
        fill:"none",
        cx:function(data){return $(data.self).attr("w")-7},
        cy:function(data){return 7},
        r:function(data){return 5},
      },{
        type:"circle",
        stroke:"black",
        "stroke-width":3,
        fill:"none",
        cx:function(data){return $(data.self).attr("w")-13},
        cy:function(data){return 7},
        r:function(data){return 5},
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"))},
          x:function(data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
        feel:{
          points:function(data){
            var result = [];
            var x = parseInt(configuration.nodeposition(data).x);
            var y = parseInt(configuration.nodeposition(data).y);
            var w = parseInt(configuration.nodeposition(data).width);
            var h = parseInt(configuration.nodeposition(data).height);
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
    },ApplicationInteraction:{
      new:function(){
        return configuration.createNewNode("ApplicationInteraction","My Application Interaction");
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
        }
      },
      look:
      [{
        type:"polygon",
        points:function(data){
          return "0,0 0,"+$(data.self).attr("h")+" "+$(data.self).attr("w")+","+$(data.self).attr("h")+" "+$(data.self).attr("w")+",0";
        },
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}

      },
      {
        type:"circle",
        stroke:"black",
        "stroke-width":3,
        fill:"none",
        cx:function(data){return $(data.self).attr("w")-7},
        cy:function(data){return 7},
        r:function(data){return 5},
      },{
        type:"rect",
        stroke:"black",
        "stroke-width":1,
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        x:function(data){return $(data.self).attr("w")-11.5},
        y:function(data){return 2},
        w:function(data){return 3},
        h:function(data){return 10}
      },{
        type:"circle",
        stroke:"black",
        "stroke-width":3,
        fill:"none",
        cx:function(data){return $(data.self).attr("w")-13},
        cy:function(data){return 7},
        r:function(data){return 5},
      },{
        type:"rect",
        stroke:"none",
        "stroke-width":3,
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        x:function(data){return $(data.self).attr("w")-11.5},
        y:function(data){return 1},
        w:function(data){return 3},
        h:function(data){return 12}
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"))},
          x:function(data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
        feel:{
          points:function(data){
            var result = [];
            var x = parseInt(configuration.nodeposition(data).x);
            var y = parseInt(configuration.nodeposition(data).y);
            var w = parseInt(configuration.nodeposition(data).width);
            var h = parseInt(configuration.nodeposition(data).height);
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
    },BusinessService:{
      new:function(){
        return configuration.createNewNode("BusinessService","My Business Service");
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
        }
      },
      look:
      [{
        type:"rect",
        points:function(data){
          return "0,0 0,"+$(data.self).attr("h")+" "+$(data.self).attr("w")+","+$(data.self).attr("h")+" "+$(data.self).attr("w")+",0";
        },
        x:0,
        y:0,
        w:function(data){return $(data.self).attr("w")},
        h:function(data){return $(data.self).attr("h")},
        rx:5,
        ry:5,
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },
      {
        type:"path",
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:"none",
        d:function(data){return "M "+($(data.self).attr("w")-17)+","+(13)+" c -5,0 -5,-10 0,-10 l 10 0 c +5,0 +5,+10 0,+10 z"}
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"))},
          x:function(data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
        feel:{
          points:function(data){
            var result = [];
            var x = parseInt(configuration.nodeposition(data).x);
            var y = parseInt(configuration.nodeposition(data).y);
            var w = parseInt(configuration.nodeposition(data).width);
            var h = parseInt(configuration.nodeposition(data).height);
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
    },InfrastructureService:{
      new:function(){
        return configuration.createNewNode("InfrastructureService","My Infrastructure Service");
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
        }
      },
      look:
      [{
        type:"rect",
        points:function(data){
          return "0,0 0,"+$(data.self).attr("h")+" "+$(data.self).attr("w")+","+$(data.self).attr("h")+" "+$(data.self).attr("w")+",0";
        },
        x:0,
        y:0,
        w:function(data){return $(data.self).attr("w")},
        h:function(data){return $(data.self).attr("h")},
        rx:5,
        ry:5,
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },
      {
        type:"path",
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:"none",
        d:function(data){return "M "+($(data.self).attr("w")-17)+","+(13)+" c -5,0 -5,-10 0,-10 l 10 0 c +5,0 +5,+10 0,+10 z"}
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"))},
          x:function(data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
        feel:{
          points:function(data){
            var result = [];
            var x = parseInt(configuration.nodeposition(data).x);
            var y = parseInt(configuration.nodeposition(data).y);
            var w = parseInt(configuration.nodeposition(data).width);
            var h = parseInt(configuration.nodeposition(data).height);
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
    },ApplicationService:{
      new:function(){
        return configuration.createNewNode("ApplicationService","My Application Service");
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
        }
      },
      look:
      [{
        type:"rect",
        points:function(data){
          return "0,0 0,"+$(data.self).attr("h")+" "+$(data.self).attr("w")+","+$(data.self).attr("h")+" "+$(data.self).attr("w")+",0";
        },
        x:0,
        y:0,
        w:function(data){return $(data.self).attr("w")},
        h:function(data){return $(data.self).attr("h")},
        rx:5,
        ry:5,
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },
      {
        type:"path",
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:"none",
        d:function(data){return "M "+($(data.self).attr("w")-17)+","+(13)+" c -5,0 -5,-10 0,-10 l 10 0 c +5,0 +5,+10 0,+10 z"}
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"))},
          x:function(data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
        feel:{
          points:function(data){
            var result = [];
            var x = parseInt(configuration.nodeposition(data).x);
            var y = parseInt(configuration.nodeposition(data).y);
            var w = parseInt(configuration.nodeposition(data).width);
            var h = parseInt(configuration.nodeposition(data).height);
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
    },
    Value:{
      new:function(){
        return configuration.createNewNode("Value","My Value");
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
        }
      },
      look:[{
        type:"ellipse",
        cx:function(data){return $(data.self).attr("w")/2},
        cy:function(data){return $(data.self).attr("h")/2},
        ry:function(data){return $(data.self).attr("h")/2},
        rx:function(data){return $(data.self).attr("w")/2},
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"))},
          x:function(data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
        feel:{
          points:function(data){
            var result = [];
            var x = parseInt(configuration.nodeposition(data).x);
            var y = parseInt(configuration.nodeposition(data).y);
            var w = parseInt(configuration.nodeposition(data).width);
            var h = parseInt(configuration.nodeposition(data).height);
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
      new:function(){
        return configuration.createNewNode("Contract","My Contract");
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
        }
      },
      look:
      [{
        type:"polygon",
        points:function(data){
          return "0,0 0,"+$(data.self).attr("h")+" "+$(data.self).attr("w")+","+$(data.self).attr("h")+" "+$(data.self).attr("w")+",0";
        },
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"polygon",
        points:function(data){
          return "0,0 0,"+$(data.self).attr("h")/3+" "+$(data.self).attr("w")+","+$(data.self).attr("h")/3+" "+$(data.self).attr("w")+",0";
        },
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
          type:"text",
          text:function(data){return $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text()},
          "alignment-baseline":"central",
          "text-anchor":"middle",
          x:function(data){
            return $(data.self).attr("w")/2
          },
          y:function(data){
            return configuration.globalCharheight/2+5;
          }

        }
    ],feel:{
      points:function(data){
        var result = [];
        var x = parseInt(configuration.nodeposition(data).x);
        var y = parseInt(configuration.nodeposition(data).y);
        var w = parseInt(configuration.nodeposition(data).width);
        var h = parseInt(configuration.nodeposition(data).height);
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
    }},DataObject:{
      new:function(){
        return configuration.createNewNode("DataObject","My Data Object");
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
        }
      },
      look:
      [{
        type:"polygon",
        points:function(data){
          return "0,0 0,"+$(data.self).attr("h")+" "+$(data.self).attr("w")+","+$(data.self).attr("h")+" "+$(data.self).attr("w")+",0";
        },
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"polygon",
        points:function(data){
          return "0,0 0,"+$(data.self).attr("h")/3+" "+$(data.self).attr("w")+","+$(data.self).attr("h")/3+" "+$(data.self).attr("w")+",0";
        },
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
          type:"text",
          innerHtml:function(data){
            return documentmodengine.functions.textDistributionToTSpan($(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text(),
            $(data.self).attr("w"),
            $(data.self).attr("h")/3.5)
          },
          "alignment-baseline":"central",
          "text-anchor":"middle",
          x:function(data){
            return $(data.self).attr("w")/2
          },
          y:function(data){
            return configuration.globalCharheight/2+5;
          }

        }
    ],feel:{
      points:function(data){
        var result = [];
        var x = parseInt(configuration.nodeposition(data).x);
        var y = parseInt(configuration.nodeposition(data).y);
        var w = parseInt(configuration.nodeposition(data).width);
        var h = parseInt(configuration.nodeposition(data).height);
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
    }},Artifact:{
      new:function(){
        return configuration.createNewNode("Artifact","My Artifact");
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
        }
      },
      look:
      [{
        type:"polygon",
        points:function(data){
          return "0,0 0,"+$(data.self).attr("h")+" "+$(data.self).attr("w")+","+$(data.self).attr("h")+" "+$(data.self).attr("w")+",0";
        },
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"path",
        d:function(data){

          return "M"+($(data.self).attr("w")-15)+" "+5+" l5 0 l5 5 l-5 0 l0 -5 m5 5 l0 10 l-10 0 l0 -15";
        },

        style:"stroke: black; fill:none;",
        fill:"none",
        stroke:"black"

      },{
            type:"text",
            innerHtml:function(data){
              var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
              return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"))},
            x:function(data){
              if($(data.self).children("node").size()>0){
                return 6;
              }else{
                return $(data.self).attr('w')/2
              }
            },
            y:function(data){
              if($(data.self).children("node").size()>0){
                return 8;
              }else
                {
                  return $(data.self).attr('h')/2
                }
              },
            "alignment-baseline":"central",
            "text-anchor":function(data){
              if($(data.self).children("node").size()>0){
                return "start";
              }else{
                return "middle";
              }
            }
          }
    ],feel:{
      points:function(data){
        var result = [];
        var x = parseInt(configuration.nodeposition(data).x);
        var y = parseInt(configuration.nodeposition(data).y);
        var w = parseInt(configuration.nodeposition(data).width);
        var h = parseInt(configuration.nodeposition(data).height);
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
    }},ApplicationFunction:{
      new:function(){
        return configuration.createNewNode("ApplicationFunction","My Application Function");
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
        }
      },
      look:
      [{
        type:"polygon",
        points:function(data){
          return "0,0 0,"+$(data.self).attr("h")+" "+$(data.self).attr("w")+","+$(data.self).attr("h")+" "+$(data.self).attr("w")+",0";
        },
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"path",
        d:function(data){

          return "M"+($(data.self).attr("w")-15)+" "+5+" l5 -2 l5 2 l0 7 l-5 -2 l-5 2 z";
        },

        style:"stroke: black; fill:none;",
        fill:"none",
        stroke:"black"

      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"))},
          x:function(data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }
    ],feel:{
      points:function(data){
        var result = [];
        var x = parseInt(configuration.nodeposition(data).x);
        var y = parseInt(configuration.nodeposition(data).y);
        var w = parseInt(configuration.nodeposition(data).width);
        var h = parseInt(configuration.nodeposition(data).height);
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
    }},InfrastructureFunction:{
      new:function(){
        return configuration.createNewNode("InfrastructureFunction","My Infrastructure Function");
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
        }
      },
      look:
      [{
        type:"polygon",
        points:function(data){
          return "0,0 0,"+$(data.self).attr("h")+" "+$(data.self).attr("w")+","+$(data.self).attr("h")+" "+$(data.self).attr("w")+",0";
        },
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"path",
        d:function(data){

          return "M"+($(data.self).attr("w")-15)+" "+5+" l5 -2 l5 2 l0 7 l-5 -2 l-5 2 z";
        },

        style:"stroke: black; fill:none;",
        fill:"none",
        stroke:"black"

      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"))},
          x:function(data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }
    ],feel:{
      points:function(data){
        var result = [];
        var x = parseInt(configuration.nodeposition(data).x);
        var y = parseInt(configuration.nodeposition(data).y);
        var w = parseInt(configuration.nodeposition(data).width);
        var h = parseInt(configuration.nodeposition(data).height);
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
    }},ApplicationComponent:{
      new:function(){
        return configuration.createNewNode("ApplicationComponent","My Application Component");
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
        }
      },
      look:
      [{
        type:"polygon",
        points:function(data){
          return "0,0 0,"+$(data.self).attr("h")+" "+$(data.self).attr("w")+","+$(data.self).attr("h")+" "+$(data.self).attr("w")+",0";
        },
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"rect",
        x:function(data){return $(data.self).attr("w")-21+3},
        y:0+3,
        w:15,
        h:15,
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },{
        type:"rect",
        x:function(data){return $(data.self).attr("w")-21},
        y:3+3,
        w:7,
        h:3,
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },{
        type:"rect",
        x:function(data){return $(data.self).attr("w")-21},
        y:9+3,
        w:7,
        h:3,
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"))},
          x:function(data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }
    ],feel:{
      points:function(data){
        var result = [];
        var x = parseInt(configuration.nodeposition(data).x);
        var y = parseInt(configuration.nodeposition(data).y);
        var w = parseInt(configuration.nodeposition(data).width);
        var h = parseInt(configuration.nodeposition(data).height);
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
    }},Node:{
      new:function(){
        return configuration.createNewNode("Node","My Node");
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
        }
      },
      look:
      [{
        type:"polygon",
        points:function(data){
          return "0,0 0,"+$(data.self).attr("h")+" "+$(data.self).attr("w")+","+$(data.self).attr("h")+" "+$(data.self).attr("w")+",0";
        },
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"rect",
        x:function(data){return $(data.self).attr("w")-21-3},
        y:0+3+5,
        w:15,
        h:10,
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },{
        type:"path",
        d:function(data){return "M"+($(data.self).attr("w")-21-3)+",8 l5,-3 l15,0 l-5,3 m5,-3 l0,10 l-5,3"},
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
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
              width = $(data.self).attr("w")
              return documentmodengine.functions.textDistributionToTSpan(text,width,height,ref_x,ref_y)},
          x:function(data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(data){
            if($(data.self).children("node").size()>0){
              return 12;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }
    ],feel:{
      points:function(data){
        var result = [];
        var x = parseInt(configuration.nodeposition(data).x);
        var y = parseInt(configuration.nodeposition(data).y);
        var w = parseInt(configuration.nodeposition(data).width);
        var h = parseInt(configuration.nodeposition(data).height);
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
    }},Device:{
      new:function(){
        return configuration.createNewNode("Device","My Device");
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
        }
      },
      look:
      [{
        type:"polygon",
        points:function(data){
          return "0,0 0,"+$(data.self).attr("h")+" "+$(data.self).attr("w")+","+$(data.self).attr("h")+" "+$(data.self).attr("w")+",0";
        },
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"rect",
        x:function(data){return $(data.self).attr("w")-15},
        y:0+3,
        w:10,
        h:5,
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },{
        type:"path",
        d:function(data){return "M"+($(data.self).attr("w")-15+2)+",8 l-2,2 l10,0 l-2,-2"},
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"))},
          x:function(data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }
    ],feel:{
      points:function(data){
        var result = [];
        var x = parseInt(configuration.nodeposition(data).x);
        var y = parseInt(configuration.nodeposition(data).y);
        var w = parseInt(configuration.nodeposition(data).width);
        var h = parseInt(configuration.nodeposition(data).height);
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
    }},SystemSoftware:{
      new:function(){
        return configuration.createNewNode("SystemSoftware","My System Software");
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
        }
      },
      look:
      [{
        type:"polygon",
        points:function(data){
          return "0,0 0,"+$(data.self).attr("h")+" "+$(data.self).attr("w")+","+$(data.self).attr("h")+" "+$(data.self).attr("w")+",0";
        },
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"circle",
        r:4,
        cx:function(data){return $(data.self).attr("w")-9},
        cy:function(data){return 9},
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"circle",
        r:4,
        cx:function(data){return $(data.self).attr("w")-10},
        cy:function(data){return 10},
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"))},
          x:function(data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }
    ],feel:{
      points:function(data){
        var result = [];
        var x = parseInt(configuration.nodeposition(data).x);
        var y = parseInt(configuration.nodeposition(data).y);
        var w = parseInt(configuration.nodeposition(data).width);
        var h = parseInt(configuration.nodeposition(data).height);
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
    }},Network:{
      new:function(){
        return configuration.createNewNode("Network","My Network");
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
        }
      },
      look:
      [{
        type:"polygon",
        points:function(data){
          return "0,0 0,"+$(data.self).attr("h")+" "+$(data.self).attr("w")+","+$(data.self).attr("h")+" "+$(data.self).attr("w")+",0";
        },
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"polygon",
        points:function(data){
          return ($(data.self).attr("w")-10)+",5 "+($(data.self).attr("w")-12)+",10 "+($(data.self).attr("w")-6)+",10 "+($(data.self).attr("w")-4)+",5 ";
        },
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"circle",
        r:1,
        cx:function(data){return $(data.self).attr("w")-10},
        cy:function(data){return 5},
        fill:"black",
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"circle",
        r:1,
        cx:function(data){return $(data.self).attr("w")-12},
        cy:function(data){return 10},
        fill:"black",
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"circle",
        r:1,
        cx:function(data){return $(data.self).attr("w")-4},
        cy:function(data){return 5},
        fill:"black",
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"circle",
        r:1,
        cx:function(data){return $(data.self).attr("w")-6},
        cy:function(data){return 10},
        fill:"black",
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"))},
          x:function(data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }
    ],feel:{
      points:function(data){
        var result = [];
        var x = parseInt(configuration.nodeposition(data).x);
        var y = parseInt(configuration.nodeposition(data).y);
        var w = parseInt(configuration.nodeposition(data).width);
        var h = parseInt(configuration.nodeposition(data).height);
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
    }},BusinessFunction:{
      new:function(){
        return configuration.createNewNode("BusinessFunction","My Business Function");
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
        }
      },
      look:
      [{
        type:"rect",
        points:function(data){
          return "0,0 0,"+$(data.self).attr("h")+" "+$(data.self).attr("w")+","+$(data.self).attr("h")+" "+$(data.self).attr("w")+",0";
        },
        x:0,
        y:0,
        w:function(data){return $(data.self).attr("w")},
        h:function(data){return $(data.self).attr("h")},
        rx:5,
        ry:5,
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },{
        type:"path",
        d:function(data){

          return "M"+($(data.self).attr("w")-15)+" "+5+" l5 -2 l5 2 l0 7 l-5 -2 l-5 2 z";
        },

        style:"stroke: black; fill:none;",
        fill:"none",
        stroke:"black"

      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"))},
          x:function(data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }
    ],feel:{
      points:function(data){
        var result = [];
        var x = parseInt(configuration.nodeposition(data).x);
        var y = parseInt(configuration.nodeposition(data).y);
        var w = parseInt(configuration.nodeposition(data).width);
        var h = parseInt(configuration.nodeposition(data).height);
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
    }},BusinessProcess:{
      new:function(){
        return configuration.createNewNode("BusinessProcess","My Business Process");
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
        }
      },
      look:
      [{
        type:"rect",
        points:function(data){
          return "0,0 0,"+$(data.self).attr("h")+" "+$(data.self).attr("w")+","+$(data.self).attr("h")+" "+$(data.self).attr("w")+",0";
        },
        x:0,
        y:0,
        w:function(data){return $(data.self).attr("w")},
        h:function(data){return $(data.self).attr("h")},
        rx:5,
        ry:5,
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },{
        type:"path",
        d:function(data){

          return "M"+($(data.self).attr("w")-20)+" "+5+" l10 0 l0 -2 l5 6 l-5 6 l0 -2 l-10 0 z";
        },

        style:"stroke: black; fill:none;",
        fill:"none",
        stroke:"black"

      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"))},
          x:function(data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }
    ],feel:{
      points:function(data){
        var result = [];
        var x = parseInt(configuration.nodeposition(data).x);
        var y = parseInt(configuration.nodeposition(data).y);
        var w = parseInt(configuration.nodeposition(data).width);
        var h = parseInt(configuration.nodeposition(data).height);
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
    }},BusinessEvent:{
      new:function(){
        return configuration.createNewNode("BusinessEvent","My Business Event");
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
        }
      },
      look:
      [{
        type:"rect",
        points:function(data){
          return "0,0 0,"+$(data.self).attr("h")+" "+$(data.self).attr("w")+","+$(data.self).attr("h")+" "+$(data.self).attr("w")+",0";
        },
        x:0,
        y:0,
        w:function(data){return $(data.self).attr("w")},
        h:function(data){return $(data.self).attr("h")},
        rx:5,
        ry:5,
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },
      {
        type:"path",
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:"none",
        d:function(data){return "M "+($(data.self).attr("w")-25)+","+(13)+" c +5,0 +5,-10 0,-10 l 15 0 c +5,0 +5,+10 0,+10 z"}
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"))},
          x:function(data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
        feel:{
          points:function(data){
            var result = [];
            var x = parseInt(configuration.nodeposition(data).x);
            var y = parseInt(configuration.nodeposition(data).y);
            var w = parseInt(configuration.nodeposition(data).width);
            var h = parseInt(configuration.nodeposition(data).height);
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
    },Representation:{
      new:function(){
        return configuration.createNewNode("Representation","My Representation");
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
        }
      },
      look:
      [{
        type:"path",
        stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(data){var fc = $( data.self ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        d:function(data){return "M 0,0 l "+$(data.self).attr("w")+",0 l 0,"+$(data.self).attr("h")+" c -15,-5 "+(-$(data.self).attr("w")/2)+",-5 "+(-$(data.self).attr("w")/2)+",10 c -10,10 "+(-$(data.self).attr("w")/2)+",0 "+(-$(data.self).attr("w")/2)+",-10 z"}
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data.element).children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text();
            return documentmodengine.functions.textDistributionToTSpan(text,$(data.self).attr("w"),$(data.self).attr("h"))},
          x:function(data){
            if($(data.self).children("node").size()>0){
              return 6;
            }else{
              return $(data.self).attr('w')/2
            }
          },
          y:function(data){
            if($(data.self).children("node").size()>0){
              return 8;
            }else
              {
                return $(data.self).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(data){
            if($(data.self).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
        feel:{
          points:function(data){
            var result = [];
            var x = parseInt(configuration.nodeposition(data).x);
            var y = parseInt(configuration.nodeposition(data).y);
            var w = parseInt(configuration.nodeposition(data).width);
            var h = parseInt(configuration.nodeposition(data).height);
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
      new:function(){
        return configuration.createNewEdge("AggregationRelationship","MyAggregationRelationship")
      },
      relates:[
        {end:"Contract", begin:"Product"},
        {end:"BusinessService", begin:"Product"},
        {end:"BusinessActor", begin:"BusinessCollaboration"},
        {end:"BusinessActor", begin:"BusinessActor"},
        {end:"ApplicationComponent", begin:"ApplicationCollaboration"}
      ],
      look:[

      ],
      stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
      "stroke-width":function(data){return $(data).children("style").attr("lineWidth")},
      "marker-start":"url(#AggregationRelationshipStart)",
      "style":function(data){return "marker-start:url(#AggregationRelationshipStart);"},
      points:function(data){
        var result = {
          shape1:[],
          path:[],
          shape2:[]
        };
        var points1f = configuration.nodes[configuration.nodetype(data.source_node)].feel.points;
        var points2f = configuration.nodes[configuration.nodetype(data.source_node)].feel.points;
        result.shape1 = points1f(data.source_node);
        result.shape2 = points2f(data.target_node);
        var bendpoints = $(data.self).find("bendpoint");
        for(var i = 0;i< bendpoints.size();i++){
          var point = {};
          point.x = bendpoints.eq(i).attr("x");
          point.y = bendpoints.eq(i).attr("y");
          result.path.push(point);
        }

        return result;
      }
    },
    CompositionRelationship:{
      new:function(){
        return configuration.createNewEdge("CompositionRelationship","MyCompositionRelationship")

      },
      relates:[
        {end:"BusinessRole", begin:"BusinessInterface"},
        {end:"ApplicationComponent", begin:"ApplicationInterface"},
        {end:"Node", begin:"InfrastructureInterface"}

      ],
      look:[

      ],
      stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
      "stroke-width":function(data){return $(data).children("style").attr("lineWidth")},
      "marker-start":"url(#AggregationRelationshipStart)",
      "style":function(data){return "marker-start:url(#CompositionRelationshipStart);"},
      points:function(data){
        var result = {
          shape1:[],
          path:[],
          shape2:[]
        };
        var points1f = configuration.nodes[configuration.nodetype(data.source_node)].feel.points;
        var points2f = configuration.nodes[configuration.nodetype(data.source_node)].feel.points;
        result.shape1 = points1f(data.source_node);
        result.shape2 = points2f(data.target_node);
        var bendpoints = $(data.self).find("bendpoint");
        for(var i = 0;i< bendpoints.size();i++){
          var point = {};
          point.x = bendpoints.eq(i).attr("x");
          point.y = bendpoints.eq(i).attr("y");
          result.path.push(point);
        }

        return result;
      }
    },
    RealisationRelationship:{
      new:function(){
        return configuration.createNewEdge("RealisationRelationship","MyRealisationRelationship")

      },
      relates:[
        {end:"BusinessObject", begin:"DataObject"},
        {end:"BusinessService",begin:"ApplicationFunction"},
        {end:"Plateau",begin:"Deliverable"},
        {end:"Deliverable",begin:"WorkPackage"},
        {end:"BusinessService",begin:"BusinessFunction"},
        {end:"BusinessService",begin:"BusinessProcess"},
        {end:"BusinessService",begin:"BusinessInteraction"}
      ],
      look:[

      ],
      stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
      "stroke-width":function(data){return $(data).children("style").attr("lineWidth")},
      "marker-start":"url(#AggregationRelationshipStart)",
      /*"style":function(data){return "marker-end:url(#RealisationRelationshipEnd);"},*/
      "marker-end":"url(#RealisationRelationshipEnd)",
      "stroke-dasharray":"5,5",
      points:function(data){
        var result = {
          shape1:[],
          path:[],
          shape2:[]
        };
        var points1f = configuration.nodes[configuration.nodetype(data.source_node)].feel.points;
        var points2f = configuration.nodes[configuration.nodetype(data.target_node)].feel.points;
        result.shape1 = points1f(data.source_node);
        result.shape2 = points2f(data.target_node);
        var bendpoints = $(data.self).find("bendpoint");
        for(var i = 0;i< bendpoints.size();i++){
          var point = {};
          point.x = bendpoints.eq(i).attr("x");
          point.y = bendpoints.eq(i).attr("y");
          result.path.push(point);
        }

        return result;
      }
    },
    AssociationRelationship:{
      new:function(){
        return configuration.createNewEdge("AssociationRelationship","MyAssociationRelationship")
      },
      relates:[
        {end:"Value", begin:"Product"},
        {end:"Value", begin:"BusinessService"},
        {end:"Meaning",begin:"BusinessObject"},
        {end:"Node",begin:"CommunicationPath"},
        {end:"Device",begin:"Network"},
        {end:"Network",begin:"Node"},
        {end:"Stakeholder",begin:"MotivationalElement"},
        {end:"Goal",begin:"Driver"},
        {end:"Assesment",begin:"Driver"},
        {end:"Assesment",begin:"Goal"},
        {end:"Gap",begin:"Plateau"},
        {end:"BusinessInterface",begin:"BusinessActor"}
      ],
      look:[

      ],
      stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
      "stroke-width":function(data){return $(data).children("style").attr("lineWidth")},
      "style":function(data){return ""},
      points:function(data){
        var result = {
          shape1:[],
          path:[],
          shape2:[]
        };
        var points1f = configuration.nodes[configuration.nodetype(data.source_node)].feel.points;
        var points2f = configuration.nodes[configuration.nodetype(data.source_node)].feel.points;
        result.shape1 = points1f(data.source_node);
        result.shape2 = points2f(data.target_node);
        var bendpoints = $(data.self).find("bendpoint");
        for(var i = 0;i< bendpoints.size();i++){
          var point = {};
          point.x = bendpoints.eq(i).attr("x");
          point.y = bendpoints.eq(i).attr("y");
          result.path.push(point);
        }

        return result;
      }
    },
    AssignmentRelationship:{
      new:function(){
        return configuration.createNewEdge("AssignmentRelationship","MyAssignmentRelationship")

      },
      relates:[
        {end:"Location", begin:"BusinessObject"},
        {end:"Location", begin:"Representations"},
        {end:"BusinessRole",begin:"BusinessActor"},
        {end:"BusinessActor",begin:"Location"},
        {end:"BusinessProcess",begin:"BusinessRole"},
        {end:"BusinessFunction",begin:"BusinessRole"},
        {end:"BusinessInteraction",begin:"BusinessRole"},
        {end:"ApplicationInterface",begin:"ApplicationService"},
        {end:"ApplicationComponent",begin:"ApplicationFunction"},
        {end:"ApplicationComponent",begin:"ApplicationInteraction"},
        {end:"InfrastructureService",begin:"InfrastructureInterface"},
        {end:"SystemSoftware",begin:"Device"},
        {end:"Artifcact",begin:"Node"},
        {end:"InfrastructureFunction",begin:"Node"}
      ],
      look:[

      ],
      stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
      "stroke-width":function(data){return $(data).children("style").attr("lineWidth")},
      "style":function(data){return "marker-start:url(#AssignmentRelationshipStartEnd);marker-end:url(#AssignmentRelationshipStartEnd);"},
      points:function(data){
        var result = {
          shape1:[],
          path:[],
          shape2:[]
        };
        var points1f = configuration.nodes[configuration.nodetype(data.source_node)].feel.points;
        var points2f = configuration.nodes[configuration.nodetype(data.source_node)].feel.points;
        result.shape1 = points1f(data.source_node);
        result.shape2 = points2f(data.target_node);
        var bendpoints = $(data.self).find("bendpoint");
        for(var i = 0;i< bendpoints.size();i++){
          var point = {};
          point.x = bendpoints.eq(i).attr("x");
          point.y = bendpoints.eq(i).attr("y");
          result.path.push(point);
        }

        return result;
      }
    },
    UsedByRelationship:{
      new:function(){
        return configuration.createNewEdge("UsedByRelationship","MyUsedByRelationship")

      },
      relates:[
        {end:"BusinessService", begin:"BusinessActor"},
        {end:"BusinessService", begin:"BusinessRole"},
        {end:"BusinessService", begin:"BusinessProcess"},
        {end:"BusinessService",begin:"BusinessFunction"},
        {end:"BusinessService",begin:"BusinessInteraction"},
        {end:"BusinessInterface",begin:"BusinessActor"},

        {end:"ApplicationService",begin:"ApplicationComponent"},
        {end:"ApplicationService",begin:"ApplicationFunction"},
        {end:"ApplicationService",begin:"ApplicationInteraction"},

        {end:"InfrastructureInterface",begin:"Node"},
        {end:"InfrastructureService",begin:"InfrastructureFunction"},
        {end:"InfrastructureService",begin:"Node"}

      ],
      look:[

      ],
      stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
      "stroke-width":function(data){return $(data).children("style").attr("lineWidth")},
      "style":function(data){return "marker-end:url(#UsedByRelationshipEnd);"},
      points:function(data){
        var result = {
          shape1:[],
          path:[],
          shape2:[]
        };
        var points1f = configuration.nodes[configuration.nodetype(data.source_node)].feel.points;
        var points2f = configuration.nodes[configuration.nodetype(data.source_node)].feel.points;
        result.shape1 = points1f(data.source_node);
        result.shape2 = points2f(data.target_node);
        var bendpoints = $(data.self).find("bendpoint");
        for(var i = 0;i< bendpoints.size();i++){
          var point = {};
          point.x = bendpoints.eq(i).attr("x");
          point.y = bendpoints.eq(i).attr("y");
          result.path.push(point);
        }

        return result;
      }
    },
    TriggeringRelationship:{
      look:[

      ],
      stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
      "stroke-width":function(data){return $(data).children("style").attr("lineWidth")},
      "style":function(data){return "marker-end:url(#TriggeringRelationshipEnd);"},
      points:function(data){
        var result = {
          shape1:[],
          path:[],
          shape2:[]
        };
        var points1f = configuration.nodes[configuration.nodetype(data.source_node)].feel.points;
        var points2f = configuration.nodes[configuration.nodetype(data.source_node)].feel.points;
        result.shape1 = points1f(data.source_node);
        result.shape2 = points2f(data.target_node);
        var bendpoints = $(data.self).find("bendpoint");
        for(var i = 0;i< bendpoints.size();i++){
          var point = {};
          point.x = bendpoints.eq(i).attr("x");
          point.y = bendpoints.eq(i).attr("y");
          result.path.push(point);
        }

        return result;
      }
    },FlowRelationship:{
      new:function(){
        return configuration.createNewEdge("FlowRelationship","MyFlowRelationship")
      },
      relates:[
        {end:"BusinessActor", begin:"BusinessActor"}
      ],
      look:[

      ],
      stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
      "stroke-width":function(data){return $(data).children("style").attr("lineWidth")},
      "style":function(data){return "marker-end:url(#TriggeringRelationshipEnd);"},
      "stroke-dasharray":"5,5",
      points:function(data){
        var result = {
          shape1:[],
          path:[],
          shape2:[]
        };
        var points1f = configuration.nodes[configuration.nodetype(data.source_node)].feel.points;
        var points2f = configuration.nodes[configuration.nodetype(data.source_node)].feel.points;
        result.shape1 = points1f(data.source_node);
        result.shape2 = points2f(data.target_node);
        var bendpoints = $(data.self).find("bendpoint");
        for(var i = 0;i< bendpoints.size();i++){
          var point = {};
          point.x = bendpoints.eq(i).attr("x");
          point.y = bendpoints.eq(i).attr("y");
          result.path.push(point);
        }

        return result;
      }
    },
    SpecialisationRelationship:{
      look:[

      ],
      stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
      "stroke-width":function(data){return $(data).children("style").attr("lineWidth")},
      "marker-start":"url(#AggregationRelationshipStart)",
      "style":function(data){return "marker-end:url(#RealisationRelationshipEnd);"},
      points:function(data){
        var result = {
          shape1:[],
          path:[],
          shape2:[]
        };
        var points1f = configuration.nodes[configuration.nodetype(data.source_node)].feel.points;
        var points2f = configuration.nodes[configuration.nodetype(data.source_node)].feel.points;
        result.shape1 = points1f(data.source_node);
        result.shape2 = points2f(data.target_node);
        var bendpoints = $(data.self).find("bendpoint");
        for(var i = 0;i< bendpoints.size();i++){
          var point = {};
          point.x = bendpoints.eq(i).attr("x");
          point.y = bendpoints.eq(i).attr("y");
          result.path.push(point);
        }

        return result;
      }
    },
    AccessRelationship:{
      look:[

      ],
      stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
      "stroke-width":function(data){return $(data).children("style").attr("lineWidth")},
      "style":function(data){return "marker-end:url(#AccessRelationshipEnd);"},
      points:function(data){
        var result = {
          shape1:[],
          path:[],
          shape2:[]
        };
        var points1f = configuration.nodes[configuration.nodetype(data.source_node)].feel.points;
        var points2f = configuration.nodes[configuration.nodetype(data.source_node)].feel.points;
        result.shape1 = points1f(data.source_node);
        result.shape2 = points2f(data.target_node);
        var bendpoints = $(data.self).find("bendpoint");
        for(var i = 0;i< bendpoints.size();i++){
          var point = {};
          point.x = bendpoints.eq(i).attr("x");
          point.y = bendpoints.eq(i).attr("y");
          result.path.push(point);
        }

        return result;
      }
    },
    undefined:{
      look:[

      ],
      stroke:function(data){var fc = $( data.self ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
      "stroke-width":function(data){return $(data).children("style").attr("lineWidth")},
      points:function(data){
        var result = {
          shape1:[],
          path:[],
          shape2:[]
        };
        var points1f = configuration.nodes[configuration.nodetype(data.source_node)].feel.points;
        var points2f = configuration.nodes[configuration.nodetype(data.source_node)].feel.points;
        result.shape1 = points1f(data.source_node);
        result.shape2 = points2f(data.target_node);
        var bendpoints = $(data.self).find("bendpoint");
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
