function swiftcode()
{
	var options = {};
    options.lookupName = 'LkSwiftCodebyBankName';
    options.lookupType = eFormHelper.constants.lookuptype.namevalue;

    eFormHelper.executeLookup(options, function(result) {
      
       if (result.isSuccess) {
		var data = result.data;
        console.log(data.Value);
         setFieldValue('BankSwiftCode', data.Value);
         
       } else {
            console.log(result.error); // logs the hold exception object 
        }
    });
    
}

function currency()
{
	var options = {};
    options.lookupName = 'LkCurrency';
    options.lookupType = eFormHelper.constants.lookuptype.namevalue;

    eFormHelper.executeLookup(options, function(result) {
      
       if (result.isSuccess) {
		var data = result.data;
        console.log(data.Value);
         setFieldValue('Currency', data.Value);
         
       } else {
            console.log(result.error); // logs the hold exception object 
        }
    });
    
}