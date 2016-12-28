

function validate(){
	
	var username = document.getElementById("username").value;
	var pass = document.getElementById("password").value;
	
	console.log(username + " " + pass );
	$.getJSON("localhost:8080/login?user=" + username + "&pass=" + pass, function(data) {
		console.log("server answer : " + data);
		if (data.auth == true){
			window.location = "controle.html";
		}else{		
			alert("Failled to Auth, try again.");
		}		
	});   
	
}

