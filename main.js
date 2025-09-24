const { app, BrowserWindow, ipcMain, desktopCapturer } = require("electron");
const path = require("path");
const fs = require("fs");

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: true,   // allow require in HTML
      contextIsolation: false
    }
  });

  win.loadFile("index.html");
}

ipcMain.handle("capture-screen", async (event, index) => {
  try {
    const sources = await desktopCapturer.getSources({
      types: ["screen"],
      thumbnailSize: { width: 1920, height: 1080 }
    });

    if (!sources.length) throw new Error("No screen source found!");

    const pngBuffer = sources[0].thumbnail.toPNG();
    const saveDir = "C:\\Users\\Vyshnavi\\OneDrive\\Desktop\\vysh";  // change if needed
    if (!fs.existsSync(saveDir)) fs.mkdirSync(saveDir, { recursive: true });

    const savePath = path.join(saveDir, `screenshot_${index + 1}.png`);
    fs.writeFileSync(savePath, pngBuffer);

    return { success: true, path: savePath };
  } catch (err) {
    console.error("Error capturing screenshot:", err);
    return { success: false, error: err.message };
  }
});

app.whenReady().then(createWindow);
