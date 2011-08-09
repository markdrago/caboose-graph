function DataSeries() { }

DataSeries.prototype.data = {};
DataSeries.prototype.description = "";

DataSeries.prototype.parse_json = function(json) {
    this.set_data(json);
    this.set_description(json.description);
    this.set_datatype(json.datatype);
};

DataSeries.prototype.set_data = function(data) {
    this.data = {};
    
    for (var key in data.stats) {
        if (data.stats[key] !== undefined) {
            this.data[key] = data.stats[key];
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

DataSeries.prototype.can_zoom = function() {
    return this.get_datatype() == 'percentage';
};

DataSeries.prototype.set_description = function(description) {
    this.description = description;
};

DataSeries.prototype.get_description = function() {
    return this.description;
};

DataSeries.prototype.set_datatype = function(datatype) {
    this.datatype = datatype;
};

DataSeries.prototype.get_datatype = function() {
    return this.datatype;
};

