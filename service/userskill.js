'use strict';

module.exports = function(sequelize) {
	var UserSkill = sequelize.import("../model/userskill");
	return {
		create: function(req, res) {
			var newUserSkill = {
				userid: req.body.userid,
				skillid: req.body.skillid
			};
			UserSkill.create(newUserSkill).then(function() {
				res.sendStatus(200);
			});
		},
		get: function(req, res) {
			UserSkill.findAll().then(function(userskill) {
				res.json(userskill);
			});
		},
    getID: function(req, res) {
      UserSkill.findById(req.params.id).then(function(user) {
        res.json(user);
      });
		},
		getbothID: function(req, res) {
			UserSkill.find({
        where: {
          userid: req.params.userid,
          skillid: req.params.skillid
        }
      }).then(function(userskill) {
				res.json(userskill);
			});
		},
		deleteID: function(req, res) {
			UserSkill.destroy({
				where: {
          userid: req.params.userid, //this will be your id that you want to delete
          skillid: req.params.skillid
        }
			}).then(function() {
				res.json('Deleted successfully');
			}, function(err) {
				console.log(err);
			});
		},
		updateID: function(req, res) {
			UserSkill.update(req.body, {
					where: {
            userid: req.parama.userid,
						skillid: req.params.skillid
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
