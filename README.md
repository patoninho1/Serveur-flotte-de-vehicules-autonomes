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

- get http://localhost:8080/api/:type(user|vehicule)
- get http://localhost:8080/api/:type(user|vehicule)/:id
- post http://localhost:8080/api/:type(user|vehicule)
- patch http://localhost:8080/api/:type(user|vehicule)/:id
- delete http://localhost:8080/api/:type(user|vehicule)/:id
