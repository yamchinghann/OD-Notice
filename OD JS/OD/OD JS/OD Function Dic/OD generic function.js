function validatePostcode(value) {
    const isFiveDigits = /^\d{5}$/.test(value);
    if (isFiveDigits === false) {
        showDialogMessage("Postcode only accept 5 digits", "Warning");
    }
}

function getAllPostCode() {
    let postCodeArray = ["PostcodeInsuredPersonInfo", "EmployerInfoSubformEI/PostcodeEI:[*]", "EISubform_inEmp/Postcode_inEmp:[*]",
        "SubForm6/ODInfoPostcode:[*]", "PostcodePermanentRep"];
    let resultOfArrayPostcode = [];
    /*for (let postCode of postCodeArray){
        let value = getFormFieldValue(postCode);
        console.log(parseInt(value));
    }*/
    postCodeArray.forEach((value) => {
        resultOfArrayPostcode.push(parseInt(getFormFieldValue(value)));
    });
    //console.log("All Postcode data:" + resultOfArrayPostcode);
    resultOfArrayPostcode.every((x) => {
        console.log("Type of: " + typeof x);
        validatePostcode(x);
    })
}

function checkSchemeRefNo(schemeRef1, schemeRef2) {
    if (!schemeRef1) {
        return schemeRef2;
    } else {
        return schemeRef1;
    }
}

function getTempSchemeRefNo() {
    let tempNo = getFormFieldValue("SchemeRefNoCaseInfo");
    setFormFieldValue("TempSchemeRefNo", tempNo);
}

function getFullEmployerInfo() {
    let NoticeDate = getFormFieldValue("FinalNoticeDate")
    let IC = getFormFieldValue("QueryIC")
    let EmployeeID = getFormFieldValue("QueryEmployeeID")
    let EmployerCode = getFormFieldValue("QueryEmployerCode")
    console.log("NoticeDate: " + NoticeDate, "IC: " + IC, "EmployerID: " + EmployeeID, "EmployerCode: " + EmployerCode);
}

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

function ObjValueToString(o) {
    Object.keys(o).forEach(k => {
        if (typeof o[k] === 'object') {
            return toString(o[k]);
        }
        o[k] = '' + o[k];
    });
    return o;
}


//Tool - Date
function getCurrentDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    return today
}

function formatDateToYYYYMMDD(inputDate) {
    if (inputDate) {
        let currentDate = new Date(inputDate);
        let year = currentDate.getFullYear();
        let month = String(currentDate.getMonth() + 1).padStart(2, '0');
        let day = String(currentDate.getDate()).padStart(2, '0');

        let formattedDate = `${year}-${month}-${day}`;// Output: 2024-02-21
        return formattedDate;
    } else {
        return "";
    }
}
function formatToSlashDate(inputDate) {
    if (inputDate) {
        let currentDate = new Date(inputDate);
        let year = currentDate.getFullYear();
        let month = String(currentDate.getMonth() + 1).padStart(2, '0');
        let day = String(currentDate.getDate()).padStart(2, '0');

        let formattedDate = `${day}/${month}/${year}`;
        return formattedDate;
    } else {
        return "";
    }
}

function setCurrentUserForTempRef() {
    let currentUser = logInUser();
    currentUser = currentUser.replace(/\\/g, '\\\\');
    setFormFieldValue('CurrentUserWithSlash', currentUser);
}

//API Tool
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

    toEmptyString() {
        if (
            this.val.toLowerCase() === "false" ||
            this.val.toLowerCase() === "no" ||
            this.val.toLowerCase() === "please select" ||
            this.val.toLowerCase() === "-1" ||
            !this.val
        ) {
            return "";
        } else {
            return this.val;
        }
    }

    toZeroValue() {
        if (
           this.val === "" || this.val === " "
        ) {
            return "0.00";
        } else {
            return this.val;
        }
    }
}

function getBasicEmployeeInfo(){
    const IC = getFormFieldValue("QueryIC");
    const ICType = getFormFieldValue("QueryIDType");
    const EmployeeCode = getFormFieldValue("QueryEmployerCode");
    const NoticeDate = getFormFieldValue("FinalNoticeDate");
    console.log("IC: ", IC);
    console.log("IC Type: ", ICType);
    console.log("Employee Code: ", EmployeeCode);
    console.log("Notice Date: ", NoticeDate);
}

function fetchSystemVariableValue(name) {
    try {
        let value = getSystemValue(name);
        if (value != undefined && value.length > 0) {
            return value[0].Value;
        }
        return "";
    }
    catch (e) {
        console.error("fetchSystemVariableValue() Error : " + e);
    }
}

function getMiddlewareHostName() {
    let middlewareHostName = eFormHelper.formConfiguration.currentRenderMode == 'runtime' ? fetchSystemVariableValue("BARISTA_MIDDLEWARE") : "http://barista-uat.perkeso.gov.my:8090";

    if (middlewareHostName == "") {
        middlewareHostName = "http://10.7.50.139:8090"; //133 -> dev //139 -> uat
    }

    return middlewareHostName;
}