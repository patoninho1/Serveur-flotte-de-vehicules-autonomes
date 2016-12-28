//localhost:8080/login?user=bob&pass=mdpbob
//localhost:8080/travel_to?user=bob&pass=mdpbob

var method = login.prototype;

function login(username,pass) {
	this.username = username;
	this.pass = pass;
	this.isConnected = false;
}

method.auth = function(params) {
	isConnected = false;
	if ('user' in params && 'pass' in params) {
		if(params['user'] == this.username && params['pass'] == this.pass){
			isConnected = true;			
		}
	}			
    return isConnected;
};

method.disconnected = function() {
	isConnected = false;	
};

method.isConnected = function() {
    return isConnected;
};

module.exports = login;