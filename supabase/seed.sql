-- 샘플 블로그 포스트 삽입
INSERT INTO blog_posts (title, slug, content, excerpt, tags, published, published_at)
VALUES
(
  'AI 시대, 개발자로 살아남는 7가지 방법',
  'ai-developer-survival-guide',
  E'## 들어가며\n\n2026년, AI는 더 이상 미래의 이야기가 아닙니다. Claude, GPT-4o, Gemini Ultra 같은 모델들이 코드를 쓰고, 버그를 고치고, PR을 리뷰합니다. 주니어 개발자의 업무 상당 부분이 AI로 자동화되는 시대가 왔습니다.\n\n그렇다면 우리는 어떻게 살아남아야 할까요?\n\n## 1. AI를 두려워하지 말고, 도구로 사용하라\n\nAI는 당신의 경쟁자가 아닌 **곱셈기**입니다. AI와 함께 일하는 개발자는 혼자 일하는 개발자보다 10배 빠릅니다. 두려워하는 대신, AI를 최대한 활용하는 방법을 배우세요.\n\n## 2. 시스템 설계 능력을 키워라\n\nAI가 코드를 쓸 수 있어도, **무엇을** 만들지, **어떻게** 설계할지는 아직 사람의 영역입니다. 데이터베이스 설계, 마이크로서비스 아키텍처, API 설계 등 시스템 레벨의 사고를 키우세요.\n\n## 3. 프롬프트 엔지니어링을 마스터하라\n\nAI에게 올바른 지시를 내리는 것은 핵심 스킬이 되었습니다. 명확한 컨텍스트, 구체적인 요구사항, 예시를 제공하는 능력이 중요합니다.\n\n## 4. AI 아키텍처를 이해하라\n\nRAG, Agent, MCP, Fine-tuning — 이 개념들을 이해하고 적용할 수 있어야 합니다. AI를 **사용**하는 것을 넘어, AI **시스템을 구축**하는 개발자가 되어야 합니다.\n\n## 5. 비즈니스 맥락을 이해하라\n\nAI가 기술적 구현을 담당할수록, 개발자는 비즈니스 문제를 이해하고 올바른 기술 솔루션을 제안하는 역할이 더 중요해집니다.\n\n## 6. 빠른 학습 능력을 유지하라\n\nAI 기술은 6개월마다 판도가 바뀝니다. 특정 기술에 집착하지 말고, **학습하는 방법을 학습**하세요.\n\n## 7. 인간적인 소프트 스킬을 키워라\n\n소통, 협업, 리더십, 창의성 — AI가 복제하기 가장 어려운 것들입니다. 팀을 이끌고, 고객과 소통하고, 창의적인 문제를 해결하는 능력을 키우세요.\n\n## 결론\n\nAI는 밥그릇을 빼앗아 가는 것이 아니라, **밥그릇의 크기를 키울 기회**를 줍니다. 두려워하지 말고, AI와 함께 성장하는 개발자가 되세요.',
  'AI가 개발자의 일자리를 위협하는 시대, 살아남기 위해 개발자가 갖춰야 할 7가지 핵심 역량을 정리합니다.',
  ARRAY['생존전략', 'AI시대', '개발자'],
  true,
  NOW() - INTERVAL ''2 days''
),
(
  'MCP, RAG, Agent: 2026년 개발자가 알아야 할 핵심 AI 개념',
  'ai-concepts-mcp-rag-agent',
  E'## 개요\n\n2026년 AI 개발 생태계에서 자주 등장하는 세 가지 핵심 개념을 정리합니다: **MCP**, **RAG**, **Agent**. 이 개념들을 이해하면 AI 시대의 개발자로서 훨씬 더 효과적으로 일할 수 있습니다.\n\n## MCP (Model Context Protocol)\n\nMCP는 Anthropic이 개발한 오픈 프로토콜로, AI 모델이 외부 도구와 데이터 소스에 표준화된 방식으로 접근할 수 있게 합니다.\n\n### 왜 중요한가?\n\n기존에는 AI 모델에 도구를 연결하려면 각 모델마다 다른 방식으로 구현해야 했습니다. MCP는 이를 표준화하여 **한 번 구현하면 여러 AI 모델에서 사용 가능**하게 만들었습니다.\n\n### 실용 예시\n\n```python\n# MCP 서버 예시\n@server.call_tool()\nasync def fetch_github_issues(repo: str) -> list:\n    issues = await github_client.get_issues(repo)\n    return [{\"title\": i.title, \"body\": i.body} for i in issues]\n```\n\n이렇게 구현한 MCP 서버는 Claude, GPT, Gemini 등 어떤 AI 모델에서도 사용할 수 있습니다.\n\n## RAG (Retrieval-Augmented Generation)\n\nRAG는 AI 모델이 응답을 생성할 때 외부 지식 베이스에서 관련 정보를 검색하여 활용하는 기법입니다.\n\n### 핵심 구조\n\n1. **문서 임베딩**: 문서를 벡터로 변환하여 저장\n2. **검색**: 질문과 유사한 문서를 벡터 유사도로 검색\n3. **생성**: 검색된 컨텍스트와 함께 AI가 응답 생성\n\n### 언제 사용하나?\n\n- 회사 내부 문서 Q&A\n- 최신 정보가 필요한 경우 (모델 학습 데이터 이후 정보)\n- 정확한 출처 인용이 필요한 경우\n\n## Agent (AI 에이전트)\n\nAgent는 목표를 달성하기 위해 여러 도구를 자율적으로 사용하는 AI 시스템입니다.\n\n### Agent의 핵심 요소\n\n- **Reasoning**: 상황을 분석하고 계획 수립\n- **Tool Use**: 검색, 코드 실행, API 호출 등\n- **Memory**: 이전 대화/작업 기억\n- **Self-correction**: 오류 감지 및 수정\n\n### 실용 패턴\n\n```typescript\n// Agent 루프 패턴\nwhile (!taskComplete) {\n  const thought = await llm.think(context)\n  const action = await llm.selectTool(thought)\n  const result = await executeTool(action)\n  context.addResult(result)\n  taskComplete = await llm.isComplete(context)\n}\n```\n\n## 세 개념의 관계\n\n```\n사용자 요청\n    ↓\nAgent (계획 & 실행)\n    ↓          ↓\n  RAG        MCP Tools\n(지식 검색)  (외부 도구)\n    ↓          ↓\n         LLM\n    (응답 생성)\n```\n\n## 결론\n\nMCP, RAG, Agent는 독립적인 개념이 아니라 함께 사용될 때 가장 강력합니다. 이 세 가지를 조합하면 진정한 의미의 AI 애플리케이션을 구축할 수 있습니다.\n\n개발자로서 이 개념들을 코드 레벨에서 이해하고 구현할 수 있는 것이 2026년 가장 중요한 경쟁력입니다.',
  'MCP, RAG, Agent — AI 개발 생태계의 핵심 개념 세 가지를 실전 코드와 함께 명쾌하게 정리합니다.',
  ARRAY['MCP', 'RAG', 'Agent', 'AI개념'],
  true,
  NOW() - INTERVAL ''1 day''
),
(
  '프롬프트 엔지니어링의 미래: 사라지는가, 진화하는가',
  'future-of-prompt-engineering',
  E'## 논쟁\n\n"프롬프트 엔지니어링은 곧 사라질 직업이다" vs "프롬프트 엔지니어링은 필수 역량이 된다"\n\n둘 다 맞습니다. 하지만 다른 의미에서.\n\n## 사라지는 것: 단순 프롬프트 작성\n\n"~해줘", "~를 작성해줘" 같은 단순한 지시는 AI가 알아서 잘 처리합니다. 특별한 기술이 필요 없습니다.\n\n## 진화하는 것: 시스템 레벨 프롬프트 설계\n\n복잡한 AI 시스템을 설계할 때는 여전히 깊은 이해가 필요합니다:\n\n### 1. 시스템 프롬프트 설계\n\n```\n당신은 [역할]입니다.\n컨텍스트: [상황]\n제약 조건: [규칙]\n출력 형식: [형식]\n```\n\n이런 구조적인 프롬프트 설계는 AI 제품의 품질을 좌우합니다.\n\n### 2. Chain-of-Thought 유도\n\n복잡한 추론이 필요한 작업에서 AI가 단계별로 생각하도록 유도하는 기법은 여전히 중요합니다.\n\n### 3. Few-shot Learning\n\n예시를 통해 AI에게 원하는 출력 패턴을 학습시키는 능력은 고급 기술입니다.\n\n## 결론: 개발자에게 필요한 건 다름\n\n프롬프트 "작성" 능력보다 AI **시스템 설계** 능력이 중요합니다. AI가 무엇을 잘하고 못하는지, 어디서 실패하는지를 이해하고, 그에 맞는 아키텍처를 설계하는 능력 — 이것이 2026년 개발자의 핵심 역량입니다.',
  '프롬프트 엔지니어링이 사라진다는 말이 맞을까요? 단순 작업은 자동화되지만, 시스템 레벨의 설계 능력은 오히려 더 중요해집니다.',
  ARRAY['프롬프트', 'AI시대', '개발자역량'],
  true,
  NOW()
)
ON CONFLICT (slug) DO NOTHING;
