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
  session = require('express-session');


app
  .use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
  })

app.use(morgan('dev')); // logs request to the console
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.set('trust proxy', 1); // trust first proxy
var sess = {
  secret: 'mqpetbxmzodjyyesmfpqirhgncmxssfr',
  cookie: {}
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
const sequelize = new Sequelize('skilly', 'root', 'admin', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  define: {
    timestamps: false,
  }
});
const skillService = require("./service/skill")(sequelize);
const titleService = require("./service/title")(sequelize);
const userService = require("./service/user")(sequelize);
const userSkillService = require("./service/userskill")(sequelize);


var Skill = sequelize.import('./model/skill.js');
var User = sequelize.import('./model/user.js');
var UserSkill = sequelize.import('./model/userskill.js');
var Title = sequelize.import('./model/title.js');
var UserPass = sequelize.import('./model/userpassword.js');



//sync the model with the database
sequelize.sync().then(function(res) {
    Skill.sync();
    User.sync();
    UserSkill.sync();
    Title.sync();
    UserPass.sync();

    app.route('/logout')
      .get(userService.logout);
    app.route('/profile.html')
      // .get(userService.get);
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
