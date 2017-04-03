var db = require('../db');

var Snippet = db.model('snippet', {
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    author: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    tags: [{
        type: String
    }]
});

module.exports = Snippet;