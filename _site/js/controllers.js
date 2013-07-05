/*jshint globalstrict:true */
/*global angular:true */
'use strict';

angular.module('elasticjs.controllers', [])
    .controller('SearchCtrl', function($scope, $location, $dialog, $route, ejsResource) {

        // point to your ElasticSearch server
        var ejs = ejsResource('http://localhost:9200');
        var index = 'issues';
        var type = 'defect';
        
        // setup the indices and types to search across
        var request = ejs.Request()
            .indices(index)
            .types(type);

        $scope.currentUser = "";

        $scope.myWorkResults = request
                .query(ejs.QueryStringQuery('assignedTo:'+$scope.currentUser))
                .doSearch();

        $scope.issuePoolResults = request
          .query(ejs.QueryStringQuery('assignedTo:empty'))
          .doSearch();

        $scope.completedIssues = request
          .query(ejs.QueryStringQuery('status:closed'))
          .doSearch();
        
        // index the sample documents
        $scope.indexSampleDocs = function () {

          // our example documents
          var docs = [
            ejs.Document(index, type, '1').source({
              assignedTo: 'Lee', 
              description: 'Issue 0',
              status: 'open'}), 
            ejs.Document(index, type, '2').source({
              assignedTo: 'Lee', 
              description: 'Issue 1',
              status: 'open'}), 
            ejs.Document(index, type, '3').source({
              assignedTo: 'Rahman', 
              description: 'Issue 2',
              status: 'open'}), 
            ejs.Document(index, type, '4').source({
              assignedTo: 'Rahman', 
              description: 'Issue 3',
              status: 'open'}), 
            ejs.Document(index, type, '5').source({
              assignedTo: 'Rahman', 
              description: 'Issue 4',
              status: 'open'}), 
            ejs.Document(index, type, '6').source({
              assignedTo: 'Heath', 
              description: 'Issue 5',
              status: 'open'}), 
            ejs.Document(index, type, '7').source({
              assignedTo: 'Sean', 
              description: 'Issue 6',
              status: 'open'}), 
            ejs.Document(index, type, '8').source({
              assignedTo: 'Sean', 
              description: 'Issue 7',
              status: 'open'}), 
            ejs.Document(index, type, '9').source({
              assignedTo: 'Vipin', 
              description: 'Issue 8',
              status: 'open'}), 
            ejs.Document(index, type, '10').source({
              assignedTo: 'Raj', 
              description: 'Issue 9',
              status: 'open'}),
            ejs.Document(index, type, '11').source({
              assignedTo: 'empty',
              description: 'Issue 10',
              status: 'open'}), 
            ejs.Document(index, type, '12').source({
              assignedTo: 'empty',
              description: 'Issue 11',
              status: 'open'})
        	  
          ];

          // so search is only executed after all documents have been indexed
          var doSearch = _.after(docs.length, $scope.search);
          _.each(docs, function (doc) {
            doc.refresh(true).doIndex(doSearch);
          });
        };

        $scope.createOpts = {
          backdrop: true,
          keyboard: true,
          backdropClick: true,
          templateUrl:  'partials/createIssueTemplate.html', 
          controller: 'CreateDialogCtrl'
        };

        $scope.editOpts = {
          backdrop: true,
          keyboard: true,
          backdropClick: true,
          templateUrl:  'partials/editIssueTemplate.html', 
          controller: 'EditDialogCtrl',
          resolve: {
            description: function() {return $scope.description},
            assignedTo: function() {return $scope.assignedTo},
            status: function() {return $scope.status},
            id: function() {return $scope.id}
          }
        };

        $scope.createIssue = function(){
          var d = $dialog.dialog($scope.createOpts);
          d.open().then(function(description){
            if(description)
            {
              var doc = ejs.Document("issues", "defect").source({
              assignedTo: 'empty', 
              description: description,
              status: 'open'});

              doc.refresh(true).doIndex(function() {
                $scope.issuePoolResults = request
                .query(ejs.QueryStringQuery('assignedTo:empty'))
                .doSearch();
              });
            }
          });
        };

        $scope.editIssue = function(issue) {

            $scope.description = issue._source.description;
            $scope.assignedTo = issue._source.assignedTo;
            $scope.status = issue._source.status;
            $scope.id = issue._id;

            var d = $dialog.dialog($scope.editOpts);
            d.open().then(function(obj){
            if(obj)
            {
              var id = obj[0];
              var assignedTo = obj[1];
              var status = obj[2];
              var description = obj[3];
            
              var doc = ejs.Document("issues", "defect", id).source({
              assignedTo: assignedTo, 
              description: description,
              status: status});

              doc.refresh(true).doUpdate(function() {
                $scope.issuePoolResults = request
                .query(ejs.QueryStringQuery('assignedTo:empty'))
                .doSearch();

                $scope.myWorkResults = request
                .query(ejs.QueryStringQuery('assignedTo:'+$scope.currentUser))
                .doSearch();
              });
            }
          });

        };

        $scope.$watch('currentUser', function() {
          $scope.myWorkResults = request
                .query(ejs.QueryStringQuery('assignedTo:'+$scope.currentUser))
                .doSearch();

        });

    });

function CreateDialogCtrl($scope, dialog){
  $scope.close = function(description){
    dialog.close(description);
  };
}

function EditDialogCtrl($scope, dialog, description, assignedTo, status, id){
  
  $scope.description = description;
  $scope.assignedTo = assignedTo;
  $scope.status = status;
  $scope.id = id;

  $scope.close = function(id, assignedTo, status, description){

    var retObj = [id, assignedTo, status, description];

    dialog.close(retObj);
  };
}

