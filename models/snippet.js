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
        type: String
    },
    language: {
        type: String
    },
    code: {
        type: String
    },
    tags: [{
        type: String
    }]
});

module.exports = Snippet;