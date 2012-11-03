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

// Serve this client on the root URL
ss.http.route('/', function(req, res){
  res.serveClient('main');
});

// Define a single-page client called 'main'
ss.client.define('results', {
  view: 'levelone.html',
  css:  ['libs/', 'app.styl'],
  code: ['libs/', 'app'],
  tmpl: '*'
});

// Serve this client on the root URL
ss.http.route('/results', function(req, res){
  res.serveClient('results');
});


// Code Formatters
ss.client.formatters.add(require('ss-stylus'));

// Use server-side compiled Hogan (Mustache) templates. Others engines available
ss.client.templateEngine.use(require('ss-hogan'));

ss.session.store.use('redis');

// Minimize and pack assets if you type: SS_ENV=production node app.js
if (ss.env === 'production') ss.client.packAssets();

// Start web server
var server = http.Server(ss.http.middleware);
server.listen(3000);

// Start SocketStream
ss.start(server);

/*
setInterval(function(){
  ss.api.publish.all('setBlock', {x:Math.floor(Math.random()*15-8), y:Math.floor(Math.random()*10), z:Math.floor(Math.random()*15-8)}); 
}, 10)
*/
