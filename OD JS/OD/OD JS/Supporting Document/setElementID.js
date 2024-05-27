function setElementId(form) {
    try {
        setFormFieldValue("SDList1/SupportingDocumentSFElementId:[1]", form.id);
        // Set File Name
        const el = document.getElementById(form.id).children.docuFloFile;
        const elLabel = document.getElementById(form.id).children.docuFloFileLabel;
        if (el.files.length > 0) {
            elLabel.innerHTML = el.files[0].name;
            updateProps("SDList1/DocufloFileUploadBtn:[1]", "Enabled", true);
        }
        setFormFieldValue("SDList1/SourceofDocument1: [" + 1 + "]", "204801");
    } catch (e) {
        console.log(e);
    }
}