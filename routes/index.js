var express = require('express');
var router = express.Router();
var Teams = require('../models/team');
var uuid = require('uuid');
var payments = require('../services/payment');


router.get('/', function(req, res, next) {
	console.log("TAP30");
	res.end();
});

router.post('/register', function(req, res, next) {
	var name_1 = req.body.name_1;
	var name_2 = req.body.name_2;
	var email_1 = req.body.email_1;
	var email_2 = req.body.email_2;
	var team_name = req.body.team_name;
	var uid = uuid.v4();
	var newTeam = Teams({
		name_1,
		name_2,
		email_1,
		email_2,
		team_name,
		uid
	});

	Teams.findOne({
		$or: [{
			team_name,
		}, {
			email_1,
		}, {
			email_2,
		}]
	}, function(err, team) {
		if (err) res.status(500).send({
			error: err
		});
		if (team && team.verified == true) {
			res.status(409).send({
				error: "team or player already exists"
			});
		} else {
			newTeam.save(function(err) {
				if (err)
					res.send({
						error: err
					});
				else{
					payments.paymentRequest(res, uid);
				}
			});
		}
	});
});


router.get('/PaymentVerification/:uuid', function(req, res, next) {
	payments.paymentVerify(req, res);
});



module.exports = router;