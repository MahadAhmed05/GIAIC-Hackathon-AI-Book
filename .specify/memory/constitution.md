<!-- Sync Impact Report:
Version change: N/A → 1.0.0
Added sections: All principles and sections based on user input
Removed sections: None (new constitution)
Templates requiring updates:
- .specify/templates/plan-template.md ⚠ pending
- .specify/templates/spec-template.md ⚠ pending
- .specify/templates/tasks-template.md ⚠ pending
- .specify/templates/commands/*.md ⚠ pending
Follow-up TODOs:
- RATIFICATION_DATE: Need to determine original adoption date
-->
# Spec-Driven Book with Embedded RAG Chatbot Constitution

## Core Principles

### Spec-First Development
Spec-first development using Spec-Kit Plus with accuracy and zero hallucination. All content must be generated from specifications, ensuring deterministic and traceable development processes.

### Clarity and Reproducibility
Clarity for technical readers and reproducibility and traceability. All development artifacts must be clear, understandable, and reproducible by others following the same specifications.

### Modular, Secure Architecture
Modular, secure architecture with deterministic agent instructions and no hard-coded secrets. Systems must be designed with security in mind, using proper secret management and modular components.

### REST-Compliant APIs
REST-compliant APIs with configurable chunking and top-k retrieval via specs. All APIs must follow REST principles and be configurable through specification files.

### Accuracy and Zero Hallucination
RAG chatbot answers grounded only in book content with no hallucinated responses. The chatbot must provide accurate answers strictly based on the book content without generating false information.

### Book Content Generation
All book content generated from specs using Claude Code and Docusaurus, deployed to GitHub Pages. The book must be authored through specification-driven processes and deployed to a publicly accessible platform.

## Technology Stack

OpenAI Agents + ChatKit SDK for agent orchestration, FastAPI backend, Neon Serverless Postgres for persistence, Qdrant Cloud (Free Tier) for vector search. Selected technologies must support the core functionality of the RAG chatbot and book hosting requirements.

## Success Criteria

Book publicly accessible on GitHub Pages, accurate chapter-level and selection-level Q&A, full project reproducible from specs. The project is successful when the book is accessible, the Q&A functionality works accurately at both chapter and selection levels, and the entire project can be reproduced from specifications.

## Governance

All development follows Spec-Driven Development practices with constitution compliance required for all changes. Any modifications to the codebase must align with these principles, and deviations require explicit approval and documentation.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): Initial constitution ratification date | **Last Amended**: 2025-12-29