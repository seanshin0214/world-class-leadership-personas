# 📦 Knowledge Setup Guide

## Option 1: Claude Desktop (Local) - 추천

Claude Desktop은 **로컬 knowledge 폴더 + ChromaDB**를 사용합니다.

### 설치 방법

```bash
git clone https://github.com/seanshin0214/world-class-leadership-personas.git
cd world-class-leadership-personas
npm install
```

### claude_desktop_config.json 설정

```json
{
  "mcpServers": {
    "persona": {
      "command": "node",
      "args": ["dist/index.js"],
      "env": {
        "PERSONA_DIR": "C:\Users\YourName\.persona"
      }
    }
  }
}
```

**특징:**
- ✅ 142개 페르소나가 `knowledge-base/` 폴더에 포함됨
- ✅ 로컬에서 작동
- ✅ Supabase 불필요

---

## Option 2: ChatGPT GPT (Supabase)

GPT Actions를 사용하려면 **원격 지식 베이스**가 필요합니다.

### 설정 방법

1. **Supabase 프로젝트 생성**: [supabase.com](https://supabase.com)
2. **스키마 실행**: `supabase/schema.sql`
3. **페르소나 업로드**: `supabase/upload_personas.py`
4. **GPT Action 설정**: Supabase Edge Function URL 사용

```bash
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_KEY="your-service-role-key"
export OPENAI_API_KEY="sk-..."
python supabase/upload_personas.py
```

---

## Option 3: ChatGPT GPT (ngrok)

로컬에서 ngrok으로 실행:

```bash
npm run serve  # 로컬 서버 시작
ngrok http 8767  # ngrok으로 노출
```

⚠️ 컴퓨터가 켜져 있어야 함

---

## 비교표

| 플랫폼 | 지식 저장 | 비용 | 24시간 |
|--------|----------|------|--------|
| **Claude Desktop** | 로컬 | 무료 | ❌ |
| **GPT (Supabase)** | Supabase | $0-27/월 | ✅ |
| **GPT (ngrok)** | 로컬 | 무료 | ❌ |
