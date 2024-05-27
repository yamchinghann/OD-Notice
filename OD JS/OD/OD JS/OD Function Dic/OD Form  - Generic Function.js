eFormEvents.onFormLoadComplete = function (event) {
    console.log("Firing eFormEvents.onFormLoadComplete");

    if (window.populateInsuredPersonInfo) {
        populateInsuredPersonInfo();
    }

    if(window.generateTemporaryRefNo){
        generateTemporaryRefNo();
    }

    if (window.getODDate) {
        getODDate();
    }

    if(window.setSocsoOfficeFirstTime){
        setSocsoOfficeFirstTime();
    }
    setFormFieldValue('CurrentUser', logInUser());
};

eFormEvents.subForm.onAddRecord = function (eventArgs) {
    if (eventArgs.dataName === "SubForm1") {
        getODDate();
    }

    if (sf.dataName == "SubForm1" || sf.dataName == "AttendedWorkDetails") {
        processMCInfo();
    }
}

function generateTemporaryRefNo() {
    console.log("GenerateUserForTempRef & GetCurrentBranch");
    setCurrentUserForTempRef();

    setTimeout(() => {
        triggerAutoLookup('LkCurrentBranch', 'LkCurrentBranch');
    }, 100);
}

async function setSocsoOfficeFirstTime() {
    console.log("Executing setSocsoOfficeFirstTime() ...");
    let registrationOffice = getFormFieldValue("SOCSORegistrationOffice"); //PK's Initial Socso office
    let currentSocsoOffice = getFormFieldValue("SOCSOOfficeCaseInfoDDL"); //Preferred Socso
    let currentUserBranch = getFormFieldValue("CurrentBranch");
    let preferredOffice = getFormFieldValue('PreferredSocsoOffice');

    if(!currentUserBranch)
    {
        await triggerAutoLookup('LkCurrentBranch', 'LkCurrentBranch');
        currentUserBranch = getFormFieldValue("CurrentBranch");
    }

    let officeList = await sendApiCall(
        getMiddlewareHostName() + "/refdata/v2/options/raw/SocsoOffice",
        "GET",
        "");

    let currentBranchInfo = officeList.results.find((item) => {
        if (item.code1 == currentUserBranch) {
            return item;
        }
    });

    if(currentBranchInfo)
    {
        if (registrationOffice == "") {
            // is first time loading
            if (currentBranchInfo != null && currentBranchInfo != undefined) {
                setFormFieldValue("SOCSORegistrationOffice", currentBranchInfo.name1);
            }
        }

        if(preferredOffice == "" || preferredOffice == -1 || preferredOffice == "Please Select")
        {
            //set current branch to preferred SOCSO office
            setFormFieldValue("SocsoOfficeState", currentBranchInfo.parent2);
            await triggerAutoLookup("lkpOfficeByState", "LkSocsoOfficeByState");
            setFormFieldValue("PreferredSocsoOffice", currentBranchInfo.id);
        }
    }
    else
    {
        console.error("setSocsoOfficeFirstTime() could not search current branch info.");
    }
}