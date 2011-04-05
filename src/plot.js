/* thin wrapper around flot */
function PlotApi() { }
PlotApi.prototype.plot = function(container, data, options) {
    $.plot(container, data, options);
}

function Plot() {
    this.dataseries = [];
    this.container = "";

    if ('plot' in $) {
        this.plotapi = new PlotApi();
    } else {
        this.plotapi = undefined;
    }
}

Plot.prototype.dataseries = [];
Plot.prototype.container = "";
Plot.prototype.options = {};
Plot.prototype.plotapi = undefined;

Plot.prototype.set_container = function(container) {
    this.container = container;
};

Plot.prototype.set_options = function(options) {
    this.options = options;
};

Plot.prototype.add_dataseries = function(dataseries) {
    this.dataseries.push(dataseries);
};

Plot.prototype.set_plotapi = function(plotapi) {
    this.plotapi = plotapi;
}

Plot.prototype.get_plot_series_object = function() {
    return {data: this.dataseries};
};

Plot.prototype.draw = function() {
    this.plotapi.plot(this.container, this.dataseries, this.options);
};

