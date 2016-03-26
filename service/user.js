'use strict';
var bcrypt = require('bcrypt-nodejs');
module.exports = function(sequelize) {
	var User = sequelize.import("../model/user");
	var jctUserSkill = sequelize.import("../model/userskill");
	var Skill = sequelize.import("../model/skill");
	var Title = sequelize.import("../model/title");
	var UserPass = sequelize.import("../model/userpassword");

	UserPass.hasOne(User, {
    "foreignKey": "id"
  });
  User.hasOne(UserPass, {
    "foreignKey": "id"
  });
	User.belongsToMany(Skill, {
  "foreignKey": "id",
  "through": {
    model: jctUserSkill
  }
});

Skill.belongsToMany(User, {
  "foreignKey": "idSkill",
  "through": {
    model: jctUserSkill
  }
});

Title.belongsToMany(User, {
  "foreignKey": "id",
  "through": {
    model: Title
  }
});
User.belongsTo(Title, {
  "foreignKey": "idTitle"
});
	return {
		create: function(req, res, callback) {
      var sess = req.session;
      User.findOne({
        where: {
          localemail: req.body.email
        }
      }).then(function(user) {
        console.log(user);
        if (user) {
          var err = 'The Email you entered already exists';
          callback(err);
        }
        console.log(req.body);
        var newUser = {
          localemail: req.body.email,
          nameLast: req.body.nameLast,
          nameFirst: req.body.nameFirst

        };
        console.log(newUser);
        var aSalt = bcrypt.genSaltSync(10);

        var aHash = bcrypt.hashSync(req.body.password, aSalt);

        var newPass = {
          salt: aSalt,
          hash: aHash
        };
        console.log(newPass);
        UserPass.create(newPass).then(function() {
          User.create(newUser).then(function() {
            res.redirect('/');
          });
        });
      });
    },
    login: function(req, res, callback) {
      var sess = req.session;
      User.findOne({
        where: {
          localemail: req.body.email
        }
      }).then(function(user) {
        User.findAll({
          where: {
            id: user.id
          },
          include: [{
            model: UserPass,

          }],
          attributes: []

        }).then(function(password) {
          if (bcrypt.compareSync(req.body.password, password[0].userpassword.hash)) {
            sess.email = req.body.email;
            User.findOne({
              where: {
                localemail: req.body.email
              }
            }).then(function(user) {
              var date = new Date();
              var minutes = 30;
              date.setTime(date.getTime() + (minutes * 60 * 1000));
              res.cookie("name", user.nameFirst, {
                expires: date
              });
							res.cookie("id", user.id, {
                expires: date
              });
              res.redirect('/profile.html');
            });
          }
        });

      });
    },
    logout: function(req, res) {
      req.session.destroy();
      res.clearCookie('name');
      res.redirect('/');
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
		getWithInfo: function(req, res) {
 User.findAll({
      "where": { id: req.params.userid },
			include: [{
            model: Skill,
            attributes: ['name']
          }, {
            model: Title,
            attributes: ['name']
          }],
			 "attributes" : []
     })
        .then(function(user) {
          res.json(user);
				});
		},
		deleteID: function(req, res) {
			jctUserSkill.destroy({
				where: {
					id: req.params.id //this will be your id that you want to delete
				}
			}).then(User.destroy({
				where: {
					id: req.params.id //this will be your id that you want to delete
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
