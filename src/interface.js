function Interface() {
    this.fetcher = new Fetcher();
    this.statslist = undefined;
    
    this.prefixDir = "stats/";
};

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
        history.pushState(null, null, loc);
        that.show_page_based_on_location();
        return false;
    });

    //setup action for clicking zoom in/out link
    $('#zoom').delegate('a', 'click', function() {
        var datafile = $(this).attr('data-file');
        var zoom = $(this).attr('data-zoom');
        var loc = that.get_location_for_options(datafile, zoom);
        history.pushState(null, null, loc);
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

Interface.prototype.show_page_based_on_location = function() {
    if (location.hash == "#" || location.hash == "") {
        this.show_stats_list();
    } else {
        var zoom = false;
        if (this.zooming_is_requested(location.hash)) {
            zoom = true;
        }
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

    if (zoom !== true) {
        zoom = false;
    }

    this.render_stat(filename, zoom);
};

Interface.prototype.render_stat = function(filename, zoom) {
    var dataseries = this.get_dataseries_for_stat(filename);

    $('title').text('Caboose: ' + dataseries.get_description());
    $('#heading').text(dataseries.get_description());

    var plot = this.get_plot(dataseries, zoom);
    plot.draw();
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

    if (zoom === true) {
        opts.yaxis.min = undefined;
        opts.yaxis.max = undefined;
        this.set_zoom_link_target('out');
    } else {
        opts.yaxis.min = 0;
        opts.yaxis.max = 100;
        this.set_zoom_link_target('in');
    }
    $('#zoom').show();
};

Interface.prototype.set_zoom_link_target = function(dir) {
    var zoom = '0';
    var desc = 'zoom out';
    if (dir === 'in') {
        zoom = '1';
        desc = 'zoom in';
    }

    var filename = this.get_filename_from_url();
    $('#zoom').html('<a href="#" data-zoom="' + zoom + '" data-file="' + filename + '">' + desc + '</a>');
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

Interface.prototype.zooming_is_requested = function(hash) {
    return this.get_param_value(hash, 'zoom') === '1';
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

