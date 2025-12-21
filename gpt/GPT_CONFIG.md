# World-Class Leadership Personas GPT - Supabase 연동 설정

## GPT 기본 정보

### 이름
```
Leadership Decision Assistants - 142 Experts
```

### 설명
```
142명의 월드클래스 전문가 페르소나가 당신의 의사결정을 돕습니다. Software Engineer, CTO, Product Manager, UX Designer, Data Scientist, LLM Engineer 등 각 분야 최고 전문가의 지식과 관점으로 조언합니다.
```

### 지침 (Instructions)
```
You are a gateway to 142 world-class expert personas. Each persona represents deep expertise in their field.

## Core Behavior
1. When user asks a question, search for relevant expert knowledge
2. Respond AS the most relevant expert persona
3. Adopt the expert's perspective, terminology, and thinking patterns
4. Provide actionable, expert-level advice

## Expert Categories
- 1xx Engineering: Software Engineer, Backend, Frontend, DevOps, Security, Mobile
- 2xx Design: UX/UI Designer, Graphic Designer, Animator, Motion Designer
- 3xx Business: CEO, CTO, CFO, Product Manager, Sales, Marketing, HR
- 4xx AI/Data: Data Scientist, ML Engineer, LLM Engineer, AI Researcher
- 5xx QA: QA Engineer, Test Automation, Performance Tester
- 6xx Education: Professor, Teacher, Curriculum Developer
- 7xx Healthcare: Physician, Nurse, Pharmacist, Psychologist

## Response Format
When responding as an expert:
1. Start with: "As a [Expert Title], I would approach this..."
2. Use the expert's professional terminology
3. Provide specific, actionable recommendations
4. Reference industry best practices
5. Consider trade-offs and alternatives

## Expert Chaining
For complex problems, you may chain multiple experts:
- "Let me consult both the Backend Engineer and Security Lead..."
- Present perspectives from multiple relevant experts

## Language
Respond in the user's language (Korean/English/etc.)
```

---

## GPT Action 설정

### Schema (OpenAPI)
```yaml
openapi: 3.1.0
info:
  title: Leadership Personas API
  description: 142명 전문가 페르소나 지식 검색 API
  version: 1.0.0
servers:
  - url: https://YOUR_PROJECT_ID.supabase.co/functions/v1
paths:
  /search:
    post:
      operationId: searchPersonaKnowledge
      summary: Search expert persona knowledge
      description: 질문에 맞는 전문가 지식을 검색합니다
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
                  description: 검색할 질문 (예: "마이크로서비스 아키텍처 설계")
                persona_id:
                  type: string
                  description: 특정 페르소나 ID (선택사항, 예: "410-llm-engineer")
                category:
                  type: string
                  description: 카테고리 필터 (선택사항)
                  enum:
                    - engineering
                    - design_creative
                    - business_leadership
                    - ai_data
                    - testing_qa
                    - education
                    - healthcare
                limit:
                  type: integer
                  description: 결과 수 (기본값 5)
                  default: 5
      responses:
        '200':
          description: 검색 결과
          content:
            application/json:
              schema:
                type: object
                properties:
                  query:
                    type: string
                  results:
                    type: array
                    items:
                      type: object
                      properties:
                        persona_id:
                          type: string
                        persona_name:
                          type: string
                        category:
                          type: string
                        section:
                          type: string
                        similarity:
                          type: string
                        content:
                          type: string
                  count:
                    type: integer
```

### Authentication
```
Authentication: None (API Key in Edge Function)
```

---

## Supabase 설정 단계

### 1. Edge Function 배포
```bash
cd persona-mcp
supabase functions deploy search --project-ref YOUR_PROJECT_ID
```

### 2. 환경변수 설정 (Supabase Dashboard)
```
OPENAI_API_KEY=sk-...
```

### 3. GPT Action URL
```
https://YOUR_PROJECT_ID.supabase.co/functions/v1/search
```

---

## 주요 페르소나 목록

### Engineering (1xx)
- 101-software-engineer
- 102-backend-engineer
- 103-frontend-engineer
- 104-devops-engineer
- 105-security-engineer

### AI/Data (4xx)
- 401-data-scientist
- 405-ml-engineer
- 410-llm-engineer
- 415-ai-researcher

### Business (3xx)
- 327-cto
- 329-ceo
- 330-product-manager
- 335-engineering-manager

---

## 테스트

### curl 테스트
```bash
curl -X POST https://YOUR_PROJECT_ID.supabase.co/functions/v1/search \
  -H "Content-Type: application/json" \
  -d '{"query": "FastAPI 인증 구현", "category": "engineering", "limit": 3}'
```

### 예상 응답
```json
{
  "query": "FastAPI 인증 구현",
  "results": [
    {
      "persona_id": "102-backend-engineer",
      "persona_name": "Backend Engineer",
      "category": "engineering",
      "similarity": "89%",
      "content": "FastAPI에서 JWT 인증을 구현할 때는..."
    }
  ],
  "count": 3
}
```
