// Initialzie Opinion Feedback for MB/ARO/PPN
function initOpinionFeedback() {
    setOpinionFeedbackBy();

    const havePPN = getFormFieldValue("havePPN");
    // Check Role
    const role = getFormFieldValue("OFRole");
    if (role.toLowerCase() == "ppn") {
        updateProps("OFSendtoARODDL", "Visible", true);
        updateProps("OFPPNFeedback", "Visible", true);
        updateProps("OFAROFeedback", "Visible", false);
    } else if (role.toLowerCase() == "aro") {
        updateProps("OFSendtoARODDL", "Visible", false);
        updateProps("OFPPNFeedback", "Visible", false);
        updateProps("OFAROFeedback", "Visible", true);
    } else if (role.toLowerCase() == "medical") {
    }

    if (havePPN == "Yes") {
        updateProps("OFSendtoARODDL", "Visible", true);
        updateProps("OFPPNFeedback", "Visible", true);
        updateProps("OFSendtoARODDL", "Enabled", false);
        updateProps("OFPPNFeedback", "Enabled", false);
    }
}

// Set User Name
function setOpinionFeedbackBy() {
    const user = getUserInfo();
    setFormFieldValue("OFBy", user.userName);
}

// Medical Query
function medicalQueryCancel() {
    $(".ap-fb-subformSummaryRowCancel").click();
}

function medicalQuerySave() {
    try {
        $(".ap-fb-subformSummaryRowOk").click();

        const sf = getSubFormData("MedicalQuerySF");
        if (sf.length > 0) {
            updateProps("OFSendQueryBtn", "Visible", true);
        }
    } catch (e) {
        console.log(e);
    }
}

function medicalSendQuery() {
    setFormFieldValue("OFSendQuery", "Yes");
    $(OFSubmitFeedbackBtn).click();
}
