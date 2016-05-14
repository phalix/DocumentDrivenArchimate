this.configuration = {
  globalDelimiter: 50,
  globalParagraph: 4,
  globalTextlines: 20,
  globalCharheight: 8,
  edgedistance: 10,
  view_extraction:function(data){return $(data).children().children('bpmndi\\:bpmndiagram');},//.children().eq(view_sel)},
  node_extraction:function(view,data){return view.children('bpmndi\\:BPMNShape','bpmndi\\:BPMNLane');},
  node_datacollector:function(node,data){
    var result = {};
    var nodeid = $(node).attr("id");
    var eref = $(node).attr("bpmnElement");
    if(eref){
      var element_ref = $(data).find('[id="'+eref+'"]');
      //attach element to node.
      result.element = element_ref[0];
      result.updates = [];

      var flownoderef = element_ref.children("semantic\\:flowNodeRef");
      for(var i=0;i<flownoderef.size();i++){
        var ref = flownoderef.eq(i).text();
        result.updates.push($(data).find('[bpmnElement="'+ref+'"]').attr("id"));
      }

      var edges = $(data).find('[sourceRef="'+eref+'"]');
      for(var i=0;i<edges.size();i++){
        var id = edges.eq(i).attr("id");
        result.updates.push($(data).find('[bpmnElement="'+id+'"]').attr("id"));
      }
      var edges = $(data).find('[targetRef="'+eref+'"]');
      for(var i=0;i<edges.size();i++){
        var id = edges.eq(i).attr("id");
        result.updates.push($(data).find('[bpmnElement="'+id+'"]').attr("id"));
      }
    }
    result.id = nodeid;
    return result;
  },
  nodetype:function(data){
    if($(data.element)){
        return $(data.element).prop("tagName");
    }else{
      return $(data.self).prop("tagName");
    }

  },
  nodeposition:function(node){
    var result = {};
    if(node.self){
      var bounds = $(node.self).children("dc\\:Bounds")
      result.x = bounds.attr('x');
      result.y = bounds.attr('y');
      result.width = bounds.attr('width');
      result.height = bounds.attr('height');
    }else{
      var bounds = $(node).children("dc\\:Bounds")
      result.x = bounds.attr('x');
      result.y = bounds.attr('y');
      result.width = bounds.attr('width');
      result.height = bounds.attr('height');
    }
    return result;
  },
  edge_extraction:function(view,data){return view.children('bpmndi\\:BPMNEdge');},
  edge_datacollector:function(edge,data){
    var result = {};
    var id = $(edge).attr("id");
    var eref = $(edge).attr("bpmnElement");
    if(eref){
      var element_ref = $(data).find('[id="'+eref+'"]');
      //attach element to node.
      result.element = element_ref[0];
      var source_ref = element_ref.attr("sourceRef");
      var target_ref = element_ref.attr("targetRef");
      var source_node = $(data).find('[bpmnElement="'+source_ref+'"]');
      var target_node = $(data).find('[bpmnElement="'+target_ref+'"]');
      result.source_node = source_node[0];
      result.target_node = target_node[0];
    }
    result.id = id;
    return result;
  },
  edgetype:function(data){
  if($(data.element)){
      return $(data.element).prop("tagName");
    }else{
    return $(data.self).prop("tagName");
  }},
  updateNodePosition: function(node,x,y){
    /* redraw sub ordinated nodes */
    $(node.self).children("dc\\:bounds").attr("x",x);
    $(node.self).children("dc\\:bounds").attr("y",y);

  },
  updateEdgePosition: function(edge,index,x,y){
    $(edge.self).children("di\\:waypoint").eq(index).attr("x",x);
    $(edge.self).children("di\\:waypoint").eq(index).attr("y",y);
  },deleteEdge: function(edge,index){
    $(edge.self).children("di\\:waypoint").eq(index).remove();
  },
  nodes:{
    undefined:{
      look:
      [{
        type:"rect",
        x:function(data){
          return 0;
        },y:function(data){
          return 0;
        },w:function(data){
          return $(data.self).children("dc\\:Bounds").attr("width");
        },h:function(data){
          return $(data.self).children("dc\\:Bounds").attr("height");
        },rx:5,ry:5,
        fill:"rgb(255,255,195)",
        stroke:"black"
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data.element).attr('name');
            var bbox  =configuration.nodeposition(data);
            return functions.textDistributionToTSpan(text,bbox.width,bbox.height)},
          x:function(data){

              return configuration.nodeposition(data).width/2;


          },
          y:function(data){
            return configuration.nodeposition(data).height/2;
            },
          "alignment-baseline":"central",
          "text-anchor":function(d){

              return "middle";

          }
        }],feel:{points:function(data){
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
        }}},
    "semantic:task":{
      look:
      [{
        type:"rect",
        x:function(data){
          return 0;
        },y:function(data){
          return 0;
        },w:function(data){
          return $(data.self).children("dc\\:Bounds").attr("width");
        },h:function(data){
          return $(data.self).children("dc\\:Bounds").attr("height");
        },rx:10,ry:10,
        fill:"rgb(255,255,195)",
        stroke:"black"
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data.element).attr('name');
            var bbox  =configuration.nodeposition(data);
            return functions.textDistributionToTSpan(text,bbox.width,bbox.height)},
          x:function(data){

              return configuration.nodeposition(data).width/2;


          },
          y:function(data){
            return configuration.nodeposition(data).height/2;
            },
          "alignment-baseline":"central",
          "text-anchor":function(d){

              return "middle";

          }
        }],feel:{points:function(data){
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
        }}},"semantic:startEvent":{
          look:
          [{
            type:"ellipse",
            cx:function(data){
              return $(data.self).children("dc\\:Bounds").attr("width")/2;
            },cy:function(data){
              return $(data.self).children("dc\\:Bounds").attr("height")/2;
            },rx:function(data){
              return $(data.self).children("dc\\:Bounds").attr("width")/2;
            },ry:function(data){
              return $(data.self).children("dc\\:Bounds").attr("height")/2;
            },
            fill:"white",
            stroke:"black"
          },{
              type:"text",
              innerHtml:function(data){
                var text = $(data.element).attr('name');
                var bbox  =configuration.nodeposition(data);
                return functions.textDistributionToTSpan(text,bbox.width*4,bbox.height*2,$(data.self).children("dc\\:Bounds").attr("width")/2,$(data.self).children("dc\\:Bounds").attr("height")*1.2)},
              x:function(data){

                  return configuration.nodeposition(data).width/2;


              },
              y:function(data){
                return configuration.nodeposition(data).height+10;
                },
              "alignment-baseline":"central",
              "text-anchor":function(d){

                  return "middle";

              }
            }],feel:{points:function(data){
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
            }}},"semantic:endEvent":{
              look:
              [{
                type:"ellipse",
                cx:function(data){
                  return $(data.self).children("dc\\:Bounds").attr("width")/2;
                },cy:function(data){
                  return $(data.self).children("dc\\:Bounds").attr("height")/2;
                },rx:function(data){
                  return $(data.self).children("dc\\:Bounds").attr("width")/2;
                },ry:function(data){
                  return $(data.self).children("dc\\:Bounds").attr("height")/2;
                },
                fill:"transparent",
                stroke:"black",
                "stroke-width":"3px"
              },{
                type:"ellipse",
                cx:function(data){
                  return $(data.self).children("dc\\:Bounds").attr("width")/2;
                },cy:function(data){
                  return $(data.self).children("dc\\:Bounds").attr("height")/2;
                },rx:function(data){
                  return $(data.self).children("dc\\:Bounds").attr("width")/3;
                },ry:function(data){
                  return $(data.self).children("dc\\:Bounds").attr("height")/3;
                },
                fill:"black",
                stroke:"black",
                "stroke-width":"3px"
              },{
                  type:"text",
                  innerHtml:function(data){
                    var text = $(data.element).attr('name');
                    var bbox  =configuration.nodeposition(data);
                    return functions.textDistributionToTSpan(text,bbox.width*4,bbox.height*2,$(data.self).children("dc\\:Bounds").attr("width")/2,$(data.self).children("dc\\:Bounds").attr("height")*1.5)},
                  x:function(data){

                      return configuration.nodeposition(data).width/2;


                  },
                  y:function(data){
                    return configuration.nodeposition(data).height+10;
                    },
                  "alignment-baseline":"central",
                  "text-anchor":function(d){

                      return "middle";

                  }
                }],feel:{points:function(data){
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
                }}},"semantic:intermediateCatchEvent":{
                  look:
                  [{
                    type:"ellipse",
                    cx:function(data){
                      return $(data.self).children("dc\\:Bounds").attr("width")/2;
                    },cy:function(data){
                      return $(data.self).children("dc\\:Bounds").attr("height")/2;
                    },rx:function(data){
                      return $(data.self).children("dc\\:Bounds").attr("width")/2;
                    },ry:function(data){
                      return $(data.self).children("dc\\:Bounds").attr("height")/2;
                    },
                    fill:"transparent",
                    stroke:"black",
                    "stroke-width":"2px"
                  },{
                    type:"ellipse",
                    cx:function(data){
                      return $(data.self).children("dc\\:Bounds").attr("width")/2;
                    },cy:function(data){
                      return $(data.self).children("dc\\:Bounds").attr("height")/2;
                    },rx:function(data){
                      return $(data.self).children("dc\\:Bounds").attr("width")/2.5;
                    },ry:function(data){
                      return $(data.self).children("dc\\:Bounds").attr("height")/2.5;
                    },
                    fill:"transparent",
                    stroke:"black",
                    "stroke-width":"2px"
                  },{
                      type:"text",
                      innerHtml:function(data){
                        var text = $(data.element).attr('name');
                        var bbox  =configuration.nodeposition(data);
                        return functions.textDistributionToTSpan(text,bbox.width*4,bbox.height*2,$(data.self).children("dc\\:Bounds").attr("width")/2,$(data.self).children("dc\\:Bounds").attr("height")*1.2)},
                      x:function(data){

                          return configuration.nodeposition(data).width/2;


                      },
                      y:function(data){
                        return parseInt(configuration.nodeposition(data).height)+10;
                        },
                      "alignment-baseline":"central",
                      "text-anchor":function(d){

                          return "middle";

                      }
                    }],feel:{points:function(data){
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
                    }}},"semantic:parallelGateway":{
                  look:
                  [{
                    type:"path",
                    d:function(data){
                      var width = $(data.self).children("dc\\:Bounds").attr("width");
                      var height = $(data.self).children("dc\\:Bounds").attr("height");
                      return "M 0,"+height/2+" L "+width/2+",0 L"+width+","+height/2+" L "+width/2+","+height+" L0,"+height/2;
                    },
                    fill:"white",
                    stroke:"black",
                    "stroke-width":"3"
                  },{
                    type:"path",
                    d:function(data){
                      var width = $(data.self).children("dc\\:Bounds").attr("width");
                      var height = $(data.self).children("dc\\:Bounds").attr("height");
                      return "M 8,"+height/2+" L "+((width)-8)+","+height/2+" M"+width/2+","+height/2+" M"+width/2+","+8+" L"+width/2+","+(height-8);
                    },
                    fill:"white",
                    stroke:"black",
                    "stroke-width":"3"
                  },{
                      type:"text",
                      innerHtml:function(data){
                        var text = $(data.element).attr('name');
                        var bbox  =configuration.nodeposition(data);
                        return functions.textDistributionToTSpan(text,bbox.width*4,bbox.height*2,$(data.self).children("dc\\:Bounds").attr("width")/2,$(data.self).children("dc\\:Bounds").attr("height")*1.5)},
                      x:function(data){

                          return configuration.nodeposition(data).width/2;


                      },
                      y:function(data){
                        return configuration.nodeposition(data).height+10;
                        },
                      "alignment-baseline":"central",
                      "text-anchor":function(d){

                          return "middle";

                      }
                    }],feel:{points:function(data){
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
                    }}},
        "semantic:task":{
              look:
              [{
                type:"rect",
                x:function(data){
                  return 0;
                },y:function(data){
                  return 0;
                },w:function(data){
                  return $(data.self).children("dc\\:Bounds").attr("width");
                },h:function(data){
                  return $(data.self).children("dc\\:Bounds").attr("height");
                },rx:10,ry:10,
                fill:"rgb(255,255,195)",
                stroke:"black"
              },{
                  type:"text",
                  innerHtml:function(data){
                    var text = $(data.element).attr('name');
                    var bbox  =configuration.nodeposition(data);
                    return functions.textDistributionToTSpan(text,bbox.width,bbox.height)},
                  x:function(data){

                      return configuration.nodeposition(data).width/2;


                  },
                  y:function(data){
                    return configuration.nodeposition(data).height/2;
                    },
                  "alignment-baseline":"central",
                  "text-anchor":function(d){

                      return "middle";

                  }
                }],feel:{points:function(data){
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
                }}},
                "semantic:lane":{
                  look:
                  [{
                    type:"rect",
                    x:function(data){
                      return 20;
                    },y:function(data){
                      return 0;
                    },w:function(data){
                      return $(data.self).children("dc\\:Bounds").attr("width")-20;
                    },h:function(data){
                      return $(data.self).children("dc\\:Bounds").attr("height");
                    },
                    fill:"white",
                    stroke:"black"
                  },{
                    type:"rect",
                    x:function(data){
                      return 0;
                    },y:function(data){
                      return 0;
                    },w:function(data){
                      return 20;
                    },h:function(data){
                      return $(data.self).children("dc\\:Bounds").attr("height");
                    },
                    fill:"white",
                    stroke:"black"
                  },{
                      type:"text",
                      innerHtml:function(data){
                        var text = $(data.element).attr('name');
                        var bbox  =configuration.nodeposition(data);
                        return functions.textDistributionToTSpan(text,bbox.width,bbox.height)},
                      x:function(data){

                          return 10;


                      },
                      y:function(data){
                        return configuration.nodeposition(data).height/2;
                        },
                      "alignment-baseline":"central",
                      "style":"writing-mode: tb",
                      "text-anchor":function(d){

                          return "middle";

                      }
                    }],feel:{points:function(data){
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
                    }}},
      "semantic:participant":{
        look:
        [],feel:{
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
        }}
      },
      edges:{
        undefined:{
          stroke:"black",
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
            var bendpoints = $(data.self).children("di\\:waypoint");
            for(var i = 0;i< bendpoints.size();i++){
              var point = {};
              point.x = bendpoints.eq(i).attr("x");
              point.y = bendpoints.eq(i).attr("y");
              result.path.push(point);
            }
            return result;
          }
      }},
      definitions:[]

}
