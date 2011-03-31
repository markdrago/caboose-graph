set_test_group("DataSeries");

run_test(function() {
    json = '{ "123": { "keyname": 456 } }';

    ds = new DataSeries();
    ds.parse_json(json, "keyname");
    assert(ds.data[123] == 456, "Get simple value for a single data type");
    assert(ds.dataname == "keyname", "Keyname is properly remembered");
});

run_test(function() {
    json = '{ "123": { "keyname": 456 , "otherkey": 789} }';

    ds = new DataSeries();
    ds.parse_json(json, "keyname");
    assert(ds.data[123] == 456, "Get simple value for a single data type with other data type present");
});

run_test(function() {
    json = '{ "123": { "otherkey": 789} }';
    
    ds = new DataSeries();
    ds.parse_json(json, "keyname");
    
    var passes = true;
    for (var i in ds.data) {
        if (i == '123') {
            passes = false;
            break;
        }
    }
    assert(passes, "Key is not parsed if requested data type is not present");
});

run_test(function() {
    json = '{ "123": { "keyname": 456 , "otherkey": 789}, ' +
           '  "234": { "keyname": 512 }, ' +
           '  "345": { "otherkey" : 768 }' +
           '}';

    ds = new DataSeries();
    ds.parse_json(json, "keyname");
    assert(ds.data_point_count() == 2, "Complex parsing, correct count");
    assert(ds.data[123] == 456, "Complex parsing, first key is correct");
    assert(ds.data[234] == 512, "Complex parsing, second key is correct");
});

run_test(function() {
    json = '{ "123": { "keyname": 456 , "otherkey": 789}, ' +
       '  "234": { "keyname": 512 }, ' +
       '  "345": { "otherkey" : 768 }' +
       '}';

    ds = new DataSeries();
    ds.parse_json(json, "keyname");
    var lists = ds.get_array_of_arrays();
    assert(lists.length == 2, "array_of_arrays, length correct");

    if (lists[0].length != 2 || lists[1].length != 2 ||
        lists[0][0] != 123 || lists[0][1] != 456 ||
        lists[1][0] != 234 || lists[1][1] != 512) {
        assert(false, "array_of_arrays, inner arrays match");
    } else {
        assert(true, "array_of_arrays, inner arrays match");
    }
});

