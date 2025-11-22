# Upgrade Community Personas to World-Class and Add Numbering
# This script:
# 1. Adds World-Class prefix to all 108 community personas
# 2. Adds numbers 1-108 to existing personas (alphabetically)
# 3. Copies 25 new personas (114-138) from ~/.persona

$communityDir = "C:\Users\sshin\Documents\persona-mcp\community"
$userPersonaDir = "$env:USERPROFILE\.persona"

Write-Host "=== Community Persona Upgrade Started ===" -ForegroundColor Cyan
Write-Host "Target: $communityDir" -ForegroundColor Yellow
Write-Host ""

# Step 1: Upgrade existing 108 personas to World-Class
Write-Host "Step 1: Upgrading 108 community personas to World-Class..." -ForegroundColor Green

$upgraded = 0
$skipped = 0

$files = Get-ChildItem -Path $communityDir -Filter "*.txt" | Sort-Object Name

foreach ($file in $files) {
    try {
        $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
        
        # Check if already World-Class
        if ($content -match "^You are a [Ww]orld-[Cc]lass") {
            Write-Host "SKIP: $($file.Name) (already World-Class)" -ForegroundColor Yellow
            $skipped++
            continue
        }
        
        # Extract role from filename
        $role = $file.BaseName -replace '^\d+-', '' -replace '-', ' '
        $role = (Get-Culture).TextInfo.ToTitleCase($role)
        
        # Create World-Class prefix
        $worldClassPrefix = "You are a World-Class $role Expert with extensive experience and deep expertise in your field.`n`nYou bring world-class standards, best practices, and proven methodologies to every task. Your approach combines theoretical knowledge with practical, real-world experience.`n`n---`n`n"
        
        # Prepend the prefix
        $newContent = $worldClassPrefix + $content
        
        # Save
        Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8 -NoNewline
        
        Write-Host "SUCCESS: $($file.Name) upgraded" -ForegroundColor Green
        $upgraded++
        
    } catch {
        Write-Host "ERROR: $($file.Name) - $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Step 1 Complete: $upgraded upgraded, $skipped skipped" -ForegroundColor Cyan
Write-Host ""

# Step 2: Add numbering to existing 108 personas
Write-Host "Step 2: Adding numbers to 108 personas..." -ForegroundColor Green

$files = Get-ChildItem -Path $communityDir -Filter "*.txt" | Where-Object { $_.Name -notmatch '^\d+' } | Sort-Object Name
$number = 1
$renamed = 0

foreach ($file in $files) {
    if ($number -gt 108) { break }
    
    $newName = "{0:D3}-{1}" -f $number, $file.Name
    $newPath = Join-Path $communityDir $newName
    
    try {
        Rename-Item -Path $file.FullName -NewName $newName -ErrorAction Stop
        Write-Host "SUCCESS: $($file.Name) -> $newName" -ForegroundColor Green
        $renamed++
        $number++
    } catch {
        Write-Host "ERROR: $($file.Name) - $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Step 2 Complete: $renamed personas numbered" -ForegroundColor Cyan
Write-Host ""

# Step 3: Copy new personas (114-138) from ~/.persona
Write-Host "Step 3: Copying 25 new personas (114-138)..." -ForegroundColor Green

$newPersonas = @(
    "114-ai-ethics-governance-expert.txt",
    "115-ai-master-instructor.txt",
    "116-ai-strategy-consultant.txt",
    "117-business-storyteller-ai.txt",
    "118-c-level-ai-champion.txt",
    "119-c-level-ai-learner.txt",
    "120-creative-writer.txt",
    "121-data-scientist-expert.txt",
    "122-devops-expert.txt",
    "123-digital-transformation-leader.txt",
    "124-dtpl-document-architect.txt",
    "125-executive-education-facilitator.txt",
    "126-fortune500-case-study-expert.txt",
    "127-management-consultant-ai.txt",
    "128-openai-anthropic-engineer.txt",
    "129-prehistoric-art-expert.txt",
    "130-product-strategist.txt",
    "131-python-master.txt",
    "132-science-teacher.txt",
    "133-security-expert.txt",
    "134-system-architect-expert.txt",
    "135-ux-design-expert.txt",
    "136-ux-designer-expert.txt",
    "137-world-class-leadership-coach.txt",
    "138-world-class-tester.txt"
)

$copied = 0

foreach ($personaName in $newPersonas) {
    $sourcePath = Join-Path $userPersonaDir $personaName
    $destPath = Join-Path $communityDir $personaName
    
    if (Test-Path $sourcePath) {
        try {
            Copy-Item -Path $sourcePath -Destination $destPath -Force
            Write-Host "SUCCESS: Copied $personaName" -ForegroundColor Green
            $copied++
        } catch {
            Write-Host "ERROR: $personaName - $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "WARNING: $personaName not found in ~/.persona" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Step 3 Complete: $copied new personas copied" -ForegroundColor Cyan
Write-Host ""

# Final count
$totalFiles = (Get-ChildItem -Path $communityDir -Filter "*.txt").Count
Write-Host "=== Upgrade Complete ===" -ForegroundColor Cyan
Write-Host "Total community personas: $totalFiles" -ForegroundColor Green
Write-Host ""
Write-Host "All community personas are now World-Class!" -ForegroundColor Green
