var User = require('../lib/user');

exports.form = function(req, res){
    console.log("login form");
    res.render('login', { title: 'Login' });
};

// via connect the form 'user[name'] turns in to req.body.user.name & .pass
exports.submit = function(req, res, next){
    var data = req.body.user;

    console.log("login submit user:%s pass%s",data.name, data.pass);

    // authenticate (this does a user lookup first)
    User.authenticate(data.name, data.pass, function(err, user){
        if (err) {
            console.log("login submit got an err:%s", err);
            return next(err); // defer database errors
        }

        // if no id found then bomb
        if (user) {
            req.session.uid = user.id;
            res.redirect('/');
        } else {
            res.error("DOH! can't find ya");
            res.redirect('back');
        }
    });
};

exports.logout = function(req, res, next){
    req.session.destroy(function(err) {
        console.log("destroyed session. err:%s", err);
        if (err) throw err;
        res.redirect('/');
    })
};


