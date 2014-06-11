"use strict";
var express = require('express.io');
var http = require('http');
var swig = require('swig');
var fs = require('fs');
var Sequelize = require('sequelize');
var sqlite    = require('sqlite3');
var model =  require('/vagrant/platform/web/models_db/models_sqlite.js');
var controllers_path = __dirname + '/controllers';

var sqlize = new Sequelize('database', 'username', 'password', {
    dialect: 'sqlite',
    storage: '/vagrant/platform/web/database/main.db'
});
model(sqlize);

var app = express();
app.http().io();
app.set('env', "development");
app.engine('html', swig.renderFile);
app.set('port', 3000);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.disable('view cache');
app.use(require('connect').bodyParser());
app.use(express.static(__dirname + '/assets'));

fs.readdirSync(controllers_path).forEach(function(file){
    require(controllers_path + '/' + file)(app);
});

app.listen(
    app.get('port'),
    function () {
        console.log("Express server listening on port " + app.get('port'));
    }
);


return app;