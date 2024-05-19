import storeManager from "./storage.js";
import { getPdfUrl, getPdfTitle, isValidPage, getPageFromText, sendMessageToActiveTab, BOOKMARK_PAGE_UI_SELECTOR } from "./utils.js";

const getCurrentBookmarkModel = async () => {
    const key = await getPdfTitle();
    const bookmark = storeManager.getBookmark(key);
    return bookmark;
}

const updateCurrentBookmarkModel = async (bookmark) => {
    storeManager.updateBookmark(bookmark);
    await storeManager.syncData();
}

const addPage = async (page) => {
    const bookmark = await getCurrentBookmarkModel();
    bookmark.addPage(page);

    await updateCurrentBookmarkModel(bookmark);
    return bookmark;
}

const deletePage = async (page) => {
    const bookmark = await getCurrentBookmarkModel();
    bookmark.deletePage(page);

    await updateCurrentBookmarkModel(bookmark);
    return bookmark;
}

const deleteBookmarkItem = async (event) => {
    const pageToDeleteElement = event.target.parentElement.querySelector(BOOKMARK_PAGE_UI_SELECTOR);
    const pageToDeleteText = pageToDeleteElement.innerText.trim();
    const pageToDelete = getPageFromText(pageToDeleteText);

    const bookmark = await deletePage(pageToDelete);
    renderBookmarkListHtml(bookmark);
}

const createBookmarkItemHtml = (page) => {
    return `
    <div class="bookmark-item">
        <p class="bookmark-item-label">Page ${page}</p>
        <img src="delete-button.svg" class="delete-button-image" alt="delete button" />
    </div>`;
}

const createBookmarkItemsHtml = (bookmark) => {
    let htmlContent = "";
    const pages = bookmark.pages();

    for (const page of pages) {
        htmlContent += createBookmarkItemHtml(page);
    }

    return htmlContent;
}

const createBookmarksListHtml = (bookmark) => {
    const bookmarkItemsHtml = createBookmarkItemsHtml(bookmark);
    return bookmarkItemsHtml;
}

const openBookmark = async (event) => {
    const pageToOpenText = event.target.innerText.trim();
    const pageToOpen = getPageFromText(pageToOpenText);

    const searchParams = new URLSearchParams();
    searchParams.set("page", pageToOpen);

    const pdfUrl = await getPdfUrl();
    const url = new URL(pdfUrl);

    url.hash = searchParams.toString();
    const id = crypto.randomUUID();
    url.searchParams.set("force-reload-id", id);

    await sendMessageToActiveTab({ from: "popup", action: "openPdf", args: [url.toString()] });
}

const registerEventHandlers = () => {
    const deleteButtonElements = document.querySelectorAll("img[class='delete-button-image']");

    for (const element of deleteButtonElements) {
        element.addEventListener("click", deleteBookmarkItem);
    }

    const pageElements = document.querySelectorAll(BOOKMARK_PAGE_UI_SELECTOR);

    for (const element of pageElements) {
        element.addEventListener("click", openBookmark);
    }
}

const renderBookmarkListHtml = (bookmark) => {
    const markup = createBookmarksListHtml(bookmark);
    document.getElementById("bookmark-list").innerHTML = markup;
    registerEventHandlers();
}

const showWrongMessage = (message) => {
    const wrongMessageElement = document.getElementById("wrong-message");
    wrongMessageElement.innerText = message;

    setTimeout((element) => {
        element.innerText = "";
    }, 500, wrongMessageElement);
}

const handleAddBookmarkEvent = async () => {
    const bookmarkInput = document.getElementById("add-bookmark-input");
    const page = bookmarkInput.value;
    const isValid = isValidPage(page);

    if (isValid) {
        const bookmark = await addPage(page);
        renderBookmarkListHtml(bookmark);
    } else {
        showWrongMessage("invalid page");
    }

    bookmarkInput.value = "";
}

(async () => {
    const pdfTitle = await getPdfTitle();

    document.getElementById("open-pdf").innerText = pdfTitle;
    document.getElementById("add-bookmark-btn").addEventListener("click", handleAddBookmarkEvent);

    const bookmark = storeManager.getBookmark(pdfTitle);

    await updateCurrentBookmarkModel(bookmark);
    renderBookmarkListHtml(bookmark);
})();
