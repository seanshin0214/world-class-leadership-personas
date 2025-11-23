# 📝 지식 베이스 작업 워크플로우

**전략**: Git에 직접 포함 (사용자가 clone 시 자동 다운로드)

---

## 🎯 기본 워크플로우

### 1. 로컬에서 지식 베이스 작성/수정

```bash
# 새 문서 작성
code knowledge-base/410-llm-engineer/core-competencies/prompt-engineering.md

# 기존 문서 수정
code knowledge-base/410-llm-engineer/core-competencies/transformer-architectures.md
```

### 2. Git에 커밋

```bash
# 변경사항 확인
git status

# 추가
git add knowledge-base/

# 커밋
git commit -m "feat: Add prompt-engineering knowledge base for LLM Engineer

- Covers chain-of-thought, few-shot, zero-shot
- Production examples with Claude, GPT-4
- 40 pages of best practices"

# 푸시
git push origin main
```

### 3. 다른 사용자가 받기

```bash
# 처음 설치
git clone https://github.com/seanshin0214/world-class-leadership-personas.git
# → knowledge-base/ 자동 다운로드 ✅

# 업데이트
git pull origin main
# → 최신 지식 베이스 자동 동기화 ✅
```

---

## 📏 크기 관리 전략

### GitHub 제약사항
```yaml
단일 파일: 100MB 이하 (권장 50MB)
저장소 전체: 1GB 권장, 5GB 경고
```

### 우리의 목표
```yaml
페르소나당: 10-50MB (관리 가능)
우선순위 10개: 500MB (단계적 추가)
전체 142개: 5-7GB (장기 목표)
```

### 단계별 추가 계획

#### Phase 1 (현재 - 1개월)
```
10개 핵심 페르소나 × 50MB = 500MB

✅ 410-llm-engineer (100MB)
   ├── core-competencies/ (50MB)
   │   ├── transformer-architectures.md (20MB) ✅
   │   ├── prompt-engineering.md (30MB) ⏳
   ├── case-studies/ (20MB)
   ├── code-examples/ (15MB)
   └── research-papers/ (15MB)

⏳ 108-devops-engineer (50MB)
⏳ 201-ui-ux-designer (40MB)
⏳ 223-ux-researcher (30MB)
⏳ 326-strategic-oracle (60MB)
⏳ 337-scrum-master (30MB)
⏳ 411-ai-agent-developer (50MB)
⏳ 501-world-class-tester (40MB)
⏳ 601-science-teacher (50MB)
⏳ 701-research-scientist (50MB)

총계: 500MB (GitHub 여유 범위)
```

#### Phase 2 (2-3개월)
```
30개 페르소나 × 40MB = 1.2GB
→ Git LFS 고려 시점
```

#### Phase 3 (6개월)
```
142개 전체 × 50MB = 7GB
→ Git LFS 필수
```

---

## 🛠️ 실제 사용 예시

### 새 문서 작성

```bash
# 1. 폴더 구조 생성
mkdir -p knowledge-base/410-llm-engineer/case-studies

# 2. 문서 작성 (예: GPT-4 배포 사례)
cat > knowledge-base/410-llm-engineer/case-studies/gpt4-deployment.md << 'EOF'
# GPT-4 Enterprise Deployment Case Study

## Company: Fortune 500 Financial Institution

### Challenge
- Process 100K+ customer inquiries/day
- Reduce response time from 24h to <1h
- Maintain 95%+ accuracy

### Solution
[40 pages of detailed case study...]
EOF

# 3. Git 추가
git add knowledge-base/410-llm-engineer/case-studies/gpt4-deployment.md

# 4. 커밋
git commit -m "feat: Add GPT-4 deployment case study

Real-world example from Fortune 500 company
- 100K requests/day handling
- 24h → 1h response time improvement
- Architecture, costs, lessons learned"

# 5. 푸시
git push origin main
```

### 기존 문서 수정

```bash
# 1. 문서 수정
code knowledge-base/410-llm-engineer/core-competencies/transformer-architectures.md
# (Flash Attention 3 섹션 추가)

# 2. 변경사항 확인
git diff knowledge-base/410-llm-engineer/core-competencies/transformer-architectures.md

# 3. 커밋
git add knowledge-base/410-llm-engineer/core-competencies/transformer-architectures.md
git commit -m "docs: Update transformer-architectures with Flash Attention 3

- Add Flash Attention 3 benchmarks
- Update performance comparison table
- Add Hopper GPU optimizations"

# 4. 푸시
git push origin main
```

---

## 📊 폴더 크기 모니터링

### 현재 크기 확인

```bash
# 전체 knowledge-base 크기
du -sh knowledge-base/
# 또는 PowerShell
(Get-ChildItem -Path knowledge-base -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB

# 페르소나별 크기
du -sh knowledge-base/*/
# 또는 PowerShell
Get-ChildItem -Path knowledge-base -Directory | ForEach-Object {
    $size = (Get-ChildItem -Path $_.FullName -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    [PSCustomObject]@{
        Persona = $_.Name
        Size_MB = [math]::Round($size, 2)
    }
} | Sort-Object Size_MB -Descending
```

### Git 저장소 크기 확인

```bash
# 전체 저장소 크기
git count-objects -vH

# knowledge-base만 크기
git ls-files knowledge-base/ | xargs -I {} du -h {} | awk '{sum+=$1} END {print sum " MB"}'
```

---

## ⚠️ 크기 제한 도달 시 대응

### 방법 1: Git LFS로 마이그레이션 (권장)

```bash
# 1. Git LFS 설치
git lfs install

# 2. knowledge-base 추적
git lfs track "knowledge-base/**/*.md"
git add .gitattributes

# 3. 기존 파일을 LFS로 마이그레이션
git lfs migrate import --include="knowledge-base/**/*.md" --everything

# 4. 푸시
git push origin main --force
```

**장점**: 투명하게 작동 (사용자는 차이를 느끼지 못함)
**비용**: GitHub LFS $5/월 (50GB)

### 방법 2: 압축 (임시 방편)

```bash
# 이미지/미디어 최적화
find knowledge-base/ -name "*.png" -exec pngquant --ext .png --force {} \;

# Markdown 파일 압축 (가독성 유지)
# (불필요한 공백 제거 등)
```

### 방법 3: 외부 스토리지로 분리

```bash
# 대용량 파일만 별도 관리
knowledge-base-large/ (Git LFS or Cloud)
knowledge-base/ (일반 Git)
```

---

## 🚀 협업 워크플로우

### 여러 사람이 동시에 작업

```bash
# 작업 시작 전 최신 상태로
git pull origin main

# 브랜치 생성 (충돌 방지)
git checkout -b knowledge/410-llm-engineer-updates

# 작업
code knowledge-base/410-llm-engineer/...

# 커밋
git add knowledge-base/
git commit -m "feat: Add deployment strategies section"

# Pull Request 생성
git push origin knowledge/410-llm-engineer-updates
# GitHub에서 PR 생성
```

### 충돌 해결

```bash
# 최신 main 가져오기
git fetch origin main
git merge origin/main

# 충돌 발생 시 수동 해결
code knowledge-base/410-llm-engineer/...  # 충돌 부분 수정

# 해결 후 커밋
git add knowledge-base/
git commit -m "merge: Resolve conflicts in transformer-architectures.md"
git push origin knowledge/410-llm-engineer-updates
```

---

## 📝 커밋 메시지 규칙

### 타입
```
feat: 새 지식 베이스 추가
docs: 기존 문서 업데이트
fix: 오류 수정
refactor: 구조 개선
perf: 크기 최적화
```

### 예시
```bash
# 좋은 예
git commit -m "feat: Add prompt engineering best practices

- 80 pages of comprehensive guide
- Covers CoT, few-shot, zero-shot
- Production examples with GPT-4, Claude"

# 나쁜 예
git commit -m "Update files"
```

---

## 🎯 품질 체크리스트

새 지식 베이스 추가 전 확인:

- [ ] **정확성**: 사실 확인, 참고 문헌 인용
- [ ] **깊이**: 단순 요약 아닌 상세 설명
- [ ] **실용성**: 코드 예시, 실제 사례 포함
- [ ] **구조**: 목차, 섹션 구분 명확
- [ ] **최신성**: 날짜 기록, 최신 정보 반영
- [ ] **크기**: 50MB 이하 (단일 파일)
- [ ] **포맷**: Markdown, UTF-8 인코딩
- [ ] **링크**: 외부 참조 유효성 확인

---

## 📈 진행 상황 추적

### 체크리스트

```markdown
## 410-llm-engineer (100MB)

### Core Competencies (50MB)
- [x] transformer-architectures.md (20MB) - 2025-11-23
- [ ] prompt-engineering.md (30MB)

### Case Studies (20MB)
- [ ] gpt4-deployment.md (5MB)
- [ ] llama-fine-tuning.md (5MB)
- [ ] claude-optimization.md (5MB)
- [ ] bert-production.md (5MB)

### Code Examples (15MB)
- [ ] quantization/ (5MB)
- [ ] prompt-templates/ (5MB)
- [ ] inference-optimization/ (5MB)

### Research Papers (15MB)
- [ ] attention-is-all-you-need.md (3MB)
- [ ] flash-attention.md (3MB)
- [ ] rag-papers.md (3MB)
- [ ] llama-architecture.md (3MB)
- [ ] gpt4-technical-report.md (3MB)

**Progress**: 20% (20MB / 100MB)
**Next**: prompt-engineering.md (30 pages)
```

---

## 🔄 자동화 (향후)

### Git Hooks로 자동 검증

```bash
# .git/hooks/pre-commit
#!/bin/bash

# 파일 크기 체크
for file in $(git diff --cached --name-only | grep "knowledge-base/"); do
  size=$(du -m "$file" | cut -f1)
  if [ $size -gt 50 ]; then
    echo "Error: $file is too large ($size MB > 50 MB)"
    exit 1
  fi
done

# 총 저장소 크기 체크
total=$(du -sm knowledge-base/ | cut -f1)
if [ $total -gt 1000 ]; then
  echo "Warning: knowledge-base is getting large ($total MB)"
  echo "Consider migrating to Git LFS"
fi
```

---

## ✅ 요약

**현재 상태**:
- ✅ knowledge-base/가 Git에 포함됨
- ✅ 사용자가 clone 시 자동 다운로드
- ✅ 로컬 업데이트 → Git 커밋 → 푸시

**작업 흐름**:
```
로컬 작성 → git add → git commit → git push
       ↓
다른 사용자: git clone 또는 git pull → 자동 동기화
```

**다음 작업**:
1. prompt-engineering.md 작성 (30MB)
2. 10개 핵심 페르소나 완성 (500MB)
3. 1GB 도달 시 Git LFS 검토
