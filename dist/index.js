#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, ListResourcesRequestSchema, ReadResourceRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';
import { createPersonaSchema, updatePersonaSchema, deletePersonaSchema, suggestPersonaSchema, chainPersonasSchema, browseCommunitySchema, installCommunityPersonaSchema, validatePersonaName, validatePersonaContent, } from './validation.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// 페르소나 저장 디렉토리
const PERSONA_DIR = path.join(os.homedir(), '.persona');
const ANALYTICS_FILE = path.join(PERSONA_DIR, '.analytics.json');
const COMMUNITY_DIR = path.join(__dirname, '..', 'community');
const KNOWLEDGE_BASE_DIR = path.join(__dirname, '..', 'knowledge-base');
// 페르소나 디렉토리 초기화
async function initPersonaDir() {
    try {
        await fs.mkdir(PERSONA_DIR, { recursive: true });
    }
    catch (error) {
        console.error('Failed to create persona directory:', error);
    }
}
// 페르소나 파일 목록 가져오기
async function listPersonas() {
    try {
        const files = await fs.readdir(PERSONA_DIR);
        return files.filter(f => f.endsWith('.txt')).map(f => f.replace('.txt', ''));
    }
    catch (error) {
        return [];
    }
}
// Knowledge base에서 페르소나 목록 가져오기
async function listKnowledgeBasePersonas() {
    try {
        const entries = await fs.readdir(KNOWLEDGE_BASE_DIR, { withFileTypes: true });
        return entries
            .filter(entry => entry.isDirectory())
            .map(entry => entry.name);
    }
    catch (error) {
        return [];
    }
}
// Knowledge base 문서 읽기
async function readKnowledgeBase(personaId) {
    try {
        const personaDir = path.join(KNOWLEDGE_BASE_DIR, personaId, 'core-competencies');
        const files = await fs.readdir(personaDir);
        const mdFiles = files.filter(f => f.endsWith('.md'));
        if (mdFiles.length === 0) {
            throw new Error(`No knowledge base documents found for persona ${personaId}`);
        }
        // 첫 번째 문서 읽기 (또는 모든 문서 병합)
        const content = await fs.readFile(path.join(personaDir, mdFiles[0]), 'utf-8');
        return content;
    }
    catch (error) {
        throw new Error(`Knowledge base not found for persona ${personaId}: ${error.message}`);
    }
}
// 페르소나 읽기 (검증 포함)
async function readPersona(name) {
    // 파일명 검증 - 경로 순회 공격 방지
    const validatedName = validatePersonaName(name);
    const filePath = path.join(PERSONA_DIR, `${validatedName}.txt`);
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        return content;
    }
    catch (error) {
        throw new Error(`Persona "${validatedName}" not found`);
    }
}
// 페르소나 저장 (검증 포함)
async function savePersona(name, content) {
    // 파일명 및 컨텐츠 검증
    const validatedName = validatePersonaName(name);
    const validatedContent = validatePersonaContent(content);
    const filePath = path.join(PERSONA_DIR, `${validatedName}.txt`);
    await fs.writeFile(filePath, validatedContent, 'utf-8');
}
// 페르소나 삭제 (검증 포함)
async function deletePersona(name) {
    const validatedName = validatePersonaName(name);
    const filePath = path.join(PERSONA_DIR, `${validatedName}.txt`);
    await fs.unlink(filePath);
}
// 분석 데이터 로드
async function loadAnalytics() {
    try {
        const data = await fs.readFile(ANALYTICS_FILE, 'utf-8');
        return JSON.parse(data);
    }
    catch {
        return { usage: {}, contextPatterns: {} };
    }
}
// 분석 데이터 저장
async function saveAnalytics(data) {
    await fs.writeFile(ANALYTICS_FILE, JSON.stringify(data, null, 2), 'utf-8');
}
// 사용 기록 추가
async function trackUsage(personaName, context = '') {
    const analytics = await loadAnalytics();
    // 사용 횟수 증가
    if (!analytics.usage[personaName]) {
        analytics.usage[personaName] = 0;
    }
    analytics.usage[personaName]++;
    // 컨텍스트 패턴 저장 (경량화: 키워드만)
    if (context) {
        const keywords = context.toLowerCase().match(/\b\w{4,}\b/g) || [];
        if (!analytics.contextPatterns[personaName]) {
            analytics.contextPatterns[personaName] = {};
        }
        keywords.slice(0, 5).forEach(kw => {
            analytics.contextPatterns[personaName][kw] =
                (analytics.contextPatterns[personaName][kw] || 0) + 1;
        });
    }
    await saveAnalytics(analytics);
}
// 커뮤니티 페르소나 목록 가져오기
async function listCommunityPersonas() {
    try {
        const files = await fs.readdir(COMMUNITY_DIR);
        const personas = [];
        for (const file of files.filter(f => f.endsWith('.txt'))) {
            const name = file.replace('.txt', '');
            const filePath = path.join(COMMUNITY_DIR, file);
            const content = await fs.readFile(filePath, 'utf-8');
            // 메타데이터 추출
            const lines = content.split('\n');
            const metadata = {};
            for (const line of lines) {
                if (line.startsWith('# ')) {
                    const match = line.match(/^# (\w+):\s*(.+)$/);
                    if (match) {
                        metadata[match[1].toLowerCase()] = match[2];
                    }
                }
                else if (!line.startsWith('#')) {
                    break; // 메타데이터 섹션 끝
                }
            }
            personas.push({
                name,
                ...metadata,
                file
            });
        }
        return personas;
    }
    catch (error) {
        console.error('Failed to list community personas:', error);
        return [];
    }
}
// 커뮤니티 페르소나 읽기
async function readCommunityPersona(name) {
    const validatedName = validatePersonaName(name);
    const filePath = path.join(COMMUNITY_DIR, `${validatedName}.txt`);
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        return content;
    }
    catch (error) {
        throw new Error(`Community persona "${validatedName}" not found`);
    }
}
// 커뮤니티 페르소나를 로컬에 설치
async function installCommunityPersona(name) {
    const validatedName = validatePersonaName(name);
    const communityPath = path.join(COMMUNITY_DIR, `${validatedName}.txt`);
    const localPath = path.join(PERSONA_DIR, `${validatedName}.txt`);
    try {
        const content = await fs.readFile(communityPath, 'utf-8');
        await fs.writeFile(localPath, content, 'utf-8');
        return localPath;
    }
    catch (error) {
        throw new Error(`Failed to install community persona "${validatedName}": ${error.message}`);
    }
}
// 스마트 페르소나 제안
async function suggestPersona(context) {
    const personas = await listPersonas();
    if (personas.length === 0) {
        return null;
    }
    const analytics = await loadAnalytics();
    const contextLower = context.toLowerCase();
    // 컨텍스트 키워드 분석
    const detectionRules = [
        { keywords: ['explain', 'teach', 'learn', 'understand', 'how', 'what', 'why'], persona: 'teacher', weight: 3 },
        { keywords: ['code', 'function', 'bug', 'debug', 'program', 'implement'], persona: 'coder', weight: 3 },
        { keywords: ['professional', 'business', 'formal', 'report', 'meeting'], persona: 'professional', weight: 2 },
        { keywords: ['casual', 'chat', 'friendly', 'hey', 'talk'], persona: 'casual', weight: 2 },
        { keywords: ['brief', 'short', 'quick', 'summary', 'concise'], persona: 'concise', weight: 2 },
    ];
    const scores = {};
    // 규칙 기반 점수
    detectionRules.forEach(rule => {
        if (personas.includes(rule.persona)) {
            const matchCount = rule.keywords.filter(kw => contextLower.includes(kw)).length;
            if (matchCount > 0) {
                scores[rule.persona] = (scores[rule.persona] || 0) + matchCount * rule.weight;
            }
        }
    });
    // 과거 사용 패턴 기반 점수 (가중치 낮게)
    const contextKeywords = contextLower.match(/\b\w{4,}\b/g) || [];
    personas.forEach(persona => {
        if (analytics.contextPatterns[persona]) {
            contextKeywords.forEach(kw => {
                if (analytics.contextPatterns[persona][kw]) {
                    scores[persona] = (scores[persona] || 0) + 0.5;
                }
            });
        }
    });
    // 최고 점수 페르소나 반환
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    if (sorted.length > 0 && sorted[0][1] > 1) {
        return {
            persona: sorted[0][0],
            confidence: Math.min(sorted[0][1] / 10, 0.95),
            reason: `Context matches ${sorted[0][0]} pattern`,
        };
    }
    return null;
}
// MCP 서버 생성
const server = new Server({
    name: 'persona-mcp',
    version: '2.0.0',
}, {
    capabilities: {
        tools: {},
        resources: {},
    },
});
// 도구 목록
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: 'create_persona',
                description: '새로운 페르소나 프로필을 생성합니다',
                inputSchema: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            description: '페르소나 이름 (예: default, professional, casual)',
                        },
                        content: {
                            type: 'string',
                            description: '페르소나 프롬프트 내용',
                        },
                    },
                    required: ['name', 'content'],
                },
            },
            {
                name: 'update_persona',
                description: '기존 페르소나 프로필을 수정합니다',
                inputSchema: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            description: '수정할 페르소나 이름',
                        },
                        content: {
                            type: 'string',
                            description: '새로운 페르소나 프롬프트 내용',
                        },
                    },
                    required: ['name', 'content'],
                },
            },
            {
                name: 'delete_persona',
                description: '페르소나 프로필을 삭제합니다',
                inputSchema: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            description: '삭제할 페르소나 이름',
                        },
                    },
                    required: ['name'],
                },
            },
            {
                name: 'list_personas',
                description: '사용 가능한 모든 페르소나 목록을 조회합니다',
                inputSchema: {
                    type: 'object',
                    properties: {},
                },
            },
            {
                name: 'suggest_persona',
                description: '대화 컨텍스트를 분석하여 적합한 페르소나를 제안합니다 (트리거 시에만 활성화)',
                inputSchema: {
                    type: 'object',
                    properties: {
                        context: {
                            type: 'string',
                            description: '분석할 대화 컨텍스트 또는 질문 내용',
                        },
                    },
                    required: ['context'],
                },
            },
            {
                name: 'chain_personas',
                description: '여러 페르소나를 순차적으로 실행하여 단계별 처리를 수행합니다',
                inputSchema: {
                    type: 'object',
                    properties: {
                        personas: {
                            type: 'array',
                            items: { type: 'string' },
                            description: '순차 실행할 페르소나 이름 배열',
                        },
                        initialInput: {
                            type: 'string',
                            description: '첫 번째 페르소나에 전달할 입력',
                        },
                    },
                    required: ['personas', 'initialInput'],
                },
            },
            {
                name: 'get_analytics',
                description: '페르소나 사용 통계를 조회합니다 (로컬 데이터만)',
                inputSchema: {
                    type: 'object',
                    properties: {},
                },
            },
            {
                name: 'browse_community',
                description: '커뮤니티 페르소나 컬렉션을 탐색합니다 (GitHub에서 공유된 무료 페르소나)',
                inputSchema: {
                    type: 'object',
                    properties: {
                        category: {
                            type: 'string',
                            description: '필터링할 카테고리 (선택사항): Programming, Creative, Business, Education, Design 등',
                        },
                    },
                },
            },
            {
                name: 'install_community_persona',
                description: '커뮤니티 페르소나를 로컬 컬렉션에 설치합니다',
                inputSchema: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            description: '설치할 커뮤니티 페르소나 이름',
                        },
                    },
                    required: ['name'],
                },
            },
        ],
    };
});
// 도구 실행
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        switch (name) {
            case 'create_persona': {
                const validated = createPersonaSchema.parse(args);
                await savePersona(validated.name, validated.content);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `페르소나 "${validated.name}"이(가) 생성되었습니다.\n위치: ${path.join(PERSONA_DIR, validated.name + '.txt')}`,
                        },
                    ],
                };
            }
            case 'update_persona': {
                const validated = updatePersonaSchema.parse(args);
                await savePersona(validated.name, validated.content);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `페르소나 "${validated.name}"이(가) 업데이트되었습니다.`,
                        },
                    ],
                };
            }
            case 'delete_persona': {
                const validated = deletePersonaSchema.parse(args);
                await deletePersona(validated.name);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `페르소나 "${validated.name}"이(가) 삭제되었습니다.`,
                        },
                    ],
                };
            }
            case 'list_personas': {
                const personas = await listPersonas();
                return {
                    content: [
                        {
                            type: 'text',
                            text: personas.length > 0
                                ? `사용 가능한 페르소나:\n${personas.map(p => `- ${p}`).join('\n')}\n\n사용법: @persona:${personas[0]} 형식으로 참조하세요.`
                                : '저장된 페르소나가 없습니다.',
                        },
                    ],
                };
            }
            case 'suggest_persona': {
                const validated = suggestPersonaSchema.parse(args);
                const suggestion = await suggestPersona(validated.context);
                if (!suggestion) {
                    return {
                        content: [
                            {
                                type: 'text',
                                text: '💡 현재 컨텍스트에 적합한 페르소나를 찾을 수 없습니다.\n사용 가능한 페르소나 목록을 보려면 list_personas 도구를 사용하세요.',
                            },
                        ],
                    };
                }
                return {
                    content: [
                        {
                            type: 'text',
                            text: `💡 페르소나 제안\n\n추천: @persona:${suggestion.persona}\n신뢰도: ${(suggestion.confidence * 100).toFixed(0)}%\n이유: ${suggestion.reason}\n\n이 페르소나를 사용하려면 @persona:${suggestion.persona} 리소스를 참조하세요.`,
                        },
                    ],
                };
            }
            case 'chain_personas': {
                const validated = chainPersonasSchema.parse(args);
                const results = [];
                let currentInput = validated.initialInput;
                for (const personaName of validated.personas) {
                    try {
                        const personaContent = await readPersona(personaName);
                        await trackUsage(personaName, currentInput);
                        results.push({
                            persona: personaName,
                            prompt: personaContent,
                            input: currentInput,
                        });
                        // 다음 입력은 현재 페르소나의 출력이 될 것임을 명시
                        currentInput = `[Previous output from ${personaName} will be used as input here]`;
                    }
                    catch (error) {
                        results.push({
                            persona: personaName,
                            error: error.message,
                        });
                        break;
                    }
                }
                const resultText = results.map((r, i) => {
                    if (r.error) {
                        return `Step ${i + 1} - ${r.persona}: ❌ ${r.error}`;
                    }
                    return `Step ${i + 1} - ${r.persona}:\n\nPrompt:\n${r.prompt}\n\nInput:\n${r.input}\n`;
                }).join('\n' + '='.repeat(50) + '\n\n');
                return {
                    content: [
                        {
                            type: 'text',
                            text: `🔗 Persona Chain Execution\n\n${resultText}\n✅ Chain completed: ${results.filter(r => !r.error).length}/${validated.personas.length} steps`,
                        },
                    ],
                };
            }
            case 'get_analytics': {
                const analytics = await loadAnalytics();
                const usageList = Object.entries(analytics.usage)
                    .sort((a, b) => b[1] - a[1])
                    .map(([name, count]) => `  ${name}: ${count} uses`)
                    .join('\n');
                const topPatterns = {};
                Object.entries(analytics.contextPatterns).forEach(([persona, patterns]) => {
                    const sorted = Object.entries(patterns)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 3);
                    topPatterns[persona] = sorted.map(([kw]) => kw);
                });
                const patternsList = Object.entries(topPatterns)
                    .map(([persona, keywords]) => `  ${persona}: ${keywords.join(', ')}`)
                    .join('\n');
                return {
                    content: [
                        {
                            type: 'text',
                            text: `📊 Persona Usage Analytics\n\n사용 횟수:\n${usageList || '  (no data)'}\n\n주요 컨텍스트 패턴:\n${patternsList || '  (no data)'}\n\n💡 이 데이터는 로컬에만 저장되며 전송되지 않습니다.`,
                        },
                    ],
                };
            }
            case 'browse_community': {
                const validated = browseCommunitySchema.parse(args);
                const personas = await listCommunityPersonas();
                if (personas.length === 0) {
                    return {
                        content: [
                            {
                                type: 'text',
                                text: '📦 커뮤니티 페르소나가 아직 없습니다.\n\nCONTRIBUTING.md를 참조하여 첫 번째 기여자가 되어보세요!',
                            },
                        ],
                    };
                }
                // 카테고리 필터링
                let filtered = personas;
                if (validated.category) {
                    filtered = personas.filter(p => p.category && p.category.toLowerCase().includes(validated.category.toLowerCase()));
                }
                // 카테고리별로 그룹화
                const byCategory = {};
                filtered.forEach(p => {
                    const cat = p.category || 'Other';
                    if (!byCategory[cat]) {
                        byCategory[cat] = [];
                    }
                    byCategory[cat].push(p);
                });
                let output = '🌟 Community Persona Collection\n\n';
                output += `Found ${filtered.length} persona(s)${validated.category ? ` in category "${validated.category}"` : ''}\n\n`;
                for (const [category, list] of Object.entries(byCategory)) {
                    output += `## ${category}\n\n`;
                    list.forEach(p => {
                        output += `### ${p.name}\n`;
                        if (p.author)
                            output += `👤 Author: ${p.author}\n`;
                        if (p.difficulty)
                            output += `📊 Difficulty: ${p.difficulty}\n`;
                        if (p.persona)
                            output += `📝 Description: ${p.persona}\n`;
                        if (p['use'])
                            output += `💡 Use Cases: ${p['use']}\n`;
                        output += `\n📥 Install: \`install_community_persona\` with name "${p.name}"\n\n`;
                    });
                }
                output += '\n---\n\n';
                output += '💡 **Tip**: After installing, use @persona:name to activate\n';
                output += '📚 **More info**: See CONTRIBUTING.md to add your own persona\n';
                output += '🎯 **Vision**: Check VISION.md for the Persona Marketplace roadmap';
                return {
                    content: [
                        {
                            type: 'text',
                            text: output,
                        },
                    ],
                };
            }
            case 'install_community_persona': {
                const validated = installCommunityPersonaSchema.parse(args);
                const installedPath = await installCommunityPersona(validated.name);
                // 간단한 프리뷰 제공
                const content = await readCommunityPersona(validated.name);
                const preview = content.split('\n').slice(0, 10).join('\n');
                return {
                    content: [
                        {
                            type: 'text',
                            text: `✅ Persona "${validated.name}" installed successfully!\n\n📁 Location: ${installedPath}\n\n📄 Preview:\n${preview}\n...\n\n💡 **How to use:**\n@persona:${validated.name} your question or task\n\nExample:\n@persona:${validated.name} help me with this code\n\n🎯 The persona will only activate when you use the @persona:${validated.name} trigger (Submarine Mode = 0 tokens otherwise)`,
                        },
                    ],
                };
            }
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
    catch (error) {
        // Zod 검증 에러 처리
        if (error instanceof Error && error.name === 'ZodError') {
            return {
                content: [
                    {
                        type: 'text',
                        text: `입력 검증 실패: ${error.message}`,
                    },
                ],
                isError: true,
            };
        }
        return {
            content: [
                {
                    type: 'text',
                    text: `오류: ${error.message}`,
                },
            ],
            isError: true,
        };
    }
});
// 리소스 목록
server.setRequestHandler(ListResourcesRequestSchema, async () => {
    const personas = await listPersonas();
    const knowledgeBasePersonas = await listKnowledgeBasePersonas();
    const resources = [
        // 기존 .txt 페르소나
        ...personas.map(name => ({
            uri: `persona://${name}`,
            mimeType: 'text/plain',
            name: `Persona: ${name}`,
            description: `${name} 페르소나 프로필`,
        })),
        // Knowledge base 페르소나
        ...knowledgeBasePersonas.map(id => ({
            uri: `persona://${id}/knowledge-base`,
            mimeType: 'text/markdown',
            name: `${id} Knowledge Base`,
            description: `${id} 전문 지식 베이스 (상세 문서, 코드 예제, 베스트 프랙티스)`,
        })),
    ];
    return { resources };
});
// 리소스 읽기
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const uri = request.params.uri;
    // Knowledge base 리소스 체크
    const kbMatch = uri.match(/^persona:\/\/(.+)\/knowledge-base$/);
    if (kbMatch) {
        const personaId = kbMatch[1];
        const content = await readKnowledgeBase(personaId);
        await trackUsage(personaId, '');
        return {
            contents: [
                {
                    uri,
                    mimeType: 'text/markdown',
                    text: content,
                },
            ],
        };
    }
    // 기존 .txt 페르소나
    const match = uri.match(/^persona:\/\/(.+)$/);
    if (!match) {
        throw new Error('Invalid persona URI');
    }
    const personaName = match[1];
    const content = await readPersona(personaName);
    // 사용 추적 (트리거 기반 - 실제 로드 시에만)
    await trackUsage(personaName, '');
    return {
        contents: [
            {
                uri,
                mimeType: 'text/plain',
                text: content,
            },
        ],
    };
});
// 서버 시작
async function main() {
    await initPersonaDir();
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Persona MCP server v2.0.0 running on stdio');
}
main().catch((error) => {
    console.error('Server error:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map