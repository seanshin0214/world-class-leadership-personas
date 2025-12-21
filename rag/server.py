"""Persona RAG MCP Server - RAG 기반 페르소나 지식 검색"""
import os
import sys
from pathlib import Path
from typing import Optional

# Windows stdout/stderr UTF-8 설정
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

# 프로젝트 루트를 경로에 추가
sys.path.insert(0, str(Path(__file__).parent))

from vector_store import PersonaVectorStore


# 벡터 스토어 - 백그라운드 초기화
DATA_DIR = Path(__file__).parent / "data" / "chroma_db"

import threading
_vector_store = None
_init_lock = threading.Lock()
_init_done = threading.Event()

def _background_init():
    """백그라운드에서 모델 로딩"""
    global _vector_store
    _vector_store = PersonaVectorStore(str(DATA_DIR))
    _ = _vector_store.encoder  # SentenceTransformer 로드
    _init_done.set()
    print("벡터 스토어 준비 완료", file=sys.stderr)

# 백그라운드 스레드로 즉시 시작
threading.Thread(target=_background_init, daemon=True).start()

def get_vector_store():
    """벡터 스토어 반환 (초기화 완료 대기)"""
    _init_done.wait()
    return _vector_store


# MCP 서버 생성
server = Server("persona-rag")


@server.list_tools()
async def list_tools():
    """사용 가능한 도구 목록 반환"""
    return [
        Tool(
            name="search_persona_knowledge",
            description="""142개 월드클래스+ 페르소나의 전문 지식 베이스를 검색합니다.

포함된 지식:
- 개발: Software Engineer, Backend, Frontend, DevOps, Security, QA 등
- 디자인: UX/UI Designer, Graphic Designer, Animator 등
- 비즈니스: CEO, CTO, CFO, Product Manager, Sales 등
- AI/ML: Data Scientist, ML Engineer, LLM Engineer, AI Researcher 등
- 교육: Professor, Teacher, Curriculum Developer 등
- 의료: Physician, Nurse, Pharmacist, Psychologist 등

사용 예시:
- "FastAPI에서 인증 구현 방법"
- "UX 디자인 원칙"
- "스타트업 자금 조달 전략"
- "LLM 파인튜닝 방법"
            """,
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "검색할 질문 또는 주제"
                    },
                    "n_results": {
                        "type": "integer",
                        "description": "반환할 결과 수 (기본: 5)",
                        "default": 5
                    }
                },
                "required": ["query"]
            }
        ),
        Tool(
            name="search_by_persona",
            description="""특정 페르소나의 전문 지식만 검색합니다.

페르소나 ID 예시:
- 101-software-engineer, 102-backend-engineer
- 201-ui-ux-designer, 222-graphic-designer
- 327-cto, 329-ceo, 330-product-manager
- 401-data-scientist, 410-llm-engineer
- 602-professor, 701-physician

전체 목록은 list_personas 도구로 확인하세요.
            """,
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "검색할 질문"
                    },
                    "persona_id": {
                        "type": "string",
                        "description": "페르소나 ID (예: 410-llm-engineer)"
                    },
                    "n_results": {
                        "type": "integer",
                        "description": "반환할 결과 수 (기본: 5)",
                        "default": 5
                    }
                },
                "required": ["query", "persona_id"]
            }
        ),
        Tool(
            name="list_personas",
            description="RAG 지식 베이스에 등록된 모든 페르소나 목록을 표시합니다.",
            inputSchema={
                "type": "object",
                "properties": {}
            }
        ),
        Tool(
            name="get_persona_stats",
            description="페르소나 RAG 벡터 스토어의 통계 정보를 반환합니다.",
            inputSchema={
                "type": "object",
                "properties": {}
            }
        )
    ]


@server.call_tool()
async def call_tool(name: str, arguments: dict):
    """도구 실행"""

    if name == "search_persona_knowledge":
        query = arguments.get("query", "")
        n_results = arguments.get("n_results", 5)

        results = get_vector_store().search(query, n_results=n_results)

        if not results:
            return [TextContent(
                type="text",
                text=f"'{query}'에 대한 결과를 찾을 수 없습니다."
            )]

        output = f"## 🔍 '{query}' 검색 결과\n\n"
        for i, r in enumerate(results, 1):
            persona_name = r["metadata"].get("persona_name", "Unknown")
            persona_id = r["metadata"].get("persona_id", "")
            output += f"### [{i}] {persona_name} ({persona_id})\n"
            output += f"**관련도**: {1 - r['distance']:.2%}\n\n"
            output += f"{r['content']}\n\n"
            output += "---\n\n"

        return [TextContent(type="text", text=output)]

    elif name == "search_by_persona":
        query = arguments.get("query", "")
        persona_id = arguments.get("persona_id", "")
        n_results = arguments.get("n_results", 5)

        results = get_vector_store().search_by_persona(query, persona_id, n_results=n_results)

        if not results:
            return [TextContent(
                type="text",
                text=f"'{persona_id}'의 '{query}'에 대한 결과를 찾을 수 없습니다.\n\n"
                     f"사용 가능한 페르소나: list_personas 도구로 확인하세요."
            )]

        persona_name = results[0]["metadata"].get("persona_name", persona_id)
        output = f"## 🎯 [{persona_name}] '{query}' 검색 결과\n\n"
        for i, r in enumerate(results, 1):
            output += f"### [{i}] 관련도: {1 - r['distance']:.2%}\n\n"
            output += f"{r['content']}\n\n"
            output += "---\n\n"

        return [TextContent(type="text", text=output)]

    elif name == "list_personas":
        personas = get_vector_store().get_all_personas()

        if not personas:
            return [TextContent(
                type="text",
                text="등록된 페르소나가 없습니다. data_loader.py를 실행하여 지식 베이스를 구축하세요."
            )]

        # 카테고리별로 그룹화
        categories = {
            "1xx - Engineering": [],
            "2xx - Design & Creative": [],
            "3xx - Business & Leadership": [],
            "4xx - AI & Data Science": [],
            "5xx - Testing & QA": [],
            "6xx - Education": [],
            "7xx - Healthcare": [],
            "8xx - Other": []
        }

        for p in personas:
            try:
                num = int(p.split('-')[0])
                if 100 <= num < 200:
                    categories["1xx - Engineering"].append(p)
                elif 200 <= num < 300:
                    categories["2xx - Design & Creative"].append(p)
                elif 300 <= num < 400:
                    categories["3xx - Business & Leadership"].append(p)
                elif 400 <= num < 500:
                    categories["4xx - AI & Data Science"].append(p)
                elif 500 <= num < 600:
                    categories["5xx - Testing & QA"].append(p)
                elif 600 <= num < 700:
                    categories["6xx - Education"].append(p)
                elif 700 <= num < 800:
                    categories["7xx - Healthcare"].append(p)
                else:
                    categories["8xx - Other"].append(p)
            except:
                categories["8xx - Other"].append(p)

        output = "## 👥 Persona RAG 지식 베이스\n\n"
        for cat, items in categories.items():
            if items:
                output += f"### {cat}\n"
                for p in items:
                    output += f"- `{p}`\n"
                output += "\n"

        output += f"\n**총 페르소나 수**: {len(personas)}"

        return [TextContent(type="text", text=output)]

    elif name == "get_persona_stats":
        doc_count = get_vector_store().get_document_count()
        personas = get_vector_store().get_all_personas()

        output = "## 📊 Persona RAG 통계\n\n"
        output += f"- **총 문서 청크 수**: {doc_count}\n"
        output += f"- **등록된 페르소나 수**: {len(personas)}\n"

        return [TextContent(type="text", text=output)]

    else:
        return [TextContent(
            type="text",
            text=f"알 수 없는 도구: {name}"
        )]


async def main():
    """MCP 서버 실행"""
    async with stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            server.create_initialization_options()
        )


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
