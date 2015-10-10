var app=angular.module('adminPanelApp');
app.service('php',function ($rootScope) {
	this.pathSQL="http://localhost:8888/qplus/AdminPanel-MySQLDB-NodeListener-Docs/php/";

  return
  {
  	findUserByLastName:function(lastname)
  	{


  	},
  	setPathSQL:function(path)
  	{
  		this.pathSQL=path;
  	},
  	getPathSQL:function()
  	{
  		return this.pathSQL;
  	}





  };

});