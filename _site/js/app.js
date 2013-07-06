/*jshint globalstrict:true */
/*global angular:true */
'use strict';

/* Application level module which depends on filters, controllers, and services */
angular.module('elasticjs', [
    'elasticjs.controllers', 
    'elasticjs.filters', 
    'elasticjs.services', 
    'elasticjs.directives', 
    'elasticjs.service',
    'ui.bootstrap'
    ]).config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'index.html'
            })
            .when('/createIssueTemplate', {
                templateUrl: 'partials/createIssueTemplate.html' 
            })
            .when('/editIssueTemplate', {
                templateUrl: 'partials/editIssueTemplate.html' 
            })
            .otherwise({
                redirectTo: '/'
            });
  }]);