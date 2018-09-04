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
            ORIGIN: '#fb8650',
            DESTINATION: '#63b4cf',
            defaultFill: '#add8e6',
        },
        done: this._handleMapReady.bind(this),
        geographyConfig: {
            borderColor: 'white',
            highlightFillColor: '#fca982',
            highlightOnHover: false,
            // hideAntarctica: false
        },
        arcConfig: {
            strokeWidth: 0.45,
        }
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
var slider = initSlider('#years');
var selectedCountry = null;

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

svg.selectAll('.datamaps-subunit').on('click', displayMigration);

function displayMigration(data) {

    selectedCountry = this;

    if (missing[data.properties.name] !== undefined) {
        data.id = missing[i].id;
    }

    var year = slider.slider('getValue');
    var arcs = [];
    var destinations = [];

    if (migration[year][data.id] !== undefined) {
        arcs = migration[year][data.id].map(function (el) {
            if (positions[data.id] === undefined
                || positions[el.dest] === undefined
                || positions[data.id] === positions[el.dest]) {
                return undefined;
            }

            destinations.push(el.dest);

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

    var temp = {};

    destinations.forEach(function (el) {
        temp[el] = {
            fillKey: 'DESTINATION'
        };
    });

    temp[data.id] = {
        fillKey: 'ORIGIN'
    };

    map.updateChoropleth(temp, {reset: true});

    map.arc(arcs);
}


function initSlider(selector) {

    var data = [];

    for (var i = 1995; i <= 2017; i++) {
        data.push(i);
    }

    $(selector).slider({
        ticks: data,
        ticks_labels: data.map(function (el) {
            return `${el}`;
        })
    }).on('change', function () {
        if (selectedCountry) {
            d3.select(selectedCountry).each(displayMigration);
        }
    });

    return $(selector);
}

