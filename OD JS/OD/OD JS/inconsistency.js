function added() {
    var sectionField = testAccept('InconsistentDoubtfulInformationDetailsIDI/SectionIDIDetailsIDI')
    var descriptionField = testAccept('InconsistentDoubtfulInformationDetailsIDI/DescriptionIDIDetailsIDI')
    var addedDateTimeField = testAccept('InconsistentDoubtfulInformationDetailsIDI/AddedDateTimeIDIDetailsIDI')
    var addedByField = testAccept('InconsistentDoubtfulInformationDetailsIDI/AddedByIDIDetailsIDI')
    var i = 0;
    for (i; i <= sectionField.length; i++) {
        if ((sectionField[i] != 'Please Select' || descriptionField[i] != "") && addedByField[i] == "") {
            var acceptRow = i + 1;
            console.log('section' + '  ' + sectionField[i])
            console.log('desc' + '  ' + descriptionField[i])
            console.log('addedby' + '  ' + addedByField[i])
            console.log(acceptRow)
            getUserDetail('InconsistentDoubtfulInformationDetailsIDI/AddedByIDIDetailsIDI:[' + acceptRow + ']')
            inconSetField('InconsistentDoubtfulInformationDetailsIDI/AddedDateTimeIDIDetailsIDI:[' + acceptRow + ']', new Date())
        }
    }
}

function AppointmentButton(Event) {
    onSubformRowClick(Event);
    showInconField()
    changeFieldProperty('InconsistentDoubtfulInformationDetailsIDI/AddedByIDIDetailsIDI', false)
    changeFieldProperty('InconsistentDoubtfulInformationDetailsIDI/AddedDateTimeIDIDetailsIDI', false)
    changeFieldProperty('InconsistentDoubtfulInformationDetailsIDI/AcceptedByIDIDetailsIDI', false)
    changeFieldProperty('InconsistentDoubtfulInformationDetailsIDI/AcceptedDateTimeIDIDetailsIDI', false)
    changeFieldProperty('InconsistentDoubtfulInformationDetailsIDI/EditIDIDetailsIDI', false)
    disableField('InconsistentDoubtfulInformationDetailsIDI/SectionIDIDetailsIDI', false)
    disableField('InconsistentDoubtfulInformationDetailsIDI/DescriptionIDIDetailsIDI', false)
}

function inconSetField(field, value) {
    var options = {}
    options.fieldId = field
    options.value = value
    eFormHelper.setFieldValue(options, function (result) {
        if (result.isSuccess) {
            console.log(result.data)
        } else {
            console.log('no')
        }
    })
}

function addIncon() {
    $('.addSubFormRow').click()
    hideInconField();
}

function okIncon() {
    $('.btnSummaryColumnsOK').click();
    showInconField();
}

function showInconField() {
    changeFieldProperty('InconsistentDoubtfulInformationDetailsIDI/AddedByIDIDetailsIDI', true)
    changeFieldProperty('InconsistentDoubtfulInformationDetailsIDI/AddedDateTimeIDIDetailsIDI', true)
    changeFieldProperty('InconsistentDoubtfulInformationDetailsIDI/AcceptedByIDIDetailsIDI', true)
    changeFieldProperty('InconsistentDoubtfulInformationDetailsIDI/AcceptedDateTimeIDIDetailsIDI', true)
    changeFieldProperty('InconsistentDoubtfulInformationDetailsIDI/EditIDIDetailsIDI', true)
    changeFieldProperty('InconsistentDoubtfulInformationDetailsIDI/JustificationIDIDetailsIDI', true)
    changeFieldProperty('InconsistentDoubtfulInformationDetailsIDI/AcceptIDIDetailsIDI', true)
}

function hideInconField() {
    changeFieldProperty('InconsistentDoubtfulInformationDetailsIDI/JustificationIDIDetailsIDI', false)
    changeFieldProperty('InconsistentDoubtfulInformationDetailsIDI/AcceptIDIDetailsIDI', false)
    changeFieldProperty('InconsistentDoubtfulInformationDetailsIDI/AddedByIDIDetailsIDI', false)
    changeFieldProperty('InconsistentDoubtfulInformationDetailsIDI/AddedDateTimeIDIDetailsIDI', false)
    changeFieldProperty('InconsistentDoubtfulInformationDetailsIDI/AcceptedByIDIDetailsIDI', false)
    changeFieldProperty('InconsistentDoubtfulInformationDetailsIDI/AcceptIDIDetailsIDI', false)
    changeFieldProperty('InconsistentDoubtfulInformationDetailsIDI/EditIDIDetailsIDI', false)
    changeFieldProperty('InconsistentDoubtfulInformationDetailsIDI/AcceptedDateTimeIDIDetailsIDI', false)
}

function changeFieldProperty(fieldName, bool) {
    var options = {};
    options.fieldId = fieldName;
    options.propertyName = eFormHelper.constants.fieldProperty.Visible
    options.value = bool;
    eFormHelper.updateFieldProperty(options, function (result) {
        if (result.isSuccess) {
            console.log(result.data); //logs the data holds the empty object
        } else {
            console.log(result.error); // logs the hold exception object
        }
    });
}

function disableField(field, setting) {
    var options = {};
    options.fieldId = field;
    options.propertyName = eFormHelper.constants.fieldProperty.Enabled
    options.value = setting;
    eFormHelper.updateFieldProperty(options, function (result) {
        if (result.isSuccess) {
            console.log(result.data); //logs the data holds the empty object
        } else {
            console.log(result.error); // logs the hold exception object
        }
    });
}

function cancelIncon() {
    $('.btnSummaryColumnsCancel').click();
    showInconField();
}

function testAccept(fieldName) {
    var options = {}
    var holder = {}
    options.fieldId = fieldName

    eFormHelper.getFieldValue(options, function (res) {
        if (res.isSuccess) {
            console.log('bruh')
            holder.result = res.data.split(",")
            //console.log(holder.result)
        } else {
            console.log('nay')
        }
    })
    return holder.result
}

function tick() {
    var resCheckbox = testAccept('InconsistentDoubtfulInformationDetailsIDI/AcceptIDIDetailsIDI')
    var resDate = testAccept('InconsistentDoubtfulInformationDetailsIDI/AcceptedDateTimeIDIDetailsIDI')
    var date = new Date()
    var acceptedBy = testAccept('InconsistentDoubtfulInformationDetailsIDI/AcceptedByIDIDetailsIDI')
    console.log(date)
    console.log(resCheckbox)
    console.log("Accepted by: ", acceptedBy)
    var i = 0;
    for (i; i <= resCheckbox.length; i++) {
        if (resCheckbox[i] == 'True') {
            var acceptRow = i + 1;
            console.log(i)
            console.log(acceptRow)
            if (resDate[i] == '') {
                getUserDetail('InconsistentDoubtfulInformationDetailsIDI/AcceptedByIDIDetailsIDI:[' + acceptRow + ']')
                inconSetField('InconsistentDoubtfulInformationDetailsIDI/AcceptedDateTimeIDIDetailsIDI:[' + acceptRow + ']', date)
            }
        } else if (resCheckbox[i] != 'True') {
            var unaccept = i + 1
            inconSetField('InconsistentDoubtfulInformationDetailsIDI/AcceptedDateTimeIDIDetailsIDI:[' + unaccept + ']', '')
            inconSetField('InconsistentDoubtfulInformationDetailsIDI/AcceptedByIDIDetailsIDI:[' + unaccept + ']', '')
        }
    }
}


/*
function HideRows(){
  $("[id^='subCtrlPreviewRow3']").addClass("noButtons");
  $("[id^='subCtrlPreviewRow4']").addClass("noButtons");
  $("[id^='subCtrlPreviewRow5']").addClass("noButtons");
  $("[id^='subCtrlPreviewRow6']").addClass("noButtons");
  $("[id^='subCtrlPreviewRow7']").addClass("noButtons");
}

function ShowRows(){
  $("[id^='subCtrlPreviewRow4']").removeClass("noButtons");
  $("[id^='subCtrlPreviewRow5']").removeClass("noButtons");
}

function boxSize () {
    // $('[id^=subCtrlPreviewRow1]').css('height','34px');
    $('.btnSummaryColumnsOK').click(colorChange);
}
*/

function colorChange() {
    $('.section').addClass('colorColor');
    $('.description').addClass('colorColor');
}

  