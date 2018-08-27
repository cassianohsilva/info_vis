var countries = {};

var width = 800,
    height = 450;

var projection = d3.geoNaturalEarth1()
    .scale(130)
    .translate([width / 2, height / 2])
    .precision(.1);

var path = d3.geoPath()
    .projection(projection);

var graticule = d3.geoGraticule();

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("defs").append("path")
    .datum({type: "Sphere"})
    .attr("id", "sphere")
    .attr("d", path);

svg.append("use")
    .attr("class", "stroke")
    .attr("xlink:href", "#sphere");

svg.append("use")
    .attr("class", "fill")
    .attr("xlink:href", "#sphere");

svg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);

d3.tsv("node_modules/world-atlas/world/50m.tsv").then(function (c) {

    for (let i in c) {
        countries[c[i]['iso_n3']] = c[i];
    }

}).then(function () {

    Promise.all([
        d3.csv("data/dataset.csv"),
        d3.csv("data/types.csv"),
        d3.json("node_modules/world-atlas/world/110m.json")
    ])
        .then(function (v) {

            var data = v[0],
                types = v[1],
                world = v[2];


            svg.append("path")
                .attr("d", d3.geoPath())
                .attr('id', 'map_path');

            svg.selectAll("#map_path")
                .data(topojson.feature(world, world.objects.countries).features)
                .enter().append("path")
                .attr('class', 'country')
                .attr('id', function (d) {
                    return d.id;
                })
                .on('mouseover', function (d, n) {
                    console.log(countries[d['id']]['sovereignt']);
                })
                .attr("d", path);

        });
});