import os
import re
import glob
import shutil

base_path = r"f:\TYS Web Solution\development\Apex windows"

# Map old paths (relative to base) to new clean paths
# We will do physical moves, AND we will replace hrefs.
# We'll map "old_file.html" to "new_file.html" and "href_target"

moves = {
    # Services Hub
    "services.html": ("services/index.html", "/services/"),
    # Services
    "services/windows.html": ("services/window-installation.html", "/services/window-installation/"),
    "services/doors.html": ("services/exterior-doors.html", "/services/exterior-doors/"),
    "services/eavestrough.html": ("services/eavestroughs.html", "/services/eavestroughs/"),
    "services/siding.html": ("services/vinyl-siding.html", "/services/vinyl-siding/"),
    "services/soffit-fascia.html": ("services/soffit-fascia.html", "/services/soffit-fascia/"),
    "services/decks-fences.html": ("services/decks-fences.html", "/services/decks-fences/"),
    # Areas
    "grimsby.html": ("areas/grimsby.html", "/areas/grimsby/"),
    "hamilton.html": ("areas/hamilton.html", "/areas/hamilton/"),
    "brantford.html": ("areas/brantford.html", "/areas/brantford/"),
    "burlington.html": ("areas/burlington.html", "/areas/burlington/"),
    "niagara.html": ("areas/niagara.html", "/areas/niagara/"),
    "niagara-falls.html": ("areas/niagara-falls.html", "/areas/niagara-falls/"),
    "st-catharines.html": ("areas/st-catharines.html", "/areas/st-catharines/"),
    "beamsville.html": ("areas/beamsville.html", "/areas/beamsville/"),
    "stoney-creek.html": ("areas/stoney-creek.html", "/areas/stoney-creek/"),
    "ancaster.html": ("areas/ancaster.html", "/areas/ancaster/"),
    "binbrook.html": ("areas/binbrook.html", "/areas/binbrook/"),
    "caledonia.html": ("areas/caledonia.html", "/areas/caledonia/"),
    "paris.html": ("areas/paris.html", "/areas/paris/"),
    # Blogs
    "blog.html": ("blog/index.html", "/blog/"),
    "blog-simcoe-siding.html": ("blog/simcoe-siding-guide.html", "/blog/simcoe-siding-guide/"),
    "blog-brantford-windows.html": ("blog/brantford-windows.html", "/blog/brantford-windows/"),
    "blog-burford.html": ("blog/burford.html", "/blog/burford/"),
    "blog-energy-guide.html": ("blog/energy-guide.html", "/blog/energy-guide/"),
    "blog-gutter-safety.html": ("blog/gutter-safety.html", "/blog/gutter-safety/"),
    "blog-ohsweken.html": ("blog/ohsweken.html", "/blog/ohsweken/"),
    "blog-paris-doors.html": ("blog/paris-doors.html", "/blog/paris-doors/"),
    "blog-port-dover.html": ("blog/port-dover.html", "/blog/port-dover/"),
    "blog-siding-guide.html": ("blog/siding-guide.html", "/blog/siding-guide/"),
    "blog-window-signs.html": ("blog/window-signs.html", "/blog/window-signs/")
}

os.makedirs(os.path.join(base_path, "areas"), exist_ok=True)
os.makedirs(os.path.join(base_path, "blog"), exist_ok=True)
os.makedirs(os.path.join(base_path, "services"), exist_ok=True)

# 1. Physical move
for old_path, (new_path, href) in moves.items():
    full_old = os.path.join(base_path, old_path)
    full_new = os.path.join(base_path, new_path)
    if os.path.exists(full_old):
        os.rename(full_old, full_new)

# 2. Update Links in all HTML files
html_files = []
for root, dirs, files in os.walk(base_path):
    for f in files:
        if f.endswith(".html"):
            html_files.append(os.path.join(root, f))

for file_path in html_files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    for old_path, (new_path, href) in moves.items():
        # Replace absolute links explicitly
        content = content.replace(f"https://www.apexwindowsexteriors.com/{old_path}", f"https://www.apexwindowsexteriors.com{href}")
        # Replace relative links
        # Be careful not to replace partial matches without quotes/slashes
        content = content.replace(f'href="{old_path}"', f'href="{href}"')
        content = content.replace(f"href='{old_path}'", f"href='{href}'")
        
        # for files already inside /services/, links to other /services/ may have been just "windows.html"
        if old_path.startswith("services/"):
            short_old = old_path.replace("services/", "")
            content = content.replace(f'href="{short_old}"', f'href="{href}"')
            content = content.replace(f"href='{short_old}'", f"href='{href}'")
            
        # also replace old .html for root if we are in a subdirectory...
        # A more robust regex might be better, but wait, previous links were all relative or absolute.
        # Often it was `href="../index.html"` or `href="index.html"`.
        content = content.replace('href="index.html"', 'href="/"')
        content = content.replace('href="../index.html"', 'href="/"')
        content = content.replace('href="contact.html"', 'href="/contact.html"')
        content = content.replace('href="../contact.html"', 'href="/contact.html"')
        content = content.replace('href="about.html"', 'href="/about.html"')
        content = content.replace('href="../about.html"', 'href="/about.html"')

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

# Update sitemap.xml
sitemap_path = os.path.join(base_path, "sitemap.xml")
if os.path.exists(sitemap_path):
    with open(sitemap_path, "r", encoding="utf-8") as f:
        sm_content = f.read()
    for old_path, (new_path, href) in moves.items():
        sm_content = sm_content.replace(f"https://www.apexwindowsexteriors.com/{old_path}", f"https://www.apexwindowsexteriors.com{href}")
    with open(sitemap_path, "w", encoding="utf-8") as f:
        f.write(sm_content)

print("Moved files and updated links.")
