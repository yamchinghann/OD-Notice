/*
 * JQuery WYSIWYG Web Form Designer
 * Copyright 2015 AgilePoint Inc
 */

/* Add your JS code Here (Press Ctrl+Space keys for intellisense) */

function getValue(fieldName) {
  var options = {};
  var holder = {};
  options.fieldId = fieldName
  eFormHelper.getFieldValue(options, function(res) {
    if (res.isSuccess) {
      holder.value = res.data;
      console.log('yay')
    } else {
      console.log('getfail')
    }
  })
  return holder.value
}

function translate() {
  
  var raceName = getValue('RaceIPI');
  if(raceName == "Melayu")
  {setMonthNum('TranslatedRace', 'Malay')
  }
  else if (raceName == "Cina"){
    setMonthNum('TranslatedRace', 'Chinese')
  }
  else if (raceName == "India"){
    setMonthNum('TranslatedRace', 'Indian')
  }
  else if (raceName == "Bumiputera Sabah"){
    setMonthNum('TranslatedRace', 'Sabah Bumiputera')
  }
  else if (raceName == "Cina"){
    setMonthNum('TranslatedRace', 'Chinese')
  }
  else if (raceName == "Bumiputera Sarawak"){
    setMonthNum('TranslatedRace', 'Sarawak Bumiputera')
  }
  else
  {
  setMonthNum('TranslatedRace', 'Unknown')
  }
  }
