eFormEvents.subForm.onDeleteRecord = function (sf) {
    if (sf.dataName == "SubForm1" || sf.dataName == "AttendedWorkDetails") {
        processMCInfo();
    }
};

async function addTriggerToOkButton() {
    $('.popActionButtons.btnSummaryColumnsOK').click(() => processMCInfo(event));
    // console.log('trigger added');
}

function getRandom() {
    return parseInt(Math.random() * 0xffff % 0xffff)
}

function getDates(startDate, stopDate) {
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

function updateNoticeDate(startDate) {
    console.log('MC startdate update: ' + startDate);
    setFormFieldValue("DateafterMC", startDate);
}

function calcHUSDays() {
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
            })
        )
    );
    // compare when date of death occured
    const dateOfDeath = new Date(getFormFieldValue("DateofDeathIPI"));
    if (latestMCEndDate > dateOfDeath) {
        const daysToRemove = Math.floor(
            (latestMCEndDate - dateOfDeath) / (24 * 3600 * 1000)
        );
        totalDays = totalDays - daysToRemove;
    }

    const odDate = new Date(getFormFieldValue("ODDateODInfo"));
    const mcSF = getSubFormData("SubFormMCInfo");
    let earliestMC = mcSF.reduce((mcPrev, mcCurr) => {
        return new Date(mcPrev.StartDateHUSInfo) < new Date(mcCurr.StartDateHUSInfo)
            ? mcPrev
            : mcCurr;
    });

    totalDays =
        totalDays > 0 &&
        getFormFieldValue("IsWagesPaidontheDayofAccident") === "Yes" &&
        new Date(earliestMC.StartDateHUSInfo).getTime() == odDate.getTime()
            ? totalDays - 1
            : totalDays;
    setFormFieldValue("TotalHUSReceivedHUSInfo", totalDays);
    return;
}

async function processMCInfo(event) {
    try {
        const mcInfos = await getSubFormData('SubForm1'); // get mcInfo
        // console.log('mcInfos: ', mcInfos);
        const attendedWorkInfos = await getSubFormData('AttendedWorkDetails'); // get attendedWorkInfo
        // console.log('attendedWorkInfos: ', attendedWorkInfos);

        //calculate Age of Death
        calculateAgeOfDeath();
        const dateOfDeath = new Date(await getFieldValue('DateofDeathIPI')); // get dateOfDeath
        dateOfDeath.addMinutes(dateOfDeath.getTimezoneOffset());
        let newData = [];
        for (const mcInfoNumber in mcInfos) {
            // console.log(mcInfos[mcInfoNumber]);
            newData[newData.length] = { // construct mcInfo in the form of SubFormMCInfo structure
                EligibleHUSHUSInfoDetailsHUSInfo: "0",
                EndDateHUSInfo: Date.parse(mcInfos[mcInfoNumber].EndDateMC),
                HUSApprovalStatusDisplayHUSDetailsHUSI: "",
                HUSApprovalStatusHUSDetailsHUSI: "Please Select",
                HUSApprovalStatusHUSDetailsHUSInfoHUSInfo: "Please Select",
                HUSApprovalStatusSplitHUSDetailsHUSInfoHUSInfo: "Please Select",
                HUSReceivedHUSInfoDetailsHUSInfo: " 0",
                HUSStatusHUSDetailsHUSI: mcInfos[mcInfoNumber].HUSStatus,
                HUSTypeDropdown: mcInfos[mcInfoNumber].HUSType,
                NameAddressFirstClinic: mcInfos[mcInfoNumber].NameandAddressofClinicHospitalwhichProvidesTreatment,
                ParentChildHUSInfoDetailsHUSInfo: "Please Select",
                ParentIDHUSInfoDetailsHUSInfo: "",
                RuleHolderHUSInfoDetailsHUSInfo: "0",
                StartDateHUSInfo: Date.parse(mcInfos[mcInfoNumber].StartDate),
                TotalDaysEligibleHUSInfoDetailsHUSInfo: "",
                TotalDaysHUSInfo: mcInfos[mcInfoNumber].TotalDays,
                TotalDaysReceivableHUSInfoDetailsHUSInfo: ""
            };
        }

        newData.sort(function (a, b) { // sort MC Info according to Start Date
            return a.StartDateHUSInfo - b.StartDateHUSInfo
        });

        newData.forEach(function (n) {
            return n.timestamp = getRandom();
        })
        let attendedWorkData = attendedWorkInfos.map(aw => ({
            startDate: Date.parse(aw.StartDateAttendedWork),
            endDate: Date.parse(aw.EndDateAttendedWork)
        }))

        const mcChildren = {}; // initialize empty array
        // if otherMCInfoDate is within currentMCInfoDate
        for (const nD of newData) {
            const mcChild = []; // initialize empty array
            const startDate = nD.StartDateHUSInfo;
            const endDate = nD.EndDateHUSInfo;
            const dates = getDates(startDate, endDate);
            for (const date of dates) { // check hasAW && hasOL
                let hasAttendedWork = attendedWorkData.filter(aw =>
                    aw.startDate <= date
                    && aw.endDate >= date).length > 0;
                let hasOverlap = newData.filter(nd => nd != nD
                    && nd.StartDateHUSInfo <= date
                    && nd.EndDateHUSInfo >= date).length > 0;

                let status;
                if (!!dateOfDeath && date.getTime() >= dateOfDeath.getTime()) {
                    status = 'Death';
                } else if (hasAttendedWork) {
                    status = 'Attended Work And Salary Paid';
                } else if (hasOverlap) {
                    status = 'Overlapped';
                } else {
                    status = 'New';
                }
                mcChild.push({date, status, hasAttendedWork, hasOverlap});
            }
            mcChildren[nD.timestamp] = mcChild;
        } // loop newData

        // attempt to add newdata
        for (let parentId in mcChildren) { // looping through each MC
            let resultingChildren = [];
            const mcChild = mcChildren[parentId];
            for (let index in mcChild) { // looping through each date of MC
                if (index > 0) { // not first item
                    if (mcChild[index].status == mcChild[index - 1].status) { // if status is same as previous
                        resultingChildren[resultingChildren.length - 1].EndDateHUSInfo.addDays(1); // end date +1
                    } else { // if status not same as previous
                        let newChild = { // create new child
                            ParentChildHUSInfoDetailsHUSInfo: "Child",
                            StartDateHUSInfo: new Date(mcChild[index].date),
                            EndDateHUSInfo: new Date(mcChild[index].date),
                            HUSStatusHUSDetailsHUSI: mcChild[index].status
                        }
                        resultingChildren.push(newChild);
                    }
                } else { // first item
                    let firstChild = { // initialize first child
                        ParentChildHUSInfoDetailsHUSInfo: "Child",
                        StartDateHUSInfo: new Date(mcChild[index].date),
                        EndDateHUSInfo: new Date(mcChild[index].date),
                        HUSStatusHUSDetailsHUSI: mcChild[index].status
                    }
                    resultingChildren.push(firstChild);
                }
            }

            let parentIndex = newData.findIndex(f => f.timestamp == parentId);
            if (resultingChildren.length > 1 || (resultingChildren.length == 1 &&
                resultingChildren[0].HUSStatusHUSDetailsHUSI != "New")) { // if there's more than one child or child status is not "New"
                newData[parentIndex].ParentChildHUSInfoDetailsHUSInfo = "Parent has child";
                newData[parentIndex].HUSStatusHUSDetailsHUSI = "Please Select";
                newData.splice(parentIndex + 1, 0, ...resultingChildren);
            } else {
                newData[parentIndex].ParentChildHUSInfoDetailsHUSInfo = "Parent no child";
            }
        }

        // delete all --> add --> set, will trigger formula and rules properly
        await deleteRowsFromSubForm('SubFormMCInfo', '*'); // delete all rows

        for (let i in newData) { // add subform table rows to the number of rows in newData
            await addRowsToSubForm('SubFormMCInfo', []);
        }

        await setFormFieldValue('SubFormMCInfo', {SubFormMCInfo: newData}); // setToSubForm
        //console.log(newData);
        //console.log(newData[0].StartDateHUSInfo);
        var oriSD = newData[0].StartDateHUSInfo;
        var newSD = new Date(oriSD.getTime() - (oriSD.getTimezoneOffset() * 60000)).toISOString().split("T")[0];
        updateNoticeDate(newSD);
        newNoticeDate(newSD);

        var oriED = newData[0].EndDateHUSInfo;
        console.log("endDate: " + oriED);
        var newED = new Date(oriED.getTime() - (oriED.getTimezoneOffset() * 60000)).toISOString().split("T")[0];
        calcAccrual(newED, newSD);

    } catch (error) {
        console.error('@processMCInfo: ' + error);
        console.error(error.stack)
    }
}

function calcAccrual(endDate, startDate) {
    console.log("calcAccrual starting....");
    let mc_end = new Date(endDate);
    console.log("fetched value: " + mc_end);
    let notice_date = "";
    let options = {};
    options.fieldId = 'FinalNoticeDate';
    eFormHelper.getFieldValue(options, function (result) {
        if (result.isSuccess) //check if is success
        {
            notice_date = result.data;
        } else {
            console.log(result.error); //logs the error
        }
    });

    notice_date = new Date(startDate);
    console.log("notice date: " + notice_date);
    notice_date = new Date(notice_date);


    if (notice_date.getTime() > mc_end.getTime()) {
        let diffTime = Math.abs(notice_date - mc_end);
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        console.log('difference: ' + diffDays);

        if (diffDays > 90) {
            //if end date is before notice date and more than 90 days
            let accrual = new Date();
            accrual.setDate(notice_date.getDate() - 90);
            console.log("ND>MC>90: " + accrual);
            setFormFieldValue("AccrualDate", accrual);
        } else {
            //if end date is before notice date and less than 90 days
            let month = mc_end.getUTCMonth() + 1; //months from 1-12
            let day = mc_end.getUTCDate() + 1;
            let year = mc_end.getUTCFullYear(); //last day MC + 1

            let newdate = year + "-" + month + "-" + day;
            console.log("ND>MC<90: " + newdate);
            setFormFieldValue("AccrualDate", newdate);
        }

    } else {
        //in this condition, if got mc and ND < MD, based on appendix, mc end + 1 = accrual date
        let accrual = new Date();
        //  let day = 60 * 60 * 24 * 1000;
        //console.log(mc_end.getTime()+day);
        //let new_date = new Date(mc_end.getTime() + day);
        // let new_date = incrementDate(endDate,1);
        let new_date = new Date(endDate);

        let month = new_date.getUTCMonth() + 1; //months from 1-12
        let day = new_date.getUTCDate() + 1;
        let year = new_date.getUTCFullYear();

        let newdate = year + "-" + month + "-" + day;

        console.log("ND<MC:" + newdate);
        setFormFieldValue("AccrualDate", newdate);
    }

}

function incrementDate(dateInput, increment) {
    let dateFormatTotime = new Date(dateInput);
    let increasedDate = new Date(dateFormatTotime.getTime() + (increment * 86400000));
    return increasedDate;
}

function calculateAgeOfDeath() {
    let dateOfDeath;
    if (getFormFieldValue("DateofDeathIPI")) {
        dateOfDeath = new Date(getFormFieldValue("DateofDeathIPI"));
        let dob = new Date(getFormFieldValue("DateofBirth"));
        let ageOfDeath = Math.abs(
            new Date(dateOfDeath - dob).getUTCFullYear() - 1970
        );
        setFormFieldValue("AgeattheTimeofDeathIPI", ageOfDeath);
    }
}