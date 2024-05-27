function triggerFormula(internalName) {
    var options = {};
    var getRows = getRowNumber();
    var selRow = getRows.indexOf('Yes') + 1
    options.fieldId = internalName + ': [' + selRow + ']';
    eFormHelper.triggerFormula(options, function (result) {
        if (result.isSuccess) {
            console.log(result.data); //logs the data holds the empty object
        } else {
            console.log(result.error); // logs the hold exception object
        }
    });
}

async function postScan() {
    await triggerControlRule('SupDoc/Formula18')
    await triggerFormula('SupDoc/Formula18')
    var docRow = getRowNumber();
    var contentRow = docRow.indexOf('Yes') + 1
    var sourceCase = getField('SourceCICI')
    var doclink = getField('SupDoc/fileContentLink: [' + contentRow + ']')
    var docStatus = getField('SupDoc/DocumentStatus: [' + contentRow + ']')
    if (doclink && docStatus == '-1') {
        setField('SupDoc/DocumentStatus: [' + contentRow + ']', '205003')
        if (sourceCase == 'Offline') {
            setField('SupDoc/DocumentSource: [' + contentRow + ']', '204802')
        } else if (sourceCase == 'Online') {
            setField('SupDoc/DocumentSource: [' + contentRow + ']', '204801')
        }
    }
}

function refreshContentLink() {
    eFormCustomSettings.currentForm.lookupCaching.excludeItems.push({
        lookupName: 'GetDocByTs',
        fieldId: 'SupDoc/LkFindDocs'
    });
    eFormHelper.triggerAutoLookup({fieldId: 'SupDoc/LkFindDocs'}, function (resp) {
        if (resp.isSuccess) {
        }
    })
}

function getFieldValue(fieldId) {
    var returnValue;
    try {
        var options = {};
        options.fieldId = fieldId; // individual control
        // (or) options.fieldId = 'Subform1/TextBox1'; //search in all rows in a subform
        // (or) options.fieldId = 'Subform1/TextBox1: [*]'; //search in all rows in a subform
        // (or) options.fieldId = 'Subform1/TextBox1: [rowindex]'; // search in specific row in a subform
        eFormHelper.getFieldValue(options, function (result) {
            returnValue = result.data;
        });
    } catch (error) {
        console.error("@getFieldValue: " + error);
    }
    return returnValue;
}

function showDialogMessage(value, messageType) {
    try {
        var options = {};
        options.value = value;
        if (messageType == 'Warning') {
            options.messageType = eFormHelper.constants.messagetype.Warning;
        } else if (messageType == 'Error') {
            options.messageType = eFormHelper.constants.messagetype.Error;
        } else {
            options.messageType = eFormHelper.constants.messagetype.Info;
        }
        eFormHelper.showDialogMessage(options, function (result) {
        });
    } catch (error) {
        console.error('@showDialogMessage: ' + error);
    }
}

function message(message) {
    var options = {};
    options.value = message;
    options.messageType = eFormHelper.constants.messagetype.Info;
    eFormHelper.showDialogMessage(options, function (result) {
        if (result.isSuccess) {
            console.log(result.data); //logs the data holds the empty object
        } else {
            console.log(result.error); // logs the hold exception object
        }
    });
}

function submitMessage(confirmationMessage) {
    return new Promise((accept, reject) => {
        var options = {};
        var resBool = false
        options.value = confirmationMessage;
        eFormHelper.confirmMessage(options, function (result) {
            if (result.isSuccess) {
                console.log(result.data)
                resBool = result.data
                accept(resBool)
            } else {
                console.log(result.error); // logs the hold exception object
                reject(result.data)
            }
        });
    })
}

function setField(fieldName, value) {
    var options = {}
    options.fieldId = fieldName
    options.value = value
    eFormHelper.setFieldValue(options, function (result) {
        if (result.isSuccess) {
            console.log(options.value)
        } else {
            console.log(result.error)
        }
    })
}

function getField(nameField) {
    var options = {}
    var res = ""
    options.fieldId = nameField
    eFormHelper.getFieldValue(options, function (result) {
        if (result.isSuccess) {
            res = result.data
            console.log(options.value)
        } else {
            console.log(result.error)
        }
    })
    return res
}

function getRowNumber() {
    var fieldValue = getField("SupDoc/CheckBox2")
    var splitValue = fieldValue.split(',')
    return splitValue
}

function docufloScan() {
    var nric = getField('QueryIC');
    var allRows = getRowNumber()
    console.log(nric)
    var timeStamp = new Date().getTime();
    var docufloUrl = 'http://10.7.51.145/WebLauncher/launch?m=post&url=http://10.7.50.135:8090/Document/Upload&ref=' + nric + '&ref2=' + timeStamp
    var row = allRows.indexOf('Yes') + 1
    console.log(row)
    setField('SupDoc/timeStamp: [' + row + ']', timeStamp)
    setField('SupDoc/DocumentSource: [' + row + ']', 'Offline')
    var openWebScan = window.open(docufloUrl)
    openWebScan.addEventListener('beforeunload', function () {
        refreshContentLink();
    })
}

function checkContent() {
//await refreshContentLink()
    var rowN = getRowNumber().indexOf('Yes') + 1
    var uploadDate = new Date();
    var contentUrl = getFieldValue('SupDoc/fileContentLink: [' + rowN + ']')
    if (contentUrl != '') {
        openSupportingDoc()
        getUserDetail('SupDoc/UploadBy: [' + rowN + ']')
        setField('SupDoc/UploadDate: [' + rowN + ']', uploadDate)
    } else if (contentUrl == '') {
        showDialogMessage('Please Scan and Upload Document', 'Warning')
    }
}

async function checkMandatoryDoc() {
    let uploadedDocs = readField('SupDoc/DocumentName').split(',')
    let medicalReport = uploadedDocs.indexOf('205419')
    let icCopy = uploadedDocs.indexOf('205406')
    if (medicalReport == -1 && icCopy == -1) {
        await showDialogMessage('Please Upload Salinan Kad Pengenalan Orang Berinsuran and Medical Report', 'Warning')
    } else if (medicalReport == -1 && icCopy != -1) {
        await showDialogMessage('Please Upload Medical Report', 'Warning')
    } else if (icCopy == -1 && medicalReport != -1) {
        await showDialogMessage('Please Upload Salinan Kad Pengenalan Orang Berinsuran', 'Warning')
    } else {
        $('[id^=submitcase]').click()
    }
}

async function validateView() {
    let status = readField('totalstatus')
    if (status > 0) {
        await showDialogMessage('Please View Document Before Submitting', 'Warning')
    } else {
        await checkQueryStatus()
    }
}

function openSupportingDoc() {
    var getRow = getRowNumber();
    var contentRow = getRow.indexOf('Yes') + 1
    var link = getField('SupDoc/fileContentLink: [' + contentRow + ']')
    var viewDoc = window.open(link)
    setField('SupDoc/DocumentStatus: [' + contentRow + ']', '205004')
    //var link = $(sourceElm).closest('.subFormContentRowChildWrapper').find('[controlholdername="fileContentLink"]').find('input').val();
    //console.log(link);
    //var viewDoc= window.open(link)
    //viewDoc.addEventListener('beforeunload',function(){
    //refreshContentLink()
}
