// My SocketStream 0.3 app

var http = require('http'),
    ss = require('socketstream');

var redisConfig = {
  host: '0.0.0.0',
  port: 2338
}

ss.session.store.use('redis', redisConfig);

ss.client.define('play', {
  view: 'play.html',
  css:  ['libs/', 'app.styl'],
  code: ['libs/', 'inputclient'],
  tmpl: '*'
});

ss.client.define('teamone', {
  view: 'teamone.html',
  css:  ['libs/', 'app.styl'],
  code: ['libs/', 'outputclient'],
  tmpl: '*'
});

ss.client.define('teamtwo', {
  view: 'teamtwo.html',
  css:  ['libs/', 'app.styl'],
  code: ['libs/', 'outputclient'],
  tmpl: '*'
});

ss.client.define('admin', {
  view: 'admin.html',
  css:  ['libs/', 'app.styl'],
  code: ['libs/', 'outputclient'],
  tmpl: '*'
});

// Serve this client on the root URL
ss.http.route('/admin', function(req, res){
  res.serveClient('admin');
});

ss.http.route('/', function(req, res){
  res.serveClient('play');
});
ss.http.route('/blocks', function(req, res){
  res.serveClient('teamone');
});
ss.http.route('/ninjas', function(req, res){
  res.serveClient('teamtwo');
});


//console.log(ss.events)

ss.events.on("close",function(session){
  console.log('client disconnected close')
})
ss.events.on("end",function(session){
  console.log('client disconnected end')
})


ss.responders.add(require('ss-heartbeat-responder'), {beatDelay:5, expireDelay:10, purgeDelay:15, logging:1});

ss.api.heartbeat.on('connect', function(session) {
  console.log('client connected')
  ss.api.publish.channel('results', 'updatePlayers', 1)
});

ss.api.heartbeat.on('disconnect', function(session) {
  console.log('client disconnected')
  ss.api.publish.channel('results', 'updatePlayers', -1)
});

// Code Formatters
ss.client.formatters.add(require('ss-stylus'));

// Use server-side compiled Hogan (Mustache) templates. Others engines available
ss.client.templateEngine.use(require('ss-hogan'));

// Minimize and pack assets if you type: SS_ENV=production node app.js
if (ss.env === 'production') ss.client.packAssets();

// Start web server
var server = http.Server(ss.http.middleware);
server.listen(2337);

// Start SocketStream
ss.start(server);

