function countRows(fieldName) {
    var options = {};
    var totalRows = "";

    options.fieldId = fieldName;
    eFormHelper.getFieldValue(options, function (results) {
        if (results.isSuccess) {
            var counts = results.data.split(',');
            totalRows = counts.length;
        } else {
            console.log('failed');
        }
    });
    return totalRows;
}

function setEmpPeriod(field, val) {
    var option = {};
    option.fieldId = field;
    option.value = val;
    eFormHelper.setFieldValue(option, function (res) {
        if (res.isSuccess) {
            console.log('success. EmpPeriodCal End.');
        } else {
            console.log('failed.');
        }
    });

}

function calPeriod() {
    var count = countRows('SubForm6/startdate_EmpHistory');
    console.log('TotalRows Emp History: ' + ' ' + count);
    for (var i = 1; i <= count; i++) {
        var currentStartDate = radField('SubForm6/startdate_EmpHistory: [' + i + ']');
        var currentEndDate = radField('SubForm6/EndDate_EmpHistory: [' + i + ']')[0];
        console.log("Start: " + currentStartDate[0] + "/ End: " + currentEndDate);
        var period;
        if (currentEndDate == "" || currentEndDate == undefined) {
            var currentEndDate = new Date();
        } else {
            var currentEndDate = new Date(currentEndDate);
        }

        var currentStartDate = new Date(currentStartDate[0]);
        console.log("enddate new: " + currentEndDate);
        console.log("startdate new: " + currentEndDate);
        var diff = new Date(currentEndDate.getTime() - currentStartDate.getTime());

        console.log(diff.getUTCFullYear() - 1970);
        var year = diff.getUTCFullYear() - 1970;
        console.log(diff.getUTCMonth());
        var month = diff.getUTCMonth();
        console.log(diff.getUTCDate() - 1);

        if (year == 0 && month > 1) {
            period = month + " Months";
        } else if (year == 0 && month == 0) {
            period = "less than a month";
        } else if (year == 0 && month == 1) {
            period = "1 Month";
        } else if (year > 0 && month != 0) {
            period = year + " Years " + month + " Months";
        } else if (year > 0 && month == 0) {
            period = year + " Years";
        } else {
            period = "-";
        }
        setEmpPeriod('SubForm6/TextBox571: [' + i + ']', period)
    }
}

function checkContribution() {
    console.log("contribution check starting...");
    var count = countRows('WagesDetails6Months/WagesDetailWagesInfoSubForm1/ContributionPaidRMSCOSub1');

    for (var i = 1; i <= count; i++) {
        var cont = radField('WagesDetails6Months/WagesDetailWagesInfoSubForm1/ContributionPaidRMSCOSub1: [' + i + ']')[0];
        if (cont == 0.00) {
            console.log("start changing field property...");
            //after review with BA stated that all wages should be editable in the wages info table
            // setReadOnly('WagesDetails6Months/WagesDetailWagesInfoSubForm1/RMWagesSCOSub1:['+i+']');

            console.log("ended for " + i);

        } else {

            // unsetReadOnly('WagesDetails6Months/WagesDetailWagesInfoSubForm1/RMWagesSCOSub1:['+i+']');
            console.log("cont for this row is not 0");

        }

    }
}

function setReadOnly(fieldId) {
    var options = {};
    options.propertyName = eFormHelper.constants.fieldProperty.Enabled;
    options.fieldId = fieldId;
    options.value = false;
    eFormHelper.updateFieldProperty(options, function (result) {
        if (result.isSuccess) {
            console.log(result.data); //logs the data holds the empty object
        } else {
            console.log(result.error); // logs the hold exception object
        }
    });
}

function unsetReadOnly(fieldId) {
    var options = {};
    options.propertyName = eFormHelper.constants.fieldProperty.Enabled;
    options.fieldId = fieldId;
    options.value = true;
    eFormHelper.updateFieldProperty(options, function (result) {
        if (result.isSuccess) {
            console.log(result.data); //logs the data holds the empty object
        } else {
            console.log(result.error); // logs the hold exception object
        }
    });
}
