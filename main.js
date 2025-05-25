// Create timeline UI
const timelineContainer = document.createElement("div");
timelineContainer.id = "chat-timeline-nav";
timelineContainer.style.display = "none"; // Initially hidden

// Create scroll container
const scrollContainer = document.createElement("div");
scrollContainer.className = "timeline-scroll";

// Create toggle button
const toggleBtn = document.createElement("button");
toggleBtn.id = "chat-timeline-toggle";
toggleBtn.innerText = "🕒";

// Close button inside timeline
const closeBtn = document.createElement("button");
closeBtn.id = "chat-timeline-close";
closeBtn.innerText = "×";

// Add close button to timeline
timelineContainer.appendChild(closeBtn);
timelineContainer.appendChild(scrollContainer);

// Toggle timeline visibility
toggleBtn.addEventListener("click", () => {
  // timelineContainer.style.display = "block";
  // document.querySelector("#chat-timeline-toggle").hidden = true;
  // timelineContainer.classList.add("show");
  openTimlineContainer();
});

closeBtn.addEventListener("click", () => {
  closeTimelineContainer();
});

// Append toggle button
document.body.appendChild(toggleBtn);

// Close on outside click
document.addEventListener("click", (e) => {
  const isClickInside = timelineContainer.contains(e.target);
  const isToggleBtn = toggleBtn.contains(e.target);

  // Only close if it's not inside the container or toggle button
  if (!isClickInside && !isToggleBtn) {
    // timelineContainer.classList.remove("show");
    // document.querySelector("#chat-timeline-toggle").hidden = false;
    closeTimelineContainer();
  }
});

function openTimlineContainer() {
  timelineContainer.style.display = "block";
  document.querySelector("#chat-timeline-toggle").hidden = true;
  timelineContainer.classList.add("show");
}

function closeTimelineContainer() {
  timelineContainer.classList.remove("show");
  document.querySelector("#chat-timeline-toggle").hidden = false;
  setTimeout(() => {
    timelineContainer.style.display = "none";
  }, 300); // Match transition duration
}

// Extract prompts
function extractUserPrompts() {
  let prompts = [];
  const messages = document.querySelectorAll(
    '[data-message-author-role="user"]'
  );

  messages.forEach((msg, idx) => {
    const user = msg?.lastElementChild;
    if (user) {
      const preview =
        user.innerText?.length > 50
          ? user.innerText.slice(0, 50) + "..."
          : user.innerText;
      prompts.push({ element: msg, title: preview || `Prompt #${idx + 1}` });
    }
  });

  return prompts;
}

// Render timeline
function renderTimeline() {
  // Remove previous list but keep close button
  scrollContainer.querySelectorAll(".timeline-item").forEach((e) => e.remove());

  const prompts = extractUserPrompts();
  prompts.forEach((item, i) => {
    const div = document.createElement("div");
    div.className = "timeline-item";
    div.innerText = `${i + 1}. ${item.title}`;

    div.addEventListener("click", () => {
      item.element.scrollIntoView({ behavior: "smooth" });
      // Read from localStorage
      chrome.storage.local.get(["closeOnClick"], (result) => {
        console.log(result, "result");
        const autoClose = result.closeOnClick ?? true;
        if (autoClose) {
          closeTimelineContainer();
        }
      });
    });

    scrollContainer.appendChild(div);
  });

  if (!document.querySelector("#chat-timeline-nav")) {
    document.body.appendChild(timelineContainer);
  }
  if (!document.querySelector("#chat-timeline-toggle")) {
    document.body.appendChild(toggleBtn);
  }
}

// Wait for chat to load
setTimeout(() => {
  renderTimeline();

  const observer = new MutationObserver(() => renderTimeline());
  observer.observe(document.querySelector("main"), {
    childList: true,
    subtree: true,
  });
}, 2000);
