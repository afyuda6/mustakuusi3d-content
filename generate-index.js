const fs = require("fs");
const path = require("path");

const assetsDir = path.join(__dirname, "assets");

function getFilesRecursive(dir, baseDir = dir) {
    const files = [];

    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            files.push(...getFilesRecursive(fullPath, baseDir));
        } else if (entry.isFile() && /\.(png|svg)$/i.test(entry.name)) {
            files.push(
                path.relative(baseDir, fullPath).split(path.sep).join("/")
            );
        }
    }

    return files;
}

if (!fs.existsSync(assetsDir)) {
    console.error("Folder assets tidak ditemukan:", assetsDir);
    process.exit(1);
}

const files = getFilesRecursive(assetsDir);

fs.writeFileSync(
    path.join(assetsDir, "index.json"),
    JSON.stringify(files, null, 2)
);

console.log(`Generated index.json with ${files.length} files`);