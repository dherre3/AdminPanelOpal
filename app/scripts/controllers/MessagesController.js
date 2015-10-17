app.controller('MessagesController',function ($scope, Messages,api,AllPatients,$timeout,$rootScope) {
	var messages=[];
	var userDoctor=$rootScope.currentUser.DoctorSerNum;
   	var userAdmin=$rootScope.currentUser.AdminSerNum;
   	if(userDoctor){
   		$scope.user=$rootScope.currentUser.FirstName + ' ' + $rootScope.currentUser.LastName;
   	}else if(userAdmin){
   		$scope.user=$rootScope.currentUser.FirstName + ' ' + $rootScope.currentUser.LastName;
   	}


api.getAllPatients().then(function(result){
	AllPatients.setPatients(result);
	Messages.getMessages().then(function(messagesFromService){
	console.log(messagesFromService);
	$timeout(function(){
		$scope.chat=messagesFromService;
		$scope.conversation=$scope.chat[0].Messages;
	});
 });	
});

$scope.sendMessage=function(){

}
 


});