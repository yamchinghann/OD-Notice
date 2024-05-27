function refreshMedicalBoard() {
    triggerAutoLookup("LKODSMBSF", "LKODSMBSF");
    getMBFinalDetails();
}

function navToMB(action) {
    const noticeType = getFormFieldValue("SMBInfoNoticeType");
    const srn = getFormFieldValue("SchemeRefNoCaseInfo");

    let link =
        "/ApplicationBuilder/eFormRender.html?Process=Medical%20Board%20Process" +
        "&action=" +
        action +
        "&notice-type=" +
        noticeType +
        "&scheme-ref-no=" +
        srn;
    console.log(link);
    window.open(link);
}

function setOriginalSchemeRefNo() {
    const schemeRefNo = getFormFieldValue("SchemeRefNoCaseInfo");
    let originalSRN = schemeRefNo.split("-")[0];
    setFormFieldValue("OriginalSchemeRefNo", originalSRN);
}

function getMBFinalDetails() {
    let mbDecisionList = getSubFormData("ODSMBSF");
    let finalElsDecision = '';
    let finalAssessmentPercentage = '';

    if(mbDecisionList || mbDecisionList.length > 0){
        //when does not have final assessment type get the latest assessment
        if (finalElsDecision == '' || finalAssessmentPercentage == '') {
            finalAssessmentPercentage = mbDecisionList[mbDecisionList.length - 1].ODSF1SessionAssessment;
            finalElsDecision = mbDecisionList[mbDecisionList.length - 1].ODSF1ELS;
        }
    }

    setFormFieldValue("FinalAssessment", finalAssessmentPercentage);
    setFormFieldValue("FinalELSDecision", finalElsDecision);
}