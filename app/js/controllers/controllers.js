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


controllers.controller('DatepickerDemoCtrl', function ($scope) {
	$scope.today = function() {
		$scope.dt = new Date();
	};
	$scope.today();

	$scope.clear = function () {
		$scope.dt = null;
	};

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
  	return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
  	$scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function($event) {
  	$event.preventDefault();
  	$event.stopPropagation();

  	$scope.opened = true;
  };

  $scope.dateOptions = {
  	formatYear: 'yy',
  	startingDay: 1
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
});


controllers.controller('PopoverDemoCtrl', function ($scope) {
  $scope.dynamicPopover = 'Hello, World!';
  $scope.dynamicPopoverTitle = 'Title';
});
