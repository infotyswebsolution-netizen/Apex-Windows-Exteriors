import os

file_path = 'index.html'
if not os.path.exists(file_path):
    print(f'File {file_path} not found')
    exit(1)

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Meta Update
old_meta = "Premium windows, doors, and siding in Grimsby & Hamilton. Licensed, insured, and budget-friendly. Get your free estimate today!"
new_meta = "Apex Windows & Exteriors — Grimsby's #1 for Windows, Doors & Siding. We PRICE MATCH & BEAT any quote. Licensed & Insured. Serving Grimsby, Hamilton & Niagara."
content = content.replace(old_meta, new_meta)

# Sticky CTA Injection
sticky_html = """
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
"""

if 'sticky-cta' not in content:
    # Use lowercase bodies since some tools or minifiers might change it, but standard is fine
    if '</body>' in content:
        content = content.replace('</body>', sticky_html + '</body>')
    elif '</BODY>' in content:
        content = content.replace('</BODY>', sticky_html + '</BODY>')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Success: Apex Acquisition Update v2.0 Applied.')
