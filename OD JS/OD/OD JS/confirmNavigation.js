function confirmNavigation() {
    var options = {};
    options.value = 'Are you sure to route this case?';
    eFormHelper.confirmMessage(options, function(result) {
            if (result.isSuccess) {
                if (result.data == true) {
                    eFormEvents.onSectionNavigation = function (eventArgs) {
                        switch (eventArgs.currentSection) {
                            case "Remarks":
                                navigateTo("Case Information");
                                break;
                        }
                    }
                }
            } else {
                console.log(result.error);
            }
        });
    }
}

function navigateTo(secName) {
    eFormHelper.navigateToSection(secName, function(result) {
        if (result.isSuccess) {
            console.log(result.data); //logs the data holds the empty object
        } else {
            console.log(result.error); // logs the hold exception object 
        }
    });
}