// Refresh supporting document lookup
function refreshContentLink() {
    let ts = getFormFieldValue(
        "SDList1/SupportingDocumentTimestamp:[1]"
    );
    if (ts) {
        triggerAutoLookup(
            "SDList1/LkFindSupportingDocuments:[1]",
            "LkUploadedDoc"
        );
    }
}

// To chain trigger after triggering lookup find supporting document
function postScan() {
    triggerControlRule("SupportingDocumentsSubForm/SupportingDocumentChecker");
    triggerSelectedSupportingDocFormula(
        "SupportingDocumentsSubForm/SupportingDocumentChecker"
    );
}

// Upload document to docuflo
function docufloScan() {
    try {
        const SchemeRefNo = getFormFieldValue("QueryIC");
        const timeStamp = new Date().getTime();
        const middlewareURL = getSystemValue("BARISTA_MIDDLEWARE");

        let docufloUrl =
            "http://10.7.51.145/WebLauncher/launch?m=post&url=" +
            middlewareURL[0].Value +
            "/Document/Upload&ref=" +
            SchemeRefNo +
            "&ref2=" +
            timeStamp;

        setFormFieldValue(
            "SDList1/SupportingDocumentTimestamp: [" + 1 + "]",
            timeStamp
        );
        setFormFieldValue(
            "SDList1/SourceofDocument1: [" +
            1 +
            "]",
            "204802"
        );
        let openWebScan = window.open(docufloUrl);
        openWebScan.addEventListener("beforeunload", function () {
            refreshContentLink();
        });
    } catch (e) {
        console.log(e);
    }
}
