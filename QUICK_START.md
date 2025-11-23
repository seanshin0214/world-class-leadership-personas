# 🚀 빠른 시작 가이드

## 다른 사람이 처음 사용할 때

### 1. 저장소 클론 (지식 베이스 자동 다운로드)

```bash
git clone https://github.com/seanshin0214/world-class-leadership-personas.git
cd world-class-leadership-personas
```

**결과**: 
- ✅ 페르소나 메타데이터 (community/)
- ✅ MCP 서버 코드 (src/)
- ✅ **지식 베이스 (knowledge-base/)** ← 자동 포함!

### 2. 지식 베이스 확인

```bash
# 현재 포함된 지식 베이스
ls knowledge-base/

# 출력:
410-llm-engineer/
  └── core-competencies/
      └── transformer-architectures.md (20 pages) ✅
```

### 3. MCP 서버 실행

```bash
npm install
npm run dev
```

**이제 Claude Desktop에서 사용 가능!**

---

## 지식 베이스 업데이트 받기

### 다른 사람이 새 지식 추가했을 때

```bash
# 최신 지식 베이스 다운로드
git pull origin main

# 예시 출력:
Updating 40a527a..52e3007
Fast-forward
 knowledge-base/410-llm-engineer/core-competencies/prompt-engineering.md | 1200 ++++
 1 file changed, 1200 insertions(+)
```

**자동으로 동기화됨!** ✅

---

## 지식 베이스에 기여하기

### 새 문서 추가

```bash
# 1. 문서 작성
mkdir -p knowledge-base/410-llm-engineer/case-studies
cat > knowledge-base/410-llm-engineer/case-studies/my-case-study.md << 'EOF'
# My LLM Case Study

[Write your content...]
EOF

# 2. Git 추가
git add knowledge-base/

# 3. 커밋
git commit -m "feat: Add my LLM case study"

# 4. 푸시
git push origin main
```

### 기존 문서 수정

```bash
# 1. 수정
code knowledge-base/410-llm-engineer/core-competencies/transformer-architectures.md

# 2. 커밋
git add knowledge-base/
git commit -m "docs: Update transformer-architectures with new benchmarks"

# 3. 푸시
git push origin main
```

---

## 현재 상태

### 완성된 지식 베이스

```
✅ 410-llm-engineer/
   └── core-competencies/
       └── transformer-architectures.md
           - Multi-Head Attention (수학 증명)
           - Positional Encodings (RoPE, ALiBi)
           - Flash Attention (코드 + 벤치마크)
           - 실제 사례 (LLaMA-2-70B, GPT-4)
           - 20 pages, 프로덕션급 품질
```

### 작업 중

```
⏳ 410-llm-engineer/ (진행률: 20%)
   ├── core-competencies/
   │   ├── transformer-architectures.md ✅
   │   └── prompt-engineering.md ⏳ (다음 작업)
   ├── case-studies/ ⏳
   ├── code-examples/ ⏳
   └── research-papers/ ⏳
```

---

## RAG 작동 테스트

### 시나리오

**질문**: "LLaMA-2-70B 추론 속도 최적화 방법?"

**RAG 검색**:
1. Query 임베딩 생성
2. knowledge-base/410-llm-engineer/ 검색
3. transformer-architectures.md에서 관련 섹션 발견:
   - Flash Attention (3.8x speedup)
   - Multi-Query Attention (8x KV cache reduction)
   - Real benchmarks (A100 GPU)

**응답**:
```
Based on the knowledge base:

1. Use Flash Attention: 3.8x faster, reduces memory O(n²) → O(n)
   [Code example from transformer-architectures.md]

2. Apply Multi-Query Attention: 8x smaller KV cache
   [Specific implementation details]

3. Expected improvement: 9s → 1.8s latency
   [Real benchmark data included]
```

**효과**: 일반적 조언 → 구체적, 코드 포함, 측정 가능한 답변

---

## 워크플로우 요약

```
로컬 작성
    ↓
git add knowledge-base/
    ↓
git commit -m "feat: ..."
    ↓
git push origin main
    ↓
다른 사용자: git pull
    ↓
자동 동기화 ✅
```

---

## 다음 단계

### 단기 (1주일)
- [ ] prompt-engineering.md 작성 (30 pages)
- [ ] case-studies/ 추가 (5개 사례)

### 중기 (1개월)
- [ ] 410-llm-engineer 완성 (100MB)
- [ ] 10개 핵심 페르소나 시작

### 장기 (6개월)
- [ ] 142개 전체 페르소나
- [ ] Git LFS 마이그레이션 (1GB 도달 시)

---

**현재**: Git에서 지식 베이스 직접 관리 중 ✅  
**효과**: Clone 한 번으로 모든 지식 자동 다운로드  
**업데이트**: git pull로 최신 지식 즉시 반영
