"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_https_1 = require("node:https");
const promises_1 = require("node:fs/promises");
const node_process_1 = require("node:process");
function loadFromFile() {
    return (0, promises_1.readFile)('content.xml', 'utf-8');
}
function loadFromURL(url) {
    return new Promise(res => {
        (0, node_https_1.get)(url, async (msg) => {
            msg.setEncoding('utf-8');
            let full = '';
            for await (const item of msg)
                full += item;
            res(full);
        });
    });
}
function* matchIte(str, regExp) {
    regExp.lastIndex = 0;
    let m;
    while ((m = regExp.exec(str)) !== null)
        yield m;
}
function openTagExp(tagName) {
    return new RegExp("< *" + tagName + " *[^>]*?>(.*?)<\\/ *" + tagName + " *>", "gsi");
}
function selfClosingTagExp(tagName) {
    return new RegExp("< *" + tagName + " *[^>]*?\\/>", "gsi");
}
function cdataMatch() {
    return /^!\[CDATA\[(.*)\]\]$/;
}
function attributeExp(attrName) {
    return new RegExp('<.*? ' + attrName + "=\"([^\\\\]*?)\".*?>");
}
function extractEntries(dom) {
    const entries = [];
    for (const [full, content] of matchIte(dom, openTagExp("item"))) {
        const title = openTagExp('title').exec(content)[1];
        const publicationDateString = openTagExp("pubDate").exec(content)[1];
        const enclosureTag = selfClosingTagExp("enclosure").exec(content)[0];
        const publicationDate = new Date(publicationDateString);
        // The url includes the html entity &amp; which is short for ampersand (&) which is replaced here
        const audioLink = attributeExp("url").exec(enclosureTag)[1].replace(/&amp;/g, '&');
        entries.push({ title, publicationDate, audioLink });
    }
    return entries;
}
const dateDescCmp = (a, b) => a.valueOf() - b.valueOf();
const dateToThreeTwoBlocks = (d) => d.toLocaleDateString().split('.').map(e => e.slice(-2).padStart(2, '0')).join('.');
function buildPLSPlaylistFromEntries(allEntries) {
    const entries = [...allEntries]
        .filter(a => a)
        .sort((a, b) => dateDescCmp(a.publicationDate, b.publicationDate));
    let fileContent = '';
    fileContent += '[playlist]\n';
    fileContent += 'NumberOfEntries=' + entries.length + '\n\n';
    const maxId = entries.length + 1;
    const maxIdLength = maxId.toString(10).length;
    for (let i = 0; i < entries.length; i++) {
        const { title, publicationDate, audioLink } = entries[i];
        const id = i + 1;
        const idStr = '#' + id.toString().padStart(maxIdLength, '0');
        const ts = dateToThreeTwoBlocks(publicationDate);
        fileContent += 'Title' + id + '=' + idStr + ' ' + ts + ' ' + title + '\n';
        fileContent += 'File' + id + '=' + audioLink + '\n\n';
    }
    return fileContent;
}
async function run(url, fileName = "playlist.pls") {
    if (!url)
        throw new Error("Please supply the RSS feed url as the first argument.");
    console.log('Reading URL ' + url);
    console.log('Will write PLS playlist to ' + fileName);
    // Loading
    const content = await loadFromURL(url);
    // Extracting
    const entries = extractEntries(content);
    // Assembling
    const fileContent = buildPLSPlaylistFromEntries(entries);
    // Writing
    await (0, promises_1.writeFile)(fileName, fileContent, 'utf-8');
}
const [runtime, scriptPath, feedURL, fileName] = node_process_1.argv;
run(feedURL, fileName)
    .catch(e => {
    console.error(e);
    process.exit(1);
});
