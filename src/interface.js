function Interface() {
    this.fetcher = new Fetcher();
    this.statslist = undefined;
    
    this.prefixDir = "stats/";
};

var ZOOMTYPE = {
    FULL_OUT: 'full_out',
    FULL_IN: 'full_in',
    PIN_MIN_TO_ZERO: 'pin_min_to_zero'
}

Interface.prototype.init = function() {
    this.warn_about_broken_history();
    this.init_stats_list();
    this.show_page_based_on_location();
};

Interface.prototype.warn_about_broken_history = function() {
    if (history.pushState !== undefined) {
        return;
    }
    $('#broken_history').show();
};

Interface.prototype.init_stats_list = function() {
    var index = this.fetcher.get_object(this.prefixDir + "index.json");
    
    this.statslist = new StatsList();
    this.statslist.set_index(index);
    
    //create list item for each stat in index file
    $('#statslist').empty();
    $.each(this.statslist.get_items(), function(index, item) {
        $('#statslist').append('<li><a href="#" data-file=' + item.filename + '>' + item.description + '</li>');
    });

    //set up action for clicking name of stat in list
    var that = this;
    $('#statslist').delegate('a', 'click', function() {
        var loc = that.get_location_for_options($(this).attr('data-file'));
        that.switch_location(loc);
        that.show_page_based_on_location();
        return false;
    });

    //setup action for clicking zoom in/out link
    $('#zoom').delegate('a', 'click', function() {
        var datafile = $(this).attr('data-file');
        var zoom = $(this).attr('data-zoom');
        var loc = that.get_location_for_options(datafile, zoom);
        that.switch_location(loc);
        that.show_page_based_on_location();
        return false;
    });
    
    //set up action that runs when back/fwd buttons are hit
    window.onpopstate = function(e, blah) {
        that.show_page_based_on_location();
    };
};

Interface.prototype.get_location_for_options = function(datafile, zoom) {
    var result = '#' + datafile;
    if (zoom !== undefined) {
        result += '?zoom=' + zoom;
    }
    return result;
};

Interface.prototype.switch_location = function(location) {
    if (history.pushState !== undefined) {
        history.pushState(null, null, location);
    } else {
        window.location = location;
    }
}

Interface.prototype.show_page_based_on_location = function() {
    if (location.hash == "#" || location.hash == "") {
        this.show_stats_list();
    } else {
        var zoom = this.get_zoom_type_requested(location.hash);
        var filename = this.get_filename_from_url();
        this.show_stat(filename, zoom);
    }
}

Interface.prototype.show_stats_list = function() {
    $('title').text('Caboose: All Stats');
    $('#heading').text('');

    $('#stat').hide();
};

Interface.prototype.show_stat = function(filename, zoom) {
    $('#stat').show();
    this.render_stat(filename, zoom);
};

Interface.prototype.render_stat = function(filename, zoom) {
    var dataseries = this.get_dataseries_for_stat(filename);

    $('title').text('Caboose: ' + dataseries.get_description());
    $('#heading').text(dataseries.get_description());

    var plot = this.get_plot(dataseries, zoom);
    plot.draw();

    //set up action that runs when hovering over the chart (for tooltips)
    $("#plot").bind("plothover", hover_over_chart);
};

Interface.prototype.get_plot = function(dataseries, zoom) {
    var plot = new Plot();
    plot.add_dataseries(dataseries.get_data());
    plot.set_container('#plot');

    var opts = this.get_plot_options(dataseries);
    this.setup_zooming(opts, dataseries, zoom);
    plot.set_options(opts);

    return plot;
};

Interface.prototype.get_plot_options = function(dataseries) {
    var opts = {
        xaxis: {
            mode: "time",
            timeformat: "%m/%d"
        },
        yaxis: { },
        label: dataseries.get_description(),
        legend: {
            show: true
        },
        grid: { hoverable: true },
        series: {
            lines: {
                show: true
            },
            points: {
                show: true,
                radius: 3
            }
        }
    };

    return opts
};

Interface.prototype.setup_zooming = function(opts, dataseries, zoom) {
    if (! dataseries.can_zoom()) {
        $('#zoom').hide();
        return;
    }

    if (zoom === ZOOMTYPE.FULL_IN) {
        opts.yaxis.min = undefined;
        opts.yaxis.max = undefined;
        this.set_zoom_link_target(ZOOMTYPE.FULL_OUT);
    } else if (zoom === ZOOMTYPE.PIN_MIN_TO_ZERO) {
        opts.yaxis.min = 0;
        opts.yaxis.max = undefined;
        this.set_zoom_link_target(ZOOMTYPE.FULL_IN);
    } else {
        opts.yaxis.min = 0;
        opts.yaxis.max = 100;
        this.set_zoom_link_target(ZOOMTYPE.PIN_MIN_TO_ZERO);
    }
    $('#zoom').show();
};

Interface.prototype.set_zoom_link_target = function(dir) {
    var desc = 'fully zoom out';
    if (dir === ZOOMTYPE.FULL_IN) {
        desc = 'fully zoom in';
    } else if (dir === ZOOMTYPE.PIN_MIN_TO_ZERO) {
        desc = 'zoom but pin min to zero';
    }

    var filename = this.get_filename_from_url();
    $('#zoom').html('<a href="#" data-zoom="' + dir + '" data-file="' + filename + '">' + desc + '</a>');
};

Interface.prototype.get_filename_from_url = function() {
    //split the fragment off of the path and everything else
    var re = /#/;
    var pieces = location.href.split(re);
    if (pieces.length <= 1) {
        return;
    }

    //split the query off of the fragment
    re = /\?/;
    return pieces[1].split(re)[0];
};

Interface.prototype.get_zoom_type_requested = function(hash) {
    var zoom_requested = this.get_param_value(hash, 'zoom');
    if (zoom_requested === ZOOMTYPE.FULL_OUT) {
        return ZOOMTYPE.FULL_OUT;
    } else if (zoom_requested === ZOOMTYPE.PIN_MIN_TO_ZERO) {
        return ZOOMTYPE.PIN_MIN_TO_ZERO;
    } else {
        return ZOOMTYPE.FULL_IN;
    }
};

Interface.prototype.get_param_value = function(hash, key) {
    if (hash === undefined) {
        return;
    }

    var re = /\?/;    
    var pieces = hash.split(re);
    if (pieces.length <= 1) {
        return;
    }

    var params = pieces[1];
    re = /&/;
    var pairs = params.split(re);

    var result = undefined;
    $.each(pairs, function(i, elem) {
        re = /=/;
        var keyvalue = elem.split(re);
        if (keyvalue[0] == key) {
            result = keyvalue[1];
            return;
        }
    });
    return result;
};

Interface.prototype.get_dataseries_for_stat = function(filename) {
    var statjson = this.fetcher.get_object(this.prefixDir + filename);

    var dataseries = new DataSeries();
    dataseries.parse_json(statjson);
    return dataseries;
};


//tooltip on hover
var previous_hover_point = undefined;
var hover_over_chart = function (event, pos, item) {
    if (item) {
        if (previous_hover_point == item.datapoint) {
            //already showing tooltip for this data point
            return;
        }
        previous_hover_point = item.datapoint;

        $("#tooltip").remove();
        var x = item.datapoint[0].toFixed(2),
            y = item.datapoint[1].toFixed(2);

        show_tooltip(item.pageX, item.pageY, y);
    } else {
        //moved off of a data point
        $("#tooltip").remove();
        previous_hover_point = null;
    }
};

var show_tooltip = function (x, y, contents) {
    $('<div id="tooltip">' + contents + '</div>').css({
        position: 'absolute',
        display: 'none',
        top: y + 10,
        left: x + 10,
        border: '1px solid #fdd',
        padding: '2px',
        'background-color': '#fee',
        opacity: 0.80
    }).appendTo("body").fadeIn(200);
};

