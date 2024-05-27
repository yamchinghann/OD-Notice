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
    //check if dead
    var death_date = readField("DateofDeathIPI");
    if(death_date != "")
    {
        $('#ActionApprove option').filter('[value="Refer to Special Medical Board"],[value="Investigation"],[value="Transit Medical Board"],[value="Case Transfer"]').remove();
    }else
    {
        //check accepted inconsistency
        var total_no_accept = readField("AcceptValueTotalIDI");

        if(total_no_accept > 0)
        {
            console.log("checked: not accepted");
            $('#ActionApprove option').filter('[value="Refer to Special Medical Board"]').remove();
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
                    $('#ActionApprove option').filter('[value="Refer to Special Medical Board"]').remove();
                    $('#ActionApprove').append("<option>Refer to Special Medical Board</option>");
                    control++;
                }
            }
        }
    }

}

window.addEventListener("focus", function () {
    refreshContentLink(); // Supporting Documents refresh
    refreshQueryList(); // Query Documents Status refresh
    //refreshMedicalBoard(); //refresh Medical Board
    refreshOpinions(); //refresh Opinion
    refreshAppointment();//refresh Appointment
    // setCaseType("REJ")
});

