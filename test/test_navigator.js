set_test_group("Navigator");

run_test(function() {
    var desc = "Lines of code in NatpalShared (*.java)";

    var index = '{ "stats": [ \
                    { "description": "' + desc + '", \
                      "filename": "lines.json"\
                    } \
                 ] }';

    var nav = new Navigator();
    nav.parse_index(index);
    assert(nav.index.stats[0].filename == "lines.json", "Parse index, get filename");
    assert(nav.index.stats[0].description == desc, "Parse index, get description");
});


