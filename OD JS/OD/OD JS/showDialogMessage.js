/*
 * JQuery WYSIWYG Web Form Designer
 * Copyright 2015 AgilePoint Inc
 */

/* Add your JS code Here (Press Ctrl+Space keys for intellisense) */

async function showDialogMessage(value, messageType) {
  try {
    var options = {};
    options.value = value;    
    if (messageType == 'Warning') { options.messageType = eFormHelper.constants.messagetype.Warning; }
    else if (messageType == 'Error') { options.messageType = eFormHelper.constants.messagetype.Error; }
    else { options.messageType = eFormHelper.constants.messagetype.Info; }
    eFormHelper.showDialogMessage(options, await function (result) {});
  } catch(error) {
    console.error('@showDialogMessage: '+error);
  }
}

function message(message){
var options = {};
options.value = message;    
options.messageType = eFormHelper.constants.messagetype.Info;
eFormHelper.showDialogMessage(options, function (result) 
  {
  if (result.isSuccess) 
    {
    console.log(result.data); //logs the data holds the empty object
    }
  else 
    {
    console.log(result.error); // logs the hold exception object 
    }
});
}

async function submitMessage(confirmationMessage) {
  return new Promise((accept, reject) => {
    var options = {};
    var resBool = false
    options.value = confirmationMessage;
    eFormHelper.confirmMessage(options, function(result) {
      if (result.isSuccess) {
        console.log(result.data)
        resBool = result.data
        accept(resBool)
      } else {
        console.log(result.error); // logs the hold exception object 
        reject(result.data)
      }
    });
  })
}
