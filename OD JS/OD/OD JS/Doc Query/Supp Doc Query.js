var AppUrl = "/ApplicationBuilder/eFormRender.html?Process=Query%20Process"

function openQueryApp() {
    var accID = readField('ODID');
    var schemeRefNo =  checkSchemeRefNo(getFormFieldValue('SchemeRefNoCaseInfo'), getFormFieldValue("TempSchemeRefNo"));
    var OBID = readField('InsuredPersonId2');
    if (OBID == "") {
        var OBID = readField('InsuredPersonId');

    }
    var employerCode = readField('');
    var queryApp = window.open(AppUrl + '&insuredid=' + OBID + '&employercode=' + employerCode + '&schemerefno=' + schemeRefNo + '&noticeid=' + accID);
}

function viewGeneratedDoc() {
    var SFDocRow = readField('GenDoc/rowGenDoc');
    var ArrayDocRow = SFDocRow.split(",");
    var DocRow = ArrayDocRow.indexOf('Yes') + 1;
    var DocUrl = readField('GenDoc/DocumentURL: [' + DocRow + ']')
    window.open(DocUrl)
}

function CopyFieldDateValue(sSource, sTarget) {
    var sTemp = getValue(sSource);
    var dDate = new Date(sTemp);
    var sDate = dDate.getDate() + '/' + (dDate.getMonth() + 1) + '/' + dDate.getFullYear();
    setField(sTarget, sDate);
}