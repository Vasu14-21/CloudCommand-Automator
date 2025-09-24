# CloudCommand-Automator
## 📌 Overview
This project integrates **Electron.js** with **Firebase Realtime Database** to automate file operations on your system using cloud commands.

- On startup → Automatically scans `C:\` drive (top 200 files/folders) and uploads results to Firebase.
- Firebase Command Listener → Executes remote operations such as deleting files from a given folder.

---

## ⚡ Features
- 🔍 **Drive Scanning** – Auto-scan `C:\` drive (200 items max).  
- ☁️ **Firebase Sync** – Store scanned data in Firebase Realtime Database.  
- 🗑️ **Cloud-Controlled Deletion** – Delete local files/folders remotely using Firebase commands.  
- 🔄 **Realtime Updates** – Status updates pushed back to Firebase (`done` / `failed`).  

## 📂 Project Structure
electron-firebase-automation/
│── main.js # Main process: scan + delete logic
│── preload.js # Preload script
│── index.html # Basic UI window
│── package.json # Project dependencies

⚠️ Warning
This app permanently deletes files.
Always test with a dummy folder before using on important data.

📈 Future Enhancements
Add file restore (recycle bin integration)
Enable file monitoring & alerts
Build a desktop UI dashboard

📌Author
Developed by: IMMARAJU VASU
Linkedin: www.linkedin.com/in/immarajuvasu3
