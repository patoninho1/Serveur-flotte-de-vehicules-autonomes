var method = vehicule.prototype;

function vehicule(age) {
	this.lat = 0;
	this.lon = 0;
	this.isBusy = false;
	this.destLat = 0;
	this.destLon = 0;
}

method.isBusy = function() {
    return isBusy;
};

module.exports = vehicule;