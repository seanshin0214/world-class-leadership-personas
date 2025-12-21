# RAG (Retrieval-Augmented Generation) Server

로컬에서 페르소나 지식을 벡터 검색하기 위한 ChromaDB 기반 RAG 서버입니다.

## 개요

이 RAG 서버는:
- **ChromaDB**를 사용한 벡터 검색
- **142개 페르소나**의 지식 베이스 인덱싱
- **시맨틱 검색**으로 관련 전문 지식 검색
- **로컬 전용** - 모든 데이터가 내 컴퓨터에 저장

## 설치

### 1. Python 의존성 설치

```bash
pip install chromadb sentence-transformers
```

### 2. 지식 베이스 인덱싱

```bash
cd rag
python data_loader.py
```

이 명령은 `knowledge-base/` 폴더의 모든 마크다운 파일을 청크로 분할하여 ChromaDB에 저장합니다.

## 파일 구조

```
rag/
├── README.md           # 이 문서
├── server.py           # MCP RAG 서버
├── vector_store.py     # ChromaDB 벡터 스토어 래퍼
├── data_loader.py      # 지식 베이스 로더
└── data/               # ChromaDB 데이터 (자동 생성, .gitignore)
    └── chroma.sqlite3
```

## 사용 방법

### Claude Desktop 설정

`claude_desktop_config.json`에 추가:

```json
{
  "mcpServers": {
    "persona-rag": {
      "command": "python",
      "args": ["C:\\path\\to\\world-class-leadership-personas\\rag\\server.py"],
      "env": {
        "PYTHONUNBUFFERED": "1",
        "PYTHONIOENCODING": "utf-8"
      }
    }
  }
}
```

### 검색 예시

```
You: "FastAPI에서 JWT 인증 구현 방법"
AI: [RAG 검색 후 101-software-engineer, 102-backend-engineer 지식 활용]
```

## 개인화된 지식 베이스 구축

### 1. 나만의 지식 추가

`knowledge-base/` 폴더에 마크다운 파일 추가:

```markdown
# my-custom-knowledge/core-competencies/my-expertise-2025.md

## 내 전문 분야

### 섹션 1
- 나만의 노하우
- 실무 경험

### 섹션 2
...
```

### 2. 재인덱싱

```bash
python data_loader.py --rebuild
```

### 3. 검색 확인

```bash
python -c "
from vector_store import PersonaVectorStore
store = PersonaVectorStore()
results = store.search('내 전문 분야', n_results=3)
print(results)
"
```

## 청크 분할 전략

- **청크 크기**: 1500자 (컨텍스트 최적화)
- **오버랩**: 200자 (연속성 유지)
- **분할 기준**: 마크다운 헤더 (`##`, `###`)

## 임베딩 모델

기본: `sentence-transformers/all-MiniLM-L6-v2`

다른 모델로 변경:
```python
# vector_store.py
EMBEDDING_MODEL = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"  # 다국어
```

## 트러블슈팅

### ChromaDB 설치 오류

```bash
# Windows에서 Visual C++ Build Tools 필요할 수 있음
pip install --upgrade chromadb
```

### 메모리 부족

```python
# data_loader.py - 배치 크기 조정
BATCH_SIZE = 50  # 기본 100에서 줄임
```

### 검색 결과 없음

```bash
# 인덱스 재구축
rm -rf rag/data
python data_loader.py
```

## 성능 팁

1. **SSD 사용 권장** - ChromaDB 읽기/쓰기 속도
2. **첫 로딩 시간** - 임베딩 모델 다운로드로 시간 소요
3. **메모리** - 최소 4GB RAM 권장

---

**Last Updated**: 2025-12-21
