var mongoose = require('mongoose');
var Url = require('url');
var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/shortener';
mongoose.connect(mongoUri);
var schema = mongoose.Schema({ id: 'number', url: 'string' });
var Shortener = mongoose.model('Shortener', schema);
var alphabet, base;

alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");

base = alphabet.length;

function encode(i) {
  var s;
  if (i === 0) {
    return alphabet[0];
  }
  s = "";
  while (i > 0) {
    s += alphabet[i % base];
    i = parseInt(i / base, 10);
  }
  return s.split("").reverse().join("");
};

function decode(s) {
  var c, i, _i, _len;
  i = 0;
  for (_i = 0, _len = s.length; _i < _len; _i++) {
    c = s[_i];
    i = i * base + alphabet.indexOf(c);
  }
  return i;
};

exports.generate = function(url, shortener){
  var parsed = Url.parse(url);
  var correct_url = parsed.protocol === undefined ? 'http://' + url: url;

  var id = parseInt(new Date().getTime()/1000);
  var short = encode(id);

  var newurl = new Shortener({ id: id, url: correct_url });
  newurl.save(function(err){
    shortener(short.toString());
  });
};

exports.decode = function(short, url){
  var id = decode(short);
  Shortener.findOne({id: id}, function(err, shortener){
    url(shortener.url);
  });
};

