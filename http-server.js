#!/usr/bin/env node
/**
 * HTTP API Server for World-Class Leadership Personas
 * Wraps MCP server for use with ChatGPT Custom GPT via ngrok
 *
 * Usage:
 *   node http-server.js
 *   ngrok http 3000
 */

const http = require('http');
const { spawn } = require('child_process');
const path = require('path');

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.PERSONA_API_KEY || null; // Optional API key

console.log('Starting World-Class Leadership Personas HTTP API Server...\n');

// MCP 서버 프로세스 시작
const mcpProcess = spawn('node', [path.join(__dirname, 'dist', 'index.js')], {
  stdio: ['pipe', 'pipe', 'inherit'],
  cwd: __dirname
});

// JSON-RPC 요청 ID 관리
let requestId = 0;
const pendingRequests = new Map();

// MCP 초기화
let mcpInitialized = false;

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
        if (response.id !== undefined) {
          const pending = pendingRequests.get(response.id);
          if (pending) {
            pending.resolve(response);
            pendingRequests.delete(response.id);
          }
        }
      } catch (e) {
        // Non-JSON output, ignore
      }
    }
  }
});

mcpProcess.on('error', (err) => {
  console.error('MCP process error:', err);
});

mcpProcess.on('exit', (code) => {
  console.log('MCP process exited with code:', code);
  process.exit(code);
});

// MCP에 요청 보내기
function sendMcpRequest(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++requestId;
    const request = { jsonrpc: '2.0', id, method, params };

    pendingRequests.set(id, { resolve, reject });

    try {
      mcpProcess.stdin.write(JSON.stringify(request) + '\n');
    } catch (e) {
      pendingRequests.delete(id);
      reject(e);
      return;
    }

    // 타임아웃 30초
    setTimeout(() => {
      if (pendingRequests.has(id)) {
        pendingRequests.delete(id);
        reject(new Error('Request timeout'));
      }
    }, 30000);
  });
}

// MCP 초기화
async function initializeMcp() {
  try {
    await sendMcpRequest('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'http-server', version: '1.0.0' }
    });
    mcpInitialized = true;
    console.log('MCP initialized successfully');
  } catch (e) {
    console.error('MCP initialization failed:', e.message);
  }
}

// 초기화 시작
setTimeout(initializeMcp, 1000);

// HTTP 서버
const server = http.createServer(async (req, res) => {
  // CORS 헤더
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // API 키 인증 (설정된 경우)
  if (API_KEY && req.headers['x-api-key'] !== API_KEY) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Unauthorized', message: 'Invalid or missing API key' }));
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);

  // 요청 로깅
  console.log(`${new Date().toISOString()} ${req.method} ${url.pathname}`);

  try {
    // GET / - API 정보
    if (url.pathname === '/' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        name: 'World-Class Leadership Personas API',
        version: '1.0.0',
        personas: '142+',
        endpoints: {
          'GET /': 'API info',
          'GET /personas': 'List all personas',
          'GET /personas/:id': 'Get persona details',
          'POST /search': 'Search knowledge base',
          'POST /ask': 'Ask a persona',
          'GET /stats': 'Get statistics',
          'GET /health': 'Health check'
        }
      }));
      return;
    }

    // GET /health - 헬스 체크
    if (url.pathname === '/health' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'healthy',
        mcp_initialized: mcpInitialized,
        timestamp: new Date().toISOString()
      }));
      return;
    }

    // GET /personas - 모든 페르소나 목록
    if (url.pathname === '/personas' && req.method === 'GET') {
      const result = await sendMcpRequest('tools/call', {
        name: 'list_personas',
        arguments: {}
      });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result.result || result));
      return;
    }

    // GET /personas/:id - 특정 페르소나 정보
    const personaMatch = url.pathname.match(/^\/personas\/(.+)$/);
    if (personaMatch && req.method === 'GET') {
      const personaId = decodeURIComponent(personaMatch[1]);
      const result = await sendMcpRequest('tools/call', {
        name: 'search_by_persona',
        arguments: {
          query: 'core competencies expertise skills',
          persona_id: personaId,
          n_results: 10
        }
      });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        persona_id: personaId,
        knowledge: result.result || result
      }));
      return;
    }

    // POST /search - 지식 검색
    if (url.pathname === '/search' && req.method === 'POST') {
      let body = '';
      for await (const chunk of req) body += chunk;

      let params;
      try {
        params = JSON.parse(body);
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON body' }));
        return;
      }

      const { query, persona_id, n_results = 5 } = params;

      if (!query) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing required field: query' }));
        return;
      }

      const toolName = persona_id ? 'search_by_persona' : 'search_persona_knowledge';
      const toolArgs = persona_id
        ? { query, persona_id, n_results }
        : { query, n_results };

      const result = await sendMcpRequest('tools/call', {
        name: toolName,
        arguments: toolArgs
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result.result || result));
      return;
    }

    // POST /ask - 페르소나에게 질문
    if (url.pathname === '/ask' && req.method === 'POST') {
      let body = '';
      for await (const chunk of req) body += chunk;

      let params;
      try {
        params = JSON.parse(body);
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON body' }));
        return;
      }

      const { persona_id, question } = params;

      if (!persona_id || !question) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing required fields: persona_id, question' }));
        return;
      }

      // 페르소나 지식 검색
      const knowledge = await sendMcpRequest('tools/call', {
        name: 'search_by_persona',
        arguments: {
          query: question,
          persona_id,
          n_results: 5
        }
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        persona_id,
        question,
        knowledge: knowledge.result || knowledge,
        instruction: `You are now ${persona_id}. Use the knowledge above to answer the question with expertise and authority.`
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
      res.end(JSON.stringify(result.result || result));
      return;
    }

    // 404 Not Found
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: 'Not found',
      available_endpoints: [
        'GET /',
        'GET /health',
        'GET /personas',
        'GET /personas/:id',
        'POST /search',
        'POST /ask',
        'GET /stats'
      ]
    }));

  } catch (error) {
    console.error('Error:', error.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal server error', message: error.message }));
  }
});

server.listen(PORT, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log('World-Class Leadership Personas HTTP API Server');
  console.log(`${'='.repeat(60)}`);
  console.log(`\nServer running on: http://localhost:${PORT}`);
  console.log(`\nTo expose via ngrok, run in another terminal:`);
  console.log(`  ngrok http ${PORT}`);
  console.log(`\nThen update your ChatGPT Custom GPT Actions with the ngrok URL.`);
  console.log(`\nEndpoints:`);
  console.log(`  GET  /           - API info`);
  console.log(`  GET  /health     - Health check`);
  console.log(`  GET  /personas   - List all personas`);
  console.log(`  GET  /personas/:id - Get persona details`);
  console.log(`  POST /search     - Search knowledge`);
  console.log(`  POST /ask        - Ask a persona`);
  console.log(`  GET  /stats      - Get statistics`);
  console.log(`\n${'='.repeat(60)}\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  mcpProcess.kill();
  server.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nShutting down...');
  mcpProcess.kill();
  server.close();
  process.exit(0);
});
