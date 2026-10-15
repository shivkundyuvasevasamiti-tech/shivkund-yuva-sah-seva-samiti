
console.log("SHIVKUND ADMIN PORTAL STARTED");

document.addEventListener("DOMContentLoaded", function () {
    // =====================================================
    // ELEMENT REFERENCES
    // =====================================================

    const loginForm = document.getElementById("loginForm");
    const loginPage = document.getElementById("loginPage");
    const dashboardPage = document.getElementById("dashboardPage");
    const loginMessage = document.getElementById("loginMessage");
    const emailBox = document.getElementById("email");
    const passwordBox = document.getElementById("password");
    const logoutButton = document.getElementById("logoutButton");

    const studentArea = document.getElementById("studentArea");
    const studentSearch = document.getElementById("studentSearch");
    const classFilter = document.getElementById("classFilter");
  const studentSort =
    document.getElementById("studentSort") ||
    document.getElementById("sortStudents");

    const resetStudentFilters = document.getElementById("resetStudentFilters");

    const paymentArea = document.getElementById("paymentArea");
    const pendingCount = document.getElementById("pendingCount");
    const verifiedCount = document.getElementById("verifiedCount");
    const registrationCount = document.getElementById("registrationCount");

    const verifiedStudentsToggle =
        document.getElementById("verifiedStudentsToggle");
    const verifiedStudentsDropdown =
        document.getElementById("verifiedStudentsDropdown");
    const verifiedStudentsArrow =
        document.getElementById("verifiedStudentsArrow");
    const verifiedStudentsArea =
        document.getElementById("verifiedStudentsArea");
    const printVerifiedStudentsButton =
        document.getElementById("printVerifiedStudents");

    // Keep the complete, unfiltered list here.
    let allStudents = [];

    // =====================================================
    // INITIAL VALIDATION
    // =====================================================

    if (typeof supabaseClient === "undefined") {
        console.error("Supabase client not initialized.");

        if (loginMessage) {
            loginMessage.textContent =
                "Supabase configuration error.";
        }

        return;
    }

    if (!loginForm || !loginPage || !dashboardPage) {
        console.error("Required login/dashboard HTML elements are missing.");
        return;
    }

    // =====================================================
    // STUDENT SEARCH, FILTER, SORT AND RESET
    // =====================================================

    function applyStudentFilters() {
        const searchTerm = (studentSearch?.value || "")
            .trim()
            .toLowerCase();

        const selectedClass = classFilter?.value || "";
        const sortBy = studentSort?.value || "roll-asc";

        const filteredStudents = allStudents.filter(function (student) {
            const searchableText = [
                student.roll_number,
                student.student_name,
                student.father_name,
                student.mobile_number,
                student.school_name,
                student.village,
                student.gender,
                student.class
            ]
                .map(function (value) {
                    return String(value ?? "");
                })
                .join(" ")
                .toLowerCase();

            const matchesSearch =
                searchableText.includes(searchTerm);

            const matchesClass =
                !selectedClass ||
                selectedClass === "all" ||
                String(student.class) === selectedClass;

            return matchesSearch && matchesClass;
        });

        filteredStudents.sort(function (a, b) {
            const nameA = String(a.student_name || "").toLowerCase();
            const nameB = String(b.student_name || "").toLowerCase();
            const rollA = String(a.roll_number || "");
            const rollB = String(b.roll_number || "");
            const classA = Number(a.class) || 0;
            const classB = Number(b.class) || 0;

            switch (sortBy) {
                case "name-asc":
                    return nameA.localeCompare(nameB);

                case "name-desc":
                    return nameB.localeCompare(nameA);

                case "class-asc":
                    return classA - classB;

                case "class-desc":
                    return classB - classA;

                case "roll-desc":
                    return rollB.localeCompare(rollA, undefined, {
                        numeric: true,
                        sensitivity: "base"
                    });

                case "roll-asc":
                default:
                    return rollA.localeCompare(rollB, undefined, {
                        numeric: true,
                        sensitivity: "base"
                    });
            }
        });

        renderStudents(filteredStudents);
    }

    if (studentSearch) {
        studentSearch.addEventListener(
            "input",
            applyStudentFilters
        );
    }

    if (classFilter) {
        classFilter.addEventListener(
            "change",
            applyStudentFilters
        );
    }

    if (studentSort) {
        studentSort.addEventListener(
            "change",
            applyStudentFilters
        );
    }

    if (resetStudentFilters) {
        resetStudentFilters.addEventListener("click", function () {
            if (studentSearch) studentSearch.value = "";
            if (classFilter) classFilter.value = "";
            if (studentSort) studentSort.value = "roll-asc";

            applyStudentFilters();
        });
    }

    // =====================================================
    // VERIFIED STUDENTS DROPDOWN
    // Register this listener once, not during every reload.
    // =====================================================

    if (verifiedStudentsToggle && verifiedStudentsDropdown) {
        verifiedStudentsToggle.addEventListener("click", function () {
            const isOpen =
                verifiedStudentsDropdown.classList.contains("open");

            verifiedStudentsDropdown.classList.toggle("open", !isOpen);

            if (verifiedStudentsArrow) {
                verifiedStudentsArrow.textContent =
                    isOpen ? "▼" : "▲";
            }

            verifiedStudentsToggle.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );
        });
    }

    // =====================================================
    // LOGIN
    // =====================================================

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = emailBox?.value.trim() || "";
        const password = passwordBox?.value || "";

        if (!email || !password) {
            if (loginMessage) {
                loginMessage.textContent =
                    "Please enter your email and password.";
            }
            return;
        }

        if (loginMessage) {
            loginMessage.textContent = "Signing in...";
        }

        try {
            const { data, error } =
                await supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: password
                });

            if (error) {
                if (loginMessage) {
                    loginMessage.textContent = error.message;
                }
                return;
            }

            const { data: sessionData, error: sessionError } =
                await supabaseClient.auth.getSession();

            if (sessionError) {
                await supabaseClient.auth.signOut();

                if (loginMessage) {
                    loginMessage.textContent =
                        "Unable to validate your administrator session.";
                }
                return;
            }

            const currentUser = sessionData?.session?.user;
            const role = currentUser?.app_metadata?.role;

            if (role !== "admin") {
                await supabaseClient.auth.signOut();

                if (loginMessage) {
                    loginMessage.textContent =
                        "Access denied. This account is not an authorized administrator.";
                }
                return;
            }

            console.log("ADMIN LOGIN SUCCESS:", data.user.id);

            loginPage.style.display = "none";
            dashboardPage.style.display = "block";

            await loadDashboard();
        } catch (error) {
            console.error("LOGIN ERROR:", error);

            if (loginMessage) {
                loginMessage.textContent =
                    "Login failed. Check the browser Console.";
            }
        }
    });

    // =====================================================
    // LOAD DASHBOARD DATA
    // =====================================================

    async function loadDashboard() {
        if (studentArea) {
            studentArea.textContent = "Loading students...";
        }

        if (paymentArea) {
            paymentArea.textContent = "Loading payments...";
        }

        try {
            const {
                data: students,
                error: studentError
            } = await supabaseClient
                .from("exam_registrations")
                .select(
                    "id, roll_number, student_name, father_name, class, school_name, mobile_number, village, gender, payment_status, registration_status"
                )
                .order("roll_number", { ascending: true });

            if (studentError) {
                console.error("STUDENT LOAD ERROR:", studentError);

                if (studentArea) {
                    studentArea.textContent =
                        "Unable to load students: " +
                        studentError.message;
                }

                return;
            }

            allStudents = students || [];

            if (registrationCount) {
                registrationCount.textContent = allStudents.length;
            }

            // Render using current search/filter/sort selections.
            applyStudentFilters();

            const {
                data: payments,
                error: paymentError
            } = await supabaseClient
                .from("exam_payments")
                .select(
                    "id, registration_id, amount, currency, payment_status, payment_method, payment_reference, provider, provider_order_id, provider_payment_id, paid_at, verified_at, created_at"
                )
                .order("created_at", { ascending: false });

            if (paymentError) {
                console.error("PAYMENT LOAD ERROR:", paymentError);

                if (paymentArea) {
                    paymentArea.textContent =
                        "Unable to load payments: " +
                        paymentError.message;
                }

                if (pendingCount) pendingCount.textContent = "—";
                if (verifiedCount) verifiedCount.textContent = "—";

                return;
            }

            const paymentList = payments || [];

            const pending = paymentList.filter(function (payment) {
                return payment.payment_status === "pending";
            });

            const verified = paymentList.filter(function (payment) {
                return payment.payment_status === "success";
            });

            if (pendingCount) {
                pendingCount.textContent = pending.length;
            }

            if (verifiedCount) {
                verifiedCount.textContent = verified.length;
            }

            renderPayments(paymentList, allStudents);
            renderVerifiedStudents(allStudents, paymentList);

            console.log("DASHBOARD LOADED", {
                registrations: allStudents.length,
                payments: paymentList.length,
                pending: pending.length,
                verified: verified.length
            });
        } catch (error) {
            console.error("DASHBOARD ERROR:", error);

            if (paymentArea) {
                paymentArea.textContent =
                    "An unexpected error occurred while loading the dashboard.";
            }
        }
    }

    // =====================================================
    // REGISTERED STUDENTS TABLE
    // =====================================================

    function renderStudents(students) {
        if (!studentArea) return;

        if (students.length === 0) {
            studentArea.textContent =
                allStudents.length === 0
                    ? "No registered students found."
                    : "No students match your search or filters.";

            return;
        }

        const wrapper = document.createElement("div");
        wrapper.style.overflowX = "auto";

        const table = document.createElement("table");
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        [
            "S.No.",
            "Roll No.",
            "Student Name",
            "Father's Name",
            "Class",
            "Village",
            "School Name",
            "Gender"
        ].forEach(function (heading) {
            const th = document.createElement("th");
            th.textContent = heading;
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");

        students.forEach(function (student, index) {
            const row = document.createElement("tr");

            [
                index + 1,
                student.roll_number || "Not assigned",
                student.student_name || "",
                student.father_name || "",
                student.class || "",
                student.village || "",
                student.school_name || "",
                student.gender || ""
            ].forEach(function (value) {
                const td = document.createElement("td");
                td.textContent = String(value ?? "");
                row.appendChild(td);
            });

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        wrapper.appendChild(table);
        studentArea.replaceChildren(wrapper);
    }

    // =====================================================
    // PAYMENT TABLE AND FINALIZATION
    // =====================================================

    function renderPayments(payments, students) {
        if (!paymentArea) return;

        if (payments.length === 0) {
            paymentArea.textContent = "No payment records found.";
            return;
        }

        const studentById = new Map();

        students.forEach(function (student) {
            studentById.set(student.id, student);
        });

        const wrapper = document.createElement("div");
        wrapper.style.overflowX = "auto";

        const table = document.createElement("table");
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        [
            "Roll Number",
            "Student Name",
            "Father's Name",
            "Amount",
            "Payment Method",
            "Transaction Reference",
            "Payment Status",
            "Action"
        ].forEach(function (heading) {
            const th = document.createElement("th");
            th.textContent = heading;
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");

        payments.forEach(function (payment) {
            const student = studentById.get(payment.registration_id);
            const row = document.createElement("tr");

            function addCell(value) {
                const td = document.createElement("td");
                td.textContent = String(value ?? "");
                row.appendChild(td);
                return td;
            }

            addCell(student?.roll_number || "Not assigned");
            addCell(student?.student_name || "Student not found");
            addCell(student?.father_name || "—");

            const amount = Number(payment.amount);

            addCell(
                Number.isFinite(amount)
                    ? (payment.currency || "INR") + " " + amount.toFixed(2)
                    : String(payment.amount ?? "")
            );

            addCell(payment.payment_method || "—");
            addCell(payment.payment_reference || "—");

            const statusCell = addCell("");
            const badge = document.createElement("span");
            const status = payment.payment_status || "unknown";

            if (status === "pending") {
                badge.textContent = "Pending Verification";
                badge.style.background = "#fef3c7";
                badge.style.color = "#92400e";
            } else if (status === "success") {
                badge.textContent = "Verified";
                badge.style.background = "#dcfce7";
                badge.style.color = "#166534";
            } else {
                badge.textContent = status;
                badge.style.background = "#f3f4f6";
                badge.style.color = "#374151";
            }

            badge.style.padding = "5px 9px";
            badge.style.borderRadius = "6px";
            badge.style.display = "inline-block";
            statusCell.appendChild(badge);

            const actionCell = document.createElement("td");

            const needsFinalization =
                student &&
                !student.roll_number &&
                (
                    payment.payment_status === "pending" ||
                    payment.payment_status === "success"
                );

            if (needsFinalization) {
                const button = document.createElement("button");

                button.type = "button";
                button.textContent =
                    status === "success"
                        ? "Assign Roll Number"
                        : "Verify Payment";

                button.style.padding = "8px 12px";
                button.style.background = "#15803d";
                button.style.color = "#ffffff";
                button.style.border = "none";
                button.style.borderRadius = "6px";
                button.style.cursor = "pointer";

                button.addEventListener("click", async function () {
                    const message =
                        status === "success"
                            ? "This payment is already marked successful. Finalize this registration and assign its roll number?"
                            : "Have you confirmed that this student's payment was actually received? Continue only after checking your payment records.";

                    if (!window.confirm(message)) return;

                    button.disabled = true;
                    button.textContent = "Processing...";

                    try {
                        const {
                            data: result,
                            error: rpcError
                        } = await supabaseClient.rpc(
                            "finalize_verified_exam_payment",
                            {
                                p_registration_id: payment.registration_id,
                                p_payment_id: payment.id,
                                p_provider:
                                    payment.provider ||
                                    payment.payment_method ||
                                    "manual",
                                p_provider_order_id:
                                    payment.provider_order_id || null,
                                p_provider_payment_id:
                                    payment.provider_payment_id ||
                                    payment.payment_reference ||
                                    null
                            }
                        );

                        if (rpcError) {
                            console.error("FINALIZATION ERROR:", rpcError);

                            window.alert(
                                "Registration could not be finalized:\n" +
                                rpcError.message
                            );

                            button.disabled = false;
                            button.textContent =
                                status === "success"
                                    ? "Assign Roll Number"
                                    : "Verify Payment";

                            return;
                        }

                        if (!result || result.success !== true) {
                            window.alert(
                                result?.message ||
                                "Payment finalization failed."
                            );

                            button.disabled = false;
                            button.textContent =
                                status === "success"
                                    ? "Assign Roll Number"
                                    : "Verify Payment";

                            return;
                        }

                        const {
                            data: registration,
                            error: registrationError
                        } = await supabaseClient
                            .from("exam_registrations")
                            .select(
                                "student_name, father_name, school_name, class, mobile_number, email, roll_number"
                            )
                            .eq("id", payment.registration_id)
                            .single();

                        if (registrationError) {
                            console.error(
                                "REGISTRATION FETCH ERROR:",
                                registrationError
                            );

                            window.alert(
                                result.message +
                                "\n\nRoll Number: " +
                                (result.roll_number || "Not assigned") +
                                "\n\nPayment was completed, but registration details could not be fetched."
                            );

                            await loadDashboard();
                            return;
                        }

                        if (registration.email && result.roll_number) {
                            const {
                                data: emailResult,
                                error: emailError
                            } = await supabaseClient.functions.invoke(
                                "send-student-confirmation-email",
                                {
                                    body: {
                                        email: registration.email,
                                        student_name: registration.student_name,
                                        father_name: registration.father_name,
                                        school_name: registration.school_name,
                                        class: registration.class,
                                        roll_number: result.roll_number,
                                        mobile_number: registration.mobile_number
                                    }
                                }
                            );

                            if (
                                emailError ||
                                !emailResult ||
                                emailResult.success !== true
                            ) {
                                console.error(
                                    "CONFIRMATION EMAIL ERROR:",
                                    emailError || emailResult
                                );

                                window.alert(
                                    result.message +
                                    "\n\nRoll Number: " +
                                    (result.roll_number || "Not assigned") +
                                    "\n\nPayment was completed, but the confirmation email could not be sent."
                                );

                                await loadDashboard();
                                return;
                            }

                            window.alert(
                                result.message +
                                "\n\nRoll Number: " +
                                result.roll_number +
                                "\n\nConfirmation email sent to: " +
                                registration.email
                            );
                        } else {
                            window.alert(
                                result.message +
                                "\n\nRoll Number: " +
                                (result.roll_number || "Not assigned") +
                                "\n\nNo student email address is available."
                            );
                        }

                        await loadDashboard();
                    } catch (error) {
                        console.error("FINALIZATION ERROR:", error);

                        window.alert(
                            "An unexpected error occurred:\n" +
                            error.message
                        );

                        button.disabled = false;
                        button.textContent =
                            status === "success"
                                ? "Assign Roll Number"
                                : "Verify Payment";
                    }
                });

                actionCell.appendChild(button);
                
                // REJECT PAYMENT — pending payments only
                if (
                    payment.payment_status === "pending" &&
                    student &&
                    !student.roll_number &&
                    student.payment_status !== "paid" &&
                    student.registration_status !== "confirmed"
                ) {
                    const rejectButton = document.createElement("button");

                    rejectButton.type = "button";
                    rejectButton.textContent = "Reject Payment";
                    rejectButton.style.padding = "8px 12px";
                    rejectButton.style.marginLeft = "8px";
                    rejectButton.style.background = "#b91c1c";
                    rejectButton.style.color = "#ffffff";
                    rejectButton.style.border = "none";
                    rejectButton.style.borderRadius = "6px";
                    rejectButton.style.cursor = "pointer";

                    rejectButton.addEventListener("click", async function () {
                        const reason = window.prompt(
                            "Enter the reason for rejecting this payment:"
                        );

                        // Cancelled or blank reason: do nothing.
                        if (reason === null || !reason.trim()) {
                            return;
                        }

                        if (reason.trim().length > 500) {
                            window.alert(
                                "The reason must be 500 characters or fewer."
                            );
                            return;
                        }

                        const confirmed = window.confirm(
                            "Reject this pending payment?\n\n" +
                            "Student: " + student.student_name +
                            "\nReason: " + reason.trim()
                        );

                        if (!confirmed) return;

                        rejectButton.disabled = true;
                        rejectButton.textContent = "Rejecting...";

                        try {
                            const { data: result, error } =
                                await supabaseClient.rpc(
                                    "reject_exam_payment",
                                    {
                                        p_registration_id:
                                            payment.registration_id,
                                        p_payment_id: payment.id,
                                        p_reason: reason.trim()
                                    }
                                );

                            if (error) {
                                console.error(
                                    "PAYMENT REJECTION ERROR:",
                                    error
                                );

                                window.alert(
                                    "Payment could not be rejected:\n" +
                                    error.message
                                );

                                rejectButton.disabled = false;
                                rejectButton.textContent = "Reject Payment";
                                return;
                            }

                            if (!result || result.success !== true) {
                                window.alert(
                                    result?.message ||
                                    "Payment rejection failed."
                                );

                                rejectButton.disabled = false;
                                rejectButton.textContent = "Reject Payment";
                                return;
                            }

                            window.alert(
                                "Payment rejected successfully.\n\n" +
                                "Student: " + student.student_name +
                                "\nReason: " + reason.trim() +
                                "\n\nNo roll number was assigned by this action."
                            );

                            await loadDashboard();

                        } catch (error) {
                            console.error(
                                "UNEXPECTED REJECTION ERROR:",
                                error
                            );

                            window.alert(
                                "An unexpected error occurred:\n" +
                                error.message
                            );

                            rejectButton.disabled = false;
                            rejectButton.textContent = "Reject Payment";
                        }
                    });

                    actionCell.appendChild(rejectButton);
                }

            } else if (student?.roll_number) {
                const label = document.createElement("span");
                label.textContent = "✓ Roll No: " + student.roll_number;
                label.style.color = "#15803d";
                label.style.fontWeight = "bold";
                actionCell.appendChild(label);
            } else {
                actionCell.textContent = "No action available";
            }

            row.appendChild(actionCell);
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        wrapper.appendChild(table);
        paymentArea.replaceChildren(wrapper);
    }

    // =====================================================
    // VERIFIED STUDENTS — CENTRE GATE LIST
    // =====================================================

    function renderVerifiedStudents(students, payments) {
        if (!verifiedStudentsArea) return;

        const verifiedRegistrationIds = new Set(
            payments
                .filter(function (payment) {
                    return payment.payment_status === "success";
                })
                .map(function (payment) {
                    return payment.registration_id;
                })
        );

        const verifiedStudents = students
            .filter(function (student) {
                return (
                    verifiedRegistrationIds.has(student.id) &&
                    Boolean(student.roll_number)
                );
            })
            .sort(function (a, b) {
                return String(a.roll_number || "").localeCompare(
                    String(b.roll_number || ""),
                    undefined,
                    {
                        numeric: true,
                        sensitivity: "base"
                    }
                );
            });

        if (verifiedStudents.length === 0) {
            const emptyState = document.createElement("div");
            emptyState.className = "empty-state";

            const icon = document.createElement("div");
            icon.className = "empty-icon";
            icon.textContent = "📋";

            const heading = document.createElement("h3");
            heading.textContent = "No verified students yet";

            const description = document.createElement("p");
            description.textContent =
                "Students will appear here after their payment has been verified and a roll number has been assigned.";

            emptyState.append(icon, heading, description);
            verifiedStudentsArea.replaceChildren(emptyState);
            return;
        }

        const listInfo = document.createElement("div");
        listInfo.className = "verified-list-info";

        const countInfo = document.createElement("div");
        const countStrong = document.createElement("strong");
        countStrong.textContent = verifiedStudents.length;
        countInfo.append(countStrong, document.createTextNode(" verified students"));

        const sortInfo = document.createElement("div");
        sortInfo.textContent = "Sorted by roll number";

        listInfo.append(countInfo, sortInfo);

        const wrapper = document.createElement("div");
        wrapper.className = "verified-table-wrapper";

        const table = document.createElement("table");
        table.className = "verified-students-table";

        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        [
            "S.No.",
            "Roll No.",
            "Student Name",
            "Father's Name",
            "Class",
            "Village",
            "School Name",
            "Gender"
        ].forEach(function (heading) {
            const th = document.createElement("th");
            th.textContent = heading;
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");

        verifiedStudents.forEach(function (student, index) {
            const row = document.createElement("tr");

            [
                index + 1,
                student.roll_number || "—",
                student.student_name || "—",
                student.father_name || "—",
                student.class || "—",
                student.village || "—",
                student.school_name || "—",
                student.gender || "—"
            ].forEach(function (value) {
                const td = document.createElement("td");
                td.textContent = String(value ?? "");
                row.appendChild(td);
            });

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        wrapper.appendChild(table);

        verifiedStudentsArea.replaceChildren(listInfo, wrapper);
    }

    // =====================================================
    // PRINT VERIFIED STUDENTS
    // =====================================================

    if (printVerifiedStudentsButton) {
        printVerifiedStudentsButton.addEventListener("click", function () {
            const table = verifiedStudentsArea?.querySelector(
                ".verified-students-table"
            );

            if (!table) {
                window.alert("There are no verified students to print.");
                return;
            }

            const printWindow = window.open(
                "",
                "_blank",
                "width=1200,height=800"
            );

            if (!printWindow) {
                window.alert(
                    "Please allow pop-ups in your browser to print the list."
                );
                return;
            }

            const today = new Date();

            const printedDate = today.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            });

            const printedTime = today.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit"
            });

            printWindow.document.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Verified Students - Shivkund</title>
                    <style>
                        * { box-sizing: border-box; }
                        body {
                            margin: 0;
                            padding: 25px;
                            font-family: Arial, Helvetica, sans-serif;
                            color: #000;
                            background: #fff;
                        }
                        .print-header {
                            text-align: center;
                            margin-bottom: 22px;
                            border-bottom: 2px solid #000;
                            padding-bottom: 14px;
                        }
                        .print-header h1 {
                            margin: 0;
                            font-size: 24px;
                            font-weight: 800;
                        }
                        .print-header h2 {
                            margin: 6px 0 0;
                            font-size: 18px;
                        }
                        .print-header p {
                            margin: 5px 0 0;
                            font-size: 13px;
                        }
                        .print-meta {
                            display: flex;
                            justify-content: space-between;
                            gap: 12px;
                            margin-bottom: 12px;
                            font-size: 12px;
                            font-weight: 600;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            font-size: 11px;
                        }
                        th, td {
                            border: 1px solid #000;
                            padding: 7px 6px;
                            text-align: left;
                            overflow-wrap: anywhere;
                        }
                        th {
                            background: #eee;
                            font-weight: 800;
                        }
                        .footer {
                            margin-top: 20px;
                            display: flex;
                            justify-content: space-between;
                            gap: 12px;
                            font-size: 11px;
                        }
                        @page {
                            size: A4 landscape;
                            margin: 12mm;
                        }
                        @media print {
                            body { padding: 0; }
                            thead { display: table-header-group; }
                            tr { break-inside: avoid; }
                        }
                    </style>
                </head>
                <body>
                    <div class="print-header">
                        <h1>SHIVKUND YUVA SAH SEVA SAMITI</h1>
                        <h2>ANNUAL EXAMINATION 2027</h2>
                        <p>VERIFIED STUDENTS — EXAMINATION CENTRE GATE LIST</p>
                    </div>
                    <div class="print-meta">
                        <span>Total Verified Students: ${table.querySelectorAll("tbody tr").length}</span>
                        <span>Printed: ${printedDate} ${printedTime}</span>
                    </div>
                    ${table.outerHTML}
                    <div class="footer">
                        <span>This list contains students whose examination payment has been verified.</span>
                        <span>Shivkund Yuva Sah Seva Samiti</span>
                    </div>
                    <script>
                        window.onload = function () {
                            window.focus();
                            window.print();
                        };
                    <\/script>
                </body>
                </html>
            `);

            printWindow.document.close();
        });
    }

    // =====================================================
    // LOGOUT
    // =====================================================

    if (logoutButton) {
        logoutButton.addEventListener("click", async function () {
            logoutButton.disabled = true;

            try {
                const { error } = await supabaseClient.auth.signOut();

                if (error) {
                    console.error("LOGOUT ERROR:", error.message);
                    window.alert("Logout failed: " + error.message);
                    return;
                }

                dashboardPage.style.display = "none";
                loginPage.style.display = "flex";

                loginForm.reset();

                if (loginMessage) {
                    loginMessage.textContent = "";
                }

                if (studentArea) studentArea.replaceChildren();
                if (paymentArea) paymentArea.replaceChildren();
                if (verifiedStudentsArea) {
                    verifiedStudentsArea.replaceChildren();
                }

                allStudents = [];

                if (studentSearch) studentSearch.value = "";
                if (classFilter) classFilter.value = "";
                if (studentSort) studentSort.value = "roll-asc";

                console.log("LOGOUT SUCCESS");
            } catch (error) {
                console.error("LOGOUT ERROR:", error);
                window.alert("An unexpected logout error occurred.");
            } finally {
                logoutButton.disabled = false;
            }
        });
    }

    console.log("Admin dashboard initialized.");
});
