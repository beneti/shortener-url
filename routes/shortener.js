var Shortener = require('../models/shortener.js');

exports.generate = function(req, res){
  Shortener.generate(req.body['url'], function(short){
    var protocol = 'http://';
    var host = req.headers.host;
    res.write(protocol + host + '/' + short);
    res.end();
  });
};

exports.redirect = function(req, res){
  Shortener.decode(req.params.short, function(url){
    res.writeHead(302, {'Location': url});
    res.end();
  });
};
