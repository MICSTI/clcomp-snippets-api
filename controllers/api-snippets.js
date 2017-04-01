/**
 * Created by michael.stifter on 10.03.2017.
 */
var router = require('express').Router();
var config = require('../config');
var logger = require('winston');

var Snippet = require('../models/snippet');

/**
 * Returns all snippets from the database as an array.
 */
router.get('/', function(req, res, next) {
    Snippet.find({})
        .exec(function(err, snippets) {
            if (err) {
                return next(err);
            }

            res.status(200).json(snippets);
        });
});

router.post('/', function(req, res, next) {
    var snippet = new Snippet(req.body);

    snippet.save(function(err, snippetObj) {
        if (err) {
            return next(err);
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

router.get('/:snippetId', function(req, res, next) {
    Snippet.findOne({
        _id: req.params.snippetId
    }).exec(function(err, snippet) {
        if (err) {
            return next(err);
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

var puttableProps = ['name', 'description', 'author', 'language', 'code', 'tags'];
router.put('/:snippetId', function(req, res, next) {
    Snippet.findOne({
        _id: req.params.snippetId
    }).exec(function(err, snippet) {
        if (err) {
            return next(err);
        }

        if (!snippet) {
            var error = new Error();
            error.status = 400;
            error.message = "No snippet with this ID exists";

            return next(error);
        }

        puttableProps.forEach(function(prop) {
            if (req.body[prop] !== undefined) {
                snippet[prop] = req.body[prop];
            }
        });

        snippet.save(function(err, updatedSnippet) {
            if (err) {
                return next(err);
            }

            res.status(200).json(updatedSnippet);
        });
    });
});

router.delete('/:snippetId', function(req, res, next) {
    Snippet.findOne({
        _id: req.params.snippetId
    }).exec(function(err, snippet) {
        if (err) {
            return next(err);
        }

        if (!snippet) {
            var error = new Error();
            error.status = 400;
            error.message = "No snippet with this ID exists";

            return next(error);
        }

        snippet.remove(function(err) {
            if (err) {
                return next(err);
            }

            return res.status(200).send();
        });
    });
});

module.exports = router;