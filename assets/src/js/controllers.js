'use strict';

/* Controllers */

angular.module('CI.controllers', [])
    .controller('ConfigController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
        $scope.item = {
            config : {
                language : "nodejs",
                timeout : 99999999
            },
            reposity : {
                uri : "https://github.com/mishoo/UglifyJS2.git",
                name : "UglifyJS2"
            },
            payload : {
                commands : "npm update\nnpm test"
            }
        };
        $scope.buildId = undefined;
        $scope.build = function (item) {
            item.payload.commands = item.payload.commands.split("\n");
            $http.post('/dashboard', {item: item}).success(function (data, status, headers, config) {
                $location.path('/build/' + data.id);
            }).error(function (data, status, headers, config) {
                $scope.error = data;
            });
        };
    }])
    .controller('BuildResultController', ['$scope', '$routeParams', 'iosocket','$sce', function ($scope, $routeParams, iosocket,$sce) {

        $scope.buildId = $routeParams.buildid;
        $scope.lines = [];
        iosocket.emit("build.feed", {
            id: $scope.buildId,
            repo_uri: $scope.repo_uri
        });
        iosocket.on('channel_' + $scope.buildId, function (data) {
            var splited = data.message.split("\r\r");
            if (splited.length > 1) {
                console.log("splited");
            }
            if (/^\r[^\r]/.test(data.message) && !/^\r\n/.test(data.message)) {
                console.log("pop");
                $scope.lines.pop();
            }
            $scope.lines.push(data.message);
        });
    }]);