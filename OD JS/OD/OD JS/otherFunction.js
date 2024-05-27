window.addEventListener("focus", function () {
    refreshContentLink(); // Supporting Documents refresh
    refreshQueryList(); // Query Documents Status refresh
    refreshMedicalBoard(); //refresh Medical Board
    refreshOpinions(); //refresh Opinion
    refreshAppointment();//refresh Appointment
    //setCaseType("REJ")
    refreshList();
    saveStatus();
});

function emptyRouteTo(){
    getFormFieldValue("RouteDetailsR/RouteToRDetailsR");
}

function getBasicEmployeeInfo(){
    const IC = getFormFieldValue("QueryIC");
    const ICType = getFormFieldValue("QueryIDType");
    const EmployeeCode = getFormFieldValue("QueryEmployerCode");
    const NoticeDate = getFormFieldValue("FinalNoticeDate");
    const ProcessInitiator = getFormFieldValue("First_ProcessInitiator");
    console.log("IC: ", IC);
    console.log("IC Type: ", ICType);
    console.log("Employee Code: ", EmployeeCode);
    console.log("Notice Date: ", NoticeDate);
}