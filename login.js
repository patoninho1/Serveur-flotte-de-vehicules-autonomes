//localhost:8080/login?user=bob&pass=mdpbob
//localhost:8080/travel_to?user=bob&pass=mdpbob

var method = login.prototype;

function login(username,pass) {
	username = "bob";
	pass = "mdpbob";
	isConnected = false;
}

method.auth = function(params) {
	
	if ('user' in params && 'pass' in params) {
		if(params['user'] == username && params['pass'] == password){
			isConnected = true;
			return "Login succes";
		}
	}
	isConnected = false;	
	
    return isConnected;
};

method.disconnected = function() {
	isConnected = false;	
};

method.isConnected = function() {
    return isConnected;
};

module.exports = login;