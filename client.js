var map;
var markersVehicule = [];
var travelVehicule = [];

//var iconVehicule = './drone.png';


var iconVehicule;
 var lineSymbol = {
    path: 'M 0,-1 0,1',
    strokeOpacity: 0.6,
    scale: 4,
	strokeColor: '#FF0000',
};



var iconFlote = '';

function validate(){
 
	var username = $("#username").value;
	var pass = $("#password").value;
	
	console.log(username + " " + pass );
	
	$.getJSON("http://localhost:8080/login?user=" + username + "&pass=" + pass, function(data) {
		console.log("server answer : " + data);
		if (data.auth == true){
			$('#login').hide();
			$('#main').show();
		}else{		
			alert("Failled to Auth, try again.");
		}		
	}); 
	
}


function updateVehiculeLoc() {

	try{
	  //Get data from server
	  $.getJSON("http://localhost:8080/getVehiculeData", function(data) {
			
		console.log("server answer !");
	  
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
		$('#nbV').text(data.vehicule.length);
		
		//Set they trajet
		for (i = 0; i < data.vehicule.length; i++) {			
			if (data.vehicule[i].dest.lat != data.vehicule[i].loc.lat && data.vehicule[i].dest.lng != data.vehicule[i].loc.lng){					
				
				
				var line = new google.maps.Polyline({
					path: [data.vehicule[i].loc,data.vehicule[i].dest],
					strokeOpacity: 0,
					icons: [{
					  icon: lineSymbol,
					  offset: '0',
					  repeat: '20px'
					}]
				});
					
				travelVehicule.push(line);			
				line.setMap(map);	
			}	
		}
		
	  });
	  
	  meteo_timeout = setTimeout("updateVehiculeLoc()", 5000);
	  
	}catch(err){
		meteo_timeout = setTimeout("updateVehiculeLoc()", 5000);		
	}
	

	
}


function newV() {		
	$.getJSON("http://localhost:8080/newVehicule", function(data) {
		if (data.succes == true){
			
		}else{		
			alert(data.error);
		}		
	});
}

function deletV() {		

	var id = $('#idV').value;

	$.getJSON("http://localhost:8080/deletVehicule?id=" + id , function(data) {
		if (data.succes == true){
			
		}else{		
			alert(data.error);
		}		
	});
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
	
	iconVehicule = {
		url: './drone.png',
		scaledSize: new google.maps.Size(34, 34),
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(17, 17)	
	};
	
}






