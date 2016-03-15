'use strict';

module.exports = function(sequelize) {
	var User = sequelize.import("../model/user");
	var jctUserSkill = sequelize.import("../model/userskill");
	return {
		create: function(req, res) {
			var newUser = {
				userid: req.body.userid,
				nameLast: req.body.nameLast,
        nameFirst: req.body.nameFirst,
        age: req.body.age,
        idTitle: req.body.idTitle
			};
			User.create(newUser).then(function() {
				res.send(200);
			});
		},
		get: function(req, res) {
			User.findAll().then(function(users) {
				res.json(users);
			});
		},
		getID: function(req, res) {
			User.findById(req.params.id).then(function(user) {
				res.json(user);
			});
		},
		deleteID: function(req, res) {
			jctUserSkill.destroy({
				where: {
					userid: req.params.id //this will be your id that you want to delete
				}
			}).then(User.destroy({
				where: {
					userid: req.params.id //this will be your id that you want to delete
				}
			}).then(function() {
				res.json('Deleted successfully');
			}, function(err) {
				console.log(err);
			}));
		},
		updateID: function(req, res) {
			User.update(req.body, {
					where: {
						userid: req.params.id
					}
				})
				.then(function(result) {
					res.json('It was updated!');
				}, function(err) {
					res.json(err);
				});
		}
	};
};
