function addTriggerToCss() {
    $('.click-to-edit').parent().parent().click(function(event) {
        onSubformRowClick(event);
    });
}

function addTriggerToSection() {
    // console.log($('.formSectionProgressBarCell'));
    $('.formSectionProgressBarCell').click(function(event) {
        setTimeout(() => { addTriggerToCss() }, 100);
    });
}

function SetValue(){
    eFormHelper.getFieldValue({fieldId:'SubForm11'}, function (result)
    {
        if (Object.keys(result.error).length > 0) console.error(result);
        let datalength = result.data['SubForm11'].length;
        let options = {
            fieldId: 'SubForm11/StatusAppointment: [' + datalength + ']',
            value: 'Cancel'
        }
        var field = options.fieldId;
        console.log(field)
        eFormHelper.setFieldValue(options, function (result){
            console.log(result);
        });
    });
}

function DeleteButton(){
    var options = {};
    options.value = 'Are you sure?';
    eFormHelper.confirmMessage(options, function (result)
    {
        if (result.isSuccess)
        {
            console.log(result.data); //logs the data holds the return result true/false
            if (result.data == true ){
                SetValue();
            }
        }
        else
        {
            console.log(result.error); // logs the hold exception object
        }
    });
}

function SetRequiredDoc(){
    var options = {};
    options. fieldId = 'SupDoc';
    options.value = [{
        DocumentDescription:'Medical Report ',
        DocumentStatus:'Required'
    }];
    eFormHelper.addRowsToSubForm(options, function (result)
    {
        if (result.isSuccess)
        {
            console.log(result.data);
        }
        else
        {
            console.log(result.error);
        }
    });
}

function confirmation(sectionName) {
    var options = {};
    options.value = 'Are you sure to route the case?';
    eFormHelper.confirmMessage(options, function(result) {
        if (result.isSuccess) {
            if (result.data == true) {
                navigation(sectionName);
            }
        } else {
            console.log(result.error); // logs the hold exception object
        }
    });
}

function navigation(secName) {
    var options = {};
    options.sectionName = secName;
    eFormHelper.navigateToSection(options, function(result) {
        if (result.isSuccess) {
            console.log(result.data); //logs the data holds the empty object
        } else {
            console.log(result.error); // logs the hold exception object
        }
    });
}


function RecoControl()
{
    /**
     //check if dead
     var death_date = readField("DateofDeathIPI");
     if(death_date != "")
     {
     $('#ActionRecommend option').filter('[value="Refer to Special Medical Board"],[value="Wrong Notice Type"],[value="Case Transfer"]').remove();
     $('#ActionSCO option').filter('[value="Recommend"],[value="Investigation"],[value="Wrong Notice Type"],[value="Case Transfer"]').remove();
     }else
     {
     //check accepted inconsistency
     var total_no_accept = readField("AcceptValueTotalIDI");

     if(total_no_accept > 0)
     {
     console.log("checked: not accepted");
     $('#ActionRecommend option').filter('[value="Refer to Special Medical Board"]').remove();
     $('#ActionSCO option').filter('[value="Refer to Special Medical Board"]').remove();
     }
     else
     {
     var control = 0;
     console.log("checked: no inconsistent accepted");
     if($("#ActionRecommend option[value='Refer to Special Medical Board']").length == 0)
     {
     console.log("refer SMB not found");
     //incase after form load data not updated (temporary solution only)
     if(control == 0){
     $('#ActionRecommend option').filter('[value="Refer to Special Medical Board"]').remove();
     $('#ActionSCO option').filter('[value="Refer to Special Medical Board"]').remove();
     $('#ActionRecommend').append("<option>Refer to Special Medical Board</option>");
     $('#ActionSCO').append("<option>Recommend</option>");
     control++;
     }
     }
     }
     }
     */
}

function setFormView(view,Event)
{
    if(view == "Diagnosis")
    {
        $(Event.currentTarget).closest('.subFormContentRowChildWrapper').find('.editSubFormRow').click();
        ShowDiagnosis(true);
    }
    else if(view == "Description")
    {
        $(Event.currentTarget).closest('.subFormContentRowChildWrapper').find('.editSubFormRow').click();
        showDesc(true);
    }
    else
    {console.log("view not defined");}
}

function ShowDiagnosis(result)
{
    if(result == true)
    {
        changeFieldProperty("SMBInfoSubform/Dicipline_smbinfo",false);
        changeFieldProperty("SMBInfoSubform/DiagnosisrelatedtoOccupationalDisease_SMB_Info",false);
        changeFieldProperty("SMBInfoSubform/Diagnosis_SMB_Info",false);
        changeFieldProperty("SMBInfoSubform/DoesInsuredPersonHasOccupationalDisease_SMB_Info",false);
        changeFieldProperty("SMBInfoSubform/DescriptionofOccupationalDisease_SMB_Info",false);
        changeFieldProperty("SMBInfoSubform/Assess_percent_SMB_Info",false);
        changeFieldProperty("SMBInfoSubform/MBSessionDate_SMB_Info",false);

        changeFieldProperty("SMBInfoSubform/Heading171",false);
        changeFieldProperty("SMBInfoSubform/PhysicalInspection_SMB_Info",false);
        changeFieldProperty("SMBInfoSubform/Palpation_SMB_Info",false);
        changeFieldProperty("SMBInfoSubform/Percussion_SMB_Info",false);
        changeFieldProperty("SMBInfoSubform/Auscultation_SMB_Info",false);
        changeFieldProperty("SMBInfoSubform/MentalStatusduringSitting_SMB_Info",false);
    }else
    {
        changeFieldProperty("SMBInfoSubform/Dicipline_smbinfo",true);
        changeFieldProperty("SMBInfoSubform/DiagnosisrelatedtoOccupationalDisease_SMB_Info",true);
        changeFieldProperty("SMBInfoSubform/Diagnosis_SMB_Info",true);
        changeFieldProperty("SMBInfoSubform/DoesInsuredPersonHasOccupationalDisease_SMB_Info",true);
        changeFieldProperty("SMBInfoSubform/DescriptionofOccupationalDisease_SMB_Info",true);
        changeFieldProperty("SMBInfoSubform/Assess_percent_SMB_Info",true);
        changeFieldProperty("SMBInfoSubform/MBSessionDate_SMB_Info",true);
    }
}

function showDesc(result)
{
    if(result == true)
    {
        changeFieldProperty("SMBInfoSubform/Dicipline_smbinfo",false);
        changeFieldProperty("SMBInfoSubform/DiagnosisrelatedtoOccupationalDisease_SMB_Info",false);
        changeFieldProperty("SMBInfoSubform/Diagnosis_SMB_Info",false);
        changeFieldProperty("SMBInfoSubform/DoesInsuredPersonHasOccupationalDisease_SMB_Info",false);
        changeFieldProperty("SMBInfoSubform/DescriptionofOccupationalDisease_SMB_Info",false);
        changeFieldProperty("SMBInfoSubform/Assess_percent_SMB_Info",false);
        changeFieldProperty("SMBInfoSubform/MBSessionDate_SMB_Info",false);

        changeFieldProperty("SMBInfoSubform/Heading182",false);
        changeFieldProperty("SMBInfoSubform/Diagnosis_Description_SMB_Info",false);
    }else
    {
        changeFieldProperty("SMBInfoSubform/Dicipline_smbinfo",true);
        changeFieldProperty("SMBInfoSubform/DiagnosisrelatedtoOccupationalDisease_SMB_Info",true);
        changeFieldProperty("SMBInfoSubform/Diagnosis_SMB_Info",true);
        changeFieldProperty("SMBInfoSubform/DoesInsuredPersonHasOccupationalDisease_SMB_Info",true);
        changeFieldProperty("SMBInfoSubform/DescriptionofOccupationalDisease_SMB_Info",true);
        changeFieldProperty("SMBInfoSubform/Assess_percent_SMB_Info",true);
        changeFieldProperty("SMBInfoSubform/MBSessionDate_SMB_Info",true);
    }
}

function returnNormal()
{
    changeFieldProperty("SMBInfoSubform/Dicipline_smbinfo",true);
    changeFieldProperty("SMBInfoSubform/DiagnosisrelatedtoOccupationalDisease_SMB_Info",true);
    changeFieldProperty("SMBInfoSubform/Diagnosis_SMB_Info",true);
    changeFieldProperty("SMBInfoSubform/DoesInsuredPersonHasOccupationalDisease_SMB_Info",true);
    changeFieldProperty("SMBInfoSubform/DescriptionofOccupationalDisease_SMB_Info",true);
    changeFieldProperty("SMBInfoSubform/Assess_percent_SMB_Info",true);
    changeFieldProperty("SMBInfoSubform/MBSessionDate_SMB_Info",true);

    changeFieldProperty("SMBInfoSubform/Heading182",true);
    changeFieldProperty("SMBInfoSubform/Diagnosis_Description_SMB_Info",true);

    changeFieldProperty("SMBInfoSubform/Heading171",true);
    changeFieldProperty("SMBInfoSubform/PhysicalInspection_SMB_Info",true);
    changeFieldProperty("SMBInfoSubform/Palpation_SMB_Info",true);
    changeFieldProperty("SMBInfoSubform/Percussion_SMB_Info",true);
    changeFieldProperty("SMBInfoSubform/Auscultation_SMB_Info",true);
    changeFieldProperty("SMBInfoSubform/MentalStatusduringSitting_SMB_Info",true);

}


$(document).on('click', '.btnSummaryColumnsOK', function() {
    returnNormal();
});

$(document).on('click', '.btnSummaryColumnsCancel', function() {
    returnNormal();
});

function translateSI()
{
    var origin = readField("TranslateSIResult");

    origin = origin.toLowerCase();
    if(origin == "none" || origin == "not eligible")
    {
        setField('SIEligibilityCICI',"Not Eligible");
    }else if (origin == "" || origin == undefined){}
    else
    {
        setField('SIEligibilityCICI','Eligible');
    }

}

window.addEventListener("focus", function () {
    refreshContentLink(); // Supporting Documents refresh
    refreshQueryList(); // Query Documents Status refresh
    //refreshMedicalBoard(); //refresh Medical Board
    refreshOpinions(); //refresh Opinion
    refreshAppointment();//refresh Appointment
    // setCaseType("REJ");
    refreshList();
    saveStatus();
});
