function radField(fieldName){
  var options = {};
  var totalMonths = "";
  var totalRows= "";
  var currentMonth = "";
  options.fieldId = fieldName;
  eFormHelper.getFieldValue(options,function(results){
    if(results.isSuccess){
    var monthRows = results.data.split(',');
      currentMonth = results.data;
      totalMonths = monthRows;
      totalRows = monthRows.length + 1
    }
  else(
  console.log('vegas light')
  )
  })
    return [currentMonth,totalRows]
}

function getRange(check_date)
  {
      var count = countRows('SubFormMCInfo_SubForm/SubFormMCInfo/StartDateHUSInfo');
      
      var all_dates = [];
      for (var i = 1; i <= count; i++)
      {
       
          var startdate = radField('SubFormMCInfo/StartDateHUSInfo: [' + i +']')[0];
          var enddate = radField('SubFormMCInfo/EndDateHUSInfo: [' + i +']')[0];
  
          all_dates.push(startdate);
          all_dates.push(enddate);
          
      }
  
      orderedDates = all_dates.sort(function(a,b){
          return Date.parse(a) > Date.parse(b);
      });
  
      var earliest = Date.parse(orderedDates[0]);
      var latest = Date.parse(orderedDates[count]);
  
      var input = check_date.value;
      input = input.split("/").reverse().join("-");
      input = Date.parse(input);
      console.log("input "+ input + "/ range " + earliest +"-"+latest);
  
      if(input >= earliest && input <= latest)
      {
          console.log("in range");
      }else
      {
          alert("Date range is not same as Medical Certification Information");
          check_date.value = "";
          console.log("not in range");
      }
  
  }
