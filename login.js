//localhost:8080/login?user=bob&pass=mdpbob
//localhost:8080/travel_to?user=bob&pass=mdpbob

var method = login.prototype;

function login(username,pass) {
	this.username = username;
	this.pass = pass;
	this.ip = "";
	this.isConnected = false;
}

method.auth = function(params,ip) {
	this.isConnected = false;
	if ('user' in params && 'pass' in params) {
		if(params['user'] == this.username && params['pass'] == this.pass){
			this.isConnected = true;	
			this.ip = ip;
		}
	}			
    return this.isConnected;
};

method.disconnected = function() {
	this.isConnected = false;	
};

method.isConnected = function(ip) {
	if(ip != this.ip){
		this.isConnected = false;
	}
    return this.isConnected;
};

module.exports = login;