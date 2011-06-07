set_test_group("Fetcher");

var run_fetcher_tests = true;
if (document.location.href.substr(0, 7) == "file://") {
    run_fetcher_tests = false;
    skip("Skipping fetcher tests when running locally, try 'python -m SimpleHTTPServer'");
}

run_test(function() {
    if (! run_fetcher_tests) return;

    var fetcher = new Fetcher();
    var result = fetcher.get_object("test_fetcher_target.json");
    assert(result.testkey == "testvalue", "get_object, gets js object from file correctly");
});

