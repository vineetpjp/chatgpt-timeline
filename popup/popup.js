const checkbox = document.getElementById("autoCloseToggle");

// Load setting from chrome.storage
chrome.storage.local.get(["closeOnClick"], (result) => {
  checkbox.checked = result.closeOnClick ?? true; // default: true
});

// Save setting on change
checkbox.addEventListener("change", () => {
  chrome.storage.local.set({ closeOnClick: checkbox.checked });
});
