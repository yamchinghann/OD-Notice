const encodingList = [
    //insured person
    "Name1",
    "SourceofDeathInformationIPI",
    "OccupationBasedonForm34",
    "SubOccupationList",
    "AddressInsuredPersonInfo",
    "AddressInsuredPersonInfo2",
    "AddressInsuredPersonInfo3",
    "POBoxInsuredPersonInfo",
    "LockedBagInsuredPersonInfo",
    "WDTInsuredPersonInfo",
    "EmailAddress1",
    //employer info
    "EISubform_inEmp/EmployerName_InEmp:[0]",
    "EISubform_inEmp/AddressL1_inEmp:[0]",
    "EISubform_inEmp/AddressL2_inEmp:[0]",
    "EISubform_inEmp/AddressL3_inEmp:[0]",
    "EISubform_inEmp/POBox_inEmp:[0]",
    "EISubform_inEmp/LockedBag_inEmp:[0]",
    "EISubform_inEmp/WDT_inEmp:[0]",
    "EISubform_inEmp/EmailAddress_inEmp:[0]",
    //Recommendation
    "DescriptionofOD",
    "Specifydutiesandhowinsuredpersonexposedtothedanger",
    "Pleaseexplainsymptomssignencountered",
    "CaseTransfer/CaseTransferRemarks:[0]",
    "WrongNoticeTypeRec/JustificationWrongNotice:[0]"
];

let encodingClass = {
    fieldList: [],
    init: function () {
        this.fieldList = [];
    },
    get: function () {
        return this.fieldList;
    },
    add: function (fieldIds) {
        if (Array.isArray(fieldIds)) {
            for (let i = 0; i < fieldIds.length; i++) {
                this.fieldList.push(fieldIds[i]);
            }
        } else {
            this.fieldList.push(fieldIds);
        }
    },
    encodeValue: function (value) {
        return value
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\\/g, "\\\\")
            .replace(/'/g, "\\'")
            .replace(/"/g, '\\"');
    },
    decodeValue: function (value) {
        return value
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/\\'/g, "'")
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, "\\");
    },
    encode: function () {
        try {
            for (let i = 0; i < this.fieldList.length; i++) {
                let fieldValue = getFormFieldValue(this.fieldList[i]);
                if (fieldValue) {
                    let encodedFieldValue = this.encodeValue(fieldValue);
                    setFormFieldValue(this.fieldList[i], encodedFieldValue);
                    console.log(
                        "@encoded (",
                        this.fieldList[i],
                        "): ",
                        fieldValue,
                        " => ",
                        encodedFieldValue
                    );
                }
            }
        } catch (e) {
            console.log(e);
            this.decode();
        } finally {
            return true;
        }
    },
    decode: function () {
        try {
            for (let i = 0; i < this.fieldList.length; i++) {
                let fieldValue = getFormFieldValue(this.fieldList[i]);
                if (fieldValue) {
                    let encodedFieldValue = this.decodeValue(fieldValue);
                    setFormFieldValue(this.fieldList[i], encodedFieldValue);
                    console.log(
                        "@decoded (",
                        this.fieldList[i],
                        "): ",
                        fieldValue,
                        " => ",
                        encodedFieldValue
                    );
                }
            }
        } catch (e) {
            console.log(e);
        } finally {
            return true;
        }
    },
};

function onLoadDecode() {
    encodingClass.init();
    encodingClass.add(encodingList);
    encodingClass.decode();
    console.log("@decoded");
}

function onSubmitEncode() {
    console.log("@encoding");
    encodingClass.init();
    encodingClass.add(encodingList);
    return encodingClass.encode();
}

async function submitFunction() {
    return new Promise(async (resolve, reject) => {
        if (!isFormValid()) {
            showDialogMessage("Validation failed. Form cannot be submitted.", "Error");
        } else {
            let result = await confirmMessage("Are you sure you want to submit the form?", "Info");
            if (result === true) {
                try {
                    const actionApprove = getFormFieldValue("ActionApprovalAfterMB");
                    if (actionApprove !== "-1" && actionApprove !== "") {
                        if (actionApprove === "10203") {
                            console.log("Trigger Assist");
                            debugger;
                            await showDialogMessage("Sending information to ASSIST", "Info");
                            showLoading(true);
                            if (await Promise.resolve(await sendHUSFirstPaymentApi())) {
                                console.log("successful call");
                                onSubmitEncode();
                                showLoading(false);
                                document.getElementById("SubmitBtn").click();
                            } else {
                                console.log("failed call");
                                onSubmitEncode();
                                showLoading(false);
                                document.getElementById("SubmitBtn").click();
                            }
                        }
                    } else {
                        console.log("No Assist Trigger");
                        onSubmitEncode();
                        document.getElementById("SubmitBtn").click();
                    }
                } catch (e) {
                    console.error(e);
                }
            }
        }
    });
}