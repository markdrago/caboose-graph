set_test_group("DataSeries");

run_test(function() {
    var json = { "stats": { "123": 456 } };

    var ds = new DataSeries();
    ds.parse_json(json);
    assert(ds.data[123] == 456, "parse_json, get simple value for a single data type");
});

run_test(function() {
    var json = { "datatype": "percentage", "stats": { "123": 456 } };

    var ds = new DataSeries();
    ds.parse_json(json);
    assert(ds.get_datatype() == "percentage", "parse_json, datatype");
});

run_test(function() {
    var json = { "description": "desc goes here", "stats": { "123": 456 } };

    var ds = new DataSeries();
    ds.parse_json(json);
    assert(ds.get_description() == "desc goes here", "parse_json, description text");
});

run_test(function() {
    var json = { "stats": { "123": 456,
                            "234": 512,
                            "345": 768 }
               };

    var ds = new DataSeries();
    ds.parse_json(json);
    assert(ds.data_point_count() == 3, "parse_json, complex parsing, correct count");
    assert(ds.data[123] == 456, "parse_json, complex parsing, first key is correct");
    assert(ds.data[234] == 512, "parse_json, complex parsing, second key is correct");
});

run_test(function() {
    var data = { "stats": { "123": 456 } };

    var ds = new DataSeries();
    ds.set_data(data);
    assert(ds.data[123] == 456, "set_data, get simple value for a single data type");
});

run_test(function() {
    var json = { "stats": { "123": 456,
                            "234": 512,
                            "345": 768 }
       };

    var ds = new DataSeries();
    ds.parse_json(json);
    var lists = ds.get_data();
    assert(lists.length == 3, "get_data, length correct");

    if (lists[0].length != 2 || lists[1].length != 2 || lists[2].length != 2 ||
        lists[0][0] != 123 || lists[0][1] != 456 ||
        lists[1][0] != 234 || lists[1][1] != 512 ||
        lists[2][0] != 345 || lists[2][1] != 768) {
        assert(false, "get_data, inner arrays match");
    } else {
        assert(true, "get_data, inner arrays match");
    }
});

run_test(function() {
    var json = { "stats": {"234": 2, "123": 1}};
    
    var ds = new DataSeries();
    ds.parse_json(json);
    var lists = ds.get_data();

    assert((lists[0][0] == "123" && lists[1][0] == "234"), "get_data, reorders by key");
});

run_test(function() {
    var json = { "datatype": "percentage", "stats": { "123": 456 } };

    var ds = new DataSeries();
    ds.parse_json(json);
    assert(ds.can_zoom() == true, "percentage data types support zooming");
});

run_test(function() {
    var json = { "datatype": "count", "stats": { "123": 456 } };

    var ds = new DataSeries();
    ds.parse_json(json);
    assert(ds.can_zoom() == false, "non-percentage data types do not support zooming");
});

