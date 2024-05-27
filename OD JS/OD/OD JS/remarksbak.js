function addRemarksToSubform(eventElement) {
  let remarksQuery = {
     fieldId: 'SubForm3'
  };
  eFormHelper.getSubFormData(remarksQuery, function (result) 
  {
    if (!result.isSuccess) return;
    let newRemarks = result.data;
    let isValid = newRemarks[0].AddSingleRemarks.trim().length > 0;
    if (!isValid) return;
    
    eFormHelper.getLoggedInUserDetails({}, function(userInfo) {
      if (!userInfo.isSuccess) return;
      userInfo = userInfo.data;
      console.log(userInfo, newRemarks);
      let addToHistoryQuery = {
      fieldId: 'RemarksHistorySubform',
       value: newRemarks.map(function(newRemark) {
         return {
         	remarksTextArea:newRemark.AddSingleRemarks,
             Username: userInfo.userName,
             DateTimeRemarksHistory: new Date()
         };
       })
      }
      eFormHelper.addRowsToSubForm(addToHistoryQuery, function(result) {
        if (!result.isSuccess) return;
        let clearExistingQuery = {
         fieldId: 'SubForm3',
         rowIndex: '*'
        }
        eFormHelper.deleteRowsFromSubForm(clearExistingQuery, function(result){
           let addToNewQuery = {
             fieldId: 'SubForm3',
             value: [{
                     AddSingleRemarks: ''
                     }]
           }
           eFormHelper.addRowsToSubForm(addToNewQuery);
        });
      });
    }); // getLoggedInUserDetails
  }); // getSubFormData
}