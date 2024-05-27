function getFromQueryString(paramName) {
    const urlParams = new URLSearchParams(window.location.search);
    const paramValue = urlParams.get(paramName);
    return paramValue;
}

async function setFormField(fieldName, value) {
    return new Promise(function (accept, reject) {
        eFormHelper.setFieldValue({fieldId: fieldName, value: value}, function (result) {
            if (result.isSuccess) //check if is success
            {
                accept();
            } else {
                reject();
            }
        });
    });
}

async function setFieldFromQuery() {
    var insuredPersonIdNo = getFromQueryString("QueryIC");
    var insuredPersonIdType = getFromQueryString("QueryIDType");
    var accidentDate = getFromQueryString("AccidentDate");
    var accidentTime = getFromQueryString("AccidentTime");
    var employerCode = getFromQueryString("EmployerCode");
    setFormFieldValue("QueryIC", insuredPersonIdNo);
    setFormFieldValue("QueryIDType", insuredPersonIdType);
    setFormFieldValue('QueryEmployeeID', employerCode);
    await triggerAssistLk()
    return !!insuredPersonIdNo;
}

async function triggerAssistLk() {
    /*let LkEmployerInfo = await triggerAutoLookup('employerinfolookupinemp')
    let LkLookupInsuredPerson = await triggerLk('LookupInsuredPerson')
    let LkGetContributions = await triggerLk('LkWI');*/
    triggerAutoLookup('AutoLookup34', null);
}

async function lookupFromQueryString() {
    await setFieldFromQuery();
    await triggerPersonLoookup();
}