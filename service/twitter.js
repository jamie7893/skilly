'use strict';

module.exports = function(sequelize) {

  const
    User = sequelize.import("../model/user"),
    UserTwitter = sequelize.import("../model/UserTwitter"),
    Twitter = require('twitter');

  var twitter = new Twitter({
    consumer_key: 'hD30amM9vkK7AWNoZzhtHTC3K',
    consumer_secret: 'FqKlwWn6LUJMkXM29z3Afxkv8IXcalNQ0qzYds6JaOqm6zU2Bj',
    access_token_key: '717899838063415296-Nz0Z0NamknqtGkpXRJmom4kp2mE16sr',
    access_token_secret: '9Sc8NTRZeQUXfCWjLczNCJYyse23WyufkchqrIVjpVevT'
  });
  return {
    create: function(req, res) {
      UserTwitter.findOne({
        where: {
          idUser: req.params.id
        }
      }).then(function(twitter) {
        if (twitter) {
          res.status(200);
        } else {
          User.findOne({
            where: {
              id: req.params.id
            }
          }).then(function(user) {
            if (user) {
              var newUserTwitter = {
                idUser: user.id,
                screenName: req.body.screenName
              };
              UserTwitter.create(newUserTwitter).then(function() {
                res.status(200).json([user, newUserTwitter]);
              });
            } else {
              res.status(404).send("No user exists with id");
            }

          });
        }
      });


    },
    get: function(req, res) {
      User.findOne({
        where: {
          id: req.params.id
        },
      }).then(function(user) {
        if (user) {
          UserTwitter.findOne({
            where: {
              idUser: user.id
            },
          }).then(function(userTwitter) {
            if (!userTwitter) {
              res.json([]);
            } else {
              var path = "statuses/user_timeline";
              var params = {
                screen_name: userTwitter.screenName,
                count: 5,
                exclude_replies: true,
                include_rts: false
              };
              twitter.get(path, params, function(error, tweets, response) {
                if (error) console.log(error);;
                res.status(200).json(tweets);
              });
            }
          });
        } else {
          res.send("No user exists with id");
        }
      });
    }
  };
};
