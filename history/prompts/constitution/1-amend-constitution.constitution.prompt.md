---
id: 1
title: amend-constitution
stage: constitution
date: 2025-12-29
surface: agent
model: Claude Sonnet 4.5
feature: none
branch: master
user: Claude Code
command: /sp.constitution
labels: [constitution, spec-driven-development, governance]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
---
## Prompt

```
/sp.constitution

Project: Spec-Driven Book with Embedded RAG Chatbot

Core principles:
- Spec-first development using Spec-Kit Plus
- Accuracy and zero hallucination
- Clarity for technical readers
- Reproducibility and traceability
- Modular, secure architecture

Key standards:
- Book authored with Claude Code and Docusaurus
- Deployed to GitHub Pages
- All content generated from specs
- RAG chatbot answers grounded only in book content
- Selected-text queries answered strictly from selected text
- OpenAI Agents + ChatKit SDK for agent orchestration
- FastAPI backend
- Neon Serverless Postgres for persistence
- Qdrant Cloud (Free Tier) for vector search

Constraints:
- Configurable chunking and top-k retrieval via specs
- Deterministic agent instructions
- No hard-coded secrets
- REST-compliant APIs
- Chatbot embedded in Docusaurus UI

Success criteria:
- Book publicly accessible on GitHub Pages
- Accurate chapter-level and selection-level Q&A
- No hallucinated responses
- Full project reproducible from spe
```

## Response snapshot

Updated the project constitution file (.specify/memory/constitution.md) with the specified principles and structure for the Spec-Driven Book with Embedded RAG Chatbot project. The constitution now includes:

- Core Principles: Spec-First Development, Clarity and Reproducibility, Modular Secure Architecture, REST-Compliant APIs, Accuracy and Zero Hallucination, and Book Content Generation
- Technology Stack section with OpenAI Agents, FastAPI, Neon Serverless Postgres, and Qdrant Cloud
- Success Criteria section with measurable outcomes
- Governance section with compliance requirements
- Version 1.0.0 with today's date as the amendment date

## Outcome

- ✅ Impact: Created initial project constitution with comprehensive principles and governance structure
- 🧪 Tests: No tests created in this update
- 📁 Files: Updated .specify/memory/constitution.md with new principles and structure
- 🔁 Next prompts: Plan and spec creation for the RAG chatbot feature
- 🧠 Reflection: Constitution provides clear governance framework for the Spec-Driven Book project

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Create feature specifications based on the new constitution