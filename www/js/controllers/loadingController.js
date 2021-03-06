//
//  Created by David Herrera on 2015-05-04.
//  Copyright (c) 2015 David Herrera. All rights reserved.
//
angular.module('MUHCApp').controller('LoadingController', ['$rootScope','$state', '$scope','UpdateUI', 'UserAuthorizationInfo','UserPreferences', '$q','Patient', 'Messages', function ($rootScope,$state, $scope, UpdateUI, UserAuthorizationInfo, UserPreferences, $q, Patient, Messages) {
		console.log('Im doing it');
		modal.show();
	    var updateUI=UpdateUI.UpdateUserFields();
	    updateUI.then(function(){
	    	$rootScope.refresh=true;
        	modal.hide();
	        $state.go('Home');

	    });
	    setTimeout(function() {
	    	if(typeof Messages.getUserMessages()=='undefined'||Messages.getUserMessages().length==0){
	    		$state.go('logIn');
	    	}
	    }, 10000);

}]);
