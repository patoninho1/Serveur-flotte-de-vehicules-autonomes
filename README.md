# Server autonomous vehicle
Server autonomous vehicle

Install instruction:

- go to the main floders
- npm install


Usage:

Start the server: node server.js

Possible call (CRUD and login):
(remplace localhost by the server ip)

Login: http://localhost:8080/login?user=YourUserName&pass=YourPassword

Create: http://localhost:8080/newVehicule this create a new vehicle (spawn near to the home point).
Read: http://localhost:8080/getVehiculeData this get a JSON with the data of all the vehicle.
Update: http://localhost:8080/changeVehiculeDest?id=YourId&lat=DestinationLat&lng=DestinationLng this set a new destination for the selected vehicle.
Delete: http://localhost:8080/deletVehicule?id=YourId this delet the selected vehicle. 


