/*
 * JQuery WYSIWYG Web Form Designer
 * Copyright 2015 AgilePoint Inc
 */

/* Add your JS code Here (Press Ctrl+Space keys for intellisense) */
function getUserDetail(fieldId) {
//debugger;
eFormHelper.getLoggedInUserDetails({}, 
 function(response){
 let bb = response.data;
 console.log(bb.userName);
 let userDetail = bb.userName;
 var options = {};
options.fieldId = fieldId; // individual control
options.value = userDetail;

eFormHelper.setFieldValue(options, function (result)
  {
  if (result.isSuccess) //check if is success
    { 
    console.log(result.data); //logs the data holds empty object
    }
  else 
    {
    console.log(result.error); //logs the error
    }
});
 });
}

function setPreparerDate(){
   let CurrentDate = new Date();
    let PreparedDate = CurrentDate.toLocaleDateString();
  var option = {};
  option.fieldId = 'PreparedDate'; // individual control
option.value = PreparedDate;

eFormHelper.setFieldValue(option, function (result)
  {
  if (result.isSuccess) //check if is success
    { 
    console.log(result.data); //logs the data holds empty object
    }
  else 
    {
    console.log(result.error); //logs the error
    }
  }
)
}