const endpointURL = {
    middleware: "http://barista-dev.perkeso.gov.my:8090/", //getSystemValue("BARISTA_MIDDLEWARE")[0].Value
    firstPayment: {
        huk: "assist-ws/v2/nto/huk/first-payment",
    },
};

async function apiCall(method, url, payload) {
    console.log(method, url);
    console.log(payload);
    // current plan is not handling any status code and proceed
    return new Promise((accept, reject) => {
        try {
            $.ajax({
                url: url,
                type: method,
                data: JSON.stringify(payload),
                contentType: "application/json",
                success: function (res) {
                    console.log("apiCall Success", res);
                    accept(res);
                },
                error: function (request, status, error) {
                    console.log(status, error, request.responseJSON);
                    reject(false);
                },
            });
        } catch (e) {
            console.log(e);
            reject(false);
        }
    });
}

function identificationInfo() {
    return new Promise((accept, reject) => {
        try {
            let idInfos = getSubFormData("IdentificationDetailsIPI");
            let array = [];
            for (let idInfo in idInfos) {
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

async function specialMedicalBoardInfoListHUK(){
    return new Promise((resolve, reject) => {
        try {
            let SMBInfos = getSubFormData("ODSMBSF");
            let arrayOfSMBInfo = [];
            for (let item of SMBInfos){
                let payload = {
                    jdTypeId: item.ODSF1MBType,
                    jdSessionDate: item.ODSF1SessionDate,
                    assessmentType: item.ODSF1AssessmentType,
                    els: item.ODSF1ELS,
                    additinalAssessment: 15, //DNE
                    result: "", //DNE
                    remarks: item.ODSF1Remarks,
                    assessmentPercent: item.ODSF1SessionAssessment
                }
                arrayOfSMBInfo.push(payload);
            }
            resolve(arrayOfSMBInfo);
        }catch (e) {
            reject(e);
        }
    });
}

async function getEmployerInfoAndWagesInfo() {

    let wagesInfoList = getSubFormData("WagesDetailWagesInfoSubForm1");
    let employerInfoList = getSubFormData("WagesDetails6Months");

    let employerInfo = {
        employerId: "",
        employerCode: "",
        employerName: "",
        employmentStartDate: "",
        employmentEndDate: "",
        wagesInfoList: []
    };

    //Insert Wages Info from SI Wages Info Subform
    for (let item of wagesInfoList) {
        let wagesInfoObject = new Object();
        wagesInfoObject.year = item.YearWagesInfoSub1;
        wagesInfoObject.month = item.MonthWagesInfoSub1;
        wagesInfoObject.wage = item.RMWagesSCOSub1;
        wagesInfoObject.contributionPaid = item.ContributionPaidRMSCOSub1;
        wagesInfoObject.contributionPayable = item.ContributionPayableRMSCOSub1;
        wagesInfoObject.contributionSurplusDeficit = item.ContributionSurplusDeficitRMSCOSub1;

        employerInfo.wagesInfoList.push(wagesInfoObject);
    }
    //lookup employer info

    employerInfo.employerId = 2;
    employerInfo.employerCode = employerInfoList[0].EmployerCodeWI;
    employerInfo.employerName = employerInfoList[0].EmployerNameWI;
    employerInfo.employmentStartDate = employerInfoList[0].EmploymentStartDateWI;
    employerInfo.employmentEndDate = employerInfoList[0].EmploymentEndDateWI;

    return employerInfo;
}
async function relatedCaseList(){
    return new Promise((resolve, reject) => {
        try {
            let relatedCaseInfos = getSubFormData("RelatedCaseInformation1");
            let arrayOfRelatedCaseInfo = [];
            for (let item of relatedCaseInfos){
                let payload = {
                    schemeRefNo: item.SchemeRefNo1,
                    schemeType: "",
                    caseType: "",
                    noticeDate: item.DateofOD,
                    noticeType: item.NoticeType1,
                    rate: ""
                }
                arrayOfRelatedCaseInfo.push(payload);
            }
            resolve(arrayOfRelatedCaseInfo);
        }catch (e) {
            reject(e);
        }
    });
}
async function sendHUKFirstPaymentApi() {
    let OVBankAddress = [
        getFormFieldValue("BankAddress1"),
        getFormFieldValue("BankAddressLine2"),
        getFormFieldValue("BankAddressLine3")].join(',');

    let HUKFirstPaymentPayload =
        {
            refNo: getFormFieldValue("ReferenceSchemeRefNo"),
            caseInfo: {
                schemeRefNo: getFormFieldValue("SchemeRefNoCaseInfo"),
                schemeType: "200201",
                caseType: "NTO",
                caseCategory: "200101",
                accrualDate: "20230104",
                noticeDate: getFormFieldValue("NoticeDateCaseInfo"),
                noticeType: getFormFieldValue("NoticeTypeCaseInfo"),
                form34ReceivedDate: getFormFieldValue("Date4"),
                applicationSource: "Latifah", //not found - start
                applicationDate: "20190310",
                husEndDate: "20190225",
                age: "26",
                isSec96: false,
                sec96Option: null,
                sec96OptionReceivedDate: null,
                requestedBy: "Hamid",
                requestedDate: "20190310",
                socsoOffice: "2",
                benefitRefNo: "", //not found - end
                remarks: "First Payment OD",
                areaCode: "A31"
            },
            relatedCaseList: relatedCaseList(),
            insuredPersonInfo: {
                employeeId: getFormFieldValue("QueryEmployeeID"),
                name: getFormFieldValue("Name1"),
                dob: getFormFieldValue("DateofBirth"),
                genderId: getFormFieldValue("GenderIPI"),
                raceId: getFormFieldValue("RaceDDL"),
                nationalityId: getFormFieldValue("NationalityDDL"),
                dateOfDeath: getFormFieldValue("DateofDeath"),
                ageOfDeath: getFormFieldValue("AgeattheTimeofDeath"),
                deathSource: getFormFieldValue("SourceofDeathInformation"),
                address: {
                    addressLine1: getFormFieldValue("AddressInsuredPersonInfo"),
                    addressLine2: getFormFieldValue("AddressInsuredPersonInfo2"),
                    addressLine3: getFormFieldValue("AddressInsuredPersonInfo3"),
                    state: getFormFieldValue("AddStateIPI"),
                    city: getFormFieldValue("CityIPI"),
                    postcode: getFormFieldValue("PostcodeInsuredPersonInfo"),
                    poBox: getFormFieldValue("POBoxInsuredPersonInfo"),
                    lockedBag: getFormFieldValue("LockedBagInsuredPersonInfo"),
                    wdt: getFormFieldValue("WDTInsuredPersonInfo"),
                },
                telephoneNo: getFormFieldValue("HouseTelephoneNo"),
                mobileNo: getFormFieldValue("MobileNo1"),
                emailAddress: getFormFieldValue("EmailAddress1"),
                recipientUniqueType: getFormFieldValue("QueryIDType"),
                recipientUniqueNo: getFormFieldValue("QueryIC"),
                identificationInfo: getIdentificationInfo()
            },
            bankInfo: {
                paymentMethodType: getFormFieldValue("PaymentMethodDDL"),
                bankAccount: getFormFieldValue("BankAccountNo"),
                bankName: getFormFieldValue("BankNameLB"),
                bankAccNo: getFormFieldValue("BankAccountNo"),
                overseaBankAcctType: "", //not found
                swiftCode: getFormFieldValue("BankSwiftCode") ?? getFormFieldValue("BankSwiftCode1"),
                bsbCode: " ", //not found
                overseaBankAddress: OVBankAddress,
                overseaBankCountry: getFormFieldValue("Country"),
                isCitizen: getFormFieldValue("IsMalaysiaCitizen1"),
                citizenCountry: getFormFieldValue("CitizenCountry"),
                reasonNoBankAcct: getFormFieldValue("Reason")
            },
            permanentRepresentative: {
                name: getFormFieldValue("NamePermanentRep"),
                relationship:  getFormFieldValue("RelationshipwithInsuredPersonBankInfo"),
                dob: "", //not found
                passportExpiryDate: getFormFieldValue("PassportExpiryDate"),
                recipientUniqueType: getFormFieldValue("IdentificationTypePRI"),
                recipientUniqueNo: getFormFieldValue("IdentificationNoPermanentRep"),
                identificationInfoList: [
                    {
                        identificationTypeId: getFormFieldValue("IdentificationTypePRI"),
                        identificationNo: getFormFieldValue("IdentificationNoPermanentRep")
                    }
                ]
            },
            employerInfo: {
                employerId: "", //not found
                employerCode: getSubFormData("EISubform_inEmp")[0].EmployerCode_inEmp,
                employerName: getSubFormData("EISubform_inEmp")[0].EmployerName_InEmp,
                address: {
                    addressLine1: getSubFormData("EISubform_inEmp")[0].AddressL1_inEmp,
                    addressLine2: getSubFormData("EISubform_inEmp")[0].AddressL2_inEmp,
                    addressLine3: getSubFormData("EISubform_inEmp")[0].AddressL3_inEmp,
                    state: getSubFormData("EISubform_inEmp")[0].State_inEmp,
                    city: getSubFormData("EISubform_inEmp")[0].City_inEmp,
                    postcode: getSubFormData("EISubform_inEmp")[0].Postcode_inEmp,
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
                serviceTypeId: getSubFormData("EISubform_inEmp")[0].ServiceType1
            },
            occupationalDiseaseInfo: {
                occupationalDiseaseDate: getFormFieldValue("ODDateODInfo"),
                occupationalDiseaseDesc: getFormFieldValue("DescriptionofOD"),
                accidentCode: null,
                causativeAgent: getFormFieldValue("CausativeAgentPrevention"),
                industrialCode: null,
                employmentCode: getFormFieldValue("EmployerCode_inEmp")
            },
            specialMedicalBoardInfoList: specialMedicalBoardInfoListHUK(),
            legalDecision: { //not found
                courtId: "4",
                decision: "Decision for this case",
                decisionDate: "20230920"
            },
            schemeMgmtDecision: {
                occupationalDisease: getSubFormData("Recommend")[0].EmploymentInjury,
                employmentInjury: true,
                recommendedBy: "", //not found
                recommendedDate: "", //not found
                approvedBy: getFormFieldValue("Approvedby"),
                approvedDate: getFormFieldValue("ApprovedDate")
            },
            assessmentList: [ //not found
                {
                    assessmentType: "1",
                    accrualDate: "20230104",
                    assessment: "80",
                    assessmentEndDate: "20230604"
                }
            ],
            wagesInfo: {
                minimumWages: getFormFieldValue("MinWageDropdown"),
                similarWorker: getFormFieldValue("SimilarWorkerDropdown"),
                similarWorkerDetail: null, //not found
                employerInfoList: [
                    await getEmployerInfoAndWagesInfo()
                ]
            }
        };

    return new Promise(function (resolve, reject) {
        apiCall('post', endpointURL.middleware + endpointURL.firstPayment.huk, sendHUKFirstPaymentApi).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        });
    });
}

async function saoSubmitForHUK1stPaymentAPI() {
    try {
        if (await Promise.resolve(await sendHUKFirstPaymentApi())) {
            console.log('Call Success');
        }
    } catch (err) {
        console.log("Fail to Call API");
        console.error(err);
    }

}

