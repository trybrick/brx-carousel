import brxJsonService from './module.js';

brxJsonService.factory('$brxJson', ['$window', function ($win) {
  function execJSONP(url, cbName, cb) {
    var script = $win.document.createElement('script');
    script.async = true;
    var callb = 'brxexec'+Math.floor((Math.random()*65535)+1);
    $win[callb] = function(data) {
        var scr = $win.document.getElementById(callb);
        scr.parentNode.removeChild(scr);
        cb(data);
        $win[callb] = null;
    }
    var sepchar = (url.indexOf('?') > -1)?'&':'?';
    script.src = url+sepchar+(cbName || 'callback')+'='+callb;
    script.id = callb;
    $win.document.getElementsByTagName('head')[0].appendChild(script);
  }

  function execFeed(url, maxResult, cbName, cb) {
    var url = '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=' + (maxResult || 50) + '&q=' + encodeURIComponent(url);
    execJSONP(url, cb);
  }
  
  return {
    jsonp: execJSONP,
    feed: execFeed
  };
}]);