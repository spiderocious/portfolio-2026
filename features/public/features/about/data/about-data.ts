export const BIO_PARAGRAPHS = [
  "I'm Feranmi — a full-stack engineer based in Lagos, Nigeria. I like building things that sit at the intersection of infrastructure and product: fintech systems that move real money, developer tools that get out of the way, and AI-powered products that feel less like demos and more like tools you reach for.",
  "My default is to ship fast, then sharpen. I prefer boring tech that composes well — TypeScript, Next.js, Postgres, Supabase — and I reach for the fancy stuff only when it earns its keep. I care a lot about product surface area, performance budgets, and interfaces that don't make you feel stupid.",
  "When I'm not coding, I'm usually writing, reading, or playing with SVG and motion for fun. I take ideas seriously; I don't take myself that seriously.",
];

export const SKILL_GROUPS: Array<{ title: string; tags: string[] }> = [
  {
    title: "frontend",
    tags: ["TypeScript", "React", "Next.js", "Tailwind", "Motion", "SVG"],
  },
  {
    title: "backend",
    tags: ["Node", "tRPC", "GraphQL", "PostgreSQL", "Supabase", "Hono", "Python", "FastAPI"],
  },
  {
    title: "infrastructure",
    tags: ["Docker", "Linux", "CI/CD", "Cloudflare", "AWS", "Vercel", "Netlify"],
  },
  {
    title: "web3",
    tags: ["Solidity", "Foundry", "EVM", "Ethers.js", "Chainlink"],
  },
  {
    title: "tools",
    tags: ["Git", "Neovim", "Figma", "Bruno", "Postman", "Notion"],
  },
];

export const TIMELINE: Array<{ year: string; label: string; detail: string }> = [
  {
    year: "early",
    label: "first line of code",
    detail: "broke something, fixed it, was hooked.",
  },
  {
    year: "undergrad",
    label: "computer science",
    detail: "learned the fundamentals; built things on the side to stay sane.",
  },
  {
    year: "first job",
    label: "shipped to production",
    detail: "first real users, first real outages, first real feedback loop.",
  },
  {
    year: "fintech",
    label: "fintech deep-dive",
    detail: "systems that handle money. learned to love boring code and disciplined releases.",
  },
  {
    year: "now",
    label: "ai + web3",
    detail: "building tools and products at the edge of llms and on-chain infra.",
  },
];
