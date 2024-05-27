function radField(fieldName) {
    var options = {};
    var totalMonths = "";
    var totalRows = "";
    var currentMonth = "";
    options.fieldId = fieldName;
    eFormHelper.getFieldValue(options, function (results) {
        if (results.isSuccess) {
            var monthRows = results.data.split(',');
            currentMonth = results.data;
            totalMonths = monthRows;
            totalRows = monthRows.length + 1
        } else (
            console.log('vegas light')
        )
    })
    return [currentMonth, totalRows]
}

function setMonthNum(field, val) {
    var option = {};
    option.fieldId = field;
    option.value = val;
    eFormHelper.setFieldValue(option, function (res) {
        if (res.isSuccess) {
            console.log('yay')
        } else (
            console.log('idk')
        )
    })

}

function convMonth() {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var info = radField('WagesInformationSubform/WagesDetailWagesInfo/MonthWagesInfo');
    console.log('new' + ' ' + info[1]);

    //if contribution is 0, set field wages read only

    for (var i = 1; i <= info[1]; i++) {
        var arr = radField('WagesInformationSubform/WagesDetailWagesInfo/MonthWagesInfo: [' + i + ']');
        console.log(arr[0]);
        let respNumber = months.indexOf(arr[0]) + 1;
        setMonthNum('WagesInformationSubform/WagesDetailWagesInfo/MonthInNumber: [' + i + ']', respNumber);
    }
}

function triggerLkWages() {
    if (!getFormFieldValue("FinalNoticeDate")) {
        setFormFieldValue("FinalNoticeDate", getCurrentDate());
    }
    triggerAutoLookup("AutoLookup34", "LKGetContribution")
    // await triggerLk("GetAllContributions", null);
    // await triggerLk("WagesInformationSubform/GetContributions", null);
}

async function searchSimilarWorker() {
    showLoading(true);
    let EmployerCode = getFormFieldValue("EmployerCode");
    let IC = getFormFieldValue("IdentificationNoWageInfo");
    if (!EmployerCode || !IC) {
        if (!EmployerCode) {
            message("Employer Code Not Found");
            updateProps("EmployerCode", "Mandatory", true);
        } else if (!IC) {
            message("Identification No. Not Found");
            updateProps("IdentificationNoWageInfo", "Mandatory", true);
        } else {
            message("Employer Code and Identification No. Not Found");
            updateProps("IdentificationNoWageInfo", "Mandatory", true);
            updateProps("EmployerCode", "Mandatory", true);
        }
    } else {
        try {
            console.log("searching similar worker");
            resetSWField();
            let contribution = await apiCall("POST", getMiddlewareHostName() + "/barista/contribution", {
                identificationType: getFormFieldValue("IdTypeWageDDL"),
                identificationNo: getFormFieldValue("IdentificationNoWageInfo"),
                employerCode: getFormFieldValue("EmployerCode"),
                noticeDate: getFormFieldValue("FinalNoticeDate")
            });
            if (contribution) {
                viewSWSection(true);
                setFormVisible("SimilarWorkerInfoWagesInfo2", true);
                setFormFieldValue("NameAN", contribution.name);
                setFormFieldValue("IdentificationTypeAN", contribution.identificationInfoList[0].identificationTypeString);
                setFormFieldValue("IdentificationNoAN", contribution.identificationInfoList[0].identificationNo);
                setFormFieldValue("EmployeeIDAN", contribution.employeeId);
                setFormFieldValue("EmployerNameAN", contribution.employmentInfoList[0].employerName);
                setFormFieldValue("EmployerCodeAN", contribution.employmentInfoList[0].employerCode);
                setFormFieldValue("EmploymentStartDateAN", contribution.employmentInfoList[0].commencementDate);
                setFormFieldValue("EmploymentEndDateAN", contribution.employmentInfoList[0].endDate);
                setFormFieldValue("SecondCategoryYearAN", contribution.contributionStartSecondCategoryYear);
                setFormFieldValue("SecondCategoryMonthAN", contribution.contributionStartSecondCategoryMonth);

                deleteRowsToSubform("SimilarWorkerInfoWagesInfo2", "*");
                let contributionList = [];
                for (let x of contribution.employmentInfoList[0].contributionList) {
                    let payload = {
                        YearWagesInfoSub2: x.contributionYear,
                        MonthWagesInfoSub2: x.contributionMonth,
                        RMWagesSCOSub2: x.assumedWages,
                        ContributionPaidRMSCOSub2: x.contributionAmount,
                        isRefundedRdioBtn_SimilarWorker: x.isRefunded
                    }
                    addRowsToSubForm("SimilarWorkerInfoWagesInfo2", [ObjValueToString(payload)]);
                }
                setFormFieldValue("usedSW", "Yes");
            } else {
                setFormVisible("SimilarWorkerInfoWagesInfo2", true);
                setFormFieldValue("IdentificationTypeAN", contribution.identificationInfoList[0].identificationTypeString);
                setFormFieldValue("IdentificationNoAN", contribution.identificationInfoList[0].identificationNo);
                setFormFieldValue("NameAN", contribution.name);
                showDialogMessage("This employee has no employment at the point of accident date.", "Error");
                showLoading(false);
            }
        } catch (e) {
            console.log(e);
            showLoading(false);
        }
    }
}


function viewSimilarWorkerSearchSection(SWSearchSection) {
    let wantSWSearch = Boolean(SWSearchSection);
    setFormVisible("SimilarWorkerInfo", wantSWSearch);
    setFormVisible("EmployerCode", wantSWSearch);
    setFormVisible("IdTypeWageDDL", wantSWSearch);
    setFormVisible("IdentificationNoWageInfo", wantSWSearch);
    setFormVisible("Button61", wantSWSearch);
}

function resetSWField() {
    viewSWSection(false);
    setFormVisible("SimilarWorkerInfoWagesInfo2", false);
    setFormFieldValue("IdentificationTypeAN", "");
    setFormFieldValue("IdentificationNoAN", "");
    setFormFieldValue("NameAN", "");
    setFormFieldValue("EmployerCodeAN", "");
    setFormFieldValue("EmployerNameAN", "");
    setFormFieldValue("EmploymentStartDateAN", "");
    setFormFieldValue("EmploymentEndDateAN", "");
}

function viewSWSection(state) {
    setFormVisible("IdentificationTypeAN", state);
    setFormVisible("IdentificationNoAN", state);
    setFormVisible("NameAN", state);
    setFormVisible("EmployerCodeAN", state);
    setFormVisible("EmployerNameAN", state);
    setFormVisible("EmploymentStartDateAN", state);
    setFormVisible("EmploymentEndDateAN", state);
}

function checkUsedSW() {
    if (getFormFieldValue("usedSW") === "Yes") {
        viewSWSection(true);
        setFormVisible("SimilarWorkerInfoWagesInfo2", true);
    }
}

function resetWholeSimilarWorkerSearch(){
    viewSimilarWorkerSearchSection(false);
    setFormVisible("Heading9", false);
    viewSWSection(false);
    deleteRowsToSubform("SimilarWorkerInfoWagesInfo2", "*");
    setFormVisible("SimilarWorkerInfoWagesInfo2", false);
}

//checking Employment Wages for Similar Worker
async function getWagesAcceptListItem(wagesInfoList) {
    let arrayOfWages = [];
    if (wagesInfoList != undefined && wagesInfoList != null) {
        let wagesList = wagesInfoList;
        if (wagesList.WagesDetailWagesInfoSubForm1_SubForm.WagesDetailWagesInfoSubForm1 != undefined && wagesList.WagesDetailWagesInfoSubForm1_SubForm.WagesDetailWagesInfoSubForm1 != null) {
            for (let j = 0; j < wagesList.WagesDetailWagesInfoSubForm1_SubForm.WagesDetailWagesInfoSubForm1.length; j++) { //all are mandatory
                let item = wagesList.WagesDetailWagesInfoSubForm1_SubForm.WagesDetailWagesInfoSubForm1[j];
                arrayOfWages.push(item.AcceptWagesInfoSub1);
            }
        }
    }
    return arrayOfWages;
}

async function isAllRejectWages() {
    const allAcceptOptions = [];
    let wagesInfoList = getSubFormData("WagesDetails6Months");
    for (let i = 0; i < wagesInfoList.length; i++) {
        let wages = await getWagesAcceptListItem(wagesInfoList[i]);
        allAcceptOptions.push(wages);
    }
    return allAcceptOptions.every((subAccept) => subAccept.every((item) => item == "No"));
}

async function getSimilarWorkerWagesAcceptListItem(wagesInfoList) {
    let arrayOfWages = [];
    if (wagesInfoList != undefined && wagesInfoList != null) {
        let wagesList = wagesInfoList;
        for (let j = 0; j < wagesList.length; j++) { //all are mandatory
            arrayOfWages.push(wagesList[j].AcceptWagesInfoSub2 );   
        }
    }
    return arrayOfWages;
}

async function isAllRejectSimilarWorkerWages() {
    let wagesInfoList = getSubFormData("SimilarWorkerInfoWagesInfo2");
    let wages = await getSimilarWorkerWagesAcceptListItem(wagesInfoList);
    return wages.every((subAccept) => subAccept === "No");
}

function checkWagesForSimilarWorker(){
    let SimilarWorkerOption = getFormFieldValue("SimilarWorkerDropdown");
    let MinWageOption = getFormFieldValue("MinWageDropdown");
    let isBothMinSimilarIsYes = ((SimilarWorkerOption === "No") && (MinWageOption === "No"));
    isAllRejectWages().then((result) => {
        if(result === true){
            if(isBothMinSimilarIsYes === true){
                updateProps("SimilarWorkerDropdown", "Enabled", true);
                updateProps("MinWageDropdown", "Enabled", true);
            }else{
                triggerControlRule("SimilarWorkerDropdown");
            }
        }else{
            updateProps("SimilarWorkerDropdown", "Enabled", false);
            updateProps("MinWageDropdown", "Enabled", false);
            setFormFieldValue("SimilarWorkerDropdown", "No");
            setFormFieldValue("MinWageDropdown", "No");
            updateProps("SearchAN", "Enabled", false);
            resetWholeSimilarWorkerSearch();
        }
    })
        .catch((e) => {
        console.error(e);
    });
}