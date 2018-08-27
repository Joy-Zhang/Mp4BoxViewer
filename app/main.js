const path = require('path');
const {
    app,
    BrowserWindow,
    Menu,
    MenuItem,
    dialog
} = require('electron');

let browser;

app.on('ready', () => {
    browser = new BrowserWindow();
    browser.loadFile(path.join(__dirname, 'index.html'));
});
