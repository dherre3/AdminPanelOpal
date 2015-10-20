var app=angular.module('adminPanelApp');

app.service('api',function ($rootScope, $http,$q) {
  return{
  	getAllFields:function(patientTable, fieldSearchType, value){
      var patientURL="http://localhost:8888/qplus/AdminPanel-MySQLDB-NodeListener-Docs/php/MySQLFind.php?";
      var doctorURL="http://localhost:8888/qplus/AdminPanel-MySQLDB-NodeListener-Docs/php/GetDoctors.php?";
      var activityURL="http://localhost:8888/qplus/AdminPanel-MySQLDB-NodeListener-Docs/php/GetActivities.php?";
      var appointmentURL="http://localhost:8888/qplus/AdminPanel-MySQLDB-NodeListener-Docs/php/GetAppointments.php?";
      var searchQuery='';
      if (fieldSearchType=='lastname')
      {
        patientURL=patientURL+"LastName='"+value +"'&";
        doctorURL=doctorURL+"LastName='"+value+"'&";
        activityURL=activityURL+"LastName='"+value+"'&";
        appointmentURL=appointmentURL+"LastName='"+value +"'&";
      }else if(fieldSearchType=='patientId'){
        patientURL=patientURL+"PatientId='"+value+"'&";
        doctorURL=doctorURL+"PatientId='"+value+"'&";
        activityURL=activityURL+"PatientId='"+value +"'&";
        appointmentURL=appointmentURL+"PatientId='"+value+"'&";
      }
      if(patientTable=='patient'){
        searchQuery=patientURL;
      }else if(patientTable=='doctor'){
        searchQuery=doctorURL;
      }else if(patientTable=='activity'){
        searchQuery=activityURL;
      }else if(patientTable=='appointments'){
         searchQuery=appointmentURL;
      }

      $http.get(searchQuery).success( function (response){
        if(typeof response[0].LastName!== 'undefined'){
          return response[0];
        }else if(response='PatientNotFound'){
          return {message:'Patient Not Found!',
            type:'danger'};

        }
      });
    },
    getAllPatients:function(){

    	var r=$q.defer();
    	var userDoctor=$rootScope.currentUser.DoctorSerNum;
    	var userAdmin=$rootScope.currentUser.AdminSerNum;
    	var patientsURL='';
      if(userDoctor){
       	patientsURL="http://localhost:8888/qplus/AdminPanel-MySQLDB-NodeListener-Docs/php/getAllPatients.php?DoctorSerNum="+userDoctor;
       }else if(userAdmin){
       	 patientsURL="http://localhost:8888/qplus/AdminPanel-MySQLDB-NodeListener-Docs/php/getAllPatients.php?AdminSerNum="+userAdmin;
       	console.log(patientsURL);
       }
      $http.get(patientsURL).success( function (response){

        if(typeof response[0].LastName!== 'undefined'){
   			console.log(response);
          r.resolve(response);

        }else if(response='No users!!'){
          r.reject({message:'Doctor has no patients using the app!',
            type:'alert-warning'});

        }else{
        	console.log('error');
        	r.reject('error');
        }
      });
      return r.promise;
    }
  }
});
app.service('AllPatients',function(api,$q){
  return{
    setPatients:function(patients)
    {
      this.Patients=patients;
    },
    getPatients:function()
    {
      return this.Patients;

    },
    findPatient:function(serNum){
      if(this.Patients!='No Users!'){

        for (key in this.Patients){

          if(this.Patients[key].PatientSerNum==serNum)
          {
            return this.Patients[key];
          }else{
            return 'No Users!'
          }
        };
      }else{
        return 'No Users!';
      }

    }
  };

});

  app.service('Patient',function(){
    return{
      setPatient:function(patient){
        this.Patient=patient;
      },
      getPatient:function(){
        return this.Patient;
      }

    };
  });
app.service('User',function(){
  return{
    setUserRole:function(role){
      this.UserRole=role;
    },
    getUserRole:function(){
      return this.UserRole;
    },
    setUserSerNum:function(serNum){
      this.UserSerNum=serNum;
    },
    getUserSerNum:function()
    {
      return this.UserSerNum;
    },
    setUserFirstName:function(username)
    {
      this.FirstName=username;
    },
    getUserFirstName:function(){
      return this.FirstName;
    },
    setUserLastName:function(lastname){
      this.LastName=lastname;
    },
    getUserLastName:function(){
      return this.LastName;
    },
    setUserFields:function(fields){

      this.UserFields={};
      this.FirstName=fields.FirstName;
      this.LastName=fields.LastName;
      this.Email=fields.Email;

      if(fields.DoctorSerNum){
        this.UserSerNum=fields.DoctorSerNum;
        this.DoctorAriaSer=fields.DoctorAriaSer;
        this.UserRole='Doctor';
        this.UserFields.UserRole='Doctor';
        this.UserFields.UserSerNum=fields.DoctorSerNum;
        this.Image=fields.Image;
      }else{
        this.UserSerNum=fields.AdminSerNum;
        this.UserFields.UserSerNum=fields.AdminSerNum;
        this.UserRole='Admin';
        this.UserFields.UserRole='Admin';
        this.Image='Admin image to be added';
      }
      this.Phone=fields.Phone;
      this.UserFields={
        FirstName:fields.FirstName,
        LastName:fields.LastName,
        Email:fields.Email,
        DoctorAriaSer:fields.DoctorAriaSer,
        Image:fields.Image,
        Phone:fields.Phone,
      };
    },
    getUserFields:function()
    {
      return this.UserFields;
    }
  };
});
 app.service('Messages',function($http, $q, $rootScope,$filter,AllPatients, User,URLs){
   function findPatientConversationIndexBySerNum(array,serNum){
      for (var i = 0; i < array.length; i++) {
        if(array.PatientSerNum==serNum){
          return i;
        }
      }
    }
 	return{
 		getMessagesFromServer:function(){
 			var r=$q.defer();
 			var userDoctor=$rootScope.currentUser.DoctorSerNum;
    		var userAdmin=$rootScope.currentUser.AdminSerNum;
    		patientsURL='';
    		if(userDoctor){
		       	patientsURL=URLs.getMessagesUrl()+"?DoctorSerNum="+userDoctor;
            console.log(patientsURL);
		    }else if(userAdmin){
		       	patientsURL=URLs.getMessagesUrl()+"?AdminSerNum="+userAdmin;
		       	console.log(patientsURL);
		    }
	 		$http.get(patientsURL).success(function(response)
	      	{
	        if (response == 'No Users!')
	        {
            console.log(response);
            r.resolve('No Messages Found');

	         }else if(response=='No parameters set!'){
            console.log(response);
            r.reject('Incorrect Parameters');
	         }else{
            r.resolve(response);
           }
	      });
      return r.promise;
    },
    setMessages:function (messages){
        var userDoctor=$rootScope.currentUser.DoctorSerNum;
        var userAdmin=$rootScope.currentUser.AdminSerNum;
        var userSerNum;
        var userRole;
        if(userDoctor){
          userSerNum=userDoctor;
          userRole='Doctor';
         }else if(userAdmin){
          userSerNum=userAdmin;
          userRole='Admin';
         }

        this.UserConversationsArray = [];
         $rootScope.NumberOfNewMessages=0;
         if (messages === undefined) return -1;
        //Iterating through each conversation
        this.ConversationsObject={};
        var keysArray = Object.keys(messages);
        var patients=AllPatients.getPatients();
        console.log(patients);
        for (var i = 0; i < patients.length; i++) {
            var conversation={}
            var partnerSerNum=patients[i].PatientSerNum;
            var key='Patient:'+partnerSerNum;
            console.log(key);
            console.log(patients[i]);
            conversation.PatientSerNum=partnerSerNum;
            conversation.ConversationPartnerFirstName=patients[i].FirstName;
            conversation.ConversationPartnerLastName=patients[i].LastName;
            conversation.Messages=[];
            conversation.DateOfLastMessage=null;
            conversation.EmptyConversation=true;
            conversation.ReadStatus=1;
            conversation.Role='Patient';
            conversation.PatientId=patients[i].PatientId;
            conversation.AriaSer=patients[i].PatientAriaSer;
            this.ConversationsObject[key]=conversation;
        };

        for (var i = 0; i < keysArray.length; i++) {
            var Message={};
            var message=messages[keysArray[i]];
            if(messages[i].ReceiverRole==userRole&&messages[i].ReceiverSerNum==userSerNum)
            {
              partnerSerNum=message.SenderSerNum;
              key=message.SenderRole+':'+message.SenderSerNum;
              console.log(key);
              Message.Role=0;
              Message.MessageContent=message.MessageContent;
              Message.Date=new Date(message.MessageDate);
              Message.ReadStatus=parseInt(message.ReceiverReadStatus);
              Message.MessageSerNum=message.MessageSerNum;
              this.ConversationsObject[key].EmptyConversation=false;
              this.ConversationsObject[key].Messages.push(Message);

            }else{
              partnerSerNum=message.ReceiverSerNum;
              key=message.ReceiverRole+':'+message.ReceiverSerNum;
              console.log(key);
              Message.Role=1;
              Message.MessageContent=message.MessageContent;
              Message.Date=new Date(message.MessageDate);
              Message.ReadStatus=1;
              Message.MessageSerNum=message.MessageSerNum;
              this.ConversationsObject[key].EmptyConversation=false;
              this.ConversationsObject[key].Messages.push(Message);
            }
        }
        var keysArrayConvo = Object.keys(this.ConversationsObject);
        for (var i = 0; i < keysArrayConvo.length; i++) {
            this.ConversationsObject[keysArrayConvo[i]].Messages=$filter('orderBy')(this.ConversationsObject[keysArrayConvo[i]].Messages,'Date',false);

            if(this.ConversationsObject[keysArrayConvo[i]].Messages[this.ConversationsObject[keysArrayConvo[i]].Messages.length-1]!==undefined){
                this.ConversationsObject[keysArrayConvo[i]].DateOfLastMessage=this.ConversationsObject[keysArrayConvo[i]].Messages[this.ConversationsObject[keysArrayConvo[i]].Messages.length-1].Date;
                this.ConversationsObject[keysArrayConvo[i]].ReadStatus=this.ConversationsObject[keysArrayConvo[i]].Messages[this.ConversationsObject[keysArrayConvo[i]].Messages.length-1].ReadStatus;
                if(this.ConversationsObject[keysArrayConvo[i]].ReadStatus===0){
                    $rootScope.NumberOfNewMessages+=1;
                }
            }
            this.UserConversationsArray.push(this.ConversationsObject[keysArrayConvo[i]]);


        };
        console.log(this.UserConversationsArray);

        return this.UserConversationsArray;


    },
    getMessages:function(){
        return this.UserConversationsArray;
    },
    sendMessage:function(content, patientSerNum, dateOfmessage){
      var r=$q.defer();
      var objectToSend={};
      objectToSend.MessageContent=content;
      objectToSend.MessageDate=$filter('date')(dateOfmessage,'yyyy-MM-dd HH:mm:ss');;
      objectToSend.ReceiverReadStatus=0;
      objectToSend.SenderRole=User.getUserRole();
      objectToSend.SenderSerNum=User.getUserSerNum();
      objectToSend.ReceiverRole='Patient';
      objectToSend.ReceiverSerNum=patientSerNum;
      objectMessage={};
      objectMessage.Role='1';
      objectMessage.Date=dateOfmessage;
      objectMessage.MessageContent=content;
      objectMessage.ReadStatus=1;
      var indexConvo=findPatientConversationIndexBySerNum(this.UserConversationsArray , patientSerNum);
      this.UserConversationsArray[indexConvo].Messages.push(objectMessage);
      var req = {
       method: 'POST',
       url: URLs.getSendMessageUrl(),
       headers: {
         'Content-Type': undefined
       },
       data: objectToSend
      }

      //$http(req).then(function(){...}, function(){...});
    }

};


 });
 app.service('URLs',function(){
   var basicURL='http://localhost:8888/qplus/AdminPanel-MySQLDB-NodeListener-Docs/php/';
   return{
     getBasicUrl:function(){
       return basicURL;
     },
     getSendMessageUrl:function(){
       return basicURL+'sendMessage.php';
     },
     getMessagesUrl:function(){
       return basicURL+'GetMessages.php';
     }
   };



 });
