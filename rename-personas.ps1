# Persona Renaming Script
# Add numbers 114-138 to 25 unnumbered personas

$personaDir = "$env:USERPROFILE\.persona"

# Unnumbered personas list (alphabetical order)
$renameMap = @{
    "ai-ethics-governance-expert.txt" = "114-ai-ethics-governance-expert.txt"
    "ai-master-instructor.txt" = "115-ai-master-instructor.txt"
    "ai-strategy-consultant.txt" = "116-ai-strategy-consultant.txt"
    "business-storyteller-ai.txt" = "117-business-storyteller-ai.txt"
    "c-level-ai-champion.txt" = "118-c-level-ai-champion.txt"
    "c-level-ai-learner.txt" = "119-c-level-ai-learner.txt"
    "creative-writer.txt" = "120-creative-writer.txt"
    "data-scientist-expert.txt" = "121-data-scientist-expert.txt"
    "devops-expert.txt" = "122-devops-expert.txt"
    "digital-transformation-leader.txt" = "123-digital-transformation-leader.txt"
    "dtpl-document-architect.txt" = "124-dtpl-document-architect.txt"
    "executive-education-facilitator.txt" = "125-executive-education-facilitator.txt"
    "fortune500-case-study-expert.txt" = "126-fortune500-case-study-expert.txt"
    "management-consultant-ai.txt" = "127-management-consultant-ai.txt"
    "openai-anthropic-engineer.txt" = "128-openai-anthropic-engineer.txt"
    "prehistoric-art-expert.txt" = "129-prehistoric-art-expert.txt"
    "product-strategist.txt" = "130-product-strategist.txt"
    "python-master.txt" = "131-python-master.txt"
    "science-teacher.txt" = "132-science-teacher.txt"
    "security-expert.txt" = "133-security-expert.txt"
    "system-architect-expert.txt" = "134-system-architect-expert.txt"
    "ux-design-expert.txt" = "135-ux-design-expert.txt"
    "ux-designer-expert.txt" = "136-ux-designer-expert.txt"
    "world-class-leadership-coach.txt" = "137-world-class-leadership-coach.txt"
    "world_class_tester.txt" = "138-world-class-tester.txt"
}

Write-Host "=== Persona Renaming Started ===" -ForegroundColor Cyan
Write-Host "Directory: $personaDir" -ForegroundColor Yellow
Write-Host ""

$renamed = 0
$skipped = 0
$errors = 0

foreach ($oldName in $renameMap.Keys) {
    $newName = $renameMap[$oldName]
    $oldPath = Join-Path $personaDir $oldName
    $newPath = Join-Path $personaDir $newName
    
    if (Test-Path $oldPath) {
        if (Test-Path $newPath) {
            Write-Host "WARNING: Skipped $newName (already exists)" -ForegroundColor Yellow
            $skipped++
        } else {
            try {
                Rename-Item -Path $oldPath -NewName $newName -ErrorAction Stop
                Write-Host "SUCCESS: $oldName -> $newName" -ForegroundColor Green
                $renamed++
            } catch {
                Write-Host "ERROR: $oldName - $($_.Exception.Message)" -ForegroundColor Red
                $errors++
            }
        }
    } else {
        Write-Host "WARNING: File not found - $oldName" -ForegroundColor Yellow
        $skipped++
    }
}

Write-Host ""
Write-Host "=== Task Completed ===" -ForegroundColor Cyan
Write-Host "SUCCESS: $renamed renamed" -ForegroundColor Green
Write-Host "WARNING: $skipped skipped" -ForegroundColor Yellow
Write-Host "ERROR: $errors failed" -ForegroundColor Red
Write-Host ""

# Final count
$totalFiles = (Get-ChildItem -Path $personaDir -Filter "*.txt").Count
Write-Host "Total personas: $totalFiles" -ForegroundColor Cyan

# Count numbered personas
$numberedFiles = (Get-ChildItem -Path $personaDir -Filter "*.txt" | Where-Object { $_.Name -match '^\d+' }).Count
Write-Host "Numbered personas: $numberedFiles" -ForegroundColor Cyan

# Check unnumbered personas
$unnumbered = Get-ChildItem -Path $personaDir -Filter "*.txt" | Where-Object { $_.Name -notmatch '^\d+' }
if ($unnumbered.Count -gt 0) {
    Write-Host ""
    Write-Host "WARNING: $($unnumbered.Count) unnumbered personas:" -ForegroundColor Yellow
    $unnumbered | ForEach-Object { Write-Host "   - $($_.Name)" -ForegroundColor Yellow }
} else {
    Write-Host ""
    Write-Host "SUCCESS: All personas are numbered!" -ForegroundColor Green
}
