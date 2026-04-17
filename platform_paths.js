const os = require("node:os");
const path = require("node:path");

function getDefaultUserDataRoot(appName) {
  if (process.env.GERMAN_STUDY_DATA_DIR) {
    return process.env.GERMAN_STUDY_DATA_DIR;
  }

  if (process.platform === "darwin") {
    return path.join(os.homedir(), "Library", "Application Support", appName);
  }

  if (process.platform === "win32") {
    return path.join(
      process.env.LOCALAPPDATA || path.join(os.homedir(), "AppData", "Local"),
      appName
    );
  }

  return path.join(process.env.XDG_DATA_HOME || path.join(os.homedir(), ".local", "share"), appName);
}

module.exports = {
  getDefaultUserDataRoot
};
