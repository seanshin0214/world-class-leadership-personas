"""Persona 지식 베이스 파일을 벡터 스토어에 로드하는 스크립트"""
import os
import re
import sys
from pathlib import Path
from typing import List, Tuple

# Windows stdout/stderr UTF-8 설정
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

from vector_store import PersonaVectorStore


def chunk_document(content: str, chunk_size: int = 1500, overlap: int = 200) -> List[str]:
    """문서를 청크로 분할

    마크다운 헤더(#, ##, ###)를 기준으로 의미 있게 분할
    """
    chunks = []

    # 섹션별로 분할 (## 또는 ### 헤더 기준)
    sections = re.split(r'\n(?=#{2,3}\s)', content)

    current_chunk = ""
    for section in sections:
        section = section.strip()
        if not section:
            continue

        # 섹션이 chunk_size보다 작으면 현재 청크에 추가
        if len(current_chunk) + len(section) < chunk_size:
            current_chunk += "\n\n" + section if current_chunk else section
        else:
            # 현재 청크 저장
            if current_chunk:
                chunks.append(current_chunk.strip())

            # 섹션 자체가 너무 크면 더 작게 분할
            if len(section) > chunk_size:
                # 코드 블록 기준으로 분할 시도
                parts = re.split(r'\n(?=```)', section)
                for part in parts:
                    if len(part) > chunk_size:
                        # 그래도 크면 강제 분할
                        for i in range(0, len(part), chunk_size - overlap):
                            chunks.append(part[i:i + chunk_size].strip())
                    else:
                        chunks.append(part.strip())
                current_chunk = ""
            else:
                current_chunk = section

    # 마지막 청크 저장
    if current_chunk:
        chunks.append(current_chunk.strip())

    return [c for c in chunks if len(c) > 50]  # 너무 짧은 청크 제외


def get_persona_name(persona_id: str) -> str:
    """페르소나 ID에서 이름 추출 (예: 101-software-engineer -> Software Engineer)"""
    # 숫자 프리픽스 제거
    name_part = re.sub(r'^\d+-', '', persona_id)
    # 하이픈을 공백으로, 제목 형식으로
    return name_part.replace('-', ' ').title()


def load_knowledge_base(knowledge_base_dir: str, vector_store: PersonaVectorStore) -> int:
    """지식 베이스 폴더들을 벡터 스토어에 로드

    Args:
        knowledge_base_dir: knowledge-base 폴더 경로
        vector_store: PersonaVectorStore 인스턴스
    Returns:
        로드된 청크 수
    """
    kb_path = Path(knowledge_base_dir)
    if not kb_path.exists():
        raise FileNotFoundError(f"Knowledge base directory not found: {knowledge_base_dir}")

    all_documents = []
    total_chunks = 0
    persona_count = 0

    # 모든 페르소나 폴더 처리
    persona_dirs = sorted([d for d in kb_path.iterdir() if d.is_dir()])
    print(f"Found {len(persona_dirs)} persona directories")

    for persona_dir in persona_dirs:
        persona_id = persona_dir.name
        persona_name = get_persona_name(persona_id)

        # core-competencies 폴더 확인
        core_dir = persona_dir / "core-competencies"
        if not core_dir.exists():
            print(f"  Skipping {persona_id}: no core-competencies folder")
            continue

        # 마크다운 파일들 처리
        md_files = list(core_dir.glob("*.md"))
        if not md_files:
            print(f"  Skipping {persona_id}: no markdown files")
            continue

        persona_chunks = 0
        for md_file in md_files:
            try:
                with open(md_file, 'r', encoding='utf-8') as f:
                    content = f.read()

                # 청크로 분할
                chunks = chunk_document(content)

                # 문서 객체 생성
                for i, chunk in enumerate(chunks):
                    doc = {
                        "id": f"{persona_id}_{md_file.stem}_{i:04d}",
                        "content": chunk,
                        "metadata": {
                            "persona_id": persona_id,
                            "persona_name": persona_name,
                            "source_file": md_file.name,
                            "chunk_index": i,
                            "total_chunks": len(chunks)
                        }
                    }
                    all_documents.append(doc)

                persona_chunks += len(chunks)
            except Exception as e:
                print(f"  Error processing {md_file}: {e}")

        if persona_chunks > 0:
            print(f"Processing: {persona_id} -> {persona_name} ({persona_chunks} chunks)")
            total_chunks += persona_chunks
            persona_count += 1

    # 벡터 스토어에 추가
    if all_documents:
        vector_store.add_documents(all_documents)
        print(f"\nTotal: Loaded {total_chunks} chunks from {persona_count} personas")

    return total_chunks


if __name__ == "__main__":
    # 소스 디렉토리 (knowledge-base 폴더 위치)
    script_dir = Path(__file__).parent.parent
    knowledge_base_dir = script_dir / "knowledge-base"

    if len(sys.argv) > 1:
        knowledge_base_dir = Path(sys.argv[1])

    # 벡터 스토어 초기화
    db_path = script_dir / "rag" / "data" / "chroma_db"
    vector_store = PersonaVectorStore(str(db_path))

    # 기존 데이터 클리어
    print("Clearing existing data...")
    vector_store.clear()

    # 파일 로드
    print(f"\nLoading knowledge base from: {knowledge_base_dir}")
    chunk_count = load_knowledge_base(str(knowledge_base_dir), vector_store)

    print(f"\n=== Load Complete ===")
    print(f"Total documents in store: {vector_store.get_document_count()}")
    print(f"Available personas: {len(vector_store.get_all_personas())}")
