var express = require('express')
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
