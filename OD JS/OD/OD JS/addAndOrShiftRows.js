/*
 * JQuery WYSIWYG Web Form Designer
 * Copyright 2015 AgilePoint Inc
 */

/* Add your JS code Here (Press Ctrl+Space keys for intellisense) */

async function addAndOrShiftRows(subFormId, subFormData, nRow, rowN, nRowToAdd) {
  try {
    // Initialize empty array
    const emptyArray = [{}];
    // Increase to the amount of rows to be added
    for (i=1; i < nRowToAdd; i++) { emptyArray.push({}); }
    // Add UI rows to SubForm (data shown is limited by rows shown in UI)
    await addRowsToSubForm(subFormId, emptyArray);

    // Array operation
    // Get SubForm data array
    var allRows = await getSubFormData(subFormId);
    // Get "data" of "empty" row ("empty" dropdown has value of "Please Select")
    var emptyRow = allRows[nRow];
    // Insert "empty" rows below selected row
    for (i=0; i < nRowToAdd ; i++) { allRows.splice(rowN, 0, emptyRow); }
    // Trimming empty rows added to the end (optional, SubForm does not store the excessive rows)
    allRows.splice(nRow+nRowToAdd, nRowToAdd);

    // Replace existing SubForm data with new array
    await setFieldValue(subFormId, {[subFormId]: allRows});
  } catch (error) {
    console.error('@addAndOrShiftRows: ' + error);
  }
}
