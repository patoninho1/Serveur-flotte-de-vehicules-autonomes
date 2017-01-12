# Server autonomous vehicule
##Prerequisities

- https://nodejs.org/en/
- https://www.mongodb.com/fr

##Installation:
go to the main floders and run for install dependecies
```
npm install
```

##Start the server: 
Before you have to start mongo
```
npm start
```
Create the bob user : http://localhost:8080/setup

##Usage: 

- POST http://localhost:8080/api/login This return the token for acces to the API function.
- Create vehicle: http://localhost:8080/api/newVehicule?token=yourtoken This create a new vehicle (spawn near to the home point).
- Create group: http://localhost:8080/api/newGroup?token=yourtoken This create a new group (Empty).
- Read vehicle: http://localhost:8080/api/getVehiculeData?token=yourtoken This get a JSON with the data of all the vehicle.
- Read group: http://localhost:8080/api/getGroupData?token=yourtoken This get a JSON with the data of all the group.
- Update vehicle: http://localhost:8080/api/changeVehiculeDest?token=yourtoken&id=YourId&lat=DestinationLat&lng=DestinationLng This set a new destination for the selected vehicle.
- Update group: http://localhost:8080/api/changeGroupDest?token=yourtoken&id=YourId&lat=DestinationLat&lng=DestinationLng This set a new destination for the selected group.
- Update group: http://localhost:8080/api/addToGroup?gid=YourGroupId&vid=YourVehiculeID This add the vid vehicule to the gid group.
- Update group: http://localhost:8080/api/rmToGroup?gid=YourGroupId&vid=YourVehiculeID This remove the vid vehicule to the gid group.
- Delete vehicle: http://localhost:8080/api/deletVehicule?id=YourId This delete the selected vehicle. 
- Delete group: http://localhost:8080/api/deletVehicule?id=YourId This delete the selected group. 

##Rules:

- There is a max number of vehicles (var maxVehicule can be change in server.js).
- The last order erase the older (example if you set a destination to a vehicule and without waiting the end change for a new on, the vehicule go directly from where he is to the new one). 
- You can't set new destination for a vehicule in a group (have to change the groupe destination, or remove him of the group for set his personal destination).
- You can't have more group than vehicules (max number of groupe = actual number of vehicules).

