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
- list : get http://localhost:8080/api/:type(user|vehicule)
- read : get http://localhost:8080/api/:type(user|vehicule)/:id
- create : post http://localhost:8080/api/:type(user|vehicule)
- update : patch http://localhost:8080/api/:type(user|vehicule)/:id
- delete : delete http://localhost:8080/api/:type(user|vehicule)/:id
