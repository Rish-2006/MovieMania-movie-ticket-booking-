const { app, BrowserWindow, Menu, globalShortcut } = require('electron');
let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 2240,
    height: 1400,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadFile('index.html');

  // ====== Updated Menu with New Shortcuts ======
  const menuTemplate = [
    {
      label: 'File',
      submenu: [
        { label: 'Exit', role: 'quit' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', role: 'undo' },
        { label: 'Redo', role: 'redo' },
        { type: 'separator' },
        { label: 'Cut', role: 'cut' },
        { label: 'Paste', role: 'paste' },
        { type: 'separator' },
        {
          label: 'Go to Home (Ctrl+I)',
          accelerator: 'CmdOrCtrl+I',
          click: () => mainWindow.loadFile('index.html'),
        },
        {
          label: 'Go to About (Ctrl+A)',
          accelerator: 'CmdOrCtrl+A',
          click: () => mainWindow.loadFile('about us.html'),
        },
        {
          label: 'Go to Gallery (Ctrl+P)',
          accelerator: 'CmdOrCtrl+P',
          click: () => mainWindow.loadFile('payments.html'),
        },
        {
          label: 'Go to Gallery (Ctrl+S)',
          accelerator: 'CmdOrCtrl+S',
          click: () => mainWindow.loadFile('movies.html'),
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        { label: 'Reload', role: 'reload' },
        { label: 'Toggle Full Screen', role: 'togglefullscreen' },
        { label: 'Developer Tools', role: 'toggleDevTools' },
      ],
    },
    {
      label: 'Window',
      submenu: [
        { label: 'Minimize', role: 'minimize' },
        { label: 'Close', role: 'close' },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Help Desk',
          click: () => mainWindow.loadFile('about us.html'),
        },
      ],
    },
    {
      label: 'Movie Mania',
      submenu: [
        {
          label: 'Home',
          click: () => mainWindow.loadFile('index.html'),
        },
        {
          label: 'About Us',
          click: () => mainWindow.loadFile('about us.html'),
        },
        {
          label: 'Seat selection',
          click: () => mainWindow.loadFile('movies.html'),
        },
        {
          label: 'Payment',
          click: () => mainWindow.loadFile('payments.html'),
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  // ====== Keyboard Event Listeners ======
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.control) {
      switch (input.key.toLowerCase()) {
        case 'i':
          event.preventDefault();
          mainWindow.loadFile('index.html');
          break;
        case 'a':
          event.preventDefault();
          mainWindow.loadFile('about us.html');
          break;
        case 'm':
          event.preventDefault();
          mainWindow.loadFile('movies.html');
          break;
          case 'p':
          event.preventDefault();
          mainWindow.loadFile('payments.html');
          break;
      }
    }
  });

  // ====== Context Menu ======
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Reload Page', click: () => mainWindow.reload() },
    { label: 'Go to Home', click: () => mainWindow.loadFile('index.html') },
    { label: 'Open Developer Tools', click: () => mainWindow.webContents.openDevTools() },
    { label: 'Close Window', click: () => mainWindow.close() },
  ]);

  mainWindow.webContents.on('context-menu', () => contextMenu.popup());
});