
var app=angular.module('adminPanelApp');
app.controller('ListAllPatientsController',function (api,$scope,Patient,$state) {

	var patients=api.getAllPatients();
	patients.then(function(patients,error){
		console.log('error');
		console.log(error);
		$scope.patients=patients;	
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

});