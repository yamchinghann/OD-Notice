/*
 * JQuery WYSIWYG Web Form Designer
 * Copyright 2015 AgilePoint Inc
 */

/* Add your JS code Here (Press Ctrl+Space keys for intellisense) */

const endpointURL = {
    firstPayment: {
        hus: "/assist-ws/v2/nto/hus/first-payment",
    },
    employeeSearch: "/assist-ws/employee/search",
    employerSearch: "/assist-ws/employer/search",
    insuredPersonSearch: "/barista/InsuredPerson",
};

//Tools
function convertNumberStringToInt(value) {
    if (value === "" || value === "-1" || value === -1) {
        return 0;
    } else {
        return parseInt(value);
    }
}

function getMonthFromString(mon) {

    let d = Date.parse(mon + "1, 2012");
    if (!isNaN(d)) {
        return (new Date(d).getMonth() + 1).toString();
    }
    return -1;
}

function ifElseStatement(value1, value2) {
    if (value1 !== "" && value1 !== null) {
        return value1;
    } else {
        return value2;
    }
}

function getBankLocationBasedOnBankAccount() {
    if (getFormFieldValue("AccountNo") === "No") {
        return "204103";
    } else {
        return getFormFieldValue("BankLocation1");
    }
}

//Third Party - APi Call
async function fetchInsuredPersonInfo() {
    let result = await apiCall("POST", getMiddlewareHostName() + endpointURL.insuredPersonSearch, {
        identificationType: getFormFieldValue("QueryIDType"),
        identificationNo: getFormFieldValue("QueryIC"),
        employerCode: ""
    });

    return result;
}

async function fetchEmployerInfoList() {
    let queryIC = getFormFieldValue("QueryIC");
    let queryICType = getFormFieldValue("QueryIDType");

    let searchEmployerInfoList = await apiCall("post", getMiddlewareHostName() + endpointURL.employeeSearch, {
        "identificationType": queryICType,
        "identificationNo": queryIC
    });

    return searchEmployerInfoList;
}

//getSub_data
async function getWagesInfoList(wagesInfoList) {
    let arrayOfWages = [];
    if (wagesInfoList != undefined && wagesInfoList != null) {
        let wagesList = wagesInfoList;
        if (wagesList.WagesDetailWagesInfoSubForm1_SubForm.WagesDetailWagesInfoSubForm1 != undefined && wagesList.WagesDetailWagesInfoSubForm1_SubForm.WagesDetailWagesInfoSubForm1 != null) {
            for (let j = 0; j < wagesList.WagesDetailWagesInfoSubForm1_SubForm.WagesDetailWagesInfoSubForm1.length; j++) { //all are mandatory
                if (wagesList.WagesDetailWagesInfoSubForm1_SubForm.WagesDetailWagesInfoSubForm1[j].AcceptWagesInfoSub1 === "Yes") {
                    let item = wagesList.WagesDetailWagesInfoSubForm1_SubForm.WagesDetailWagesInfoSubForm1[j];
                    let payload = {
                        year: convertNumberStringToInt(item.YearWagesInfoSub1),
                        month: item.MonthWagesInfoSub1,
                        wage: new apiDataType(item.RMWagesSCOSub1).toZeroValue(),
                        contributionPaid: item.ContributionPaidRMSCOSub1,
                        contributionPayable: item.ContributionPayableRMSCOSub1,
                        contributionSurplusDeficit: item.ContributionSurplusDeficitRMSCOSub1 //temp to force it to positive value
                    }
                    arrayOfWages.push(payload);
                }
            }
        }
    }
    return arrayOfWages;
}

async function getSWWagesInfoList(wagesInfoList) {
    let arrayOfWages = [];
    if (wagesInfoList != undefined && wagesInfoList != null) {
        let wagesList = wagesInfoList;
        for (let j = 0; j < wagesList.length; j++) { //all are mandatory
            if (wagesList[j].AcceptWagesInfoSub2 === "Yes") {
                let item = wagesList[j];
                let payload = {
                    year: convertNumberStringToInt(item.YearWagesInfoSub2),
                    month: item.MonthWagesInfoSub2,
                    wage: new apiDataType(item.RMWagesSCOSub2).toZeroValue(),
                    contributionPaid: item.ContributionPaidRMSCOSub2,
                    contributionPayable: item.ContributionPayableRMSCOSub2,
                    contributionSurplusDeficit: item.ContributionSurplusDeficitRMSCOSub2
                }
                arrayOfWages.push(payload);
            }
        }
    }
    return arrayOfWages;
}

async function getInfoFromEmployeeSearch() {
    let queryIC = getFormFieldValue("QueryIC");
    let queryICType = getFormFieldValue("QueryIDType");
    let employerCode = getFormFieldValue("QueryEmployerCode");

    let employeeInfo = {
        employmentStartDate: "",
        employmentEndDate: "",
        employerCode: "",
        employerName: ""
    };

    //Get Employee Info from API
    let searchEmployeeInfoList = await apiCall("post", getMiddlewareHostName() + endpointURL.employeeSearch, {
        "identificationType": queryICType,
        "identificationNo": queryIC
    });

    //lookup employer info
    if (searchEmployeeInfoList.employeeInfoList.length > 0) {
        let foundEmployeeInfo = searchEmployeeInfoList.employeeInfoList[0].employmentInfoList.find((data) => {
            return data.employerCode == employerCode;
        });

        if (foundEmployeeInfo) {
            employeeInfo.employmentStartDate = foundEmployeeInfo.commencementDate;
            employeeInfo.employmentEndDate = foundEmployeeInfo.endDate;
            employeeInfo.employerCode = foundEmployeeInfo.employerCode;
            employeeInfo.employerName = foundEmployeeInfo.employerName;
        }
    }
    return employeeInfo;
}

async function getInfoFromEmployerSearch() {
    let employerCode = getFormFieldValue("QueryEmployerCode");

    let employerInfo = {
        employerId: "",
        employerCode: "",
        employerName: ""
    };

    let searchEmployerInfoList = await apiCall("post", getMiddlewareHostName() + endpointURL.employerSearch, {
        "employerCode": employerCode,
    });
    //lookup employer info
    if (searchEmployerInfoList.businessInfo.length > 0) {
        employerInfo.employerId = searchEmployerInfoList.businessInfo[0].employerId;
        employerInfo.employerCode = searchEmployerInfoList.businessInfo[0].employerCode;
        employerInfo.employerName = searchEmployerInfoList.businessInfo[0].employerName;
    }
    return employerInfo;
}

async function getEmployerInfoAndWagesInfo() {
    let wagesInfoList = getSubFormData("WagesDetails6Months");
    let queryIC = getFormFieldValue("QueryIC");
    let queryICType = getFormFieldValue("QueryIDType");
    let employerCode = getFormFieldValue("QueryEmployerCode");

    let employerInfoList = [];

    //Get Employee Info from API
    let searchEmployerInfoList = await apiCall("post", getMiddlewareHostName() + endpointURL.employeeSearch, {
        "identificationType": queryICType,
        "identificationNo": queryIC
    });

    for (let i = 0; i < wagesInfoList.length; i++) {
        let employerInfo = {
            employerId: 2,
            employerCode: "",
            employerName: "",
            address: {
                addressLine2: "",
                addressLine1: "",
                addressLine3: "",
                state: "",
                city: "",
                country: "",
                postcode: "",
                poBox: "",
                lockedBag: "",
                wdt: ""
            },
            telephoneNo: "",
            mobileNo: "",
            faxNo: "",
            emailAddress: "",
            businessEntityId: "",
            subBusinessEntityId: "",
            subBusinessEntityListId: "",
            industryCodeId: "",
            subIndustryCodeListId: "",
            serviceTypeId: "",
            employmentStartDate: "",
            employmentEndDate: "",
            wagesInfoList: await getWagesInfoList(wagesInfoList[i])
        };

        console.log("Get Employer List from Local:", wagesInfoList);
        console.log("Get Employer List from API:", searchEmployerInfoList);

        //lookup employer info
        if (searchEmployerInfoList.employeeInfoList.length > 0) {
            let foundEmployerInfo = searchEmployerInfoList.employeeInfoList[0].employmentInfoList.find((data) => {
                return data.employerCode == employerCode;
            });

            if (foundEmployerInfo) {
                employerInfo.employerId = convertNumberStringToInt(foundEmployerInfo.employerId);
                employerInfo.employerCode = wagesInfoList[0].EmployerCodeWI ?? foundEmployerInfo.employerCode;
                employerInfo.employerName = wagesInfoList[0].EmployerNameWI ?? foundEmployerInfo.employerName;
                employerInfo.employmentStartDate = wagesInfoList[0].EmploymentStartDateWI
                    ?? foundEmployerInfo.commencementDate;
                employerInfo.employmentEndDate = wagesInfoList[0].EmploymentEndDateWI
                    ?? foundEmployerInfo.endDate;
                employerInfo.industryCodeId = foundEmployerInfo.industryCodeId;
                employerInfo.subIndustryCodeListId = foundEmployerInfo.subIndustryCodeListId;
            } else {
                employerInfo.employerCode = wagesInfoList[0].EmployerCodeWI;
                employerInfo.employerName = wagesInfoList[0].EmployerNameWI;
                employerInfo.employmentStartDate = wagesInfoList[0].EmploymentStartDateWI;
                employerInfo.employmentEndDate = wagesInfoList[0].EmploymentEndDateWI;
            }
        }
        console.log(wagesInfoList[0].EmployerCodeWI, wagesInfoList[0].EmployerNameWI);

        employerInfoList.push(employerInfo);
    }

    return employerInfoList;
}

async function getSimilarWorkerInfoAndWagesInfo() {
    let wagesInfoList = getSubFormData("SimilarWorkerInfoWagesInfo2");
    let swIC = getFormFieldValue("IdentificationNoWageInfo");
    let swICType = getFormFieldValue("IdTypeWageDDL");
    let employerCode = getFormFieldValue("EmployerCode");

    let employerInfoList = [];

    //Get Employee Info from API
    let searchEmployerInfoList = await apiCall("post", getMiddlewareHostName() + endpointURL.employeeSearch, {
        "identificationType": swICType,
        "identificationNo": swIC
    });

    let employerInfo = {
        employerId: 2,
        employerCode: "",
        employerName: "",
        address: {
            addressLine2: "",
            addressLine1: "",
            addressLine3: "",
            state: "",
            city: "",
            country: "",
            postcode: "",
            poBox: "",
            lockedBag: "",
            wdt: ""
        },
        telephoneNo: "",
        mobileNo: "",
        faxNo: "",
        emailAddress: "",
        businessEntityId: "",
        subBusinessEntityId: "",
        subBusinessEntityListId: "",
        industryCodeId: "",
        subIndustryCodeListId: "",
        serviceTypeId: "",
        employmentStartDate: "",
        employmentEndDate: "",
        wagesInfoList: await getSWWagesInfoList(wagesInfoList)
    };

    console.log("Get Employer List from Local:", wagesInfoList);
    console.log("Get Employer List from API:", searchEmployerInfoList);

    //lookup employer info
    if (searchEmployerInfoList.employeeInfoList.length > 0) {
        let foundEmployerInfo = searchEmployerInfoList.employeeInfoList[0].employmentInfoList.find((data) => {
            return data.employerCode == employerCode;
        });

        if (foundEmployerInfo) {
            employerInfo.employerId = convertNumberStringToInt(foundEmployerInfo.employerId);
            employerInfo.employerCode = getFormFieldValue("EmployerCodeAN") ?? foundEmployerInfo.employerCode;
            employerInfo.employerName = getFormFieldValue("EmployerNameAN") ?? foundEmployerInfo.employerName;
            employerInfo.employmentStartDate = getFormFieldValue("EmploymentStartDateAN")
                ?? foundEmployerInfo.commencementDate;
            employerInfo.employmentEndDate = getFormFieldValue("EmploymentEndDateAN")
                ?? foundEmployerInfo.endDate;
            employerInfo.industryCodeId = foundEmployerInfo.industryCodeId;
            employerInfo.subIndustryCodeListId = foundEmployerInfo.subIndustryCodeListId;
        } else {
            employerInfo.employerCode = getFormFieldValue("EmployerCodeAN");
            employerInfo.employerName = getFormFieldValue("EmployerNameAN");
            employerInfo.employmentStartDate = getFormFieldValue("EmploymentStartDateAN");
            employerInfo.employmentEndDate = getFormFieldValue("EmploymentEndDateAN");
        }
    }
    console.log(getFormFieldValue("EmployerCodeAN"), getFormFieldValue("EmployerNameAN"));
    employerInfoList.push(employerInfo);
    return employerInfoList;
}

async function getSimilarWorkerDetail() {
    return new Promise(async (resolve, reject) => {
        try {
            let baristaContributionPayload = {
                "identificationType": getFormFieldValue("IdTypeWageDDL"),
                "identificationNo": getFormFieldValue("IdentificationNoWageInfo"),
                "employerCode": getFormFieldValue("EmployerCode"),
                "noticeDate": getFormFieldValue("FinalNoticeDate")
            }

            let result = await sendApiCall(
                getMiddlewareHostName() + "/barista/contribution",
                "POST",
                baristaContributionPayload);

            let similarWorkerDetail = {
                employeeId: result.employeeId,
                name: result.name,
                identificationInfoList: []
            }

            for (let x in result.identificationInfoList) {
                let currentID = result.identificationInfoList[x];
                let object = {
                    "identificationType": currentID.identificationTypeId,
                    "identificationNo": currentID.identificationNo
                };
                similarWorkerDetail.identificationInfoList.push(object);
            }
            resolve(similarWorkerDetail);
        } catch (error) {
            reject(error);
        }
    });
}

function getIdentificationInfo() {
    return new Promise((accept, reject) => {
        try {
            let idInfos = getSubFormData("IdentificationDetailsIPI");
            let array = [];
            for (let idInfo of idInfos) {
                let payload = {
                    identificationType: idInfo.IdentificationTypeIDetailsIPI,
                    identificationNo: idInfo.IdentificationNumberIDetailsIPI
                }
                array.push(payload)
            }
            accept(array)
        } catch (e) {
            reject(e)
        }
    })
}

function getPaymentMethodName(value) {
    let result;
    switch (parseInt(value)) {
        case 204201:
            result = "EFT";
            break;
        case 204202:
            result = "Cheque";
            break;
        case 204203:
            result = "FTT";
            break;
        case 204204:
            result = "TT";
            break;
        default:
            result = "Bank Draft No."
    }
    return result;
}

//HUS Info
function getHUSInfos() {
    return new Promise((accept, reject) => {
        try {
            let husSF = getSubFormData("SubFormMCInfo");
            let husArr = [];
            let husParentType;
            for (const hus of husSF) {
                // initialize parent hus type
                if (hus.HUSTypeDropdown.includes("MC", "Light Duty")) {
                    husParentType = hus.HUSTypeDropdown;
                }
                if (
                    // condition to check if actual data for payload
                    (hus.ParentChildHUSInfoDetailsHUSInfo === "Child" &&
                        hus.HUSApprovalStatusSplitHUSDetailsHUSInfoHUSInfo != "Split") ||
                    hus.HUSApprovalStatusSplitHUSDetailsHUSInfoHUSInfo ===
                    "Split Child" ||
                    hus.HUSStatusHUSDetailsHUSI === "Attended Work And Salary Paid" ||
                    hus.ParentChildHUSInfoDetailsHUSInfo === "Parent no child"
                ) {
                    let husApprovalStatus = hus.HUSApprovalStatusHUSDetailsHUSInfoHUSInfo;

                    // default to pending
                    if (husApprovalStatus == "-1" || husApprovalStatus == "New") {
                        husApprovalStatus = "Pending";
                    }
                    // handle attended work
                    if (hus.HUSStatusHUSDetailsHUSI === "Attended Work And Salary Paid") {
                        husArr.push({
                            startDate: hus.StartDateHUSInfo,
                            endDate: hus.EndDateHUSInfo,
                            totalHus: hus.TotalDaysHUSInfo,
                            //husType: "Attended Work And Salary Paid",
                            husType: "Light Duty",
                            approvalStatus: husApprovalStatus,
                        });
                    } else {
                        husArr.push({
                            startDate: hus.StartDateHUSInfo,
                            endDate: hus.EndDateHUSInfo,
                            totalHus: hus.TotalDaysHUSInfo,
                            husType: husParentType,
                            approvalStatus: husApprovalStatus,
                        });
                    }
                }
            }
            let husInfoObj = {
                paidOnAccidentDay: new apiDataType(
                    getFormFieldValue("WasWagesPaidontheDayofAccident")
                ).toBoolean(),
                husDayInfoList: husArr,
            };
            accept(husInfoObj);
        } catch (e) {
            reject(e);
        }
    });
}

async function specialMedicalBoardInfoListHUS() {
    return new Promise((resolve, reject) => {
        try {
            let SMBInfos = getSubFormData("ODSMBSF");
            let arrayOfSMBInfo = [];
            for (let item of SMBInfos) {
                let payload = {
                    jdTypeId: item.ODSF1MBType,
                    jdSessionDate: formatDateToYYYYMMDD(item.ODSF1SessionDate),
                    result: item.ODSF1ELS,
                    remarks: item.ODSF1Remarks
                }
                arrayOfSMBInfo.push(payload);
            }
            resolve(arrayOfSMBInfo);
        } catch (e) {
            reject(e);
        }
    });
}

async function getWagesInfo() {
    let finalWagesObject;
    //let resultRejectWages = await isAllRejectWages((result) => { return result });
    let minimumWagesResult = new apiDataType(getFormFieldValue("MinWageDropdown")).toBoolean();
    let similarWorkerResult = new apiDataType(getFormFieldValue("SimilarWorkerDropdown")).toBoolean();
    if (minimumWagesResult === true || (minimumWagesResult === false && similarWorkerResult === false)) {
        finalWagesObject = {
            minimumWages: new apiDataType(getFormFieldValue("MinWageDropdown")).toBoolean(),
            similarWorker: new apiDataType(getFormFieldValue("SimilarWorkerDropdown")).toBoolean(),
            employerInfoList: await getEmployerInfoAndWagesInfo()
        };
    } else {
        finalWagesObject = {
            minimumWages: new apiDataType(getFormFieldValue("MinWageDropdown")).toBoolean(),
            similarWorker: new apiDataType(getFormFieldValue("SimilarWorkerDropdown")).toBoolean(),
            employerInfoList: await getSimilarWorkerInfoAndWagesInfo()
        };
        if (finalWagesObject.similarWorker) {
            //finalWagesObject.similarWorkerDetail = await getSimilarWorkerDetail();
            finalWagesObject.similarWorkerDetail = {
                employeeId: getFormFieldValue("EmployeeIDAN"),
                name: getFormFieldValue("NameAN"),
                identificationInfoList: [
                    {
                        identificationType: getFormFieldValue("IdTypeWageDDL"),
                        identificationNo: getFormFieldValue("IdentificationNoAN")
                    }
                ]
            };
        }
    }
    //console.log(finalWagesObject);
    return finalWagesObject;
}

async function sendHUSFirstPaymentApi() {
    return new Promise(async (accept, reject) => {
        try {
            let HUSFirstPaymentPayload =
            {
                refNo: getFormFieldValue("ReferenceSchemeRefNo"),
                correlationId: "", //ignore
                caseInfo: {
                    schemeRefNo: getFormFieldValue("SchemeRefNoCaseInfo"),
                    schemeType: "200201",
                    caseType: "OD",
                    caseCategory: "200101",
                    noticeDate: formatDateToYYYYMMDD(getFormFieldValue("NoticeDateCaseInfo")),
                    noticeType: "Occupational Disease Notice",
                    form34ReceivedDate: formatDateToYYYYMMDD(getFormFieldValue("NoticeandBenefitClaimFormReceivedDate1")),
                    accrualDate: getFormFieldValue("AccrualDate"),
                    socsoOffice: getFormFieldValue("SOCSOOfficeID"),
                    areaCode: getFormFieldValue("CurrentBranch"),
                    benefitRefNo: "",
                    remarks: "First Payment OD",
                    isSec96: true,
                    sec96Option: "", //not found
                    sec96OptionReceivedDate: "", //not found
                    schemeRevisionNo: "" //not found
                },
                insuredPersonInfo: {
                    employeeId: getFormFieldValue("EmployeeID"),
                    name: getFormFieldValue("Name1"),
                    dob: formatDateToYYYYMMDD(getFormFieldValue("DateofBirth")),
                    genderId: getFormFieldValue("GenderIPI"),
                    raceId: getFormFieldValue("RaceDDL"),
                    nationalityId: getFormFieldValue("NationalityDDL"),
                    dateOfDeath: formatDateToYYYYMMDD(getFormFieldValue("DateofDeathIPI")),
                    ageOfDeath: getFormFieldValue("AgeattheTimeofDeathIPI"),
                    deathSource: getFormFieldValue("SourceofDeathInformationIPI"),
                    address: {
                        addressLine1: getFormFieldValue("AddressInsuredPersonInfo"),
                        addressLine2: getFormFieldValue("AddressInsuredPersonInfo2"),
                        addressLine3: getFormFieldValue("AddressInsuredPersonInfo3"),
                        state: getFormFieldValue("AddStateIPI"),
                        city: getFormFieldValue("CityIPI"),
                        country: "", //not exist
                        postcode: getFormFieldValue("PostcodeInsuredPersonInfo") ?? "NA", //eliminate 5 digits only or NA
                        poBox: getFormFieldValue("POBoxInsuredPersonInfo"),
                        lockedBag: getFormFieldValue("LockedBagInsuredPersonInfo"),
                        wdt: getFormFieldValue("WDTInsuredPersonInfo"),
                    },
                    telephoneNo: getFormFieldValue("HouseTelephoneNo"),
                    mobileNo: getFormFieldValue("MobileNo1"),
                    emailAddress: getFormFieldValue("EmailAddress1"),
                    recipientUniqueType: convertNumberStringToInt(getFormFieldValue("QueryIDType")).toString(),
                    recipientUniqueNo: getFormFieldValue("QueryIC"),
                    identificationInfo: await getIdentificationInfo()
                },
                bankInfo: {
                    paymentMethodType: getPaymentMethodName(getFormFieldValue("PaymentMethodDDL")),
                    bankAccount: getBankLocationBasedOnBankAccount(),
                    bankName: getFormFieldValue("BankNameLB"),
                    bankAccNo: getFormFieldValue("BankAccountNo"),
                    overseaBankAcctType: "", //not found
                    swiftCode: getFormFieldValue("BankSwiftCode") ?? getFormFieldValue("BankSwiftCode1"),
                    OtherCodes: getFormFieldValue("OtherCode"),
                    OtherCodesValue: getFormFieldValue("OtherCodeValue"),
                    overseaBankName: getFormFieldValue("BankNameOV"),
                    overseaBankAddressLine1: getFormFieldValue("BankAddress1"),
                    overseaBankAddressLine2: getFormFieldValue("BankAddressLine2__u"),
                    overseaBankAddressLine3: getFormFieldValue("BankAddressLine3__u"),
                    overseaState: getFormFieldValue("State2"),
                    overseaCity: getFormFieldValue("City1"),
                    overseaBankCountry: getFormFieldValue("Country"),
                    currency: getFormFieldValue("Currency"),
                    isCitizen: getFormFieldValue("IsMalaysiaCitizen1"),
                    citizenCountry: getFormFieldValue("CitizenCountry"),
                    reasonNoBankAcct: getFormFieldValue("Reason"),
                    passportNo: getFormFieldValue("PassportNo1"),
                    passportExpiryDate: getFormFieldValue("PassportExpiredDate1"),
                    previousPassportNo: getFormFieldValue("PreviousPassportDate1"),
                    ssnNo: getFormFieldValue("SSNo"),
                    noBankAccountJustification: getFormFieldValue("Reason")
                },
                employerInfo: {
                    employerId: ifElseStatement(convertNumberStringToInt(getSubFormData("EISubform_inEmp")[0].EmployerID_inEmp), convertNumberStringToInt((await getInfoFromEmployerSearch()).employerId)),
                    employerCode: ifElseStatement(getSubFormData("EISubform_inEmp")[0].EmployerCode_inEmp, (await getInfoFromEmployerSearch()).employerCode),
                    employerName: ifElseStatement(getSubFormData("EISubform_inEmp")[0].EmployerName_InEmp, (await getInfoFromEmployerSearch()).employerName),
                    address: {
                        addressLine1: getSubFormData("EISubform_inEmp")[0].AddressL1_inEmp,
                        addressLine2: getSubFormData("EISubform_inEmp")[0].AddressL2_inEmp,
                        addressLine3: getSubFormData("EISubform_inEmp")[0].AddressL3_inEmp,
                        state: getSubFormData("EISubform_inEmp")[0].State_inEmp,
                        city: getSubFormData("EISubform_inEmp")[0].City_inEmp,
                        country: "", //not exist
                        postcode: getSubFormData("EISubform_inEmp")[0].Postcode_inEmp, //eliminate 5 digits only
                        poBox: getSubFormData("EISubform_inEmp")[0].POBox_inEmp,
                        lockedBag: getSubFormData("EISubform_inEmp")[0].LockedBag_inEmp,
                        wdt: getSubFormData("EISubform_inEmp")[0].WDT_inEmp
                    },
                    telephoneNo: getSubFormData("EISubform_inEmp")[0].TelephoneNo_inEmp,
                    mobileNo: "",
                    faxNo: getSubFormData("EISubform_inEmp")[0].FaxNo_inEmp,
                    emailAddress: getSubFormData("EISubform_inEmp")[0].EmailAddress_inEmp,
                    businessEntityId: getSubFormData("EISubform_inEmp")[0].BusinessEntity_inEmp,
                    subBusinessEntityId: getSubFormData("EISubform_inEmp")[0].SubBusinessEntity_inEmp,
                    subBusinessEntityListId: getSubFormData("EISubform_inEmp")[0].SubBusinessEntityList_inEmp,
                    industryCodeId: getSubFormData("EISubform_inEmp")[0].IndustryCode_inEmp,
                    subIndusctryCodeListId: getSubFormData("EISubform_inEmp")[0].SubIndustryCodeList_inEmp,
                    serviceTypeId: getSubFormData("EISubform_inEmp")[0].ServiceType1,
                    employmentStartDate: (await getInfoFromEmployeeSearch()).employmentStartDate,
                    employmentEndDate: (await getInfoFromEmployeeSearch()).employmentEndDate,
                    wagesInfoList: await getWagesInfoList()
                },
                occupationalDiseaseInfo: {
                    occupationalDiseaseDate: formatDateToYYYYMMDD(getFormFieldValue("ODDateODInfo")),
                    occupationalDiseaseDesc: getFormFieldValue("DescriptionofOD"),
                    accidentCode: "",// Cause of Accident
                    causativeAgent: getFormFieldValue("CausativeAgentPrevention")
                },
                specialMedicalBoardInfoList: await specialMedicalBoardInfoListHUS(),
                schemeMgmtDecision: {
                    occupationalDisease:
                        new apiDataType(getSubFormData("RecommendationHistory")[0].ListofOccupationalDisease5thScheduleRB_RH).toBoolean()
                        ??
                        new apiDataType(getSubFormData("ApproveHistory")[0].ListofOccupationalDisease5thScheduleAH).toBoolean(),
                    employmentInjury: true, //not found
                    recommendedBy: getSubFormData("RecommendationHistory")[0].RecoBy,
                    recommendedDate: getSubFormData("RecommendationHistory")[0].RecommendationDate,
                    approvedBy: getSubFormData("ApproveHistory")[0].ApprovedBy1, //get first row data
                    approvedDate: formatDateToYYYYMMDD(getSubFormData("ApproveHistory")[0].ApprovalDate1)
                },
                wagesInfo: await getWagesInfo(),
                husInfo: await getHUSInfos()
            };
            await apiCall('post', getMiddlewareHostName() + endpointURL.firstPayment.hus, HUSFirstPaymentPayload);
            accept(true);
        } catch (e) {
            console.log(e);
            reject(false);
        }
    })
}

async function saoSubmitForHUS1stPaymentAPI() {
    try {
        const actionApprove = getFormFieldValue("ActionApprovalAfterMB");
        if (actionApprove !== "-1") {
            if (actionApprove === "10203") {
                await showDialogMessage("Sending information to ASSIST", "Info");
                if (await Promise.resolve(await sendHUSFirstPaymentApi())) {
                    console.log("successful call");
                    onSubmitEncode();
                    document.getElementById("SubmitBtn").click();
                } else {
                    console.log("failed call");
                    onSubmitEncode();
                    document.getElementById("SubmitBtn").click();
                }
            }
        } else {
            onSubmitEncode();
            document.getElementById("SubmitBtn").click();
        }
    } catch (e) {
        console.log(e);
    }
}

