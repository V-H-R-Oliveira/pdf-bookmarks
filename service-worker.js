// const rules = [
//     {
//         conditions: [
//             new chrome.declarativeContent.PageStateMatcher({
//                 pageUrl: { pathSuffix: ".pdf", schemes: ["file", "http", "https"] }
//             })
//         ],
//         actions: [
//             new chrome.declarativeContent.ShowAction()
//         ]
//     }
// ];

// chrome.runtime.onInstalled.addListener(() => {
    // chrome.action.disable();

    // console.log("On installed...");

    // chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    //     chrome.declarativeContent.onPageChanged.addRules(rules, () => {
    //         console.log("Rules installed, ready-to-go...");
    //     });
    // });
// });

const isPdfPage = (tab) => {
    try {
        const tabUrl = new URL(tab.url);
        return tabUrl.pathname.endsWith(".pdf");
    }catch(err) {
        console.error("Failed to parse url due error:", err);
        return false;
    }
}

chrome.action.onClicked.addListener(async (tab) => {
    if(!isPdfPage(tab)) return;

    await chrome.action.setPopup({
        tabId: tab.id,
        popup: "popup.html"
    });
});