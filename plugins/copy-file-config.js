const fs = require("fs");
const path = require("path");
const {
  withPlugins,
  withXcodeProject,
  withAndroidManifest,
  IOSConfig,
} = require("@expo/config-plugins");

const withMyConfigFile = (config, { src, iosDest, androidDest, groupName }) => {
  return withPlugins(config, [
    (config) => withIOSConfigFile(config, { src, dest: iosDest, groupName }),
    (config) => withAndroidConfigFile(config, { src, dest: androidDest }),
  ]);
};

//For ios
const withIOSConfigFile = (config, { src, dest, groupName }) => {
  return withXcodeProject(config, async (config) => {
    try {
      const sourcePath = path.resolve(__dirname, src); 
      const destinationPath = path.resolve(
        config.modRequest.platformProjectRoot,
        dest
      );

      if (!fs.existsSync(sourcePath)) {
        throw new Error(`Source file not found at ${sourcePath}`);
      }
      //copy file to root directory
      fs.copyFileSync(sourcePath, destinationPath);

      const project = config.modResults;

      //Add file to target and copy bundle resources
      IOSConfig.XcodeUtils.addResourceFileToGroup({
        filepath: destinationPath,
        groupName: groupName,
        isBuildFile: true,
        project,
        verbose: true,
      });
    } catch (error) {
      console.error(`Error copying ${src} to ios:`, error.message);
      throw error;
    }
    return config;
  });
};

//For android
const withAndroidConfigFile = (config, { src, dest }) => {
  return withAndroidManifest(config, async (config) => {
    const sourcePath = path.resolve(__dirname, src); 
    const destinationPath = path.resolve(
      config.modRequest.platformProjectRoot,
      dest
    );

    try {
      // Copy the file to the destination directory
      if (!fs.existsSync(sourcePath)) {
        throw new Error(`Source file not found at ${sourcePath}`);
      }

      const destDir = path.dirname(destinationPath);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      fs.copyFileSync(sourcePath, destinationPath);
    } catch (error) {
      console.error(`Error copying ${src} to Android:`, error.message);
      throw error;
    }

    return config;
  });
};

module.exports = withMyConfigFile;