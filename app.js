//TODO: on mousemove: move only a rectangle as a shadow of the moveable target and then only redraw once!
//TODO: move bendpoints
//TODO: crate new node
//TODO: create new relation


function prepare(url,after,lang){
  if(!this.configuration)return;
  this.functions.usersettings.lang = lang;
  $.ajax(
    {
      type: 'GET',
      async: true,
      url:  url,
    }).done(function(xml){
      //prepare xml file.
      //I need all data for each connection and each node!
      var view = $(xml).children().children('views');//.children().eq(view_sel)

      view.find('node').each(
        function(i,e){
          var eref = $(e).attr("elementref");
          if(eref){
            var element_ref = $(xml).children().children("elements").children('element[identifier="'+eref+'"]');
            $(e).append(element_ref.clone());
          }
        }
      );

      view.find('connection').each(
        function(i,e){
          var relref = $(e).attr("relationshipref");
          //references to nodes
          var srcref_nd = $(e).attr("source");
          var tarref_nd = $(e).attr("target");
          if(relref){
            var relationship_ref = $(xml).children().children("relationships").children('relationship[identifier="'+relref+'"]');
            var srcref_el = $(relationship_ref).attr("source");
            var tarref_el = $(relationship_ref).attr("target");
            var sourceref_element = $(xml).children().children("elements").children('element[identifier="'+srcref_el+'"]');
            var targetref_element = $(xml).children().children("elements").children('element[identifier="'+tarref_el+'"]');
            $(relationship_ref).append("<source/>");
            $(relationship_ref).children("source").append(sourceref_element.clone());
            $(relationship_ref).append("<target/>");
            $(relationship_ref).children("target").append(targetref_element.clone());
            $(e).append(relationship_ref.clone());
          }
          if(srcref_nd){
            var sourceref_node = $(view).find('node[identifier="'+srcref_nd+'"]');
            $(e).append("<source/>");
          }
          if(tarref_nd){
            var targetref_node = $(view).find('node[identifier="'+tarref_nd+'"]');
            $(e).append("<target/>");
          }
        }
      );
      //preparation done;

      //create tabs;
      var views = $(xml).children().children('views').children();
      d3.select("body")
      .select("iron-pages.tabcontents")
      .selectAll("div")
      .data(views).enter()
      .append("div")
      .attr("id",function(d){
        return $(d).attr("identifier");
      });

      d3.select("body")
      .select("paper-tabs.tabs")
      .selectAll("paper-tab")
      .data(views).enter()
      .append("paper-tab")
      /*.attr("href",function(d){
        return "#"+$(d).attr("identifier");
      })*/.text(function(d){
        return $(d).children('label[xml\\:lang="'+lang+'"]').text();
      });


      for(var i = 0; i < views.size();i++){
        var node = d3.select("body")
        .select("iron-pages.tabcontents")
        .select("div#"+$(views[i]).attr("identifier"));
        after(node,views[i],lang)
      }

    });
  }

  function init(view_node,view_xml,lang){

    //SETUP CANVAS

    view_node.append("svg");

    var svg = view_node.select("svg");
    var defs = svg.append("defs");
    //attach defs from configuration
    for(var i = 0;i<configuration.definitions.length;i++){
      var definition = configuration.definitions[i];
      var currentnode = defs.append(definition.type);
      currentnode.attr("id",definition.id);
      currentnode.attr("refX",definition.refX);
      currentnode.attr("refY",definition.refY);
      currentnode.attr("orient",definition.orient);
      currentnode.attr("markerWidth",definition.markerWidth);
      currentnode.attr("markerHeight",definition.markerHeight);

      for(var j=0;j<definition.look.length;j++){
        var currentelement = currentnode.append(definition.look[j].type);
        currentelement.attr("id",definition.id+j);
        if(definition.look[j].type=="circle"){
          currentelement.attr("cx",definition.look[j].cx);
          currentelement.attr("cy",definition.look[j].cy);
          currentelement.attr("r",definition.look[j].r);
          currentelement.attr("style",definition.look[j].style);
        }else if(definition.look[j].type=="path"){
          currentelement.attr("d",definition.look[j].d);
          currentelement.attr("style",definition.look[j].style);
        }
      }
    }

    //interaction
    view_node
    .select("svg")
    .on('mouseup',
    function(d){
      if(d3.event.ctrlKey) return;
      view_node
      .select("svg")
      .selectAll("g[selected=true]").each(function(d){
        d3.select(this).attr("selected", false);
      });

    }).on('mousemove',
    function(d){
      if(d3.event.ctrlKey) return;
      view_node
      .select("svg")
      .selectAll("g.node[selected=true]").each(function(d){
        /* calculate new position */
        var sel_x = d3.select(this).attr('selected_x');
        var sel_y = d3.select(this).attr('selected_y');
        var x = d3.event.x-sel_x;
        var y = d3.event.y-sel_y;
        functions.updateNode(d3.select(this),x,y);
      });


    });


    function drawNodes(data){

      var g = view_node
      .select("svg")
      .selectAll("svg\\:g#node")
      .data(
        data
      );

      g.enter().append('svg:g');
      g.on('mousedown',function(d){
        d3.select(this).attr('selected',true);
        d3.select(this).attr('selected_x',d3.event.x-$(d3.select(this)[0]).attr("x"));
        d3.select(this).attr('selected_y',d3.event.y-$(d3.select(this)[0]).attr("y"));
        //check if near the borders
      })
      .attr('class',function(d){
        return 'node '+configuration.nodetype(d)
      })
      .attr('id',function(d){
        return $(d).attr("identifier");
      });

      this.drawNode = function(node){

      var g_svg = node;

      var type = node.each(
        function(d,i){
          var type = configuration.nodetype(d)
          var typeconf = configuration.nodes[type];
          if(!typeconf){
            typeconf = configuration.nodes[undefined];
          }
          if(typeconf){
          var lookelements = typeconf.look;
            for(var i = 0;i<lookelements.length;i++){
              d3.select(this).select(lookelements[i].type+".POS"+i).remove();
              d3.select(this).append('svg:'+lookelements[i].type).classed("POS"+i,true)
              if(lookelements[i].type == "polygon"){
                d3.select(this).select(lookelements[i].type+".POS"+i)
                .style('fill', function(d) {
                  return functions.getValueFromData(lookelements[i].fill,d);
                  //var fc = $( d ).children("style").children("fillColor");
                  //return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"
                })
                .style('stroke', function(d) {
                  return functions.getValueFromData(lookelements[i].stroke,d);
                  //var fc = $( d ).children("style").children("lineColor");
                  //return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";
                })
                .attr("points",function(d){
                  return functions.getValueFromData(lookelements[i].points,d);
                    //return functions.getPointsStringFromConfiguration(lookelements[i].points,d);
                });
              }else if(lookelements[i].type == "circle"){
                d3.select(this).select(lookelements[i].type+".POS"+i)
                .style('fill', function(d) {
                  return functions.getValueFromData(lookelements[i].fill,d);
                })
                .style('stroke', function(d) {
                  return functions.getValueFromData(lookelements[i].stroke,d);
                  //var fc = $( d ).children("style").children("lineColor");
                  //return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";
                })
                .attr("r",function(d){
                  return functions.getValueFromData(lookelements[i].r,d);
                })
                .attr("cx",function(d){
                  return functions.getValueFromData(lookelements[i].cx,d);
                })
                .attr("cy",function(d){
                  return functions.getValueFromData(lookelements[i].cy,d);
                })
              }else if(lookelements[i].type == "line"){
                d3.select(this).select(lookelements[i].type+".POS"+i)
                .style('fill', function(d) {
                  return functions.getValueFromData(lookelements[i].fill,d);
                  //var fc = $( d ).children("style").children("fillColor");
                  //return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"
                })
                .style('stroke', function(d) {
                  return functions.getValueFromData(lookelements[i].stroke,d);
                  //var fc = $( d ).children("style").children("lineColor");
                  //return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";
                })
                .attr("x1",function(d){
                  return functions.getValueFromData(lookelements[i].x1,d);
                })
                .attr("y1",function(d){
                  return functions.getValueFromData(lookelements[i].y1,d);
                })
                .attr("x2",function(d){
                  return functions.getValueFromData(lookelements[i].x2,d);
                })
                .attr("y2",function(d){
                  return functions.getValueFromData(lookelements[i].y2,d);
                })
              }else if(lookelements[i].type == "ellipse"){
                d3.select(this).select(lookelements[i].type+".POS"+i)
                .style('fill', function(d) {
                  var fc = $( d ).children("style").children("fillColor");
                  return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"
                })
                .style('stroke', function(d) {
                  var fc = $( d ).children("style").children("lineColor");
                  return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";
                })
                .attr("cx",function(d){
                  return functions.getValueFromData(lookelements[i].cx,d);
                })
                .attr("cy",function(d){
                  return functions.getValueFromData(lookelements[i].cy,d);
                })
                .attr("rx",function(d){
                  return functions.getValueFromData(lookelements[i].rx,d);
                })
                .attr("ry",function(d){
                  return functions.getValueFromData(lookelements[i].ry,d);
                })
              }else if(lookelements[i].type == "rect"){
                d3.select(this).select(lookelements[i].type+".POS"+i)
                .style('fill', function(d) {
                  return functions.getValueFromData(lookelements[i].fill,d);
                })
                .style('stroke', function(d) {
                  return functions.getValueFromData(lookelements[i].stroke,d);
                })
                .style('stroke-width', function(d) {
                  return functions.getValueFromData(lookelements[i]['stroke-width'],d);
                })
                .attr("x",function(d){
                  return functions.getValueFromData(lookelements[i].x,d);
                })
                .attr("y",function(d){
                  return functions.getValueFromData(lookelements[i].y,d);
                })
                .attr("width",function(d){
                  return functions.getValueFromData(lookelements[i].w,d);
                })
                .attr("height",function(d){
                  return functions.getValueFromData(lookelements[i].h,d);
                })
                .attr("ry",function(d){
                  return functions.getValueFromData(lookelements[i].ry,d);
                })
                .attr("rx",function(d){
                  return functions.getValueFromData(lookelements[i].rx,d);
                })
              }else if(lookelements[i].type == "path"){
                d3.select(this).select(lookelements[i].type+".POS"+i)
                .attr("style",function(d){
                  return functions.getValueFromData(lookelements[i].style,d);
                }).style('fill', function(d) {
                  return functions.getValueFromData(lookelements[i].fill,d);
                }).style('stroke', function(d) {
                  return functions.getValueFromData(lookelements[i].stroke,d);
                }).attr("stroke-dasharray",function(d){
                  return functions.getValueFromData(lookelements[i]["stroke-dasharray"],d);
                }).attr("d",function(d){
                  return functions.getValueFromData(lookelements[i].d,d);
                })

              }else if(lookelements[i].type == "text"){
                var text = d3.select(this).select(lookelements[i].type+".POS"+i);
                text.attr("style",function(d){
                  return functions.getValueFromData(lookelements[i].style,d);
                }).attr("x",function(d){
                  return functions.getValueFromData(lookelements[i].x,d);
                }).attr("y",function(d){
                  return functions.getValueFromData(lookelements[i].y,d);
                }).attr("alignment-baseline",function(d){
                  return functions.getValueFromData(lookelements[i]["alignment-baseline"],d);
                }).attr("text-anchor",function(d){
                  return functions.getValueFromData(lookelements[i]["text-anchor"],d);
                })

                if(lookelements[i].innerHtml){
                  text.html(function(d){
                    return functions.getValueFromData(lookelements[i].innerHtml,d);
                  })
                }else{
                  text.text(function(d){
                    return functions.getValueFromData(lookelements[i].text,d);
                  })
                }

              }
            }
          }
        }
      );


      g_svg.attr("x",
        function(d) {
          return $(d).attr('x');
        }).attr("y",
        function(d) {
          return $(d).attr('y');
        }).attr("transform",
        function(d) {
          return "translate(" + $(d).attr('x') + "," + $(d).attr('y') + ")";
        }).attr("archimate\\:points",function(d){
          //TODO this must be configuratebl by configurations.feel
          var x = parseInt($(d).attr('x'));
          var y = parseInt($(d).attr('y'));
          var w = parseInt($(d).attr('w'));
          var h = parseInt($(d).attr('h'));
          return  (x +(w/2))   + ',' + (y)  +' '
          +(x) + ',' +(y+(h/2)) +' '
          +(x +(w/2))    + ',' + (y+h) +' '
          +(x+w) + ',' + (y+(h/2))    +' ';
        });




        // show the node label
        nodelabel = node.append('svg:text')
        .attr('text-anchor',"middle")
        .attr('alignment-baseline',"central");

        nodelabel.each(function(d) {
          var text = $( d ).children('label[xml\\:lang="'+lang+'"]').text();
          return functions.textDistributionToTSpan(text,d3.select(this),$(d).attr("w"),$(d).attr("h"));
        });
        nodelabel.attr('x', function(d){
          return ($(d3.select(this)[0]).width()/2)+8;
        })
        .attr('y', function(d){
          return ($(d3.select(this)[0]).height()/2)+4;
        })
        ;

        // show the element label
        elementlabel = node.append('svg:text')
        .attr('text-anchor',"middle")
        .attr('alignment-baseline',"central");

        elementlabel.each(function(d) {
          var text = $( d ).children("element").children('label[xml\\:lang="'+lang+'"]').text();
          return functions.textDistributionToTSpan(text,d3.select(this),$(d).attr("w"),$(d).attr("h"));
        });

        elementlabel.attr('x', function(d){
          if($(d).children("node").size()>0){
            return ($(d3.select(this)[0]).width()/2)+8;
          }else{
            return $(d).attr('w')/2
          }
        })
        .attr('y', function(d){
          if($(d).children("node").size()>0){
            return ($(d3.select(this)[0]).height()/2)+4;
          }else
            {
              return $(d).attr('h')/2
            }
        });




      }
      drawNode(g);
      g.exit().remove();

      }

      this.drawEdges =  function(data){

        var g = view_node
        .select("svg")
        .selectAll("svg\\:g#connection")
        .data(
          data
        );

        g.enter().append('svg:g');

        g.on('mousedown',function(d){
          d3.select(this).attr('selected',true);
          var lines = d3.select(this).selectAll("line").each(function(d,i){
            if(i == 0){
              return;
            }

            if(functions.getNearToPoint(parseInt(d.x1),parseInt(d.y1),d3.event.x,d3.event.y,50)){
              d3.select(this).attr("selected","true");
            }else{
              d3.select(this).attr("selected","false");
            }
          });
          //d3.select(this).attr('selected_x',d3.event.x-$(d3.select(this)[0]).attr("x"));
          //d3.select(this).attr('selected_y',d3.event.y-$(d3.select(this)[0]).attr("y"));
        });


        this.drawEdge = function (edge) {
          edge.each(function(d,i){

            var currentedge = d3.select(this);

            var type = configuration.edgetype(d)
            var typeconf = configuration.edges[type];
            if(!typeconf){
              typeconf = configuration.edges[undefined];
            }
            if(typeconf){
              currentedge.selectAll("path").remove();
              currentedge.selectAll("text").remove();

              currentedge
              .attr("id",function(d){
                return $(d).attr("identifier")
              })
              .attr("source_node_id",function(d){
                return $(d).attr("source")
              })
              .attr("target_node_id",function(d){
                return $(d).attr("target")
              })
              .attr('class',function(d){
                return 'connection '+configuration.edgetype(d)
              })

              currentedge.append("svg\\:path")
                .attr("d",function(d){
                  var current = 0;
                  var result = "M ";

                  var sourceref_svg = $(d3.select("#"+$(d).attr("source"))[0]);
                  var lineColor = $( d ).children("style").children("lineColor");
                  var lineWidth = $( d ).children("style").attr("lineWidth") ? $( d ).children("style").attr("lineWidth") : 1;

                  var points1 = $(sourceref_svg).attr("points");
                  var points2 = [];
                  $(d).find("bendpoint").each(function(i,d_sub){
                    points2 = $(d_sub).attr("x")+","+$(d_sub).attr("y");

                    var pointsset = functions.getNearestTwoPointsFromTwoSets(functions.getPointArrayFromString(points1),
                    functions.getPointArrayFromString(points2));

                    result += pointsset.x1+","+pointsset.y1+" L ";
                    result += pointsset.x2+","+pointsset.y2+" L ";

                    current = current + 1;
                    points1 = points2;
                  })

                  var targetref_svg = $(d3.select("#"+$(d).attr("target"))[0]);
                  points2 = $(targetref_svg).attr("points");

                  var pointsset = functions.getNearestTwoPointsFromTwoSets(functions.getPointArrayFromString(points1),
                  functions.getPointArrayFromString(points2))
                  result += pointsset.x1+","+pointsset.y1+" L ";
                  result += pointsset.x2+","+pointsset.y2;
                  return result;
              }).attr("stroke-dasharray",function(d){
                return functions.getValueFromData(typeconf["stroke-dasharray"],d);
              }).attr("style",function(d){
                return functions.getValueFromData(typeconf.style,d);
              })
              .style("stroke",function(d){
                return functions.getValueFromData(typeconf.stroke,d);
              })
              .style("stroke-width",function(d){
                return functions.getValueFromData(typeconf["stroke-width"],d);
              })
              .style("fill","none");

              currentedge.append('svg:text')
                .text(function(d){
                return $(d).children("relationship").children('label[xml\\:lang="'+lang+'"]').text()
              })
              .attr("x",function(d){
                var path = d3.select(this.parentElement).select("path");
                var lines = functions.getPointArrayFromString(path.attr("d"));
                if((lines.length % 2) == 0){
                  var left = lines[(lines.length/2)-1];
                  var right = lines[(lines.length/2)];
                  return functions.getDistanceBetweenTwoPoints(parseInt($(left).attr("x")), parseInt($(right).attr("x")))
                }else{
                  var left = lines[0][(lines.length/2)-0.5];
                  return left.attr("x");
                }
              })
              .attr("y",function(d){
                var path = d3.select(this.parentElement).select("path");
                var lines = functions.getPointArrayFromString(path.attr("d"));
                if((lines.length % 2) == 0){
                  var left = lines[(lines.length/2)-1];
                  var right = lines[(lines.length/2)];
                  return functions.getDistanceBetweenTwoPoints(parseInt($(left).attr("y")), parseInt($(right).attr("y")))
                }else{
                  var left = lines[0][(lines.length/2)-0.5];
                  return left.attr("y");
                }
              });

              //TODO:attach a box to enwiden the frame of a connection

              /*edge.each(function(e,i){
                  var outline = this.getBBox();
                  d3.select(this).append("svg\\:rect")
                    .attr("x",outline.x-configuration.globalDelimiter)
                    .attr("y",outline.y-configuration.globalDelimiter)
                    .attr("width",outline.x+configuration.globalDelimiter)
                    .attr("height",outline.y+configuration.globalDelimiter);
                  })*/
                }
            })

        }
        this.drawEdge(g);
        g.exit().remove();

      }

      drawNodes($(view_xml).find("node")); //start Drawing Nodes
      drawEdges($(view_xml).find("connection")); //start Drawing Edges

      view_node.select("svg").attr("width",function(d){
        return d3.select(this)[0][0].getBBox().width;
      });
      view_node.select("svg").attr("height",function(d){
        return d3.select(this)[0][0].getBBox().height;
      });

    }

    this.functions = {
      usersettings: {},
      updateNode: function(node,x,y,h,w){
        var orig_x = parseInt($(node.data()[0]).attr("x"));
        var orig_y = parseInt($(node.data()[0]).attr("y"));

        /* redraw sub ordinated nodes */
        var nodes = $(node.data()).children("node")
        for(var i = 0 ; i< nodes.size();i++){
          var sub_node = d3.select("g#"+nodes.eq(i).attr("identifier"));
          x_sub = parseInt($(sub_node.data()[0]).attr("x"));
          y_sub = parseInt($(sub_node.data()[0]).attr("y"));
          functions.updateNode(sub_node,x_sub+(x-orig_x),y_sub+(y-orig_y));
        }

        /* this changes the data in the original xml */
        $(node.data()[0]).attr("x",x);
        $(node.data()[0]).attr("y",y);

        /*change of data is done; now redraw the changed parts */
        drawNode(node);

        /* find associated connections */
        var identifier = $(node.data()).attr("identifier");
        var targeted_connections = $(node.node().parentElement).find("g.connection[target_node_id='"+identifier+"']")
        var sourced_connections  = $(node.node().parentElement).find("g.connection[source_node_id='"+identifier+"']")

        for(var i = 0;i<sourced_connections.size();i++){
          drawEdge(d3.select(sourced_connections[i]));
        }

        for(var i = 0;i<targeted_connections.size();i++){
          drawEdge(d3.select(targeted_connections[i]));
        }
      },
      getDistanceBetweenTwoPoints: function(x1,x2){
        return (x2 < x1)?(((x1-x2)/2)+x2):(((x2-x1)/2)+x1)
      },

      getNearestTwoPointsFromTwoSets: function(array1,array2){
        if(array1.length>0&&array2.length>0){
          result = {};
          result.x1 = array1[0].x;
          result.y1 = array1[0].y;
          result.x2 = array2[0].x;
          result.y2 = array2[0].y;
          result.d = Math.sqrt(Math.pow(result.x1-result.x2,2)+Math.pow(result.y1-result.y2,2));
          for(var i = 0;i < array1.length;i++){
            for(var j = 0;j < array2.length;j++){
              var temp = Math.sqrt(Math.pow(array1[i].x-array2[j].x,2)+Math.pow(array1[i].y-array2[j].y,2));
              if(temp<result.d){
                result.x1 = array1[i].x;
                result.y1 = array1[i].y;
                result.x2 = array2[j].x;
                result.y2 = array2[j].y;
                result.d = temp;
              }
            }
          }
          return result;
        }else{
          throw "EmptyArrayException";
        }
      },

      getNearToPoint: function(x1,y1,x2,y2,d){
        if(!d){
          d=globalDelimiter;
        }
        if((Math.abs(x1-x2)<d)&&(Math.abs(y1-y2)<d)){
          return true;
        }
        return false;
      },

      getPointArrayFromString: function(str){
        if(str){
          str = str.replace("M","");
          str = str.replace("L","")
          var points = str.split(" ");
          var result = [];
          for(var i = 0;i < points.length;i++){
            var temp = points[i].split(",");
            if(temp.length==2){
              var obj = {};
              obj.x = temp[0];
              obj.y = temp[1];
              result.push(obj);
            }
          }
          return result;
        }else{
          throw "EmptyStringException"
        }

      },
      textDistributionToTSpan: function(text,width,height,ref_x,ref_y){
        if(!ref_x){
          ref_x = width/2
        }
        if(!ref_y){
          ref_y = height/Math.round(height / configuration.globalTextlines)
        }
        var result = "";
        if(text.length < (width/configuration.globalCharheight)-configuration.globalParagraph){
          result = text;
        }else{

          var texts = [];//text.split(" ");
          var space = 0;
          var start = 0;
          for(var i = 0; i < text.length;i++){
            if(text[i]==" "){
              space = i;
            }
            if( i-start  >= Math.floor((width/configuration.globalCharheight)-configuration.globalParagraph)){
              if(!(space > start)){
                space = text.indexOf(" ",start);
              }
              if(space>-1){
                texts.push(text.substring(start,space));
                start = space + 1;
              }
            }
            if(i==text.length-1){
              texts.push(text.substring(start,text.length));
            }
          }

          var i = 0;
          for(;i<Math.min(texts.length,Math.round(height / configuration.globalTextlines));i++){

            var addtext = "";
            if((i+1==Math.min(texts.length,Math.round(height / configuration.globalTextlines))
            && texts.length > Math.round(height / configuration.globalTextlines))
            || texts[i].length > (width/configuration.globalCharheight)-configuration.globalParagraph
            ){
              //1. make dots if text chunk is still too long
              //2. add dots if too much text for lines
              addtext = texts[i].substring(0,(width/configuration.globalCharheight))+"..."
            }else{
              addtext = texts[i];
            }


            var diff = Math.round(height / configuration.globalTextlines) - Math.min(texts.length,Math.round(height / configuration.globalTextlines));
            var dy = 15*(i+(diff/2));

            result +="<tspan x='"+ref_x+"' y='"+ref_y+"' dy='"+dy+"'>"+addtext+"</tspan>";

          }
        }
        return result;
      },textToTSpan: function(text,width,height){
          var result = "";
          if(text.length < (width/configuration.globalCharheight)-configuration.globalParagraph){
            result = text;
          }else{
            result = texts[i].substring(0,(width/configuration.globalCharheight))+"..."
          }

        return result;
      },
      getPointsStringFromConfiguration : function(configArray,data){
        var result = "";
        for(var i = 0;i < configArray.length;i++){
          var x = configArray[i].x;
          var y = configArray[i].y;
          x = functions.getValueFromData(x,data);
          y = functions.getValueFromData(y,data);
          result += x+","+y+" ";
        }
        return result.substring(0,result.length-1);
      },
      getValueFromData: function(value,data){
        if(typeof value == "function"){
          return value(data);
        }else{
          return value;
        }

      }

    }

prepare('http://localhost/Archisurance.xml',init,"de");
//prepare('http://localhost/Reference%20Model.xml',init,'en');
