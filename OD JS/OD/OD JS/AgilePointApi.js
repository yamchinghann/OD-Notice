/*
 * JQuery WYSIWYG Web Form Designer
 * Copyright 2015 AgilePoint Inc
 */

/* Add your JS code Here (Press Ctrl+Space keys for intellisense) */

function getAuthDetails() {
    let authDetails;

    eFormHelper.getLoggedInUserDetails({}, (result) => {
        authDetails = result.data;
    });

    return authDetails;
}

function logInUser() {
    let userName = getAuthDetails().UserDetails.UserName;
    return userName;
}

function getRegisteredUserByName(name) {
    let options = {};
    // The value Admin/GetRegisterUsers shows 
    // the relative path of the Get Registered User by Name method.
    options.relativePath = "Admin/GetRegisterUser";
    // The API options required to retrieve the data from the specified path.
    // Example: headers, referrer, mode, cache, redirect.		
    options.apiOptions = {
        headers: { "Content-Type": "application/json;" }
    };

    options.data = {
        userName: name
    };

    return new Promise((resolve, reject) => {
        eFormHelper.agilePointAPI.post(options, function (result) {
            // Checks if the method is successful.
            if (result.isSuccess) {
                resolve(result.data);
            }
            else {
                reject(result.error);
            }
        });
    });
}

function getUuid() {
    let options = {};
    let outputResult;
    // The value Admin/GetRegisterUsers shows 
    // the relative path of the Get Registered User by Name method.
    options.relativePath = "Workflow/GetUUID";

    // The API options required to retrieve the data from the specified path.
    // Example: headers, referrer, mode, cache, redirect.		
    options.apiOptions = {
        headers: { "Content-Type": "application/json;" }
    };

    return new Promise((resolve, reject) => {
        eFormHelper.agilePointAPI.get(options, function (result) {
            // Checks if the method is successful.
            if (result.isSuccess) {
                // Logs the data retrieved from the Get API method.
                // console.log(result.data);
                resolve(result.data);
            }
            else {
                // Logs errors and error descriptions.
                // console.log(result.error);
                reject(result.error);
            }
        });
    });

}

function getReleasedProcessID(processName) {
    let options = {};
    let outputResult;
    // The value Admin/GetRegisterUsers shows 
    // the relative path of the Get Registered User by Name method.
    options.relativePath = "Workflow/GetReleasedPID/" + processName;

    // The API options required to retrieve the data from the specified path.
    // Example: headers, referrer, mode, cache, redirect.		
    options.apiOptions = {
        headers: { "Content-Type": "application/json;" }
    };

    return new Promise((resolve, reject) => {
        eFormHelper.agilePointAPI.get(options, function (result) {
            // Checks if the method is successful.
            if (result.isSuccess) {
                resolve(result.data);
            }
            else {
                reject(result.error);
            }
        });
    });
}

function getProcessInstance(processInstanceID) {
    var options = {};
    // The value Admin/GetRegisterUsers shows 
    // the relative path of the Get Registered User by Name method.
    options.relativePath = "Workflow/GetProcInst/" + processInstanceID;

    // The API options required to retrieve the data from the specified path.
    // Example: headers, referrer, mode, cache, redirect.		
    options.apiOptions = {
        headers: { "Content-Type": "application/json;" }
    };


    return new Promise(function (resolve, reject) {
        eFormHelper.agilePointAPI.get(options, function (result) {
            // Checks if the method is successful.
            if (result.isSuccess) {
                // Logs the data retrieved from the Get API method.
                // console.log(result.data);
                resolve(result.data);
            }
            else {
                // Logs errors and error descriptions.
                // console.log(result.error);
                reject(result.error);
            }
        });
    });
}

function createProcessInstance(initiator, processName, attributesArray) {

    return new Promise((resolve, reject) => {
        //get uuid
        getUuid()
            .then((result) => {
                let uuid = result.GetUUIDResult;

                //get released process pid with process name
                getReleasedProcessID(processName)
                    .then((result) => {
                        let releasedProcessId = result.GetReleasedPIDResult;

                        let options = {};
                        // The value Admin/GetRegisterUsers shows 
                        // the relative path of the Get Registered User by Name method.
                        options.relativePath = "Workflow/CreateProcInst";

                        // The API options required to retrieve the data from the specified path.
                        // Example: headers, referrer, mode, cache, redirect.		
                        options.apiOptions = {
                            headers: { "Content-Type": "application/json;" }
                        };

                        options.data = {
                            "Attributes": attributesArray,
                            "blnStartImmediately": true,
                            "CustomID": uuid,
                            "Initiator": initiator,
                            "ProcessID": releasedProcessId,
                            "ProcessInstID": uuid,
                            "ProcInstName": processName + " " + Date.now().toString(),
                            "SuperProcInstID": null,
                            "WorkObjID": uuid,
                            "WorkObjInfo": null
                        };


                        eFormHelper.agilePointAPI.post(options, function (result) {
                            // Checks if the method is successful.
                            if (result.isSuccess) {
                                // Logs the data retrieved from the Get API method.
                                console.log(result.data);
                                resolve(result);
                            }
                            else {
                                // Logs errors and error descriptions.
                                console.log(result.error);
                                reject(result);
                            }
                        });
                    })
                    .catch((error) => {
                        console.error("getReleasedProcessID() Error : "+error);
                        reject(error);
                    });
            }).catch((error) => {
                console.error("getUuid() Error : "+error);
                reject(error);
            });
    });

}
