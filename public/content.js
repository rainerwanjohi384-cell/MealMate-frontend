// Content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getData") {
    // Simulate getting data from the page
    const data = { data: "Sample data from content script" };
    sendResponse(data);
  }
});
