'use strict';


controllers.controller('Parent', ['$scope', function($scope) {
	$scope.x= 5;
	$scope.y= 5;
}]);

controllers.controller('Child', ['$scope', function($scope) {
	$scope.modifyBothScopes= function() {
		$scope.$parent.x++;
	};
	$scope.modifyonlyChildscope= function() {
       // member "y" will be created in the child scope
       // So, after the following statment,  $scope.$parent.y++  will only increment the parent scope. It would not affect the child scope.
       $scope.y++;
   };
}]);


controllers.controller('ControllerA', ['$scope', 'myServiceA', function($scope, myServiceA) {
	$scope.x = 1;
	$scope.incrementDataInService= function() {
		myServiceA.increase();
	}     
	$scope.$on('XChanged', function(event, x) {
		$scope.x = x;
	});  
}]);

controllers.controller('ControllerB', ['$scope', 'myServiceA',function($scope, myServiceA) {
	$scope.x = 1;
	$scope.incrementDataInService= function() {
		myServiceA.increase();            
	}
	$scope.$on('XChanged', function(event, x) {
		$scope.x = x;
	});    
}]);


controllers.controller('ControllerC', ['$scope', 'myServiceB', function($scope, myServiceB) {
	$scope.x = 1;
	$scope.incrementDataInService= function() {
		myServiceB.increase();
	}
	$scope.syncDataWithService= function() {
		$scope.x = myServiceB.getX();
	}      
}]);

controllers.controller('ControllerD', ['$scope', 'myServiceB',function($scope, myServiceB) {
	$scope.x = 1;
	$scope.incrementDataInService= function() {
		myServiceB.increase();            
	}
	$scope.syncDataWithService= function() {
		$scope.x = myServiceB.getX();
	}   
}]);




controllers.controller('HomeController', ['$scope',function($scope) {

}]);