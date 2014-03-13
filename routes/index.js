
/*
 * GET home page. (this was replaced with entries.list)
 */
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

// Error handling
exports.notfound = function(req, res){
  res.status(404).format({
    html: function(){
      res.render('404');
    },
    json: function(){
      res.send({ message: 'Resource not found' });
    },
    xml: function(){
      res.write('<error>\n');
      res.write('  <message>Resource not found</message>\n');
      res.end('</error>\n');
    },
    text: function(){
      res.send('Resource not found\n');
    }
  });
};

exports.error = function(err, req, res, next){
  console.error(err.stack);
  var msg;

  switch (err.type){
    case 'database':
      msg = 'Server db is under the weather';
      res.statusCode = 503;
      break;
    default:
      msg = 'Internal Combustion Error';
      res.statusCode = 500;
  }
  res.format({
    html: function(){
      res.render('5xx', { msg: msg, status: res.statusCode });
    },
    json: function(){
      res.send({ error: msg });
    },
    text: function(){
      res.send(msg + '\n');
    }
  });
};
  
  



