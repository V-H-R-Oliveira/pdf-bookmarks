import Bookmark from "./model.js";

const logTag = "Store Manager";

/**
   const storage = {
        "my-pdf": {
            pdfPages: [12]
        },
        "my-pdf-2": {
            pdfPages: [12, 31]
        }
   };
*/

class StoreManager {
    constructor(data) {
        this.storage = data;
    }

    static async initializeStore() {
        console.log(`[${logTag}] Initializing store...`);
        const savedData = await chrome.storage.local.get(null);
        return new StoreManager(savedData);
    }

    getBookmark(pdfName) {
        console.log(`[${logTag}] get bookmark model for "${pdfName}"`);
        const bookmarkRawData = this.storage[pdfName];

        if (bookmarkRawData) {
            return Bookmark.fromObject(bookmarkRawData);
        }

        console.log(`[${logTag}] creating a new bookmark model for "${pdfName}"`);
        return new Bookmark(pdfName);
    }

    updateBookmark(bookmark) {
        console.log(`[${logTag}] update bookmark model for`, bookmark);
        this.storage[bookmark.pdfName] = bookmark;
    }

    async syncData() {
        console.log(`[${logTag}] sync persistent storage`);
        await chrome.storage.local.set(this.storage);
    }
}

const storeManager = await StoreManager.initializeStore();

export default storeManager;