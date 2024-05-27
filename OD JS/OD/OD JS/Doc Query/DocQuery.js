var AppUrl = "/ApplicationBuilder/eFormRender.html?Process=Query%20Process"

function openQueryApp() {
    var accID = getField('ODID');
    var schemeRefNo = getField('SchemeRefNoCaseInfo');
    var OBID = getField('InsuredPersonId');
    var employerCode = getField('EmployerCode');
    var queryApp = window.open(AppUrl + '&insuredid=' + OBID + '&employercode=' + employerCode + '&schemerefno=' + schemeRefNo + '&noticeid=' + accID);
}

function viewGeneratedDoc() {
    var SFDocRow = getField('GenDoc/rowGenDoc');
    var ArrayDocRow = SFDocRow.split(",");
    var DocRow = ArrayDocRow.indexOf('Yes') + 1;
    var DocUrl = getField('GenDoc/DocumentURL: [' + DocRow + ']')
    window.open(DocUrl)
}

function CopyFieldDateValue(sSource, sTarget) {
    var sTemp = getValue(sSource);
    var dDate = new Date(sTemp);
    var sDate = dDate.getDate() + '/' + (dDate.getMonth() + 1) + '/' + dDate.getFullYear();
    setField(sTarget, sDate);
}