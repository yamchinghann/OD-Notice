// Upload File to Docuflo
function docufloFileUpload(file, id, ts) {
    try {
        console.log("execute docufloFileUpload method");
        const middlewareURL = getSystemValue("BARISTA_MIDDLEWARE");

        // Initialize JS FormData
        const formData = new FormData();
        const url = middlewareURL[0].Value + "/Document/Upload";
        formData.append("ref", id);
        formData.append("ref2", ts);
        formData.append("file", file);
        for (var p of formData) {
            let name = p[0];
            let value = p[1];
            console.log(name, value)
        }

        // API Call via JQuery
        $.ajax({
            url: url,
            data: formData,
            processData: false,
            contentType: false,
            type: "POST",
            complete: function () {
                console.log("Trigger SDList1/LkFindSupportingDocuments");
                triggerAutoLookup("SDList1/LkFindSupportingDocuments:[1]", "LkUploadedDoc");
            },
        });
    } catch (e) {
        console.log(e);
    }
}

// File Uploading
function fileUploadSf() {
    try {
        console.log("uploading");
        // Initialize vars1
        const formId = getFormFieldValue("SDList1/SupportingDocumentSFElementId:[1]");
        const url = getFormFieldValue("SDList1/SupportingDocumentFileContentLink:[1]");

        if (!url) {
            const el = document.getElementById(formId).children.docuFloFile;
            // Store element id into selected form field, then when uploading/viewing, select child of that element id
            if (el.files.length > 0) {
                let reader = new FileReader();

                const id = getFormFieldValue("QueryIC");

                let ts = getFormFieldValue("SDList1/SupportingDocumentTimestamp:[1]");
                if (!ts) {
                    ts = new Date().getTime();
                    setFormFieldValue("SDList1/SupportingDocumentTimestamp:[1]", ts);
                }

                // Attach function to be called when reading is completed
                reader.onloadend = function () {
                    // Transform base64 to JS File object
                    fetch(reader.result)
                        .then((res) => res.blob())
                        .then((blob) => {
                            console.log(el.files[0]);
                            // validate file size
                            if (validateFileSize(el.files[0].size)) {
                                if (validateFileType(el.files[0].type)) {
                                    const file = new File([blob], el.files[0].name, {
                                        type: el.files[0].type,
                                    });

                                    docufloFileUpload(file, id, ts);
                                } else {
                                    showDialogMessage("Invalid File Type");
                                }
                            } else {
                                showDialogMessage("File size cannot exceed 5Mb", "Error");
                            }
                        });
                };
                // Read Uploaded File
                reader.readAsDataURL(el.files[0]);
            }
        }
    } catch (e) {
        console.log(e);
    }
}

// Set Parent Form HTML ID
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

function resetDocuFloSubform() {
    deleteRowsToSubform("SDList1", "*");
    addRowsToSubForm("SDList1", [{}]);
    updateProps("SDList1", "Visible", false);
    updateProps("SDList", "Visible", true);
    updateProps("AddSupportingDocumentBtn", "Visible", true);
}

function insertSupportingDoc() {
    try {
        const data = getSubFormData("SDList1");
        if (!data[0].DocumentStatus1) {
            data[0].DocumentStatus1 = "205301";
        }
        const obj = {
            SDDocNameDDL: data[0].DocumentName1,
            SDDocDesc: data[0].DocumentDescription1,
            SDReceivedDate: data[0].ReceivedDate1,
            SDUploadDate: data[0].UploadDate1,
            SDUploadedBy: data[0].UploadedBy,
            SourceofDocument: data[0].SourceofDocument1,
            DocumentType1: data[0].DocumentType2,
            SDDocumentStatus: data[0].DocumentStatus1,
            URL: data[0].SupportingDocumentFileContentLink,
            SDDocufloTimestamp: data[0].SupportingDocumentTimestamp,
        };
        addRowsToSubForm("SDList", [obj]);
        resetDocuFloSubform();
    } catch (e) {
        console.log(e);
    }
}

// Open documents from docuflo in new tab
function docufloViewSf() {
    let getRow = getFormFieldValue("SDList/SDSelected").split(",");
    let contentRow = getRow.indexOf("Yes") + 1;
    let url = getFormFieldValue("SDList/URL: [" + contentRow + "]");
    if (!url) {
        const rtsRefNo = getFormFieldValue("QueryIC");
        let timestamp = getFormFieldValue("SDList/SDDocufloTimestamp:[" + contentRow + "]");
        setFormFieldValue("docufloTimestamp", timestamp);
        //console.log(ssnRefNo, timestamp);
        triggerAutoLookup("LkDocufloFileView", null);
    } else {
        window.open(url);
    }

    setFormFieldValue("SDList/SDDocumentStatus: [" + contentRow + "]", "205304");
}

// Failsafe to retrieve url for supporting document
function manualDocufloView() {
    try {
        let url = getFormFieldValue("docufloURL");
        window.open(url);
        return url;
    } catch (e) {
        console.log(e);
    }
}

// Enable Confirmation button
function allowSD() {
    const url = getFormFieldValue("SDList1/SupportingDocumentFileContentLink:[1]");
    let state = false;
    if (url) {
        state = true;
    }
    updateProps("SDList1/SupportingDocumentConfirmBtn:[1]", "Enabled", state);
}

// validate uploaded file is under 5Mb
function validateFileSize(fileSize) {
    const megabit = 1000000;
    const fSize = fileSize / megabit;
    if (fSize < 5) {
        return true;
    } else {
        return false;
    }
}

// validate file types, yet to be confirmed
function validateFileType(fileType) {
    return true;

    // const validTypes = ["application/pdf", "image/png", "image/jpeg"];
    // if (validTypes.includes(fileType)) {
    //   return true;
    // } else {
    //   return false;
    // }
}
