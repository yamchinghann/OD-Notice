//In PK Form
function checkAccrualDateWithMCExisted() {
    let MCItems = getSubFormData("SubForm1");
    let noticeDate = getFormFieldValue("NoticeandBenefitClaimFormReceivedDate1");
    if (!(MCItems.length > 0)) {
        setFormFieldValue("AccrualDate", noticeDate);
    }else {
        let MCs = getSubFormData("SubForm1").filter((item) => {
            if (item.HUSType === "MC") {
                return item;
            }
        }).sort((prevDate, currDate) => {
            return new Date(currDate.EndDateMC) - new Date(prevDate.EndDateMC);
        });
        let noticeDate = new Date(getFormFieldValue("NoticeandBenefitClaimFormReceivedDate1"));
        let lastMCDate = new Date(MCs[0].EndDateMC);
        let isMCBeforeNoticeDate = compareTwoDate(lastMCDate, noticeDate);
        let SMB = getSubFormData("ODSMBSF");

        if (MCs.length > 0) {
            if (isMCBeforeNoticeDate === "before") {
                if (calcDifferentNumberOfDay(noticeDate, lastMCDate) > 90) {
                    console.log("More than 90 days");
                    setFormFieldValue("AccrualDate", getAccrualDate(noticeDate, "Minus", 90));
                } else {
                    console.log("Less than 90 days");
                    setFormFieldValue("AccrualDate", getAccrualDate(lastMCDate, "Add", 1));
                }
            } else if (isMCBeforeNoticeDate === "after") {
                if (SMB.length > 0) {
                    //filter and sort SMB
                    let finalSMB = SMB.filter((item) => {
                        if (parseInt(item.ODSF1SessionAssessment) !== 0 && item.ODSF1MBType === "SMB") {
                            return item;
                        }
                    }).sort((a, b) => {
                        return new Date(b.ODSF1SessionDate) - new Date(a.ODSF1SessionDate);
                    });

                    let finalSMBDate = new Date(finalSMB[0].ODSF1SessionDate);

                    if (finalSMBDate.getTime() > noticeDate.getTime() && finalSMBDate.getTime() < lastMCDate.getTime()) {
                        console.log("SMB within between Notice Date and Last MC Date");
                        setFormFieldValue("AccrualDate", getAccrualDate(finalSMBDate, "Add", 1));
                    } else {
                        console.log("SMB not within between Notice Date and Last MC Date");
                        setFormFieldValue("AccrualDate", getAccrualDate(lastMCDate, "Add", 1));
                    }
                } else {
                    console.log("No SMB");
                    setFormFieldValue("AccrualDate", getAccrualDate(lastMCDate, "Add", 1));
                }
            }
        }else{
            console.log("No any MC get Approved by IO/SCO");
            setFormFieldValue("AccrualDate", noticeDate);
        }
    }
}

/*
In IO/SCO Form
###################
*/

//Validation
function isMCExisted() {
    console.log("Checking if MC Existed")
    let MCItems = getSubFormData("SubForm1");
    return (MCItems.length > 0)
}

//Calculate Function
function compareTwoDate(date1, date2) {
    console.log("Date1: MC last Date", "| Date2: Notice Date")
    if (date1.getTime() < date2.getTime()) {
        console.log("date1 is before date2");
        return "before";
    } else if (date1.getTime() > date2.getTime()) {
        console.log("date1 is after date2");
        return "after";
    } else {
        console.log("date1 and date2 are the same");
        return "same";
    }
}

function calcDifferentNumberOfDay(noticeDate, lastMCDate) {
    // Calculate the time difference in milliseconds
    let timeDiff = Math.abs(lastMCDate.getTime() - noticeDate.getTime());

    // Convert the time difference to days
    // Print the number of days
    //console.log(daysDiff);  // Output: 725
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

function isDateDifferenceMoreThan90Days(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day

    // Convert the date strings to Date objects
    const parsedDate1 = new Date(date1);
    const parsedDate2 = new Date(date2);

    // Calculate the difference in days
    const diffDays = Math.round(Math.abs((parsedDate2 - parsedDate1) / oneDay));
    console.log(diffDays);

    // Check if the difference is more than 90 days
    return diffDays > 90;
}

function getAccrualDate(date, operation, howManyDays) {
    const currentDate = date
    if(operation === 'Add'){
        currentDate.setDate(currentDate.getDate() + howManyDays);
    }else{
        currentDate.setDate(currentDate.getDate() - howManyDays);
    }

    // Format the date as "YYYY-MM-DD"
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
function formatDateToDDMMYYYY(dateString) {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
}

function calculateAccrualDate() {
    console.log("calculating Accrual Date");
    let currentAccrualDate = getFormFieldValue("AccrualDate");
    let noticeDate = new Date(getFormFieldValue("NoticeandBenefitClaimFormReceivedDate1"));

    //calculate
    if (isMCExisted() === false && !currentAccrualDate) {
        console.log("no MC");
        setFormFieldValue("AccrualDate", noticeDate);
    } else {
        let MCs = getSubFormData("SubForm1").filter((item) => {
            if (item.HUSType === "MC") {
                return item;
            }
        }).sort((prevDate, currDate) => {
            return new Date(currDate.EndDateMC) - new Date(prevDate.EndDateMC);
        });
        let noticeDate = new Date(getFormFieldValue("NoticeandBenefitClaimFormReceivedDate1"));
        let lastMCDate = new Date(MCs[0].EndDateMC);
        let isMCBeforeNoticeDate = compareTwoDate(lastMCDate, noticeDate);
        let SMB = getSubFormData("ODSMBSF");

        if (MCs.length > 0) {
            if (isMCBeforeNoticeDate === "before") {
                if (calcDifferentNumberOfDay(noticeDate, lastMCDate) > 90) {
                    console.log("More than 90 days");
                    setFormFieldValue("AccrualDate", getAccrualDate(noticeDate, "Minus", 90));
                } else {
                    console.log("Less than 90 days");
                    setFormFieldValue("AccrualDate", getAccrualDate(lastMCDate, "Add", 1));
                }
            } else if (isMCBeforeNoticeDate === "after") {
                if (SMB.length > 0) {
                    //filter and sort SMB
                    let finalSMB = SMB.filter((item) => {
                        if (parseInt(item.ODSF1SessionAssessment) !== 0 && item.ODSF1MBType === "SMB") {
                            return item;
                        }
                    }).sort((a, b) => {
                        return new Date(b.ODSF1SessionDate) - new Date(a.ODSF1SessionDate);
                    });

                    let finalSMBDate = new Date(finalSMB[0].ODSF1SessionDate);

                    if (finalSMBDate.getTime() > noticeDate.getTime() && finalSMBDate.getTime() < lastMCDate.getTime()) {
                        console.log("SMB within between Notice Date and Last MC Date");
                        setFormFieldValue("AccrualDate", getAccrualDate(finalSMBDate, "Add", 1));
                    } else {
                        console.log("SMB not within between Notice Date and Last MC Date");
                        setFormFieldValue("AccrualDate", getAccrualDate(lastMCDate, "Add", 1));
                    }
                } else {
                    console.log("No SMB");
                    setFormFieldValue("AccrualDate", getAccrualDate(lastMCDate, "Add", 1));
                }
            }
        }else{
            console.log("No any MC get Approved by IO/SCO");
            setFormFieldValue("AccrualDate", noticeDate);
        }
    }
}