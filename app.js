var ical = require('ical')
  , express = require('express')
  , app = express();

// Configuration
app.configure(function() {
  app.set('port', process.env.PORT || 8000);

  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

  app.use(express.logger('dev'));

  app.use(express.compress());

  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
  app.use(express.errorHandler());
});

// Routes
app.get('/', function(req, res) {
  res.render('index');
});

app.get('/next', function(req, res) {
  var url = 'http://www.google.com/calendar/ical/squareup.com_dtroaagr8rhka9lm47riq22hk4%40group.calendar.google.com/private-2102aa6de559abe33b33226abaa2d4c2/basic.ics';
  ical.fromURL(url, {}, function(err, data) {
    if (err) return res.send({ error: err, response: r, body: body });
    console.log(data);
    res.send(data);
  });
});

// Listen
var http = require('http')
  , server = http.createServer(app);
server.listen(app.get('port'), function() {
  require('util').log('Listening on port ' + app.get('port'));
});

// Socket.IO
var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
