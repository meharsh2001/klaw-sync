const fs = require("fs");
const klawSync = require("klaw-sync");
const path = require("path");

function directoryToJson(dirPath) {
  const items = klawSync(dirPath, {
    nodir: true,
    filter: (item) => {
      const baseName = path.basename(item.path);
      return (
        baseName !== "node_modules" &&
        baseName !== ".git" &&
        baseName !== ".github"
      );
    },
  });

  const structure = {};

  items.forEach((item) => {
    const relativePath = path.relative(dirPath, item.path);
    const parts = relativePath.split(path.sep);

    let currentLevel = structure;
    parts.forEach((part, index) => {
      if (!currentLevel[part]) {
        if (index === parts.length - 1) {
          // Last part, file name
          currentLevel[part] = "file";
        } else {
          currentLevel[part] = {};
        }
      }
      currentLevel = currentLevel[part];
    });
  });

  return structure;
}

function writeJsonToFile(filePath, jsonStructure) {
  fs.writeFileSync(filePath, JSON.stringify(jsonStructure, null, 2));
  console.log(`Directory structure written to ${filePath}`);
}

// Example usage
const dirPath = process.argv[2] || './';
/* const dirPath =
  "F:\\srr\\multi-tenancy\\devtesting_adapt_authoring\\temp\\65704b77b0edfc0598c30f07\\adapt_framework";
 */const outputFilePath = "output.json";
const dirStructure = directoryToJson(dirPath);
writeJsonToFile(outputFilePath, dirStructure);
