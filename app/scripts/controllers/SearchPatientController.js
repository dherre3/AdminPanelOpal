var app=angular.module('adminPanelApp');
app.controller('SearchPatientController',function ($rootScope, $log,$http,$scope) {
	
	$scope.findPatient=function(){
		   var patientURL="http://localhost:8888/qplus/AdminPanel-MySQLDB-NodeListener-Docs/php/MySQLFind.php?";
	      var doctorURL="http://localhost:8888/qplus/AdminPanel-MySQLDB-NodeListener-Docs/php/GetDoctors.php?";
	      var activityURL="http://localhost:8888/qplus/AdminPanel-MySQLDB-NodeListener-Docs/php/GetActivities.php?";
	      var appointmentURL="http://localhost:8888/qplus/AdminPanel-MySQLDB-NodeListener-Docs/php/GetAppointments.php?";
	      if ($scope.LastName)
	      {
	        patientURL=patientURL+"LastName='"+$scope.LastName +"'&";
	        doctorURL=doctorURL+"LastName='"+$scope.LastName +"'&";
	        activityURL=activityURL+"LastName='"+$scope.LastName +"'&";
	        appointmentURL=appointmentURL+"LastName='"+$scope.LastName +"'&";
	      }
	      if ($scope.PatientId)
	      {
	        patientURL=patientURL+"PatientId='"+$scope.PatientId+"'&";
	        doctorURL=doctorURL+"PatientId='"+$scope.PatientId+"'&";
	        activityURL=activityURL+"PatientId='"+$scope.PatientId +"'&";
	        appointmentURL=appointmentURL+"PatientId='"+$scope.PatientId +"'&";
	      }
    	$http.get(patientURL).success( function (response){
    		if(typeof response[0].LastName!== 'undefined'){
    			console.log(response);
    			$scope.alert={message:'Patient Found: '+ response[0].FirstName +" "+ response[0].LastName,
    				type:'success'};
    			$scope.patientFound=true;
    			$scope.patient=response[0];
    		}else if(response='PatientNotFound'){
    			$scope.alert={message:'Patient Not Found!',
    				type:'danger'};

    		}
   		});
	}
});