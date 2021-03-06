'use strict';

/**
 * @ngdoc overview
 * @name adminPanelApp
 * @description
 * # adminPanelApp
 *
 * Main module of the application.
 */
var app=angular
  .module('adminPanelApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'ui.bootstrap',
    'luegg.directives'
  ]);
app.config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {
      $urlRouterProvider.otherwise("/");
  $stateProvider
    .state('home',{
      url:'/',
      templateUrl: 'views/main.html',
      controller: 'MainController',
      data:
      {
        requireLogin:true
      }
    })
    .state('registration',{
      url:'/registration',
      templateUrl:'views/registration.html',
      controller:'RegistrationController',
      data:{
        requireLogin:true
      }
    })
    .state('patients',{
      url:'/patients',
      templateUrl:'views/patients.html',
      controller:'PatientsController',
      abstract:true,
      data:{
        requireLogin:true
      }
    })
    .state('messages',{
      url:'/messages',
      templateUrl:'views/messages.html',
      controller:'MessagesController',
      data:{
        requireLogin:true
      }
    })
    .state('requests',{
      url:'/requests',
      templateUrl:'views/requests.html',
      controller:'RequestsController',
      data:{
        requireLogin:true
      }
    })
    .state('patients.search-patients',{
      url:'/search-patients',
      templateUrl:'templates/patients/search-patients.html',
      controller:'SearchPatientsController',
      data:{
        requireLogin:true
      }
    })
    .state('patients.patient',{
      url:'/patient',
      templateUrl:'templates/patients/individual-patient.html',
      controller:'IndividualPatientController',
      abstract:true,
      data:{
        requireLogin:true
      }
    })
    .state('patients.patient.general',{
      url:'/general',
      templateUrl:'templates/individual-patient/patient-general.html',
      controller:'GeneralPatientController',
      data:{
        requireLogin:true
      }
    })
    .state('patients.patient.doctors',{
      url:'/doctors',
      templateUrl:'templates/individual-patient/patient-doctors.html',
      controller:'DoctorsPatientController',
      data:{
        requireLogin:true
      }
    })
    .state('patients.patient.appointments',{
      url:'/appointments',
      templateUrl:'templates/individual-patient/patient-appointments.html',
      controller:'AppointmentsPatientController',
      data:{
        requireLogin:true
      }
    })
    .state('patients.patient.treatmentplan',{
      url:'/treatmentplan',
      templateUrl:'templates/individual-patient/patient-treatmentplan.html',
      controller:'TreatmentPlanPatientController',
      data:{
        requireLogin:true
      }
    })

    .state('patients.patient.documents',{
      url:'/documents',
      templateUrl:'templates/individual-patient/patient-documents.html',
      controller:'DocumentsPatientController',
      data:{
        requireLogin:true
      }
    })
     .state('patients.patient.messages',{
      url:'/messages',
      templateUrl:'templates/individual-patient/patient-messages.html',
      controller:'MessagesPatientController',
      data:{
        requireLogin:true
      }
    })
     .state('patients.patient.requests',{
      url:'/requests',
      templateUrl:'templates/individual-patient/patient-requests.html',
      controller:'RequestsPatientController',
      data:{
        requireLogin:true
      }
    })
    .state('account',{
      url:'/account',
      templateUrl: 'views/account.html',
      controller: 'AccountController',
      data:
      {
        requireLogin:true
      }
    })
  }]);
app.service('LoginModal', function ($rootScope,$uibModal)
{
  /**
  * @ngdoc service
  * @name AdminPanel.service:loginModal
  * @requires $rootScope
  * @requires $uibModal
  * @description
  * A service that opens a new login modal (also creates a promise) and sets the $rootScope.user variable when its closed(resolved). It will allow the user to use other panels besides the home view.
  */
  return function () {

        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: './views/login-modal.html',
          controller: 'LoginModalController',
          size: 'md'
        });
        return modalInstance.result.then(function (user){
          console.log(user);
          $rootScope.currentUser=user;
          var userLocalStorage=window.localStorage.getItem('OpalPanelUser');
          if(!userLocalStorage){
            window.localStorage.setItem('OpalPanelUser',JSON.stringify(user));
          }


        });
      };
  });

// RUN
app.run(function ($rootScope, $state,LoginModal,$timeout)
{
  $rootScope.activeClasses={};
  $rootScope.activeClasses['home']='active';
  $rootScope.activeClassesPatientMenu={};
  $rootScope.activeClassesPatientMenu['patient.patients.general']='active';

  /**
  * @ngdoc service
  * @name AdminPanel.service:run
  * @requires $rootScope
  * @requires $loginModal
  * @requires $state
  * @description
  * Sets an interceptor for the app. Whenever a state change happens if data.requireLogin is set to true for that state it will prevent the user from switching to that view and prompt them to log in. If authenticated, it will go the chosen state, goes to home view otherwise.
  */
  $state.go('home');
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams)
  {
    var requireLogin = toState.data.requireLogin;
    console.log(toState.name);
    setMenuClasses(toState.name);
    function makeOtherTabsInactive(menu, tabToActive){
      for (var tab in menu) {
        if(tab!==tabToActive)
        {
          menu[tab]='';
        }
      }
    }
    function setMenuClasses(tab){
      $timeout(function(){
        console.log(tab);
        var other=tab;
        console.log(other.split('.').length);
        if(other.split('.').length==3){
          $rootScope.activeClassesPatientMenu[tab]='active';
          makeOtherTabsInactive($rootScope.activeClassesPatientMenu,tab);
        }else{
          $rootScope.activeClasses[tab]='active';
          makeOtherTabsInactive($rootScope.activeClasses,tab);
        }

        /*
         if(tab=='home'){
            $rootScope.activeClasses=['active','','','',''];
          }else if(tab=='messages'){
            $rootScope.activeClasses=['','','active','',''];
          }else if(tab=='requests'){
            $rootScope.activeClasses=['','','','active',''];
          }else if(tab=='account'){
            $rootScope.activeClasses=['','','','','active'];
          }
          else if(tab=='patients.patient.general'){
            $rootScope.activeClassesPatientMenu=['active','','','','','',''];
          }else if(tab=='patients.patient.doctors'){
            $rootScope.activeClassesPatientMenu=['','active','','','','',''];
          }
          else if(tab=='patients.patient.appointments'){
            $rootScope.activeClassesPatientMenu=['','','active','','','',''];
          }
          else if(tab=='patients.patient.treatmentplan'){
            $rootScope.activeClassesPatientMenu=['','','','active','','',''];
          }
          else if(tab=='patients.patient.documents'){
            $rootScope.activeClassesPatientMenu=['','','','','active','',''];
          }
          else if(tab=='patients.patient.messages'){
            $rootScope.activeClassesPatientMenu=['','','','','','active',''];
          }
          else if(tab=='patients.patient.requests'){
            $rootScope.activeClassesPatientMenu=['','','','','','','active'];
          else if(tab=='patients.patient.')
          }else{
            $rootScope.activeClasses=['','active','','',''];
          }*/
      });


    }
    if (requireLogin && typeof $rootScope.currentUser === 'undefined')
    {
      event.preventDefault();
      LoginModal()
      .then(function () {
        setMenuClasses(toState.name);
        return $state.go(toState.name, toParams);
      })
      .catch(function ()
      {
        setMenuClasses('home');
        return $state.go('home');
      });

    }

  });


});
