function newNoticeDate(checkDate) {
    if (checkDate === "") {
        var mc_startDate = getFormFieldValue("DateafterMC");
    } else {
        console.log("look here");
        var formatted_date = checkDate.split('/').reverse().join('-');
        console.log(formatted_date);
        var mc_startDate = formatted_date;
    }

    console.log("check start date: " + mc_startDate);

    if (mc_startDate == "" || mc_startDate == undefined) {
        var notice_receiveDate = getFormFieldValue("NoticeandBenefitClaimFormReceivedDate1")
        var new_noticeDate = notice_receiveDate;
    } else {
        var new_noticeDate = mc_startDate;
        //var minusone = new Date(mc_startDate);
        //minusone.setDate(minusone.getDate() - 1);
        //new_noticeDate = minusone;
    }

    console.log("new date: " + new_noticeDate);


    setFormFieldValue("FinalNoticeDate", new_noticeDate);
    setFormFieldValue("NoticeDateCaseInfo", new_noticeDate);
    console.log("notice date updated");
    eFormCustomSettings.currentForm.lookupCaching.excludeItems.push({
        lookupName: 'LKGetContribution',
        fieldId: 'AutoLookup34'
    });
    eFormHelper.triggerAutoLookup({fieldId: 'AutoLookup34'}, function (resp) {
        console.log(resp);
    });

    eFormCustomSettings.currentForm.lookupCaching.excludeItems.push({lookupName: 'LkWI Not in Emp', fieldId: 'LkWI'});
    eFormHelper.triggerAutoLookup({fieldId: 'LkWI'}, function (resp) {
        console.log(resp);
    });
    //checkContribution();
    setFormFieldValue("Date4", getFormFieldValue("NoticeandBenefitClaimFormReceivedDate1"));
}

function checkAccrual() {
    console.log("run accrual blank");
    var accrual = readField("AccrualDate");
    var provisional_date = readField("ProvisionalEndDate");

    if (accrual == "" || accrual == undefined) {
        console.log("copy from notice date");
        //only one condition when running this, which is when the accrual date is blank = no MC
        var noticeDate = readField("NoticeDateCaseInfo");
        //Accrual date is the notice date
        setFormFieldValue("AccrualDate", noticeDate);
    }
}

function deathAction(date) {
    if (date != "") {
        $("#ActionSCO").html("<option value='close'>Close</option><option value='reject'>Reject</option>");
        $("#ActionRecommend").html("<option value='close'>Close</option><option value='reject'>Reject</option>");

    }
}