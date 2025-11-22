# Upgrade All Personas to World-Class Status
# Add "World-Class Expert" prefix to all persona files

$personaDir = "$env:USERPROFILE\.persona"

Write-Host "=== Upgrading Personas to World-Class Status ===" -ForegroundColor Cyan
Write-Host "Directory: $personaDir" -ForegroundColor Yellow
Write-Host ""

$upgraded = 0
$skipped = 0
$errors = 0

# Get all persona files
$files = Get-ChildItem -Path $personaDir -Filter "*.txt"

foreach ($file in $files) {
    try {
        # Read current content
        $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
        
        # Check if already starts with "You are a World-Class" or "You are a world-class"
        if ($content -match "^You are a [Ww]orld-[Cc]lass") {
            Write-Host "SKIP: $($file.Name) (already World-Class)" -ForegroundColor Yellow
            $skipped++
            continue
        }
        
        # Extract role from filename (remove number prefix and .txt extension)
        $role = $file.BaseName -replace '^\d+-', '' -replace '-', ' '
        $role = (Get-Culture).TextInfo.ToTitleCase($role)
        
        # Create World-Class prefix
        $worldClassPrefix = "You are a World-Class $role Expert with extensive experience and deep expertise in your field.`n`nYou bring world-class standards, best practices, and proven methodologies to every task. Your approach combines theoretical knowledge with practical, real-world experience.`n`n---`n`n"
        
        # Prepend the prefix
        $newContent = $worldClassPrefix + $content
        
        # Save back to file
        Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8 -NoNewline
        
        Write-Host "SUCCESS: $($file.Name) upgraded to World-Class" -ForegroundColor Green
        $upgraded++
        
    } catch {
        Write-Host "ERROR: $($file.Name) - $($_.Exception.Message)" -ForegroundColor Red
        $errors++
    }
}

Write-Host ""
Write-Host "=== Upgrade Completed ===" -ForegroundColor Cyan
Write-Host "SUCCESS: $upgraded personas upgraded to World-Class" -ForegroundColor Green
Write-Host "SKIP: $skipped personas (already World-Class)" -ForegroundColor Yellow
Write-Host "ERROR: $errors errors" -ForegroundColor Red
Write-Host ""
Write-Host "All personas are now World-Class Experts!" -ForegroundColor Green
