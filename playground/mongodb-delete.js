// const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
	if(err){
		return console.log("Cannot connect to MongoDB server.");
	}
	console.log("Connected to MongoDB server.");
	const db = client.db('TodoApp');
	
	// deleteMany
	// db.collection('Todos').deleteMany({text: "Eat Lunch"}).then((result) => {
	// 	console.log(result);
	// });

	//deleteOne
	// db.collection('Todos').deleteOne({text: "Eat Lunch"}).then((result) => {
	// 	console.log(result);
	// });

	// findOneAndDelete
	// db.collection('Todos').findOneAndDelete({text: "Eat Lunch"}).then((result) => {
	// 	console.log(result);
	// });

	// db.collection('Users').deleteMany({name: "Dime"}).then((result) => {
	// 	console.log(result);
	// });

	db.collection('Users').deleteOne({_id: new ObjectID("5b1d27f508852b01084439ed")}).then((result) => {
		console.log(result);
	});

//	client.close();
});