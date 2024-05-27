/*
 * JQuery WYSIWYG Web Form Designer
 * Copyright 2015 AgilePoint Inc
 */

/* Add your JS code Here (Press Ctrl+Space keys for intellisense) */

const opinionURL =
    "/ApplicationBuilder/eFormRender.html?Process=Opinion%20Request%20App";

// Opinions
function refreshOpinions() {
    triggerAutoLookup("LkOpinions", "LkOpinions");
    // triggerAutoLookup("LkRequestedOpinions", "LkRequestedOpinions");
}

function newOpinion() {
    const role = getFormFieldValue("OpinionRole");
    const revRefNo = getFormFieldValue("SchemeRefNoCaseInfo");
    window.open(
        opinionURL + "&action=n&role=" + role + "&schemerefno=" + revRefNo
    );
}

function actionOpinion(action) {
    /*
    n,c = create
    v,r = read
    u = update
    d = delete
    */
    const sf = getFormFieldValue("OpinionSF/OpinionSelected").split(",");
    const index = sf.indexOf("Yes") + 1;
    const id = getFormFieldValue("OpinionSF/OpinionID:[" + index + "]");

    const role = getFormFieldValue("OpinionRole");
    window.open(opinionURL + "&role=" + role + "&action=" + action + "&id=" + id);
}

function submitOpinion() {
    try {
        const medicalReqId = getFormFieldValue("medicalreqid");
        const ppnAroReqId = getFormFieldValue("ppnreqid");
        const aroReqId = getFormFieldValue("aroreqid");
        const role = getFormFieldValue("OpinionRole");
        let opinionLength = getSubFormData("OpinionSF");

        if (role == "SCO") {
            setFormMandatory("SCORecommendationDDL", false);
        } else if (role == "SAO") {
            setFormMandatory("ApprovalAction", false);
        }
        let reqOpinions = [];

        if (medicalReqId) {
            reqOpinions.push("Medical");
        }
        if (ppnAroReqId) {
            reqOpinions.push("PPN/ARO");
        }
        if (aroReqId) {
            reqOpinions.push("ARO");
        }

        // values not being set
        let reqOpinionsStr = reqOpinions.join(";");
        setFormFieldValue("SubmitForOpinion", reqOpinionsStr);
        console.log(reqOpinionsStr);

        if(reqOpinionsStr.length > 0 && opinionLength.length > 0){
            setTimeout(() => {
                disableMandatoryFields();
                $(OpinionSubmit).click();
            }, 2000);
        }
    } catch (e) {
        if (role == "SCO") {
            setFormMandatory("SCORecommendationDDL", true);
        } else if (role == "SAO") {
            setFormMandatory("ApprovalAction", true);
        }
        console.log(e);
    }
}

// Opinion Queries
function refreshOpinionQueries() {
    triggerAutoLookup("LkOpinionQueries", "LkOpinionQueries");
    return;
}

function cancelOpinionQuery() {
    document.getElementsByClassName("btnSummaryColumnsCancel")[0].click();
    setOpinionQueryViewState(true);
}

function saveOpinionQuery() {
    document.getElementsByClassName("btnSummaryColumnsOK")[0].click();
    setOpinionQueryViewState(true);
}

function viewOpinionQuery(event) {
    $(event.target)
        .closest(".subFormContentRowChildWrapper")
        .find(".editSubFormRow ")
        .click();
    setOpinionQueryViewState(false);
}

function setOpinionQueryViewState(state) {
    updateProps("OpinionQuerySF/OpinionQueryDate", "Visible", state);
    updateProps("OpinionQuerySF/OpinionQueryFeedbackDate", "Visible", state);
    updateProps("OpinionQuerySF/OpinionQueryViewBtn", "Visible", state);
}

function submitOpinionQuery() {
    setFormFieldValue("SendFeedback", "Yes");
    setTimeout(() => {
        $(OpinionSubmit).click();
    }, 2000);
}

function disableMandatoryFields(){
    let uneditableFormFields =
        [
            'RaceDDL', 'AddStateIPI', 'CityIPI','BankNameLocalBankDDL', 'PostcodeInsuredPersonInfo',
            'DescriptionofOD', 'CausativeAgentPrevention', 'Isthediseaserelatedtoemployment','Specifydutiesandhowinsuredpersonexposedtothedanger',
            'Pleaseexplainsymptomssignencountered', "BankAccountStatus1"
        ];
    for (let fieldItem in uneditableFormFields){
        updateProps(uneditableFormFields[fieldItem], 'Mandatory', false);
    }
    let disableSubformFields = ['EmployerInfoSubformEI/StateEIRow:[*]', 'EmployerInfoSubformEI/CityEI:[*]', 'EmployerInfoSubformEI/PostcodeEI:[*]',
                                        'StatementSection12cDetailsSS12cID/StatementDateIISS12cDetailsSS12cID:[*]', 'StatementSection12cDetailsSS12cID/StatementTimeIISS12cDetailsSS12cID:[*]',
                                        'StatementSection12cDetailsSS12cID/InterviewerNameIrISS12cDetailsSS12cID:[*]', 'StatementSection12cDetailsSS12cID/InterviewerNameTIrISS12cDetailsSS12cID:[*]',
                                        'StatementSection12cDetailsSS12cID/IntervieweeTypeIeISS12cDetailsSS12cID:[*]', 'StatementSection12cDetailsSS12cID/IdentificationNumberIrISS12cDetailsSS12cID:[*]',
                                        'StatementSection12cDetailsSS12cID/IntervieweeNameIeISS12cDetailsSS12cID:[*]', 'StatementSection12cDetailsSS12cID/IdentificationTypeIeISS12cDetailsSS12cID:[*]',
                                        'StatementSection12cDetailsSS12cID/IdentificationNumberIeISS12cDetailsSS12cID:[*]', 'StatementSection12cDetailsSS12cID/AddressLine1IeISS12cDetailsSS12cID:[*]',
                                        'StatementSection12cDetailsSS12cID/StateIeISS12cDetailsSS12cID:[*]', 'StatementSection12cDetailsSS12cID/CityIeISS12cDetailsSS12cID_1:[*]',
                                        'StatementSection12cDetailsSS12cID/PostcodeIeISS12cDetailsSS12cID:[*]'
                                        ];
    for (let fieldItem in disableSubformFields){
        updateProps(disableSubformFields[fieldItem], 'Mandatory', false);
    }
    console.log("All Mandatory Fields are disable");
}

//MB - Opinion
window.addEventListener("focus", function () {
    refreshContentLink(); // Supporting Documents refresh
    refreshQueryList(); // Query Documents Status refresh
    triggerAutoLookup("LKOpinionID", "LKOpinionID"); //MB Opinion refresh
});