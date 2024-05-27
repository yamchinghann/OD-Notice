/*
 * JQuery WYSIWYG Web Form Designer
 * Copyright 2015 AgilePoint Inc
 */

/* Add your JS code Here (Press Ctrl+Space keys for intellisense) */

async function addRowsToSubForm(fieldId, fieldValue) {
  try {
    var options = {};
    options.fieldId = fieldId;  
    // options.value is optional
    if (!!fieldValue) {
      options.value = fieldValue;
    }
    eFormHelper.addRowsToSubForm(options, await function (result) { });
  } catch (error) {
    console.error('@onAddRowsToSubForm: ' + error);
  }
}
