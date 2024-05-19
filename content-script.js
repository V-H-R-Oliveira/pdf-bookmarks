const ACTIONS = {
    openPdf: (url) => {
        location.href = url;
    }
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    console.log("[Content Script]: Received message", message);

    const { from, action, args } = message;

    if (from == "popup") {
        const callback = ACTIONS[action];
        const response = callback(args);
        sendResponse(response);
    }
});

console.log("Content script loaded");