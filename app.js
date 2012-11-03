// My SocketStream 0.3 app

var http = require('http'),
    ss = require('socketstream');

// Define a single-page client called 'main'
ss.client.define('main', {
  view: 'app.html',
  css:  ['libs/', 'app.styl'],
  code: ['libs/', 'app'],
  tmpl: '*'
});

ss.client.define('play', {
  view: 'play.html',
  css:  ['libs/', 'app.styl'],
  code: ['libs/', 'app'],
  tmpl: '*'
});

ss.client.define('teamone', {
  view: 'teamone.html',
  css:  ['libs/', 'app.styl'],
  code: ['libs/', 'app'],
  tmpl: '*'
});

ss.client.define('teamtwo', {
  view: 'teamtwo.html',
  css:  ['libs/', 'app.styl'],
  code: ['libs/', 'app'],
  tmpl: '*'
});

ss.session.store.use('redis');


// Serve this client on the root URL
ss.http.route('/', function(req, res){
  res.serveClient('main');
});

// Serve this client on the root URL
ss.http.route('/play', function(req, res){
  res.serveClient('play');
});

// Serve this client on the root URL
ss.http.route('/android', function(req, res){
  res.serveClient('teamone');
});

// Serve this client on the root URL
ss.http.route('/ios', function(req, res){
  res.serveClient('teamtwo');
});

// Code Formatters
ss.client.formatters.add(require('ss-stylus'));

// Use server-side compiled Hogan (Mustache) templates. Others engines available
ss.client.templateEngine.use(require('ss-hogan'));

// Minimize and pack assets if you type: SS_ENV=production node app.js
if (ss.env === 'production') ss.client.packAssets();

// Start web server
var server = http.Server(ss.http.middleware);
server.listen(3000);

// Start SocketStream
ss.start(server);