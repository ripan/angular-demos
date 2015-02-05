var angularDemosApp = angular.module('angularDemosApp', [
	'ngRoute', 
	'controllers', 
	'filters', 
	'services',
	'directives',
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
	.otherwise({
		redirectTo: '/'
	});
}]);