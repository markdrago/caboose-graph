function Navigator() { }

Navigator.prototype.index = {};

Navigator.prototype.parse_index = function(index_data) {
    this.index = $.parseJSON(index_data);
};

