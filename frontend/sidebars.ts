import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  courseSidebar: [
    {
      type: "doc",
      id: "intro",
      label: "🚀 Course Introduction",
    },
    {
      type: "category",
      label: "📚 Module 1: AI Agents Fundamentals",
      items: [
        "module-1-fundamentals/what-are-ai-agents",
        "module-1-fundamentals/agent-architecture",
        "module-1-fundamentals/types-of-agents",
        "module-1-fundamentals/llm-basics",
      ],
    },
    {
      type: "category",
      label: "🛠️ Module 2: OpenAI Agents SDK",
      items: [
        "module-2-openai-sdk/setup-environment",
        "module-2-openai-sdk/first-agent",
        "module-2-openai-sdk/tools-and-functions",
        "module-2-openai-sdk/streaming-responses",
      ],
    },
    {
      type: "category",
      label: "🧠 Module 3: Advanced Agents",
      items: [
        "module-3-advanced/memory-systems",
        "module-3-advanced/multi-agent-patterns",
        "module-3-advanced/rag-integration",
        "module-3-advanced/agent-evaluation",
      ],
    },
    {
      type: "category",
      label: "🚀 Module 4: Real Projects",
      items: [
        "module-4-projects/customer-support-agent",
        "module-4-projects/research-agent",
        "module-4-projects/deployment-google-cloud",
        "module-4-projects/production-best-practices",
        "module-4-projects/chatgpt-apps-sdk",
      ],
    },
  ],
};

export default sidebars;
