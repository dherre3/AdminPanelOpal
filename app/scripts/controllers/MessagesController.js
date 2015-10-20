app.controller('MessagesController',function ($scope, Messages,api,AllPatients,$timeout,$rootScope,User) {
	var messages=[];

  $scope.user=User.getUserFirstName() + ' ' + User.getUserLastName();
		refreshConversations();
		function refreshConversations(){
			$scope.glue=true;
			api.getAllPatients().then(function(result){
				AllPatients.setPatients(result);
				Messages.getMessagesFromServer().then(function(messagesFromService){
				Messages.setMessages(messagesFromService);
				$timeout(function(){
					$scope.selectedIndex=0;
					$scope.chat=Messages.getMessages();
					$scope.conversation=$scope.chat[0].Messages;
					$scope.chat[0].ReadStatus=1;
					$scope.NumberOfNewMessages=0;
				});
			 });
			});
		};

$scope.goToConversation=function(index)
{
	$timeout(function(){
		$scope.selectedIndex=index;
		$scope.conversation=$scope.chat[index].Messages;
		$scope.conversation.ReadStatus=1;
	});
}
$scope.sendMessage=function(index){

	var messageToSend={};
	console.log(Messages.getMessages());
 var messageDate=new Date();
 Messages.sendMessage($scope.newMessage, $scope.conversation.PatientSerNum, messageDate);
 $scope.newMessage='';

};



});
