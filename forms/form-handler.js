// Wires any .campaign-form to the Formspree endpoint in site-config.json.
async function getEndpoint() {
  try {
    const res = await fetch("../data/site-config.json");
    const cfg = await res.json();
    return cfg.formEndpoint;
  } catch (e) { return null; }
}

document.addEventListener("DOMContentLoaded", async () => {
  const endpoint = await getEndpoint();
  const forms = document.querySelectorAll(".campaign-form");
  if (!forms.length) return;

  forms.forEach(form => {
    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const status = form.querySelector(".form-status");
      const type = form.getAttribute("data-form") || "general";

      if (!endpoint || endpoint.includes("REPLACE")) {
        status.textContent = "Form endpoint not configured yet.";
        status.style.color = "#c8102e";
        return;
      }

      const data = new FormData(form);
      data.append("form_type", type); // distinguishes volunteer vs feedback

      status.textContent = "Sending…";
      status.style.color = "#5b6b62";

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" }
        });
        if (res.ok) {
          status.textContent = "Thank you — your message has been received.";
          status.style.color = "#0a7d33";
          form.reset();
        } else {
          throw new Error("Server responded " + res.status);
        }
      } catch (err) {
        status.textContent = "Something went wrong. Please try again or use WhatsApp.";
        status.style.color = "#c8102e";
        console.error(err);
      }
    });
  });
});