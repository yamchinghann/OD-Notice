/*
 * JQuery WYSIWYG Web Form Designer
 * Copyright 2015 AgilePoint Inc
 */

/* Add your JS code Here (Press Ctrl+Space keys for intellisense) */
function hasMatch(pool, monthYear) {
    let r = false;
    for (let i = 0; i < pool.length; i++) {
        if (pool[i] === monthYear) {
            r = true;
        }
    }
    return r;
}

/*function testLessThan() {
    let arrayTest = ['15/01/2022', '11/01/2022']
    let arrRes = []
    let sum = 0;
    for (let a = 0; a < arrayTest.length; a++) {
        arrRes.push(hasLessThan(arrayTest[a], '12/01/2021', '01/2022'))
    }
    for (let b = 0; b < arrRes.length; b++) {
        sum += arrRes[b]
    }
    console.log(sum)
}*/

//call hasLessThan ('13/01/2022', '20/10/2021')
function hasLessThan(startDate, endDate, duplicateDate) {
    let remainDays;
    let daysArray = [];
    let monthLessThan = [];
    let endDateDay = endDate.split('/')[0];
    let startDateDay = startDate.split('/')[0];
    if (!!startDate) {
        // dd/mm/yyyy [0]/[1]/[2]
        let startMonthYear = startDate.split('/')[1] + '/' + startDate.split('/')[2];
        let startDateMonth = startDate.split('/')[1];
        let startDateYear = startDate.split('/')[2];

        if (startDateMonth === 2 && startDateYear % 4 !== 0) {
            // feb regular
            if (29 - startDateDay < 24) {
                remainDays = 29 - startDateDay
                monthLessThan.unshift(startMonthYear);
            } // feb leap
        } else if (startDateMonth === 2 && startDateYear % 4 === 0) {
            if (30 - startDateDay < 24) {
                remainDays = 30 - startDateDay
                monthLessThan.unshift(startMonthYear);
            } // odd month
        } else if (startDateMonth % 2 !== 0) {
            if (32 - startDateDay < 24) {
                remainDays = 32 - startDateDay
                monthLessThan.unshift(startMonthYear);
            } // even month
        } else if (startDateMonth % 2 === 0) {
            if (31 - startDateDay < 24) {
                remainDays = 31 - startDateDay
                monthLessThan.unshift(startMonthYear);
            }
        }
        if (startMonthYear === duplicateDate && !!duplicateDate) {
            daysArray.push(parseInt(remainDays));
            return daysArray
        }
    }
    // endDate
    if (!!endDate) {
        let endMonthYear = endDate.split('/')[1] + '/' + endDate.split('/')[2];
        // dd/mm/yyyy [0]/[1]/[2]
        let endDateMonth = endDate.split('/')[1];
        let endDateYear = endDate.split('/')[2];

        if (endDateDay < 24) {
            monthLessThan.unshift(endMonthYear);
        }

        if (endMonthYear === duplicateDate && !!duplicateDate) {
            daysArray.push(parseInt(endDateDay));
            return daysArray;
        }
    }
    return monthLessThan;
}

function toNum(m) {
    switch (m) {
        case "jan":
            return "01";
        case "feb":
            return "02";
        case "mar":
            return "03";
        case "apr":
            return "04";
        case "may":
            return "05";
        case "jun":
            return "06";
        case "jul":
            return "07";
        case "aug":
            return "08";
        case "sep":
            return "09";
        case "oct":
            return "10";
        case "nov":
            return "11";
        case "dec":
            return "12";
        default:
            return parseInt(m);
    }
}

async function lkWages() {
    return new Promise((Accept, Reject) => {
        let options = {};
        options.fieldId = 'WagesDetails6Months/GetContributions';
        eFormHelper.triggerAutoLookup(options, function (result) {
            if (result.isSuccess) {
                console.log(result.data);
                Accept(result.data)
            } else {
                Reject(result.data)
                console.log(result.error);
            }
        });

    })
}

function loopEmployer(dupeDates) {
    let numberOfEmployer = getSubFormData('WagesDetails6Months');
    const incompleteDates = [];
    let yearMonthList = [];
    let parsedStartDate;
    let parsedEndDate;
    let combinedStartDate;
    let combinedEndDate;
    let sumDays = 0;
    let returnedDate;
    let startMonthYear;
    let endMonthYear;
    let k;
    let startDate;
    let endDate;
    for (let empNumber = 0; empNumber < numberOfEmployer.length; empNumber++) {
        startDate = numberOfEmployer[empNumber].EmploymentStartDateWI;
        endDate = numberOfEmployer[empNumber].EmploymentEndDateWI;

        startMonthYear = startDate.split('-')[1] + '/' + startDate.split('-')[0];
        endMonthYear = endDate.split('-')[1] + '/' + endDate.split('-')[0];
        parsedStartDate = startDate.split('-')[2] + '/' + startMonthYear;
        parsedEndDate = endDate.split('-')[2] + '/' + endMonthYear;
        yearMonthList.push(startMonthYear, endMonthYear);

        returnedDate = hasLessThan(parsedStartDate, parsedEndDate, dupeDates)
        for (k = 0; k < returnedDate.length; k++) {
            incompleteDates.push(returnedDate[k]);
        }
    }

    //got remainderDays,add them all
    if (!!dupeDates) {
        for (let s = 0; s < incompleteDates.length; s++) {
            sumDays += incompleteDates[s];
        }
        combinedStartDate = yearMonthList.indexOf(dupeDates);
        combinedEndDate = yearMonthList.indexOf(dupeDates);
        console.log(combinedStartDate + '<start end>' + combinedEndDate);
        if (sumDays >= 24 && combinedStartDate !== -1) {
            return yearMonthList[combinedStartDate];
        }
        if (sumDays >= 24 && combinedEndDate !== -1) {
            return yearMonthList[combinedEndDate];
        }
    }
    return incompleteDates;
}

function HighlightField(event) {
    let startDate;
    let endDate;
    let combinableDates = [];
    let duplicateDates;
    let searchDuplicate = arry => arry.filter((item, index) => arry.indexOf(item) !== index);
    let employerCount = getSubFormData('WagesDetails6Months').length;

    let insuffDays = loopEmployer('');
    duplicateDates = searchDuplicate(insuffDays);
    //console.log(duplicateDates)
    //["01/2022","10/2021"]
    for (let l = 0; l < duplicateDates.length; l++) {
        //console.log(duplicateDates[l])
        combinableDates.push(loopEmployer(duplicateDates[l]));
    }
    //console.log(combinableDates)

    let aE = $('#WagesDetails6Months > .subFormContentRow');
    for (let i = 0; i < aE.length; i++) {
        // get employmentinfo row
        let e = $(aE[i]);
        // get employmentStartDate
        let eSDt = $(e).find('[id^="EmploymentStartDateWI-"]').val();
        // get employmentEndDate
        let eEDt = $(e).find('[id^="EmploymentEndDateWI-"]').val();
        // get allWagesinfo rows
        let aW = $(e).find('[id^="WagesDetailWagesInfoSubForm1"] > .subFormContentRow');
        // if employment start date or employment end date has values
        if (!!eSDt || !!eEDt) {
            // check if day is less than 24 days, if yes return month
            const p = hasLessThan(eSDt, eEDt);
            // check if there's month
            if (p !== undefined && p.length > 0) {
                // loop allWagesinfo rows
                for (let j = 0; j < aW.length; j++) {
                    // get wageinfo row
                    let w = $(aW[j]);

                    // get wageMonth
                    let wM = $(w).find('[id^="MonthWagesInfoSub1-"]');
                    // get wageYear
                    let wY = $(w).find('[id^="YearWagesInfoSub1-"]');
                    // get wageMonth field value
                    let wMV = $(wM).val().substr(0, 3).toLowerCase();
                    // get wageYear field value
                    let wYV = $(wY).val();
                    // check if there's values in month and year fields
                    let monthYear = toNum(wMV) + '/' + wYV
                    let dateToCombine = combinableDates.indexOf(monthYear)
                    if (!!wMV && !!wYV) {
                        // check if the values matches the target
                        if (hasMatch(p, monthYear) && dateToCombine !== -1) {
                            $(w).find(".Highlight").attr('style', 'background-color: #00FF00 !important');
                            console.log('found combine')
                        } else if (hasMatch(p, monthYear) && dateToCombine === -1) {
                            console.log('no combine')
                            $(w).find(".Highlight").attr('style', 'background-color: #FFD965 !important');
                            if (employerCount === 1 && j === 0) {
                                enableSimilarWorker();
                                setField('SimilarWorkerDropdown', 'Yes')
                                setField('MinWageDropdown', 'No')
                                disableField('SimilarWorkerDropdown', true)
                                disableField('WagesInformationSubform', false)
                                disableField('MinWageDropdown', false)
                                disableField('SearchAN', true)
                                window.removeEventListener("click", triggerHighlight, true)
                            }

                        } else {
                            console.log('else executed')
                            $(w).find(".Highlight").attr('style', 'background-color: #F4F4F4 !important');
                        }
                    } else {
                        $(w).find(".Highlight").attr('style', 'background-color: #F4F4F4 !important');
                    }
                }
            } else if (p !== undefined && p.length === 0) {
                for (let j = 0; j < aW.length; j++) {
                    let w = $(aW[j]);
                    $(w).find(".Highlight").attr('style', 'background-color: #F4F4F4 !important');
                }
            }
        } else {
            for (let j = 0; j < aW.length; j++) {
                let w = $(aW[j]);
                $(w).find(".Highlight").attr('style', 'background-color: #F4F4F4 !important');
            }
        }
    }
}

function triggerHighlight(event) {
    HighlightField(event)
}

function enableSimilarWorker() {
    let options = {};
    options.fieldId = 'SimilarWorkerDropdown';
    options.propertyName = eFormHelper.constants.fieldProperty.Enabled;
    options.value = true;
    eFormHelper.updateFieldProperty(options, function (result) {
        if (result.isSuccess) {
            console.log(result.data); //logs the data holds the empty object
        } else {
            console.log(result.error); // logs the hold exception object
        }
    });
}

window.addEventListener("click", triggerHighlight, true);
