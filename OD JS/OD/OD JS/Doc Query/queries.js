/*
 * JQuery WYSIWYG Web Form Designer
 * Copyright 2015 AgilePoint Inc
 */

/* Add your JS code Here (Press Ctrl+Space keys for intellisense) */

const queryURL = "/ApplicationBuilder/eFormRender.html?Process=Query%20Process";

// Refreshes Query Subform
function refreshQueryList() {
    triggerAutoLookup("LkQueryDocuments", "LkQueryDocs");
}

// Save list of query's status and first date, then refresh the query list
function saveStatus() {
    let originalStatus = getFormFieldValue("QuerySuppDoc/QueryStatusDDL: [*]");
    setFormFieldValue("QueryOriginalStatus", originalStatus);

    let queryDate1 = getFormFieldValue("QuerySuppDoc/QueryDateSuppDoc: [1]");
    setFormFieldValue("QueryDateSuppDoc", queryDate1);
    refreshQueryList();
}

// Navigate to create new Query Document
function newQuery() {
    try {
        let schemeRefNo = checkSchemeRefNo(getFormFieldValue('SchemeRefNoCaseInfo'), getFormFieldValue("TempSchemeRefNo"));
        let obName = getFormFieldValue("Name1"); //InsuredPersonName
        window.open(queryURL + "&schemerefno=" + schemeRefNo + "&obname=" + obName);
    } catch (e) {
        console.log(e);
    }
}

// View Query Letter
function viewQueryLetter() {
    let row = getFormFieldValue("QuerySuppDoc/QuerySelected");
    let rowIndex = row.split(",").indexOf("Yes") + 1;

    let url = getFormFieldValue(
        "QuerySuppDoc/QueryDocumentURL: [" + rowIndex + "]"
    );
    console.log(url);
    window.open(url);
}
