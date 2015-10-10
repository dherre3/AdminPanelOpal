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
    'ui.bootstrap'
  ]);
app.config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {
      $urlRouterProvider.otherwise("/");
  $stateProvider
    .state('home',{
      url:'/',
      templateUrl: 'views/main.html',
      controller: 'MainCtrl',
      data:
      {
        requireLogin:true
      }
    })
    .state('patients',{
      url:'/patients',
      templateUrl:'views/patients.html',
      controller:'PatientsController',
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
          $rootScope.currentUser=user ;

        });
      };
  });

// RUN
app.run(function ($rootScope, $state,LoginModal,$timeout)
{
  $rootScope.activeClasses=['active','','','','']
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
    setMenuClasses(toState.name);
    function setMenuClasses(tab){
      $timeout(function(){
        console.log(tab);
         if(tab=='home'){
            $rootScope.activeClasses=['active','','','',''];
          }else if(tab=='messages'){
            $rootScope.activeClasses=['','','active','',''];
          }else if(tab=='requests'){
            $rootScope.activeClasses=['','','','active',''];
          }else if(tab=='account'){
            $rootScope.activeClasses=['','','','','active'];
          }else{
            $rootScope.activeClasses=['','active','','',''];
          }



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




  /*.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });*/
