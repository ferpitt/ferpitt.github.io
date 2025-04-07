// Function to calculate and update Galicia Bank duration
function updateGaliciaDuration() {
    const startDate = new Date(2023, 7); // August 2023 (month is 0-indexed)
    const today = new Date();
    const totalMonths = (today.getFullYear() - startDate.getFullYear()) * 12 + (today.getMonth() - startDate.getMonth());
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    document.getElementById("galicia-duration").textContent = `Aug 2023 - Present · ${years} yr ${months} mos`;
}

// Function to calculate and update experience title
function updateExperienceTitle() {
    const startDate = new Date(2015, 3); // April 2015 (month is 0-indexed)
    const today = new Date();
    const totalMonths = (today.getFullYear() - startDate.getFullYear()) * 12 + (today.getMonth() - startDate.getMonth());
    const years = Math.floor(totalMonths / 12);
    document.getElementById("experience-title").textContent = `${years} years driving decisions with data`;
}

function formatSkills(skillsString) {
    return skillsString.replace(/<i class="([^"]+)"><\/i>/g, (match, iconClass) => {
        const toolName = getToolName(iconClass);
        return `<span style="display: inline-block; margin: 5px 20px 5px 0; font-size: 0.7em;"><i class="${iconClass}"></i>&nbsp;&nbsp;${toolName}</span>`;
    });
}

function getToolName(iconClass) {
    const toolMap = {
        'fab fa-python': 'Python',
        'fa fa-database': 'SQL',
        'fas fa-chart-line': 'Analytics',
        'far fa-chart-bar': 'Power BI',
        'fas fa-cogs': 'Process',
        'fas fa-server': 'SSAS',
        'fab fa-js-square': 'JavaScript',
        'fab fa-html5': 'HTML',
        'fab fa-microsoft': 'SharePoint',
        'far fa-file-excel': 'Excel',
        'far fa-file-powerpoint': 'PowerPoint',
        'fas fa-chart-pie': 'Analytics'
    };
    return toolMap[iconClass] || '';
}

document.addEventListener("DOMContentLoaded", () => {
    updateGaliciaDuration();
    updateExperienceTitle();

    const jobCards = document.querySelectorAll(".job-card-container .job-card");
    if (jobCards.length === 0) {
        console.warn("No elements with the class 'job-card' were found.");
        return;
    }

    const currentJobCard = document.querySelector(".current-job-card");
    const currentJobContainer = document.createElement("div");
    currentJobContainer.className = "current-job-container";
    currentJobCard.parentNode.insertBefore(currentJobContainer, currentJobCard);
    currentJobContainer.appendChild(currentJobCard);

    const tooltip = document.createElement("div");
    tooltip.className = "job-tooltip";
    tooltip.style.display = "none";
    tooltip.style.opacity = "0";
    tooltip.style.transition = "opacity 0.15s ease-in-out";
    tooltip.style.width = "100%"; // Match parent width
    tooltip.style.position = "absolute"; // Position absolutely within container
    tooltip.style.top = "0"; // Align with top of container
    tooltip.style.left = "0"; // Align with left of container
    currentJobContainer.appendChild(tooltip);

    // Add position relative to container
    currentJobContainer.style.position = "relative";
    
    // Get current job card dimensions and apply to tooltip
    const updateTooltipSize = () => {
        const currentCardHeight = currentJobCard.offsetHeight;
        tooltip.style.minHeight = `${currentCardHeight}px`;
    };

    // Initial size update and listen for window resize
    updateTooltipSize();
    window.addEventListener('resize', updateTooltipSize);

    jobCards.forEach((card) => {
        const details = JSON.parse(card.getAttribute("data-details"));
        
        function showTooltip() {
            tooltip.style.display = "block";
            tooltip.style.opacity = "1";
            
            tooltip.innerHTML = `
                <div style="display: flex; align-items: start; gap: 1.5rem;">
                    <img src="${card.querySelector('img').src}" 
                         style="width: 60px; height: 60px; object-fit: cover; border-radius: 50%; border: 2px solid #eee; flex-shrink: 0;" 
                         alt="${details.company} logo">
                    <div style="flex-grow: 1;">
                        <h3 style="margin-bottom: 5px;">${details.title}</h3>
                        <h4 style="margin: 0; color: #999999; font-weight: normal;">at ${details.company}</h4>
                        <p>${details.duration}</p>
                        <p>${details.location || "N/A"}</p>
                        <div style="font-size: 1.5em; margin: 15px 0; text-align: left;">${formatSkills(details.skills || "N/A")}</div>
                        ${details.description ? `<p>${details.description}</p>` : ""}
                    </div>
                </div>
            `;
        }

        function hideTooltip() {
            tooltip.style.opacity = "0";
            setTimeout(() => {
                if (tooltip.style.opacity === "0") {
                    tooltip.style.display = "none";
                }
            }, 150);
        }

        card.addEventListener("mouseenter", showTooltip);
        card.addEventListener("mouseleave", (e) => {
            const toElement = e.relatedTarget;
            if (!tooltip.contains(toElement)) {
                hideTooltip();
            }
        });

        tooltip.addEventListener("mouseleave", (e) => {
            const toElement = e.relatedTarget;
            if (!card.contains(toElement)) {
                hideTooltip();
            }
        });
    });

    // Refined snapping scroll functionality for sequential navigation
    const sections = Array.from(document.querySelectorAll(".resume-section"));
    let isScrolling = false;

    window.addEventListener("wheel", (event) => {
        if (isScrolling) return;

        isScrolling = true;

        const currentScroll = window.scrollY;
        const direction = event.deltaY > 0 ? 1 : -1; // Determine scroll direction
        let targetSection;

        if (direction > 0) {
            // Scroll down: find the next section
            targetSection = sections.find((section) => section.offsetTop > currentScroll + 1);
        } else {
            // Scroll up: find the previous section
            targetSection = [...sections].reverse().find((section) => section.offsetTop < currentScroll - 1);
        }

        if (targetSection) {
            targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        setTimeout(() => {
            isScrolling = false; // Allow next scroll after animation completes
        }, 500); // Adjust timeout to match smooth scroll duration
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute("href").substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });
}); // End of DOMContentLoaded
