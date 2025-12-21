// Supabase Edge Function: Persona Knowledge Search
// GPT Actions에서 직접 호출 가능한 검색 API

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query, persona_id, category, limit = 5 } = await req.json()

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // OpenAI 임베딩 생성
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: query,
      }),
    })

    const embeddingData = await embeddingResponse.json()
    const embedding = embeddingData.data[0].embedding

    // Supabase 클라이언트
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 벡터 검색
    const { data: results, error } = await supabaseClient.rpc('search_persona_knowledge', {
      query_embedding: embedding,
      match_threshold: 0.5,
      match_count: limit,
      filter_persona: persona_id || null,
      filter_category: category || null,
    })

    if (error) throw error

    // 결과 포맷팅
    const formattedResults = results.map((r: any) => ({
      persona_id: r.persona_id,
      persona_name: r.persona_name,
      category: r.category,
      section: r.section,
      similarity: Math.round(r.similarity * 100) + '%',
      content: r.content,
    }))

    return new Response(
      JSON.stringify({
        query,
        results: formattedResults,
        count: formattedResults.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
