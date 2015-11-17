var app=angular.module('adminPanelApp');
app.controller('LoginModalController',function ($scope, $modalInstance,$rootScope,$http,User, api, Messages, $timeout, AllPatients) {

    /**
  * @ngdoc controller
  * @name AdminPanel.controller:loginModalController
  * @requires $http
  * @requires $rootScope
  * @requires $modalInstance
  * @description
  * Controller for the login modal.
  */
    $rootScope.alerts={};
    $rootScope.user= {};
    // This object containts superuser credentials
    $rootScope.user.users =
    {
      root :"service"
    };

    $rootScope.login = function (username,password)
    {
      /**
     * @ngdoc method
     * @name login
     * @methodOf AdminPanel.controller:loginModalController
     * @description
     * Logs the user in instantly if the super user credentials are used. For other users it will authenticate them using the admin table in MySQL and saves admin's information to $rootScope.
     * @param {String} username username specified by the user.
     * @param {String} password password specified by the user.
     * @returns {Object} $rootScope.Admin
     */


      // Authentication for superuser
      if (username==="root" && $rootScope.user.users[username]===password)
        {
          $rootScope.alerts["LoginAlert"]={};
          $modalInstance.close(username);
        }
      // Authentication for normal users
      else if (typeof username !== 'undefined' )
      {
        $http.get("http://localhost:8888/qplus/AdminPanel-MySQLDB-NodeListener-Docs/php/Authenticate.php?Username='"+username+"'&Password="+password).success( function (response)
        {
          console.log(response);

          if ( response.AdminSerNum ||response.DoctorSerNum)
          {
            $rootScope.alerts["LoginAlert"]={};
            response.Username=username;
            User.setUserFields(response,username,password);
            User.getNumberOfPatientsForUserFromServer().then(function(data){
              $rootScope.loggedin=true;
              $rootScope.TotalNumberOfPatients=data.data[0].TotalNumberOfPatients;
              User.setNumberOfDoctorPatients(data.data[1].TotalNumberOfDoctorPatients);
              $rootScope.TotalNumberOfDoctorPatients=User.getNumberOfDoctorPatients();
              api.getAllPatients().then(function(result){
                AllPatients.setPatients(result);
                Messages.getMessagesFromServer().then(function(messagesFromService){
                Messages.setMessages(messagesFromService);
              });
            });

            });
            $modalInstance.close(response);
            if(User.getUserFields().UserRole=='Admin'){
              $rootScope.admin=true;
            }else {
              $timeout(function(){
                $rootScope.admin=false;
              })

            }

          }
          else if (response =="Invalid Password")
          {
            console.log('asdas2');
            $rootScope.alerts["LoginAlert"]={};
            $rootScope.alerts["LoginAlert"].type="danger";
            $rootScope.alerts["LoginAlert"].message="Password entered does not much the records";
          }
          else if ( response == "UserNotFound")
          {
            console.log('asdas3');
            $rootScope.alerts["LoginAlert"]={};
            $rootScope.alerts["LoginAlert"].type="danger";
            $rootScope.alerts["LoginAlert"].message="Username does not exist!";
          }
        });
      }
      else
      {
        $rootScope.alerts["LoginAlert"]={};
        $rootScope.alerts["LoginAlert"].type="danger";
        $rootScope.alerts["LoginAlert"].message="Credentials are not valid!";
      }
    };

    $rootScope.cancel = function ()
    {
      /**
     * @ngdoc method
     * @name cancel
     * @methodOf AdminPanel.controller:loginModalController
     * @description
     * Cancels login and closes the modal.
     */
      $modalInstance.dismiss('cancel');
    };
});
