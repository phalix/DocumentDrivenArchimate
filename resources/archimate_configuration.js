this.configuration = {
  globalDelimiter: 50,
  globalParagraph: 4,
  globalTextlines: 20,
  globalCharheight: 8,
  nodetype:function(data){
    if($(data).children("element").attr("xsi:type")){
        return $(data).children("element").attr("xsi:type")
    }else{
      return $(data).attr("type")
    }

  },
  edgetype:function(data){return $(data).children("relationship").attr("xsi:type")},
  nodes:{
    undefined:{

      look:
      [{
        type:"polygon",
        points:function(data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        fill:function(data){var fc = $( data ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data).children('label[xml\\:lang="'+functions.usersettings.lang+'"]').text();
            return functions.textDistributionToTSpan(text,$(data).attr("w"),$(data).attr("h"))},
          x:function(d){
            if($(d).children("node").size()>0){
              return 6;
            }else{
              return $(d).attr('w')/2
            }
          },
          y:function(d){
            if($(d).children("node").size()>0){
              return 8;
            }else
              {
                return $(d).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(d){
            if($(d).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        },{
            type:"text",
            innerHtml:function(data){
              var text = $(data).children("element").children('label[xml\\:lang="'+functions.usersettings.lang+'"]').text();
              return functions.textDistributionToTSpan(text,$(data).attr("w"),$(data).attr("h"))},
            x:function(d){
              if($(d).children("node").size()>0){
                return 6;
              }else{
                return $(d).attr('w')/2
              }
            },
            y:function(d){
              if($(d).children("node").size()>0){
                return 8;
              }else
                {
                  return $(d).attr('h')/2
                }
              },
            "alignment-baseline":"central",
            "text-anchor":function(d){
              if($(d).children("node").size()>0){
                return "start";
              }else{
                return "middle";
              }
            }
          }]},
          group:{

            look:
            [{
              type:"path",
              d:function(data){
                //return "M"+$(data).attr("x")+","+$(data).attr("y")+" l"+$(data).attr("w")+",0 l0,"+$(data).attr("h")+" l"+(-$(data).attr("w"))+",0 z";
                return "M0,0 l"+$(data).attr("w")/2+",0 l0,20 l-"+$(data).attr("w")/2+",0 z";
              },
              fill:function(data){var fc = $( data ).children("style").children("fillColor");
                    return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
              stroke:function(data){var fc = $( data ).children("style").children("lineColor");
                    return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";},
              "stroke-dasharray":"5,5"
            },{
              type:"path",
              d:function(data){
                //return "M"+$(data).attr("x")+","+$(data).attr("y")+" l"+$(data).attr("w")+",0 l0,"+$(data).attr("h")+" l"+(-$(data).attr("w"))+",0 z";
                return "M0,20 l"+$(data).attr("w")+",0 l0,"+$(data).attr("h")+" l"+(-$(data).attr("w"))+",0 z";
              },
              fill:function(data){var fc = $( data ).children("style").children("fillColor");
                    return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
              stroke:function(data){var fc = $( data ).children("style").children("lineColor");
                    return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";},
              "stroke-dasharray":"5,5"
            },{
                type:"text",
                innerHtml:function(data){
                  var text = $(data).children('label[xml\\:lang="'+functions.usersettings.lang+'"]').text();
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
                      ref_x = $(data).attr('w')/2
                      ref_y = $(data).attr('h')/2
                      height = $(data).attr("h")
                    }
                    width = $(data).attr("w")/2
                    return functions.textDistributionToTSpan(text,width,height,ref_x,ref_y)},
                x:function(data){
                  if($(data).children("node").size()>0){
                    return 6;}else{
                  return $(data).attr("w")/2;
                  }
                },
                y:function(data){
                  if($(data).children("node").size()>0){
                    return 8;
                  }else{
                    return $(data).attr('h')/2;
                  }
                },
                "alignment-baseline":"central",
                "text-anchor":function(d){
                  if($(d).children("node").size()>0){
                    return "start";
                  }else
                    return "middle";
                }
              }]},
      Principle:{
        look:
        [{
          type:"path",
          d:function(data){

            return "M 5,0 l "+($(data).attr("w")-5)+",0 l 5,5 l 0,"+($(data).attr("h")-5)+" l-5,5 l"+(-$(data).attr("w")+5)+",0 l-5,-5 l0,"+(-$(data).attr("h")+5)+" z";
          },
          fill:function(data){var fc = $( data ).children("style").children("fillColor");
                return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
          stroke:function(data){var fc = $( data ).children("style").children("lineColor");
                return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
        },{
          type:"rect",
          x:function(data){return $(data).attr("w")-10},
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
          x:function(data){return $(data).attr("w")-7},
          y:12,
          style:"font-size:10px"
        }
    ,{
        type:"text",
        innerHtml:function(data){
          var text = $(data).children('label[xml\\:lang="'+functions.usersettings.lang+'"]').text();
          return functions.textDistributionToTSpan(text,$(data).attr("w"),$(data).attr("h"))},
        x:function(d){
          if($(d).children("node").size()>0){
            return 6;
          }else{
            return $(d).attr('w')/2
          }
        },
        y:function(d){
          if($(d).children("node").size()>0){
            return 8;
          }else
            {
              return $(d).attr('h')/2
            }
          },
        "alignment-baseline":"central",
        "text-anchor":function(d){
          if($(d).children("node").size()>0){
            return "start";
          }else{
            return "middle";
          }
        }
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data).children("element").children('label[xml\\:lang="'+functions.usersettings.lang+'"]').text();
            return functions.textDistributionToTSpan(text,$(data).attr("w"),$(data).attr("h"))},
          x:function(d){
            if($(d).children("node").size()>0){
              return 6;
            }else{
              return $(d).attr('w')/2
            }
          },
          y:function(d){
            if($(d).children("node").size()>0){
              return 8;
            }else
              {
                return $(d).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(d){
            if($(d).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }]},Requirement:{
          look:
          [{
            type:"path",
            d:function(data){

              return "M 5,0 l "+($(data).attr("w")-5)+",0 l 5,5 l 0,"+($(data).attr("h")-5)+" l-5,5 l"+(-$(data).attr("w")+5)+",0 l-5,-5 l0,"+(-$(data).attr("h")+5)+" z";
            },
            fill:function(data){var fc = $( data ).children("style").children("fillColor");
                  return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
            stroke:function(data){var fc = $( data ).children("style").children("lineColor");
                  return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
          },{
            type:"path",
            d:function(data){return
              "M "+$(data).attr("w")-10+",5 l10,0 l-3,5 l-10,0 l3,-5"
              },
            fill:"none",
            stroke:"black",
            "stroke-width":"0.5"
          }

      ,{
          type:"text",
          innerHtml:function(data){
            var text = $(data).children('label[xml\\:lang="'+functions.usersettings.lang+'"]').text();
            return functions.textDistributionToTSpan(text,$(data).attr("w"),$(data).attr("h"))},
          x:function(d){
            if($(d).children("node").size()>0){
              return 6;
            }else{
              return $(d).attr('w')/2
            }
          },
          y:function(d){
            if($(d).children("node").size()>0){
              return 8;
            }else
              {
                return $(d).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(d){
            if($(d).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        },{
            type:"text",
            innerHtml:function(data){
              var text = $(data).children("element").children('label[xml\\:lang="'+functions.usersettings.lang+'"]').text();
              return functions.textDistributionToTSpan(text,$(data).attr("w"),$(data).attr("h"))},
            x:function(d){
              if($(d).children("node").size()>0){
                return 6;
              }else{
                return $(d).attr('w')/2
              }
            },
            y:function(d){
              if($(d).children("node").size()>0){
                return 8;
              }else
                {
                  return $(d).attr('h')/2
                }
              },
            "alignment-baseline":"central",
            "text-anchor":function(d){
              if($(d).children("node").size()>0){
                return "start";
              }else{
                return "middle";
              }
            }
          }]},Goal:{
            look:
            [{
              type:"path",
              d:function(data){

                return "M 5,0 l "+($(data).attr("w")-5)+",0 l 5,5 l 0,"+($(data).attr("h")-5)+" l-5,5 l"+(-$(data).attr("w")+5)+",0 l-5,-5 l0,"+(-$(data).attr("h")+5)+" z";
              },
              fill:function(data){var fc = $( data ).children("style").children("fillColor");
                    return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
              stroke:function(data){var fc = $( data ).children("style").children("lineColor");
                    return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
            },{
              type:"circle",
              r:2,
              cx:function(data){return $(data).attr("w")-10},
              cy:function(data){return 10}
            },{
              type:"circle",
              r:4,
              cx:function(data){return $(data).attr("w")-10},
              cy:function(data){return 10},
              fill:"none"
            },{
              type:"circle",
              r:6,
              cx:function(data){return $(data).attr("w")-10},
              cy:function(data){return 10},
              fill:"none"
            }

        ,{
            type:"text",
            innerHtml:function(data){
              var text = $(data).children('label[xml\\:lang="'+functions.usersettings.lang+'"]').text();
              return functions.textDistributionToTSpan(text,$(data).attr("w"),$(data).attr("h"))},
            x:function(d){
              if($(d).children("node").size()>0){
                return 6;
              }else{
                return $(d).attr('w')/2
              }
            },
            y:function(d){
              if($(d).children("node").size()>0){
                return 8;
              }else
                {
                  return $(d).attr('h')/2
                }
              },
            "alignment-baseline":"central",
            "text-anchor":function(d){
              if($(d).children("node").size()>0){
                return "start";
              }else{
                return "middle";
              }
            }
          },{
              type:"text",
              innerHtml:function(data){
                var text = $(data).children("element").children('label[xml\\:lang="'+functions.usersettings.lang+'"]').text();
                return functions.textDistributionToTSpan(text,$(data).attr("w"),$(data).attr("h"))},
              x:function(d){
                if($(d).children("node").size()>0){
                  return 6;
                }else{
                  return $(d).attr('w')/2
                }
              },
              y:function(d){
                if($(d).children("node").size()>0){
                  return 8;
                }else
                  {
                    return $(d).attr('h')/2
                  }
                },
              "alignment-baseline":"central",
              "text-anchor":function(d){
                if($(d).children("node").size()>0){
                  return "start";
                }else{
                  return "middle";
                }
              }
            }]},
    BusinessObject:{
      look:
      [{
        type:"polygon",
        points:function(data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        fill:function(data){var fc = $( data ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"polygon",
        points:function(data){
          return "0,0 0,"+$(data).attr("h")/3+" "+$(data).attr("w")+","+$(data).attr("h")/3+" "+$(data).attr("w")+",0";
        },
        fill:function(data){var fc = $( data ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
          type:"text",
          innerHtml:function(data){
            return functions.textDistributionToTSpan($(data).children("element").children('label[xml\\:lang="'+functions.usersettings.lang+'"]').text(),$(data).attr("w"),
            $(data).attr("h")/3.5);
          },
          "alignment-baseline":"central",
          "text-anchor":"middle",
          x:function(data){
            return $(data).attr("w")/2
          },
          y:function(data){
            return configuration.globalCharheight/2+5;
          }

        }
    ]},BusinessActor:{
      look:
      [{
        type:"rect",
        points:function(data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        x:0,
        y:0,
        w:function(data){return $(data).attr("w")},
        h:function(data){return $(data).attr("h")},
        rx:5,
        ry:5,
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(data){var fc = $( data ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },{
        type:"circle",
        r:4,
        stroke:"black",
        "stroke-width":3,
        fill:function(data){var fc = $( data ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        cx:function(data){return $(data).attr("w")-10},
        cy:function(data){return 7},
      },{
        type:"line",
        x1:function(data){return $(data).attr("w")-10},
        y1:function(data){return 11},
        x2:function(data){return $(data).attr("w")-10},
        y2:function(data){return 20},
        stroke:"black",
        "stroke-width":3
      },{
        type:"line",
        x1:function(data){return $(data).attr("w")-10},
        y1:function(data){return 20},
        x2:function(data){return $(data).attr("w")-14},
        y2:function(data){return 25},
        stroke:"black",
        "stroke-width":3
      },{
        type:"line",
        x1:function(data){return $(data).attr("w")-10},
        y1:function(data){return 20},
        x2:function(data){return $(data).attr("w")-6},
        y2:function(data){return 25},
        stroke:"black",
        "stroke-width":3
      },{
        type:"line",
        x1:function(data){return $(data).attr("w")-14},
        y1:function(data){return 14},
        x2:function(data){return $(data).attr("w")-6},
        y2:function(data){return 14},
        stroke:"black",
        "stroke-width":3
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data).children("element").children('label[xml\\:lang="'+functions.usersettings.lang+'"]').text();
            return functions.textDistributionToTSpan(text,$(data).attr("w"),$(data).attr("h"))},
          x:function(d){
            if($(d).children("node").size()>0){
              return 6;
            }else{
              return $(d).attr('w')/2
            }
          },
          y:function(d){
            if($(d).children("node").size()>0){
              return 8;
            }else
              {
                return $(d).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(d){
            if($(d).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
      feel:{

      }
    },BusinessInterface:{
      look:
      [{
        type:"rect",
        points:function(data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        x:0,
        y:0,
        w:function(data){return $(data).attr("w")},
        h:function(data){return $(data).attr("h")},
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(data){var fc = $( data ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },{
        type:"circle",
        r:4,
        stroke:"black",
        "stroke-width":3,
        fill:function(data){var fc = $( data ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        cx:function(data){return $(data).attr("w")-10},
        cy:function(data){return 7},
      },{
        type:"line",
        x1:function(data){return $(data).attr("w")-14},
        y1:function(data){return 7},
        x2:function(data){return $(data).attr("w")-22},
        y2:function(data){return 7},
        stroke:"black",
        "stroke-width":3
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data).children("element").children('label[xml\\:lang="'+functions.usersettings.lang+'"]').text();
            return functions.textDistributionToTSpan(text,$(data).attr("w"),$(data).attr("h"))},
          x:function(d){
            if($(d).children("node").size()>0){
              return 6;
            }else{
              return $(d).attr('w')/2
            }
          },
          y:function(d){
            if($(d).children("node").size()>0){
              return 8;
            }else
              {
                return $(d).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(d){
            if($(d).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
      feel:{

      }
    },
    BusinessRole:{
      look:
      [{
        type:"polygon",
        points:function(data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        fill:function(data){var fc = $( data ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },
      {
        type:"ellipse",
        stroke:"black",
        "stroke-width":3,
        fill:"red",
        cx:function(data){return $(data).attr("w")-15},
        cy:function(data){return 7},
        rx:function(data){return 2.5},
        ry:function(data){return 5}
      },{
        type:"rect",
        stroke:"black",
        "stroke-width":1,
        fill:function(data){var fc = $( data ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        x:function(data){return $(data).attr("w")-15},
        y:function(data){return 2},
        w:function(data){return 10},
        h:function(data){return 10}
      },{
        type:"rect",
        stroke:"none",
        fill:function(data){var fc = $( data ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        x:function(data){return $(data).attr("w")-15.5},
        y:function(data){return 2},
        w:function(data){return 12},
        h:function(data){return 10}
      },{
        type:"ellipse",
        stroke:"black",
        "stroke-width":3,
        fill:function(data){var fc = $( data ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        cx:function(data){return $(data).attr("w")-5},
        cy:function(data){return 7},
        rx:function(data){return 2.5},
        ry:function(data){return 5}
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data).children("element").children('label[xml\\:lang="'+functions.usersettings.lang+'"]').text();
            return functions.textDistributionToTSpan(text,$(data).attr("w"),$(data).attr("h"))},
          x:function(d){
            if($(d).children("node").size()>0){
              return 6;
            }else{
              return $(d).attr('w')/2
            }
          },
          y:function(d){
            if($(d).children("node").size()>0){
              return 8;
            }else
              {
                return $(d).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(d){
            if($(d).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
      feel:{

      }
    },BusinessInteraction:{
      look:
      [{
        type:"rect",
        points:function(data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        x:0,
        y:0,
        w:function(data){return $(data).attr("w")},
        h:function(data){return $(data).attr("h")},
        rx:5,
        ry:5,
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(data){var fc = $( data ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },
      {
        type:"circle",
        stroke:"black",
        "stroke-width":3,
        fill:"none",
        cx:function(data){return $(data).attr("w")-7},
        cy:function(data){return 7},
        r:function(data){return 5},
      },{
        type:"rect",
        stroke:"black",
        "stroke-width":1,
        fill:function(data){var fc = $( data ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        x:function(data){return $(data).attr("w")-11.5},
        y:function(data){return 2},
        w:function(data){return 3},
        h:function(data){return 10}
      },{
        type:"circle",
        stroke:"black",
        "stroke-width":3,
        fill:"none",
        cx:function(data){return $(data).attr("w")-13},
        cy:function(data){return 7},
        r:function(data){return 5},
      },{
        type:"rect",
        stroke:"none",
        "stroke-width":1,
        fill:function(data){var fc = $( data ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        x:function(data){return $(data).attr("w")-11.5},
        y:function(data){return 1},
        w:function(data){return 3},
        h:function(data){return 12}
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data).children("element").children('label[xml\\:lang="'+functions.usersettings.lang+'"]').text();
            return functions.textDistributionToTSpan(text,$(data).attr("w"),$(data).attr("h"))},
          x:function(d){
            if($(d).children("node").size()>0){
              return 6;
            }else{
              return $(d).attr('w')/2
            }
          },
          y:function(d){
            if($(d).children("node").size()>0){
              return 8;
            }else
              {
                return $(d).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(d){
            if($(d).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
      feel:{

      }
    },BusinessCollaboration:{
      look:
      [{
        type:"polygon",
        points:function(data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        fill:function(data){var fc = $( data ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },
      {
        type:"circle",
        stroke:"black",
        "stroke-width":3,
        fill:"none",
        cx:function(data){return $(data).attr("w")-7},
        cy:function(data){return 7},
        r:function(data){return 5},
      },{
        type:"circle",
        stroke:"black",
        "stroke-width":3,
        fill:"none",
        cx:function(data){return $(data).attr("w")-13},
        cy:function(data){return 7},
        r:function(data){return 5},
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data).children("element").children('label[xml\\:lang="'+functions.usersettings.lang+'"]').text();
            return functions.textDistributionToTSpan(text,$(data).attr("w"),$(data).attr("h"))},
          x:function(d){
            if($(d).children("node").size()>0){
              return 6;
            }else{
              return $(d).attr('w')/2
            }
          },
          y:function(d){
            if($(d).children("node").size()>0){
              return 8;
            }else
              {
                return $(d).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(d){
            if($(d).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
      feel:{

      }
    },ApplicationCollaboration:{
      look:
      [{
        type:"polygon",
        points:function(data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        fill:function(data){var fc = $( data ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },
      {
        type:"circle",
        stroke:"black",
        "stroke-width":3,
        fill:"none",
        cx:function(data){return $(data).attr("w")-7},
        cy:function(data){return 7},
        r:function(data){return 5},
      },{
        type:"circle",
        stroke:"black",
        "stroke-width":3,
        fill:"none",
        cx:function(data){return $(data).attr("w")-13},
        cy:function(data){return 7},
        r:function(data){return 5},
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data).children("element").children('label[xml\\:lang="'+functions.usersettings.lang+'"]').text();
            return functions.textDistributionToTSpan(text,$(data).attr("w"),$(data).attr("h"))},
          x:function(d){
            if($(d).children("node").size()>0){
              return 6;
            }else{
              return $(d).attr('w')/2
            }
          },
          y:function(d){
            if($(d).children("node").size()>0){
              return 8;
            }else
              {
                return $(d).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(d){
            if($(d).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
      feel:{

      }
    },ApplicationInteraction:{
      look:
      [{
        type:"polygon",
        points:function(data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        fill:function(data){var fc = $( data ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}

      },
      {
        type:"circle",
        stroke:"black",
        "stroke-width":3,
        fill:"none",
        cx:function(data){return $(data).attr("w")-7},
        cy:function(data){return 7},
        r:function(data){return 5},
      },{
        type:"rect",
        stroke:"black",
        "stroke-width":3,
        fill:function(data){var fc = $( data ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        x:function(data){return $(data).attr("w")-11.5},
        y:function(data){return 2},
        w:function(data){return 3},
        h:function(data){return 10}
      },{
        type:"circle",
        stroke:"black",
        "stroke-width":3,
        fill:"none",
        cx:function(data){return $(data).attr("w")-13},
        cy:function(data){return 7},
        r:function(data){return 5},
      },{
        type:"rect",
        stroke:"none",
        "stroke-width":3,
        fill:function(data){var fc = $( data ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        x:function(data){return $(data).attr("w")-11.5},
        y:function(data){return 1},
        w:function(data){return 3},
        h:function(data){return 12}
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data).children("element").children('label[xml\\:lang="'+functions.usersettings.lang+'"]').text();
            return functions.textDistributionToTSpan(text,$(data).attr("w"),$(data).attr("h"))},
          x:function(d){
            if($(d).children("node").size()>0){
              return 6;
            }else{
              return $(d).attr('w')/2
            }
          },
          y:function(d){
            if($(d).children("node").size()>0){
              return 8;
            }else
              {
                return $(d).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(d){
            if($(d).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
      feel:{

      }
    },BusinessService:{
      look:
      [{
        type:"rect",
        points:function(data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        x:0,
        y:0,
        w:function(data){return $(data).attr("w")},
        h:function(data){return $(data).attr("h")},
        rx:5,
        ry:5,
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(data){var fc = $( data ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },
      {
        type:"path",
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:"none",
        d:function(data){return "M "+($(data).attr("w")-17)+","+(13)+" c -5,0 -5,-10 0,-10 l 10 0 c +5,0 +5,+10 0,+10 z"}
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data).children("element").children('label[xml\\:lang="'+functions.usersettings.lang+'"]').text();
            return functions.textDistributionToTSpan(text,$(data).attr("w"),$(data).attr("h"))},
          x:function(d){
            if($(d).children("node").size()>0){
              return 6;
            }else{
              return $(d).attr('w')/2
            }
          },
          y:function(d){
            if($(d).children("node").size()>0){
              return 8;
            }else
              {
                return $(d).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(d){
            if($(d).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
      feel:{

      }
    },InfrastructureService:{
      look:
      [{
        type:"rect",
        points:function(data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        x:0,
        y:0,
        w:function(data){return $(data).attr("w")},
        h:function(data){return $(data).attr("h")},
        rx:5,
        ry:5,
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(data){var fc = $( data ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },
      {
        type:"path",
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:"none",
        d:function(data){return "M "+($(data).attr("w")-17)+","+(13)+" c -5,0 -5,-10 0,-10 l 10 0 c +5,0 +5,+10 0,+10 z"}
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data).children("element").children('label[xml\\:lang="'+functions.usersettings.lang+'"]').text();
            return functions.textDistributionToTSpan(text,$(data).attr("w"),$(data).attr("h"))},
          x:function(d){
            if($(d).children("node").size()>0){
              return 6;
            }else{
              return $(d).attr('w')/2
            }
          },
          y:function(d){
            if($(d).children("node").size()>0){
              return 8;
            }else
              {
                return $(d).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(d){
            if($(d).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
      feel:{

      }
    },ApplicationService:{
      look:
      [{
        type:"rect",
        points:function(data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        x:0,
        y:0,
        w:function(data){return $(data).attr("w")},
        h:function(data){return $(data).attr("h")},
        rx:5,
        ry:5,
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(data){var fc = $( data ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },
      {
        type:"path",
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:"none",
        d:function(data){return "M "+($(data).attr("w")-17)+","+(13)+" c -5,0 -5,-10 0,-10 l 10 0 c +5,0 +5,+10 0,+10 z"}
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data).children("element").children('label[xml\\:lang="'+functions.usersettings.lang+'"]').text();
            return functions.textDistributionToTSpan(text,$(data).attr("w"),$(data).attr("h"))},
          x:function(d){
            if($(d).children("node").size()>0){
              return 6;
            }else{
              return $(d).attr('w')/2
            }
          },
          y:function(d){
            if($(d).children("node").size()>0){
              return 8;
            }else
              {
                return $(d).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(d){
            if($(d).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
      feel:{

      }
    },
    Value:{
      look:[{
        type:"ellipse",
        cx:function(data){return $(data).attr("w")/2},
        cy:function(data){return $(data).attr("h")/2},
        ry:function(data){return $(data).attr("h")/2},
        rx:function(data){return $(data).attr("w")/2}
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data).children("element").children('label[xml\\:lang="'+functions.usersettings.lang+'"]').text();
            return functions.textDistributionToTSpan(text,$(data).attr("w"),$(data).attr("h"))},
          x:function(d){
            if($(d).children("node").size()>0){
              return 6;
            }else{
              return $(d).attr('w')/2
            }
          },
          y:function(d){
            if($(d).children("node").size()>0){
              return 8;
            }else
              {
                return $(d).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(d){
            if($(d).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
      feel:[

      ]
    },Contract:{
      look:
      [{
        type:"polygon",
        points:function(data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        fill:function(data){var fc = $( data ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"polygon",
        points:function(data){
          return "0,0 0,"+$(data).attr("h")/3+" "+$(data).attr("w")+","+$(data).attr("h")/3+" "+$(data).attr("w")+",0";
        },
        fill:function(data){var fc = $( data ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
          type:"text",
          text:function(data){return $(data).children("element").children('label[xml\\:lang="'+functions.usersettings.lang+'"]').text()},
          "alignment-baseline":"central",
          "text-anchor":"middle",
          x:function(data){
            return $(data).attr("w")/2
          },
          y:function(data){
            return configuration.globalCharheight/2+5;
          }

        }
    ]},DataObject:{
      look:
      [{
        type:"polygon",
        points:function(data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        fill:function(data){var fc = $( data ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"polygon",
        points:function(data){
          return "0,0 0,"+$(data).attr("h")/3+" "+$(data).attr("w")+","+$(data).attr("h")/3+" "+$(data).attr("w")+",0";
        },
        fill:function(data){var fc = $( data ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
          type:"text",
          innerHtml:function(data){
            return functions.textDistributionToTSpan($(data).children("element").children('label[xml\\:lang="'+functions.usersettings.lang+'"]').text(),
            $(data).attr("w"),
            $(data).attr("h")/3.5)
          },
          "alignment-baseline":"central",
          "text-anchor":"middle",
          x:function(data){
            return $(data).attr("w")/2
          },
          y:function(data){
            return configuration.globalCharheight/2+5;
          }

        }
    ]},Artifact:{
      look:
      [{
        type:"polygon",
        points:function(data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        fill:function(data){var fc = $( data ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"path",
        d:function(data){

          return "M"+($(data).attr("w")-15)+" "+5+" l5 0 l5 5 l-5 0 l0 -5 m5 5 l0 10 l-10 0 l0 -15";
        },

        style:"stroke: black; fill:none;",
        fill:"none",
        stroke:"black"

      },{
          type:"text",
          text:function(data){return $(data).children("element").children('label[xml\\:lang="'+functions.usersettings.lang+'"]').text()},
          "alignment-baseline":"central",
          "text-anchor":"middle",
          x:function(data){
            return $(data).attr("w")/2
          },
          y:function(data){
            return configuration.globalCharheight/2+5;
          }

        }
    ]},ApplicationFunction:{
      look:
      [{
        type:"polygon",
        points:function(data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        fill:function(data){var fc = $( data ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"path",
        d:function(data){

          return "M"+($(data).attr("w")-15)+" "+5+" l5 -2 l5 2 l0 7 l-5 -2 l-5 2 z";
        },

        style:"stroke: black; fill:none;",
        fill:"none",
        stroke:"black"

      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data).children("element").children('label[xml\\:lang="'+functions.usersettings.lang+'"]').text();
            return functions.textDistributionToTSpan(text,$(data).attr("w"),$(data).attr("h"))},
          x:function(d){
            if($(d).children("node").size()>0){
              return 6;
            }else{
              return $(d).attr('w')/2
            }
          },
          y:function(d){
            if($(d).children("node").size()>0){
              return 8;
            }else
              {
                return $(d).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(d){
            if($(d).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }
    ]},ApplicationComponent:{
      look:
      [{
        type:"polygon",
        points:function(data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        fill:function(data){var fc = $( data ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"rect",
        x:function(data){return $(data).attr("w")-21+3},
        y:0+3,
        w:15,
        h:15,
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(data){var fc = $( data ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },{
        type:"rect",
        x:function(data){return $(data).attr("w")-21},
        y:3+3,
        w:7,
        h:3,
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(data){var fc = $( data ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },{
        type:"rect",
        x:function(data){return $(data).attr("w")-21},
        y:9+3,
        w:7,
        h:3,
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(data){var fc = $( data ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data).children("element").children('label[xml\\:lang="'+functions.usersettings.lang+'"]').text();
            return functions.textDistributionToTSpan(text,$(data).attr("w"),$(data).attr("h"))},
          x:function(d){
            if($(d).children("node").size()>0){
              return 6;
            }else{
              return $(d).attr('w')/2
            }
          },
          y:function(d){
            if($(d).children("node").size()>0){
              return 8;
            }else
              {
                return $(d).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(d){
            if($(d).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }
    ]},Node:{
      look:
      [{
        type:"polygon",
        points:function(data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        fill:function(data){var fc = $( data ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"rect",
        x:function(data){return $(data).attr("w")-21-3},
        y:0+3+5,
        w:15,
        h:10,
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(data){var fc = $( data ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },{
        type:"path",
        d:function(data){return "M"+($(data).attr("w")-21-3)+",8 l5,-3 l15,0 l-5,3 m5,-3 l0,10 l-5,3"},
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(data){var fc = $( data ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data).children("element").children('label[xml\\:lang="'+functions.usersettings.lang+'"]').text();
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
                ref_x = $(data).attr('w')/2
                ref_y = $(data).attr('h')/2
                height = $(data).attr("h")
              }
              width = $(data).attr("w")
              return functions.textDistributionToTSpan(text,width,height,ref_x,ref_y)},
          x:function(d){
            if($(d).children("node").size()>0){
              return 6;
            }else{
              return $(d).attr('w')/2
            }
          },
          y:function(d){
            if($(d).children("node").size()>0){
              return 12;
            }else
              {
                return $(d).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(d){
            if($(d).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }
    ]},Device:{
      look:
      [{
        type:"polygon",
        points:function(data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        fill:function(data){var fc = $( data ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"rect",
        x:function(data){return $(data).attr("w")-15},
        y:0+3,
        w:10,
        h:5,
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(data){var fc = $( data ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },{
        type:"path",
        d:function(data){return "M"+($(data).attr("w")-15+2)+",8 l-2,2 l10,0 l-2,-2"},
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(data){var fc = $( data ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data).children("element").children('label[xml\\:lang="'+functions.usersettings.lang+'"]').text();
            return functions.textDistributionToTSpan(text,$(data).attr("w"),$(data).attr("h"))},
          x:function(d){
            if($(d).children("node").size()>0){
              return 6;
            }else{
              return $(d).attr('w')/2
            }
          },
          y:function(d){
            if($(d).children("node").size()>0){
              return 8;
            }else
              {
                return $(d).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(d){
            if($(d).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }
    ]},SystemSoftware:{
      look:
      [{
        type:"polygon",
        points:function(data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        fill:function(data){var fc = $( data ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"circle",
        r:4,
        cx:function(data){return $(data).attr("w")-9},
        cy:function(data){return 9},
        fill:function(data){var fc = $( data ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"circle",
        r:4,
        cx:function(data){return $(data).attr("w")-10},
        cy:function(data){return 10},
        fill:function(data){var fc = $( data ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data).children("element").children('label[xml\\:lang="'+functions.usersettings.lang+'"]').text();
            return functions.textDistributionToTSpan(text,$(data).attr("w"),$(data).attr("h"))},
          x:function(d){
            if($(d).children("node").size()>0){
              return 6;
            }else{
              return $(d).attr('w')/2
            }
          },
          y:function(d){
            if($(d).children("node").size()>0){
              return 8;
            }else
              {
                return $(d).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(d){
            if($(d).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }
    ]},Network:{
      look:
      [{
        type:"polygon",
        points:function(data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        fill:function(data){var fc = $( data ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"polygon",
        points:function(data){
          return ($(data).attr("w")-10)+",5 "+($(data).attr("w")-12)+",10 "+($(data).attr("w")-6)+",10 "+($(data).attr("w")-4)+",5 ";
        },
        fill:function(data){var fc = $( data ).children("style").children("fillColor");
              return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"circle",
        r:1,
        cx:function(data){return $(data).attr("w")-10},
        cy:function(data){return 5},
        fill:"black",
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"circle",
        r:1,
        cx:function(data){return $(data).attr("w")-12},
        cy:function(data){return 10},
        fill:"black",
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"circle",
        r:1,
        cx:function(data){return $(data).attr("w")-4},
        cy:function(data){return 5},
        fill:"black",
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
        type:"circle",
        r:1,
        cx:function(data){return $(data).attr("w")-6},
        cy:function(data){return 10},
        fill:"black",
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");
              return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";}
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data).children("element").children('label[xml\\:lang="'+functions.usersettings.lang+'"]').text();
            return functions.textDistributionToTSpan(text,$(data).attr("w"),$(data).attr("h"))},
          x:function(d){
            if($(d).children("node").size()>0){
              return 6;
            }else{
              return $(d).attr('w')/2
            }
          },
          y:function(d){
            if($(d).children("node").size()>0){
              return 8;
            }else
              {
                return $(d).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(d){
            if($(d).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }
    ]},BusinessFunction:{
      look:
      [{
        type:"rect",
        points:function(data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        x:0,
        y:0,
        w:function(data){return $(data).attr("w")},
        h:function(data){return $(data).attr("h")},
        rx:5,
        ry:5,
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(data){var fc = $( data ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },{
        type:"path",
        d:function(data){

          return "M"+($(data).attr("w")-15)+" "+5+" l5 -2 l5 2 l0 7 l-5 -2 l-5 2 z";
        },

        style:"stroke: black; fill:none;",
        fill:"none",
        stroke:"black"

      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data).children("element").children('label[xml\\:lang="'+functions.usersettings.lang+'"]').text();
            return functions.textDistributionToTSpan(text,$(data).attr("w"),$(data).attr("h"))},
          x:function(d){
            if($(d).children("node").size()>0){
              return 6;
            }else{
              return $(d).attr('w')/2
            }
          },
          y:function(d){
            if($(d).children("node").size()>0){
              return 8;
            }else
              {
                return $(d).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(d){
            if($(d).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }
    ]},BusinessProcess:{
      look:
      [{
        type:"rect",
        points:function(data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        x:0,
        y:0,
        w:function(data){return $(data).attr("w")},
        h:function(data){return $(data).attr("h")},
        rx:5,
        ry:5,
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(data){var fc = $( data ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },{
        type:"path",
        d:function(data){

          return "M"+($(data).attr("w")-20)+" "+5+" l10 0 l0 -2 l5 6 l-5 6 l0 -2 l-10 0 z";
        },

        style:"stroke: black; fill:none;",
        fill:"none",
        stroke:"black"

      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data).children("element").children('label[xml\\:lang="'+functions.usersettings.lang+'"]').text();
            return functions.textDistributionToTSpan(text,$(data).attr("w"),$(data).attr("h"))},
          x:function(d){
            if($(d).children("node").size()>0){
              return 6;
            }else{
              return $(d).attr('w')/2
            }
          },
          y:function(d){
            if($(d).children("node").size()>0){
              return 8;
            }else
              {
                return $(d).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(d){
            if($(d).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }
    ]},BusinessEvent:{
      look:
      [{
        type:"rect",
        points:function(data){
          return "0,0 0,"+$(data).attr("h")+" "+$(data).attr("w")+","+$(data).attr("h")+" "+$(data).attr("w")+",0";
        },
        x:0,
        y:0,
        w:function(data){return $(data).attr("w")},
        h:function(data){return $(data).attr("h")},
        rx:5,
        ry:5,
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(data){var fc = $( data ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"}
      },
      {
        type:"path",
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:"none",
        d:function(data){return "M "+($(data).attr("w")-25)+","+(13)+" c +5,0 +5,-10 0,-10 l 15 0 c +5,0 +5,+10 0,+10 z"}
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data).children("element").children('label[xml\\:lang="'+functions.usersettings.lang+'"]').text();
            return functions.textDistributionToTSpan(text,$(data).attr("w"),$(data).attr("h"))},
          x:function(d){
            if($(d).children("node").size()>0){
              return 6;
            }else{
              return $(d).attr('w')/2
            }
          },
          y:function(d){
            if($(d).children("node").size()>0){
              return 8;
            }else
              {
                return $(d).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(d){
            if($(d).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
      feel:{

      }
    },Representation:{
      look:
      [{
        type:"path",
        stroke:function(data){var fc = $( data ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        fill:function(data){var fc = $( data ).children("style").children("fillColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
        d:function(data){return "M 0,0 l "+$(data).attr("w")+",0 l 0,"+$(data).attr("h")+" c -15,-5 "+(-$(data).attr("w")/2)+",-10 "+(-$(data).attr("w")/2)+",10 c -10,10 "+(-$(data).attr("w")/2)+",0 "+(-$(data).attr("w")/2)+",-10 z"}
      },{
          type:"text",
          innerHtml:function(data){
            var text = $(data).children("element").children('label[xml\\:lang="'+functions.usersettings.lang+'"]').text();
            return functions.textDistributionToTSpan(text,$(data).attr("w"),$(data).attr("h"))},
          x:function(d){
            if($(d).children("node").size()>0){
              return 6;
            }else{
              return $(d).attr('w')/2
            }
          },
          y:function(d){
            if($(d).children("node").size()>0){
              return 8;
            }else
              {
                return $(d).attr('h')/2
              }
            },
          "alignment-baseline":"central",
          "text-anchor":function(d){
            if($(d).children("node").size()>0){
              return "start";
            }else{
              return "middle";
            }
          }
        }],
      feel:{

      }
    }
  },
  edges:{
    AggregationRelationship:{
      look:[

      ],
      stroke:function(data){var fc = $( data ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
      "stroke-width":function(data){return $(data).children("style").attr("lineWidth")},
      "marker-start":"url(#AggregationRelationshipStart)",
      "style":function(data){return "marker-start:url(#AggregationRelationshipStart);"}
    },
    CompositionRelationship:{
      look:[

      ],
      stroke:function(data){var fc = $( data ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
      "stroke-width":function(data){return $(data).children("style").attr("lineWidth")},
      "marker-start":"url(#AggregationRelationshipStart)",
      "style":function(data){return "marker-start:url(#CompositionRelationshipStart);"}
    },
    RealisationRelationship:{
      look:[

      ],
      stroke:function(data){var fc = $( data ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
      "stroke-width":function(data){return $(data).children("style").attr("lineWidth")},
      "marker-start":"url(#AggregationRelationshipStart)",
      "style":function(data){return "marker-end:url(#RealisationRelationshipEnd);"},
      "stroke-dasharray":"5,5"
    },
    AssociationRelationship:{
      look:[

      ],
      stroke:function(data){var fc = $( data ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
      "stroke-width":function(data){return $(data).children("style").attr("lineWidth")},
      "style":function(data){return ""}
    },
    AssignmentRelationship:{
      look:[

      ],
      stroke:function(data){var fc = $( data ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
      "stroke-width":function(data){return $(data).children("style").attr("lineWidth")},
      "style":function(data){return "marker-start:url(#AssignmentRelationshipStartEnd);marker-end:url(#AssignmentRelationshipStartEnd);"}
    },
    UsedByRelationship:{
      look:[

      ],
      stroke:function(data){var fc = $( data ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
      "stroke-width":function(data){return $(data).children("style").attr("lineWidth")},
      "style":function(data){return "marker-end:url(#UsedByRelationshipEnd);"}
    },
    TriggeringRelationship:{
      look:[

      ],
      stroke:function(data){var fc = $( data ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
      "stroke-width":function(data){return $(data).children("style").attr("lineWidth")},
      "style":function(data){return "marker-end:url(#TriggeringRelationshipEnd);"}
    },FlowRelationship:{
      look:[

      ],
      stroke:function(data){var fc = $( data ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
      "stroke-width":function(data){return $(data).children("style").attr("lineWidth")},
      "style":function(data){return "marker-end:url(#TriggeringRelationshipEnd);"},
      "stroke-dasharray":"5,5"
    },
    SpecialisationRelationship:{
      look:[

      ],
      stroke:function(data){var fc = $( data ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
      "stroke-width":function(data){return $(data).children("style").attr("lineWidth")},
      "marker-start":"url(#AggregationRelationshipStart)",
      "style":function(data){return "marker-end:url(#RealisationRelationshipEnd);"}
    },
    AccessRelationship:{
      look:[

      ],
      stroke:function(data){var fc = $( data ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
      "stroke-width":function(data){return $(data).children("style").attr("lineWidth")},
      "style":function(data){return "marker-end:url(#AccessRelationshipEnd);"}
    },
    undefined:{
      look:[

      ],
      stroke:function(data){var fc = $( data ).children("style").children("lineColor");return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"},
      "stroke-width":function(data){return $(data).children("style").attr("lineWidth")}
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
