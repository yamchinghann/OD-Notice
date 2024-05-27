/*function hasMatch (pool, month, year) {
  var r = false;
  for (let i = 0; i < pool.length; i++) {
    if (pool[0][i]==month && pool[1][i]==year) { r = true; }
  }
  return r;
}

function hasLessThan (startDate, endDate) {
  const monthLessThan = [];
  const yearLessThan = [];
  
  // dd/mm/yyyy [0]/[1]/[2]
  var startDateDay = startDate.split('/')[0];
  var startDateMonth = startDate.split('/')[1];
  var startDateYear = startDate.split('/')[2];
  var endDateDay = endDate.split('/')[0];
  var endDateMonth = endDate.split('/')[1];
  var endDateYear = endDate.split('/')[2];
  
  // endDate
  if (endDateDay < 24) { 
    monthLessThan.push(endDateMonth); 
    yearLessThan.push(endDateYear); 
  }
  
  // startDate
  if (startDateMonth == 02 && startDateYear != 0) {
    // feb regular
    if (29-startDateDay < 24) {
      monthLessThan.push(startDateMonth);
      yearLessThan.push(startDateYear);
    } // feb leap
  } else if (startDateMonth == 02 && startDateYear == 0) {
    if (30-startDateDay < 24) {
      monthLessThan.push(startDateMonth);
      yearLessThan.push(startDateYear);
    } // odd month
  } else if (startDateMonth%2 != 0) {
    if (32-startDateDay < 24) {
      monthLessThan.push(startDateMonth);
      yearLessThan.push(startDateYear);
    } // even month
  } else if (startDateMonth%2 == 0) {
    if (31-startDateDay < 24) {
      monthLessThan.push(startDateMonth);
      yearLessThan.push(startDateYear);
    }
  } else {
    console.log("error at hasLessThan()");
  }
  
  return [monthLessThan, yearLessThan];
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

function Highlight(event) {
  // get allEmploymentinfo rows
  var aE = $('#WagesInformationSubform > .subFormContentRow');
  for (let i = 0; i < aE.length; i++) {
    // get employmentinfo row
    var e = $(aE[i]);
    // get employmentStartDate
    var eSDt = $(e).find('[id^="EmployeymentStartDateWagesInfo-"]').val();
    // get employmentEndDate
    var eEDt = $(e).find('[id^="EmployeymentEndDateWagesInfo-"]').val();
    // get allWagesinfo rows
    var aW = $(e).find('[id^="WagesDetailWagesInfo"] > .subFormContentRow');
    // check if day is less than 24 days
    var p = hasLessThan(eSDt, eEDt);
    console.log(p);
    // if array p has item
    if (p !== undefined && p.length > 0) {
      // loop allWagesinfo rows
      for (let j = 0; j < aW.length; j++) {
        // get wageinfo row
        var w = $(aW[j]);
        // get wageMonth field value
        var wM = $(w).find('[id^="MonthWagesInfo-"]').val().substr(0,3).toLowerCase();
        console.log("wM: "+wM);
        console.log("toNum(wM)"+toNum(wM));
        // get wageYear field value
        var wY = $(w).find('[id^="YearWagesInfo-"]').val();
        if (hasMatch(p, toNum(wM), wY)) {
          $(w).addClass("Highlight");
        } else {
          $(w).removeClass("Highlight");
        }
      }
    } else if (p !== undefined && p.length == 0) {
      console.log("removeClass() here");
    }
  }
}*/