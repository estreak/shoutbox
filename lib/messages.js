var express = require('express');
var res = express.response;

// middle ware for the message functions
module.exports = function(req, res, next){
    res.locals.messages = req.session.messages || [];
    res.locals.removeMessages = function(){
        req.session.messages = [];
    };
    next();
};


// save array of messages in the session
res.message = function(msg, type){
    type = type || 'info';
    var sess = this.req.session;
    sess.messages = sess.messages || [];
    sess.messages.push({ type: type, string: msg });
};

// helper to add an error message type
res.error = function(msg){
    return this.message(msg, 'error');
};
