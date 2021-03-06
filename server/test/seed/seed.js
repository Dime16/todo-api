const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {User} = require('./../../models/user');
const {Todo} = require('./../../models/todo');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
	_id: userOneId,
	email: 'andrew@example.com',
	password:'userOnePass',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userOneId, access: 'auth'}, '123abc').toString()
	}]
}, {
	_id: userTwoId,
	email: 'dime@example.com',
	password:'userTwoPass',
		tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userTwoId, access: 'auth'}, '123abc').toString()
	}]
}];

const todos = [{
	_id: new ObjectID(),
	text: "First test todo",
	_creator: userOneId
}, {
	_id: new ObjectID(),
	text: "Second test todo",
	completed: true,
	completedAt: 333,
	_creator: userTwoId
}];

const populateTodos = (done) => {
	Todo.remove({}).then(() => {
		Todo.insertMany(todos);
	}).then(() => done());
};

const populateUsers = (done) => {
	User.remove({}).then(() => {
		let userOne = new User(users[0]).save();
		let userTwo = new User(users[1]).save();

		return Promise.all([userOne, userTwo])
	}).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};