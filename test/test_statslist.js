set_test_group("StatsList");

run_test(function() {
    var desc = "Lines of code in NatpalShared (*.java)";
    var index = { "stats":
                    [
                        {
                            "description": desc,
                            "filename": "lines.json"
                        }
                    ]
                };

    var statslist = new StatsList();
    statslist.set_index(index);
    
    var stats = statslist.get_items();
    assert(stats.length == 1, "get_items, correct # of items");
    assert(stats[0].filename == "lines.json", "get_items, check filename");
    assert(stats[0].description == desc, "get_items, check description");
});

