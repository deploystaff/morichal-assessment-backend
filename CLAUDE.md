# Project Instructions

## Project Context - MorichalAI

> **ALWAYS READ**: See `DOCS/PROJECT-CONTEXT.md` for full project details.

**Platform**: MorichalAI - AI-Powered Trade & Supply Chain Platform
**Client**: Morichal (paper trading company)
**Live URL**: https://dev.morichalai.com
**Proposal**: https://morichal-proposal.deploystaff.com (pass: MorichalAI-Thierry2025)

### 10 AI Agents Being Delivered:
1. Email Intake Agent
2. Specification Extraction Agent
3. Supplier Matching Agent
4. Pricing & Margin Agent
5. Document Verification Agent
6. Compliance Agent
7. CRM Sync Agent (→ Full CRM Migration)
8. Logistics Milestone Agent (→ Orders Timeline)
9. Analytics & Internal Control Agent
10. Real-time Processing Orchestrator

### Current Progress: 82% Complete (41/50 items)
- Sprint 1: ✅ Complete
- Sprint 2: ✅ Complete
- Sprint 3: 🔄 In Progress (7/10)

---

## Mandatory Workflow

**CRITICAL: For EVERY user request, you MUST follow this workflow in order:**

### 1. Context Loading (Always First)
Run `/context` at the start of every session to load project state from DOCS/, TASKS/, and BUG/ folders.

### 2. Project Management
Run `/pm` for ALL coding tasks, feature requests, bug fixes, refactoring, or development work. The PM skill orchestrates the entire development workflow automatically.

### 3. Architecture Analysis
Run `/architect` to analyze project structure, patterns, and conventions before implementing any feature. Documents findings in DOCS/ARCHITECTURE.md.

### 4. UX/UI Design
Run `/uxui` for ANY frontend work, user interfaces, or user-facing features. Applies usability heuristics, accessibility standards, and UX best practices. Creates DOCS/UX.md.

### 5. Visual Design
Run `/designer` for frontend work, UI components, styling, or visual design. Creates DOCS/DESIGN.md with design specifications.

### 6. Documentation
Run `/document` at the end of tasks to update project documentation in the DOCS folder.

---

## Skill Execution Order

For any development request, execute skills in this order:

1. `/context` - Load current project state
2. `/pm` - Project management and task orchestration
3. `/architect` - Architecture analysis (if structural changes)
4. `/uxui` - UX/UI design (if user-facing)
5. `/designer` - Visual design (if frontend work)
6. `/document` - Document completed work

## Rules

- **Never skip the PM skill** for any coding task
- **Always run context** at session start
- **Always run uxui before designer** for frontend work
- **Always document** significant changes
- **Use /projects** for project lifecycle management (start, stop, register)
- **Always run /projects before publishing** - Check available ports before deploying any project live on this server to avoid port conflicts

## Customer-Facing Documents - DO NOT MODIFY

The following sites contain customer-facing documents that should NEVER be modified without explicit permission:

- **morichalai.deploystaff.com** - Client deliverables site
  - `deliverables.html` - Main deliverables index
  - `index.html` - Sprint 2 Assessment
  - All other HTML files on this domain (proposals, PRD, UAP, etc.)

These are polished, client-ready documents. Any changes require explicit user approval. Do NOT add links, modify content, or change styling without being asked.

## Folder Structure

Maintain these documentation folders:
- `DOCS/` - Project documentation
- `TASKS/` - Task tracking
- `BUG/` - Bug tracking and reports

## Quality Standards

- All frontend work must pass UX review before visual design
- All architecture decisions must be documented
- All completed tasks must be documented
- Follow existing patterns identified by architect skill

## Writing Style

- **Never use em-dashes (—)** - Use periods, colons, or commas instead
- **Avoid antagonistic sentence structures** - Don't use "not only X, but Y!" or "this isn't just X, it's Y!" patterns. State things directly and positively.
- **Never use "Most Popular", "Recommended", or similar badges** on pricing tiers or plan options. Let the content speak for itself.
