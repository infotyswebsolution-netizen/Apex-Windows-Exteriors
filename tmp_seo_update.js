const fs = require('fs');
const file = 'index.html';

try {
    let content = fs.readFileSync(file, 'utf8');

    // SEO Meta
    const oldMeta = "Premium windows, doors, and siding in Grimsby & Hamilton. Licensed, insured, and budget-friendly. Get your free estimate today!";
    const newMeta = "Apex Windows & Exteriors — Grimsby's #1 for Windows, Doors & Siding. We PRICE MATCH & BEAT any quote. Licensed & Insured. Serving Grimsby, Hamilton & Niagara.";
    content = content.replace(oldMeta, newMeta);

    // Sticky CTA
    const sticky = `
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
    `;

    if (!content.includes('sticky-cta')) {
        if (content.includes('</body>')) {
            content = content.replace('</body>', sticky + '</body>');
        } else if (content.includes('</BODY>')) {
            content = content.replace('</BODY>', sticky + '</BODY>');
        }
    }

    fs.writeFileSync(file, content);
    console.log('v2.0 Acquisition Update Successfully Applied to index.html');
} catch (err) {
    console.error('Failed to update index.html:', err.message);
    process.exit(1);
}
