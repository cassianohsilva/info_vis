var context = d3.select("#canvas");
var projection = d3.geoNaturalEarth1()
	.scale(150)
	.translate([370, 220]);
	// .center([0, 5]);

var path = d3.geoPath(projection);
var countries = {};

d3.tsv("node_modules/world-atlas/world/50m.tsv").then(function(c) {

	for(let i in c) {
		countries[c[i]['iso_n3']] = c[i];
	}

}).then(function() {

	Promise.all([
			d3.csv("data/dataset.csv"),
			d3.csv("data/types.csv"),
			d3.json("node_modules/world-atlas/world/110m.json")
		])
	.then(function(v) {
			
		var data = v[0],
			types = v[1],
			world = v[2];


		context.append("path")
			.attr("d", d3.geoPath());

		context.selectAll("path")
		.data(topojson.feature(world, world.objects.countries).features)
		.enter().append("path")
		.attr('id', function(d) {
			return d.id;
		})
		.on('mouseover', function(d, n) {
			console.log(d['id'] == parseInt(d['id']));
		})
		.attr("d", path);		

	});

	// d3.queue()
	// 	.defer(d3.csv, "data/dataset.csv")
	// 	.defer(d3.csv, "data/types.csv")
	// 	.defer(d3.json, "node_modules/world-atlas/world/110m.json")
	// 	.await(function(error, data, types, world) {

	// 		console.log(error, data, types, world);

	// 		// context.append("path")
	// 		// 	.attr("d", d3.geoPath());

	// 		// context.selectAll("path")
	// 		// .data(topojson.feature(world, world.objects.countries).features)
	// 		// .enter().append("path")
	// 		// .attr('id', function(d) {
	// 		// 	return d.id;
	// 		// })
	// 		// .on('mouseover', function(d, n) {
	// 		// 	console.log(d);
	// 		// })
	// 		// .attr("d", path);
	// });

	

	// d3.json("node_modules/world-atlas/world/110m.json").then(function(world) {

	// 	context.append("path")
	// 		.attr("d", d3.geoPath());

	// 	context.selectAll("path")
	// 	.data(topojson.feature(world, world.objects.countries).features)
	// 	.enter().append("path")
	// 	.attr('id', function(d) {
	// 		return d.id;
	// 	})
	// 	.on('mouseover', function(d, n) {

	// 	})
	// 	.attr("d", path);
	// });

});