# Reorganize Personas by Category
# World-Class Leadership Personas - Category-based Numbering System

Write-Host "=== Persona Reorganization Started ===" -ForegroundColor Cyan
Write-Host "Category-based numbering (100-unit system)" -ForegroundColor Cyan
Write-Host ""

$communityDir = ".\community"
$backupDir = ".\community.backup-reorganize"
$personaDir = "$env:USERPROFILE\.persona"

# Backup
Write-Host "Creating backup..." -ForegroundColor Yellow
if (Test-Path $backupDir) {
    Remove-Item $backupDir -Recurse -Force
}
Copy-Item $communityDir $backupDir -Recurse
Write-Host "Backup created: $backupDir" -ForegroundColor Green

# Category Mapping (Old Number → New Number, Category)
$categoryMap = @{
    # 100-199: Engineering & Development
    "07-fullstack-dev.txt" = @{New="101"; Cat="Engineering"}
    "22-react-expert.txt" = @{New="102"; Cat="Engineering"}
    "25-vue-specialist.txt" = @{New="103"; Cat="Engineering"}
    "08-ai-engineer.txt" = @{New="104"; Cat="Engineering"}
    "113-ai-engineer.txt" = @{New="105"; Cat="Engineering"}
    "09-data-engineer.txt" = @{New="106"; Cat="Engineering"}
    "112-data-scientist-engineer.txt" = @{New="107"; Cat="Engineering"}
    "12-devops-engineer.txt" = @{New="108"; Cat="Engineering"}
    "122-devops-expert.txt" = @{New="109"; Cat="Engineering"}
    "26-swift-ios-dev.txt" = @{New="110"; Cat="Engineering"}
    "27-kotlin-android.txt" = @{New="111"; Cat="Engineering"}
    "28-sql-database-expert.txt" = @{New="112"; Cat="Engineering"}
    "29-docker-kubernetes.txt" = @{New="113"; Cat="Engineering"}
    "30-graphql-expert.txt" = @{New="114"; Cat="Engineering"}
    "33-ci-cd-engineer.txt" = @{New="115"; Cat="Engineering"}
    "34-blockchain-dev.txt" = @{New="116"; Cat="Engineering"}
    "37-api-architect.txt" = @{New="117"; Cat="Engineering"}
    "38-embedded-systems.txt" = @{New="118"; Cat="Engineering"}
    "39-elasticsearch-expert.txt" = @{New="119"; Cat="Engineering"}
    "40-rabbitmq-messaging.txt" = @{New="120"; Cat="Engineering"}
    "41-redis-caching.txt" = @{New="121"; Cat="Engineering"}
    "23-rust-master.txt" = @{New="122"; Cat="Engineering"}
    "24-go-architect.txt" = @{New="123"; Cat="Engineering"}
    "003-python-master.txt" = @{New="124"; Cat="Engineering"}
    "131-python-master.txt" = @{New="125"; Cat="Engineering"}
    "36-security-expert.txt" = @{New="126"; Cat="Engineering"}
    "133-security-expert.txt" = @{New="127"; Cat="Engineering"}
    "110-systems-architect-identity.txt" = @{New="128"; Cat="Engineering"}
    "134-system-architect-expert.txt" = @{New="129"; Cat="Engineering"}
    "128-openai-anthropic-engineer.txt" = @{New="130"; Cat="Engineering"}
    
    # 200-299: Design & Creative
    "111-ui-ux-designer.txt" = @{New="201"; Cat="Design"}
    "005-ux-design-expert.txt" = @{New="202"; Cat="Design"}
    "135-ux-design-expert.txt" = @{New="203"; Cat="Design"}
    "136-ux-designer-expert.txt" = @{New="204"; Cat="Design"}
    "49-graphic-designer.txt" = @{New="205"; Cat="Design"}
    "001-creative-writer.txt" = @{New="206"; Cat="Design"}
    "120-creative-writer.txt" = @{New="207"; Cat="Design"}
    "42-screenwriter.txt" = @{New="208"; Cat="Design"}
    "43-poet.txt" = @{New="209"; Cat="Design"}
    "44-novelist.txt" = @{New="210"; Cat="Design"}
    "45-video-editor.txt" = @{New="211"; Cat="Design"}
    "46-photographer.txt" = @{New="212"; Cat="Design"}
    "47-music-producer.txt" = @{New="213"; Cat="Design"}
    "48-animator.txt" = @{New="214"; Cat="Design"}
    "50-game-designer.txt" = @{New="215"; Cat="Design"}
    "35-game-dev-unity.txt" = @{New="216"; Cat="Design"}
    "51-ux-copywriter.txt" = @{New="217"; Cat="Design"}
    "52-content-strategist.txt" = @{New="218"; Cat="Design"}
    "53-voiceover-artist.txt" = @{New="219"; Cat="Design"}
    "54-sound-designer.txt" = @{New="220"; Cat="Design"}
    "55-illustrator.txt" = @{New="221"; Cat="Design"}
    "56-comedian-writer.txt" = @{New="222"; Cat="Design"}
    
    # 300-399: Business & Strategy
    "01-innovation-expert.txt" = @{New="301"; Cat="Business"}
    "02-business-mgmt.txt" = @{New="302"; Cat="Business"}
    "06-strategy-consultant.txt" = @{New="303"; Cat="Business"}
    "116-ai-strategy-consultant.txt" = @{New="304"; Cat="Business"}
    "10-business-analytics.txt" = @{New="305"; Cat="Business"}
    "13-product-manager.txt" = @{New="306"; Cat="Business"}
    "002-product-strategist.txt" = @{New="307"; Cat="Business"}
    "130-product-strategist.txt" = @{New="308"; Cat="Business"}
    "14-global-startup.txt" = @{New="309"; Cat="Business"}
    "15-disruptive-entrepreneur.txt" = @{New="310"; Cat="Business"}
    "16-vp-innovation.txt" = @{New="311"; Cat="Business"}
    "57-cfo-advisor.txt" = @{New="312"; Cat="Business"}
    "58-sales-coach.txt" = @{New="313"; Cat="Business"}
    "59-marketing-director.txt" = @{New="314"; Cat="Business"}
    "60-hr-consultant.txt" = @{New="315"; Cat="Business"}
    "62-operations-manager.txt" = @{New="316"; Cat="Business"}
    "63-venture-capitalist.txt" = @{New="317"; Cat="Business"}
    "64-accountant.txt" = @{New="318"; Cat="Business"}
    "65-supply-chain.txt" = @{New="319"; Cat="Business"}
    "66-customer-success.txt" = @{New="320"; Cat="Business"}
    "67-brand-strategist.txt" = @{New="321"; Cat="Business"}
    "68-pr-specialist.txt" = @{New="322"; Cat="Business"}
    "69-ecommerce-expert.txt" = @{New="323"; Cat="Business"}
    "70-real-estate-investor.txt" = @{New="324"; Cat="Business"}
    "71-franchise-consultant.txt" = @{New="325"; Cat="Business"}
    "96-strategic-oracle.txt" = @{New="326"; Cat="Business"}
    "98-governance-guardian.txt" = @{New="327"; Cat="Business"}
    "99-human-dynamics-architect.txt" = @{New="328"; Cat="Business"}
    "100-market-experience-creator.txt" = @{New="329"; Cat="Business"}
    "101-execution-capital-alchemist.txt" = @{New="330"; Cat="Business"}
    "102-agile-growth-architect.txt" = @{New="331"; Cat="Business"}
    "103-sustainability-policy-shaper.txt" = @{New="332"; Cat="Business"}
    "117-business-storyteller-ai.txt" = @{New="333"; Cat="Business"}
    "123-digital-transformation-leader.txt" = @{New="334"; Cat="Business"}
    
    # 400-499: Data, AI & ML
    "121-data-scientist-expert.txt" = @{New="401"; Cat="AI"}
    "31-tensorflow-ml.txt" = @{New="402"; Cat="AI"}
    "32-pytorch-researcher.txt" = @{New="403"; Cat="AI"}
    "114-ai-ethics-governance-expert.txt" = @{New="404"; Cat="AI"}
    "115-ai-master-instructor.txt" = @{New="405"; Cat="AI"}
    "118-c-level-ai-champion.txt" = @{New="406"; Cat="AI"}
    "119-c-level-ai-learner.txt" = @{New="407"; Cat="AI"}
    "127-management-consultant-ai.txt" = @{New="408"; Cat="AI"}
    
    # 500-599: Testing & QA
    "138-world-class-tester.txt" = @{New="501"; Cat="Testing"}
    "109-qa-test-engineer.txt" = @{New="502"; Cat="Testing"}
    
    # 600-699: Education & Training
    "03-education-policy.txt" = @{New="601"; Cat="Education"}
    "04-intl-education.txt" = @{New="602"; Cat="Education"}
    "05-student-mobility.txt" = @{New="603"; Cat="Education"}
    "11-education-analytics.txt" = @{New="604"; Cat="Education"}
    "17-elite-tutor.txt" = @{New="605"; Cat="Education"}
    "18-college-consultant.txt" = @{New="606"; Cat="Education"}
    "19-university-president.txt" = @{New="607"; Cat="Education"}
    "004-science-teacher.txt" = @{New="608"; Cat="Education"}
    "132-science-teacher.txt" = @{New="609"; Cat="Education"}
    "84-math-teacher.txt" = @{New="610"; Cat="Education"}
    "85-physics-tutor.txt" = @{New="611"; Cat="Education"}
    "86-language-coach.txt" = @{New="612"; Cat="Education"}
    "87-writing-coach.txt" = @{New="613"; Cat="Education"}
    "88-test-prep-tutor.txt" = @{New="614"; Cat="Education"}
    "89-study-skills-coach.txt" = @{New="615"; Cat="Education"}
    "90-special-education.txt" = @{New="616"; Cat="Education"}
    "91-early-childhood-ed.txt" = @{New="617"; Cat="Education"}
    "92-stem-educator.txt" = @{New="618"; Cat="Education"}
    "93-esl-teacher.txt" = @{New="619"; Cat="Education"}
    "94-online-instructor.txt" = @{New="620"; Cat="Education"}
    "95-music-teacher.txt" = @{New="621"; Cat="Education"}
    "125-executive-education-facilitator.txt" = @{New="622"; Cat="Education"}
    "124-dtpl-document-architect.txt" = @{New="623"; Cat="Education"}
    "126-fortune500-case-study-expert.txt" = @{New="624"; Cat="Education"}
    
    # 700-799: Science & Research
    "72-neuroscientist.txt" = @{New="701"; Cat="Science"}
    "73-quantum-physicist.txt" = @{New="702"; Cat="Science"}
    "74-biotechnologist.txt" = @{New="703"; Cat="Science"}
    "75-climate-scientist.txt" = @{New="704"; Cat="Science"}
    "76-chemist.txt" = @{New="705"; Cat="Science"}
    "77-astronomer.txt" = @{New="706"; Cat="Science"}
    "78-ecologist.txt" = @{New="707"; Cat="Science"}
    "79-materials-scientist.txt" = @{New="708"; Cat="Science"}
    "80-epidemiologist.txt" = @{New="709"; Cat="Science"}
    "81-geologist.txt" = @{New="710"; Cat="Science"}
    "82-pharmacologist.txt" = @{New="711"; Cat="Science"}
    "83-statistician.txt" = @{New="712"; Cat="Science"}
    "129-prehistoric-art-expert.txt" = @{New="713"; Cat="Science"}
    
    # 800-899: Leadership & Management
    "137-world-class-leadership-coach.txt" = @{New="801"; Cat="Leadership"}
    "97-ethical-technologist.txt" = @{New="802"; Cat="Leadership"}
    
    # 900-999: Legal & Advisory
    "61-legal-advisor.txt" = @{New="901"; Cat="Legal"}
    "20-harvard-law-dispute.txt" = @{New="902"; Cat="Legal"}
    "21-harvard-phd-negotiation.txt" = @{New="903"; Cat="Legal"}
}

# Rename files
$renamed = 0
$skipped = 0

Write-Host "`nRenaming files..." -ForegroundColor Yellow

foreach ($oldFile in $categoryMap.Keys) {
    $oldPath = Join-Path $communityDir $oldFile
    $newNumber = $categoryMap[$oldFile].New
    $category = $categoryMap[$oldFile].Cat
    
    if (Test-Path $oldPath) {
        # Extract original name without number
        $originalName = $oldFile -replace '^\d+-', '' -replace '^\d{3}-', ''
        $newFileName = "$newNumber-$originalName"
        $newPath = Join-Path $communityDir $newFileName
        
        Rename-Item -Path $oldPath -NewName $newFileName -Force
        Write-Host "  ✓ $oldFile → $newFileName [$category]" -ForegroundColor Green
        $renamed++
    } else {
        Write-Host "  ⚠ File not found: $oldFile" -ForegroundColor Yellow
        $skipped++
    }
}

Write-Host "`n=== Reorganization Summary ===" -ForegroundColor Cyan
Write-Host "SUCCESS: $renamed files renamed" -ForegroundColor Green
Write-Host "SKIPPED: $skipped files not found" -ForegroundColor Yellow

# Copy to ~/.persona
Write-Host "`nCopying to ~/.persona..." -ForegroundColor Yellow
Copy-Item "$communityDir\*.txt" -Destination $personaDir -Force
Write-Host "✓ Copied to $personaDir" -ForegroundColor Green

# Count personas in each category
Write-Host "`n=== Category Distribution ===" -ForegroundColor Cyan
$categories = @{
    "100-199: Engineering" = 0
    "200-299: Design" = 0
    "300-399: Business" = 0
    "400-499: AI & ML" = 0
    "500-599: Testing" = 0
    "600-699: Education" = 0
    "700-799: Science" = 0
    "800-899: Leadership" = 0
    "900-999: Legal" = 0
}

Get-ChildItem $communityDir -Filter "*.txt" | ForEach-Object {
    $num = [int]($_.Name -replace '-.*', '')
    if ($num -ge 100 -and $num -lt 200) { $categories["100-199: Engineering"]++ }
    elseif ($num -ge 200 -and $num -lt 300) { $categories["200-299: Design"]++ }
    elseif ($num -ge 300 -and $num -lt 400) { $categories["300-399: Business"]++ }
    elseif ($num -ge 400 -and $num -lt 500) { $categories["400-499: AI & ML"]++ }
    elseif ($num -ge 500 -and $num -lt 600) { $categories["500-599: Testing"]++ }
    elseif ($num -ge 600 -and $num -lt 700) { $categories["600-699: Education"]++ }
    elseif ($num -ge 700 -and $num -lt 800) { $categories["700-799: Science"]++ }
    elseif ($num -ge 800 -and $num -lt 900) { $categories["800-899: Leadership"]++ }
    elseif ($num -ge 900 -and $num -lt 1000) { $categories["900-999: Legal"]++ }
}

foreach ($cat in $categories.Keys | Sort-Object) {
    $count = $categories[$cat]
    Write-Host "  $cat : $count personas" -ForegroundColor White
}

$totalPersonas = (Get-ChildItem $communityDir -Filter "*.txt").Count
Write-Host "`nTotal Personas: $totalPersonas" -ForegroundColor Cyan

Write-Host "`n=== Reorganization Completed Successfully! ===" -ForegroundColor Green
