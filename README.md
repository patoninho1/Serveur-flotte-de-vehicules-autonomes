# Server autonomous vehicle

##Install instruction:

- go to the main floders
- npm install
- Start the server: node serveur.js

Possible call (CRUD and login):
<br>(remplace localhost by the server ip)

- Login: http://localhost:8080/login?user=YourUserName&pass=YourPassword This log you with the username and password pass in parameter
- Create vehicle: http://localhost:8080/newVehicule This create a new vehicle (spawn near to the home point).
- Create group: http://localhost:8080/newGroup This create a new group (Empty).
- Read vehicle: http://localhost:8080/getVehiculeData This get a JSON with the data of all the vehicle.
- Read group: http://localhost:8080/getGroupData This get a JSON with the data of all the group.
- Update vehicle: http://localhost:8080/changeVehiculeDest?id=YourId&lat=DestinationLat&lng=DestinationLng This set a new destination for the selected vehicle.
- Update group: http://localhost:8080/changeGroupDest?id=YourId&lat=DestinationLat&lng=DestinationLng This set a new destination for the selected group.
- Update group: http://localhost:8080/addToGroup?gid=YourGroupId&vid=YourVheiculeID This add the vid vehicule to the gid group.
- Update group: http://localhost:8080/rmToGroup?gid=YourGroupId&vid=YourVheiculeID This remove the vid vehicule to the gid group.
- Delete vehicle: http://localhost:8080/deletVehicule?id=YourId This delet the selected vehicle. 
- Delete group: http://localhost:8080/deletVehicule?id=YourId This delet the selected group. 

##Testing client:

- Open index.html in the "Test client" floders (js have to be alowed by your webrowser).
- Wait until google maps API is loaded.
- Login using the test creditential (Login "bob" Password "mdpbob").
- Now you can use the left pannel to create new vehicle, send them were you want, groupe them, or delet them.

##Rules:

- There is a max number of vehicle (var maxVehicule can be change in server.js).
- The last order erase the older (example if you set a destination to a vehicule and without waiting the end change for a new on, the vehicule go directly from where he is to the new one). 
- You cant set new destination for a vehicule in a group (have to change the groupe destination, or remove him of the group for set his personal destination).
- You cant have more group than vehicule (max number of groupe = actual number of vehicule).

