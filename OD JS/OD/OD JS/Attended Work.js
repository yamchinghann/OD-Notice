/*
 * JQuery WYSIWYG Web Form Designer
 * Copyright 2015 AgilePoint Inc
 */

/* Add your JS code Here (Press Ctrl+Space keys for intellisense) */


function getValue (event) {
  
var options = {};
  options.fieldId = 'SubForm1/IsStartDateMoreThanAccidentDate' ;
eFormHelper.getFieldValue (options, function (result) 
  { 
    console.log('start');
    console.log(result.data);
    var mcValue = result.data;
    var attendedWork = {};
    attendedWork.fieldId = 'AttendedWorkDetails/FormulaAttendedWork'; // individual control
    attendedWork.value = mcValue;
    
    eFormHelper.setFieldValue(attendedWork, function (attendWork)
      { console.log(attendWork.data)});
    
  
  });
}