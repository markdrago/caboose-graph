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
        that.show_stat($(this).attr('data-file'));
        history.pushState(null, null, '#' + $(this).attr('data-file'));
        return false;
    });
    
    //set up action that runs when back/fwd buttons are hit
    window.onpopstate = function(e, blah) {
        that.show_page_based_on_location();
    };
};

Interface.prototype.show_page_based_on_location = function() {
    if (location.hash == "#" || location.hash == "") {
        this.show_stats_list();
    } else {
        this.show_stat(location.hash.substr(1));
    }
}

Interface.prototype.show_stats_list = function() {
    $('title').text('Caboose: All Stats');
    $('#heading').text('');

    $('#stat').hide();
};

Interface.prototype.show_stat = function(filename) {
    $('#stat').show();

    this.render_stat(filename);
};

Interface.prototype.render_stat = function(filename) {
    var dataseries = this.get_dataseries_for_stat(filename);

    $('title').text('Caboose: ' + dataseries.get_description());
    $('#heading').text(dataseries.get_description());

    var plot = this.get_plot(dataseries);
    plot.set_options(this.get_plot_options(dataseries));
    plot.draw();
};

Interface.prototype.get_plot = function(dataseries) {
    var plot = new Plot();
    plot.add_dataseries(dataseries.get_data());
    plot.set_container('#plot');
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

    if (dataseries.get_datatype() == "percentage") {
        opts.yaxis.min = 0;
        opts.yaxis.max = 100;
    }

    return opts
}

Interface.prototype.get_dataseries_for_stat = function(filename) {
    var statjson = this.fetcher.get_object(this.prefixDir + filename);

    var dataseries = new DataSeries();
    dataseries.parse_json(statjson);
    return dataseries;
};

Interface.prototype.get_statname_from_filename = function(filename) {
    var re = /\..*/;
    return filename.replace(re, "");
};

