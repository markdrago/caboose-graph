function StatsList() { }

StatsList.prototype.index = {};

StatsList.prototype.set_index = function(index) {
    this.index = index;
};

StatsList.prototype.get_items = function() {
    return this.index.stats;
};

