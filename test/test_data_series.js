add_test(function() {
    json = '{ "123": { "keyname": 456 } }';

    ds = new DataSeries();
    ds.parse_json(json, "keyname");
    assert(ds.data[123] == 456, "Get simple value for a single data type");
    assert(ds.dataname == "keyname", "Keyname is properly remembered");
});
