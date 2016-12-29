var map;
var markersVehicule = [];

var iconVehicule = './drone.png';
var iconFlote = '';

function validate(){
  updateVehiculeLoc();
  /*
	var username = document.getElementById("username").value;
	var pass = document.getElementById("password").value;
	
	console.log(username + " " + pass );
	
	$.getJSON("http://localhost:8080/login?user=" + username + "&pass=" + pass, function(data) {
		console.log("server answer : " + data);
		if (data.auth == true){
			$('#login').hide();
			$('#main').show();
		}else{		
			alert("Failled to Auth, try again.");
		}		
	}); */
	
}


function updateVehiculeLoc() {

  //Get data from server
  $.getJSON("http://localhost:8080/getVehiculeData", function(data) {
		
	console.log("server answer : " + data.vehicule[0].id);
  
	//remove old marker
	for (var i = 0; i < markersVehicule.length; i++) {
		markersVehicule[i].setMap(null);
	}
	markersVehicule = [];
	  
	//Set new
	for (i = 0; i < data.vehicule.length; i++) {				
		var marker = new google.maps.Marker({
			position: data.vehicule[i].loc,
			map: map,
			title: 'Hello World!',
			icon: iconVehicule
		});		
		markersVehicule.push(marker);			
	 }	 
  
   });
   
   meteo_timeout = setTimeout("updateVehiculeLoc()", 1000);
}

function initMap() {
	
	var franceLoc = {lat: 46.8516177, lng: 1.2393998};

	map = new google.maps.Map(document.getElementById('map'), {
	   zoom: 5,
	   center: franceLoc,
	   mapTypeId: google.maps.MapTypeId.TERRAIN
	});
   
}

updateVehiculeLoc();
