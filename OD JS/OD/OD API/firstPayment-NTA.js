function apiCall(method, url, payload) {
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
                    console.log("success", res);
                    accept(res);
                },
                error: function (request, status, error) {
                    console.log(status, error, request.responseJSON);
                    // reject(false);
                    accept(request);
                },
            });
        } catch (e) {
            console.log(e);
            reject(false);
        }
    });
}

async function sendFirstPayment() {
    return new Promise(async (accept, reject) => {
        try {
            // initialize payload
            // Case Information
            let caseInfoObj = {
                schemeRefNo: getFormFieldValue("SchemeRefNoCaseInfo"),
                schemeType: new apiDataType("200201").get(),
                caseType: new apiDataType("200301").get(),
                caseCategory: new apiDataType("200101").get(),
                noticeDate: getFormFieldValue("CurrentDate"),
                noticeType: getFormFieldValue("NoticeTypeCaseInfo"),
                form34ReceivedDate: getFormFieldValue(
                    "NoticeandBenefitClaimFormReceivedDate1"
                ),
                socsoOffice: new apiDataType(
                    getFormFieldValue("CurrentSocsoOfficeID")
                ).get(),
                areaCode: getFormFieldValue("CurrentSocsoOfficeCode"),
                // benefitRefNo: null,
                // remarks: null,
                // schemeRevisionNo: null,
            };

            // Insured Person Info

            // Get Identification No
            const icSF = getSubFormData2("IdentificationDetailsIPI");
            let icArr = [];
            for (const ic of icSF) {
                icArr.push({
                    identificationType: ic.IdentificationTypeIDetailsIPI,
                    identificationNo: ic.IdentificationNumberIDetailsIPI,
                });
            }
            const insuredPersonInfoObj = {
                employeeID: getFormFieldValue("QueryEmployeeID"),
                name: getFormFieldValue("Name1"),
                dob: getFormFieldValue("DOBInsuredPerson"),
                genderId: getFormFieldValue("GenderIPI"),
                raceId: getFormFieldValue("RaceIPI"),
                nationalityId: getFormFieldValue("NationalityIPI"),
                dateOfDeath: getFormFieldValue("DateofDeath"),
                ageOfDeath: new apiDataType(
                    getFormFieldValue("AgeattheTimeofDeath")
                ).toInt(),
                deathSource: getFormFieldValue("SourceofDeathInformation"),
                address: {
                    addressLine1: getFormFieldValue("AddressInsuredPersonInfo"),
                    addressLine2: getFormFieldValue("AddressInsuredPersonInfo2"),
                    addressLine3: getFormFieldValue("AddressInsuredPersonInfo3"),
                    state: getFormFieldValue("StateInsuredPersonInfo"),
                    city: getFormFieldValue("CityInsuredPersonInfo"),
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
                identificationInfo: icArr,
            };

            let bankLocation = getFormFieldValue("BankLocation1");
            let bankName, bankAccNo, bankSwiftCode;
            if (getFormFieldValue("AccountNo") == "1") {
                if (bankLocation == "204101") {
                    // if local bank
                    bankName = getFormFieldValue("BankNameLocalBank");
                    bankAccNo = getFormFieldValue("BankAccountNo");
                    bankSwiftCode = getFormFieldValue("BankSwiftCode");
                } else if ("bankLocation" == "204102") {
                    // if overseas bank
                    bankName = getFormFieldValue("BankName1");
                    bankAccNo = getFormFieldValue("BankAccountNoIBANNo");
                    bankSwiftCode = getFormFieldValue("BankSwiftCode1");
                }
            } else {
                bankLocation = "204103";
            }

            // Bank Info
            const bankInfoObj = {
                paymentMethodType: getFormFieldValue("PaymentMethod"),
                bankAccount: new apiDataType(getFormFieldValue("BankLocation1")).toNA(), // Overseas/Local/No Bank Account
                bankName: new apiDataType(bankName).toNA(),
                bankAccNo: new apiDataType(bankAccNo).toNA(),
                overseaBankAcctType: getFormFieldValue("BankAccountType"),
                swiftCode: new apiDataType(bankSwiftCode).toNA(),
                overseaBankAddress:
                    getFormFieldValue("BankAddress1") +
                    "\\n" +
                    getFormFieldValue("BankAddressLine2__u") +
                    "\\n" +
                    getFormFieldValue("BankAddressLine3__u"),
                overseaBankCountry: getFormFieldValue("Country"),
                isCitizen: new apiDataType(
                    getFormFieldValue("IsMalaysiaCitizen1")
                ).toHandleDefaultString(),
                citizenCountry: getFormFieldValue("CitizenCountry"),
                reasonNoBankAcct: getFormFieldValue("Reason"),
            };

            // Bank Info citizen logic

            if (getFormFieldValue("AccountNo") != "1") {
                bankInfoObj.isCitizen = "NA";
                bankInfoObj.citizenCountry = "NA";
            }

            // PR Info
            const prObj = {
                name: getFormFieldValue("NamePermanentRep"),
                relationship: getFormFieldValue(
                    "RelationshipwithInsuredPersonBankInfo"
                ),
                dob: null,
                passportExpiryDate: getFormFieldValue("PassportExpiryDate"),
                recipientUniqueType: getFormFieldValue("IdentificationTypePRI"),
                recipientUniqueNo: getFormFieldValue("IdentificationNoPermanentRep"),
                identifications: [
                    {
                        identificationType: getFormFieldValue("IdentificationTypePRI"),
                        identificationNo: getFormFieldValue("IdentificationNoPermanentRep"),
                    },
                ],
            };

            // Employer Info
            let employerInfoObj = {
                employerId: new apiDataType(getFormFieldValue("EmployerID")).toNA(),
                employerCode: getFormFieldValue("QueryEmployerCode"),
                employerName: getFormFieldValue("EmployerName"),
                address: {
                    addressLine1: getFormFieldValue("AddressEmployerInfo"),
                    addressLine2: getFormFieldValue("AddressEmployerInfo2"),
                    addressLine3: getFormFieldValue("AddressEmployerInfo3"),
                    state: getFormFieldValue("StateEI"),
                    city: getFormFieldValue("CityEmployerInfo"),
                    postcode: new apiDataType(
                        getFormFieldValue("PostcodeEmployerInfo")
                    ).toNA(),
                    poBox: getFormFieldValue("POBoxEmployerInfo"),
                    lockedBag: getFormFieldValue("LockedBagEmployerInfo"),
                    wdt: getFormFieldValue("WDTEmployerInfo"),
                },
                telephoneNo: getFormFieldValue("TelephoneNoEmployerInfo"),
                mobileNo: "", // doesn't exist
                faxNo: getFormFieldValue("FaxNoEmployerInfo"),
                emailAddress: getFormFieldValue("EmailAddressEmployerInfo"),
                businessEntityId: getFormFieldValue("BusinessEntity"),
                subBusinessEntityId: getFormFieldValue("SubBusinessEntity"),
                subBusinessEntityListId: getFormFieldValue("SubBusinessEntityList"),
                industryCodeId: getFormFieldValue("IndustryCode"),
                subIndustryCodeListId: getFormFieldValue("SubIndustryCodeList"),
                serviceTypeId: getFormFieldValue("ServiceTypeEmployerInfo"),
            };

            // Accident Info
            const accidentInfoObj = {
                accidentDate: getFormFieldValue("AccidentDateAccInfo"),
                placeOfAccident: getFormFieldValue("Placeofaccident"),
                whenAccidentHappened: getFormFieldValue("WhentheAccidentHappen"),
                modeOfTransport: getFormFieldValue("ModeofTransport"),
                injuryDesc: getFormFieldValue("InjuryDescription"),
                accidentCode: getFormFieldValue("AccidentCodeID"), // CauseofAccident
                causativeAgent: getFormFieldValue("CausativeAgent"),
                industrialCode: "", // not saved
                employmentCode: "", // not saved and no assist code
            };

            // Legal Decision, not implemented
            // const legalDecisionObj = {
            //   courtId: "",
            //   decision: "",
            //   decisionDate: "",
            // };

            // Scheme Management Decision
            // Recommendation & Approval

            // Get latest recommendation
            const recommendationSF = getSubFormData2(
                "RecommendationHistoryDetailsSAORec"
            );
            let recommendation = { by: null, date: null };
            if (recommendationSF.length > 0) {
                recommendation = {
                    by: recommendationSF[recommendationSF.length - 1].RecommendedBySAORec,
                    date: recommendationSF[recommendationSF.length - 1]
                        .RecommendedSCOHistory,
                };
            }

            const schemeMgmtDecisionObj = {
                employmentInjury: new apiDataType(
                    getFormFieldValue("ApprovalSubForm11/EmploymentInjuryADetailsSAOA")
                ).toBoolean(),
                recommendedBy: recommendation.by || null,
                recommendedDate: recommendation.date || null,
                approvedBy: getFormFieldValue("Approvedby"),
                approvedDate: getFormFieldValue("ApprovedDate"),
            };

            // Wages Info
            // Get Wages
            const wagesSF = getSubFormData2("WagesInformationSubform");
            let employerInfoListObj = [];

            if (wagesSF.length > 0) {
                for (let i = 0; i < wagesSF.length; i++) {
                    let wagesArr = [];
                    for (const wage of wagesSF[i].WagesDetailWagesInfo_SubForm
                        .WagesDetailWagesInfo) {
                        wagesArr.push({
                            year: new apiDataType(wage.YearWagesInfo).get(),
                            month: new apiDataType(wage.MonthWagesInfo).toMonth(),
                            wage: new apiDataType(wage.RMWagesSCO).toDecimal(),
                            contributionPaid: new apiDataType(
                                wage.ContributionPaidRMSCO
                            ).toDecimal(),
                            contributionPayable: new apiDataType(
                                wage.ContributionPayableRMSCO
                            ).toDecimal(),
                            contributionSurplusDeficit: new apiDataType(
                                wage.ContributionSurplusDeficitRMSCO
                            ).toDecimal(),
                        });
                    }
                    // current application only handles 1 employer only
                    employerInfoListObj.push({
                        employerId: new apiDataType(wagesSF[i].EmployerIdWagesInfo).toNA(),
                        employerCode: wagesSF[i].EmployerCodeWagesInfo,
                        employerName: wagesSF[i].EmployerNameWagesInfo,
                        employmentStartDate: wagesSF[i].EmployeymentStartDateWagesInfo,
                        employmentEndDate: wagesSF[i].EmployeymentEndDateWagesInfo,
                        wagesInfoList: wagesArr,
                    });
                }
            }

            const wagesInfoObj = {
                minimumWages: new apiDataType(
                    getFormFieldValue("MinWageDropdown")
                ).toBoolean(),
                similarWorker: new apiDataType(
                    getFormFieldValue("SimilarWorkerDropdown")
                ).toBoolean(),
                // ignore similar worker
                // similarWorkerDetail: {
                //   employeeID: "",
                //   name: getFormFieldValue("NameAN"),
                //   identificationInfoList: [
                //     {
                //       identificationTypeId: getFormFieldValue("IdentificationTypeAN"),
                //       identificationNoId: getFormFieldValue("IdentificationNoAN"),
                //     },
                //   ],
                // },
                employerInfoList: employerInfoListObj,
            };

            // HUS Info

            let husSF = getSubFormData2("SubFormMCInfo");
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

            const payload = {
                // refNo:"" to be generated in middleware
                caseInfo: caseInfoObj,
                insuredPersonInfo: insuredPersonInfoObj,
                bankInfo: bankInfoObj,
                //permanentRepresentative: prObj,
                employerInfo: employerInfoObj,
                accidentInfo: accidentInfoObj,
                // legalDecision: legalDecisionObj,
                schemeMgmtDecision: schemeMgmtDecisionObj,
                wagesInfo: wagesInfoObj,
                husInfo: husInfoObj,
            };

            await apiCall(
                "POST",
                getSystemValue("BARISTA_MIDDLEWARE")[0].Value +
                "/assist-ws/v2/nta/hus/first-payment",
                payload
            );
            accept(true);
        } catch (e) {
            console.log(e);
            reject(false);
        }
    });
}

async function saoSubmit() {
    // await ajax call to finish, then only proceed to submit
    try {
        const actionApprove = getFormFieldValue("ActionApprove");
        if (
            getFormFieldValue("ApprovalSubForm11/EmploymentInjuryADetailsSAOA") ==
            "Yes" &&
            validateForm()
        ) {
            if (actionApprove === "Approve") {
                await showDialogMessage("Sending information to ASSIST", "Info");
                if (await Promise.resolve(await sendFirstPayment())) {
                    console.log("successful call");
                    document.getElementsByClassName("k-i-close")[0].click();
                    await checkQueryStatus();
                } else {
                    document.getElementsByClassName("k-i-close")[0].click();
                    console.log("failed call");
                    await checkQueryStatus();
                }
            } else {
                await checkQueryStatus();
            }
        } else {
            showDialogMessage(
                "Validation failed. Form cannot be submitted.",
                "Error"
            );
        }
    } catch (e) {
        document.getElementsByClassName("k-i-close")[0].click();
        console.log(e);
    }
}
