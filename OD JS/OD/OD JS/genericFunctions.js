/*
 * JQuery WYSIWYG Web Form Designer
 * Copyright 2015 AgilePoint Inc
 */

/* Add your JS code Here (Press Ctrl+Space keys for intellisense) */

// Agilepoint Doc
// https://documentation.agilepoint.com/00/appbuilder/cloudjsMethodsIntro.html

// Get Field value
function getFormFieldValue(field) {
    let res;
    eFormHelper.getFieldValue({fieldId: field}, function (result) {
        if (result.isSuccess) {
            res = result.data;
        } else {
            console.log(result.error);
        }
    });
    return res;
}

// Get System Value
function getSystemValue(fieldArr) {
    //fieldArr can be array or string
    let res;
    eFormHelper.getSystemData({tokenNames: fieldArr}, function (result) {
        if (result.isSuccess) {
            res = result.data;
        } else {
            console.log(result.error);
        }
    });
    return res;
}

// Get User Info
function getUserInfo() {
    let userInfo;
    eFormHelper.getLoggedInUserDetails({}, function (result) {
        if (result.isSuccess) {
            userInfo = result.data;
        } else {
            console.log(result.error);
        }
    });
    return userInfo;
}

// Get Uploaded Files from File Upload Form
function getUploadedFiles(field) {
    let data;
    eFormHelper.getUploadedFiles({fieldId: field}, function (res) {
        if (res.isSuccess) {
            data = res.data[field];
        } else {
            console.log(result.error);
        }
    });
    return data;
}

function getField(fieldId) {
    eFormHelper.getField({fieldId: fieldId}, function (result) {
        if (result.isSuccess) //check if is success
        {
            console.log(result.data); //logs the HTML element data holds the found form control
        } else {
            console.log(result.error); //logs the error
        }
    });
}

// Set Field value
function setFormFieldValue(field, value) {
    eFormHelper.setFieldValue({fieldId: field, value: value}, function (result) {
        if (!result.isSuccess) {
            console.log(result.error);
        }
    });
}

// Set Field to be Mandatory
function setFormMandatory(field, state) {
    eFormHelper.updateFieldProperty(
        {
            fieldId: field,
            propertyName: eFormHelper.constants.fieldProperty.Mandatory,
            value: state,
        },
        function (result) {
            if (!result.isSuccess) {
                console.log(result.error);
            }
        }
    );
}

// Update form field properties
function updateProps(field, settings, value) {
    // Fixed property names from agilepoint
    let props = ["Mandatory", "Visible", "Enabled"];
    try {
        if (props.includes(settings)) {
            if (typeof value === "boolean") {
                eFormHelper.updateFieldProperty({
                    fieldId: field,
                    propertyName: eFormHelper.constants.fieldProperty[settings],
                    value: value,
                });
            } else {
                throw new Error("Only accept booleans");
            }
        } else {
            throw new Error('Invalid settings, only "Mandatory", "Visible", or "Enabled" only');
        }
    } catch (e) {
        console.log(e);
    }
}

//disable field
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

// Get all datas in subform
function getSubFormData(fieldName) {
    let data;
    eFormHelper.getSubFormData({fieldId: fieldName, rowIndex: "*"}, function (res) {
        if (res.isSuccess) {
            data = res.data;
        }
    });
    return data;
}

// Get all files in file upload form
function getUploadedFiles(fieldName) {
    try {
        let files;
        eFormHelper.getUploadedFiles({fieldId: fieldName}, function (res) {
            if (res.isSuccess) {
                files = res.data;
            } else {
                throw new Error(res);
            }
        });
        return files;
    } catch (e) {
        console.log(e);
    }
}

// Trigger auto lookup
function triggerAutoLookup(fieldName, lookupName) {
    // To disable cache for lookup; impacts performance
    // https://www.agilepointnxblog.com/disable-caching-of-lookup-within-a-form-session/
    if (lookupName) {
        eFormCustomSettings.currentForm.lookupCaching.excludeItems.push({
            fieldId: fieldName,
            lookupName: lookupName,
        });
    }
    eFormHelper.triggerAutoLookup({fieldId: fieldName});
}

// Trigger Control Rule in field
function triggerControlRule(field) {
    try {
        eFormHelper.triggerControlRule({fieldId: field});
    } catch (e) {
        console.error(e);
    }
}

// Trigger Control Validation
function triggerControlValidation(field) {
    try {
        eFormHelper.triggerControlValidation({fieldId: field});
    } catch (e) {
        console.log(e);
    }
}

// Trigger Formula
function triggerFormula(field) {
    try {
        eFormHelper.triggerFormula({fieldId: field});
    } catch (e) {
        console.log(e);
    }
}


// Popup dialog message
function showDialogMessage(msg, type) {
    try {
        const msgTypes = ["Warning", "Error", "Info"];
        if (msgTypes.includes(type)) {
            eFormHelper.showDialogMessage({
                value: msg,
                messageType: eFormHelper.constants.messagetype[type],
            });
        } else {
            throw Error('Invalid message type, only "Confirmation", "Warning", "Error", or "Info" only');
        }
    } catch (e) {
        console.log(e);
    }
    return;
}

function confirmDialog(msg, type) {
    return new Promise((accept, reject) => {
        try {
            const msgTypes = ["Warning", "Error", "Info"];
            if (msgTypes.includes(type)) {
                eFormHelper.showDialogMessage(
                    {
                        value: msg,
                        messageType: eFormHelper.constants.messagetype[type],
                    },
                    function (result) {
                        if (result.isSuccess) {
                            accept(result.data);
                        } else {
                            reject(false);
                        }
                    }
                );
            } else {
                throw Error('Invalid message type, only "Confirmation", "Warning", "Error", or "Info" only');
            }
        } catch (e) {
            console.log(e);
            reject(false);
        }
    });
}

// Popup confirmation dialog
// Needs to be in async to allow functions to be in waiting state and prompt user action
function confirmMessage(confirmationMessage) {
    return new Promise((accept, reject) => {
        let options = {};
        options.value = confirmationMessage;
        eFormHelper.confirmMessage(options, function (result) {
            if (result.isSuccess) {
                accept(result.data);
            } else {
                reject(false);
            }
        });
    });
}

// manual loading with message
function showManualLoader(show, msg) {
    if (show) {
        let loader = $("#customLoader");
        if (loader.length <= 0) {
            let loader = $(
                '<div id="customLoader" class="loader" style="background: rgba(0, 0, 0, 0.25);"><div class="loaderMessageWrapper"><div id="msg" style="height: 30px; background: white; margin: auto; width: 450px; text-align: center; line-height: 30px; color: #63666A;"></div><div></div>'
            );
            $(".eFormSurface").append(loader);
        }
        loader.show();
        loader.find("#msg").html(msg);
    } else {
        let loader = $("#customLoader");
        loader.length > 0 && loader.hide();
    }
}

// Initialize loading state
function showLoading(state) {
    try {
        eFormHelper.showLoader({value: state}, function (res) {
            if (res.isSuccess) {
                return;
            } else {
                return new Error("Failed to initialize loading state");
            }
        });
    } catch (e) {
        console.log(e);
    }
}

// Add rows to SubForm
function addRowsToSubForm(field, arrObj) {
    // values are arrays of objects with internal name as properties
    try {
        eFormHelper.addRowsToSubForm({fieldId: field, value: arrObj}, function (res) {
            if (res.isSuccess) {
                return;
            } else {
                return new Error("Failed to add row");
            }
        });
    } catch (e) {
        console.log(e);
    }
}

// delete rows at SubForm
function deleteRowsToSubform(field, index) {
    // index can be "*" for all rows, or "1,2,3"
    try {
        eFormHelper.deleteRowsFromSubForm({fieldId: field, rowIndex: index}, function (res) {
            if (res.isSuccess) {
                return;
            } else {
                return new Error("Failed to delete " + field);
            }
        });
    } catch (e) {
        console.log(e);
    }
}

// Import libraries via jsDelivr/unpkg CDN
// https://helpdesk.agilepoint.com/hc/en-us/community/posts/7857312328851-Possible-to-use-npm-libraries-in-eForms-
function importLib(url) {
    let scriptEle = document.createElement("script");
    scriptEle.setAttribute("src", url);
    document.body.appendChild(scriptEle);
}

function isFormValid() {
    let res;
    eFormHelper.validateForm(function (result) {
        res = result.data.isValid ? true : false;
    });
    return res;
}

function navigateTo(secName) {
    options.sectionName = secName;
    eFormHelper.navigateToSection(options, function(result) {
        if (result.isSuccess) {
            console.log(result.data); //logs the data holds the empty object
        } else {
            console.log(result.error); // logs the hold exception object
        }
    });
}

async function apiCall(method, url, payload) {
    console.log(method, url);
    console.log(payload);
    // current plan is not handling any status code and proceed
    return new Promise((accept, reject) => {
        try {
            $.ajax({
                url: url,
                type: method,
                data: JSON.stringify(payload),
                contentType: "application/json",
                success: function (res) {
                    console.log("apiCall Success", res);
                    accept(res);
                },
                error: function (request, status, error) {
                    console.log(status, error, request.responseJSON);
                    reject(false);
                },
            });
        } catch (e) {
            console.log(e);
            reject(false);
        }
    });
}

async function sendApiCall(url, method, payload) {
    return new Promise(function (resolve, reject) {
        try {
            let ajaxOptions = {
                url: url,
                method: method,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: (result) => {
                    resolve(result);
                },
                error: (result) => {
                    reject(result);
                }
            }

            if (method.toLowerCase() == "post") {
                ajaxOptions.data = JSON.stringify(payload);
            }

            $.ajax(ajaxOptions);
        }
        catch (err) {
            console.error("Ajax Call Error : " + err);
            reject(err);
        }
    });
}
