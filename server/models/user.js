const mongoose = require('mongoose');

let User = mongoose.model("email", {
	text: {
		type: String,
		required: true,
		trim: true,
		minlength: 1
	}
})

module.exports = {
	User
};