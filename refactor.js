const fs = require('fs');
const path = require('path');

const basePath = 'f:\\TYS Web Solution\\development\\Apex windows';

const moves = {
    // Services Hub
    "services.html": ["services/index.html", "/services/"],
    // Services
    "services/windows.html": ["services/window-installation.html", "/services/window-installation/"],
    "services/doors.html": ["services/exterior-doors.html", "/services/exterior-doors/"],
    "services/eavestrough.html": ["services/eavestroughs.html", "/services/eavestroughs/"],
    "services/siding.html": ["services/vinyl-siding.html", "/services/vinyl-siding/"],
    "services/soffit-fascia.html": ["services/soffit-fascia.html", "/services/soffit-fascia/"],
    "services/decks-fences.html": ["services/decks-fences.html", "/services/decks-fences/"],
    // Areas
    "grimsby.html": ["areas/grimsby.html", "/areas/grimsby/"],
    "hamilton.html": ["areas/hamilton.html", "/areas/hamilton/"],
    "brantford.html": ["areas/brantford.html", "/areas/brantford/"],
    "burlington.html": ["areas/burlington.html", "/areas/burlington/"],
    "niagara.html": ["areas/niagara.html", "/areas/niagara/"],
    "niagara-falls.html": ["areas/niagara-falls.html", "/areas/niagara-falls/"],
    "st-catharines.html": ["areas/st-catharines.html", "/areas/st-catharines/"],
    "beamsville.html": ["areas/beamsville.html", "/areas/beamsville/"],
    "stoney-creek.html": ["areas/stoney-creek.html", "/areas/stoney-creek/"],
    "ancaster.html": ["areas/ancaster.html", "/areas/ancaster/"],
    "binbrook.html": ["areas/binbrook.html", "/areas/binbrook/"],
    "caledonia.html": ["areas/caledonia.html", "/areas/caledonia/"],
    "paris.html": ["areas/paris.html", "/areas/paris/"],
    // Blogs
    "blog.html": ["blog/index.html", "/blog/"],
    "blog-simcoe-siding.html": ["blog/simcoe-siding-guide.html", "/blog/simcoe-siding-guide/"],
    "blog-brantford-windows.html": ["blog/brantford-windows.html", "/blog/brantford-windows/"],
    "blog-burford.html": ["blog/burford.html", "/blog/burford/"],
    "blog-energy-guide.html": ["blog/energy-guide.html", "/blog/energy-guide/"],
    "blog-gutter-safety.html": ["blog/gutter-safety.html", "/blog/gutter-safety/"],
    "blog-ohsweken.html": ["blog/ohsweken.html", "/blog/ohsweken/"],
    "blog-paris-doors.html": ["blog/paris-doors.html", "/blog/paris-doors/"],
    "blog-port-dover.html": ["blog/port-dover.html", "/blog/port-dover/"],
    "blog-siding-guide.html": ["blog/siding-guide.html", "/blog/siding-guide/"],
    "blog-window-signs.html": ["blog/window-signs.html", "/blog/window-signs/"]
};

if (!fs.existsSync(path.join(basePath, 'areas'))) fs.mkdirSync(path.join(basePath, 'areas'));
if (!fs.existsSync(path.join(basePath, 'blog'))) fs.mkdirSync(path.join(basePath, 'blog'));
if (!fs.existsSync(path.join(basePath, 'services'))) fs.mkdirSync(path.join(basePath, 'services'));

// Move files
for (const [oldPath, values] of Object.entries(moves)) {
    const [newPath,] = values;
    const fullOld = path.join(basePath, oldPath);
    const fullNew = path.join(basePath, newPath);
    if (fs.existsSync(fullOld)) {
        fs.renameSync(fullOld, fullNew);
    }
}

// Find HTML files
function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        if (file === '.git') return;
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.html') || file.endsWith('.xml')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk(basePath);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    for (const [oldPath, values] of Object.entries(moves)) {
        const [_, href] = values;

        // Exact full replacements
        content = content.split(`https://www.apexwindowsexteriors.com/${oldPath}`).join(`https://www.apexwindowsexteriors.com${href}`);
        // Relative attribute replacements
        content = content.split(`href="${oldPath}"`).join(`href="${href}"`);
        content = content.split(`href='${oldPath}'`).join(`href='${href}'`);
        content = content.split(`href="../${oldPath}"`).join(`href="${href}"`);

        if (oldPath.startsWith('services/')) {
            const shortOld = oldPath.replace('services/', '');
            content = content.split(`href="${shortOld}"`).join(`href="${href}"`);
            content = content.split(`href='${shortOld}'`).join(`href='${href}'`);
            content = content.split(`href="../${shortOld}"`).join(`href="${href}"`);
        }
    }

    // Normalize root relatives without breaking semantic structure
    content = content.split('href="index.html"').join('href="/"');
    content = content.split('href="../index.html"').join('href="/"');
    content = content.split('href="contact.html"').join('href="/contact.html"');
    content = content.split('href="../contact.html"').join('href="/contact.html"');
    content = content.split('href="about.html"').join('href="/about.html"');
    content = content.split('href="../about.html"').join('href="/about.html"');

    fs.writeFileSync(file, content, 'utf8');
});

console.log("Done refactoring.");
