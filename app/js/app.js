var angularDemosApp = angular.module('angularDemosApp', [
	'ngRoute', 
	'controllers', 
	'filters', 
	'services',
	'directives',
	'ui.bootstrap'
	]);

var controllers = angular.module('controllers', []);
var services = angular.module('services', ['ngResource']);
var filters = angular.module('filters', []);
var directives = angular.module('directives', []);


angularDemosApp.config(['$routeProvider', function($routeProvider) {
	return $routeProvider.
	when('/', {
		templateUrl: "templates/home/index.html",
		controller: 'HomeController'
	})
	.when('/webgl', {
		templateUrl: "templates/maps/index.html",
	})
	.when('/code', {
		templateUrl: "templates/home/index.html",
	})
	.otherwise({
		redirectTo: '/'
	});
}]);