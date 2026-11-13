
/* =========================================================
   COMRADE COLLINS CHIMAOBI OPARA CAMPAIGN WEBSITE
   Main JavaScript Application
========================================================= */

/* =========================================================
   1. PROJECT PATH CONFIGURATION
========================================================= */

const PATHS = {
    header: "../components/header.html",
    footer: "../components/footer.html",
    config: "../data/site-config.json",
    manifesto: "../data/manifesto.json"
};


/* =========================================================
   2. APPLICATION INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", init);

async function init() {
    console.log("Campaign website initializing...");

    // Load campaign configuration.
    const config = await loadJSON(PATHS.config);

    // Inject shared components.
    await injectPartial("#site-header", PATHS.header);
    await injectPartial("#site-footer", PATHS.footer);

    // Initialize shared functionality.
    applySiteConfiguration(config);
    initializeNavigation();
    initializeManifesto();
    initializeSmoothScrolling();
    initializeCopyrightYear();

    console.log("Campaign website initialized.");
}


/* =========================================================
   3. JSON DATA LOADER
========================================================= */

async function loadJSON(path) {
    try {
        const response = await fetch(path);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${path}`);
        }

        return await response.json();

    } catch (error) {
        console.warn("Unable to load JSON:", error);
        return {};
    }
}


/* =========================================================
   4. SHARED COMPONENT INJECTION
========================================================= */

async function injectPartial(selector, file) {
    const container = document.querySelector(selector);

    if (!container) {
        console.warn("Component container not found:", selector);
        return;
    }

    try {
        const response = await fetch(file);

        if (!response.ok) {
            throw new Error(`Unable to load ${file}`);
        }

        container.innerHTML = await response.text();

        console.log("Component loaded:", file);

    } catch (error) {
        console.error("Component injection failed:", error);
    }
}


/* =========================================================
   5. CAMPAIGN SITE CONFIGURATION
========================================================= */

function applySiteConfiguration(config) {
    if (!config || typeof config !== "object") {
        return;
    }

    // Apply configured text.
    document.querySelectorAll("[data-cfg]").forEach(element => {
        const key = element.dataset.cfg;

        if (typeof config[key] === "string") {
            element.textContent = config[key];
        }
    });

    // Apply configured links.
    document.querySelectorAll("[data-cfg-href]").forEach(element => {
        const key = element.dataset.cfgHref;
        const value = config[key];

        if (typeof value === "string" && value.trim() !== "") {
            element.href = value;
        }
    });

    // Candidate portrait.
    const portrait = document.getElementById("hero-portrait");

    if (portrait && config.heroPortrait) {
        portrait.src = config.heroPortrait;
    }

    // Party logo.
    if (config.partyLogo) {
        document.querySelectorAll(".logo").forEach(logo => {
            logo.src = config.partyLogo;
        });
    }
}


/* =========================================================
   6. MOBILE AND DESKTOP NAVIGATION
========================================================= */

function initializeNavigation() {
    const nav = document.querySelector(".nav");
    const toggle = document.querySelector(".nav-toggle");

    if (!nav || !toggle) {
        return;
    }

    if (!nav.id) {
        nav.id = "main-navigation";
    }

    toggle.setAttribute("aria-controls", nav.id);

    function closeNavigation(returnFocus = false) {
        const wasOpen = nav.classList.contains("open");

        nav.classList.remove("open");

        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open navigation menu");

        if (returnFocus && wasOpen) {
            toggle.focus();
        }
    }

    function openNavigation() {
        nav.classList.add("open");

        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", "Close navigation menu");
    }

    // Toggle mobile menu.
    toggle.addEventListener("click", () => {
        const isOpen = nav.classList.contains("open");

        if (isOpen) {
            closeNavigation();
        } else {
            openNavigation();
        }
    });

    // Close menu after selecting a navigation link.
    nav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            closeNavigation();
        });
    });

    // Close menu when clicking outside.
    document.addEventListener("click", event => {
        if (
            !nav.contains(event.target) &&
            !toggle.contains(event.target)
        ) {
            closeNavigation();
        }
    });

    // Close menu with Escape.
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeNavigation(true);
        }
    });

    // Highlight current page.
    highlightCurrentPage(nav);
}


/* =========================================================
   7. CURRENT PAGE HIGHLIGHT
========================================================= */

function highlightCurrentPage(nav) {
    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    nav.querySelectorAll("a").forEach(link => {
        const linkPage = new URL(
            link.getAttribute("href"),
            window.location.href
        ).pathname.split("/").pop();

        if (linkPage === currentPage) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}


/* =========================================================
   8. SMOOTH SCROLLING
========================================================= */

function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", event => {
            const targetID = link.getAttribute("href");

            if (!targetID || targetID === "#") {
                return;
            }

            const target = document.querySelector(targetID);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });
}


/* =========================================================
   9. MANIFESTO JSON CONTENT
========================================================= */

async function initializeManifesto() {
    const pillarHost = document.getElementById("pillars");

    // Skip pages that do not use the old JSON pillar layout.
    if (!pillarHost) {
        return;
    }

    try {
        const data = await loadJSON(PATHS.manifesto);

        if (!Array.isArray(data.pillars)) {
            throw new Error("Manifesto data must contain a pillars array.");
        }

        pillarHost.innerHTML = "";

        data.pillars.forEach(pillar => {
            const article = document.createElement("article");
            article.className = "pillar";

            if (pillar.id) {
                article.id = pillar.id;
            }

            const icon = document.createElement("div");
            icon.className = "pillar-icon";
            icon.textContent = pillar.icon || "✓";

            const title = document.createElement("h3");
            title.textContent = pillar.title || "";

            const description = document.createElement("p");
            description.textContent = pillar.text || "";

            article.append(icon, title, description);
            pillarHost.appendChild(article);
        });

    } catch (error) {
        console.error("Manifesto initialization failed:", error);

        pillarHost.textContent =
            "Campaign manifesto information is temporarily unavailable.";
    }
}


/* =========================================================
   10. COPYRIGHT YEAR
========================================================= */

function initializeCopyrightYear() {
    const currentYear = new Date().getFullYear();

    document.querySelectorAll("[data-current-year]").forEach(element => {
        element.textContent = currentYear;
    });
}


/* =========================================================
   11. GLOBAL ERROR HANDLING
========================================================= */

window.addEventListener("error", event => {
    console.error("Application error:", event.message);
});

window.addEventListener("unhandledrejection", event => {
    console.error("Unhandled application error:", event.reason);
});