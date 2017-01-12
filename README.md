# Server autonomous vehicle
##Prerequisities

- https://git-scm.com/
- https://nodejs.org/en/

##Installation:
go to the main floders and run for install dependecies
```
npm install.
```

##Start the server: 
Start mongo
```
npm start
```
Create the bob user : http://localhost:8080/setup

##Usage: 

- POST http://localhost:8080/api/login {usename: "bob", password: "mdpbob"} This return you the token for acces to the API function


- Create vehicle: http://localhost:8080/api/newVehicule This create a new vehicle (spawn near to the home point).
- Create group: http://localhost:8080/api/newGroup This create a new group (Empty).
- Read vehicle: http://localhost:8080/api/getVehiculeData This get a JSON with the data of all the vehicle.
- Read group: http://localhost:8080/api/getGroupData This get a JSON with the data of all the group.
- Update vehicle: http://localhost:8080/api/changeVehiculeDest?id=YourId&lat=DestinationLat&lng=DestinationLng This set a new destination for the selected vehicle.
- Update group: http://localhost:8080/api/changeGroupDest?id=YourId&lat=DestinationLat&lng=DestinationLng This set a new destination for the selected group.
- Update group: http://localhost:8080/api/addToGroup?gid=YourGroupId&vid=YourVehiculeID This add the vid vehicule to the gid group.
- Update group: http://localhost:8080/api/rmToGroup?gid=YourGroupId&vid=YourVehiculeID This remove the vid vehicule to the gid group.
- Delete vehicle: http://localhost:8080/api/deletVehicule?id=YourId This delete the selected vehicle. 
- Delete group: http://localhost:8080/api/deletVehicule?id=YourId This delete the selected group. 

##Testing client:

- Open index.html in the "Test client" floders (js have to be alowed by your webrowser).
- Wait until google maps API is loaded.
- Login using the test creditential (Login "bob" Password "mdpbob").
- Now you can use the left pannel to create new vehicle, send them where you want, groupe them, or delete them.

##Rules:

- There is a max number of vehicles (var maxVehicule can be change in server.js).
- The last order erase the older (example if you set a destination to a vehicule and without waiting the end change for a new on, the vehicule go directly from where he is to the new one). 
- You can't set new destination for a vehicule in a group (have to change the groupe destination, or remove him of the group for set his personal destination).
- You can't have more group than vehicules (max number of groupe = actual number of vehicules).

