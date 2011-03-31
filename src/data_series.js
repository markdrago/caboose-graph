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

DataSeries.prototype.get_array_of_arrays = function() {
    var results = [];
    for (var i in this.data) {
        results.push([i, this.data[i]]);
    }
    return results;
};

