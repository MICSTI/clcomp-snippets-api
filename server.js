/**
 * Created by michael.stifter on 14.03.2017.
 */
// modules ====================================
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var logger = require('winston');
var fs = require('fs');
var mongoose = require('mongoose');

var errorHandler = require('./controllers/error-handler');

// config file ====================================
// first check if it exists
var configFilePath = './config.js';

// we know that synchronous code is bad in node.js - but in this case it's ok since it will only be executed once on startup
if (!fs.existsSync(configFilePath)) {
    logger.error('No config file found!');
    logger.info('Please create a config.js file in the project\'s root folder (you can use config.sample.js as a template)');

    // exit program
    process.exit(1);
}

var config = require(configFilePath);

// set port
var port = process.env.PORT || config.port;

// set up MongoDB
var mongoUrl = process.env.MONGO_URI || config.mongodb_url;

if (!mongoUrl) {
    var errorMsg = "No MongoDB connection URL set";

    logger.error(errorMsg);
    throw Error(errorMsg);
}

// to solve deprecation problem of mongoose's mpromise library
// see: https://github.com/Automattic/mongoose/issues/4291
mongoose.Promise = global.Promise;

mongoose.connect(mongoUrl, function(err) {
    if (err) {
        var errorMsg = "Could not connect to MongoDB";

        logger.error(errorMsg);
        throw Error(errorMsg);
    }

    logger.info('MongoDB connected');
});

// get all data of the body (POST) parameters
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// allow requests from all resources (prevent CORS errors)
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// API routes ================================================
//app.use('/api/nearest/police', require('./controllers/api-police-stations'));

// index route
app.get('/', function(req, res) {
    res.status(200).send("Hi there! This is the Cloud Computing Snippets API");
});

// 404
app.get("*", function(req, res) {
    res.status(404).send("This is not an allowed URL");
});

// error handler ====================================
app.use(errorHandler);

// start app ====================================
app.listen(port, function() {
    // success message
    logger.info("API server started on port %d", port);
});

// expose app
exports = module.exports = app;