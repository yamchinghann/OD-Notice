var globalVar = {
    freeTextboxList: [],
    getRegisteredFields: function () {
        return this.freeTextboxList;
    },
    registerField: function (fieldId) {
        this.freeTextboxList.push(fieldId);
    }
};

/*
This the core function that will encode all fields
*/
function encodeAllFields() {
    var totalFields = this.globalVar.getRegisteredFields().length;
    var count = 0;
    this.globalVar.getRegisteredFields().forEach(fieldId => {
        getValue(fieldId, function (value) {
            console.log('fieldId: ' + fieldId + ', fieldValue: ' + value + ', encoded: ' + encodeValue(value));
            setValue(fieldId, encodeValue(value));

            count++;
            if (count === totalFields) {
                $('#hiddenSubmit').click();
            }
        });
    });
}

/*
This the core function that will decode all fields
*/
function decodeAllFields() {
    var totalFields = this.globalVar.getRegisteredFields().length;
    var count = 0;
    this.globalVar.getRegisteredFields().forEach(fieldId => {
        getValue(fieldId, function (value) {
            console.log('fieldId: ' + fieldId + ', fieldValue: ' + value + ', encoded: ' + decodeValue(value));
            setValue(fieldId, decodeValue(value));

            count++;
            if (count == totalFields) {

            }
        });
    });
}

function encodeValue(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\\/g, '\\\\')
        .replace(/'/g, '\\\'')
        .replace(/"/g, "\\\"");
}

function decodeValue(value) {
    return value
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/\\'/g, "'")
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\');
}

function catchAllFormFields(){
    //insured person
    globalVar.getRegisteredFields("Name1");
    globalVar.getRegisteredFields("SourceofDeathInformationIPI");
    globalVar.getRegisteredFields("OccupationBasedonForm34");
    globalVar.getRegisteredFields("SubOccupationList");
    globalVar.getRegisteredFields("AddressInsuredPersonInfo");
    globalVar.getRegisteredFields("AddressInsuredPersonInfo2");
    globalVar.getRegisteredFields("AddressInsuredPersonInfo3");
    globalVar.getRegisteredFields("POBoxInsuredPersonInfo");
    globalVar.getRegisteredFields("LockedBagInsuredPersonInfo");
    globalVar.getRegisteredFields("WDTInsuredPersonInfo");
    globalVar.getRegisteredFields("EmailAddress1");

    //employer info
    globalVar.getRegisteredFields("EISubform_inEmp/EmployerName_InEmp:[0]");
    globalVar.getRegisteredFields("EISubform_inEmp/AddressL1_inEmp:[0]");
    globalVar.getRegisteredFields("EISubform_inEmp/AddressL2_inEmp:[0]");
    globalVar.getRegisteredFields("EISubform_inEmp/AddressL3_inEmp:[0]");
    globalVar.getRegisteredFields("EISubform_inEmp/POBox_inEmp:[0]");
    globalVar.getRegisteredFields("EISubform_inEmp/LockedBag_inEmp:[0]");
    globalVar.getRegisteredFields("EISubform_inEmp/WDT_inEmp:[0]");
    globalVar.getRegisteredFields("EISubform_inEmp/EmailAddress_inEmp:[0]")

    globalVar.getRegisteredFields("DescriptionofOD");
    globalVar.getRegisteredFields("Specifydutiesandhowinsuredpersonexposedtothedanger");
    globalVar.getRegisteredFields("Pleaseexplainsymptomssignencountered");

    globalVar.getRegisteredFields("CaseTransfer/CaseTransferRemarks:[0]");
    globalVar.getRegisteredFields("WrongNoticeTypeRec/JustificationWrongNotice:[0]");
}