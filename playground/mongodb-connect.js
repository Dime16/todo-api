// const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
	if(err){
		return console.log("Cannot connect to MongoDB server.");
	}
	console.log("Connected to MongoDB server.");
	const db = client.db('TodoApp')

	// let user = {name: "Dime", age: 34};
	// let {name} = user;                     destructuring objects.
	// console.log(name);

	// db.collection('Todos').insertOne({
	// 	text: "Something to do.",
	// 	completed: false
	// }, (err, result) => {
	// 	if(err) {
	// 		return console.log("Unable to insert todo", err);
	// 	}
	// 	console.log(JSON.stringify(result.ops, undefined, 2));
	// });
	db.collection('Users').insertOne({
		name: "Dime",
		age: 34,
		location: "Skopje"
	}, (err, result) => {
		if(err) {
			return console.log('Cannot add user. Error: ', err);
		}
		console.log(JSON.stringify(result.ops, undefined, 2));
	})

	client.close();
});