const fs = require('fs');
const path = require('path');

const areasDir = 'areas';
const stickyHtml = `
    <!-- STICKY CONVERSION BANNER (Acquisition Upgrade) -->
    <div class="sticky-cta">
        <div class="sticky-details">
            <span class="sticky-tag">PRICE MATCH GUARANTEE</span>
            <span class="sticky-msg">We WILL beat any competitor quote!</span>
        </div>
        <a href="tel:6478334262" class="sticky-btn">
            <span>📞 Free Estimate: 647-833-4262</span>
        </a>
    </div>
</body>`;

// Function to process each index.html in subdirectories
function processDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            processDirectory(fullPath);
        } else if (entry.name === 'index.html') {
            updateFile(fullPath);
        }
    }
}

function updateFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // 1. Inject Sticky CTA
    if (!content.includes('sticky-cta')) {
        if (content.includes('</body>')) {
            content = content.replace('</body>', stickyHtml);
            changed = true;
        }
    }

    // 2. Remove legacy floating phone
    if (content.includes('floating-phone')) {
        content = content.replace(/<a[^>]*class="floating-phone"[^>]*>[\s\S]*?<\/a>/gi, '');
        changed = true;
    }

    // 3. SEO Title & Meta CTR Upgrade (Hamilton Example)
    if (filePath.includes('hamilton')) {
        content = content.replace('<title>Window Installation, Siding & Exterior Contractor Hamilton | Apex</title>', '<title>Windows & Doors Hamilton | #1 Exterior Contractor | PRICE MATCH</title>');
        content = content.replace('content="Top-rated exterior contractor Hamilton ON.', 'content="Apex Windows & Exteriors — Hamilton\'s #1 for Windows & Siding. We PRICE MATCH & BEAT any quote.');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated: ${filePath}`);
    }
}

console.log('Starting Site-Wide Acquisition Upgrade...');
processDirectory(areasDir);
// Also do root index.html if not already updated (though we did it manually)
updateFile('index.html');
console.log('Acquisition Upgrade Complete.');
