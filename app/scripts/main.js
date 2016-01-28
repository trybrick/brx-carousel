'use strict';
import 'babel-polyfill';
// import 'angular-material/angular-material.css';
// import '../styles/main.css';
import angular from 'angular';
import ngAnimate from 'angular-animate';
//import ngMaterial from 'angular-material';
//import Test from 'es6Module/test';
import brxCarouselModule from 'brxCarouselModule/index';

angular.module('myApp', ['ngAnimate', brxCarouselModule])
	.run(function($rootScope){
		$rootScope.$on('brx-carousel', function(evt, scope, newValue){
	        var element = scope.element;
	        var slideIndex = scope.lastIndex();
	        var inc = newValue - slideIndex;
	        var oldEl = element[0].getElementsByClassName('slide' + slideIndex);
	        var newEl = element[0].getElementsByClassName('slide' + newValue);

	        if (oldEl.length <= 0) { 
	          return;
	        }
	        /*
	        oldEl = angular.element(oldEl[0]);
	        newEl = angular.element(newEl[0]);
	        oldEl.css({top: 0, left: 0, transform: null});
	        newEl.css({top: 0, left: 0, transform: null});
	        TweenMax.set(oldEl,{clearProps:"all"});
	        TweenMax.set(newEl,{clearProps:"all"});
	        var tl = new TimelineLite({repeat: 0});
	        tl.to(oldEl[0],0.5,{scale:.8,ease:"Base.easeOut"})
		        .to(oldEl[0],0.7,{xPercent:-100,rotationY:80},'L'+newValue) 
		        .from(newEl[0],0.7,{xPercent:100,rotationY:-80},'L'+newValue)
		        .from(newEl[0],0.5,{scale:.8,ease:"Base.easeIn"});
		                tl.to(oldEl[0],0.5,{scale:.5,ease:Back.easeOut})
        .to(oldEl[0],0.7,{xPercent:-50},'L'+i)
        .set(slides[i],{zIndex:1-i}).set(slides[i-1],{zIndex:slides.length})
        .from(slides[i-1],0.5,{scale:.5,ease:Back.easeIn})
/*
	        if (inc > 0) {
	          tl.to(oldEl[0],1,{left: "-100%", display: "block"})
	            .from(newEl[0],1,{left: "100%", display: "block"}, "-=1")
	        }
	        else {
	          tl.to(oldEl[0],1,{left: "100%", display: "block"})
	            .from(newEl[0],1,{left: "-100%", display: "block"}, "-=1")
	        }
	        */

	      });
	}).animation('.slide-animation', function () {
        return {
            addClass: function (element, className, done) {
                if (className == 'ng-hide') {
					var idx = element.data().index;
					
                    TweenMax.to(element,0.5,{scale:.8,ease:"easeOut"}, 'L-' + parseInt(idx + 1));
                    TweenMax.to(element,0.7,{xPercent:-100,rotationY:80, onComplete: done});
                }
                else {
                    done();
                }
            },
            removeClass: function (element, className, done) {
                if (className == 'ng-hide') {
                    element.removeClass('ng-hide');
					var idx = element.data().index;

					TweenMax.set(element,{clearProps:"all"});
					TweenMax.from(element,0.7,{xPercent:100,rotationY:-80}, 'L-' + parseInt(idx + 1));
		        	TweenMax.from(element,0.5,{scale:.8,ease:"easeIn", onComplete: done});
                }
                else {
                    done();
                }
            }
        };
    });

angular.bootstrap(document, ['myApp']);
