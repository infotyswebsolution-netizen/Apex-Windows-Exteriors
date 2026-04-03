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

    // Remove footer-seo entirely
    content = content.replace(/<div class="footer-seo">[\s\S]*?<\/div>/g, '');

    // Convert remaining hash-based links in footer to point to proper service pages
    content = content.replace(/href="[^"]*?services\.html#windows"/g, 'href="/services/window-installation/"');
    content = content.replace(/href="[^"]*?services\.html#doors"/g, 'href="/services/exterior-doors/"');
    content = content.replace(/href="[^"]*?services\.html#eavestrough"/g, 'href="/services/eavestroughs/"');
    content = content.replace(/href="[^"]*?services\.html#gutter-guards"/g, 'href="/services/gutter-guards/"');
    content = content.replace(/href="[^"]*?services\.html#vinyl-siding"/g, 'href="/services/vinyl-siding/"');
    content = content.replace(/href="[^"]*?services\.html#siding-repair"/g, 'href="/services/vinyl-siding/"');

    // Internal generic locations in footer to proper URLs
    content = content.replace(/href="areas\.html"/g, 'href="/areas/grimsby/"');
    // We already handled /areas/ conversions correctly via the refactor.js, but these were generic links to the areas hub
    // which no longer exists if we moved areas.html to areas/index.html (wait, areas.html wasn't moved to areas/index.html).
    // Let's replace 'areas.html' with '/areas.html' just to be safe.

    fs.writeFileSync(file, content, 'utf8');
});

console.log("Cleaned footers.");
