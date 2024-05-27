function refreshAppt() {
    eFormCustomSettings.currentForm.lookupCaching.excludeItems.push({
        lookupName: 'lk opinion list',
        fieldId: 'opinionlist'
    });
    eFormHelper.triggerAutoLookup({fieldId: 'opinionlist'}, function (resp) {
        console.log(resp)
    });
}

function getRequestID() {
    eFormCustomSettings.currentForm.lookupCaching.excludeItems.push({
        lookupName: 'lkRequestOpinionID',
        fieldId: 'AutoLookup29'
    });
    eFormHelper.triggerAutoLookup({fieldId: 'AutoLookup29'}, function (resp) {
        console.log(resp)
    });
}

var url = "/ApplicationBuilder/eFormRender.html?Process=Opinion%20Request%20App";

function setField(fieldName, Value) {
    var options = {};
    options.fieldId = fieldName;
    options.value = Value;
    eFormHelper.setFieldValue(options, function (results) {
        if (results.isSuccess) {
            console.log('yay');
        } else {
            console.log('nay');
        }
    })
}

function readField(theField) {
    // var Field = destination;
    var queryResult = {};
    var Options = {};
    Options.fieldId = theField;
    eFormHelper.getFieldValue(Options, function (results) {
        if (results.isSuccess) {
            var idResult = results.data;
            //setField(Field,results.data)
            queryResult.res = results.data;
        } else {
            console.log(results.error);
        }
    })
    return queryResult.res;
}


function custom() {
    window.CustomAPNamespace = {};
    var Option = {};
    Option.fieldId = 'OpinionRequestSubform/CheckBox6';
    eFormHelper.getFieldValue(Option, function (results) {
        if (results.isSuccess) {
            window.CustomAPNamespace.ayo = results.data;
            var ayo = window.CustomAPNamespace.ayo;
            ayo = ayo.split(",");
            let Index = ayo.indexOf('Yes');
            let Row = Index + 1;
            console.log(Row);
            var schemeRefNo = readField('SchemeRefNoCaseInfo');
            var ToP = readField('Formula21');
            var form = readField('OpinionRequestSubform/form: [' + Row + ']');
            var action = readField('OpinionAction');
            var processID = readField('processid');
            var userRole = readField('Role');
            var Id = readField('OpinionRequestSubform/requestid: [' + Row + ']');
            var opWin = window.open(url + '&schemerefno=' + schemeRefNo + '&Action=' + action + '&Id=' + Id + '&processid=' + processID + '&role=' + userRole + '&ToP=' + ToP + '&form=' + form)
            opWin.addEventListener('beforeunload', function () {
                console.log("I am closed");
                refreshAppt();
                getRequestID();
            });

        } else {
            console.log('vegas light');
        }
    })
}

function ifEmpty(subformName) {
    var Options = {};
    var holdResult = {};
    Options.fieldId = subformName;
    eFormHelper.getSubFormData(Options, function (results) {
        if (results.isSuccess) {
            console.log(results.data);
            holdResult.res = results.data;
        }
    })
    return holdResult.res
}

function newOpinion() {
    var numberRow = ifEmpty('OpinionRequestSubform');
    var typeOpinion = readField('Formula21');
    var roleOpinion = readField('Role');
    var schemeRef = readField('SchemeRefNoCaseInfo');
    var procID = readField('processid');
    if (numberRow == "") {
        var nRow = window.open(url + '&Action=n&ToP=0&role=' + roleOpinion + '&schemerefno=' + schemeRef + '&processid=' + procID + '&noticetype=Occupational%20Disease%20Notice');
        nRow.addEventListener('beforeunload', function () {
            console.log("I am closed");
            refreshAppt();
            getRequestID();
        })
    } else {
        var wRow = window.open(url + '&Action=n&ToP=' + typeOpinion + '&role=' + roleOpinion + '&schemerefno=' + schemeRef + '&processid=' + procID + '&noticetype=Occupational%20Disease%20Notice');
        wRow.addEventListener('beforeunload', function () {
            console.log("I am closed");
            refreshAppt();
            getRequestID();
        });
    }
}

function sendToMB() {
    $("#Button13").click();
}

