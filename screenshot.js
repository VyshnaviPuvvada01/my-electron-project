const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile("index.html");
}

// Folder where screenshots will be saved
const saveDir = "C:\\Users\\Vyshnavi\\OneDrive\\Desktop\\vysh";

// Save screenshot buffer to file
ipcMain.handle("save-screenshot", async (event, buffer, index) => {
  try {
    const savePath = path.join(saveDir, `screenshot_${index + 1}.png`);
    fs.writeFileSync(savePath, buffer);
    return { success: true, path: savePath };
  } catch (err) {
    console.error("Error saving screenshot:", err);
    return { success: false, error: err.message };
  }
});

app.whenReady().then(createWindow);



