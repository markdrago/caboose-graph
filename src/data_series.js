function DataSeries() { }

DataSeries.prototype.data = {};
DataSeries.prototype.dataname = "";

DataSeries.prototype.parse_json = function(json, dataname) {
    this.data = {};
    this.dataname = dataname;
    
    var jsonobj = $.parseJSON(json);
    for (var key in jsonobj) {
        if (jsonobj[key][dataname] !== undefined) {
            this.data[key] = jsonobj[key][dataname];
        }
    }
};

DataSeries.prototype.data_point_count = function() {
    var count = 0;
    for (var i in this.data) {
        if (this.data.hasOwnProperty(i)) {
            count++;
        }
    }
    return count;
};

DataSeries.prototype.get_data = function() {
    var keys = [];
    for (var i in this.data) {
        keys.push(i);
    }
    keys.sort();

    var results = [];
    for (var i in keys) {
        var key = keys[i];
        results.push([key, this.data[key]]);
    }
    return results;
};

