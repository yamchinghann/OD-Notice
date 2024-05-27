// Refresh supporting document lookup
function refreshGeneratedDocs() {
    triggerAutoLookup("gendoclookup", "LkGenDoc");
}

// View Generated Document
function viewGeneratedDoc_y() {
    let arrayDocs = getFormFieldValue(
        "GenDoc/rowGenDoc"
    ).split(",");
    let sRow = arrayDocs.indexOf("Yes") + 1;
    let url = getFormFieldValue(
        "GenDoc/DocumentURL: [" + sRow + "]"
    );
    window.open(url);
}

//download doc
function downloadGeneratedDoc() {
    let arrayDocs = getFormFieldValue(
        "GenDoc/rowGenDoc"
    ).split(",");
    let sRow = arrayDocs.indexOf("Yes") + 1;
    let url = getFormFieldValue(
        "GenDoc/DocumentURL: [" + sRow + "]"
    );
    downloadPDF(url);
}

function downloadPDF(url) {
    let link = document.createElement('a');
    link.href = url;
    link.download = 'file.pdf';
    link.dispatchEvent(new MouseEvent('click'));
    console.log("download"+ url);
}
