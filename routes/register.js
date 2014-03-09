// this file deals with get and post for registration form
//
var User = require('../lib/user');

exports.form = function(req, res){
    res.render('register', { title: 'Register' });
};

// via connect the form 'user[name'] turns in to req.body.user.name & .pass
exports.submit = function(req, res, next){
    var data = req.body.user;

    // find the user in redis
    User.getByName(data.name, function(err, user){
        if (err) return next(err); // defer database errors

        // if id already filled in then bomb
        if (user.id) {
            res.error("That blows! Pick a new user name");
            res.redirect('back');
        } else {
            // create new User object with form data
            user = new User({
                name: data.name,
                pass: data.pass
            })

            // save the user in redis and the session
            user.save(function(err){
                if (err) return next(err);
                req.session.uid = user.id;
                res.redirect('/');
            });
        }
    });
};

