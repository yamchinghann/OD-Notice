/*
 * JQuery WYSIWYG Web Form Designer
 * Copyright 2015 AgilePoint Inc
 */

/* Add your JS code Here (Press Ctrl+Space keys for intellisense) */

async function setFieldValue(fieldId, value) {
  try {
    var options = {};
    options.fieldId = fieldId;
    options.value = value;
    eFormHelper.setFieldValue(options, await function (result) {});
  } catch (error) {
    console.error(error);
  }
}
