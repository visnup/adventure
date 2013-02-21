//= require watchmaker

$.get('/next', function(data) {
  $('.where').text(data.where);

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
    var diff = new Date(parseInt(data.when)) - new Date - skew;

    if (isNaN(diff)) return;

    if (diff > 0) {
      var p = parts(diff)
        , $countdown = $('.when').empty();
      if (p[0])
        $countdown.append(p[0] + 'd ');
      $countdown.append(_.map(p.slice(1, 4), pad).join(':'));

      setTimeout(tick, 800);
    } else {
      $next.addClass('old');
      setCurrent($next);
      tick();
    }
  })();
});
