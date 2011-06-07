function Fetcher() { }

Fetcher.prototype.get_object = function(filename) {
    var result = {};

    $.ajax({
        url: filename,
        async: false,
        dataType: "json",
        success: function(data) {
            result = data;
        }
    });

    return result; 
};

