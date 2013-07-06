/*jshint globalstrict:true */
/*global angular:true */
'use strict';

var directives = angular.module('elasticjs.directives', []);

directives.directive('appVersion', ['version', function(version) {
        return function(scope, elm, attrs) {
            elm.text(version);
        };
    }]);