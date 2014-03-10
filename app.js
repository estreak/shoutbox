
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./lib/middleware/user');
var validate = require('./lib/middleware/validate');
var page = require('./lib/middleware/page');
var http = require('http');
var path = require('path');
var register = require('./routes/register');
var messages = require('./lib/messages');
var login = require('./routes/login');
var entries = require('./routes/entries');
var Entry = require('./lib/entry');
var api = require('./routes/api');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', api.auth);
app.use(user);
app.use(messages);
app.use(app.router);

app.get('/register', register.form);
app.post('/register', register.submit);

app.get('/login', login.form);
app.post('/login', login.submit);
app.get('/logout', login.logout);

app.get('/post', entries.form);
app.post('/post',
          validate.required('entry[title]'),
          validate.lengthAbove('entry[title]',4),
          entries.submit);

// R.E.S.T
app.get('/api/user/:id', api.user);
//app.get('/api/entries/:page?', api.entries);
app.post('/api/entry', entries.submit);

// development only
if ('development' == app.get('env')) {
  console.log("DEVELOPMENT");
  app.use(express.errorHandler());
} else {
  console.log("PRODUCTION");
}

// send front page to entries (default would be routes.index)
//app.get('/', page(Entry.count, 5), entries.list);
app.get('/:page?', page(Entry.count, 5), entries.list);



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
