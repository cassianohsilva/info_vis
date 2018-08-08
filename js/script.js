var context = d3.select("#canvas");
var projection = d3.geoNaturalEarth1()
	.scale(150)
	.translate([370, 220]);
	// .center([0, 5]);

var path = d3.geoPath(projection);
var countries = {};

d3.tsv("node_modules/world-atlas/world/110m.tsv").then(function(c) {

	for(let i in c) {
		countries[c[i]['iso_n3']] = c[i];
	}

}).then(function() {

	d3.json("node_modules/world-atlas/world/110m.json").then(function(world) {

		context.append("path")
			.attr("d", d3.geoPath());

		context.selectAll("path")
		.data(topojson.feature(world, world.objects.countries).features)
		.enter().append("path")
		.attr('id', function(d) {
			return d.id;
		})
		.on('mouseover', function(d, n) {

		})
		.attr("d", path);
	});

});