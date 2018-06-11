// const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
	if(err){
		return console.log("Cannot connect to MongoDB server.");
	}
	console.log("Connected to MongoDB server.");
	const db = client.db('TodoApp');
	
	// db.collection('Todos').findOneAndUpdate({
	// 	_id: new ObjectID("5b1d2fd82b0d33c4a5991cf8")
	// 	}, {
	// 		$set: {
	// 			completed: true
	// 		}
	// 	}, {
	// 		returnOriginal: false
	// 	}).then((result) => {
	// 		console.log(result);
	// 	});

	db.collection('Users').findOneAndUpdate({
		_id: new ObjectID("5b1d24c736a033147075a160")
	}, {
		$set: {
			name: "Dime"
		},
		$inc: {
			age: +1
		}
	}, {
		returnOriginal: false
	}).then((result) => {
		console.log(result);
	});
//	client.close();
});