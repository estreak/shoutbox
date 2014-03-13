var express = require('express');
var User = require('../lib/user');
var Entry = require('../lib/entry');

exports.auth = express.basicAuth(User.authenticate);

exports.user = function(req, res, next){
  User.get(req.params.id, function(err, user){
    if (err) return next(err);
    if (!user.id) return res.send(404);
    res.json(user);
  });
};

// this rendors JSON instead of a template like in entries.js
exports.entries = function(req, res, next){
  var page = req.page;
  Entry.getRange(page.from, page.to, function(err, entries){
    if (err) return next(err);

    // support content negotiaion
    res.format({
      json: function(){
        res.json(entries);
      },
      xml: function(){
        res.render('entries/xml', { entries: entries });
/*
 * Icky way. Better is to use a template entries.xml.ejs
        res.write('<entries>\n');
        entries.forEach(function(entry){
          res.write('  <entry>\n');
          res.write('    <title>' + entry.title + '</title>\n');
          res.write('    <body>' + entry.body + '</body>/n');
          res.write('    <username>' + entry.username + '</username>\n');
          res.write('  </entry>\n');
        })
        res.end('/entries>');
*/
      }
    });
  });
};
