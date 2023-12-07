const klawSync = require('klaw-sync');
const path = require('path');

function directoryToJson(dirPath) {
    const items = klawSync(dirPath, {
        nodir: true,
        filter: item => path.basename(item.path) !== 'node_modules'
    });

    const structure = {};

    items.forEach(item => {
        const relativePath = path.relative(dirPath, item.path);
        const parts = relativePath.split(path.sep);

        let currentLevel = structure;
        parts.forEach((part, index) => {
            if (!currentLevel[part]) {
                if (index === parts.length - 1) {
                    // Last part, file name
                    currentLevel[part] = 'file';
                } else {
                    currentLevel[part] = {};
                }
            }
            currentLevel = currentLevel[part];
        });
    });

    return structure;
}

// Example usage
const dirPath = 'F:\\srr\\multi-tenancy\\devtesting_adapt_authoring\\temp\\65702338b3aee119c04071f7\\adapt_framework';
const dirStructure = directoryToJson(dirPath);
console.log(JSON.stringify(dirStructure, null, 2));
