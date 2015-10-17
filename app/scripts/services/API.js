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
    	$http({
    		method:'POST',
    		url:"http://localhost:8888/qplus/AdminPanel/app/php/API.php",
    		data:{Request:'Messages',
    			objectToSend:{
    				method:'getMessages',
    				data:{Name:'David'}
    			}}
    		}).then(function(success){
    		console.log(success);
    	},function(error){
    		console.log(success);
    	});
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
      return patients;

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

 app.service('Messages',function($http, $q, $rootScope,$filter,AllPatients){
  function setMessages(messages){
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
      for (var i = 0; i < keysArray.length; i++) {
          var conversation={}
          var partnerSerNum;
          var key;
          var message=messages[keysArray[i]];
          if(message.ReceiverRole==userRole&&message.ReceiverSerNum==userSerNum)
          {
            partnerSerNum=message.SenderSerNum;
            
            key=message.SenderRole+':'+message.SenderSerNum;

          }else{
            partnerSerNum=message.ReceiverSerNum;
            key=message.ReceiverRole+':'+message.ReceiverSerNum;
          }
          var patient=AllPatients.findPatient(partnerSerNum);
          conversation.PatientSerNum=partnerSerNum;
          conversation.ConversationPartnerFirstName=patient.FirstName;
          conversation.ConversationPartnerLastName=patient.LastName;
          conversation.Messages=[];
          console.log(new Date(message.MessageDate));
          conversation.DateOfLastMessage=new Date(message.MessageDate);
          conversation.ReadStatus=message.ReceiverReadStatus;
          conversation.Role='Patient';
          conversation.PatientId=patient.PatientId;
          conversation.AriaSer=patient.PatientAriaSer;
          this.ConversationsObject[key]=conversation;
      };
     
      for (var i = 0; i < keysArray.length; i++) {
          var Message={};
          var message=messages[keysArray[i]];
          if(messages[i].ReceiverRole==userRole&&messages[i].ReceiverSerNum==userSerNum)
          {
            partnerSerNum=message.SenderSerNum;
            key=message.SenderRole+':'+message.SenderSerNum;
            Message.Role='0';
            Message.MessageContent=message.MessageContent;
            Message.Date=new Date(message.MessageDate);
            Message.ReadStatus=parseInt(message.ReceiverReadStatus);
            Message.MessageSerNum=message.MessageSerNum;  
            this.ConversationsObject[key].Messages.push(Message);

          }else{
            partnerSerNum=message.ReceiverSerNum;
            key=message.ReceiverRole+':'+message.ReceiverSerNum;
            Message.Role='1';
            Message.MessageContent=message.MessageContent;
            Message.Date=new Date(message.MessageDate);
            Message.ReadStatus=1;
            Message.MessageSerNum=message.MessageSerNum;  
            this.ConversationsObject[key].Messages.push(Message);
          }
      }
      var keysArrayConvo = Object.keys(this.ConversationsObject);
      for (var i = 0; i < keysArrayConvo.length; i++) {
          this.ConversationsObject[keysArrayConvo[i]].Messages=$filter('orderBy')(this.ConversationsObject[keysArrayConvo[i]].Messages,'Date',false);
          console.log(this.ConversationsObject[keysArrayConvo[i]].Messages);
          if(this.ConversationsObject[keysArrayConvo[i]].Messages[this.ConversationsObject[keysArrayConvo[i]].Messages.length-1]!==undefined){
              this.ConversationsObject[keysArrayConvo[i]].DateOfLastMessage=this.ConversationsObject[keysArrayConvo[i]].Messages[this.ConversationsObject[keysArrayConvo[i]].Messages.length-1].Date;
              this.ConversationsObject[keysArrayConvo[i]].ReadStatus=this.ConversationsObject[keysArrayConvo[i]].Messages[this.ConversationsObject[keysArrayConvo[i]].Messages.length-1].ReadStatus;
              if(this.ConversationsObject[keysArrayConvo[i]].ReadStatus===0){
                  $rootScope.NumberOfNewMessages+=1;
              }
          }
          this.UserConversationsArray.push(this.ConversationsObject[keysArrayConvo[i]]);

          
      };

      return this.UserConversationsArray;
        
 
  }
 	return{
 		getMessages:function(){
 			var r=$q.defer();
 			var userDoctor=$rootScope.currentUser.DoctorSerNum;
    		var userAdmin=$rootScope.currentUser.AdminSerNum;
    		patientsURL='';
    		if(userDoctor){
		       	patientsURL="http://localhost:8888/qplus/AdminPanel-MySQLDB-NodeListener-Docs/php/GetMessages.php?DoctorSerNum="+userDoctor;
            console.log(patientsURL);
		    }else if(userAdmin){
		       	patientsURL="http://localhost:8888/qplus/AdminPanel-MySQLDB-NodeListener-Docs/php/GetMessages.php?AdminSerNum="+userAdmin;
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
            r.resolve(setMessages(response));
           }
	      });
      return r.promise;
 			}


 		}



 });
