/*
 * JQuery WYSIWYG Web Form Designer
 * Copyright 2015 AgilePoint Inc
 */

/* Add your JS code Here (Press Ctrl+Space keys for intellisense) */

function hasMatch (pool, month, year) {
    var r = false;
    for (let i = 0; i < pool.length; i++) {
      if (pool[i][0]==month && pool[i][1]==year) { r = true; }
    }
    return r;
  }
  
  function hasLessThan (startDate, endDate) {
    const monthLessThan = [];
    
    // startDate
    if (!!startDate) {
      // dd/mm/yyyy [0]/[1]/[2]
      var startDateDay = startDate.split('/')[0];
      var startDateMonth = startDate.split('/')[1];
      var startDateYear = startDate.split('/')[2];
    
      if (startDateMonth == 02 && startDateYear != 0) {
        // feb regular
        if (29-startDateDay < 24) {
          monthLessThan.push([startDateMonth, startDateYear]);
        } // feb leap
      } else if (startDateMonth == 02 && startDateYear == 0) {
        if (30-startDateDay < 24) {
          monthLessThan.push([startDateMonth, startDateYear]);
        } // odd month
      } else if (startDateMonth%2 != 0) {
        if (32-startDateDay < 24) {
          monthLessThan.push([startDateMonth, startDateYear]);
        } // even month
      } else if (startDateMonth%2 == 0) {
        if (31-startDateDay < 24) {
          monthLessThan.push([startDateMonth, startDateYear]);
        }
      }
    }
    
    // endDate
    if (!!endDate) {
      // dd/mm/yyyy [0]/[1]/[2]
      var endDateDay = endDate.split('/')[0];
      var endDateMonth = endDate.split('/')[1];
      var endDateYear = endDate.split('/')[2];
    
      if (endDateDay < 24) { 
        monthLessThan.push([endDateMonth, endDateYear]);
      } 
    }
  
    if (((startDateMonth==endDateMonth)&&(startDateYear==endDateYear)) && ((!!startDate)&&(!!endDate))) {
      if (endDateDay-startDateDay+1 < 24) {
        monthLessThan.push([endDateMonth, endDateYear]);
      }
    }
    
    return monthLessThan;
  }
  
  function toNum(m) {
    switch (m) {
      case "jan": return "01";
      case "feb": return "02";
      case "mar": return "03";
      case "apr": return "04";
      case "may": return "05";
      case "jun": return "06";
      case "jul": return "07";
      case "aug": return "08";
      case "sep": return "09";
      case "oct": return "10";
      case "nov": return "11";
      case "dec": return "12";
      default: console.log("error at toNum()");
    }
  }
  
  function HighlightField(event) {
    // get allEmploymentinfo rows
    var aE = $('#WagesDetails6Months > .subFormContentRow');
    for (let i = 0; i < aE.length; i++) {
      const p = [];
      // get employmentinfo row
      var e = $(aE[i]);
      // get employmentStartDate
      var eSDt = $(e).find('[id^="EmploymentStartDateWI-"]').val();
      // get employmentEndDate
      var eEDt = $(e).find('[id^="EmploymentEndDateWI-"]').val();
      // get allWagesinfo rows
      var aW = $(e).find('[id^="WagesDetailWagesInfoSubForm"] > .subFormContentRow');
      // if employment start date or employment end date has values
      if (!!eSDt || !!eEDt) {
        // check if day is less than 24 days, if yes return month
        const p = hasLessThan(eSDt, eEDt);
        // check if there's month
        if (p !== undefined && p.length > 0) {
          // loop allWagesinfo rows
          for (let j = 0; j < aW.length; j++) {
            // get wageinfo row
            var w = $(aW[j]);
            // get wageMonth
            var wM = $(w).find('[id^="MonthWagesInfoSub1-"]');
            // get wageYear
            var wY = $(w).find('[id^="YearWagesInfoSub1-"]');
            // get wageMonth field value
            var wMV = $(wM).val().substr(0,3).toLowerCase();
            // get wageYear field value
            var wYV = $(wY).val();
            $(wY).addClass("Highlight");
            // check if there's values in month and year fields
            if (!!wMV && !!wYV) {
              // check if the values matches the target
              if (hasMatch(p, toNum(wMV), wYV)) {
                $(wM).addClass("Highlight");
              } else {
                $(wM).removeClass("Highlight");
                $(wY).removeClass("Highlight");
              }
            } else {
              $(wM).removeClass("Highlight");
              $(wY).removeClass("Highlight");
            }
          }
        } else if (p !== undefined && p.length == 0) {
          for (let j = 0; j < aW.length; j++) {
            var w = $(aW[j]);
            $(w).find('[id^="MonthWagesInfoSub1-"]').removeClass("Highlight");
            $(w).find('[id^="YearWagesInfoSub1-"]').removeClass("Highlight");
          }
        }
      } else {
        for (let j = 0; j < aW.length; j++) {
          var w = $(aW[j]);
          $(w).find('[id^="MonthWagesInfoSub1-"]').removeClass("Highlight");
          $(w).find('[id^="YearWagesInfoSub1-"]').removeClass("Highlight");
        }
      }
    }
  }