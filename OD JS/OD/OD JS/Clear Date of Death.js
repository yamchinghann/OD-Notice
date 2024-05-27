function clearDate()
{
	var dateofdeath = {};
 		dateofdeath.fieldId = 'DateofDeathIPI';
 		dateofdeath.value = '';
 		eFormHelper.setFieldValue(dateofdeath, function (dateofdeath){});
	var ageofdeath = {};
 		ageofdeath.fieldId = 'AgeattheTimeofDeath_IPIF';
 		ageofdeath.value = '';
 		eFormHelper.setFieldValue(ageofdeath, function (ageofdeath){});
}