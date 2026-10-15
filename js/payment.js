/* =========================================================
   SHIVKUND 2027 — PAYMENT PAGE
========================================================= */

console.log("Shivkund Payment JS loaded successfully.");


/* =========================================================
   ELEMENTS
========================================================= */

const studentNameEl = document.getElementById("studentName");
const studentClassEl = document.getElementById("studentClass");
const studentMobileEl = document.getElementById("studentMobile");
const paymentAmountEl = document.getElementById("paymentAmount");
const amountDisplayEl = document.getElementById("amountDisplay");
const paymentUpiIdEl = document.getElementById("paymentUpiId");
const copyUpiButton = document.getElementById("copyUpiButton");
const copyMessage = document.getElementById("copyMessage");
const paymentMethodEl = document.getElementById("paymentMethod");
const paymentReferenceEl = document.getElementById("paymentReference");
const submitPaymentButton = document.getElementById("submitPaymentButton");
const paymentMessage = document.getElementById("paymentMessage");


/* =========================================================
   PAYMENT SESSION
========================================================= */

const params = new URLSearchParams(window.location.search);

const registrationId = params.get("registration_id");
const paymentAccessToken = params.get("payment_token");
const mobileNumber = params.get("mobile");


/* =========================================================
   INITIAL VALIDATION
========================================================= */

if (!registrationId || !paymentAccessToken || !mobileNumber) {

    showMessage(
        "This payment link is incomplete or invalid. Please return to the registration page and continue again.",
        "error"
    );

    submitPaymentButton.disabled = true;

} else {

    loadPaymentDetails();

}


/* =========================================================
   LOAD PAYMENT DETAILS
========================================================= */

async function loadPaymentDetails() {

    try {

        /*
         * The payment amount will temporarily come from
         * the payment page configuration.
         *
         * The submit_exam_payment RPC still checks the
         * actual amount stored in Supabase.
         */

        const amount = 20;

        paymentAmountEl.textContent = `₹${amount.toFixed(0)}`;
        amountDisplayEl.textContent = `₹${amount.toFixed(0)}`;


        /*
         * Student name and class are saved by the
         * registration page before redirecting here.
         */

        const savedName =
            sessionStorage.getItem("shivkund_student_name");

        const savedClass =
            sessionStorage.getItem("shivkund_student_class");


        studentNameEl.textContent =
            savedName || "Registered Student";

        studentClassEl.textContent =
            savedClass ? `Class ${savedClass}` : "—";

        studentMobileEl.textContent =
            formatMobile(mobileNumber);


        /*
         * UPI ID comes from paymentConfig in payment.html.
         */

        if (paymentConfig && paymentConfig.upiId) {

            paymentUpiIdEl.textContent =
                paymentConfig.upiId;

        }


    } catch (error) {

        console.error(
            "Payment page loading error:",
            error
        );

        showMessage(
            "Unable to load payment details. Please try again.",
            "error"
        );

        submitPaymentButton.disabled = true;

    }

}


/* =========================================================
   FORMAT MOBILE
========================================================= */

function formatMobile(mobile) {

    if (!mobile || mobile.length !== 10) {

        return mobile || "—";

    }

    return `+91 ${mobile.slice(0, 5)} ${mobile.slice(5)}`;

}


/* =========================================================
   COPY UPI
========================================================= */

copyUpiButton.addEventListener(
    "click",
    async () => {

        const upiId =
            paymentUpiIdEl.textContent.trim();

        try {

            await navigator.clipboard.writeText(upiId);

            copyMessage.textContent =
                "UPI ID copied.";

            copyUpiButton.textContent =
                "Copied";

            setTimeout(() => {

                copyMessage.textContent = "";

                copyUpiButton.textContent =
                    "Copy";

            }, 2000);

        } catch (error) {

            copyMessage.textContent =
                "Please copy the UPI ID manually.";

        }

    }
);


/* =========================================================
   SUBMIT PAYMENT
========================================================= */

submitPaymentButton.addEventListener(
    "click",
    submitPayment
);


async function submitPayment() {

    clearMessage();

    const paymentMethod =
        paymentMethodEl.value.trim();

    const paymentReference =
        paymentReferenceEl.value.trim();


    /* -----------------------------------------------
       Basic frontend validation
    ------------------------------------------------ */

    if (!paymentMethod) {

        showMessage(
            "Please select your payment method.",
            "error"
        );

        paymentMethodEl.focus();

        return;

    }


    if (!paymentReference) {

        showMessage(
            "Please enter your UTR / transaction reference.",
            "error"
        );

        paymentReferenceEl.focus();

        return;

    }


    if (paymentReference.length < 6) {

        showMessage(
            "Please enter a valid payment reference.",
            "error"
        );

        paymentReferenceEl.focus();

        return;

    }


    /* -----------------------------------------------
       Loading state
    ------------------------------------------------ */

    submitPaymentButton.disabled = true;

    submitPaymentButton.classList.add("loading");


    try {

        const { data, error } =
            await supabaseClient.rpc(
                "submit_exam_payment",
                {
                    p_registration_id: registrationId,
                    p_verification_token: paymentAccessToken,
                    p_mobile_number: mobileNumber,
                    p_payment_method: paymentMethod,
                    p_payment_reference: paymentReference
                }
            );


        if (error) {

            throw error;

        }


        if (!data || data.success !== true) {

            showMessage(
                data?.message ||
                "Payment submission failed.",
                "error"
            );

            return;

        }


        /* -------------------------------------------
           Success
        -------------------------------------------- */


showMessage(
    `
    <strong>Payment details submitted successfully.</strong><br>
    Your payment is pending verification by the Shivkund examination team.
    `,
    "success"
);

paymentMethodEl.disabled = true;
paymentReferenceEl.disabled = true;
submitPaymentButton.disabled = true;

const buttonText =
    submitPaymentButton.querySelector(".button-text");

if (buttonText) {
    buttonText.textContent = "Payment Submitted";
}

// Open the registration success page after a short delay.
setTimeout(() => {
    window.location.href = "success.html";
}, 1800);


    } catch (error) {

        console.error(
            "Payment submission error:",
            error
        );

        showMessage(
            "Unable to submit payment details. Please try again.",
            "error"
        );

    } finally {

        submitPaymentButton.classList.remove("loading");

        if (!paymentMethodEl.disabled) {

            submitPaymentButton.disabled = false;

        }

    }

}


/* =========================================================
   MESSAGE HELPERS
========================================================= */

function showMessage(message, type) {

    paymentMessage.innerHTML = message;

    paymentMessage.className =
        `payment-message ${type}`;

}


function clearMessage() {

    paymentMessage.innerHTML = "";

    paymentMessage.className =
        "payment-message";

}