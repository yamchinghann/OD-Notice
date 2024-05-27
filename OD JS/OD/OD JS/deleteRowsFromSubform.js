/*
 * JQuery WYSIWYG Web Form Designer
 * Copyright 2015 AgilePoint Inc
 */

/* Add your JS code Here (Press Ctrl+Space keys for intellisense) */

async function deleteRowsFromSubForm(subFormId, rowIndex) {
  try {
    var options = {};
    options.fieldId = subFormId;
    options.rowIndex = rowIndex;
    eFormHelper.deleteRowsFromSubForm(options, await function(result) { });
  } catch (error) {
    console.error('@deleteRowsFromSubForm: '+error);
  }
}
