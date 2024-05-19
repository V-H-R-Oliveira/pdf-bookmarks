export default class Bookmark {
    constructor(pdfName) {
        this.pdfName = pdfName;
        this.pdfPages = [];
    }

    addPage(page) {
        const hasPage = this.pdfPages.some((item) => item == page);

        if (!hasPage) {
            this.pdfPages.push(page);
        }
    }

    deletePage(page) {
        this.pdfPages = this.pdfPages.filter((item) => item != page);
    }

    pages() {
        return this.pdfPages;
    }

    static fromObject(data) {
        const bookmark = new Bookmark(data.pdfName);
        bookmark.pdfPages = [...bookmark.pdfPages, ...data.pdfPages];
        return bookmark;
    }
}