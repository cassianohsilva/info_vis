// var context = d3.select("#canvas").node().getContext("2d"),
var context = d3.select("#canvas");
var projection = d3.geoNaturalEarth1()
	.scale(150)
	.translate([370, 220]);
	// .center([0, 5]);

var path = d3.geoPath(projection);

d3.json("node_modules/world-atlas/world/110m.json").then(function(world) {
  // context.beginPath();
  // path(topojson.mesh(world));
  // context.stroke();
	// console.log(topojson.feature(world, world.objects.countries));

	context.append("path")
		.attr("d", d3.geoPath());

	context.selectAll("path")
		// .data(topojson.mesh(world))
		.data(topojson.feature(world, world.objects.countries).features)
		// .data(topojson.mesh(world))
		.enter().append("path")
		.style('fill', '#ddd')
		.style('stroke', 'black')
		.attr("d", path);

  // console.log(topojson.mesh(world));
});

// var world = require("./node_modules/world-atlas/world/110m.json")

// var svg = d3.select('svg');

// // var projection = d3.geo.mercator();

// // var path = d3.geo.path()
// //           .projection(projection);

// // d3.json(
// //   "https://raw.githubusercontent.com/andybarefoot/andybarefoot-www/master/maps/mapdata/custom50.json",
// //   function(json) {
// //      /////////////////////////////////////////////
// //      //////// Here we will put a lot of code concerned
// //      //////// with drawing the map. This will be defined
// //      //////// in the next sections.
// //      /////////////////////////////////////////////
// //   }
// // );

// // function ready(error, us) {
// // 	// svg.append("g").data(topojson.feature(us, us.objects.counties).features);
// // 	svg.append("g").data(topojson);

// // }

// // d3.queue()
// //     .await(ready);


// // var url = "https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/us.json";
// var url = "https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/us.json";

// var path = d3.geoPath();

// d3.json(url).then(function(topology) {

// 	// console.log('svausvstdvytct');

// 	// console.log("topojson", topology)
// 	// var geojson = topojson.feature(topology, topology.objects.counties);
// 	// console.log("geojson", geojson)

// 	svg.append("path")
// 	    // .datum({type: "FeatureCollection", features: features})
// 	    .datum({type: "FeatureCollection", features: topojson.feature(all)})
// 	    .attr("d", d3.geoPath());

// 	// svg.selectAll("path")
// 	// 	.data(features)
// 	// 	.enter().append("path")
// 	// 	.attr("d", d3.geoPath());

// });