/*
 * JQuery WYSIWYG Web Form Designer
 * Copyright 2015 AgilePoint Inc
 */

/* Add your JS code Here (Press Ctrl+Space keys for intellisense) */

async function getFieldValue(fieldId) {
  var returnValue;
  try {
    var options = {};
    options.fieldId = fieldId; // individual control
    // (or) options.fieldId = 'Subform1/TextBox1'; //search in all rows in a subform
    // (or) options.fieldId = 'Subform1/TextBox1: [*]'; //search in all rows in a subform
    // (or) options.fieldId = 'Subform1/TextBox1: [rowindex]'; // search in specific row in a subform
    eFormHelper.getFieldValue(options, await function (result) { 
      returnValue = result.data;
  	});
  } catch (error) {
    console.error("@getFieldValue: " + error);
  }
  return returnValue;
}