//= require watchmaker
//= require vendor/moment

$.get('/event', function(data) {
  var $details = $('.details');

  data.start = moment(data.DTSTART[0].value);
  data.location = data.LOCATION[0].value.replace(/[\u2295-\u32fe]/, '').trim();
  data.description = data.DESCRIPTION[0].value;

  $('.location', $details).text(data.location);

  // server offset
  var skew = 0;
  $.get('/now', function(serverTime) {
    skew = new Date(parseInt(serverTime)) - new Date;
  });

  // countdown
  function parts(s) {
    s = s / 1000;
    return _.map([
      s / 86400,          // days
      s % 86400 / 3600,   // hours
      s % 3600 / 60,      // minutes
      s % 60              // seconds
    ], Math.floor);
  }
  function pad(s) { return s >= 10 ? s : '0' + s; }

  (function tick() {
    var diff = data.start - new Date - skew;

    if (isNaN(diff)) return;

    if (diff > 0) {
      var p = parts(diff)
        , $countdown = $('.start', $details).empty();
      if (p[0])
        $countdown.append(p[0] + 'd ');
      $countdown.append(_.map(p.slice(1, 4), pad).join(' '));

      setTimeout(tick, 800);
    }
  })();

  $details.addClass('ready');
});
