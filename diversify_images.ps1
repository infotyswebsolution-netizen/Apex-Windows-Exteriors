$cityImages = @{
    "grimsby"       = "assets/window_inspection.png"
    "hamilton"      = "assets/construction_team.png"
    "burlington"    = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070"
    "brantford"     = "https://images.unsplash.com/photo-1600607687940-477a2283a7c1?q=80&w=2070"
    "st-catharines" = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070"
    "niagara-falls" = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070"
    "beamsville"    = "https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?q=80&w=2070"
    "stoney-creek"  = "https://images.unsplash.com/photo-1600585154542-61476d05494d?q=80&w=2070"
    "ancaster"      = "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=2070"
    "paris"         = "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?q=80&w=2070"
    "caledonia"     = "https://images.unsplash.com/photo-1600585154542-1e7935d6b38c?q=80&w=2070"
    "binbrook"      = "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=2070"
}

foreach ($city in $cityImages.Keys) {
    $filePath = "f:\TYS Web Solution\development\Apex windows\$city.html"
    if (Test-Path $filePath) {
        $content = Get-Content -Path $filePath -Raw -Encoding UTF8
        $newImg = $cityImages[$city]
        
        # Replace hero/main image
        $content = $content.Replace('src="assets/hero_house.png"', "src=`"$newImg`"")
        $content = $content.Replace('src="assets/modern_house.png"', "src=`"$newImg`"")
        
        Set-Content -Path $filePath -Value $content -Encoding UTF8
        Write-Host "Diversified images for $city.html"
    }
}
