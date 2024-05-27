/*
 * JQuery WYSIWYG Web Form Designer
 * Copyright 2015 AgilePoint Inc
 */

/* Add your JS code Here (Press Ctrl+Space keys for intellisense) */

async function breakdown(event, nRowToAdd) {
  try {
    // get SubFormId
    const subFormId = $(event.currentTarget).closest('.subFormContent').attr('id');
    // getSubFormData
    const subFormData = await getSubFormData(subFormId);
    // number of rows
    const nRow = subFormData.length; 
    // current row number
    const rowN = $(event.currentTarget).closest('.subFormContentRow').index() + 1;
    // current row status
    const statusRowN = await getFieldValue('SubFormMCInfo/HUSStatusHUSDetailsHUSI: ['+rowN+']');
    // current row start date
    const startDateRowN = await getFieldValue('SubFormMCInfo/StartDateHUSInfo: ['+rowN+']');
    // current row end date
    const endDateRowN = await getFieldValue('SubFormMCInfo/EndDateHUSInfo: ['+rowN+']');
    
    await addAndOrShiftRows(subFormId, subFormData, nRow, rowN, nRowToAdd);
    await setFieldValue('SubFormMCInfo/HUSApprovalStatusSplitHUSDetailsHUSInfoHUSInfo: ['+rowN+']', 'Split');
    await triggerFormula('SubFormMCInfo/RuleHolderHUSInfoDetailsHUSInfo: ['+rowN+']');
    await triggerControlRule('SubFormMCInfo/RuleHolderHUSInfoDetailsHUSInfo: ['+rowN+']');
    await triggerFormula('SubFormMCInfo/HUSApprovalStatusDisplayHUSDetailsHUSI: ['+rowN+']');
    await triggerFormula('SubFormMCInfo/EligibleHUSHUSInfoDetailsHUSInfo: ['+rowN+']');
    await triggerFormula('TotalEligibleHUSDaysHUSInfo');
    for ( i=1 ; i<=nRowToAdd ; i++ ) {
      await setFieldValue('SubFormMCInfo/HUSStatusHUSDetailsHUSI: ['+(rowN+i)+']', statusRowN);
      await triggerControlRule('SubFormMCInfo/HUSStatusHUSDetailsHUSI: ['+(rowN+i)+']');
      await setFieldValue('SubFormMCInfo/HUSApprovalStatusSplitHUSDetailsHUSInfoHUSInfo: ['+(rowN+i)+']', 'Split Child');
      await triggerFormula('SubFormMCInfo/RuleHolderHUSInfoDetailsHUSInfo: ['+(rowN+i)+']');
      await triggerControlRule('SubFormMCInfo/RuleHolderHUSInfoDetailsHUSInfo: ['+(rowN+i)+']');
      await triggerFormula('SubFormMCInfo/HUSApprovalStatusDisplayHUSDetailsHUSI: ['+(rowN+i)+']');
      console.log('set');
    }
    
    // layout for the rest of the rows
    for ( let r = rowN+nRowToAdd+1 ; r <= nRow+nRowToAdd ; r++ ) {
      await triggerControlRule('SubFormMCInfo/RuleHolderHUSInfoDetailsHUSInfo: ['+r+']');
    }
    
    // fix start date and end date
    await setFieldValue('SubFormMCInfo/StartDateHUSInfo: ['+(rowN+1)+']', startDateRowN);
    await setFieldValue('SubFormMCInfo/EndDateHUSInfo: ['+(rowN+nRowToAdd)+']', endDateRowN);
    await updateFieldProperty('SubFormMCInfo/StartDateHUSInfo: ['+(rowN+1)+']', 'Enabled', false);
    await updateFieldProperty('SubFormMCInfo/EndDateHUSInfo: ['+(rowN+nRowToAdd)+']', 'Enabled', false);
  } catch (error) {
    console.error('@breakdown: ' + error);
  }
}
