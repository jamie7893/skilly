'use strict';

const
  Sequelize = require('sequelize');

let server;

const
  express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  flash = require('connect-flash'),
  morgan = require('morgan'),
  bcrypt = require('bcrypt-nodejs'),
  path = require('path'),
  multer = require('multer'),
  crypto = require('crypto'),
  session = require('express-session');


app.use(morgan('dev')); // logs request to the console
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

var uploading = multer({
  dest: './public/images/',
  limits: {
    fileSize: 1000000,
    files: 1
  }
});



app.set('trust proxy', 1); // trust first proxy
var sess = {
  secret: 'mqpetbxmzodjyyesmfpqirhgncmxssfr',
  cookie: {},
  resave: false,
  saveUninitialized: true
};

if (app.get('env') === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
}

app.use(session(sess));
module.exports.close = function() {
  console.log('shutting down the server...');
  server.close();
};





// sequelize initialization //
const sequelize = new Sequelize('postgres://hghqfvndemjrcs:6LC5GhkVN6KV-GDMgvh7Szz-Kr@ec2-23-21-165-183.compute-1.amazonaws.com:5432/d7mmn0j5evqt7k');
//

const skillService = require("./service/skill")(sequelize);
const titleService = require("./service/title")(sequelize);
const userService = require("./service/user")(sequelize);
const userSkillService = require("./service/userskill")(sequelize);
const twitterService = require("./service/twitter")(sequelize);



var Skill = sequelize.import('./model/skill.js');
var User = sequelize.import('./model/user.js');
var UserSkill = sequelize.import('./model/userskill.js');
var Title = sequelize.import('./model/title.js');
var UserPass = sequelize.import('./model/userpassword.js');
var UserTwitter = sequelize.import("./model/userTwitter");



//sync the model with the database
sequelize.sync().then(function(res) {
    Skill.sync();
    User.sync();
    UserSkill.sync();
    Title.sync();
    UserPass.sync();
    UserTwitter.sync();

app.post('/gravatar', function(req, res) {
  var email = req.body.email;
  var hash = crypto.createHash('md5').update(email).digest('hex');
  res.send(hash);

});


    app.route('/user/:id/twitter')
      .get(twitterService.get)
      .post(twitterService.create);

    app.post('/upload', uploading.single('image'), function(req, res) {
      var sess = req.session;
      User.findOne({
        where: {
          id: req.cookies.id
        }
      }).then(function(user) {
        var newImg = {
          img: req.file.filename
        };
        User.update(newImg, {
          where: {
            id: user.id
          }
        });
      });
      res.redirect('/profile.html');
    });

    app.route('/logout')
      .get(userService.logout);
    app.route('/updateprofile')
      .put(userService.updateprofile);
    app.route('/signup')
      .post(userService.create);
    app.route('/login')
      .post(userService.login);
    app.route('/user')
      .get(userService.get)
      .post(userService.create);
    app.route('/user/:id')
      .get(userService.getID)
      .delete(userService.deleteID)
      .put(userService.updateID);
    app.route('/title')
      .get(titleService.get)
      .post(titleService.create);
    app.route('/title/:id')
      .put(titleService.updateID)
      .get(titleService.getID)
      .delete(titleService.deleteID);
    app.route('/skill')
      .get(skillService.get)
      .post(skillService.create);
    app.route('/skill/:id')
      .get(skillService.getID)
      .delete(skillService.deleteID)
      .put(skillService.updateID);
    app.route('/userskill')
      .get(userSkillService.get)
      .post(userSkillService.create);
    app.route('/userskill/:id')
      .get(userSkillService.getID);
    app.route('/userskill/:userid/:skillid')
      .get(userSkillService.getbothID)
      .put(userSkillService.updateID)
      .delete(userSkillService.deleteID);
    app.route('/user/:userid/profile')
      .get(userService.getWithInfo);
    server = app.listen(process.env.PORT || 1738, process.env.IP || "0.0.0.0", function() {
      var addr = server.address();
      console.log("Server listening at", addr.address + ":" + addr.port);
    });
  })
  .catch(function(e) {
    console.log('Error in sequelize.sync(): ' + e);
  });
