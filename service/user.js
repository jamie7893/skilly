'use strict';
var bcrypt = require('bcrypt-nodejs');
var _ = require('lodash');
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
        if (user) {
          var err = 'The Email you entered already exists';
          callback(err);
        }
        var newUser = {
          localemail: req.body.email,
          nameLast: req.body.nameLast,
          nameFirst: req.body.nameFirst

        };
        var aSalt = bcrypt.genSaltSync(10);

        var aHash = bcrypt.hashSync(req.body.password, aSalt);

        var newPass = {
          salt: aSalt,
          hash: aHash
        };
        UserPass.create(newPass).then(function() {
          User.create(newUser).then(function(aNewUser) {

            var date = new Date();
            var minutes = 30;
            date.setTime(date.getTime() + (minutes * 60 * 1000));
            res.cookie("name", aNewUser.nameFirst, {
              expires: date
            });
            res.cookie("id", aNewUser.id, {
              expires: date
            });
            res.redirect('/');
          });
        });
      });
    },
    updateprofile: function(req, res, callback) {
      console.log(req.body);
      var sess = req.session;
      User.findOne({
        where: {
          id: req.cookies.id
        }
      }).then(function(user) {
        if (!user) {
          var err = 'Your not logged in!';
          callback(err);
        }
        Title.findOne({
          where: {
            name: req.body.title
          },
          attributes: ["id"]
        }).then(function(title) {
          var userProfile = {
            nameLast: req.body.nameLast,
            nameFirst: req.body.nameFirst,
            desc: req.body.desc,
            idTitle: title.id,
            img: req.body.img

          };
          // console.log(userProfile);
          User.update(userProfile, {
            where: {
              id: user.id
            }
          });
          jctUserSkill.destroy({
            where: {
              id: user.id //this will be your id that you want to delete
            }
          });
          _.map(req.body.skill, function(skill) {
            Skill.findOne({
              where: {
                name: skill
              }
            }).then(function(foundskill) {
              if (foundskill) {
                var newUserSkill = {
                  id: user.id,
                  idSkill: foundskill.skillid
                };

                jctUserSkill.create(newUserSkill);
              } else {
                var newSkill = {
                  name: skill
                };
                Skill.create(newSkill).then(function(theskill) {
                  var theUserSkill = {
                    id: user.id,
                    idSkill: theskill.skillid
                  };
                  jctUserSkill.create(theUserSkill);
                });
              } // end else
            }); // end map of skill
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
      res.clearCookie();
      res.redirect('/');
    },
    get: function(req, res) {
      if (Object.keys(req.query).length === 0) {
        User.findAll().then(function(users) {
          res.json(users);
        });
      } else if (req.query.contains) {
        var temp = {};
        Skill.findAll({
          where: {
            name: {
              like: '%' + req.query.contains + '%'
            }
          },
          include: [{
            model: User,
            attributes: ['id'],
            through: {
              model: jctUserSkill,
              attributes: []
            },
          }],
          attributes: ['name']
        }).then(function(foundSpec) {
          temp.id = foundSpec;
          res.json(temp);
        });
      }
    },
    getID: function(req, res) {
      User.findById(req.params.id).then(function(user) {
        res.json(user);
      });
    },
    getWithInfo: function(req, res) {
      User.findAll({
          "where": {
            id: req.params.userid
          },
          include: [{
            model: Skill,
            attributes: ['name']
          }, {
            model: Title,
            attributes: ['name']
          }],
          "attributes": ['id']
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
