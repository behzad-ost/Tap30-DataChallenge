var ZarinpalCheckout = require('zarinpal-checkout');
var zarinpal = ZarinpalCheckout.create('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', true);
var Teams = require('../models/team');
var methods = {};

methods.paymentRequest = function(res, uuid) {
	zarinpal.PaymentRequest({
		Amount: '10000',
		// CallbackURL: 'http://siamak.us',
		// CallbackURL: 'http://localhost:3500/tap30/PaymentVerification/' + uuid,
		CallbackURL: 'http://acm.ut.ac.ir/tap30/PaymentVerification/' + uuid,
		Description: 'Tap30'
	}).then(function(response) {
		if (response.status == 100) {
			console.log(response);
			res.redirect(response.url);
		}
	}).catch(function(err) {
		console.log(err);
	});
}

function verifyUser(uuid, res, response) {
	Teams.findOne({
		uid:uuid
	}, function(err, team) {
		if (err) res.status(500).send({
			error: err
		});
		// console.log(team);
		team.verified = true;
		team.RefId = response.RefID;
		team.save(function(err) {
			if (err) res.status(500).send({
				error: err
			});
		});

	});
}

methods.paymentVerify = function(req, res) {
	var uuid = req.params.uuid
	zarinpal.PaymentVerification({
		Amount: 10000,
		Authority: req.query.Authority,
	}).then(function(response) {
		if (req.query.Status == "OK") {
			if (response.status == 100) {
				verifyUser(uuid, res, response);
				res.redirect('/tap30');
				console.log("Verified! Ref ID: " + response.RefID);
			} else {
				console.log(response);
			}
		} else {
			res.redirect('/tap30');
		}

	}).catch(function(err) {
		console.log(err);
	});
}

module.exports = methods;