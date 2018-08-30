var countries = {};
var migration = {};
var positions = {};

var max_migrations = 0;

var width = 900,
    height = width * 0.47;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var projection = d3.geoNaturalEarth1()
    .scale(150)
    .translate([width / 2, height / 2])
    .precision(.1);

var graticule = d3.geoGraticule();

var path = d3.geoPath()
    .projection(projection);

svg.append("svg:defs").append("svg:marker")
    .attr("id", "triangle")
    .attr("refX", 6)
    .attr("refY", 6)
    .attr("markerWidth", 30)
    .attr("markerHeight", 30)
    .attr("markerUnits", "userSpaceOnUse")
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M 0 0 12 6 0 12 3 6")
    .style("fill", "#d64161");

function initMap() {


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

    // d3.tsv("node_modules/world-atlas/world/110m.tsv").then(function (c) {
    d3.tsv("https://unpkg.com/world-atlas@1/world/110m.tsv").then(function (c) {

        for (let i in c) {
            countries[c[i]['iso_n3']] = c[i];
        }

    }).then(function () {

        Promise.all([
            d3.csv("data/dataset.csv"),
            d3.csv("data/types.csv"),
            d3.json("https://unpkg.com/world-atlas@1/world/110m.json")
            // d3.json("node_modules/world-atlas/world/110m.json")
        ])
            .then(function (v) {

                var data = v[0],
                    types = v[1],
                    world = v[2];

                for (var i in data) {
                    var r = {};

                    for (var j in data[i]) {
                        r[j] = parseInt(data[i][j]);
                    }

                    data[i] = r;
                }

                for (var i in data) {

                    if (migration[data[i].year] === undefined) {
                        migration[data[i].year] = {};
                    }

                    var m = migration[data[i].year];
                    var element = null;

                    if (m[data[i].origin] === undefined) {

                        m[data[i].origin] = [{
                            orig: data[i].origin,
                            dest: data[i].country,
                            total: data[i].value,
                            types: [{
                                type: data[i].type,
                                value: data[i].value
                            }]
                        }];

                        element = m[data[i].origin][m[data[i].origin].length - 1];
                    } else {

                        element = m[data[i].origin].find(function (el) {
                            return el.dest === data[i].country;
                        });

                        if (element !== undefined) {
                            element.total += data[i].value;
                            element.types.push({
                                type: data[i].type,
                                value: data[i].value
                            });
                        } else {
                            m[data[i].origin].push({
                                orig: data[i].origin,
                                dest: data[i].country,
                                total: data[i].value,
                                types: [{
                                    type: data[i].type,
                                    value: data[i].value
                                }]
                            });

                            element = m[data[i].origin][m[data[i].origin].length - 1];
                        }
                    }

                    if (element.total > max_migrations) {
                        max_migrations = element.total;
                    }
                }

                svg.append("path")
                    .attr("d", d3.geoPath())
                    .attr('id', 'map_path');

                svg.append("path")
                    .attr("d", d3.geoPath())
                    .attr('id', 'circles');

                svg.selectAll("#map_path")
                    .data(topojson.feature(world, world.objects.countries).features)
                    .enter().append("path")
                    .attr('class', 'country')
                    .attr('id', function (d, n) {
                        return `c${parseInt(d.id)}`;
                    })
                    .attr("d", path)
                    .each(function (d, i) {
                        positions[parseInt(d.id)] = path.centroid(d);
                    }).call(function () {
                    showMigration(2016, 50);
                })
                    .on('mouseover', function (country_data, n) {

                        // if (migration[2016][country_data.id] !== undefined) {
                        //
                        //     var line = d3.line();
                        //
                        //     var data = migration[2016][country_data.id].filter(function (m) {
                        //         return (positions[m.dest] !== undefined);
                        //     });
                        //
                        //     var circles = svg.selectAll('#circles')
                        //         .data(data)
                        //         .enter()
                        //         .append('g')
                        //         .attr('class', 'migration-info');
                        //
                        //     circles
                        //         .append('circle')
                        //         .attr('class', 'num_refugees no-mouse')
                        //         .attr('cx', function (d) {
                        //             return positions[d.dest][0];
                        //         })
                        //         .attr('cy', function (d) {
                        //             return positions[d.dest][1];
                        //         })
                        //         .attr('r', 0)
                        //         .transition()
                        //         .ease(d3.easeLinear)
                        //         .delay(700)
                        //         .duration(700)
                        //         .attr('r', function (d) {
                        //             return Math.abs(Math.log(Math.abs(d.total))) * 1.5;
                        //         });
                        //
                        //     circles
                        //         .append('text')
                        //         .attr('x', function (d) {
                        //             return positions[d.dest][0];
                        //         })
                        //         .attr('y', function (d) {
                        //             return positions[d.dest][1];
                        //         })
                        //         .attr('class', 'txt-num-refugees')
                        //         .text('')
                        //         .transition()
                        //         .ease(d3.easeLinear)
                        //         .delay(700)
                        //         .duration(700)
                        //         .tween('text', function (d) {
                        //
                        //             var that = d3.select(this);
                        //
                        //             return function (t) {
                        //                 that.text(parseInt(t * d.total));
                        //             };
                        //         });
                        //
                        //     svg.selectAll('#lines')
                        //         .data(data)
                        //         .enter()
                        //         .append('line')
                        //         .attr('d', line)
                        //         .attr('class', 'no-mouse migration-line')
                        //         .attr("marker-end", "url(#triangle)")
                        //         .attr('x1', function () {
                        //             return positions[country_data.id][0];
                        //         })
                        //         .attr('y1', function () {
                        //             return positions[country_data.id][1];
                        //         })
                        //         .attr('x2', function (d) {
                        //             return positions[country_data.id][0];
                        //         })
                        //         .attr('y2', function (d) {
                        //             return positions[country_data.id][1];
                        //         })
                        //         .transition()
                        //         .ease(d3.easeLinear)
                        //         .duration(700)
                        //         .attr('x2', function (d) {
                        //             return positions[d.dest][0];
                        //         })
                        //         .attr('y2', function (d) {
                        //             return positions[d.dest][1];
                        //         })
                        //         .transition()
                        //         .ease(d3.easeLinear)
                        //         .duration(700)
                        //         .attr('x1', function (d) {
                        //             return positions[d.dest][0];
                        //         })
                        //         .attr('y1', function (d) {
                        //             return positions[d.dest][1];
                        //         })
                        //         // Gambiarra pq o evento 'end' não funciona
                        //         .transition()
                        //         .duration(1)
                        //         .attr('display', 'none');
                        // }
                    }).on('mouseout', function (d, i) {
                    // svg.selectAll('.migration-line')
                    //     .remove();
                    //
                    // svg.selectAll('.migration-info').remove();
                })
            })
    })
}

function shuffleArray(array) {

    var temp = array;

    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        temp[i] = array[j];
        temp[j] = array[i];
    }

    return temp;
}

function showMigration(year, n_slices) {

    var duration = 2000;
    var slice = Object.keys(migration[year]).length / n_slices;

    var keys = shuffleArray(Object.keys(migration[year]));

    var sum = 0;

    for (var i = 0; i < n_slices; i++) {
        var ids = keys.slice(i * slice, (i + 1) * slice);

        var line = d3.line();

        var data = [];

        sum += ids.length;

        for (var j in ids) {
            data = data.concat(migration[year][ids[j]].filter(function (m) {
                return (m.orig !== m.dest)
                    && (positions[m.orig] !== undefined)
                    && (positions[m.dest] !== undefined);
            }));
        }

        svg.append("path")
            .attr("d", d3.geoPath())
            .attr('id', `flow_${year}_${i}`);

        svg.selectAll(`flow_${year}_${i}`)
            .data(data)
            .enter()
            .append('line')
            .attr('d', line)
            .attr('class', 'no-mouse migration-line')
            // .attr("marker-end", "url(#triangle)")
            .attr('x1', function (d) {
                return positions[d.orig][0];
            })
            .attr('y1', function (d) {
                return positions[d.orig][1];
            })
            .attr('x2', function (d) {
                return positions[d.orig][0];
            })
            .attr('y2', function (d) {
                return positions[d.orig][1];
            })
            .transition()
            .delay(i * 1.5 * duration)
            .ease(d3.easeLinear)
            .duration(duration)
            .attr('x2', function (d) {
                return positions[d.dest][0];
            })
            .attr('y2', function (d) {
                return positions[d.dest][1];
            })
            .transition()
            .ease(d3.easeLinear)
            .duration(duration)
            .attr('x1', function (d) {
                return positions[d.dest][0];
            })
            .attr('y1', function (d) {
                return positions[d.dest][1];
            })
            .remove();
    }
}

function getArc(d, s) {
    var dx = d.destination.x - d.origin.x;
    var dy = d.destination.y - d.origin.y;
    var dr = Math.sqrt(dx * dx + dy * dy);
    var spath = s === false ? ' 0 0,0 ' : ' 0 0,1 ';
    return 'M' + d.origin.x + ',' + d.origin.y + 'A' + dr + ',' + dr + spath + d.destination.x + ',' + d.destination.y;
}


initMap();