// Background script (service worker)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.greeting === "hello") {
    sendResponse({ farewell: "goodbye" });
  }
});
