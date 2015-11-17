var app=angular.module('adminPanelApp');
app.controller('SearchController',function ($rootScope, $log,$http,$scope, $state, Patient) {

	$scope.findPatient=function(){
		   var patientURL="http://localhost:8888/qplus/AdminPanel-MySQLDB-NodeListener-Docs/php/MySQLFind.php?";
	      if ($scope.LastName)
	      {
	        patientURL=patientURL+"LastName="+$scope.LastName +"&";
	      }
	      if ($scope.PatientId)
	      {
	        patientURL=patientURL+"PatientId="+$scope.PatientId+"&";
	      }
    	$http.get(patientURL).success( function (response){
				console.log(response);
    		if(typeof response[0].LastName!== 'undefined'){
    			console.log(response);
    			$scope.alert={message:'Patient Found: '+ response[0].FirstName +" "+ response[0].LastName,
    				type:'success'};

    			$scope.patientFound=true;
    			$scope.patients=response;
    		}else if(response='PatientNotFound'){
    			$scope.alert={message:'Patient Not Found!',
    				type:'danger'};
						$scope.patients=[];
						$scope.patientFound=false;

    		}
   		});

   		$scope.goToPatient=function(patient)
   		{
   			Patient.setPatient(patient);

   			var patientLocal=Patient.getPatient();
   			console.log(patientLocal);
   			objectToLocalStorage={"UserName":patientLocal.LoginID, "Password":patientLocal.Password,"Expires":0,"Email":patientLocal.Email};

   			window.localStorage.setItem('UserAuthorizationInfo',JSON.stringify(objectToLocalStorage));
   			$state.go('patients.patient.general');




   		};
	}
});
