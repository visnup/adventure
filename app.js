var icalendar = require('icalendar')
  , request = require('request')
  , express = require('express')
  , app = express();

// Configuration
app.configure(function() {
  app.set('port', process.env.PORT || 8000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

  app.use(express.compress());

  app.use(express.static(__dirname + '/public'));
  app.use(require('connect-assets')());

  app.use(express.logger('dev'));
});

app.configure('development', function() {
  app.use(express.errorHandler());
});

// Routes
app.get('/now', function(req, res) { res.send(String(Date.now())) });

app.get('/event', function(req, res) {
  var url = 'http://www.google.com/calendar/ical/squareup.com_j5tn0fal9t907lqphjrap2v91c%40group.calendar.google.com/private-7013e50ac45885321e8ce035792e67a4/basic.ics';
  request(url, function(err, r, body) {
    if (err) return res.send({ error: err, response: r, body: body });

    var calendar = icalendar.parse_calendar(body)
      , event = null
      , events = calendar.components.VEVENT.map(function(vevent) {
        return vevent.properties
      });
    events = events.sort(function(a, b) {
      if (a.RRULE)
        return 1;
      else if (b.RRULE)
        return -1;
      else
        return new Date(a.DTSTART[0].value) - new Date(b.DTSTART[0].value);
    });
    for (var i = 0; i < events.length; i++) {
      event = events[i];
      if (new Date(event.DTSTART[0].value) > new Date)
        break;
    }
    res.send(event);
  });
});

app.get(/^/, function(req, res) { res.render('index') });


// Listen
var http = require('http')
  , server = http.createServer(app);
server.listen(app.get('port'), function() {
  require('util').log('Listening on port ' + app.get('port'));
});

// Socket.IO
var io = require('socket.io').listen(server);
io.sockets.on('connection', function(client) {
  client.on('message', function(data) {
    if (Date.now() - client.lastMessageAt < 100) return;
    client.lastMessageAt = Date.now();
    data.id = client.id;
    client.json.broadcast.send(data);
  });
  client.on('disconnect', function() {
    client.json.broadcast.send({ id: client.id, disconnect: true });
  });
});
