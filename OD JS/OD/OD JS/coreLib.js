/* Agilepoint Doc
 General Functions: https://documentation.agilepoint.com/00/appbuilder/cloudjsMethodsIntro.html
 POST/GET: https://documentation.agilepoint.com/8011/developer/cloudjsCallAgilePointAPIs.html#cloudjsPost
 REST API Methods: https://documentation.agilepoint.com/8011/developer/restapiMethodsIntro.html
*/

// Get Field from DOM Element
function getField(field) {
    let res;
    eFormHelper.getField({ fieldId: field }, function (result) {
        if (result.isSuccess) {
            res = result.data;
        } else {
            console.log(result.error);
        }
    });
    return res;
}
// Get Field value
function getFormFieldValue(field) {
    let res;
    eFormHelper.getFieldValue({ fieldId: field }, function (result) {
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
    eFormHelper.getSystemData({ tokenNames: fieldArr }, function (result) {
        if (result.isSuccess) {
            res = result.data;
        } else {
            console.log(res.error);
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
    eFormHelper.getUploadedFiles({ fieldId: field }, function (res) {
        if (res.isSuccess) {
            data = res.data[field];
        } else {
            console.log(result.error);
        }
    });
    return data;
}

// Set Field value
function setFormFieldValue(field, value) {
    eFormHelper.setFieldValue(
        { fieldId: field, value: value },
        function (result) {
            if (!result.isSuccess) {
                console.log(field, value);
                console.log(result.error);
            }
        }
    );
}

// Update form field properties
// legacy
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
            throw new Error(
                'Invalid settings, only "Mandatory", "Visible", or "Enabled" only'
            );
        }
    } catch (e) {
        console.log(e);
    }
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

// Set Field to be Visible
function setFormVisible(field, state) {
    eFormHelper.updateFieldProperty(
        {
            fieldId: field,
            propertyName: eFormHelper.constants.fieldProperty.Visible,
            value: state,
        },
        function (result) {
            if (!result.isSuccess) {
                console.log(result.error);
            }
        }
    );
}

// Set Field to be Enabled
function setFormEnabled(field, state) {
    eFormHelper.updateFieldProperty(
        {
            fieldId: field,
            propertyName: eFormHelper.constants.fieldProperty.Enabled,
            value: state,
        },
        function (result) {
            if (!result.isSuccess) {
                console.log(result.error);
            }
        }
    );
}

// Get all datas in subform
function getSubFormData(fieldName) {
    let data;
    eFormHelper.getSubFormData(
        { fieldId: fieldName, rowIndex: "*" },
        function (res) {
            if (res.isSuccess) {
                data = res.data;
            }
        }
    );
    return data;
}

// Get all files in file upload form
function getUploadedFiles(fieldName) {
    try {
        let files;
        eFormHelper.getUploadedFiles({ fieldId: fieldName }, function (res) {
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
    console.log("triggering: " + fieldName);
    if (lookupName) {
        eFormCustomSettings.currentForm.lookupCaching.excludeItems.push({
            fieldId: fieldName,
            lookupName: lookupName,
        });
    }
    eFormHelper.triggerAutoLookup({ fieldId: fieldName });
}

// Trigger Control Rule in field
function triggerControlRule(field) {
    try {
        eFormHelper.triggerControlRule({ fieldId: field });
    } catch (e) {
        console.error(e);
    }
}

// Trigger Control Validation
function triggerControlValidation(field) {
    try {
        eFormHelper.triggerControlValidation({ fieldId: field });
    } catch (e) {
        console.log(e);
    }
}

// Trigger Formula
function triggerFormula(field) {
    try {
        eFormHelper.triggerFormula({ fieldId: field });
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
            throw Error(
                'Invalid message type, only "Confirmation", "Warning", "Error", or "Info" only'
            );
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
                throw Error(
                    'Invalid message type, only "Confirmation", "Warning", "Error", or "Info" only'
                );
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
        eFormHelper.showLoader({ value: state }, function (res) {
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
        eFormHelper.addRowsToSubForm(
            { fieldId: field, value: arrObj },
            function (res) {
                if (res.isSuccess) {
                    return;
                } else {
                    return new Error("Failed to add row");
                }
            }
        );
    } catch (e) {
        console.log(e);
    }
}

// delete rows at SubForm
function deleteRowsToSubform(field, index) {
    // index can be "*" for all rows, or "1,2,3"
    if (typeof index !== "string") {
        index = index.toString();
    }
    try {
        eFormHelper.deleteRowsFromSubForm(
            { fieldId: field, rowIndex: index },
            function (res) {
                if (res.isSuccess) {
                    return;
                } else {
                    return new Error("Failed to delete " + field);
                }
            }
        );
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
    // timer to ensure library import is loaded
    setTimeout(function () {
        return;
    }, 1000);
}

function importLibs(urlArr) {
    for (let i = 0; i < urlArr.length; i++) {
        let scriptEle = document.createElement("script");
        scriptEle.setAttribute("src", urlArr[i]);
        document.body.appendChild(scriptEle);
    }
    // timer to ensure library import is loaded
    setTimeout(function () {
        return;
    }, 1000);
}

// Execute validation on a section
function validateSection(name) {
    eFormHelper.validateSection({ sectionName: name }, function (res) {
        if (!res.isSuccess) {
            console.log(res.error);
        }
    });
}

// API Datatype conversion
class apiDataType {
    constructor(val) {
        this.val = val;
    }

    get() {
        return this.val;
    }
    toHandleDefaultString() {
        try {
            if (
                this.val.toLowerCase() === "false" ||
                this.val.toLowerCase() === "no" ||
                this.val.toLowerCase() === "please select" ||
                this.val.toLowerCase() === "-1" ||
                !this.val
            ) {
                return "No";
            } else {
                return this.val;
            }
        } catch (e) {
            console.log(this.val);
            console.log(e);
            return this.val;
        }
    }
    toBoolean() {
        try {
            if (
                this.val.toLowerCase() === "true" ||
                this.val.toLowerCase() === "yes"
            ) {
                return true;
            } else if (
                this.val.toLowerCase() === "false" ||
                this.val.toLowerCase() === "no" ||
                this.val.toLowerCase() === "please select" ||
                this.val.toLowerCase() === "-1" ||
                !this.val
            ) {
                return false;
            } else {
                throw new Error("Invalid string value, must be 'true' or 'false'");
            }
        } catch (e) {
            console.log(this.val);
            console.log(e);
            return this.val;
        }
    }
    toInt() {
        try {
            if (parseInt(this.val)) {
                return parseInt(this.val).toString();
            } else {
                throw new Error("Invalid string value, must be integer value");
            }
        } catch (e) {
            console.log(this.val);
            console.log(e);
            return this.val;
        }
    }
    toDecimal() {
        try {
            if (parseFloat(this.val)) {
                // Simple decimal conversion, has inherent js roundover issue
                return parseFloat(this.val).toFixed(2).toString();
            } else if (this.val == "" || parseInt(this.val) == 0) {
                return "0";
            } else {
                throw new Error(
                    "Invalid string value, must be integer or decimal value"
                );
            }
        } catch (e) {
            console.log(this.val);
            console.log(e);
            return this.val;
        }
    }
    toMonth() {
        try {
            if (parseInt(this.val)) {
                if (this.val == 1) {
                    // ASSISTS's method of storing January
                    return "01";
                } else if (this.val >= 2 && this.val <= 12) {
                    return this.val;
                } else {
                    throw new Error("Invalid string value, must be between 1 and 12");
                }
            } else {
                throw new Error("Invalid string value, must be integer value");
            }
        } catch (e) {
            console.log(this.val);
            console.log(e);
            return this.val;
        }
    }
    toNA() {
        if (
            this.val.toLowerCase() === "false" ||
            this.val.toLowerCase() === "no" ||
            this.val.toLowerCase() === "please select" ||
            this.val.toLowerCase() === "-1" ||
            !this.val
        ) {
            return "NA";
        } else {
            return this.val;
        }
    }
}

// Execute validation on whole form
function validateForm() {
    let res;
    eFormHelper.validateForm(function (result) {
        res = result.data.isValid ? true : false;
    });
    return res;
}
