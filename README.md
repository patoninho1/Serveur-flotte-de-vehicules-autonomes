# Server autonomous vehicule
##Prerequisites

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
- List : get http://localhost:8080/api/:type(user|vehicule)
- Read : get http://localhost:8080/api/:type(user|vehicule)/:id
- Create : post http://localhost:8080/api/:type(user|vehicule)
- Update : patch http://localhost:8080/api/:type(user|vehicule)/:id
- Delete : delete http://localhost:8080/api/:type(user|vehicule)/:id
