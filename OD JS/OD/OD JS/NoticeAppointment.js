/*
 * JQuery WYSIWYG Web Form Designer
 * Copyright 2015 AgilePoint Inc
 */

/* Add your JS code Here (Press Ctrl+Space keys for intellisense) */

const sApptURL = "/ApplicationBuilder/eFormRender.html?Process=Notice%20-%20Appointment";

function openwindow() {
    var wx = window.open("about:blank")
    wx.addEventListener('beforeunload', function () {
        console.log("I am closed");
        $("#Button141").click();
    })
}

function refreshList() {
    eFormCustomSettings.currentForm.lookupCaching.excludeItems.push({lookupName: 'lkGetAppt', fieldId: 'alkGetAppt'});
    eFormHelper.triggerAutoLookup({fieldId: 'alkGetAppt'}, function (resp) {
        console.log(resp)
    });
    console.log("refreshed");
}

function OpenNewAppt() {
    var sNoticeID = "";
    var sRefNo = "";
    var sInsuredID = "";
    var sAccID = "";
    var sEmployerCode = "";
    GetFormFieldValue('ODID', function (res) {
        sAccID = res
    });
    GetFormFieldValue('SchemeRefNoCaseInfo', function (res) {
        sRefNo = res
    });
    GetFormFieldValue('TestNoticeID', function (res) {
        sNoticeID = res
    });
    GetFormFieldValue('InsuredPersonID', function (res) {
        sInsuredID = res
    });
    GetFormFieldValue('QueryEmployerID', function (res) {
        sEmployerCode = res
    })
    var newWin = window.open(sApptURL + '&action=n&al=New%20%20Appointment&apptid=&noticeid=' + sNoticeID + '&schemerefno=' + sRefNo + '&insuredid=' + sInsuredID + '&accid=' + sAccID + '&employercode=' + sEmployerCode + '&noticetype=OD');
}

function OpenUpdateAppt() {
    var sApptID = "";
    var sNoticeID = "";
    var sRefNo = "";
    var sData = "";
    var sStatus = "";
    var sAccID = "";
    var sInsuredID = "";
    var sEmployerCode = "";
    GetFormFieldValue('SchemeRefNoCaseInfo', function (res) {
        sRefNo = res
    });
    GetFormFieldValue('TestNoticeID', function (res) {
        sNoticeID = res
    });
    GetFormFieldValue('ODID', function (res) {
        sAccID = res
    });
    GetFormFieldValue('EmployerCode2', function (res) {
        sEmployerCode = res
    });
    GetFormFieldValue('InsuredPersonID', function (res) {
        sInsuredID = res
    });
    sData = getSelectedSingleItem();
    var aData = sData.split(";");
    if (aData.length > 1) {
        sApptID = aData[0];
        sStatus = aData[1];
    }
    if (sStatus != "Cancel") {
        if (sApptID != "") {
            var upWin = window.open(sApptURL + '&action=r&al=Reschedule%20%20Appointment&apptid=' + sApptID + '&noticeid=' + sNoticeID + '&schemerefno=' + sRefNo + '&accid=' + sAccID + '&employercode=' + sEmployerCode + '&insuredid=' + sInsuredID);
        }
    } else {
        eFormHelper.showDialogMessage({
            value: 'The selected appointment has been cancelled',
            messageType: eFormHelper.constants.messagetype.Warning
        }, function (resp) {
            console.log(resp)
        });
    }

}

function OpenDeleteAppt() {
    var sApptID = "";
    var sNoticeID = "";
    var sRefNo = "";
    var sData = "";
    var sStatus = "";
    var sAccID = "";
    var sEmployerCode = "";
    GetFormFieldValue('ODID', function (res) {
        sAccID = res
    });
    GetFormFieldValue('SchemeRefNoCaseInfo', function (res) {
        sRefNo = res
    });
    GetFormFieldValue('TestNoticeID', function (res) {
        sNoticeID = res
    });
    sData = getSelectedSingleItem();
    var aData = sData.split(";");
    if (aData.length > 1) {
        sApptID = aData[0];
        sStatus = aData[1];
    }
    if (sStatus != "Cancel") {
        if (sApptID != "") {
            var dlWin = window.open(sApptURL + '&action=d&al=Delete%20%20Appointment&apptid=' + sApptID + '&noticeid=' + sNoticeID + '&schemerefno=' + sRefNo + '&accid=' + sAccID);
        }
    } else {
        eFormHelper.showDialogMessage({
            value: 'The selected appointment has been cancelled',
            messageType: eFormHelper.constants.messagetype.Warning
        }, function (resp) {
            console.log(resp)
        });
    }

}

function OpenViewAppt() {
    var sApptID = "";
    var sNoticeID = "";
    var sRefNo = "";
    var sData = "";
    var sAccID = "";
    GetFormFieldValue('ODID', function (res) {
        sAccID = res
    });
    GetFormFieldValue('SchemeRefNoCaseInfo', function (res) {
        sRefNo = res
    });
    GetFormFieldValue('TestNoticeID', function (res) {
        sNoticeID = res
    });
    sData = getSelectedSingleItem();
    var aData = sData.split(";");
    if (aData.length > 1) {
        sApptID = aData[0];
    }
    if (sApptID != "") {
        window.open(sApptURL + '&action=v&al=View%20%20Appointment&apptid=' + sApptID + '&noticeid=' + sNoticeID + '&schemerefno=' + sRefNo + '&accid=' + sAccID);
    }

}

function getSelectedItems() {
    var options = {};
    var iCount = 0;
    options.fieldId = "SFAppointment";
    eFormHelper.getSubFormData(options, function (result) {
        if (result.isSuccess) {
            iCount = result.data.length;
            //console.log(result.data);
        } else {
            //console.log(result.error); // logs the hold exception object
        }
    });
    var sSelectedItems = "";
    var sTempSelectedItem = "";
    var sRefID = "";
    var sStatus = "";
    for (i = 1; i <= iCount; i++) {
        GetFormFieldValue('SFAppointment/chkSelected:[' + i + ']', function (res) {
            sTempSelectedItem = res
        });
        if (sTempSelectedItem == "Yes") {
            GetFormFieldValue('SFAppointment/ApptID:[' + i + ']', function (res) {
                sRefID = res
            });
            GetFormFieldValue('SFAppointment/ApptStatus:[' + i + ']', function (res) {
                sStatus = res
            });
            sSelectedItems = sSelectedItems + sRefID + ";" + sStatus + "|";

        }
    }
    return sSelectedItems;
}

function getSelectedSingleItem() {
    var sTempSelectedItems = "";
    var sSelectedItems = "";
    var arr;
    sTempSelectedItems = getSelectedItems();
    if (sTempSelectedItems != "") {
        arr = sTempSelectedItems.split("|");
        if (arr.length > 2) {
            eFormHelper.showDialogMessage({
                value: 'Please select one item to proceed',
                messageType: eFormHelper.constants.messagetype.Warning
            }, function (resp) {
                console.log(resp)
            });

        } else {
            sSelectedItems = arr[0];
        }

    } else {
        eFormHelper.showDialogMessage({
            value: 'Please select one item to proceed',
            messageType: eFormHelper.constants.messagetype.Warning
        }, function (resp) {
            console.log(resp)
        });
    }
    return sSelectedItems;
}

function GetFormFieldValue(field, callBack) {
    var options = {'fieldId': field};
    eFormHelper.getFieldValue(options, function (result) {
        if (result.isSuccess && result.data && typeof callBack === 'function') {

            callBack(result.data);// result.data holds thee selected or entered value for field
        } else {
            if (typeof callBack === 'function') {
                callBack("")// No control found
            }
        }
    });
}

function SetFormFieldValue(field, value) {
    var options = {};
    options.fieldId = field; // individual control
    options.value = value;

    eFormHelper.setFieldValue(options, function (result) {
        if (result.isSuccess) //check if is success
        {
            console.log(result.data); //logs the data holds empty object
        } else {
            console.log(result.error); //logs the error
        }
    });
}