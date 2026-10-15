// ============================================================
// SHIVKUND YUVA SAH SEVA SAMITI
// STUDENT REGISTRATION JAVASCRIPT
// ============================================================


// ============================================================
// SUPABASE CONFIGURATION
// ============================================================

const SUPABASE_URL =
    "https://ldvirwcwndeuwljeokom.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_l-XkBlX97sLoAaFaAO67dQ_6cYgzqpW";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


// ============================================================
// GLOBAL VARIABLES
// ============================================================

let mobileVerificationToken = null;
let currentRegistrationId = null;
let currentPaymentToken = null;


// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getValue(id) {

    const element = document.getElementById(id);

    if (!element) {
        return "";
    }

    return element.value.trim();
}


function setError(fieldId, message) {

    const errorElement =
        document.getElementById(fieldId + "Error");

    if (errorElement) {
        errorElement.textContent = message;
    }

    const field =
        document.getElementById(fieldId);

    if (field) {
        field.classList.add("error");
    }
}


function clearError(fieldId) {

    const errorElement =
        document.getElementById(fieldId + "Error");

    if (errorElement) {
        errorElement.textContent = "";
    }

    const field =
        document.getElementById(fieldId);

    if (field) {
        field.classList.remove("error");
    }
}


function validateRequired(fieldId, message) {

    const field =
        document.getElementById(fieldId);

    if (!field) {
        return true;
    }

    const value =
        field.value.trim();

    if (!value) {

        setError(
            fieldId,
            message
        );

        return false;
    }

    clearError(fieldId);

    return true;
}


// ============================================================
// DATE OF BIRTH
// ============================================================

const dobDay =
    document.getElementById("dobDay");

const dobMonth =
    document.getElementById("dobMonth");

const dobYear =
    document.getElementById("dobYear");

const dobHidden =
    document.getElementById("dob");


// Populate days
if (dobDay) {

    for (let day = 1; day <= 31; day++) {

        const option =
            document.createElement("option");

        option.value =
            String(day).padStart(2, "0");

        option.textContent =
            day;

        dobDay.appendChild(option);
    }
}


// Populate years
if (dobYear) {

    const currentYear =
        new Date().getFullYear();

    for (
        let year = currentYear - 10;
        year >= currentYear - 16;
        year--
    ) {

        const option =
            document.createElement("option");

        option.value =
            year;

        option.textContent =
            year;

        dobYear.appendChild(option);
    }
}


// Update hidden DOB field
function updateDateOfBirth() {

    if (
        dobDay &&
        dobMonth &&
        dobYear &&
        dobHidden
    ) {

        if (
            dobDay.value &&
            dobMonth.value &&
            dobYear.value
        ) {

            const day =
                Number(dobDay.value);

            const month =
                Number(dobMonth.value);

            const year =
                Number(dobYear.value);

            const selectedDate =
                new Date(
                    year,
                    month - 1,
                    day
                );

            const isValidDate =
                selectedDate.getFullYear() === year &&
                selectedDate.getMonth() === month - 1 &&
                selectedDate.getDate() === day;

            if (isValidDate) {

                dobHidden.value =
                    `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

                clearError("dob");

            } else {

                dobHidden.value = "";

                setError(
                    "dob",
                    "Please select a valid date of birth."
                );
            }

        } else {

            dobHidden.value = "";
        }
    }
}


if (dobDay) {
    dobDay.addEventListener(
        "change",
        updateDateOfBirth
    );
}


if (dobMonth) {
    dobMonth.addEventListener(
        "change",
        updateDateOfBirth
    );
}


if (dobYear) {
    dobYear.addEventListener(
        "change",
        updateDateOfBirth
    );
}


// ============================================================
// MOBILE OTP
// ============================================================


const sendOtpButton =
    document.getElementById("sendOtpButton");

const verifyOtpButton =
    document.getElementById("verifyOtpButton");



if (sendOtpButton) {

    sendOtpButton.addEventListener(
        "click",
        async function () {

            const mobile =
                getValue("mobile");

            clearError("mobile");

            if (!mobile) {

                setError(
                    "mobile",
                    "Please enter mobile number."
                );

                return;
            }

            if (!/^[6-9]\d{9}$/.test(mobile)) {

                setError(
                    "mobile",
                    "Please enter a valid 10-digit mobile number."
                );

                return;
            }

            sendOtpButton.disabled = true;

            sendOtpButton.textContent =
                "Sending...";

            try {

                const { data, error } =
                    await supabaseClient.rpc(
                        "create_mobile_otp",
                        {
                            p_mobile_number: mobile
                        }
                    );

                if (error) {
                    throw error;
                }
console.log("Development OTP:", data?.development_otp);
                if (
                    !data ||
                    data.success === false
                ) {

                    throw new Error(
                        data?.message ||
                        "Unable to send OTP."
                    );
                }

                alert(
                    data.message ||
                    "OTP sent successfully."
                );

                const otpArea =
                    document.getElementById("otpArea");

                if (otpArea) {
                    otpArea.style.display =
                        "block";
                }

            } catch (error) {

                console.error(
                    "OTP ERROR:",
                    error
                );

                alert(
                    error.message ||
                    "Unable to send OTP."
                );

            } finally {

                sendOtpButton.disabled =
                    false;

                sendOtpButton.textContent =
                    "Send OTP";
            }
        }
    );
}


// ============================================================
// VERIFY OTP
// ============================================================

if (verifyOtpButton) {

    verifyOtpButton.addEventListener(
        "click",
        async function () {

            const mobile =
                getValue("mobile");

            const otp =
                getValue("otp");

            clearError("otp");

            if (!otp) {

                setError(
                    "otp",
                    "Please enter OTP."
                );

                return;
            }

            verifyOtpButton.disabled = true;

            verifyOtpButton.textContent =
                "Verifying...";

            try {

                const { data, error } =
                    await supabaseClient.rpc(
                        "verify_mobile_otp",
                        {
                            p_mobile_number: mobile,
                            p_otp: otp
                        }
                    );

                if (error) {
                    throw error;
                }

                if (
                    !data ||
                    data.success === false
                ) {

                    throw new Error(
                        data?.message ||
                        "OTP verification failed."
                    );
                }

                mobileVerificationToken =
                    data.verification_token ||
                    data.token ||
                    data.data?.verification_token ||
                    null;

                if (!mobileVerificationToken) {

                    throw new Error(
                        "OTP verified but verification token was not returned."
                    );
                }

                alert(
                    data.message ||
                    "Mobile number verified successfully."
                );

                verifyOtpButton.textContent =
                    "Verified";

                verifyOtpButton.disabled =
                    true;

            } catch (error) {

                console.error(
                    "OTP VERIFICATION ERROR:",
                    error
                );

                alert(
                    error.message ||
                    "OTP verification failed."
                );

                verifyOtpButton.disabled =
                    false;

                verifyOtpButton.textContent =
                    "Verify OTP";
            }
        }
    );
}


// ============================================================
// FORM VALIDATION
// ============================================================

function validateForm() {

    let valid = true;


    // Student name
    if (
        !validateRequired(
            "studentName",
            "Student name is required."
        )
    ) {
        valid = false;
    }


    // Father's name
    if (
        !validateRequired(
            "fatherName",
            "Father's name is required."
        )
    ) {
        valid = false;
    }


    // Date of birth
    updateDateOfBirth();

    if (
        !dobHidden ||
        !dobHidden.value
    ) {

        setError(
            "dob",
            "Please select the complete date of birth."
        );

        valid = false;
    }


    // Gender
    if (
        !validateRequired(
            "gender",
            "Please select gender."
        )
    ) {
        valid = false;
    }


    // Class
    
if (
    !validateRequired(
        "class",
        "Please select class."
    )
) {
    valid = false;
}



    // School
    if (
        !validateRequired(
            "schoolName",
            "School name is required."
        )
    ) {
        valid = false;
    }


    // District
    if (
        !validateRequired(
            "district",
            "Please select district."
        )
    ) {
        valid = false;
    }
// Village validation
let villageValue = "";

if (districtField && districtField.value === "Munger") {

    villageValue =
        villageField
            ? villageField.value.trim()
            : "";

} else {

    villageValue =
        villageManualField
            ? villageManualField.value.trim()
            : "";
}

if (!villageValue) {

    setError(
    "village",
    "Please select or enter your village."
);

    valid = false;

}

    // Mobile
    if (
        !validateRequired(
            "mobile",
            "Mobile number is required."
        )
    ) {
        valid = false;

    } else {

        const mobile =
            getValue("mobile");

        if (
            !/^[6-9]\d{9}$/.test(mobile)
        ) {

            setError(
                "mobile",
                "Please enter a valid 10-digit mobile number."
            );

            valid = false;
        }
    }


    // OTP
    if (!mobileVerificationToken) {

        setError(
            "otp",
            "Please verify your mobile number first."
        );

        valid = false;
    }


    // Address
    if (
        !validateRequired(
            "address",
            "Address is required."
        )
    ) {
        valid = false;
    }


    // Previous participation
    if (
        !validateRequired(
            "previousParticipation",
            "Please select an option."
        )
    ) {
        valid = false;
    }


    // Declaration
    const declaration =
        document.getElementById("declaration");

    if (
        declaration &&
        !declaration.checked
    ) {

        setError(
            "declaration",
            "Please accept the declaration."
        );

        valid = false;

    } else {

        clearError("declaration");
    }


    return valid;
}


// ============================================================
// REGISTRATION FORM SUBMISSION
// ============================================================

const registrationForm =
    document.getElementById("registrationForm");


if (registrationForm) {

    registrationForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            if (!validateForm()) {

                alert(
                    "Please complete all required fields."
                );

                return;
            }


            const studentName =
                getValue("studentName");

            const fatherName =
                getValue("fatherName");

            const motherName =
                getValue("motherName");

            const dateOfBirth =
                getValue("dob");

     
const studentClass =
    getValue("class");


            const schoolName =
                getValue("schoolName");

            const mobileNumber =
                getValue("mobile");

            const alternateMobile =
                getValue("alternateMobile");

            const email =
                getValue("email");

            const address =
                getValue("address");

            const district =
                getValue("district");
let village = "";

if (district === "Munger") {

    village =
        getValue("village");

} else {

    village =
        getValue("villageManual");
}
            const gender =
                getValue("gender");

            const schoolType =
                getValue("schoolType");

            const previousParticipation =
                getValue("previousParticipation");


            const submitButton =
                registrationForm.querySelector(
                    'button[type="submit"]'
                );


            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "Submitting...";
            }


            try {

                if (!mobileVerificationToken) {

                    throw new Error(
                        "Please verify your mobile number first."
                    );
                }

console.log(
    "Selected class value:",
    JSON.stringify(studentClass)
);
                const { data, error } =
                    await supabaseClient.rpc(
                        "create_exam_registration",
                        {
                            p_verification_token:
                                mobileVerificationToken,

                            p_student_name:
                                studentName,

                            p_father_name:
                                fatherName,

                            p_mother_name:
                                motherName,

                            p_date_of_birth:
                                dateOfBirth,

                            p_class:
                                studentClass,

                            p_school_name:
                                schoolName,

                            p_mobile_number:
                                mobileNumber,

                            p_alternate_mobile:
                                alternateMobile,

                            p_email:
                                email,

                            p_address:
                                address,

                           p_village:
                               village,

                            p_district:
                                district,

                            p_state:
                                "Bihar",

                            p_pin_code:
                                "811202",

                            p_gender:
                                gender,

                            p_school_type:
                                schoolType,

                            p_previous_participation:
                                previousParticipation
                        }
                    );


                if (error) {
                    throw error;
                }


                if (
                    !data ||
                    data.success === false
                ) {

                    throw new Error(
                        data?.message ||
                        "Registration failed."
                    );
                }


                currentRegistrationId =
                    data.registration_id ||
                    data.id ||
                    data.registration?.id ||
                    null;



currentPaymentToken =
    data.payment_token ||
    data.payment_access_token ||
    data.registration?.payment_access_token ||
    null;


console.log("SUPABASE REGISTRATION RESPONSE:", data);
                if (!currentRegistrationId) {

                    throw new Error(
                        "Registration was created but registration ID was not returned."
                    );
                }


                if (!currentPaymentToken) {

                    throw new Error(
                        "Registration was created but payment token was not returned."
                    );
                }


                alert(
                    data.message ||
                    "Registration successful. Proceeding to payment."
                );


                const paymentUrl =
                    `payment.html?registration_id=${encodeURIComponent(currentRegistrationId)}&payment_token=${encodeURIComponent(currentPaymentToken)}&mobile=${encodeURIComponent(mobileNumber)}`;


                window.location.href =
                    paymentUrl;


            } catch (error) {

                console.error(
                    "REGISTRATION ERROR:",
                    error
                );

                alert(
                    error.message ||
                    "Registration failed. Please try again."
                );


                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        "Submit Registration";
                }
            }
        }
    );
}


// ============================================================
// CLEAR ERRORS WHEN USER CHANGES FIELDS
// ============================================================

const fieldsToWatch = [
    "studentName",
    "fatherName",
    "gender",
    "studentClass",
    "schoolName",
    "district",
    "mobile",
    "otp",
    "address",
    "previousParticipation"
];


fieldsToWatch.forEach(
    function (fieldId) {

        const field =
            document.getElementById(fieldId);

        if (field) {

            field.addEventListener(
                "input",
                function () {

                    clearError(fieldId);
                }
            );

            field.addEventListener(
                "change",
                function () {

                    clearError(fieldId);
                }
            );
        }
    }
);


// ============================================================
// PAGE LOAD
// ============================================================

console.log(
    "Shivkund registration JavaScript loaded successfully."
);
// ============================================================
// MUNGER BLOCK → VILLAGE SELECTOR
// Only Jamalpur and Dharhara use village dropdown
// ============================================================

const districtField =
    document.getElementById("district");

const blockField =
    document.getElementById("block");

const villageField =
    document.getElementById("village");

const villageManualField =
    document.getElementById("villageManual");


// District changed
if (districtField) {

    districtField.addEventListener(
        "change",
        function () {

            const district =
                districtField.value;

            // Reset block
            blockField.innerHTML =
                '<option value="">Select block</option>';

            blockField.disabled = true;


            // Reset village dropdown
            villageField.innerHTML =
                '<option value="">Select village</option>';

            villageField.disabled = true;


            // Reset manual village
            villageManualField.style.display =
                "none";

            villageManualField.disabled =
                true;

            villageManualField.required =
                false;

            villageManualField.value = "";


            // MUNGER
            if (district === "Munger") {

                blockField.disabled =
                    false;

                const blocks =
                    Object.keys(MUNGER_VILLAGES);

                blocks.forEach(
                    function (blockName) {

                        const option =
                            document.createElement(
                                "option"
                            );

                        option.value =
                            blockName;

                        option.textContent =
                            blockName;

                        blockField.appendChild(
                            option
                        );
                    }
                );

            }

            // OTHER DISTRICTS
            else {

                villageManualField.style.display =
                    "block";

                villageManualField.disabled =
                    false;

                villageManualField.required =
                    true;
            }
        }
    );
}


// Block changed
if (blockField) {

    blockField.addEventListener(
        "change",
        function () {

            const selectedBlock =
                blockField.value;


            // Reset village dropdown
            villageField.innerHTML =
                '<option value="">Select village</option>';

            villageField.disabled =
                true;


            // Reset manual village
            villageManualField.style.display =
                "none";

            villageManualField.disabled =
                true;

            villageManualField.required =
                false;

            villageManualField.value = "";


            // ONLY JAMALPUR AND DHARHARA
            if (
                selectedBlock === "Jamalpur" ||
                selectedBlock === "Dharhara"
            ) {

                const villages =
                    MUNGER_VILLAGES[
                        selectedBlock
                    ] || [];


                villages.forEach(
                    function (villageName) {

                        const option =
                            document.createElement(
                                "option"
                            );

                        option.value =
                            villageName;

                        option.textContent =
                            villageName;

                        villageField.appendChild(
                            option
                        );
                    }
                );


                villageField.disabled =
                    false;

            }

            // ALL OTHER MUNGER BLOCKS
            else if (selectedBlock) {

                villageManualField.style.display =
                    "block";

                villageManualField.disabled =
                    false;

                villageManualField.required =
                    true;
            }
        }
    );
}