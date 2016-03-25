
//author: Sebastian Bittmann
//email: sebastianbittmann@gmail.com
//This software was created with the help of the jquery and d3js library.
//See https://d3js.org/ and https://jquery.com/ for more info.

//TODO: create new node
//TODO: create new relation
//TODO: move by limits of nodes

documentmodengine = {
	version : "1.0",
	author 	: "Sebastian Bittmann",
	email 	: "SebastianBittmann@gmail.com",

	status	: undefined,
	file		: undefined,
	url			:	undefined,


	xml				: undefined,
	views			: undefined,
	viewsdata : undefined,
	diagrams	: undefined,

	usersettings: {},

	prepareFile: function(file,lang){
		if(!configuration){return null;}
		var ce = new CustomEvent("StartingLoadingAFile",{
			detail: {
				file: file,
				lang: lang,
				loader: this
			}});
		ce.detail = this;
		document.dispatchEvent(ce);

		documentmodengine.status = 1;
		documentmodengine.file = file;
		window.done = 1;
		documentmodengine.usersettings.lang = lang;

		var reader = new FileReader();
		var context = this;
		reader.onload = function(event) {
			var xml = $.parseXML(event.target.result);
			window.xml = xml;
			documentmodengine.xml = xml;

			var ce = new CustomEvent("DoneLoadingAFile",{
				detail: {
					file: file,
					lang: lang,
					loader: context
				}});
			document.dispatchEvent(ce);

			var result = documentmodengine.buildModel_internal(lang);

		}
		reader.readAsText(file);
	},

	prepareUrl:function(url,lang){
		if(!configuration){return null;}

		var ce = new CustomEvent("StartingLoadingAnUrl",{
			detail: {
				url: url,
				lang: lang,
				loader: this
			}});
		document.dispatchEvent(ce);

		window.done = 1;
		documentmodengine.status = 1;
		documentmodengine.url = url;

		documentmodengine.usersettings.lang = lang;
		var context = this;
		$.ajax(
				{
					type: 'GET',
					async: true,
					url:  url
				}).done(function(xml){
					//prepare xml file.
					//I need all data for each connection and each node!
					window.xml = xml;
					documentmodengine.xml = xml;
					documentmodengine.buildModel_internal(lang);
				});
	},

addnewnode:function(type,viewid){
	var newnode = configuration.nodes[type].new();
	configuration.adder(window.xml,newnode);
	//TODO: Node must be also added to view explicitly
	documentmodengine.viewsdata[viewid].nodes.push(newnode);
	var updatedsvg  = documentmodengine.updateLoadedView(viewid,documentmodengine.usersettings.lang);
},

 buildModel_internal: function(lang){
				var ce = new CustomEvent("StartingProcessingXML",{
					detail: {
						loader: this
					}});

				document.dispatchEvent(ce);

					window.done = 1;
					documentmodengine.status = 1;
					documentmodengine.releaseModel();

					var views = configuration.view_extraction(xml);

					configuration.edge_extraction(views,xml).each(
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
									var sourceref_node = $(views).find('node[identifier="'+srcref_nd+'"]');
									$(e).append("<source/>");
								}
								if(tarref_nd){
									var targetref_node = $(views).find('node[identifier="'+tarref_nd+'"]');
									$(e).append("<target/>");
								}
							}
					);
					//preparation done;

					//create tabs;
					var view_ids = [];
					for(var i = 0; i < views.children().size();i++){
						view_ids.push(i);
					}

					d3.select("body")
					.select("iron-pages.tabcontents")
					.selectAll("div")
					.data(view_ids).enter()
					.append("div")
					.attr("id",function(d){
						return "div"+d;
					});

					var viewsdata = [];
					var diagrams = [];

					for(var i = 0; i < views.children().size();i++){
						var view = views.children().eq(i);

						//prepare data structure
						var viewdata = {};
						viewdata.self = view[0];
						viewdata.nodes = [];
						viewdata.edges  = [];

						var nodes_ofview = configuration.node_extraction(view,xml)
						for(var j = 0;j< nodes_ofview.size();j++){
							var nodedata = {};
							if(configuration.node_datacollector){
								nodedata = configuration.node_datacollector(nodes_ofview[j],xml);
							}
							nodedata.self = nodes_ofview[j];
							viewdata.nodes.push(nodedata);
						}

						var edges_ofview = configuration.edge_extraction(view,xml);
						for(var j = 0;j< edges_ofview.size();j++){
							var edgedata = {};
							if(configuration.edge_datacollector){
								edgedata = configuration.edge_datacollector(edges_ofview[j],xml);
							}
							edgedata.self = edges_ofview[j];
							viewdata.edges.push(edgedata);
						}

						var result = documentmodengine.buildView_internal(viewdata,lang);
						diagrams.push(result[0][0]);

						var ce = new CustomEvent("DoneWithView",{
							detail: {
								view: i
							}});

						document.dispatchEvent(ce);
						viewsdata.push(viewdata);

					};
					window.viewsdata = views;

					window.done = 2;
					documentmodengine.status = 2;
					documentmodengine.views = views;
					documentmodengine.viewsdata = viewsdata;
					documentmodengine.diagrams = diagrams;
					var ce = new CustomEvent("DoneWithLoading",{
						detail: {
							views: views
						}});
					document.dispatchEvent(ce);


	},
	updateLoadedView: function(byid,lang){

		var svg = d3.select(documentmodengine.diagrams[byid]);
		var viewdata = documentmodengine.viewsdata[byid];
		var nodes = viewdata.nodes;
		var edges = viewdata.edges;

		documentmodengine.drawNodes(svg,nodes);
		documentmodengine.drawEdges(svg,edges);
		//var view = documentmodengine.views.children("[identifier='"+byid+"']");
		//return documentmodengine.buildView_internal(view,lang);
	},
	drawNodes: function(svg,data){

		svg.selectAll("svg\\:g#node").remove();

		var g = svg
		.selectAll("svg\\:g#node")
		.data(
				data
		);

		g.enter().append('svg:g');
		//this is always activated, so that the users can see the links
		if(true||documentmodengine.usersettings.viewonly != true){
			g.on('mousedown',function(d){
				if(!d3.event.altKey){
					d3.selectAll(".nodeselector").remove();
				}
				d3.select(this).attr('selected',true);
				d3.select(this).attr('selected_x',d3.event.x-$(d3.select(this)[0]).attr("x"));
				d3.select(this).attr('selected_y',d3.event.y-$(d3.select(this)[0]).attr("y"));

				var bbox = d3.select(this)[0][0].getBBox();
				var x = bbox.x;
				var y = bbox.y;
				var x = d3.transform(d3.select(this).attr("transform")).translate[0];
				var y = d3.transform(d3.select(this).attr("transform")).translate[1];

				d3.select(this.parentElement)
					.append("rect")
					.attr("x",x-configuration.edgedistance/2)
					.attr("y",y-configuration.edgedistance/2)
					.attr("width",bbox.width+configuration.edgedistance)
					.attr("height",bbox.height+configuration.edgedistance)
					.attr("fill","none")
					.attr("stroke","black")
					.attr("stroke-dasharray","2,2")
					.classed("nodeselector",true)
					.attr("id","nodeselector"+":"+d3.select(this).attr("id"))
					.attr("ref",d3.select(this).attr("id"));
				var ce = new CustomEvent("NodeSelected",{
					detail: {
						nodedata: d,
						node: this
					}});
				ce.detail = this;
				document.dispatchEvent(ce);

			})
		}

		g.attr('class',function(d){
			return 'node '+configuration.nodetype(d)
		})
		.attr('id',function(d){
			return d.id;
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
										return documentmodengine.functions.getValueFromData(lookelements[i].fill,d);
										//var fc = $( d ).children("style").children("fillColor");
										//return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"
									})
									.style('stroke', function(d) {
										return documentmodengine.functions.getValueFromData(lookelements[i].stroke,d);
										//var fc = $( d ).children("style").children("lineColor");
										//return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";
									})
									.attr("points",function(d){
										return documentmodengine.functions.getValueFromData(lookelements[i].points,d);
										//return documentmodengine.functions.getPointsStringFromConfiguration(lookelements[i].points,d);
									});
								}else if(lookelements[i].type == "circle"){
									d3.select(this).select(lookelements[i].type+".POS"+i)
									.style('fill', function(d) {
										return documentmodengine.functions.getValueFromData(lookelements[i].fill,d);
									})
									.style('stroke', function(d) {
										return documentmodengine.functions.getValueFromData(lookelements[i].stroke,d);
										//var fc = $( d ).children("style").children("lineColor");
										//return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";
									})
									.attr("r",function(d){
										return documentmodengine.functions.getValueFromData(lookelements[i].r,d);
									})
									.attr("cx",function(d){
										return documentmodengine.functions.getValueFromData(lookelements[i].cx,d);
									})
									.attr("cy",function(d){
										return documentmodengine.functions.getValueFromData(lookelements[i].cy,d);
									})
								}else if(lookelements[i].type == "line"){
									d3.select(this).select(lookelements[i].type+".POS"+i)
									.style('fill', function(d) {
										return documentmodengine.functions.getValueFromData(lookelements[i].fill,d);
										//var fc = $( d ).children("style").children("fillColor");
										//return  "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")"
									})
									.style('stroke', function(d) {
										return documentmodengine.functions.getValueFromData(lookelements[i].stroke,d);
										//var fc = $( d ).children("style").children("lineColor");
										//return "rgb("+ fc.attr("r")+","+fc.attr("g")+","+fc.attr('b') +")";
									})
									.attr("x1",function(d){
										return documentmodengine.functions.getValueFromData(lookelements[i].x1,d);
									})
									.attr("y1",function(d){
										return documentmodengine.functions.getValueFromData(lookelements[i].y1,d);
									})
									.attr("x2",function(d){
										return documentmodengine.functions.getValueFromData(lookelements[i].x2,d);
									})
									.attr("y2",function(d){
										return documentmodengine.functions.getValueFromData(lookelements[i].y2,d);
									})
								}else if(lookelements[i].type == "ellipse"){
									d3.select(this).select(lookelements[i].type+".POS"+i)
									.style('fill', function(d) {
										return documentmodengine.functions.getValueFromData(lookelements[i].fill,d);
									})
									.style('stroke', function(d) {
										return documentmodengine.functions.getValueFromData(lookelements[i].stroke,d);
									}).style('stroke-width', function(d) {
										return documentmodengine.functions.getValueFromData(lookelements[i]['stroke-width'],d);
									})
									.attr("cx",function(d){
										return documentmodengine.functions.getValueFromData(lookelements[i].cx,d);
									})
									.attr("cy",function(d){
										return documentmodengine.functions.getValueFromData(lookelements[i].cy,d);
									})
									.attr("rx",function(d){
										return documentmodengine.functions.getValueFromData(lookelements[i].rx,d);
									})
									.attr("ry",function(d){
										return documentmodengine.functions.getValueFromData(lookelements[i].ry,d);
									})
								}else if(lookelements[i].type == "rect"){
									d3.select(this).select(lookelements[i].type+".POS"+i)
									.style('fill', function(d) {
										return documentmodengine.functions.getValueFromData(lookelements[i].fill,d);
									})
									.style('stroke', function(d) {
										return documentmodengine.functions.getValueFromData(lookelements[i].stroke,d);
									})
									.style('stroke-width', function(d) {
										return documentmodengine.functions.getValueFromData(lookelements[i]['stroke-width'],d);
									})
									.attr("x",function(d){
										return documentmodengine.functions.getValueFromData(lookelements[i].x,d);
									})
									.attr("y",function(d){
										return documentmodengine.functions.getValueFromData(lookelements[i].y,d);
									})
									.attr("width",function(d){
										return documentmodengine.functions.getValueFromData(lookelements[i].w,d);
									})
									.attr("height",function(d){
										return documentmodengine.functions.getValueFromData(lookelements[i].h,d);
									})
									.attr("ry",function(d){
										return documentmodengine.functions.getValueFromData(lookelements[i].ry,d);
									})
									.attr("rx",function(d){
										return documentmodengine.functions.getValueFromData(lookelements[i].rx,d);
									})
								}else if(lookelements[i].type == "path"){
									d3.select(this).select(lookelements[i].type+".POS"+i)
									.attr("style",function(d){
										return documentmodengine.functions.getValueFromData(lookelements[i].style,d);
									}).style('fill', function(d) {
										return documentmodengine.functions.getValueFromData(lookelements[i].fill,d);
									}).style('stroke', function(d) {
										return documentmodengine.functions.getValueFromData(lookelements[i].stroke,d);
									}).attr("stroke-dasharray",function(d){
										return documentmodengine.functions.getValueFromData(lookelements[i]["stroke-dasharray"],d);
									}).attr("d",function(d){
										return documentmodengine.functions.getValueFromData(lookelements[i].d,d);
									}).style('stroke-width', function(d) {
										return documentmodengine.functions.getValueFromData(lookelements[i]["stroke-width"],d);
									})

								}else if(lookelements[i].type == "text"){
									var text = d3.select(this).select(lookelements[i].type+".POS"+i);
									text.attr("style",function(d){
										return documentmodengine.functions.getValueFromData(lookelements[i].style,d);
									}).attr("x",function(d){
										return documentmodengine.functions.getValueFromData(lookelements[i].x,d);
									}).attr("y",function(d){
										return documentmodengine.functions.getValueFromData(lookelements[i].y,d);
									}).attr("alignment-baseline",function(d){
										return documentmodengine.functions.getValueFromData(lookelements[i]["alignment-baseline"],d);
									}).attr("text-anchor",function(d){
										return documentmodengine.functions.getValueFromData(lookelements[i]["text-anchor"],d);
									}).attr("style",function(d){
										return documentmodengine.functions.getValueFromData(lookelements[i]["style"],d);
									});

									if(lookelements[i].innerHtml){
										text.html(function(d){
											return documentmodengine.functions.getValueFromData(lookelements[i].innerHtml,d);
										})
									}else{
										text.text(function(d){
											return documentmodengine.functions.getValueFromData(lookelements[i].text,d);
										})
									}
								}
							}
						}
					}
			);

			g_svg.attr("x",
					function(d) {
				return configuration.nodeposition(d).x;
			}).attr("y",
					function(d) {
				return configuration.nodeposition(d).y;
			}).attr("transform",
					function(d) {
				return "translate(" + configuration.nodeposition(d).x + "," + configuration.nodeposition(d).y + ")";
			});
		}
		this.drawNode(g);
		g.exit().remove();

	},
	drawEdges: function(svg,data){

		var g = svg
		.selectAll("svg\\:g#connection")
		.data(data);

		g.enter().append('svg:g');

		g.attr('id',function(d){
			return d.id;
		});


		if(documentmodengine.usersettings.viewonly != true){
			g.on('mousedown',function(d){
				d3.select(this).attr('selected',true);
				var found = false;
				var x = d3.event.offsetX;
				var y = d3.event.offsetY;
				var hovercircle = d3.select(".hover.edge");
				if(hovercircle.size()>0){
					found = true;
					hovercircle.attr("selected","true");
					hovercircle.attr('selected_x',x-parseInt(hovercircle.attr("cx")));
					hovercircle.attr('selected_y',y-parseInt(hovercircle.attr("cy")));
				}

				if(!found){
					d3.select(this).attr("selected","false");
					if(configuration.addBendPoint){
							configuration.addBendPoint(d,x,y);
					}else{
						console.log("Configuration does not support bendpoints of edges");
					}

					//$(d.self).append("<bendpoint x='"+x+"' y='"+y+"' ></bendpoint>");
					documentmodengine.drawEdge(d3.select(this));
				}
			});
		}

		this.drawEdge = function (edge) {
			edge.each(function(d,i){

				var currentedge = d3.select(this);

				var type = configuration.edgetype(d)
				var typeconf = configuration.edges[type];
				if(!typeconf){
					typeconf = configuration.edges[undefined];
					console.log("Could not find edge type definition for "+type+".");
				}
				if(typeconf){
					currentedge.selectAll("path").remove();
					currentedge.selectAll("text").remove();
					currentedge.selectAll("circle").remove();
					currentedge.selectAll("rect").remove();

					currentedge
					.attr("id",function(d){
						return d.id;
					})
					.attr("source_node_id",function(d){
						return $(d.self).attr("source")
					})
					.attr("target_node_id",function(d){
						return $(d.self).attr("target")
					})
					.attr('class',function(d){
						return 'connection '+configuration.edgetype(d)
					})

					//this draws the actual visible line
					currentedge.append("svg\\:path")
					.attr("d",function(d){
						var current = 0;
						var result = "M ";
						var sourceref_svg = $(d3.select("#"+$(d.self).attr("source"))[0]);
						var lineColor = $( d ).children("style").children("lineColor");
						var lineWidth = $( d ).children("style").attr("lineWidth") ? $( d ).children("style").attr("lineWidth") : 1;

						//var points1 = $(sourceref_svg).attr("points");
						//var points2 = [];
						var edgetype = configuration.edges[configuration.edgetype(d)];
						if(!edgetype){
							edgetype = configuration.edges[undefined];
						}
						if(edgetype.points){
							var type = configuration.edges[configuration.edgetype(d)]?configuration.edges[configuration.edgetype(d)]:configuration.edges[undefined];
							var points = type.points(d);
							var points1 = points.shape1;
							for(var i = 0;i<points.path.length;i++){
								var points2 = [points.path[i]];
								var pointsset = documentmodengine.functions.getNearestTwoPointsFromTwoSets(points1,points2);
								result += pointsset.x1+","+pointsset.y1+" L ";
								result += pointsset.x2+","+pointsset.y2+" L ";
								var points1 = [points.path[i]];
							}
							points2 = points.shape2;
							var pointsset = documentmodengine.functions.getNearestTwoPointsFromTwoSets(points1,points2);
							result += pointsset.x1+","+pointsset.y1+" L ";
							result += pointsset.x2+","+pointsset.y2;

						}
						return result;
					}).attr("stroke-dasharray",function(d){
						return documentmodengine.functions.getValueFromData(typeconf["stroke-dasharray"],d);
					}).attr("style",function(d){
						return documentmodengine.functions.getValueFromData(typeconf.style,d);
					})
					.style("stroke",function(d){
						return documentmodengine.functions.getValueFromData(typeconf.stroke,d);
					})
					.attr("stroke-width",function(d){
						return documentmodengine.functions.getValueFromData(typeconf["stroke-width"],d);
					})
					.style("fill","none");

					//this draws the transparent line for UI
					currentedge.append("svg\\:path")
					.attr("d",function(d){
						var current = 0;
						var result = "M ";
						var sourceref_svg = $(d3.select("#"+$(d.self).attr("source"))[0]);
						var lineColor = $( d ).children("style").children("lineColor");
						var lineWidth = $( d ).children("style").attr("lineWidth") ? $( d ).children("style").attr("lineWidth") : 1;

						//var points1 = $(sourceref_svg).attr("points");
						//var points2 = [];
						var edgetype = configuration.edges[configuration.edgetype(d)];
						if(!edgetype){
							edgetype = configuration.edges[undefined];
						}
						if(edgetype.points){
							var type = configuration.edges[configuration.edgetype(d)]?configuration.edges[configuration.edgetype(d)]:configuration.edges[undefined];
							var points = type.points(d);
							var points1 = points.shape1;
							for(var i = 0;i<points.path.length;i++){
								var points2 = [points.path[i]];
								var pointsset = documentmodengine.functions.getNearestTwoPointsFromTwoSets(points1,points2);
								result += pointsset.x1+","+pointsset.y1+" L ";
								result += pointsset.x2+","+pointsset.y2+" L ";
								var points1 = [points.path[i]];
							}
							points2 = points.shape2;
							var pointsset = documentmodengine.functions.getNearestTwoPointsFromTwoSets(points1,points2);
							result += pointsset.x1+","+pointsset.y1+" L ";
							result += pointsset.x2+","+pointsset.y2;

						}
						return result;
					}).style("stroke",function(d){
						return "transparent";
						//return documentmodengine.functions.getValueFromData(typeconf.stroke,d);
					}).attr("stroke-width",function(d){
						var config = parseInt(documentmodengine.functions.getValueFromData(typeconf["stroke-width"],d));
						if(isNaN(config)){
							return 10;
						}else{
							return config+10;
						}
					})
					.style("fill","none");

					currentedge.append('svg:text')
					.text(function(d){
						return $(d.self).children("relationship").children('label[xml\\:lang="'+documentmodengine.usersettings.lang+'"]').text()
					})
					.attr("x",function(d){
						var path = d3.select(this.parentElement).select("path");
						if(path.size()>0){
							var lines = documentmodengine.functions.getPointArrayFromString(path.attr("d"));
							if((lines.length % 2) == 0){
								var left = lines[(lines.length/2)-1];
								var right = lines[(lines.length/2)];
								return documentmodengine.functions.getDistanceBetweenTwoPoints(parseInt($(left).attr("x")), parseInt($(right).attr("x")))
							}else{
								var left = lines[0][(lines.length/2)-0.5];
								return left.attr("x");
							}
						}else{
							return 0;
						}
					})
					.attr("y",function(d){
						var path = d3.select(this.parentElement).select("path");
						if(path.size()>0){
							var lines = documentmodengine.functions.getPointArrayFromString(path.attr("d"));
							if((lines.length % 2) == 0){
								var left = lines[(lines.length/2)-1];
								var right = lines[(lines.length/2)];
								return documentmodengine.functions.getDistanceBetweenTwoPoints(parseInt($(left).attr("y")), parseInt($(right).attr("y")))
							}else{
								var left = lines[0][(lines.length/2)-0.5];
								return left.attr("y");
							}
						}else{
							return 0;
						}
					});


					var edgetype = configuration.edges[configuration.edgetype(d)];
					if(!edgetype){
						edgetype = configuration.edges[undefined];
					}
					if(edgetype.points){
						var type = configuration.edges[configuration.edgetype(d)]?configuration.edges[configuration.edgetype(d)]:configuration.edges[undefined];
						var points = type.points(d);
						for(var i = 0;i<points.path.length;i++){
							var points2 = [points.path[i]];

							var bendpointselector = currentedge
							.append("circle")
							.attr("cx",points2[0].x)
							.attr("cy",points2[0].y)
							.attr("r",configuration.edgedistance)
							.attr("fill","transparent")
							.attr("stroke","none")
							.attr("id","bendpoint:"+currentedge.attr("id")+":"+i)
							.attr("class","bendpointselector");

							if(true || documentmodengine.usersettings.viewonly != true){
								bendpointselector.on("mouseover",function(d){
									//d3.select(this.parentElement).select("#hover\\:"+$(d3.select(this).data()).attr("id")).remove();
									d3.selectAll(".hover.edge").remove();
									var arrayofattr = d3.select(this).attr("id").split(":")
									d3.select(this.parentElement)
									.append("circle")
									.attr("cx",$(d3.select(this)[0]).attr("cx"))
									.attr("cy",$(d3.select(this)[0]).attr("cy"))
									.attr("r",configuration.edgedistance)
									.attr("fill","none")
									.attr("stroke","black")
									.attr("stroke-dasharray","2,2")
									.attr("id","hover:"+arrayofattr[1]+":"+arrayofattr[2])
									.classed("hover",true)
									.classed("edge",true);
								})
								.on("mouseout",function(d){
									d3.select(this.parentElement)
										.filter(function(d){
											return !(d3.select(this).attr("selected") == "true")
										})
										.select("[id='hover\\:"+d3.select(this).attr("id").split(":")[1]+"\\:"+d3.select(this).attr("id").split(":")[2]+"']")
										.remove();
								}).on('mouseup',function(d){
									var hovercircle = d3.select(".hover.edge[selected=true]");
									if(hovercircle.size()>0 && !hovercircle.attr("moved")){
										var bendpointinfo = d3.select(this).attr("id").split(":");
										var hoverinfo = hovercircle.attr("id").split(":");
										if(bendpointinfo[2]==hoverinfo[2]&&bendpointinfo[1]==hoverinfo[1]){
											//delete bendpoint
											configuration.deleteEdge(d,bendpointinfo[2])
											documentmodengine.drawEdge(d3.select(this.parentElement));
										}
									}

									d3.selectAll(".hover.edge").remove();
								});
							}
						}
					}
				}
			});
		}
		this.drawEdge(g);
		g.exit().remove();

	},
	buildView_internal: function(view_xml,lang){

		//SETUP CANVAS
		//view_node.selectAll("svg").remove();
		var node = d3.select(document.createElement("div"));
		var svg = node.append("svg");
		var defs = svg.append("defs");
		//attach defs from configuration
		if(configuration.definitions){
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
		}else{
			console.log("No definitons found.")
		}

		if(documentmodengine.usersettings.viewonly != true){
			//interaction
			svg
			.on('mouseup',
					function(d){

				svg
				.selectAll("g.connection[selected=true]").selectAll("circle[selected=true]").each(function(d){
					// calculate new position
					var currentcircle = d3.select(this);
					currentcircle.attr("selected", false);
					var currentedge = d3.select(this.parentElement);
					currentedge.attr("selected",false);
					documentmodengine.drawEdge(currentedge);
				});
				//if no circle was selected but an edge; this is performed
				svg
				.selectAll("g.connection[selected=true]").each(function(d){
					d3.select(this).attr("selected", false);
				});
				if(!d3.event.altKey){
					svg.selectAll("g.node[selected=true]").each(function(d){
						d3.select(this).attr("selected", false);
						documentmodengine.functions.updateNode(d3.select(this));
					});
				}

				d3.selectAll("#selector").remove();
				d3.selectAll(".hover.edge").remove();

			})
			.on('mousemove',
					function(d){
				if(d3.event.altKey) return;

				if(svg
				.selectAll("g.node[selected=true]").size()>1) return;

				svg
				.selectAll("g.node[selected=true]").each(function(d){
					/* calculate new position */
					var sel_x = parseInt(d3.select(this).attr('selected_x'));
					var sel_y = parseInt(d3.select(this).attr('selected_y'));
					var x = d3.event.x-sel_x;
					var y = d3.event.y-sel_y;

					var position = configuration.nodeposition(d3.select(this).data()[0]);
					var orig_x = position.x;
					var orig_y = position.y;

					var nodes = $(d3.select(this).data()).children("node");

					documentmodengine.functions.updateNodePosition(d3.select(this),x,y,orig_x,orig_y);

					d3.select(".nodeselector").attr("x",x-configuration.edgedistance/2)
					d3.select(".nodeselector").attr("y",y-configuration.edgedistance/2)

				});

				var hovercircle = svg.select(".hover.edge[selected=true]");
				if(hovercircle.size()>0){
					hovercircle.attr("moved",true);
					var sel_x = hovercircle.attr('selected_x');
					var sel_y = hovercircle.attr('selected_y');
					var x = d3.event.offsetX-sel_x;
					var y = d3.event.offsetY-sel_y;
					var classstring = hovercircle.attr("id");
					if(classstring){
						var bendpointindex = classstring.split(":")[2];
						if(bendpointindex){
							var edge = d3.select("#"+classstring.split(":")[1]);
							configuration.updateEdgePosition(edge.data()[0],bendpointindex,x,y);
							hovercircle.attr("cx",x).attr("cy",y);
						}
					}
				}
			});
		}

		documentmodengine.drawNodes(svg,view_xml.nodes); //start Drawing Nodes
		documentmodengine.drawEdges(svg,view_xml.edges); //start Drawing Edges



	return svg;
	},

	releaseModel: function(){
		if(documentmodengine.diagrams){
			for(var i = 0;i<documentmodengine.diagrams.length;i++){
				d3.select(documentmodengine.diagrams[i]).remove();
			}
		}
		documentmodengine.views = undefined;

		documentmodengine.status = undefined;
		documentmodengine.file = undefined;
		documentmodengine.url = undefined;

		window.viewsdata = [];
		window.viewvisualisations = [];
	},

	functions: {
			updateNodePosition: function(node,x,y,o_x,o_y){
				/* redraw sub ordinated nodes */
				//var nodes = $(node.self).children("node")
				var updates = node.data()[0].updates;
				if(updates){
					for(var i = 0 ; i< updates.length;i++){
						var sub_node = d3.select("g.node[id='"+updates[i]+"']");
						if(sub_node.size()>0){
							var sub_pos = configuration.nodeposition(sub_node.data()[0]);
							x_sub = parseInt(sub_pos.x);
							y_sub = parseInt(sub_pos.y);
							documentmodengine.functions.updateNodePosition(sub_node,
									x_sub+(x-o_x),
									y_sub+(y-o_y),
									x_sub,
									y_sub);
						}
					}
				}

				configuration.updateNodePosition(node.data()[0],x,y);
			},
			updateNode: function(node){
				//This redraws all nodes and associated connections
				/*change of data is done; now redraw the changed parts */
				documentmodengine.drawNode(node);

				var updates = node.data()[0].updates;
				if(updates){
					for(var i=0;i < updates.length;i++){
						var curId = updates[i];

						var current = d3.select("g.node[id='"+curId+"']");
						if(current.size()>0){
							documentmodengine.functions.updateNode(current);
						}else{
							current = d3.select("g.connection[id='"+curId+"']");
							if(current.size()>0){
								documentmodengine.drawEdge(current);
							}

						}
					}
				}
			},
			updateEdge:function(edge){
				drawEdge(edge);
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
					x = documentmodengine.functions.getValueFromData(x,data);
					y = documentmodengine.functions.getValueFromData(y,data);
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


}
