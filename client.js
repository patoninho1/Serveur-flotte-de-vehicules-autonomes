var map;
var markersVehicule = [];
var travelVehicule = [];

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

	try{
	  //Get data from server
	  $.getJSON("http://localhost:8080/getVehiculeData", function(data) {
			
		//console.log("server answer : " + data.vehicule[0].id);
	  
		//remove old marker
		for (var i = 0; i < travelVehicule.length; i++) {
			travelVehicule[i].setMap(null);
		}
		for (var i = 0; i < markersVehicule.length; i++) {
			markersVehicule[i].setMap(null);
		}
		markersVehicule = [];
		travelVehicule = [];
		  
		//Set new Vehicule
		for (i = 0; i < data.vehicule.length; i++) {				
			var marker = new google.maps.Marker({
				position: data.vehicule[i].loc,
				map: map,
				title: 'Hello World!',
				icon: iconVehicule
			});		
			markersVehicule.push(marker);			
		}	 
		
		//Set they trajet
		for (i = 0; i < data.vehicule.length; i++) {			
			if (data.vehicule[i].dest.lat != data.vehicule[i].loc.lat && data.vehicule[i].dest.lng != data.vehicule[i].loc.lng){					
				var flightPath = new google.maps.Polyline({
					path: [data.vehicule[i].loc,data.vehicule[i].dest],
					geodesic: true,
					strokeColor: '#FF0000',
					strokeOpacity: 1.0,
					strokeWeight: 2
				});
				travelVehicule.push(flightPath);			
				flightPath.setMap(map);	
			}	
		}
		
	  });

	}catch(err){}
	
	meteo_timeout = setTimeout("updateVehiculeLoc()", 1000);
	
}

function initMap() {
	
	var franceLoc = {lat: 46.8516177, lng: 1.2393998};

	map = new google.maps.Map(document.getElementById('map'), {
	   zoom: 5,
	   center: franceLoc,
	   mapTypeId: google.maps.MapTypeId.TERRAIN
	});	
	
	google.maps.event.addListener(map, 'click', function(args) {  
		console.log('click : ' + args.latLng );
	});
	
}






