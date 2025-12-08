// Popup script
document.getElementById('sendRuntimeMessage').addEventListener('click', () => {
  chrome.runtime.sendMessage({ greeting: "hello" })
    .then(response => {
      // Handle successful response
      if (response && response.farewell) {
        console.log(response.farewell);
      }
    })
    .catch(error => {
      // Handle the "Receiving end does not exist." error gracefully
      console.warn("Could not establish connection. Receiver probably not active:", error.message);
      // You might want to retry sending the message, or take other corrective actions
    });
});

document.getElementById('sendTabMessage').addEventListener('click', async () => {
  try {
    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const tabId = tab.id;

    chrome.tabs.sendMessage(tabId, { action: "getData" })
      .then(response => {
        // Handle successful response from the content script
        if (response && response.data) {
          console.log("Data received:", response.data);
        }
      })
      .catch(error => {
        // Handle the "Receiving end does not exist." error gracefully
        console.warn(`Error sending message to tab ${tabId}:`, error.message);
        // For example, if it's a content script, you might try to inject it
        // chrome.scripting.executeScript(...)
      });
  } catch (error) {
    console.error("Error querying tabs:", error);
  }
});
