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
let brokenLinksCount = 0;
let brokenLinks = [];

// Simple regex to grab hrefs:
const hrefRegex = /href=["']([^"']+)["']/g;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let match;
    while ((match = hrefRegex.exec(content)) !== null) {
        let href = match[1];
        if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('sms:') || href.startsWith('#')) {
            continue; // external or anchor or protocol
        }

        // Remove trailing hash if present for file routing checks
        let rawHref = href.split('#')[0];
        if (!rawHref) continue;

        // Resolve path to absolute filesystem path based on web root (basePath)
        let resolvedPath = '';
        if (rawHref.startsWith('/')) {
            resolvedPath = path.join(basePath, rawHref);
            // If it points to a folder without index.html ending
            if (rawHref.endsWith('/')) {
                resolvedPath = path.join(resolvedPath, 'index.html');
            }
        } else {
            // Rel path
            let currentDir = path.dirname(file);
            resolvedPath = path.join(currentDir, rawHref);
        }

        // if there's no extension and it's not a folder slash, Vercel might serve it cleanly. Local files must match .html
        if (!fs.existsSync(resolvedPath) && !fs.existsSync(resolvedPath + '.html')) {
            brokenLinks.push({ file: file.replace(basePath, ''), href: href });
            brokenLinksCount++;
        }
    }
});

if (brokenLinksCount === 0) {
    console.log("0 internal 404s found.");
} else {
    console.log(`Found ${brokenLinksCount} broken internal links:`);
    brokenLinks.forEach(b => console.log(`In ${b.file}: => ${b.href}`));
}
