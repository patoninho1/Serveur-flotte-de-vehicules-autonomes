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

##Usage: 
- List : get http://localhost:8080/api/:type(user|vehicule|group)
- Read : get http://localhost:8080/api/:type(user|vehicule|group)/:id
- Create : post http://localhost:8080/api/:type(user|vehicule|group)
- Update : patch http://localhost:8080/api/:type(user|vehicule|group)/:id
- Delete : delete http://localhost:8080/api/:type(user|vehicule|group)/:id
