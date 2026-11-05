const feedbackForm = document.getElementById("feedbackForm");

const feedbackStatus = document.getElementById("feedbackStatus");

const feedbackList = document.getElementById("feedbackList");

const feedbackCount = document.getElementById("feedbackCount");

const feedbackListSection =
    document.getElementById("feedbackListSection");

const toggleFeedbackButton =
    document.getElementById("toggleFeedbackButton");

const feedbackSubmitButton =
    document.getElementById("feedbackSubmitButton");

let feedbackVisible = false;


// ==================================
// LOAD FEEDBACK FROM MONGODB
// ==================================

async function loadFeedback() {

    feedbackList.replaceChildren();

    const loading = document.createElement("p");
    loading.textContent = "Loading feedback...";

    feedbackList.appendChild(loading);

    try {

        const response = await fetch("/api/feedback");

        const feedbacks = await response.json();

        if (!response.ok) {
            throw new Error(
                feedbacks.message || "Unable to load feedback."
            );
        }

        feedbackList.replaceChildren();

        feedbackCount.textContent =
            `${feedbacks.length} message${feedbacks.length === 1 ? "" : "s"}`;


        if (feedbacks.length === 0) {

            const emptyMessage = document.createElement("p");

            emptyMessage.textContent =
                "No feedback has been submitted yet.";

            feedbackList.appendChild(emptyMessage);

            return;
        }


        feedbacks.forEach((item) => {

            const card = document.createElement("article");
            card.className = "fb-card";

            const name = document.createElement("h3");
            name.textContent = item.name;

            const message = document.createElement("p");
            message.textContent = item.message;

            const date = document.createElement("small");

            if (item.createdAt) {
                date.textContent = new Date(
                    item.createdAt
                ).toLocaleDateString();
            }

            card.appendChild(name);
            card.appendChild(message);
            card.appendChild(date);

            feedbackList.appendChild(card);

        });

    } catch (error) {

        feedbackList.replaceChildren();

        const errorMessage = document.createElement("p");
        errorMessage.textContent = error.message;

        feedbackList.appendChild(errorMessage);

    }

}


// ==================================
// SHOW AND HIDE FEEDBACK
// ==================================

toggleFeedbackButton.addEventListener("click", async () => {

    feedbackVisible = !feedbackVisible;

    feedbackListSection.hidden = !feedbackVisible;

    toggleFeedbackButton.setAttribute(
        "aria-expanded",
        String(feedbackVisible)
    );

    if (feedbackVisible) {

        toggleFeedbackButton.textContent = "Hide Feedback ↑";

        await loadFeedback();

    } else {

        toggleFeedbackButton.textContent = "View Feedback ↓";

    }

});


// ==================================
// SUBMIT FEEDBACK
// ==================================

feedbackForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const formData = new FormData(feedbackForm);

    const feedbackData = {
        name: formData.get("name").trim(),
        message: formData.get("message").trim()
    };


    if (!feedbackData.name || !feedbackData.message) {

        feedbackStatus.textContent =
            "Please complete both fields.";

        return;

    }


    feedbackSubmitButton.disabled = true;

    feedbackSubmitButton.textContent = "Submitting...";

    feedbackStatus.textContent = "Submitting your feedback...";


    try {

        const response = await fetch("/api/feedback", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(feedbackData)

        });


        const result = await response.json();


        if (!response.ok) {

            throw new Error(
                result.message || "Unable to submit feedback."
            );

        }


        feedbackStatus.textContent = result.message;

        feedbackStatus.className = "fb-success";

        feedbackForm.reset();


        // Refresh messages if the section is open
        if (feedbackVisible) {
            await loadFeedback();
        }


    } catch (error) {

        feedbackStatus.textContent = error.message;

        feedbackStatus.className = "fb-error";

    } finally {

        feedbackSubmitButton.disabled = false;

        feedbackSubmitButton.textContent = "Submit Feedback →";

    }

});