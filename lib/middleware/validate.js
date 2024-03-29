// turns a name[field] in to an array of two entries
function parseField(field) {
  return field
    .split(/\[|\]/)
    .filter(function(s){ return s; });
}

// iterates over body[entry[field]] to find the value at bottom
function getField(req, fields) {
  var val = req.body;
  fields.forEach(function(prop){
    val = val[prop];
  });
  return val;
}

exports.required = function(field){
  fields = parseField(field);
  return function(req, res, next){
    if (getField(req, fields)) {
      next();
    } else {
      res.error(field.join(' ') + ' is required');
      res.redirect('back');
    }
  }
};

exports.lengthAbove = function(field, len){
  field = parseField(field);
  return function(req, res, next){
    if (getField(req, field).length > len) {
      next();
    } else {
      res.error(field.join(' ') + ' must have more than ' 
          + len + ' characters');
      res.redirect('back');
    }
  }
};
