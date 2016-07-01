var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var contactSchema = new Schema({
	id : String,
	address : String,
	name : String,
	telnum : String,
	desc : String
});

module.exports = mongoose.model('Contact', contactSchema);