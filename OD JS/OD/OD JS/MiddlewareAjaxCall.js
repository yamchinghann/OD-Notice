/*
 * JQuery WYSIWYG Web Form Designer
 * Copyright 2015 AgilePoint Inc
 */

/* Add your JS code Here (Press Ctrl+Space keys for intellisense) */

function fetchInsuredPersonInfo() {
    try {
        let middlewareHostDomain = getMiddlewareHostName();

        let callInsuredPersonURL = middlewareHostDomain + "/barista/InsuredPerson";
        let callEmployeeSearchURL = middlewareHostDomain + "/assist-ws/employee/search";

        let dataPayload = {
            "identificationType": getFormFieldValue("QueryIDType"),
            "identificationNo": getFormFieldValue("QueryIC")
        }

        //get Insured Person Info
        sendApiCall
        (callInsuredPersonURL, "post", dataPayload)
            .then((result) => {
                setFormFieldValue('Name1', result.name);

                if (result.dateOfBirth) {
                    setFormFieldValue("DateofBirth", Date.parse(result.dateOfBirth));
                }
                setFormFieldValue("RaceDDL", result.raceId);
                setFormFieldValue("GenderIPI", result.genderId);
                setFormFieldValue("SubOccupationList", result.subOccupationListIds);
                setFormFieldValue("AddressInsuredPersonInfo", result.address);
                setFormFieldValue("AddStateIPI", result.stateId);
                //trigger Control Rule for City filter
                triggerAutoLookup('AutoLookup25', 'LkCity');
                setFormFieldValue("CityIPI", result.cityId);
                setFormFieldValue("PostcodeInsuredPersonInfo", result.postcode);
                setFormFieldValue("POBoxInsuredPersonInfo", result.poBox);
                setFormFieldValue("LockedBagInsuredPersonInfo", result.lockedBag);
                setFormFieldValue("WDTInsuredPersonInfo", result.wdt);
                setFormFieldValue("HouseTelephoneNo", result.housePhoneNumber);
                setFormFieldValue("MobileNo1", result.mobileNumber);
                setFormFieldValue("EmailAddress1", result.emailAddress);
                setFormFieldValue("NationalityDDL", result.nationalityId);
                //setFormFieldValue("insuredIdLk", result.id);

                //clear subform rows first
                deleteRowsToSubform("IdentificationDetailsIPI", "*");

                for (let i = 0; i < result.identifications.length; i++) {
                    let object = new Object();
                    object.IdentificationTypeIDetailsIPI = result.identifications[i].identificationTypeName;
                    object.IdentificationNumberIDetailsIPI = result.identifications[i].identificationNo;
                    addRowsToSubForm("IdentificationDetailsIPI", [object]);
                }

            }).catch((error) => {
            throw new Error(error);
        });

        //get Insured Person Info's employee ID
        sendApiCall(callEmployeeSearchURL, "POST", dataPayload).then((result) => {
            setFormFieldValue("EmployeeID", result.employeeInfoList[0].employeeId)
        }).catch((error) => {
            throw new Error(error);
        });
    } catch (e) {
        console.error("Error in fetchInsuredPersonInfo() : " + e);
    }
}

function populateInsuredPersonInfo() {
    let identificationList = getSubFormData("IdentificationDetailsIPI");
    let userName = getFormFieldValue('Name1');

    if (userName == '' && identificationList.length <= 0) {
        fetchInsuredPersonInfo();
    }
}

async function getWagesInfo() {
    try {
        let identificationNo = getFormFieldValue("QueryIC1");
        let identificationType = getFormFieldValue("QueryIDType1");
        let noticeReceivedDate = getFormFieldValue("NoticeandBenefitClaimFormReceivedDate_InsuredPersonInfo");

        await triggerAutoLookup('LkContributionRequirementJson', 'LkContributionRequirementJson');

        let ContributionRequirementJson = JSON.parse(getFormFieldValue('ContributionRequirementJson'));

        let middlewareHostAddress = getMiddlewareHostName();

        if (noticeReceivedDate == '') {
            noticeReceivedDate = Date.now();
        }

        //remove existing item in the subform
        deleteRowsToSubform("SIWagesSubform", "*");

        $.ajax({
            url: middlewareHostAddress + "/assist-ws/employee/getContributionInvalidity",
            method: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                "identificationNo": identificationNo,
                "identificationType": identificationType,
                "contributionMonthFrom": formatDateToYYYYMMDD(noticeReceivedDate),
            }),
            success: (result) => {
                //remove existing item in the subform
                deleteRowsToSubform("SIWagesSubform", "*");

                if (result != null && result != undefined) {
                    let contributionList = result.contributionHistory;
                    if (contributionList && contributionList.length > 0) {

                        let subformDataToInsert = [];
                        for (let i = 0; i < contributionList.length; i++) {
                            let object = new Object();
                            object.Year_SIWages = contributionList[i].contributionYear.toString();
                            object.Month_SIWages = contributionList[i].contributionMonth.toString();
                            object.EmployerCode_SIWages = contributionList[i].employerCode.toString();
                            object.EmployerName_SIWages = contributionList[i].employerName.toString();
                            object.NumberBox7 = contributionList[i].contributionAmount.toString();
                            object.WagesSIWagesInfo = computeAssumedWages(contributionList[i].contributionYear, contributionList[i].contributionMonth, contributionList[i].contributionAmount.toString());

                            console.log(object);
                            //insert into wages info subform table
                            addRowsToSubForm("SIWagesSubform", [object]);
                        }

                        triggerAutoLookup("SIWagesSubform/AutoLookup91: [*]", "Lk Surplus/Deficit");
                    }
                } else {
                    console.log("getWagesInfo() : API return null");
                }

            }
        });
    } catch (error) {
        console.error("getWagesInfo() Error : " + error);
    }
}

function getAssumedWages(ContributionRequirementJson, totalContribution, year, month) {
    if (ContributionRequirementJson !== undefined || ContributionRequirementJson !== null) {

        ContributionRequirementJson = ContributionRequirementJson.filter((data) => {
            let effective_from = new Date(data.effective_from);
            effective_from = effective_from.setHours(0, 0, 0);
            effective_from = new Date(effective_from);
            let contributionDate = new Date(year, (month - 1), 1);
            let effective_to = null;
            if (data.effective_to != null) {
                effective_to = new Date(data.effective_to);
                effective_to = effective_to.setHours(0, 0, 0);
                effective_to = new Date(effective_to);
            }

            //contribution after effective date, but not deprecated
            if (contributionDate >= effective_from && effective_to == null) {
                return true;
            }
            //contribution after effective from, and deprecated, but contribution is within this
            else if (contributionDate >= effective_from && contributionDate <= effective_to) {
                return true;
            }
            return false;
        });

        for (let i = 0; i < ContributionRequirementJson.length; i++) {

            let currentContributionRate = ContributionRequirementJson[i].total_contribution;
            let averageWages = ((ContributionRequirementJson[i].contrib_to + ContributionRequirementJson[i].contrib_from) / 2);

            if (currentContributionRate == totalContribution) {
                return averageWages;
            } else if (currentContributionRate > totalContribution) {
                //first found the total contribution is under the assumption contribution
                //Compare the upper and lower boundary of the contribution
                if (i == 0) {
                    //when it is the lowest contribution
                    return averageWages;
                } else {
                    let currentContributionDiff = currentContributionRate - totalContribution;
                    let previousContributionDiff = totalContribution - ContributionRequirementJson[i - 1].total_contribution;

                    //if the current record is the most nearest contribution
                    if (currentContributionDiff < previousContributionDiff) {
                        return averageWages;
                    } else {
                        //previous record is the most nearest contribution
                        let contributedSalary = ContributionRequirementJson[i - 1].contrib_to + ContributionRequirementJson[i - 1].contrib_from;
                        let average = contributedSalary / 2;
                        return average;
                    }
                }
            } else if (i == (ContributionRequirementJson.length - 1)) {
                // already the latest max contribution
                return averageWages;
            }
        }
    } else {
        return null;
    }
}

function computeAssumedWages(year, month, contributionPaid) {

    // let contributionEffectiveJson = JSON.parse(getFormFieldValue('ContributionEffectiveJson'));
    let contributionRequirementJson = JSON.parse(getFormFieldValue('ContributionRequirementJson'));

    let assumedWages = getAssumedWages(contributionRequirementJson, contributionPaid, year, month);

    // contributionEffectiveJson = contributionEffectiveJson.sort((a, b) => {
    //     if (a.year !== b.year) {
    //         return a.year - b.year;
    //     } else {
    //         // If years are the same, sort by month
    //         if (a.month === null) {
    //             return -1; // Null months come after other months
    //         } else if (b.month === null) {
    //             return 1;
    //         } else {
    //             return a.month - b.month;
    //         }
    //     }
    // });
    //
    // let salaryLimit = getSalaryRate(contributionEffectiveJson, 0, year, month);
    //
    // if (assumedWages >= salaryLimit.wages) {
    //     assumedWages = salaryLimit.wages;
    // }
    return assumedWages;
}

// function getSalaryRate(contributionEffectiveJson, currentIndex = 0, year, month) {
//
//     if (currentIndex >= contributionEffectiveJson.length) {
//         return contributionEffectiveJson[currentIndex - 1];
//     }
//
//     //target year is larger
//     if (year > contributionEffectiveJson[currentIndex].year) {
//         return getSalaryRate(contributionEffectiveJson, currentIndex + 1, year, month);
//     }
//     else {
//
//         //target year is same, but month is larger
//         if (year == contributionEffectiveJson[currentIndex].year && month > contributionEffectiveJson[currentIndex].month) {
//             return getSalaryRate(contributionEffectiveJson, currentIndex + 1, year, month);
//         }
//         else
//         {
//             //same year , same month
//             if(year == contributionEffectiveJson[currentIndex].year && month == contributionEffectiveJson[currentIndex].month)
//             {
//                 return contributionEffectiveJson[currentIndex];
//             }
//             //year is smaller than current
//             else if(year < contributionEffectiveJson[currentIndex].year)
//             {
//                 return contributionEffectiveJson[currentIndex -1];
//             }
//             else
//             {
//                 return contributionEffectiveJson[currentIndex - 1];
//             }
//         }
//     }
// }

function firstTimeAutoPopulateWagesInfoList() {
    let SIWagesSubform = getSubFormData('SIWagesSubform');

    if (SIWagesSubform.length <= 0) {
        getWagesInfo();
    }
}

function getSchemeEntryDate() {
    try {
        let identificationNo = getFormFieldValue("QueryIC1");
        let identificationType = getFormFieldValue("QueryIDType1");
        let noticeReceivedDate = getFormFieldValue("NoticeandBenefitClaimFormReceivedDate_InsuredPersonInfo");

        let middlewareHostAddress = getMiddlewareHostName();

        if (noticeReceivedDate == '') {
            noticeReceivedDate = Date.now();
        }

        $.ajax({
            url: middlewareHostAddress + "/assist-ws/employee/getContributionInvalidity",
            method: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                "identificationNo": identificationNo,
                "identificationType": identificationType,
                "contributionMonthFrom": formatDateToYYYYMMDD(noticeReceivedDate),
            }),
            success: (result) => {
                if (result != null && result != undefined) {
                    setFormFieldValue("SchemeEntryDate_InvaliditySchemeQualifyingInfo_SchemeQualifying", result.schemeJoinDate);
                    setFormFieldValue("EmploymentStartDate_QualifyingCondition1", result.schemeJoinDate);
                }
            },
            error: (error) => {
                console.error("getSchemeEntryDate() : " + error);
            }
        })
    } catch (error) {
        console.error("getSchemeEntryDate() : " + error);
    }

}

async function sendAjaxCall(url, method, payload) {
    return new Promise((resolve, reject) => {

        $.ajax({
            url: url,
            method: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(payload),
            success: (result) => {
                resolve(result);
            },
            error: (error) => {
                console.error("sendAjaxCall() HTTP " + method + " : " + url, error);
                reject(error);
            }
        });
    });
}

async function getEmployerInfo(employerCode) {
    return new Promise((resolve, reject) => {
        try {

            let middlewareHostAddress = getMiddlewareHostName();

            sendAjaxCall(middlewareHostAddress + "/assist-ws/employer/search",
                'post'
                , {
                    "employerCode": employerCode
                }).then((result) => {
                resolve(result);
            })
                .catch((error) => {
                    reject(error);
                });
        } catch (ex) {
            console.error("getEmployerInfo() : " + ex);
            reject(ex);
        }
    });

}

async function getEmployeeInfo(identificationNo, identificationType) {
    return new Promise((resolve, reject) => {
        let middlewareHostAddress = getMiddlewareHostName();

        sendAjaxCall(middlewareHostAddress + "/assist-ws/employee/search",
            'post'
            , {
                "identificationNo": identificationNo,
                "identificationType": identificationType
            }).then((result) => {
            resolve(result);
        })
            .catch((error) => {
                reject(error);
            });
    });
}

async function getEmploymentHistoryList() {
    try {
        let identificationNo = getFormFieldValue("QueryIC1");
        let identificationType = getFormFieldValue("QueryIDType1");


        deleteRowsToSubform("EmploymentHistorySubform_EmploymentHistory_InvalidityInfo", "*");

        getEmployeeInfo(identificationNo, identificationType).then((result) => {
            if (result != null && result != undefined) {
                let employmentList = result.employeeInfoList[0].employmentInfoList;

                for (let i = 0; i < employmentList.length; i++) {

                    let employementEndDate = employmentList[i].endDate;

                    if (employementEndDate == null || employementEndDate == undefined || employementEndDate == "") {
                        employementEndDate = Date.now().toLocaleDateString();
                    }

                    let periodOfEmploymentSeconds = Date.parse(employementEndDate).getTime() - Date.parse(employmentList[i].commencementDate).getTime();

                    let periodOfYearOfEmployment = Math.floor(periodOfEmploymentSeconds / 1000 / 60 / 60 / 24 / 365);

                    let dataAddToSubform = [
                        {
                            EmployerName_EmploymentHistory_InvalidityInfo: employmentList[i].employerName,
                            Occupation_EmploymentHistory_InvalidityInfo: employmentList[i].occupation,
                            PeriodofEmploymentYear_InvalidityInfo: periodOfYearOfEmployment,
                            Address1_EmploymentHistory_InvalidityInfo: null,
                            Address2_EmploymentHistory_InvalidityInfo: null,
                            Address3_EmploymentHistory_InvalidityInfo: null,
                            State_EmploymentHistory_InvalidityInfo: null,
                            City_EmployerInfo_InvalidityInfo: null,
                            Postcode_EmploymentHistory_InvalidityInfo: null,

                        }
                    ];

                    addRowsToSubForm("EmploymentHistorySubform_EmploymentHistory_InvalidityInfo", dataAddToSubform);

                    // getEmployerInfo(employerCode).then((result) => {
                    //     let businessInfo = result;
                    //     let dataAddToSubform = [
                    //         {
                    //             EmployerName_EmploymentHistory_InvalidityInfo: employmentList[i].employerName,
                    //             Occupation_EmploymentHistory_InvalidityInfo: employmentList[i].occupation,
                    //             PeriodofEmploymentYear_InvalidityInfo: periodOfYearOfEmployment,
                    //             Address1_EmploymentHistory_InvalidityInfo: null,
                    //             Address2_EmploymentHistory_InvalidityInfo: null,
                    //             Address3_EmploymentHistory_InvalidityInfo: null,
                    //             State_EmploymentHistory_InvalidityInfo: null,
                    //             City_EmployerInfo_InvalidityInfo: null,
                    //             Postcode_EmploymentHistory_InvalidityInfo: null,

                    //         }
                    //     ];

                    //     addRowsToSubForm("EmploymentHistorySubform_EmploymentHistory_InvalidityInfo", dataAddToSubform);
                    // }).catch((error) => {
                    //     console.error(error);
                    // });


                }
            }
        }).catch((error) => {
            console.error("getEmploymentHistoryList() : " + error);
        });
    } catch (ex) {
        console.error("getEmploymentHistoryList() : " + ex);
    }
}

function firstTimeLoadEmploymentHistoryList() {
    let subformData = getSubFormData("EmploymentHistorySubform_EmploymentHistory_InvalidityInfo");

    if (subformData.length <= 0) {
        getEmploymentHistoryList();
    }
}