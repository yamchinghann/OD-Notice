/*
 * JQuery WYSIWYG Web Form Designer
 * Copyright 2015 AgilePoint Inc
 */

/* Add your JS code Here (Press Ctrl+Space keys for intellisense) */

function onSaoEIChange(event) {
    console.log("Start");
    debugger;
    var options = {};
    options.fieldId = 'ApprovalSubForm11/EmploymentInjuryADetailsSAOA'; // individual control
    // (or) options.fieldId = 'Subform1/TextBox1'; //search in all rows in a subform
    // (or) options.fieldId = 'Subform1/TextBox1: [*]'; //search in all rows in a subform
    // (or) options.fieldId = 'Subform1/TextBox1: [rowindex]'; // search in specific row in a subform
    eFormHelper.getFieldValue(options, function (result) {
        console.log(result);
        var shouldShowEI = result.data == 'No'
        eFormHelper.updateFieldProperty({
            fieldId: 'InvalidityPensionReceiver',
            propertyName: eFormHelper.constants.fieldProperty.Visible,
            value: shouldShowEI
        }, function (ee) {
            console.log(ee)
        })
    });
}