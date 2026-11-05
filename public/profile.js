const profileForm = document.getElementById("profileForm");
const profileStatus = document.getElementById("profileStatus");
const successModal = document.getElementById("successModal");
const closeModal = document.getElementById("closeModal");
const submitButton = document.getElementById("submitButton");


// COMPULSORY FIELDS
const requiredFields = [
    "fullName",
    "email",
    "course",
    "institution",
    "university",
    "studyYear",
    "headline",
    "summary",
    "languages",
    "interests",
    "skills",
    "projects"
];


// GET FIELD LABEL
function getFieldLabel(fieldName) {

    const label = profileForm.querySelector(
        `label[for="${fieldName}"]`
    );

    return label
        ? label.textContent.replace("*", "").trim()
        : fieldName;

}


// SUBMIT PROFILE
profileForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    profileStatus.textContent = "";
    profileStatus.className = "entry-status";


    // CHECK REQUIRED FIELDS
    const missingFields = requiredFields.filter((name) => {

        const field = profileForm.elements.namedItem(name);

        return !field || !field.value.trim();

    });


    if (missingFields.length > 0) {

        profileStatus.textContent =
            "Please complete: " +
            missingFields.map(getFieldLabel).join(", ");

        profileStatus.classList.add("entry-error");

        const firstMissing =
            profileForm.elements.namedItem(missingFields[0]);

        firstMissing.focus();

        firstMissing.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        return;

    }


    // CHECK EMAIL
    const email =
        profileForm.elements.namedItem("email").value.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

        profileStatus.textContent =
            "Please enter a valid email address.";

        profileStatus.classList.add("entry-error");

        return;

    }


    // COLLECT FORM DATA
    const profileData = Object.fromEntries(
        new FormData(profileForm).entries()
    );


    submitButton.disabled = true;
    submitButton.textContent = "Saving...";

    profileStatus.textContent = "Saving your profile...";


    try {

        const response = await fetch("/api/profile", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(profileData)

        });


        const result = await response.json();


        if (!response.ok) {

            const missing = result.missingFields
                ? " Missing: " + result.missingFields.join(", ")
                : "";

            throw new Error(
                (result.message || "Unable to save profile.") + missing
            );

        }


        // DISPLAY SUCCESS POPUP
        profileStatus.textContent = "";

        successModal.hidden = false;

        closeModal.focus();


    } catch (error) {

        profileStatus.textContent = error.message;

        profileStatus.classList.add("entry-error");

        console.error("Profile submission error:", error);


    } finally {

        submitButton.disabled = false;
        submitButton.textContent = "Save My Profile →";

    }

});


// CLOSE POPUP
closeModal.addEventListener("click", () => {
    successModal.hidden = true;
});


// CLOSE WHEN CLICKING OUTSIDE
successModal.addEventListener("click", (event) => {

    if (event.target === successModal) {
        successModal.hidden = true;
    }

});


// CLOSE USING ESCAPE
document.addEventListener("keydown", (event) => {

    if (event.key === "Escape" && !successModal.hidden) {
        successModal.hidden = true;
    }

});