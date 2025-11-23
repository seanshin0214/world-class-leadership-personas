# 📚 지식 베이스 저장 전략

**결론**: 3단계 하이브리드 접근

---

## 🎯 전략 개요

### Tier 1: Git Repository (예시 + 문서)
**용량**: ~20MB
**목적**: 사용자가 즉시 이해할 수 있도록

```
knowledge-base-samples/
├── 410-llm-engineer/
│   ├── core-competencies/
│   │   └── transformer-architectures.md (20 pages) ✅ Git
│   └── README.md (어떻게 사용하는지)
└── README.md (전체 지식 베이스 개요)
```

**Git에 포함**:
- ✅ 각 페르소나당 1-2개 대표 문서 (예시)
- ✅ 구조 및 사용법 문서
- ✅ 메타데이터 (manifest.json)

### Tier 2: Google Drive / S3 (전체 지식 베이스)
**용량**: 14.2GB (142 personas × 100MB)
**목적**: 프로덕션 사용

```
knowledge-base-full.zip (14.2GB)
└── 410-llm-engineer/ (100MB)
    ├── core-competencies/ (50MB)
    ├── case-studies/ (20MB)
    ├── code-examples/ (15MB)
    ├── research-papers/ (10MB)
    └── best-practices/ (5MB)
```

**다운로드 링크**:
```bash
# 자동 설치 스크립트
npm run install-knowledge-base

# 또는 수동
curl -L https://drive.google.com/uc?id=FILE_ID -o kb.zip
unzip kb.zip -d knowledge-base/
```

### Tier 3: 자동 생성 (선택사항)
**용량**: 0 (생성 시점 크롤링)
**목적**: 항상 최신 유지

```bash
# 특정 페르소나만 생성
npm run build-kb -- --persona 410-llm-engineer

# 모두 생성 (30분 소요)
npm run build-kb -- --all
```

---

## 📁 최종 디렉토리 구조

```
persona-mcp/
├── .gitignore
│   └── knowledge-base/          # 로컬 전체 KB 제외
│       !knowledge-base-samples/ # 예시만 포함
│
├── knowledge-base-samples/ (Git에 포함, 20MB)
│   ├── 410-llm-engineer/
│   │   └── transformer-architectures.md
│   ├── 108-devops-engineer/
│   │   └── ci-cd-best-practices.md
│   └── README.md
│
├── knowledge-base/ (Git 제외, 로컬만, 14.2GB)
│   ├── 410-llm-engineer/ (100MB)
│   ├── 108-devops-engineer/ (80MB)
│   └── ... (142개, 사용자가 다운로드)
│
├── knowledge-base-manifest.json (Git에 포함)
│   └── 다운로드 링크, 체크섬
│
└── scripts/
    ├── download-knowledge-base.js
    └── build-knowledge-base.js
```

---

## 🛠️ .gitignore 설정

```gitignore
# Knowledge Base (로컬만)
knowledge-base/

# 예외: 샘플은 포함
!knowledge-base-samples/

# 벡터 DB (로컬만)
.chroma/
*.faiss

# Node modules
node_modules/
```

---

## 📦 knowledge-base-manifest.json

```json
{
  "version": "3.1.0",
  "updated": "2025-11-23",
  "total_size": "14.2 GB",
  "personas": {
    "410-llm-engineer": {
      "size": "102.4 MB",
      "chunks": 50000,
      "documents": 523,
      "sources": [
        "https://drive.google.com/uc?id=1ABC123/410-llm-engineer.zip",
        "https://huggingface.co/datasets/personas/410-llm-engineer"
      ],
      "checksum": "sha256:abc123...",
      "sample_included": true,
      "sample_path": "knowledge-base-samples/410-llm-engineer/"
    },
    "108-devops-engineer": {
      "size": "78.5 MB",
      "chunks": 39250,
      "documents": 412,
      "sources": ["..."],
      "checksum": "sha256:def456..."
    }
  },
  "download_instructions": {
    "automatic": "npm run install-knowledge-base",
    "manual": "curl -L [url] -o kb.zip && unzip kb.zip",
    "selective": "npm run install-kb -- --persona 410"
  }
}
```

---

## 🚀 사용자 워크플로우

### 첫 설치 (빠른 시작)
```bash
# 1. Git 클론 (샘플 포함, 50MB)
git clone https://github.com/seanshin0214/world-class-leadership-personas.git
cd world-class-leadership-personas

# 2. 의존성 설치
npm install

# 3. 샘플로 즉시 테스트 가능! ✅
npm run dev
# → knowledge-base-samples/ 사용 (20MB, Git에서 다운로드됨)

# 4. (선택) 전체 KB 다운로드 (프로덕션용)
npm run install-knowledge-base
# → knowledge-base/ 생성 (14.2GB, Google Drive에서 다운로드)
```

### 선택적 다운로드
```bash
# 특정 페르소나만 (추천)
npm run install-kb -- --persona 410-llm-engineer
# → 100MB만 다운로드

# 여러 페르소나
npm run install-kb -- --personas 410,108,201
# → 300MB 다운로드

# 전체 (프로덕션)
npm run install-kb -- --all
# → 14.2GB 다운로드
```

---

## 💾 scripts/download-knowledge-base.js

```javascript
#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream/promises');
const unzipper = require('unzipper');

async function downloadKnowledgeBase(personaId = null) {
  const manifest = require('../knowledge-base-manifest.json');
  
  const toDownload = personaId 
    ? [manifest.personas[personaId]]
    : Object.values(manifest.personas);
  
  console.log(`Downloading ${toDownload.length} persona knowledge bases...`);
  
  for (const persona of toDownload) {
    console.log(`\nDownloading ${persona.id}... (${persona.size})`);
    
    const url = persona.sources[0];
    const zipPath = path.join(__dirname, `../temp/${persona.id}.zip`);
    const extractPath = path.join(__dirname, `../knowledge-base/${persona.id}`);
    
    // Download
    await downloadFile(url, zipPath);
    
    // Verify checksum
    const actualChecksum = await calculateChecksum(zipPath);
    if (actualChecksum !== persona.checksum) {
      throw new Error(`Checksum mismatch for ${persona.id}`);
    }
    
    // Extract
    await extractZip(zipPath, extractPath);
    
    // Cleanup
    fs.unlinkSync(zipPath);
    
    console.log(`✓ ${persona.id} installed`);
  }
  
  console.log('\n✅ Knowledge base installation complete!');
}

async function downloadFile(url, dest) {
  const file = fs.createWriteStream(dest);
  
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Follow redirect
        return downloadFile(response.headers.location, dest)
          .then(resolve)
          .catch(reject);
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest);
      reject(err);
    });
  });
}

async function extractZip(zipPath, destPath) {
  await fs.createReadStream(zipPath)
    .pipe(unzipper.Extract({ path: destPath }))
    .promise();
}

async function calculateChecksum(filePath) {
  const crypto = require('crypto');
  const hash = crypto.createHash('sha256');
  const stream = fs.createReadStream(filePath);
  
  return new Promise((resolve, reject) => {
    stream.on('data', (data) => hash.update(data));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}

// CLI
const args = process.argv.slice(2);
const personaId = args.includes('--persona') 
  ? args[args.indexOf('--persona') + 1] 
  : null;

downloadKnowledgeBase(personaId)
  .catch(console.error);
```

---

## 📊 비용 비교

### Git LFS
```
Storage: $5/월 for 50GB
Bandwidth: $0.0875/GB
예상 비용: $10-20/월
```

### Google Drive (추천)
```
무료: 15GB
Google One: $2/월 for 100GB
→ 예상 비용: $2/월 또는 무료
```

### AWS S3
```
Storage: $0.023/GB/월 (14.2GB = $0.33/월)
Transfer: $0.09/GB (100GB = $9/월)
→ 예상 비용: ~$10/월
```

### HuggingFace Datasets (추천)
```
무료 무제한!
datasets.load_dataset("personas/410-llm-engineer")
→ 예상 비용: $0
```

---

## ✅ 최종 권장사항

### Phase 1 (현재)
```bash
# Git에 샘플만 포함
knowledge-base-samples/
└── 410-llm-engineer/
    └── transformer-architectures.md ✅ 이미 커밋됨
```

### Phase 2 (다음 단계)
```bash
# Google Drive에 전체 업로드
1. 410-llm-engineer.zip (100MB) 생성
2. Google Drive 공유 링크 생성
3. manifest.json 업데이트
4. download 스크립트 작성
```

### Phase 3 (프로덕션)
```bash
# HuggingFace Datasets로 마이그레이션
from datasets import load_dataset

kb = load_dataset("world-class-personas/410-llm-engineer")
# → 무료, 무제한, 버전 관리, CDN
```

---

**현재 상태**: Git에 샘플 1개 포함 ✅  
**다음 단계**: manifest.json + download 스크립트 작성  
**최종 목표**: HuggingFace Datasets 호스팅
