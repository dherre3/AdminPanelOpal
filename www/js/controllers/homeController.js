//
//  Created by David Herrera on 2015-05-04.
//  Copyright (c) 2015 David Herrera. All rights reserved.
//
/**
*@ngdoc controller
*@name MUHCApp.controller:HomeController
*@scope
*@requires $scope
*@requires $timeout
*@requires $filter
*@requires $cordovaNetwork
*@requires MUHCApp.services.Patient
*@requires MUHCApp.services.UpdateUI
*@requires MUHCApp.services.UserPlanWorkflow
*@element textarea
*@description
*Manages the logic of the home screen after log in, instatiates
*/
var myApp = angular.module('MUHCApp');
myApp.controller('HomeController', ['$state','Appointments', '$scope','Patient','UpdateUI', '$timeout','$filter','$cordovaNetwork','UserPlanWorkflow','$rootScope', 'tmhDynamicLocale','$translate', '$translatePartialLoader', 'RequestToServer', function ($state,Appointments, $scope, Patient,UpdateUI,$timeout,$filter,$cordovaNetwork,UserPlanWorkflow, $rootScope,tmhDynamicLocale, $translate, $translatePartialLoader, RequestToServer) {
       /**
        * @ngdoc method
        * @name load
        * @methodOf MUHCApp.controller:HomeController
        * @callback MUHCApp.controller:HomeController.loadInfo
        * @description
        * Pull to refresh functionality, calls {@link MUHCApp.service:UpdateUI} service through the callback to update all the fields, then using
        * the {@link MUHCApp.service:UpdateUI} callback it updates the scope of the HomeController.
        *
        *
        */
        function homePageInit(){
        $scope.dateToday=new Date();
        var date;
        var nextAppointment=Appointments.getNextAppointment();
        var lastAppointment=Appointments.getLastAppointmentCompleted();
        if(nextAppointment.Index!=-1){
            $scope.noAppointments=false;
            $scope.appointmentShown=nextAppointment.Object;
            $scope.titleAppointmentsHome='Next Appointment';
            date=nextAppointment.Object.ScheduledStartTime;
            var dateDay=date.getDate();
            var dateMonth=date.getMonth();
            var dateYear=date.getFullYear();

            if(dateMonth==$scope.dateToday.getMonth()&&dateDay==$scope.dateToday.getDate()&&dateYear==$scope.dateToday.getFullYear()){
                console.log('asdas');
                $scope.nextAppointmentIsToday=true;
            }else{
                console.log('notToday');
                $scope.nextAppointmentIsToday=false;
            }
        }else if(lastAppointment!=-1){
          $scope.nextAppointmentIsToday=false;
          $scope.appointmentShown=lastAppointment;
          $scope.titleAppointmentsHome='Last Appointment';
        }
        else{
            $scope.noAppointments=true;
        }
        $scope.Email=Patient.getEmail();
        $scope.FirstName = Patient.getFirstName();
        $scope.LastName = Patient.getLastName();
        $scope.ProfileImage=Patient.getProfileImage();
        $scope.Status=Patient.getStatus();
    }
        homePageInit();
        $scope.load = function($done) {

          $timeout(function() {
            loadInfo();
                $done();
          }, 1000);
        };

        function loadInfo(){
          RequestToServer.sendRequest('Refresh');
           var dataVal= UpdateUI.UpdateUserFields();
           dataVal.then(function(data){
                $timeout(function(){
                   homePageInit();

                });
        });
       }
//Sets all the variables in the view.

}]);


myApp.controller('WelcomeHomeController',function($scope,Patient){
    $scope.FirstName = Patient.getFirstName();
    $scope.LastName = Patient.getLastName();
    $scope.welcomeMessage="We are happy to please you with some quality service";
});
