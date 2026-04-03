const fs = require('fs');
const path = require('path');

const basePath = 'f:\\TYS Web Solution\\development\\Apex windows';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        if (file === '.git') return;
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.html')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk(basePath);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Check if the old tag is present
    if (content.includes("AW-17967960122") && !content.includes("G-DRY1P4NHV8")) {
        // Appending the G-4 tag right under the AW one
        content = content.replace(
            /(gtag\('config',\s*'AW-17967960122'\);)/g,
            "$1\n    gtag('config', 'G-DRY1P4NHV8');"
        );
        fs.writeFileSync(file, content, 'utf8');
    }
});

console.log("Added GA4 ID.");
