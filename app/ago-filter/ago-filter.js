angular.module('TravisQueueDashboard').
filter('ago', function() {
  return function(dateString) {
    var duration = Date.now() - new Date(dateString).getTime();
    if (duration < 60*1000) {
      return '' + Math.round(duration / 100)/10 + 's';
    } else if (duration < 60*60*1000) {
      return '' + Math.round(duration / 60 /100)/10 + 'm';
    }

    return '' + Math.round(duration / 60 / 60 / 100)/10 + 'h';
  };
});