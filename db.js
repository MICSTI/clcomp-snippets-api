var mongoose = require('mongoose');
var logger = require('winston');

var config = require('./config');

// MongoDB connection URL (if no MONGODB_URI is set, we fall back to the URL set in the config file)
var mongoUrl = process.env.MONGODB_URI || config.mongodb_url;

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

module.exports = mongoose;