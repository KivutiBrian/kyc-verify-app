const { withAppBuildGradle } = require("@expo/config-plugins");

/**
 * Expo Config Plugin to ensure kotlinOptions is present in build.gradle.
 * If kotlinOptions doesn't exist, it adds it inside the android block.
 */
const withKotlinOptions = (config) => {
  return withAppBuildGradle(config, (config) => {
    let buildGradle = config.modResults.contents;

    // Check if kotlinOptions block already exists
    if (!/kotlinOptions\s*\{/.test(buildGradle)) {
      // Insert kotlinOptions inside the android block
      buildGradle = buildGradle.replace(
        /android\s*\{([\s\S]*?)\n}/,
        `android {
$1
    kotlinOptions {
        freeCompilerArgs += ["-Xskip-metadata-version-check"] // Added by plugin
    }
}`
      );
    } else {
      // Ensure freeCompilerArgs includes -Xskip-metadata-version-check
      buildGradle = buildGradle.replace(
        /kotlinOptions\s*\{([\s\S]*?)\n}/,
        (match) => {
          if (!match.includes("-Xskip-metadata-version-check")) {
            return match.replace(
              /\n}/,
              `    freeCompilerArgs += ["-Xskip-metadata-version-check"] // Added by plugin
}`
            );
          }
          return match;
        }
      );
    }

    config.modResults.contents = buildGradle;
    return config;
  });
};

module.exports = withKotlinOptions;
