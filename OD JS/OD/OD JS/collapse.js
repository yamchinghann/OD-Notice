/*
 * JQuery WYSIWYG Web Form Designer
 * Copyright 2015 AgilePoint Inc
 */

/* Add your JS code Here (Press Ctrl+Space keys for intellisense) */

async function collapse(event, nRowToRemove) {
  try {
    // get SubFormId
    const subFormId = $(event.currentTarget).closest('.subFormContent').attr('id');
    // getSubFormData
    const subFormData = await getSubFormData(subFormId);
    // number of rows
    const nRow = subFormData.length;
    // current row number
    const rowN = $(event.currentTarget).closest('.subFormContentRow').index() + 1;
    
    var rowNToRemove = [];
    for (i=1; i<=nRowToRemove ; i++) {
      rowNToRemove.push(rowN+i);
    }
    
    await deleteRowsFromSubForm(subFormId, rowNToRemove.toString());
    await setFieldValue('SubFormMCInfo/HUSApprovalStatusSplitHUSDetailsHUSInfoHUSInfo: ['+rowN+']', 'Please Select');
    await triggerFormula('SubFormMCInfo/RuleHolderHUSInfoDetailsHUSInfo: ['+rowN+']');
    await triggerControlRule('SubFormMCInfo/RuleHolderHUSInfoDetailsHUSInfo: ['+rowN+']');
    await triggerFormula('SubFormMCInfo/HUSApprovalStatusDisplayHUSDetailsHUSI: ['+rowN+']');
  } catch (error) {
    console.error('@collapse: ' + error);
  }
}
