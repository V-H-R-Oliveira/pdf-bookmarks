export const BOOKMARK_PAGE_UI_SELECTOR = "p[class='bookmark-item-label']";

export const getActiveTab = async () => {
    const activeTabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return activeTabs[0];
}

export const sendMessageToActiveTab = async (message) => {
    const activateTab = await getActiveTab();
    const response = await chrome.tabs.sendMessage(activateTab.id, message);
    return response;
}

export const getPdfTitle = async () => {
    const activateTab = await getActiveTab();
    return activateTab.title;
};

export const getPdfUrl = async () => {
    const activateTab = await getActiveTab();
    return activateTab.url;
}

export const isValidPage = (page) => {
    return /[0-9]+/gm.test(page);
}

export const getPageFromText = (text) => {
    const pageText = text.trim();
    return pageText.match(/[0-9]+/)[0];
}