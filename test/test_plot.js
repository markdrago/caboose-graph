/* mock plot api object */

function MockPlotApi() { }

MockPlotApi.prototype.plot_was_called = false;

MockPlotApi.prototype.plot = function(container, data, options) {
    this.plot_was_called = true;
    this.container = container;
    this.data = data;
    this.options = options;
};

/* tests */

set_test_group("Plot");

run_test(function() {
    var p = new Plot();
    p.add_dataseries([ [1,2], [3,4] ]);

    var plot_obj = p.get_plot_series_object();
    assert('data' in plot_obj, "get_plot_series_object, contains data element");
    
    var data = plot_obj.data;
    var is_correct = (data[0][0][0] == 1 && data[0][0][1] == 2 &&
                      data[0][1][0] == 3 && data[0][1][1] == 4);
    assert(is_correct, "get_plot_series_object, contains correct data");
});

run_test(function() {
    var p = new Plot();
    p.add_dataseries( [ [1,2] ] );
    p.add_dataseries( [ [4,5] ] );
    
    var plot_obj = p.get_plot_series_object();

    var data = plot_obj.data;
    var is_correct = (data[0][0][0] == 1 && data[0][0][1] == 2 &&
                      data[1][0][0] == 4 && data[1][0][1] == 5);
    assert(is_correct, "get_plot_series_object, multiple datasets");
});

run_test(function() {
    var p = new Plot();
    p.set_container("#container");
    p.set_options({color: '#badcab'});
    p.add_dataseries([ [1,2] ]);
    
    var plotapi = new MockPlotApi();
    p.set_plotapi(plotapi);

    p.draw();

    assert(plotapi.plot_was_called, "draw, Plotapi function was called");
    assert(plotapi.container == '#container', "draw, container was set properly");
    var data_is_correct = (plotapi.data[0][0][0] == 1 && plotapi.data[0][0][1] == 2);
    assert(data_is_correct, "draw, data elements are correct");
    assert(plotapi.options.color == '#badcab', "draw, options are correct");
});


