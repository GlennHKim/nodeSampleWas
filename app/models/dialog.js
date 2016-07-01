var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var dialogSchema = new Schema({
	sender : String,
	receiver : String,
	text : String,
	time : Date,
	tag : String
});

module.exports = mongoose.model('Dialog', dialogSchema);