# MorichalAI Project Context

> **IMPORTANT**: This document contains essential project context. Reference this for all MorichalAI-related work.

## Project Overview

- **Client**: Morichal (paper trading company)
- **Platform**: MorichalAI - AI-Powered Trade & Supply Chain Platform
- **Purpose**: Transform manual operations into intelligent automation
- **Live Platform**: https://dev.morichalai.com
- **Proposal Document**: https://morichal-proposal.deploystaff.com (pass: MorichalAI-Thierry2025)
- **Assessment Reports**: https://morichalai.deploystaff.com

---

## 10 AI Agents

The platform delivers **10 AI Agents** working 24/7:

### 1. Email Intake Agent
- Monitors incoming customer emails 24/7
- Extracts product specs with 95% confidence
- Creates draft orders in Zoho CRM automatically
- Routes uncertain items for human review

### 2. Specification Extraction Agent
- Extracts paper type, dimensions, grammage, brightness
- Converts between cm, inches, meters, gsm, lbs
- Validates specs against known product categories
- Flags impossible combinations for review

### 3. Supplier Matching Agent
- Matches specs against 45 supplier capabilities
- Filters by product type, width, grammage, region
- Ranks by on-time delivery %, quality score, response time
- Suggests optimal contact person at each mill

### 4. Pricing & Margin Agent
- Applies margin rules (7-14% by product/customer/size)
- Compares quotes against historical pricing
- Flags outliers (>15% deviation from market)
- Provides profitability forecasts

### 5. Document Verification Agent
- OCR extraction from invoices, packing lists, BLs, certificates
- Cross-reference all documents for discrepancies
- Detects quantity mismatches, amount errors, date issues
- Achieves 92-95% extraction confidence

### 6. Compliance Agent
- Monitors document completeness per destination country (13 countries)
- Tracks certificate types (origin, quality, phytosanitary)
- Validates European preferential origin for duty-free
- Alerts 48hrs before vessel arrival if docs incomplete

### 7. CRM Sync Agent
- Bidirectional sync with Zoho CRM
- Updates order status in real-time across 10+ states
- Syncs documents to appropriate CRM records
- Maintains contact database currency
- **Note**: Upgraded to "Full CRM Migration" in Sprint 1

### 8. Logistics Milestone Agent
- Tracks 4 phases: Production → Origin Port → Transit → Destination
- Monitors milestone completion vs. expected timelines
- Triggers delay alerts (5+ days behind schedule)
- Provides real-time dashboard visibility
- **Note**: Upgraded to "Orders Timeline" in Sprint 3

### 9. Analytics & Internal Control Agent
- Real-time KPI dashboards (AI accuracy, cycle times)
- Supplier performance scorecards
- Exception tracking and reporting
- Complete audit trail for compliance

### 10. Real-time Processing Orchestrator
- Central coordination engine for all agents
- Confidence-based routing (>93% auto, <85% human)
- Parallel processing when agents can work simultaneously
- Real-time queue management and bottleneck alerts

---

## Sprint Progress

### Sprint 1: Core Platform Foundation (Completed)
- Email Intake Agent ✓
- Specification Extraction Agent ✓
- Supplier Matching Agent ✓
- Supplier Management ✓
- CRM Sync Agent → Upgraded to Full CRM Migration ✓
- RFQ Management ✓
- Realtime API Orchestrator ✓
- Negotiations ✓
- Order Management ✓
- Quote Management ✓
- User Management ✓
- Role Management ✓
- Purchase Order / Split PO ✓
- Email Tracking ✓
- DevOps Environments ✓
- OCR ✓

### Sprint 2: Document Verification & Compliance Core (Completed)
- Document Verification Agent ✓
- Compliance Agent ✓
- Pricing and Margin Agent ✓
- Document Generation ✓
- Additional features ✓

### Sprint 3: Analytics & Logistics (In Progress)
- Logistics Milestone Agent → Upgraded to Orders Timeline ✓
- Analytics & Internal Control Agent (In Progress)
- Alert Management ✓
- Platform Settings ✓
- Report Generator (In Progress)
- Realtime Orchestrator ✓
- Template Management ✓
- Country By Country Doc Generation (In Progress)
- Documents Comparison ✓

---

## Pricing & Engagement (Original Proposal)

### Development Tiers
| Tier | Monthly | Duration | Total | Hours/Month |
|------|---------|----------|-------|-------------|
| Foundation | €14,950 | 8 months | €119,600 | 160 |
| Accelerated | €22,500 | 5 months | €112,500 | 320 |
| Executive | €34,950 | 3 months | €104,850 | 480 |

### Infrastructure Costs (~€1,380/month)
| Service | Cost |
|---------|------|
| Digital Ocean | €450/mo |
| Managed DB | €100/mo |
| New Relic (monitoring) | €180/mo |
| AI Models | €450/mo |
| API Costs (Zoho, Shipping, etc.) | €200/mo |

---

## Key Business Metrics

- **Overall Project Completion**: 82% (41/50 items)
- **Target Confidence Levels**:
  - Email extraction: 95%
  - Document verification: 92-95%
  - Auto-routing threshold: >93%
  - Human review threshold: <85%

---

## Technical Stack

- **CRM**: Zoho CRM (fully migrated into platform)
- **OCR**: Custom-trained engine for trade documents
- **Deployment**: Production at dev.morichalai.com
- **Document Types**: Invoices, Packing Lists, Bills of Lading, Certificates

---

## Contacts

- **Provider**: DeployStaff.com
- **Contact**: rafael@deploystaff.com
