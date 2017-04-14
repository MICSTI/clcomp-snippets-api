/**
 * Created by michael.stifter on 10.03.2017.
 */
var router = require('express').Router();
var config = require('../config');
var logger = require('winston');
var mongoose = require('mongoose');
var objectid = mongoose.Types.ObjectId;

var Snippet = require('../models/snippet');

// Allowed properties for a snippet
var ALLOWED_PROPERTIES = ['name', 'description', 'author', 'language', 'code', 'tags'];

/**
 * GET /snippets
 * GET /snippets?<attribute>=<value>...
 * Returns an array containing all snippets that match the search criteria or all snippets if no search criteria were
 * added via the query parameters.
 *
 * If no query parameters are set, it returns all snippets from the database as an array.
 * Otherwise, it return only snippets which match the search criteria (based on AND check).
 */
router.get('/', function(req, res, next) {
    var matchObj = {};

    // check if query parameters have been set
    // if no query parameters were set, all snippets are returned
    ALLOWED_PROPERTIES.forEach(function(prop) {
        if (req.query[prop] !== undefined) {
            matchObj[prop] = req.query[prop];
        }
    });

    Snippet.find(matchObj)
        .exec(function(err, snippets) {
            if (err) {
                return next(getWrappedError(err, 400));
            }

            res.status(200).json(snippets);
        });
});

/**
 * POST /snippets
 * Creates a new snippet.
 *
 * If the creation was successful, 201 Created will be returned along with the created object and its assigned ID.
 * If the model criteria defined in ../models/snippet.js are not met, an error will be returned.
 */
router.post('/', function(req, res, next) {
    var snippet = new Snippet(req.body);

    snippet.save(function(err, snippetObj) {
        if (err) {
            return next(getWrappedError(err, 400));
        }

        if (!snippetObj) {
            var error = new Error();
            error.status = 400;
            error.message = "The snippet could not be created";

            return next(error);
        }

        res.status(201).json(snippetObj);
    });
});

/**
 * GET /snippets/:snippetId
 * Returns the snippet with the specified ID or an error if no such snippet exists.
 */
router.get('/:snippetId', function(req, res, next) {
    var snippetId = req.params.snippetId;

    if (!objectid.isValid(snippetId)) {
        var error = new Error();
        error.status = 400;
        error.message = "No snippet with this ID exists";

        return next(error);
    }

    Snippet.findOne({
        _id: snippetId
    }).exec(function(err, snippet) {
        if (err) {
            return next(getWrappedError(err, 400));
        }

        if (!snippet) {
            var error = new Error();
            error.status = 400;
            error.message = "No snippet with this ID exists";

            return next(error);
        }

        res.status(200).json(snippet);
    });
});

/**
 * PUT /snippets/:snippedId
 * Updates the snippet with the specified ID.
 *
 * Please note that it only updates the properties passed in the body.
 * Properties which were not passed in the body will not be changed.
 */
router.put('/:snippetId', function(req, res, next) {
    var snippetId = req.params.snippetId;

    if (!objectid.isValid(snippetId)) {
        var error = new Error();
        error.status = 400;
        error.message = "No snippet with this ID exists";

        return next(error);
    }

    Snippet.findOne({
        _id: snippetId
    }).exec(function(err, snippet) {
        if (err) {
            return next(getWrappedError(err, 400));
        }

        if (!snippet) {
            var error = new Error();
            error.status = 400;
            error.message = "No snippet with this ID exists";

            return next(error);
        }

        ALLOWED_PROPERTIES.forEach(function(prop) {
            if (req.body[prop] !== undefined) {
                snippet[prop] = req.body[prop];
            }
        });

        snippet.save(function(err, updatedSnippet) {
            if (err) {
                return next(getWrappedError(err, 400));
            }

            res.status(200).json(updatedSnippet);
        });
    });
});

/**
 * DELETE /snippets/:snippetId
 * Deletes the snippet with the specified ID or returns an error if no such snippet exists.
 */
router.delete('/:snippetId', function(req, res, next) {
    var snippetId = req.params.snippetId;

    if (!objectid.isValid(snippetId)) {
        var error = new Error();
        error.status = 400;
        error.message = "No snippet with this ID exists";

        return next(error);
    }

    Snippet.findOne({
        _id: snippetId
    }).exec(function(err, snippet) {
        if (err) {
            return next(getWrappedError(err, 400));
        }

        if (!snippet) {
            var error = new Error();
            error.status = 400;
            error.message = "No snippet with this ID exists";

            return next(error);
        }

        snippet.remove(function(err) {
            if (err) {
                return next(getWrappedError(err, 400));
            }

            return res.status(200).send();
        });
    });
});

var getWrappedError = function(err, status) {
    var error = new Error();

    status = status || 500;

    error.status = status;
    error.message = err.message;

    return error;
};

module.exports = router;