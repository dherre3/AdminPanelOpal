var app=angular.module('adminPanelApp');
app.filter('dateEmail',function($filter){
  return function(date){
    var day=date.getDate();
    var month=date.getMonth();
    var year=date.getFullYear();
    var newDate=new Date();
    if(newDate.getMonth()==month&&newDate.getFullYear()==year)
    {
      if(day==newDate.getDate())
      {
        return $filter('date')(date, 'h:mma');
      }else if(day-newDate.getDate()==1){
        return 'Yesterday';
      }else{
        return $filter('date')(date, 'dd/MM/yyyy'); 
      }
    }else{
      return $filter('date')(date, 'dd/MM/yyyy'); 
    }




  };
});