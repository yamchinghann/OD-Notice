function getODDate() {
    console.log("Get Occupational Disease Date");
    const MCInfos = getSubFormData("SubForm1");
    let ODDate = getFormFieldValue("ODDateODInfo");
    try{
        if(!ODDate || ODDate === ""){
            if(MCInfos.length > 0){
                // Extract the start dates from the data
                const startDates = MCInfos.map(item => new Date(item.StartDate));

                // Find the earliest start date
                const earliestStartDate = startDates.reduce((pre, cur) => (cur < pre ? cur : pre));
                setFormFieldValue("ODDateODInfo", formatDateToYYYYMMDD(earliestStartDate.setDate(earliestStartDate.getDate() - 1)));
            }else{
                let noticeDate  = getFormFieldValue("NoticeandBenefitClaimFormReceivedDate1");
                setFormFieldValue("ODDateODInfo", noticeDate);
            }
        }
    }catch (e) {
        console.log(e)
    }
}

