'use strict';

const
    Sequelize = require('sequelize');

let server;

const
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

app
    .use(function(req, res, next) {
        console.log(req.method, req.url);
        next();
    })
    .use(bodyParser.json());

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

//sync the model with the database
sequelize.sync().then(function(res) {
        app.route('/user')
            .get(userService.get)
            .post(userService.create)
        app.route('/user/:id')
            .get(userService.getID)
            .delete(userService.deleteID)
            .put(userService.updateID)
        app.route('/title')
            .get(titleService.get)
            .post(titleService.create)
        app.route('/title/:id')
            .put(titleService.updateID)
            .get(titleService.getID)
        app.route('/skill')
            .get(skillService.get)
            .post(skillService.create)
        app.route('/skill/:id')
            .get(skillService.getID)
            .delete(skillService.deleteID)
            .put(skillService.updateID)
        app.route('/userskill')
            .get(userSkillService.get)
            .post(userSkillService.create)
        app.route('/userskill/:id')
            .get(userSkillService.getID)
        app.route('/userskill/:userid/:skillid')
            .get(userSkillService.getbothID)
            .put(userSkillService.updateID)
            .delete(userSkillService.deleteID)
        server = app.listen(process.env.PORT || 1738, process.env.IP || "0.0.0.0", function() {
            var addr = server.address();
            console.log("Server listening at", addr.address + ":" + addr.port);
        });
    })
    .catch(function(e) {
        console.log('Error in sequelize.sync(): ' + e);
    });
