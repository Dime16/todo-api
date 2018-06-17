require('./config/config');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

let app = express();
const port = process.env.PORT;


app.use(bodyParser.json());

app.post('/todos', (req, res) => {
	let todo = new Todo({
		text: req.body.text
	});

	todo.save().then((doc) => {
		res.send(doc);
	}, (e) => {
		res.status(400).send(e);
	});
});

app.get('/todos', (req, res) => {
	Todo.find().then((todos) => {
		res.send({todos});
	}, (e) => {
        res.status(400).send(e);
	});
});

app.get('/todos/:id', (req, res) => {
	let id = req.params.id;
	if(!ObjectID.isValid(id)) {
         res.status(404).send();
	}

	Todo.findById(id).then((todo) => {	
		return todo? res.send({todo}) : res.status(404).send("no todo found");   
     }).catch((e) => res.status(400).send());
});

app.delete('/todos/:id', (req, res) => {
    let id = req.params.id;

	if(!ObjectID.isValid(id)) {
		res.status(400).send("Invalid ID");
	}

	Todo.findByIdAndRemove(id).then((todo) => {
		return todo? res.status(200).send({todo}) : res.status(404).send("Todo not found");
	}).catch((e) => res.status(400).send("Server problems"));
});

app.patch('/todos/:id', (req, res) => {
	let id = req.params.id;
	let body = _.pick(req.body, ['text', 'completed']); //_.pick e lodash opcija sto ti dava da odberes koi propertis ke i gi dades na body.
  
    if(!ObjectID.isValid(id)) {
    	return res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed) {
    	body.completedAt = new Date().getTime();
    } else {
    	body.completed = false;
    	body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    	if(!todo) {
    		return res.status(404).send();
    	}
    	res.send({todo});
    }).catch((e) => {
    	res.status(400).send();
    });
});

app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
	let user = new User(body);

	user.save().then(() => {
		return user.generateAuthToken();
	}).then((token) => {
		res.header('x-auth', token).send(user);
	}).catch((e) => {
		res.status(400).send(e);
	});
});

app.get('/users/me', authenticate, (req, res) => {
		res.send(req.user);
});

app.post('/users/login', (req, res) => {
	let body = _.pick(req.body, ['email', 'password'])

	User.findByCredentials(body.email, body.password).then((user) => {
		return user.generateAuthToken().then((token) => {
			res.header('x-auth', token).send(user);
		});
	}).catch((e) => {
		res.send(400).send();
	});
	

});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);

});

module.exports = {app};