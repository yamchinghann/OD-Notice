async function isValidSAOSubmission() {
    let SimilarWorkerOption = getFormFieldValue("SimilarWorkerDropdown");
    let MinWageOption = getFormFieldValue("MinWageDropdown");
    let isBeforeSMB = (getFormFieldValue("HideSMB") == "1" && getFormFieldValue("ActionApprovalAfterMB") == "-1");
    //let isAfterSMB = (getFormFieldValue("ActionApprovalAfterMB") === "10203" || getFormFieldValue("ActionApprovalAfterMB") !== "-1");
    if (isBeforeSMB === false) {
        let isRejected = await isAllRejectWages().then((result) => {
            return result
        });
        if (isRejected === true) {
            if ((SimilarWorkerOption !== "Yes" && MinWageOption !== "Yes") === true) {
                showDialogMessage("Please set minimum wages to yes or provide a similar worker!", "Error");
                navigateTo("Wages Information");
            } else {
                let wagesInfoList = getSubFormData("SimilarWorkerInfoWagesInfo2");
                if (SimilarWorkerOption === "Yes") {
                    if (wagesInfoList.length <= 0) {
                        showDialogMessage(
                            "Please make Similar Work Info!",
                            "Error",
                        );
                        navigateTo("Wages Information");
                    } else if (await isAllRejectSimilarWorkerWages() === true) {
                        showDialogMessage(
                            "At least one similar worker's wage is accepted!",
                            "Error",
                        );
                    }else{
                        console.log("After SMB/SAO Submit & Approval - Similar Worker is Yes");
                        await submitFunction();
                    }
                }else{
                    console.log("After SMB/SAO Submit & Approval - Minimum Wages is Yes");
                    await submitFunction();
                }
            }
        } else {
            console.log("After SMB/SAO Submit & Approval - Not All Wages are Rejected");
            await submitFunction();
        }
    } else {
        console.log("Before SMB/SAO Submit #1");
        await submitFunction();
    }
}
