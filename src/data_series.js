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

