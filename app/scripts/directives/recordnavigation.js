'use strict';
/**
 * @ngdoc directive
 * @name phrPrototypeApp.directive:recordNavigation
 * @description
 * # recordNavigation
 */
angular.module('phrPrototypeApp').directive('recordNavigation', ['$window',
    function($window) {
        return {
            templateUrl: 'views/templates/recordnavigation.html',
            restrict: 'EA',
            link: function postLink(scope, element, attrs) {
                //Active Link Highlighting.
                element.find("#nav" + scope.entryType).addClass("active");
                var eTop = $('.fixedElement').offset().top - 20;
                var eWidth = $('.fixedElement').width();
                var eHeight = $('.fixedElement').height();
                
                
                $(window).scroll(function(e) {
                    var $el = $('.fixedElement');
                    if ($(this).scrollTop() > eTop && $el.css('position') !== 'fixed') {
                        $('.fixedElement').css({
                            'position': 'fixed',
                            'top': '20px',
                            'left': '20px',
                            'width': '160px',
                            'height': eHeight + 'px'
                        });
                    }
                    if ($(this).scrollTop() < eTop && $el.css('position') === 'fixed') {
                        $('.fixedElement').css({
                            'position': 'static',
                            'top': '0px',
                            'left': '0px',
                            'width': '160px'
                        });
                    }
                });
            }
        };
    }
]);