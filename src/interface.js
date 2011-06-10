function Interface() {
    this.fetcher = new Fetcher();
    this.statslist = undefined;
    
    this.prefixDir = "stats/";
};

Interface.prototype.init = function() {
    this.init_stats_list();
    this.show_stats_list();
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
        that.show_stat($(this).attr('data-file'), $(this).text());
        return false;
    });
    
    //set up action for returning to statslist from individual stat
    $('#backtolist').click(function() {
        that.show_stats_list();
        return false;
    });
};

Interface.prototype.show_stats_list = function() {
    $('title').text('Caboose: All Stats');
    $('#heading').text('All Stats');

    $('#stat').hide();    
    $('#allstats').show();
};

Interface.prototype.show_stat = function(filename, description) {
    $('title').text('Caboose: ' + description);
    $('#heading').text(description);

    $('#allstats').hide();
    $('#stat').show();

    this.render_stat(filename, description);
};

Interface.prototype.render_stat = function(filename, description) {
    var dataname = this.get_statname_from_filename(filename);
    var dataseries = this.get_dataseries_for_stat(filename, dataname);
    var plot = this.get_plot(dataseries);
    plot.set_options(this.get_plot_options(dataname, description));
    plot.draw();
};

Interface.prototype.get_plot = function(dataseries) {
    var plot = new Plot();
    plot.add_dataseries(dataseries.get_data());
    plot.set_container('#plot');
    return plot;
};

Interface.prototype.get_plot_options = function(dataname, description) {
    return {
        xaxis: {
            mode: "time",
            timeformat: "%y/%m/%d"
        },
        label: description,
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
}

Interface.prototype.get_dataseries_for_stat = function(filename, dataname) {
    var statjson = this.fetcher.get_object(this.prefixDir + filename);

    var dataseries = new DataSeries();
    dataseries.set_data(statjson, dataname);
    return dataseries;
};

Interface.prototype.get_statname_from_filename = function(filename) {
    var re = /\..*/;
    return filename.replace(re, "");
};

