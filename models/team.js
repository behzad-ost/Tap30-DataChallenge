var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var teamSchema = new Schema({
	uid :{
		type: String
	},
	name_1: {
		type: String,
		trim: true,
		require: true
	},
	name_2: {
		type: String,
		trim: true,
		require: true
	},
	email_1: {
		type: String,
		trim: true,
		require: true
	},
	email_2: {
		type: String,
		trim: true,
		require: true
	},
	team_name:{
		type: String,
		trim: true,
		require: true
	},
	verified:{
		type: Boolean,
		default: false
	},
	RefId:{
		type: String
	}
});

var teams = module.exports = mongoose.model('team', teamSchema);
