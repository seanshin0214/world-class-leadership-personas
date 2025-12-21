# GPT + ngrok Integration Guide

**Local MCP Persona Server to ChatGPT Custom GPT via ngrok**

이 가이드는 로컬에 설치된 World-Class Leadership Personas MCP 서버를 ngrok을 통해 ChatGPT Custom GPT에서 사용하는 방법을 설명합니다.

---

## 개요

```
┌─────────────────┐     ┌─────────────┐     ┌──────────────────┐
│  ChatGPT GPT    │────▶│   ngrok     │────▶│  Local MCP       │
│  (Actions)      │     │   Tunnel    │     │  HTTP Server     │
└─────────────────┘     └─────────────┘     └──────────────────┘
        │                                            │
        │                                            ▼
        │                                   ┌──────────────────┐
        │                                   │  142+ Personas   │
        │                                   │  Knowledge Base  │
        └───────────────────────────────────┴──────────────────┘
```

---

## 사전 요구사항

1. **Node.js** 18.0.0 이상
2. **ngrok** 계정 및 설치 ([ngrok.com](https://ngrok.com))
3. **World-Class Leadership Personas** 저장소 클론

```bash
git clone https://github.com/seanshin0214/world-class-leadership-personas.git
cd world-class-leadership-personas
npm install
```

---

## 사용 옵션 비교: ngrok vs 로컬 전용

### 어떤 방식을 선택해야 할까?

| 사용 시나리오 | 권장 방식 | 비용 |
|--------------|----------|------|
| Claude Desktop만 사용 | **MCP 직접 연결** (기본) | 무료 |
| ChatGPT에서도 사용 (웹/모바일) | **ngrok 연동** | ngrok 유료 권장 |
| 로컬에서만, RAG 커스터마이징 | **ChromaDB/SQLite** | 무료 |

### 옵션 1: Claude Desktop 전용 (ngrok 불필요)

Claude Desktop만 사용한다면 **ngrok이 필요 없습니다!**

이미 MCP 서버가 로컬에서 직접 연결되어 있습니다:

```json
// claude_desktop_config.json
{
  "mcpServers": {
    "persona-rag": {
      "command": "node",
      "args": ["C:\\path\\to\\dist\\index.js"]
    }
  }
}
```

**장점:**
- 설정이 간단함
- 추가 비용 없음
- 네트워크 지연 없음

---

### 옵션 2: 로컬 RAG with ChromaDB/SQLite

자체 RAG 시스템을 구축하고 싶다면 로컬 벡터 DB를 사용할 수 있습니다:

**ChromaDB 사용 예시:**

```bash
# ChromaDB 설치
pip install chromadb
```

```python
# 로컬 ChromaDB RAG 서버
import chromadb
from chromadb.config import Settings

# 로컬 영구 저장소
client = chromadb.Client(Settings(
    chroma_db_impl="duckdb+parquet",
    persist_directory="./persona_knowledge_db"
))

# 컬렉션 생성
collection = client.get_or_create_collection(
    name="personas",
    metadata={"hnsw:space": "cosine"}
)

# 페르소나 지식 추가
collection.add(
    documents=["페르소나 지식 내용..."],
    metadatas=[{"persona_id": "101-software-engineer"}],
    ids=["doc1"]
)

# 검색
results = collection.query(
    query_texts=["소프트웨어 아키텍처"],
    n_results=5
)
```

**SQLite 사용 예시 (간단한 키워드 검색):**

```javascript
// sqlite-rag.js
const Database = require('better-sqlite3');
const db = new Database('./personas.db');

// 테이블 생성
db.exec(`
  CREATE TABLE IF NOT EXISTS knowledge (
    id INTEGER PRIMARY KEY,
    persona_id TEXT,
    content TEXT,
    keywords TEXT
  )
`);

// 검색
const search = db.prepare(`
  SELECT * FROM knowledge
  WHERE content LIKE ? OR keywords LIKE ?
  LIMIT 10
`);
const results = search.all('%query%', '%query%');
```

**장점:**
- 완전 무료
- 인터넷 연결 불필요
- 데이터 완전 로컬 보관
- 커스터마이징 자유도 높음

**단점:**
- 직접 구현 필요
- ChatGPT에서 사용 불가 (Claude Desktop 전용)

---

### 옵션 3: ngrok으로 ChatGPT 연동

**ChatGPT(웹/모바일)에서도 페르소나를 사용하고 싶다면** ngrok이 필요합니다.

아래 가이드를 따라 설정하세요.

---

## Step 1: HTTP API 서버 설정

MCP 서버를 HTTP API로 노출하기 위한 래퍼 서버를 생성합니다.

### `http-server.js` 생성

```javascript
// http-server.js
const http = require('http');
const { spawn } = require('child_process');

const PORT = process.env.PORT || 3000;

// MCP 서버 프로세스 시작
const mcpProcess = spawn('node', ['dist/index.js'], {
  stdio: ['pipe', 'pipe', 'inherit']
});

// JSON-RPC 요청 ID 관리
let requestId = 0;
const pendingRequests = new Map();

// MCP 응답 처리
let buffer = '';
mcpProcess.stdout.on('data', (data) => {
  buffer += data.toString();
  const lines = buffer.split('\n');
  buffer = lines.pop() || '';

  for (const line of lines) {
    if (line.trim()) {
      try {
        const response = JSON.parse(line);
        const pending = pendingRequests.get(response.id);
        if (pending) {
          pending.resolve(response);
          pendingRequests.delete(response.id);
        }
      } catch (e) {
        console.error('Parse error:', e);
      }
    }
  }
});

// MCP에 요청 보내기
function sendMcpRequest(method, params) {
  return new Promise((resolve, reject) => {
    const id = ++requestId;
    const request = { jsonrpc: '2.0', id, method, params };

    pendingRequests.set(id, { resolve, reject });
    mcpProcess.stdin.write(JSON.stringify(request) + '\n');

    // 타임아웃 30초
    setTimeout(() => {
      if (pendingRequests.has(id)) {
        pendingRequests.delete(id);
        reject(new Error('Request timeout'));
      }
    }, 30000);
  });
}

// HTTP 서버
const server = http.createServer(async (req, res) => {
  // CORS 헤더
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // API 라우팅
  const url = new URL(req.url, `http://localhost:${PORT}`);

  try {
    // GET /personas - 모든 페르소나 목록
    if (url.pathname === '/personas' && req.method === 'GET') {
      const result = await sendMcpRequest('tools/call', {
        name: 'list_personas',
        arguments: {}
      });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
      return;
    }

    // GET /personas/:id - 특정 페르소나 정보
    if (url.pathname.startsWith('/personas/') && req.method === 'GET') {
      const personaId = url.pathname.split('/')[2];
      const result = await sendMcpRequest('tools/call', {
        name: 'get_persona',
        arguments: { persona_id: personaId }
      });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
      return;
    }

    // POST /search - 지식 검색
    if (url.pathname === '/search' && req.method === 'POST') {
      let body = '';
      for await (const chunk of req) body += chunk;
      const { query, persona_id, n_results } = JSON.parse(body);

      const result = await sendMcpRequest('tools/call', {
        name: persona_id ? 'search_by_persona' : 'search_persona_knowledge',
        arguments: persona_id
          ? { query, persona_id, n_results: n_results || 5 }
          : { query, n_results: n_results || 5 }
      });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
      return;
    }

    // POST /ask - 페르소나에게 질문
    if (url.pathname === '/ask' && req.method === 'POST') {
      let body = '';
      for await (const chunk of req) body += chunk;
      const { persona_id, question } = JSON.parse(body);

      // 페르소나 지식 검색
      const knowledge = await sendMcpRequest('tools/call', {
        name: 'search_by_persona',
        arguments: { query: question, persona_id, n_results: 5 }
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        persona_id,
        question,
        knowledge: knowledge.result || knowledge,
        instruction: `Use the knowledge above to answer as ${persona_id}`
      }));
      return;
    }

    // GET /stats - 통계
    if (url.pathname === '/stats' && req.method === 'GET') {
      const result = await sendMcpRequest('tools/call', {
        name: 'get_persona_stats',
        arguments: {}
      });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
      return;
    }

    // 404
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));

  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: error.message }));
  }
});

server.listen(PORT, () => {
  console.log(`HTTP API Server running on http://localhost:${PORT}`);
  console.log('\nEndpoints:');
  console.log('  GET  /personas       - List all personas');
  console.log('  GET  /personas/:id   - Get persona details');
  console.log('  POST /search         - Search knowledge');
  console.log('  POST /ask            - Ask a persona');
  console.log('  GET  /stats          - Get statistics');
});

// Graceful shutdown
process.on('SIGINT', () => {
  mcpProcess.kill();
  process.exit(0);
});
```

---

## Step 2: ngrok 설정

### ⚠️ 중요: ngrok 무료 vs 유료 계정

| 기능 | 무료 (Free) | 유료 (Personal $8/월~) |
|------|-------------|------------------------|
| **URL** | 매번 랜덤 변경 | **고정 도메인** 사용 가능 |
| **GPT Actions 업데이트** | **매번 필요** | 한 번만 설정 |
| **세션 시간** | 2시간 제한 | 무제한 |
| **동시 터널** | 1개 | 3개+ |
| **대역폭** | 1GB/월 | 무제한 |

### 🔴 무료 계정 사용 시 주의사항

**무료 계정은 ngrok을 재시작할 때마다 URL이 변경됩니다!**

```
# 첫 번째 실행
Forwarding    https://abc123.ngrok.io -> localhost:3000

# 두 번째 실행 (URL 변경됨!)
Forwarding    https://xyz789.ngrok.io -> localhost:3000
```

**이 경우 매번 해야 할 작업:**
1. 새 ngrok URL 복사
2. ChatGPT Custom GPT 편집 페이지 이동
3. Actions > OpenAPI 스키마의 `servers.url` 업데이트
4. 저장 및 테스트

### 🟢 유료 계정 권장 (생산성 향상)

유료 계정($8/월~)을 사용하면:
- **고정 도메인**: `your-name.ngrok.io` 형태의 영구 URL
- **한 번만 설정**: GPT Actions를 다시 수정할 필요 없음
- **항상 접속 가능**: 세션 시간 제한 없음

**비용 대비 효과**: 매번 URL 업데이트하는 시간 vs $8/월

---

### 2.1 ngrok 설치 및 인증

```bash
# Windows (Chocolatey)
choco install ngrok

# macOS (Homebrew)
brew install ngrok

# 또는 직접 다운로드: https://ngrok.com/download
```

### 2.2 ngrok 계정 생성 및 인증

1. https://ngrok.com 에서 계정 생성 (무료 또는 유료)
2. Dashboard에서 Auth Token 복사
3. 터미널에서 인증:

```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

### 2.3 ngrok 시작 스크립트 생성

```bash
# start-gpt-server.sh (Linux/macOS)
#!/bin/bash
npm run build
node http-server.js &
sleep 2
ngrok http 3000
```

```powershell
# start-gpt-server.ps1 (Windows)
npm run build
Start-Process -NoNewWindow node -ArgumentList "http-server.js"
Start-Sleep -Seconds 2
ngrok http 3000
```

---

## Step 3: ChatGPT Custom GPT Actions 설정

### 3.1 OpenAPI 스키마

ngrok URL이 `https://abc123.ngrok.io`라고 가정:

```yaml
openapi: 3.1.0
info:
  title: World-Class Leadership Personas API
  version: 1.0.0
  description: Access 142+ World-Class expert personas for strategic decision making
servers:
  - url: https://abc123.ngrok.io
    description: ngrok tunnel to local MCP server

paths:
  /personas:
    get:
      operationId: listPersonas
      summary: List all available personas
      responses:
        '200':
          description: List of personas
          content:
            application/json:
              schema:
                type: object

  /personas/{persona_id}:
    get:
      operationId: getPersona
      summary: Get details of a specific persona
      parameters:
        - name: persona_id
          in: path
          required: true
          schema:
            type: string
          description: "Persona ID (e.g., 101-software-engineer)"
      responses:
        '200':
          description: Persona details
          content:
            application/json:
              schema:
                type: object

  /search:
    post:
      operationId: searchKnowledge
      summary: Search persona knowledge base
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - query
              properties:
                query:
                  type: string
                  description: Search query
                persona_id:
                  type: string
                  description: "Optional: Filter by persona ID"
                n_results:
                  type: integer
                  default: 5
                  description: Number of results to return
      responses:
        '200':
          description: Search results
          content:
            application/json:
              schema:
                type: object

  /ask:
    post:
      operationId: askPersona
      summary: Ask a question to a specific persona
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - persona_id
                - question
              properties:
                persona_id:
                  type: string
                  description: "Persona ID (e.g., 410-llm-engineer)"
                question:
                  type: string
                  description: Question to ask
      responses:
        '200':
          description: Persona response with relevant knowledge
          content:
            application/json:
              schema:
                type: object

  /stats:
    get:
      operationId: getStats
      summary: Get knowledge base statistics
      responses:
        '200':
          description: Statistics
          content:
            application/json:
              schema:
                type: object
```

### 3.2 GPT Instructions

Custom GPT의 Instructions에 다음을 추가:

```markdown
You have access to the World-Class Leadership Personas API via Actions.

## Available Actions:
1. **listPersonas** - Show all 142+ expert personas
2. **getPersona** - Get details about a specific persona
3. **searchKnowledge** - Search the knowledge base
4. **askPersona** - Get knowledge from a specific persona

## How to Use:
1. When user asks a question, first use `searchKnowledge` to find relevant expertise
2. If a specific domain is identified, use `askPersona` with the appropriate persona_id
3. Always cite which persona's knowledge you're using

## Persona Categories:
- 100-199: Engineering & Development
- 200-299: Design & Creative
- 300-399: Business & Strategy
- 400-499: Data, AI & ML
- 600-699: Education
- 700-799: Healthcare
- 800-899: Leadership & Management

## Example persona_ids:
- 101-software-engineer
- 201-ui-ux-designer
- 327-cto
- 410-llm-engineer
- 602-professor
```

---

## Step 4: 실행 방법

### 4.1 서버 시작

```bash
# 1. 빌드
npm run build

# 2. HTTP 서버 시작
node http-server.js

# 3. 새 터미널에서 ngrok 시작
ngrok http 3000
```

### 4.2 ngrok URL 확인

ngrok 실행 후 표시되는 URL을 복사:

```
Forwarding    https://abc123.ngrok.io -> http://localhost:3000
```

### 4.3 GPT Actions 업데이트

1. ChatGPT에서 Custom GPT 편집
2. Actions 섹션으로 이동
3. OpenAPI 스키마의 `servers.url`을 ngrok URL로 업데이트
4. 저장

---

## 영구 URL 설정 (유료 계정 필수)

### 왜 유료 계정이 필요한가?

**무료 계정의 문제점:**
- ngrok 재시작 시 URL이 변경됨
- GPT Actions를 매번 업데이트해야 함
- 2시간마다 세션 만료
- 실제 사용 시 매우 불편함

### ngrok 유료 플랜 가격 (2024년 기준)

| 플랜 | 가격 | 고정 도메인 | 추천 |
|------|------|-------------|------|
| Free | $0 | X | 테스트용 |
| Personal | $8/월 | 1개 | **개인 사용 추천** |
| Pro | $20/월 | 2개 | 팀 사용 |
| Enterprise | 문의 | 무제한 | 기업 |

### 유료 계정 설정 방법

**1. ngrok 유료 플랜 구독**
- https://dashboard.ngrok.com/billing 에서 플랜 선택

**2. 고정 도메인 생성**
- https://dashboard.ngrok.com/cloud-edge/domains
- "New Domain" 클릭
- 도메인 이름 선택 (예: `my-personas.ngrok.io`)

**3. 고정 도메인으로 실행**

```bash
ngrok http 3000 --domain=my-personas.ngrok.io
```

**4. ngrok.yml 설정 파일 (자동화)**

`~/.ngrok2/ngrok.yml` 파일:

```yaml
version: 2
authtoken: YOUR_AUTH_TOKEN
tunnels:
  personas:
    proto: http
    addr: 3000
    domain: my-personas.ngrok.io
```

이후 간단히 실행:
```bash
ngrok start personas
```

### GPT Actions에 고정 URL 설정

```yaml
servers:
  - url: https://my-personas.ngrok.io  # 영구 고정!
    description: Fixed ngrok domain for persona API
```

**이제 ngrok을 재시작해도 GPT Actions를 수정할 필요가 없습니다!**

---

## 보안 고려사항

### API 키 인증 추가 (권장)

`http-server.js`에 인증 추가:

```javascript
const API_KEY = process.env.PERSONA_API_KEY || 'your-secret-key';

// 요청 처리 전 인증 확인
if (req.headers['x-api-key'] !== API_KEY) {
  res.writeHead(401, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Unauthorized' }));
  return;
}
```

GPT Actions에서 Authentication 설정:
- Type: API Key
- Auth Type: Custom
- Custom Header Name: `x-api-key`

---

## 문제 해결

### ngrok 연결 안됨

```bash
# ngrok 상태 확인
ngrok diagnose

# 방화벽 확인 (Windows)
netsh advfirewall firewall show rule name="ngrok"
```

### MCP 서버 오류

```bash
# 빌드 확인
npm run build

# 직접 테스트
node dist/index.js
```

### GPT Actions 오류

1. ngrok URL이 최신인지 확인
2. OpenAPI 스키마 문법 검증
3. GPT Actions 테스트 버튼으로 각 엔드포인트 테스트

---

## 관련 문서

- [README.md](../README.md) - 프로젝트 개요
- [INSTALL.md](../INSTALL.md) - 설치 가이드
- [gpt-knowledge/README.md](../gpt-knowledge/README.md) - GPT 지식 파일
- [TECHNICAL_SPEC.md](../TECHNICAL_SPEC.md) - 기술 사양

---

**Last Updated**: 2025-12-21
**Version**: 1.0.0
**Author**: World-Class Leadership Personas Team
