var positions = {};

var migration = {};
var max_migrations = 0;

var missing = {
    Kosovo: 'SRB',
    Somaliland: 'SOM'
};

function Datamap() {
    this.$container = $("#container");
    this.instance = new Datamaps({
        scope: 'world',
        element: this.$container.get(0),
        projection: 'equirectangular',
        fills: {
            defaultFill: '#dddddd'
        },
        done: this._handleMapReady.bind(this),
        // geographyConfig: {
        //     hideAntarctica: false
        // }
    });
}

Datamap.prototype._handleMapReady = function (datamap) {
    this.zoom = new Zoom({
        $container: this.$container,
        datamap: datamap
    });
};

var map = new Datamap().instance;
var svg = map.svg;
var path = map.path;

svg.selectAll('.datamaps-subunit').each(function (data) {
    positions[data.id] = map.projection.invert(path.centroid(data));
})
    .call(function () {

        d3.queue()
            .defer(d3.csv, "data/dataset.csv")
            .defer(d3.csv, "data/types.csv")
            .awaitAll(function (error, v) {
                if (error) {
                    console.log('Error');
                }

                console.log(v);

                var data = v[0],
                    types = v[1];

                for (var i in data) {
                    data[i].year = parseInt(data[i].year);
                    data[i].type = parseInt(data[i].type);
                    data[i].value = parseInt(data[i].value);
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
            });
    });

svg.selectAll('.datamaps-subunit').on('click', function (data) {

    if (missing[data.properties.name] !== undefined) {
        data.id = missing[i].id;
    }

    var arcs = [];

    if(migration[2016][data.id] !== undefined) {
        arcs = migration[2016][data.id].map(function (el) {
            if (positions[data.id] === undefined
                || positions[el.dest] === undefined
                || positions[data.id] === positions[el.dest]) {
                return undefined;
            }

            return {
                origin: {
                    latitude: positions[data.id][1],
                    longitude: positions[data.id][0],
                },
                destination: {
                    latitude: positions[el.dest][1],
                    longitude: positions[el.dest][0],
                }
            };
        }).filter(function (el) {
            return el !== undefined;
        });
    }

    map.arc(arcs);
});

