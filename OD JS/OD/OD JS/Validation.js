function pk_validation()
{
    //IPI
    var ipDoB =readField('DateofBirth');
    var ipGender = readField('GenderIPI');
    var ipAddress = readField('AddressInsuredPersonInfo');
    var ipRace = readField('RaceIPI');
    var ipPostcode = readField('PostcodeInsuredPersonInfo');
    var ipState = readField('AddStateIPI');
    var ipCity = readField('CityIPI');

    //OD Info
    //8
    var od_desc = readField('DescriptionofOD');
    var od_related = readField('Isthediseaserelatedtoemployment');
    var od_specifyhow = readField('Specifydutiesandhowinsuredpersonexposedtothedanger');
    var od_symptom = readField('Pleaseexplainsymptomssignencountered');

    //OD Info->Emp History
    //12
    var emp_record_count = readField("Formula17");
    var emp_name_count = readField("Formula25");

    //Confirmation
    //14
    var bank_completed = readField("BankInformationCompleted");
    var bank_c_date = readField("CompletionDate");


    if(od_related == "No")
    {
        od_related = "";
    }

    if(emp_name_count == "" || emp_name_count == NULL)
    {
        emp_name_count = 0;
    }

    if(emp_record_count == "" || emp_record_count == NULL)
    {
        emp_record_count = 0;
    }

    if(bank_completed == "Completed")
    {
        bank_completed = 1;
    }
    else
    {
        bank_completed = 0;
    }

    if(ipCity == '-1')
    {
    ipCity = '';
    }

    if(ipState =='-1')
    {
    ipState = '';
    }

    var MV = ipDoB+'|'+ipGender+'|'+ipAddress+'|'+ipRace+'|'+ipPostcode+'|'+ipState+'|'+ipCity+'|'+od_desc+'|'+od_related+'|'+od_specifyhow+'|'+od_symptom+'|'+emp_name_count+'|'+emp_record_count+'|'+bank_completed+'|'+bank_c_date;

    setField('MasterValue', MV);
  
  var options = {};
  options.fieldId = 'ValidationForm';
  options.rowIndex = '*'; 
  eFormHelper.deleteRowsFromSubForm(options, function(result) 
    { 
    if (result.isSuccess)
      { 
        console.log (result.data);
      }
    else 
      { 
        console.log(result.error); 
      }
	});

}