eFormEvents.subForm.onAddRecord = function (sf) {
    if (sf.dataName == "SubForm1" || sf.dataName == "AttendedWorkDetails") {
        processMCInfo();
    }
};

eFormEvents.subForm.onDeleteRecord = function (sf) {
    if (sf.dataName == "SubForm1" || sf.dataName == "AttendedWorkDetails") {
        processMCInfo();
    }
};

function calcHUSDays() {
    triggerFormula("TotalHUSReceivedHUSInfo");
    let totalDays = getFormFieldValue("TotalHUSReceivedHUSInfo");
    let totalEligibleDays = getFormFieldValue("TotalEligibleHUSDaysHUSInfo");
    if (totalEligibleDays > totalDays) {
        totalDays = totalEligibleDays;
    }
    const sfData = getSubFormData("SubFormMCInfo");

    const latestMCEndDate = new Date(
        Math.max.apply(
            Math,
            sfData.map((record) => {
                return new Date(record.EndDateHUSInfo);
            }),
        ),
    );
    // compare when date of death occured
    const dateOfDeath = new Date(getFormFieldValue("DateofDeath"));
    if (dateOfDeath && latestMCEndDate > dateOfDeath) {
        const daysToRemove = Math.floor(
            (latestMCEndDate - dateOfDeath) / (24 * 3600 * 1000),
        );
        totalDays = totalDays - daysToRemove;
    }

    // compare if accident date is the same as declared mc date
    const accDate = new Date(getFormFieldValue("AccidentDateAccInfo"));
    const mcSF = getSubFormData("SubFormMCInfo");
    let earliestMC = mcSF.reduce((mcPrev, mcCurr) => {
        return new Date(mcPrev.StartDateHUSInfo) < new Date(mcCurr.StartDateHUSInfo)
            ? mcPrev
            : mcCurr;
    });

    totalDays =
        totalDays > 0 &&
        getFormFieldValue("WasWagesPaidontheDayofAccident") === "Yes" &&
        new Date(earliestMC.StartDateHUSInfo).getTime() == accDate.getTime()
            ? totalDays - 1
            : totalDays;
    setFormFieldValue("TotalHUSReceivedHUSInfo", totalDays);
    return;
}

function splitDates(startDate, stopDate) {
    var dateArray = new Array();
    if (stopDate < startDate) {
        return dateArray;
    }
    var currentDate = new Date(startDate);
    while (currentDate.getTime() <= stopDate.getTime()) {
        dateArray.push(new Date(currentDate));
        currentDate.addDays(1);
    }
    return dateArray;
}

// rejoin back row
function processMCInfo() {
    try {
        // mc info
        const mcInfos = getSubFormData2("SubForm1");

        let dateOfDeath;
        if (getFormFieldValue("DateofDeath")) {
            dateOfDeath = new Date(getFormFieldValue("DateofDeath"));
            // dateOfDeath.addMinutes(dateOfDeath.getTimezoneOffset());
            let dob = new Date(getFormFieldValue("DOBInsuredPerson"));
            let ageOfDeath = Math.abs(
                new Date(dateOfDeath - dob).getUTCFullYear() - 1970,
            );
            setFormFieldValue("AgeattheTimeofDeath", ageOfDeath);
        }

        // establish parent data
        let newData = [];
        for (let i = 0; i < mcInfos.length; i++) {
            newData.push({
                EligibleHUSHUSInfoDetailsHUSInfo: "0",
                EndDateHUSInfo: Date.parse(mcInfos[i].EndDateMC),
                HUSStatusHUSDetailsHUSI: mcInfos[i].HUSStatus,
                HUSTypeDropdown: mcInfos[i].HUSType,
                NameAddressFirstClinic:
                mcInfos[i].NameandAddressofClinicHospitalwhichProvidesTreatment,
                RuleHolderHUSInfoDetailsHUSInfo: "0",
                StartDateHUSInfo: Date.parse(mcInfos[i].StartDate),
                TotalDaysHUSInfo: mcInfos[i].TotalDays,
                index: i,
            });
        }

        // sort parent data with start date;
        newData.sort(function (a, b) {
            return a.StartDateHUSInfo - b.StartDateHUSInfo;
        });

        // attended work info
        const attendedWorkInfos = getSubFormData2("AttendedWorkDetails");

        // reinitialize attended work subform for easier usage
        let attendedWorkData = attendedWorkInfos.map((aw) => ({
            startDate: Date.parse(aw.StartDateAttendedWork),
            endDate: Date.parse(aw.EndDateAttendedWork),
        }));

        // initialize empty object that is indexed
        const mcChildren = {};

        // breakdown each MC dates
        for (const nD of newData) {
            const mcChild = []; // initialize empty array
            const dates = splitDates(nD.StartDateHUSInfo, nD.EndDateHUSInfo);
            for (const date of dates) {
                // check if any attended work are in between parent's dates
                let hasAttendedWork =
                    attendedWorkData.filter(
                        (aw) => aw.startDate <= date && aw.endDate >= date,
                    ).length > 0;

                let hasOverlap =
                    newData.filter(
                        (nd) =>
                            nd != nD &&
                            nd.StartDateHUSInfo <= date &&
                            nd.EndDateHUSInfo >= date,
                    ).length > 0;

                let status;
                if (!!dateOfDeath && date.getTime() >= dateOfDeath.getTime()) {
                    status = "Death";
                } else if (hasAttendedWork) {
                    status = "Attended Work And Salary Paid";
                } else if (hasOverlap) {
                    status = "Overlapped";
                } else {
                    status = "New";
                }
                mcChild.push({ date, status, hasAttendedWork, hasOverlap });
            }
            mcChildren[nD.index] = mcChild;
        }

        // map childrens to parent
        for (let parentId in mcChildren) {
            let resultingChildren = [];
            const mcChild = mcChildren[parentId];
            // looping through assigned child
            for (let index in mcChild) {
                if (index > 0) {
                    // not first item
                    if (mcChild[index].status == mcChild[index - 1].status) {
                        // if status is same as previous
                        resultingChildren[
                        resultingChildren.length - 1
                            ].EndDateHUSInfo.addDays(1); // end date +1
                    } else {
                        // if status not same as previous
                        let newChild = {
                            // create new child
                            ParentChildHUSInfoDetailsHUSInfo: "Child",
                            StartDateHUSInfo: new Date(mcChild[index].date),
                            EndDateHUSInfo: new Date(mcChild[index].date),
                            HUSStatusHUSDetailsHUSI: mcChild[index].status,
                        };
                        resultingChildren.push(newChild);
                    }
                } else {
                    // first item
                    let firstChild = {
                        // initialize first child
                        ParentChildHUSInfoDetailsHUSInfo: "Child",
                        StartDateHUSInfo: new Date(mcChild[index].date),
                        EndDateHUSInfo: new Date(mcChild[index].date),
                        HUSStatusHUSDetailsHUSI: mcChild[index].status,
                    };
                    resultingChildren.push(firstChild);
                }
            }

            let parentIndex = newData.findIndex((f) => f.index == parentId);
            if (
                resultingChildren.length > 1 ||
                (resultingChildren.length == 1 &&
                    resultingChildren[0].HUSStatusHUSDetailsHUSI != "New")
            ) {
                // if there's more than one child or child status is not "New"
                newData[parentIndex].ParentChildHUSInfoDetailsHUSInfo =
                    "Parent has child";
                newData[parentIndex].HUSStatusHUSDetailsHUSI = "Please Select";
                newData.splice(parentIndex + 1, 0, ...resultingChildren);
            } else {
                newData[parentIndex].ParentChildHUSInfoDetailsHUSInfo =
                    "Parent no child";
            }
        }

        // delete all --> add --> set, will trigger formula and rules properly
        deleteRowsToSubform("SubFormMCInfo", "*"); // delete all rows

        for (let i in newData) {
            // add subform table rows to the number of rows in newData
            addRowsToSubForm("SubFormMCInfo", []);
        }

        setFormFieldValue("SubFormMCInfo", { SubFormMCInfo: newData }); // setToSubForm
    } catch (error) {
        console.error("@processMCInfo: " + error);
        console.error(error.stack);
    }
}

// split row
function breakdown(event, nRowToAdd) {
    try {
        debugger;
        const subFormId = $(event.currentTarget)
            .closest(".subFormContent")
            .attr("id");

        const subFormData = getSubFormData2(subFormId);

        // current row number
        const rowN =
            $(event.currentTarget).closest(".subFormContentRow").index() + 1;
        // current row status
        const statusRowN = getFormFieldValue(
            "SubFormMCInfo/HUSStatusHUSDetailsHUSI: [" + rowN + "]",
        );
        // current row start date
        const startDateRowN = getFormFieldValue(
            "SubFormMCInfo/StartDateHUSInfo: [" + rowN + "]",
        );
        // current row end date
        const endDateRowN = getFormFieldValue(
            "SubFormMCInfo/EndDateHUSInfo: [" + rowN + "]",
        );

        addAndOrShiftRows(
            subFormId,
            subFormData,
            subFormData.length,
            rowN,
            nRowToAdd,
        );
        setFormFieldValue(
            "SubFormMCInfo/HUSApprovalStatusSplitHUSDetailsHUSInfoHUSInfo: [" +
            rowN +
            "]",
            "Split",
        );
        triggerFormula(
            "SubFormMCInfo/RuleHolderHUSInfoDetailsHUSInfo: [" + rowN + "]",
        );
        triggerControlRule(
            "SubFormMCInfo/RuleHolderHUSInfoDetailsHUSInfo: [" + rowN + "]",
        );
        triggerFormula(
            "SubFormMCInfo/HUSApprovalStatusDisplayHUSDetailsHUSI: [" + rowN + "]",
        );
        triggerFormula(
            "SubFormMCInfo/EligibleHUSHUSInfoDetailsHUSInfo: [" + rowN + "]",
        );
        triggerFormula("TotalEligibleHUSDaysHUSInfo");
        for (i = 1; i <= nRowToAdd; i++) {
            setFieldValue(
                "SubFormMCInfo/HUSStatusHUSDetailsHUSI: [" + (rowN + i) + "]",
                statusRowN,
            );
            triggerControlRule(
                "SubFormMCInfo/HUSStatusHUSDetailsHUSI: [" + (rowN + i) + "]",
            );
            setFormFieldValue(
                "SubFormMCInfo/HUSApprovalStatusSplitHUSDetailsHUSInfoHUSInfo: [" +
                (rowN + i) +
                "]",
                "Split Child",
            );
            triggerFormula(
                "SubFormMCInfo/RuleHolderHUSInfoDetailsHUSInfo: [" + (rowN + i) + "]",
            );
            triggerControlRule(
                "SubFormMCInfo/RuleHolderHUSInfoDetailsHUSInfo: [" + (rowN + i) + "]",
            );
            triggerFormula(
                "SubFormMCInfo/HUSApprovalStatusDisplayHUSDetailsHUSI: [" +
                (rowN + i) +
                "]",
            );
            console.log("set");
        }

        // layout for the rest of the rows
        for (
            let r = rowN + nRowToAdd + 1;
            r <= subFormData.length + nRowToAdd;
            r++
        ) {
            triggerControlRule(
                "SubFormMCInfo/RuleHolderHUSInfoDetailsHUSInfo: [" + r + "]",
            );
        }

        // fix start date and end date
        setFormFieldValue(
            "SubFormMCInfo/StartDateHUSInfo: [" + (rowN + 1) + "]",
            startDateRowN,
        );
        setFormFieldValue(
            "SubFormMCInfo/EndDateHUSInfo: [" + (rowN + nRowToAdd) + "]",
            endDateRowN,
        );
        setFormEnabled(
            "SubFormMCInfo/StartDateHUSInfo: [" + (rowN + 1) + "]",
            false,
        );
        setFormEnabled(
            "SubFormMCInfo/EndDateHUSInfo: [" + (rowN + nRowToAdd) + "]",
            false,
        );
    } catch (error) {
        console.error("@breakdown: " + error);
    }
}

function collapse(event, nRowToRemove) {
    try {
        // get SubFormId
        const subFormId = $(event.currentTarget)
            .closest(".subFormContent")
            .attr("id");

        const subFormData = getSubFormData2(subFormId);
        // number of rows
        const nRow = subFormData.length;
        // current row number
        const rowN =
            $(event.currentTarget).closest(".subFormContentRow").index() + 1;

        var rowNToRemove = [];
        for (i = 1; i <= nRowToRemove; i++) {
            rowNToRemove.push(rowN + i);
        }

        deleteRowsToSubform(subFormId, rowNToRemove.toString());
        setFormFieldValue(
            "SubFormMCInfo/HUSApprovalStatusSplitHUSDetailsHUSInfoHUSInfo: [" +
            rowN +
            "]",
            "Please Select",
        );
        triggerFormula(
            "SubFormMCInfo/RuleHolderHUSInfoDetailsHUSInfo: [" + rowN + "]",
        );
        triggerFormula(
            "SubFormMCInfo/HUSApprovalStatusSplitHUSDetailsHUSInfoHUSInfo: [" +
            rowN +
            "]",
        );
        triggerFormula(
            "SubFormMCInfo/EligibleHUSHUSInfoDetailsHUSInfo: [" + rowN + "]",
        );
        triggerFormula("TotalEligibleHUSDaysHUSInfo");
        for (let r = rowN; r <= nRow - nRowToRemove; r++) {
            triggerControlRule(
                "SubFormMCInfo/RuleHolderHUSInfoDetailsHUSInfo: [" + r + "]",
            );
        }
        triggerFormula(
            "SubFormMCInfo/HUSApprovalStatusDisplayHUSDetailsHUSI: [" + rowN + "]",
        );
    } catch (error) {
        console.error("@collapse: " + error);
    }
}

function addAndOrShiftRows(subFormId, subFormData, nRow, rowN, nRowToAdd) {
    try {
        // Initialize empty array
        const emptyArray = [{}];
        // Increase to the amount of rows to be added
        for (i = 1; i < nRowToAdd; i++) {
            emptyArray.push({});
        }
        // Add UI rows to SubForm (data shown is limited by rows shown in UI)
        addRowsToSubForm(subFormId, emptyArray);

        // Array operation
        // Get SubForm data array
        var allRows = getSubFormData2(subFormId);
        // Get "data" of "empty" row ("empty" dropdown has value of "Please Select")
        var emptyRow = allRows[nRow];
        // Insert "empty" rows below selected row
        for (i = 0; i < nRowToAdd; i++) {
            allRows.splice(rowN, 0, emptyRow);
        }
        // Trimming empty rows added to the end (optional, SubForm does not store the excessive rows)
        allRows.splice(nRow + nRowToAdd, nRowToAdd);

        // Replace existing SubForm data with new array
        setFormFieldValue(subFormId, { [subFormId]: allRows });
    } catch (error) {
        console.error("@addAndOrShiftRows: " + error);
    }
}

function lastMcDate() {
    let mcInfo = getSubFormData("SubFormMCInfo");
    let arrDate = [];
    for (let i = 0; i < mcInfo.length; i++) {
        if (mcInfo[i].HUSApprovalStatusDisplayHUSDetailsHUSI.trim() == "Approved") {
            arrDate.push(mcInfo[i].EndDateHUSInfo);
        }
    }
    let sortedDate = arrDate.sort();
    let lastDate = sortedDate[sortedDate.length - 1];
    let startHukDate = new Date(lastDate);
    startHukDate.setDate(startHukDate.getDate() + 14);
    setFormFieldValue("Date", startHukDate);
}
