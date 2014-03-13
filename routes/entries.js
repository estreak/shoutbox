var Entry = require('../lib/entry');
var User = require('../lib/user');

exports.form = function(req, res){
  res.render('post', { title: 'Post' });
};

exports.list = function(req, res, next){
  var page = req.page;
  Entry.getRange(page.from, page.to, function(err, entries){
    if (err) return next(err);
    res.render('entries', {
      title: 'Entries',
      entries: entries,
    });
  });
};

exports.submit = function(req, res, next){
  var data = req.body.entry;
  console.log("got title:%s body:%s", data.title, data.body);

  // create new entry with form data
  entry = new Entry({
    title: data.title,
    body: data.body,
    username: req.user.name, // works from REST or sessions,
                             // interestingly, res.locals.user was invalid
                             // here after setting it in middleware user.js
  });

  // save the entry in redis 
  entry.save(function(err){
    if (err) return next(err);
    // for R.E.S.T access send back a response message
    if (req.remoteUser) {
      res.json({message: 'Entry added.'});
    } else {
    // sessions go back to home
      res.redirect('/');
    }
  });
};
