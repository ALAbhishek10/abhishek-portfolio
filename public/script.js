
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const formData = new FormData(contactForm);

        const contactDetails = {
            name: formData.get("name").trim(),
            email: formData.get("email").trim(),
            message: formData.get("message").trim()
        };

        formStatus.textContent = "Sending your message...";
        submitButton.disabled = true;

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(contactDetails)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Unable to send your message.");
            }

            formStatus.textContent = result.message;
            contactForm.reset();
        } catch (error) {
            formStatus.textContent =
                error.message || "Something went wrong. Please try again.";
        } finally {
            submitButton.disabled = false;
        }
    });
}
