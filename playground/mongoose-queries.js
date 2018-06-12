const {ObjectID}= require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

let id = "5b1eba6187b78c23fc7ff651";

User.findById(id).then((user) => {
	if(!user) {
		console.log("User not found.");
	}
	console.log(JSON.stringify(user, undefined, 2));
}).catch((e) => console.log("invalid id."));

// let id = "5b1fc32bc602002714633191";
// if(!ObjectID.isValid(id)) {
// 	console.log("ID is not valid")
// }

// Todo.find({
// 	_id: id
// }).then((todos) => {
// 	console.log("Todos: ", todos);
// });

// Todo.findOne({
// 	_id: id
// }).then((todo) => {
// 	console.log("Todo: ", todo);
// });

// Todo.findById(id).then((todo) => {
// 	if(!todo) {
// 		return console.log("Todo id not found.");
// 	}
// 	console.log("Todo by Id: ", todo);
// }).catch((e) => console.log(e));