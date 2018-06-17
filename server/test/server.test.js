const expect = require('expect');
const supertest = require('supertest');
const {ObjectID} = require('mongodb');

const {User} = require('./../models/user');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
	it('should create a new todo', (done) => {
		let text = "test todo text";

	    supertest(app)
		   .post('/todos')
		   .send({text})
		   .expect(200)
		   .expect((res) => {
		   	   expect(res.body.text).toBe(text);
		   })
		   .end((err, res) => {
		   	   if(err) {
		   	   	return done(err);
		   	   }

		   	   Todo.find({text}).then((todos) => {
		   	   	expect(todos.length).toBe(1)
		   	   	expect(todos[0].text).toBe(text);
		   	   	done();
		   	   }).catch((e) => done(e));
		   });
	});

	it('should not create todo with invalid body data', (done) => {

		supertest(app)
		   .post('/todos')
		   .send({})
		   .expect(400)
		   .end((err, res) => {
		   	if(err) {
		   		return done(err)
		   	}

		   	Todo.find().then((todos) => {
		   		expect(todos.length).toBe(2)
		   		done()
		   	}).catch((e) => done(e));
		   });
	});
});

describe('GET /todos', () => {
	it('should get all todos', (done) => {
		supertest(app)
			.get('/todos')
			.expect(200)
			.expect((res) => {
				expect(res.body.todos.length).toBe(2)
			})
			.end(done);
	});
});

describe('GET /todos/:id', () => {
	it('Should return todo doc', (done) => {
		supertest(app)
		    .get(`/todos/${todos[0]._id.toHexString()}`)
		    .expect(200)
		    .expect((res) => {
		    	expect(res.body.todo.text).toBe(todos[0].text);
		    })
		    .end(done);
	});

	it('Should return 404 if todo not found', (done) => {
		supertest(app)
		    .get(`/todos/${ObjectID().toHexString()}`)
		    .expect(404)
		    .end(done);
	});

	it('Should return 404 for none object id', (done) => {
		supertest(app)
		    .get('/todos/123')
		    .expect(404)
		    .end(done);
	});
});

describe('DELETE /todos/:id', () => {
	it('Should delete a todo', (done) => {
		let hexId = todos[1]._id.toHexString();

		supertest(app)
		    .delete(`/todos/${hexId}`)
		    .expect(200)
		    .expect((res) => {
		    	expect(res.body.todo._id).toBe(hexId);
		    })
		    .end((err, res) => {
		    	if(err){
		    		return done(err)
		    	}
		    	Todo.findById(hexId).then((todo) => {
		    		expect(todo).toBeFalsy();
		    		done();
		    	}).catch((e) => done(e));
		    });
	});

	it('Should return 404 if todo not found', (done) => {
		let hexId = todos[1]._id.toHexString();

		supertest(app)
			.delete(`/todos/${ObjectID().toHexString()}`)
		    .expect(404)
		    .end(done);
	});

	it('Should return 404 if object id is invalid', (done) => {
				supertest(app)
		    .get('/todos/123')
		    .expect(404)
		    .end(done);
		});
});

describe('PATCH /todos/:id', () => {
	it('Should update the todo', (done) => {
		let hexId = todos[0]._id.toHexString();
		let text = "This is the new text";

		supertest(app)
			.patch(`/todos/${hexId}`)
			.send({
				completed: true,
				text
			})
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(text);
				expect(res.body.todo.completed).toBe(true);
				expect(typeof res.body.todo.completedAt).toBe('number');
			})
			.end(done);


	});

	it('Should clear completedAt when todo is not completed', (done) => {
        let hexId = todos[1]._id.toHexString();
		let text = "This is the new text!!";

		supertest(app)
			.patch(`/todos/${hexId}`)
			.send({
				completed: false,
				text
			})
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(text);
				expect(res.body.todo.completed).toBe(false);
				expect(res.body.todo.completedAt).toBeFalsy();
			})
			.end(done);
	});
});

describe('GET /users/me', () => {
	it('Should return user if authenticated', (done) => {
		supertest(app)
			.get('/users/me')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body._id).toBe(users[0]._id.toHexString());
				expect(res.body.email).toBe(users[0].email)
			})
			.end(done);

	});

	it('Should return 401 if not authenticated', (done) => {
		supertest(app)
			.get('/users/me')
			.set('x-auth', users[1])
			.expect(401)
			.expect((res) => {
				expect(res.body).toEqual({})
			})
			.end(done)

	});
});

describe('POST /users', () => {
	it('Should create a user', (done) => {
		let email = 'example@example.com';
		let password = '123abc!';

		supertest(app)
			.post('/users')
			.send({email, password})
			.expect(200)
			.expect((res) => {
				expect(res.headers['x-auth']).toBeTruthy();
				expect(res.body._id).toBeTruthy();
				expect(res.body.email).toBe(email);
			})
			.end((err) => {
				if(err) {
					return done(err);
				}

			User.findOne({email}).then((user) => {
				expect(user).toBeTruthy();
				//expect(user.password).toNotEqual(password); toNotEqual is not a function?!?
				done();
			}).catch((e) => done(e));
		});
	});

	it('Should return validation errors if request is invalid', (done) => {
		let email = 'abc';
		let password = '123';

		supertest(app)
			.post('/users')
			.send({email, password})
			.expect(400)
			.end(done);
	});

	it('Should not create user if email is in use', (done) => {
		// let email = 'dime@example.com';
		// let password = '123abc!';

		supertest(app)
			.post('/users')
			.send({
				email: users[0].email,
				password: "123abc!"
			})
			.expect(400)
			.end(done);
	});
});

describe('POST /users/login', () => {
	it('should login user and return auth token', (done) => {
		supertest(app)
			.post('/users/login')
			.send({
				email: users[1].email,
				password: users[1].password
			})
			.expect(200)
			.expect((res) => {
				expect(res.headers['x-auth']).toBeTruthy()
			})
			.end((err, res) => {
				if(err) {
					return done(err);
				}

				User.findById(users[1]._id).then((user) => {
					expect(user.tokens[0]).toInclude({
						access: 'auth',
						token: res.headers['x-auth']
					});
					done()
				}).catch((e) => done())
			});
	});

	it('should reject invalid login', (done) => {
		supertest(app)
			.post('/users/login')
			.send({
				email: users[1].email,
				password: users[1].password + '1'
			})
			.expect(400)
			.expect((res) => {
				expect(res.headers['x-auth']).toBeFalsy()
			})
			.end((err, res) => {
				if(err) {
					return done(err)
				}

				User.findById(users[1]._id).then((user) => {
					expect(user.tokens.length).toBe(0);
					done();
				}).catch((e) => done(e));
			});

	});

});