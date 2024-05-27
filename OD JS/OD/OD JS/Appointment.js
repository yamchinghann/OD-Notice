function refreshAppointment() {
    triggerAutoLookup('alkGetAppt', 'lkGetAppt');
}

function AppointmentButton(FieldName, Value, Event) {
    onSubformRowClick(Event);
    eFormHelper.getFieldValue({fieldId: 'SubForm11'}, function (result) {
        if (Object.keys(result.error).length > 0) console.error(result);
        let datalength = result.data['SubForm11'].length;
        let options = {
            fieldId: 'SubForm11' + '/' + FieldName + ':' + '[' + datalength + ']',
            value: Value
        }
        var field = options.fieldId;
        console.log(field);
        eFormHelper.setFieldValue(options, function (result) {
            console.log(result);
        });
    });
}

function DeleteButton(Click) {
    var options = {};
    options.value = 'Are you sure you want to delete?';
    eFormHelper.confirmMessage(options, function (result) {
        if (result.isSuccess) {
            console.log(result.data); //logs the data holds the return result true/false
            if (result.data == true) {
                var fieldName = 'Status';
                var fieldValue = 'Cancelled';
                var event = Click;
                AppointmentButton(fieldName, fieldValue, event);
                OkButton();
            }
        } else {
            console.log(result.error); // logs the hold exception object
        }
    });
}

function HideButtonRow() {
    $("[id^='subCtrlPreviewRow26']").addClass("noButtons");
}

function onSubformRowClick(source) {
    $(source.currentTarget).closest('.subFormContentRowChildWrapper').find('.editSubFormRow ').click();
}

function OkButton() {
    $('.btnSummaryColumnsOK').click();
}

function CancelButton() {
    $('.btnSummaryColumnsCancel').click();
}