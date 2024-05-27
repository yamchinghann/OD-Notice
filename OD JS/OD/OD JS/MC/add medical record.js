function delDupe(fieldToDelete, rowN) {
    var options = {};
    options.fieldId = fieldToDelete;
    options.rowIndex = rowN;
    eFormHelper.deleteRowsFromSubForm(options, function (result) {
        if (result.isSuccess) {
            console.log(result.data);

        } else {
            console.log(result.error);
        }
    });
}

async function addSuppDoc() {
    var options = {};
    options.fieldId = 'SupDoc';
    options.value = [{
        DocumentDescription: 'Medical Record',
        DocumentStatus: 'Required'
    }];
    eFormHelper.addRowsToSubForm(options, function (result) {
        if (result.isSuccess) {
            console.log(result.data); //logs the data holds the empty object
        } else {
            console.log(result.error); // logs the hold exception object
        }
    });
}

async function addMedicalRecord() {
    var checkExisting = readField('SupDoc/DocumentDescription').split(',').indexOf('Medical Record')
    var mcDays = readField('TotalHUSReceivedHUSInfo')
    if (checkExisting == -1 && mcDays >= 14) {
        console.log(mcDays)
        await addSuppDoc()
        var dupeRecord = readField('SupDoc/DocumentDescription').split(',').lastIndexOf('Medical Record')
        var dupeRow = dupeRecord + 1
        let stringRow = dupeRow.toString()
        delDupe('SupDoc', stringRow)
    }
}
