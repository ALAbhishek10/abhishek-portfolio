const aboutStatus = document.getElementById("aboutStatus");

async function loadProfile() {

    try {

        const response = await fetch("/api/profile");
        const profile = await response.json();

        if (!response.ok) {
            throw new Error(
                profile.message || "Unable to load profile."
            );
        }


        // PERSONAL INTRODUCTION
        document.getElementById("profileName").textContent =
            `Hello, I'm ${profile.fullName}.`;

        document.getElementById("profileHeadline").textContent =
            profile.headline || "";

        document.getElementById("profileSummary").textContent =
            profile.summary || "";


        // EDUCATION
        document.getElementById("educationCourse").textContent =
            profile.course || "";

        document.getElementById("educationInstitution").textContent =
            profile.institution || "";

        document.getElementById("educationUniversity").textContent =
            profile.university || "";

        let studyYear = profile.studyYear || "";

        if (profile.graduationYear) {
            studyYear +=
                ` · Expected graduation: ${profile.graduationYear}`;
        }

        document.getElementById("educationYear").textContent =
            studyYear;

        document.getElementById("educationExtra").textContent =
            profile.educationDetails || "";


        // SKILLS
        document.getElementById("skillsContent").textContent =
            profile.skills || "";


        // INTERESTS AND LANGUAGES
        document.getElementById("interestsContent").textContent =
            profile.interests || "";

        document.getElementById("languagesContent").textContent =
            profile.languages
                ? `Languages: ${profile.languages}`
                : "";


        // PROJECTS
        document.getElementById("projectsContent").textContent =
            profile.projects || "";


        // OPTIONAL ACHIEVEMENTS
        const achievementSection =
            document.getElementById("achievementSection");

        const certification = (profile.certification || "").trim();

        document.getElementById("certificationContent").textContent =
            certification;

        achievementSection.hidden = !certification;


        // CONTACT LINKS
        const contactLinks =
            document.getElementById("contactLinks");

        contactLinks.replaceChildren();


        // EMAIL
        if (profile.email) {

            const emailLink = document.createElement("a");

            emailLink.href = `mailto:${profile.email}`;
            emailLink.textContent = "Email Me ↗";

            contactLinks.appendChild(emailLink);

        }


        // LINKEDIN
        if (profile.linkedin && profile.linkedin.trim()) {

            let linkedin = profile.linkedin.trim();

            if (!/^https?:\/\//i.test(linkedin)) {
                linkedin = "https://" + linkedin;
            }

            try {

                const url = new URL(linkedin);

                if (
                    url.protocol === "https:" ||
                    url.protocol === "http:"
                ) {

                    const linkedinLink =
                        document.createElement("a");

                    linkedinLink.href = url.href;
                    linkedinLink.textContent = "LinkedIn ↗";
                    linkedinLink.target = "_blank";
                    linkedinLink.rel = "noopener noreferrer";

                    contactLinks.appendChild(linkedinLink);

                }

            } catch (error) {
                console.error("Invalid LinkedIn URL:", error);
            }

        }


        aboutStatus.textContent = "";

    } catch (error) {

        console.error("About page error:", error);

        aboutStatus.textContent =
            error.message +
            " Please save your profile before viewing this page.";

    }

}

loadProfile();