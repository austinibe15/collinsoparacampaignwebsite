// Lightweight constituent inquiry widget. Swap the responder for a real AI API later.
(function () {
  const launch = document.createElement("button");
  launch.className = "chat-launch";
  launch.textContent = "Ask the Campaign";
  document.body.appendChild(launch);

  const panel = document.createElement("div");
  panel.className = "chat-panel";
  panel.innerHTML = `
    <div class="chat-head">Campaign Assistant</div>
    <div class="chat-body" id="chat-body">
      <p>Hello! Ask about the manifesto, volunteering, or how to reach the campaign.</p>
    </div>
    <div class="chat-foot">
      <input id="chat-input" placeholder="Type your question…" />
      <button class="btn btn-primary" id="chat-send">Send</button>
    </div>`;
  document.body.appendChild(panel);

  launch.addEventListener("click", () => panel.classList.toggle("open"));

  const body = panel.querySelector("#chat-body");
  const input = panel.querySelector("#chat-input");
  const send = panel.querySelector("#chat-send");

  // Simple keyword responder. Replace reply() with a fetch to your AI endpoint when ready.
  function reply(text) {
    const t = text.toLowerCase();
    if (t.includes("volunteer") || t.includes("join")) return "You can sign up on the Get Involved page — choose a role and submit your details.";
    if (t.includes("donate") || t.includes("money")) return "Donations are handled securely on the Get Involved page via Paystack.";
    if (t.includes("manifesto") || t.includes("plan")) return "Our five pillars are Unity, Youth Empowerment, Jobs, Infrastructure, and Non-Indigene Representation. See the Manifesto page for details.";
    if (t.includes("ward") || t.includes("meeting")) return "We hold ward-level listening sessions — check the Updates page for the latest.";
    if (t.includes("where") || t.includes("constituency")) return "The campaign covers AMAC Bwari Federal Constituency.";
    return "Thanks for reaching out. For a detailed answer, please use the feedback form or join our WhatsApp group.";
  }

  function push(who, text) {
    const p = document.createElement("p");
    p.style.margin = "8px 0";
    p.innerHTML = `<strong>${who}:</strong> ${text}`;
    body.appendChild(p);
    body.scrollTop = body.scrollHeight;
  }

  send.addEventListener("click", () => {
    const text = input.value.trim();
    if (!text) return;
    push("You", text);
    input.value = "";
    setTimeout(() => push("Assistant", reply(text)), 300);
  });

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") send.click();
  });
})();