"""Persona RAG Vector Store - ChromaDB 기반 벡터 스토어"""
import os
from pathlib import Path
from typing import List, Optional
import chromadb
from chromadb.config import Settings


class PersonaVectorStore:
    """페르소나 지식 베이스를 저장하고 검색하는 벡터 스토어"""

    def __init__(self, persist_directory: str = "./data/chroma_db"):
        self.persist_directory = persist_directory
        self._client = None
        self._collection = None
        self._encoder = None

    @property
    def client(self):
        """ChromaDB 클라이언트 지연 로딩"""
        if self._client is None:
            self._client = chromadb.PersistentClient(
                path=self.persist_directory,
                settings=Settings(anonymized_telemetry=False)
            )
        return self._client

    @property
    def collection(self):
        """컬렉션 지연 로딩"""
        if self._collection is None:
            self._collection = self.client.get_or_create_collection(
                name="persona_knowledge",
                metadata={"description": "World-Class Leadership Persona Knowledge Base"}
            )
        return self._collection

    @property
    def encoder(self):
        """SentenceTransformer 인코더 지연 로딩"""
        if self._encoder is None:
            from sentence_transformers import SentenceTransformer
            self._encoder = SentenceTransformer('all-MiniLM-L6-v2')
        return self._encoder

    def add_documents(self, documents: List[dict]) -> int:
        """문서들을 벡터 스토어에 추가

        Args:
            documents: [{"id": str, "content": str, "metadata": dict}, ...]
        Returns:
            추가된 문서 수
        """
        if not documents:
            return 0

        ids = [doc["id"] for doc in documents]
        contents = [doc["content"] for doc in documents]
        metadatas = [doc.get("metadata", {}) for doc in documents]

        # 임베딩 생성
        embeddings = self.encoder.encode(contents).tolist()

        self.collection.add(
            ids=ids,
            embeddings=embeddings,
            documents=contents,
            metadatas=metadatas
        )
        return len(documents)

    def search(self, query: str, n_results: int = 5,
               filter_metadata: Optional[dict] = None) -> List[dict]:
        """쿼리와 관련된 문서 검색

        Args:
            query: 검색 쿼리
            n_results: 반환할 결과 수
            filter_metadata: 메타데이터 필터 (예: {"persona_id": "410-llm-engineer"})
        Returns:
            관련 문서 리스트
        """
        query_embedding = self.encoder.encode([query]).tolist()

        results = self.collection.query(
            query_embeddings=query_embedding,
            n_results=n_results,
            where=filter_metadata,
            include=["documents", "metadatas", "distances"]
        )

        output = []
        for i in range(len(results["ids"][0])):
            output.append({
                "id": results["ids"][0][i],
                "content": results["documents"][0][i],
                "metadata": results["metadatas"][0][i],
                "distance": results["distances"][0][i]
            })
        return output

    def search_by_persona(self, query: str, persona_id: str, n_results: int = 5) -> List[dict]:
        """특정 페르소나의 지식에서 검색"""
        return self.search(query, n_results, filter_metadata={"persona_id": persona_id})

    def get_all_personas(self) -> List[str]:
        """저장된 모든 페르소나 목록 반환"""
        results = self.collection.get(include=["metadatas"])
        personas = set()
        for metadata in results["metadatas"]:
            if "persona_id" in metadata:
                personas.add(metadata["persona_id"])
        return sorted(list(personas))

    def get_document_count(self) -> int:
        """저장된 문서 수 반환"""
        return self.collection.count()

    def clear(self):
        """모든 데이터 삭제"""
        try:
            self.client.delete_collection("persona_knowledge")
        except Exception:
            pass  # 컬렉션이 없으면 무시
        self._collection = self.client.get_or_create_collection(
            name="persona_knowledge",
            metadata={"description": "World-Class Leadership Persona Knowledge Base"}
        )
