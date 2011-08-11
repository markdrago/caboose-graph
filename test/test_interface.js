set_test_group("Interface");

run_test(function() {
    var ui = new Interface();
    var hash = "#stat?zoom=1";
    assert(ui.get_param_value(hash, 'zoom') === '1', "get lone param value");
});

run_test(function() {
    var ui = new Interface();
    var hash = "#stat?myfavorite=hello&zoom=1";
    assert(ui.get_param_value(hash, 'zoom') === '1', "get second param value");
});

run_test(function() {
    var ui = new Interface();
    var hash = "#stat?zoom=1";
    assert(ui.zooming_is_requested(hash) === true, "zooming is on when requested");
});

run_test(function() {
    var ui = new Interface();
    var hash = "#stat?zoom=0";
    assert(ui.zooming_is_requested(hash) === false, "zooming is off when requested to be off");
});

run_test(function() {
    var ui = new Interface();
    var hash = "#stat";
    assert(ui.zooming_is_requested(hash) === true, "zooming is on by default");
});

run_test(function() {
    var ui = new Interface();
    var datafile = 'whatever.json';
    var zoom = '1';
    var result = ui.get_location_for_options(datafile, zoom);
    assert(result == '#whatever.json?zoom=1', "get correct location for datafile w/ zoom");
});

run_test(function() {
    var ui = new Interface();
    var datafile = 'whatever.json';
    var result = ui.get_location_for_options(datafile);
    assert(result == '#whatever.json', "get correct location for datafile w/o zoom");
});

