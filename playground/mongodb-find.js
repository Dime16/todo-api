// const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
	if(err){
		return console.log("Cannot connect to MongoDB server.");
	}
	console.log("Connected to MongoDB server.");
	const db = client.db('TodoApp');
	
	// db.collection('Todos').find({
	// 	_id: new ObjectID("5b1d2fd82b0d33c4a5991cf8")
	// }).toArray().then((docs) => {
	// 	console.log('Todos');
	// 	console.log(JSON.stringify(docs, undefined, 2));
	// }, (err) => {
	// 	console.log("Unable to get Todos.");
	// });

	// 	db.collection('Todos').find().count().then((count) => {
	// 	console.log(`Todos count: ${count}`);
	// }, (err) => {
	// 	console.log("Unable to get Todos.");
	// });

	db.collection('Users').find({name: "Dime"}).toArray().then((user) => {
		console.log(JSON.stringify(user, undefined, 2));
	}, (err) => {
		console.log('cannot find user. Error: ', err);
	});


//	client.close();
});