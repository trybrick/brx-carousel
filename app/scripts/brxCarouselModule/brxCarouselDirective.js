'use strict';
import brxCarouselModule from './module.js';

brxCarouselModule.directive('brxCarousel', ['$rootScope', '$timeout', '$window', '$http', '$brxJson', function ($rootScope, $timeout, $window, $http, $brxJson) {
    var directive = {
      link: link,
      restrict: 'EA',
      scope: true
    };
    return directive;

    function link(scope, element, attrs) {
      var options = {
        interval: attrs.interval,
        reverse: attrs.reverse | false,
        jsonpCb: attrs.jsonpCb || '',
        jsonUrl: attrs.jsonUrl || '',
        isRssFeed: attrs.isRssFeed | false
      },
      cancelRefresh,
      wasRunning = false,
      isPlaying = false;
      
      scope.$slideIndex = 0;
      scope.activate = activate;
      scope.slides = [];
      scope.$prevIndex = 0;
      scope.element = element;
      scope.activated = false;
      
      // determine if slide show is current playing
      scope.isPlaying = function() {
        return isPlaying;
      };
      
      // play slide show
      scope.play = function() {
        scope.stop();

        // allow for explicit interval
        var timing = options.interval || 1;
        if (timing < 200) {
          return;
        }

        isPlaying = true;

        // set new refresh interval
        cancelRefresh = $timeout(scope.next, options.interval);
        return scope.$slideIndex;
      }
      
      // pause slide show
      scope.stop = function() {
        if (isPlaying) {
          if (cancelRefresh) {
            try {
              $timeout.cancel(cancelRefresh);
            } catch (e) {}
          }
        }

        isPlaying = false;
      };
      
      // go to next slide
      scope.next = function() {
        $timeout(function() {
          return scope.$slideIndex = doIncrement(scope.play(), 1);
        }, 5);
      };
      
      // go to previous slide
      scope.prev = function() {
        $timeout(function() {
          return scope.$slideIndex = doIncrement(scope.play(), -1);
        }, 5);
      };

      // go to specfic slide index
      scope.selectIndex = function(slideIndex) {
        $timeout(function() {
          return scope.$slideIndex = doIncrement(scope.play(), slideIndex - scope.$slideIndex);
        }, 5);
      };

      // get the current slide
      scope.currentSlide = function() {
        return scope.slides[scope.currentIndex()];
      };
      
      // add slide
      scope.addSlide = function(slide) {
        return scope.slides.push(slide);
      };

      // remove a slide
      scope.removeSlide = function(slide) {
        //get the index of the slide inside the carousel
        var index = scope.indexOf(slide);
        return slides.splice(index, 1);
      };

      // get a slide index
      scope.indexOf = function (slide) {
        if (typeof(slide.indexOf) !== 'undefined') {
          return slide.indexOf(slide);
        }
        else if (typeof (scope.slides.length) != 'undefined') {
          // this is a loop because of indexOf does not work in IE
          for (var i = 0; i < scope.slides.length; i++) {
            if (scope.slides[i] == slide) {
              return i;
            }
          }
        }

        return -1;
      };

      scope.lastIndex = function() {
        return scope.$prevIndex;
      }
      
      // get current slide index
      scope.currentIndex = function () {
        var reverseIndex = (scope.slides.length - scope.$slideIndex - 1) % scope.slides.length;
        reverseIndex = (reverseIndex < 0) ? 0 : scope.slides.length - 1;
        
        return options.reverse ? reverseIndex : scope.$slideIndex;
      };

      scope.getItem = function(idx) {
        return scope.slides[idx];
      }
      
      // watch index and make sure it doesn't get out of range
      scope.$watch('$slideIndex', function(newValue) {
        var checkValue = doIncrement(scope.$slideIndex, 0);
        
        // on index change, make sure check value is correct
        if (checkValue != newValue) {
          $timeout(function() {
            return scope.$slideIndex = checkValue;
          }, 5);
        }
      });
      
      // cancel timer if it is running
      scope.$on('$destroy', scope.stop);
      
      // attempt to load data from url
      if (options.jsonUrl.indexOf('\/\/') >= 0) {
        if (options.jsonpCb.length > 0) {
          function cb(rsp) {
            scope.slides = rsp;
          }
          if (options.isRssFeed){
            $brxJson.feed(options.jsonUrl, options.jsonpCb, cb);
          }
          else {
            $brxJson.jsonp(options.jsonUrl, options.jsonpCb, cb)
          }
        } else {
          $http.get(options.jsonUrl).then(function(rsp){
            scope.slides = rsp.data;
          });
        }
      }

      scope.activate();
      
      //#region private functions
      // initialize
      function activate() {
        var slides = scope.$eval(attrs.slides);
        if ((scope.slides || []).length <= 0 &&  (slides || []).length <= 0) {
          $timeout(activate, 200);
          return;
        }
        
        $timeout(function() {
          if (slides) {
            scope.slides = slides;
          }

          scope.selectIndex(0);

          var win = angular.element($window);
          win.bind('blur', function() {
            wasRunning = scope.isPlaying();
            scope.stop();
          });
          
          win.bind('focus', function() {
            if (wasRunning) {
              scope.play();
            }
          });

          return;

        }, 50);

        return;
      }

      // safe increment
      function doIncrement(slideIndex, inc) {
        if (scope.slides.length <= 0){
          return 0;
        }

        var firstTime = false;
        if (!scope.activated){
          scope.activated = true;
          firstTime = true;
        }

        var newValue = slideIndex + inc;
        newValue = ((newValue < 0) ? scope.slides.length - 1 : newValue) % scope.slides.length;
        var rst = newValue || 0;
        if (inc == 0 && !firstTime) return rst;
        
        scope.$prevIndex = firstTime ? -1 : slideIndex;
        $rootScope.$broadcast('brx-carousel', scope, rst);

        return rst;
      }
      //#endregion
    }
}]);
