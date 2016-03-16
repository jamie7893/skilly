'use strict';

module.exports = function(sequelize) {
	var Title = sequelize.import("../model/title");
	return {
		create: function(req, res) {
			var newTitle = {
				name: req.body.name
			};
			Title.create(newTitle).then(function() {
				res.send(200);
			});
		},
		get: function(req, res) {
			Title.findAll().then(function(titles) {
				res.json(titles);
			});
		},
		getID: function(req, res) {
			Title.findById(req.params.id).then(function(title) {
				res.json(title);
			});
		},
		deleteID: function(req, res) {
			Title.destroy({
				where: {
					id: req.params.id //this will be your id that you want to delete
				}
			}).then(function() {
				res.json('Deleted successfully');
			}, function(err) {
				console.log(err);
			});
		},
		updateID: function(req, res) {
			Title.update(req.body, {
					where: {
						id: req.params.id
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
