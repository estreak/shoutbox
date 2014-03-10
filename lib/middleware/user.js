var User = require('../user');

module.exports = function(req, res, next){
  // check for basic HTML Auth and use remote user info instead of sessions
  if (req.remoteUser) {
    console.log('got remote user %s', req.remoteUser.name);
    //req.user = req.remoteUser;
  }
  var uid = req.session.uid;
  if (!uid) return next();
  User.get(uid, function(err, user){
    if (err) return next(err);
    console.log('setting user from db %s', user.name);
    req.user = res.locals.user = user;
    next();
  });
};
