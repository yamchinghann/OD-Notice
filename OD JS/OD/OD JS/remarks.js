function sortRemarksByDate() {
    let remarksQuery = {
      fieldId: 'ViewRemarksDetailsR'
    }
    eFormHelper.getSubFormData(remarksQuery, function(result) {
      if (!result.isSuccess) return;
      console.log(result.data)
      var remarksArray = result.data[0]['RemarksDetailsVRDetailsR_SubForm']['RemarksDetailsVRDetailsR']
      console.log('here');
      remarksArray.sort(function(a,b) {
        let ax = Number(a.TimestampRDetailsVRDetailsR);
        let bx = Number(b.TimestampRDetailsVRDetailsR);
        return bx - ax;
      })
      console.log('here');
      var remarksObj = {RemarksDetailsVRDetailsR_SubForm: {RemarksDetailsVRDetailsR: remarksArray}};
      eFormHelper.setFieldValue({fieldId:'ViewRemarksDetailsR', value: {ViewRemarksDetailsR: remarksObj}}, function(resp) {console.log(resp)})
    });
  }
  function addRemarksToSubform(eventElement) {
    
    let remarksQuery = {
       fieldId: 'AddRemarksDetailsR'
    };
    eFormHelper.getSubFormData(remarksQuery, function (result) 
    {
      if (!result.isSuccess) return;
      let newRemarks = result.data;
      let isValid = newRemarks[0].RemarksARDetailsR.trim().length > 0;
      if (!isValid) return;
      
      eFormHelper.getLoggedInUserDetails({}, function(userInfo) {
        if (!userInfo.isSuccess) return;
        userInfo = userInfo.data;
        console.log(userInfo, newRemarks);
        let addToHistoryQuery = {
        fieldId: 'ViewRemarksDetailsR/RemarksDetailsVRDetailsR',
         value: newRemarks.map(function(newRemark) {
   
         let currentDateTime = new Date();
         let currentTime = currentDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
         let currentTimestamp = currentDateTime.getTime();
         let currentDateFormatted = currentDateTime.toLocaleDateString();                                           
                                            
           return {
               RemarksRDetailsVRDetailsR: newRemark.RemarksARDetailsR,
               UserNameRDetailsVRDetailsR: userInfo.userName,
               DateRDetailsVRDetailsR: currentDateFormatted,
               TimeRDetailsVRDetailsR: currentTime,
               TimestampRDetailsVRDetailsR: currentTimestamp
           };
         })
        }
        eFormHelper.addRowsToSubForm(addToHistoryQuery, function(result) {
          if (!result.isSuccess) return;
          let clearExistingQuery = {
           fieldId: 'AddRemarksDetailsR',
           rowIndex: '*'
          }
          eFormHelper.deleteRowsFromSubForm(clearExistingQuery, function(result){
             let addToNewQuery = {
               fieldId: 'AddRemarksDetailsR',
               value: [{
                       RemarksARDetailsR: ''
                       }]
             }
             eFormHelper.addRowsToSubForm(addToNewQuery);
          });
          sortRemarksByDate();
      }); // getLoggedInUserDetails
      });// addRowsToSubForm
    }); // getSubFormData
  }