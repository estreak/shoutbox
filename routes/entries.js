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
    username: res.locals.user.name,  // or could use req.user
  });

  // save the entry in redis 
  entry.save(function(err){
    if (err) return next(err);
    res.redirect('/');
  });
};
