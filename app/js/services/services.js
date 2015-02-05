'use strict';

services.service('myServiceA',  function ($rootScope) {
	var x=5 ;
	return {
		increase : function() {
			x++;
			$rootScope.$broadcast('XChanged', x);
		}
	};
})


services.service('myServiceB', function () {
	var x=5 ;
	return {
		increase : function() {
			x++;
		},
		getX : function() {
			return x;
		}
	};
})