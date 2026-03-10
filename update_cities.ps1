$cities = @("grimsby", "hamilton", "burlington", "brantford", "st-catharines", "niagara-falls", "beamsville", "stoney-creek", "ancaster", "paris", "caledonia", "binbrook")

foreach ($city in $cities) {
    $filePath = "f:\TYS Web Solution\development\Apex windows\$city.html"
    if (Test-Path $filePath) {
        $content = Get-Content -Path $filePath -Raw -Encoding UTF8
        
        # 1. Update Nav (Add Blog)
        $oldNav = '<li><a href="index.html#reviews">Reviews</a></li>'
        $newNav = '<li><a href="blog.html">Blog</a></li>'
        $content = $content.Replace($oldNav, $newNav)
        
        # 2. Add Blog Preview section before footer
        if ($content -notlike "*Latest From Our Blog*") {
            $footerStart = '<footer>'
            $blogPreview = @"
    <!-- BLOG PREVIEW -->
    <section class="bg-white">
        <div class="container">
            <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom: 30px; flex-wrap:wrap; gap:20px;">
                <div>
                    <span class="section-label">EXPERT HOME TIPS</span>
                    <h2>Latest From Our Blog</h2>
                </div>
                <a href="blog.html" class="service-link">View All &rarr;</a>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
                <a href="blog-window-signs.html" style="text-decoration:none; color:inherit; display:block; background:var(--bg-light); border-radius:12px; overflow:hidden;">
                    <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop" alt="Window inspection" style="width:100%; height:180px; object-fit:cover;">
                    <div style="padding:20px;">
                        <h3 style="margin:0; font-size:1.1rem;">5 Signs You Need New Windows</h3>
                    </div>
                </a>
                <a href="blog-gutter-safety.html" style="text-decoration:none; color:inherit; display:block; background:var(--bg-light); border-radius:12px; overflow:hidden;">
                    <img src="https://images.unsplash.com/photo-1635424710928-0544e8512eae?q=80&w=2071&auto=format&fit=crop" alt="Clogged gutters" style="width:100%; height:180px; object-fit:cover;">
                    <div style="padding:20px;">
                        <h3 style="margin:0; font-size:1.1rem;">Gutters vs. Your Foundation</h3>
                    </div>
                </a>
            </div>
        </div>
    </section>

"@
            $content = $content.Replace($footerStart, $blogPreview + $footerStart)
        }

        Set-Content -Path $filePath -Value $content -Encoding UTF8
        Write-Host "Updated $city.html"
    }
}
